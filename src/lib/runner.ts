import { toMatchImageSnapshot } from "jest-image-snapshot";
import { ReactScreenshotRenderer } from "./renderer";
import { Viewport } from "./screenshot-renderer/api";

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
      throw new Error(`Please define viewports with .addViewport()`);
    }
    if (Object.keys(this._shots).length === 0) {
      throw new Error(`Please define shots with .shoot()`);
    }
    expect.extend({ toMatchImageSnapshot });
    describe(this.componentName, () => {
      const renderer = new ReactScreenshotRenderer();

      beforeAll(async () => {
        await renderer.start();
      });

      afterAll(async () => {
        await renderer.stop();
      });

      for (const [viewportName, viewport] of Object.entries(this._viewports)) {
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
    });
  }
}
