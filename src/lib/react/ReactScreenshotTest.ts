import { toMatchImageSnapshot } from "jest-image-snapshot";
import { Viewport } from "../screenshot-renderer/api";
import { HttpScreenshotRenderer } from "../screenshot-renderer/HttpScreenshotRenderer";
import { PercyScreenshotRenderer } from "../screenshot-renderer/PercyScreenshotRenderer";
import {
  SCREENSHOT_MODE,
  SCREENSHOT_SERVER_PORT
} from "../screenshot-server/config";
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

  private readonly _remoteStylesheetUrls: string[] = [];

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
        throw new Error("Please call .run()");
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
      throw new Error("Cannot add a viewport after running.");
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
      throw new Error("Cannot add a shot after running.");
    }
    if (this._shots[shotName]) {
      throw new Error(`Shot "${shotName}" is declared more than once`);
    }
    this._shots[shotName] = component;
    return this;
  }

  remoteStylesheet(stylesheetUrl: string) {
    this._remoteStylesheetUrls.push(stylesheetUrl);
    return this;
  }

  /**
   * Runs the actual test (delegating to Jest).
   */
  run() {
    if (this.ran) {
      throw new Error("Cannot run more than once.");
    }
    this.ran = true;
    if (Object.keys(this._viewports).length === 0) {
      throw new Error("Please define viewports with .viewport()");
    }
    if (Object.keys(this._shots).length === 0) {
      throw new Error("Please define shots with .shoot()");
    }

    describe(this.componentName, () => {
      expect.extend({ toMatchImageSnapshot });
      const screenshotRenderer =
        SCREENSHOT_MODE === "percy"
          ? new PercyScreenshotRenderer()
          : new HttpScreenshotRenderer(
              `http://localhost:${SCREENSHOT_SERVER_PORT}`
            );
      const screenshotTaker = new ReactScreenshotTaker(
        new ReactComponentServer(),
        screenshotRenderer
      );

      beforeAll(async () => {
        await screenshotTaker.start();
      });

      afterAll(async () => {
        await screenshotTaker.stop();
      });

      for (const [viewportName, viewport] of Object.entries(this._viewports)) {
        describe(viewportName, () => {
          for (const [shotName, shot] of Object.entries(this._shots)) {
            it(shotName, async () => {
              const name = `${this.componentName} - ${viewportName} - ${shotName}`;
              const screenshot = await screenshotTaker.render(
                {
                  name,
                  reactNode: shot,
                  remoteStylesheetUrls: this._remoteStylesheetUrls
                },
                viewport
              );
              if (screenshot) {
                expect(screenshot).toMatchImageSnapshot({
                  customSnapshotIdentifier: () => name
                });
              }
            });
          }
        });
      }
    });
  }
}
