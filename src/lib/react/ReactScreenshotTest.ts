import callsites from "callsites";
import chalk from "chalk";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { dirname, join, sep } from "path";
import { Viewport } from "../screenshot-renderer/api";
import {
  getScreenshotPrefix,
  SCREENSHOT_MODE,
  SCREENSHOT_SERVER_URL,
} from "../screenshot-server/config";
import { ReactComponentServer } from "./ReactComponentServer";
import { debugLogger } from "../logger";
import { fetch } from "../network/fetch";

const logDebug = debugLogger("ReactScreenshotTest");

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

    const componentServer = new ReactComponentServer();

    expect.extend({ toMatchImageSnapshot });

    beforeAll(async () => {
      await componentServer.start();
    });

    afterAll(async () => {
      await componentServer.stop();
    });

    const testFilename = callsites()[1].getFileName()!;
    const snapshotsDir = dirname(testFilename);

    const prefix = getScreenshotPrefix();
    // jest-image-snapshot doesn't support a snapshot identifier such as
    // "abc/def". Instead, we need some logic to look for a directory
    // separator (using `sep`) and set the subdirectory to "abc", only using
    // "def" as the identifier prefix.
    let subdirectory = "";
    let filenamePrefix = "";
    if (prefix.indexOf(sep) > -1) {
      [subdirectory, filenamePrefix] = prefix.split(sep, 2);
    } else {
      filenamePrefix = prefix;
    }

    describe(this.componentName, () => {
      for (const [viewportName, viewport] of Object.entries(this._viewports)) {
        describe(viewportName, () => {
          for (const [shotName, shot] of Object.entries(this._shots)) {
            it(shotName, async () => {
              const name = `${this.componentName} - ${viewportName} - ${shotName}`;

              logDebug(
                `Requesting component server to generate screenshot: ${name}`
              );
              const screenshot = await componentServer.serve(
                {
                  name,
                  reactNode: shot,
                  remoteStylesheetUrls: this._remoteStylesheetUrls,
                },
                async (port, path) => {
                  const url =
                    SCREENSHOT_MODE === "docker"
                      ? `http://host.docker.internal:${port}${path}`
                      : `http://localhost:${port}${path}`;
                  return this.render(name, url, viewport);
                }
              );
              logDebug(`Screenshot generated.`);

              if (screenshot) {
                logDebug(`Comparing screenshot.`);
                expect(screenshot).toMatchImageSnapshot({
                  customSnapshotsDir: join(
                    snapshotsDir,
                    "__screenshots__",
                    this.componentName,
                    subdirectory
                  ),
                  customSnapshotIdentifier: `${filenamePrefix}${viewportName} - ${shotName}`,
                });
                logDebug(`Screenshot compared.`);
              } else {
                logDebug(`Skipping screenshot matching.`);
              }
            });
          }
        });
      }
    });
  }

  private async render(name: string, url: string, viewport: Viewport) {
    try {
      logDebug(
        `Initiating request to screenshot server at ${SCREENSHOT_SERVER_URL}.`
      );
      const response = await fetch(`${SCREENSHOT_SERVER_URL}/render`, "POST", {
        name,
        url,
        viewport,
      });
      logDebug(`Response received with status code ${response.status}.`);
      if (response.status === 204) {
        return null;
      }
      return response.body;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        chalk.red(
          `Unable to reach screenshot server. Please make sure that your Jest configuration contains the following:

{
  "globalSetup": "react-screenshot-test/global-setup",
  "globalTeardown": "react-screenshot-test/global-teardown"
}
`
        )
      );
      throw e;
    }
  }
}
