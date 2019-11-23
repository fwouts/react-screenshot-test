import PercyScript from "@percy/script";
import { ReactComponentServer } from "./ReactComponentServer";

/**
 * ReactScreenshotPercy is a builder for screenshot tests with Percy.
 *
 * Example usage:
 * ```
 * ReactScreenshotPercy.create("Using runner")
 *     .width(320)
 *     .width(1024)
 *     .shoot("with title", <MyComponent title="Hello, World!" />)
 *     .shoot("without title", <MyComponent title={null} />)
 *     .run();
 * ```
 */
export class ReactScreenshotPercy {
  private readonly _widths: number[] = [];
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
   * Adds a set of widths to the screenshot test.
   */
  widths(widths: number[]) {
    for (const width of widths) {
      this.width(width);
    }
    return this;
  }

  /**
   * Adds a single width to the screenshot test.
   */
  width(width: number) {
    if (this.ran) {
      throw new Error(`Cannot add a width after running.`);
    }
    this._widths.push(width);
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
    if (Object.keys(this._shots).length === 0) {
      throw new Error(`Please define shots with .shoot()`);
    }

    const componentServer = new ReactComponentServer();
    const startComponentServer = componentServer.start();

    const pendingRuns: Array<Promise<void>> = [];
    for (const [shotName, shot] of Object.entries(this._shots)) {
      pendingRuns.push(
        new Promise<void>(resolve => {
          PercyScript.run(async (page, percySnapshot) => {
            await startComponentServer;
            await componentServer.serve(shot, async (port, path) => {
              await page.goto(`http://localhost:${port}${path}`);
              await percySnapshot(`${this.componentName} - ${shotName}`, {
                widths: this._widths
              });
            });
            resolve();
          });
        })
      );
    }
    Promise.all(pendingRuns).then(() => componentServer.stop());
  }
}
