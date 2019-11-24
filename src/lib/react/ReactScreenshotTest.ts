import { toMatchImageSnapshot } from "jest-image-snapshot";
import { Browser, launchChrome } from "../browser/chrome";
import { Viewport } from "../screenshot-renderer/api";
import { SCREENSHOT_MODE } from "../screenshot-server/config";
import { ReactComponentServer } from "./ReactComponentServer";
import { ReactScreenshotTaker } from "./ReactScreenshotTaker";

/**
 * ReactScreenshotTest is a builder for screenshot tests.
 *
 * Example usage:
 * ```
 * ReactScreenshotTest.create("Using runner")
 *     .viewports(VIEWPORTS)
 *     .shoot("with title", <MyComponent title="Hello, World!" />)
 *     .shoot("without title", <MyComponent title={null} />)
 *     .run();
 * ```
 */
export class ReactScreenshotTest {
  private readonly _viewports: {
    [name: string]: Viewport;
  } = {};
  private readonly _shots: {
    [name: string]: React.ReactNode;
  } = {};
  private ran = false;

  /**
   * Creates a screenshot test.
   */
  static create(componentName: string) {
    return new this(componentName);
  }

  private constructor(private readonly componentName: string) {
    setImmediate(() => {
      if (!this.ran) {
        throw new Error(`Please call .run()`);
      }
    });
  }

  /**
   * Adds a set of viewports to the screenshot test.
   */
  viewports(viewports: { [name: string]: Viewport }) {
    for (const [name, viewport] of Object.entries(viewports)) {
      this.viewport(name, viewport);
    }
    return this;
  }

  /**
   * Adds a single viewport to the screenshot test.
   */
  viewport(viewportName: string, viewport: Viewport) {
    if (this.ran) {
      throw new Error(`Cannot add a viewport after running.`);
    }
    if (this._viewports[viewportName]) {
      throw new Error(`Viewport "${viewportName}" is declared more than once`);
    }
    this._viewports[viewportName] = viewport;
    return this;
  }

  /**
   * Adds a specific shot of a component to the screenshot test.
   */
  shoot(shotName: string, component: React.ReactNode) {
    if (this.ran) {
      throw new Error(`Cannot add a shot after running.`);
    }
    if (this._shots[shotName]) {
      throw new Error(`Shot "${shotName}" is declared more than once`);
    }
    this._shots[shotName] = component;
    return this;
  }

  /**
   * Runs the actual test (delegating to Jest).
   */
  run() {
    if (this.ran) {
      throw new Error(`Cannot run more than once.`);
    }
    this.ran = true;
    if (Object.keys(this._viewports).length === 0) {
      throw new Error(`Please define viewports with .viewport()`);
    }
    if (Object.keys(this._shots).length === 0) {
      throw new Error(`Please define shots with .shoot()`);
    }

    describe(this.componentName, () => {
      if (SCREENSHOT_MODE === "percy") {
        const componentServer = new ReactComponentServer();
        let browser: Browser;

        beforeAll(async () => {
          await componentServer.start();
          browser = await launchChrome();
        });

        afterAll(async () => {
          await componentServer.stop();
          await browser.close();
        });

        for (const [shotName, shot] of Object.entries(this._shots)) {
          it(shotName, async () => {
            const page = await browser.newPage();
            await componentServer.serve(shot, async (port, path) => {
              await page.goto(`http://localhost:${port}${path}`);
              let percy: typeof import("@percy/puppeteer");
              try {
                percy = await import("@percy/puppeteer");
              } catch (e) {
                throw new Error(
                  `Please install the '@percy/puppeteer' package:
            
            Using NPM:
            $ npm install -D @percy/puppeteer
            
            Using Yarn:
            $ yarn add -D @percy/puppeteer`
                );
              }
              await percy.percySnapshot(
                page,
                `${this.componentName} - ${shotName}`,
                {
                  widths: Object.values(this._viewports).map(
                    viewport =>
                      viewport.width / (viewport.deviceScaleFactor || 1)
                  )
                }
              );
            });
          });
        }
      } else {
        expect.extend({ toMatchImageSnapshot });
        const renderer = new ReactScreenshotTaker();

        beforeAll(async () => {
          await renderer.start();
        });

        afterAll(async () => {
          await renderer.stop();
        });

        for (const [viewportName, viewport] of Object.entries(
          this._viewports
        )) {
          describe(viewportName, () => {
            for (const [shotName, shot] of Object.entries(this._shots)) {
              it(shotName, async () => {
                expect(
                  await renderer.render(shot, viewport)
                ).toMatchImageSnapshot({
                  customSnapshotIdentifier: () =>
                    `${this.componentName} - ${viewportName} - ${shotName}`
                });
              });
            }
          });
        }
      }
    });
  }
}
