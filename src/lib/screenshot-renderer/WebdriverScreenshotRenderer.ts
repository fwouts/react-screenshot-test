import { ChildProcess } from "child_process";
import selenium from "selenium-standalone";
import * as webdriverio from "webdriverio";
import { ScreenshotRenderer, Viewport } from "./api";
import { debugLogger } from "../logger";

const logDebug = debugLogger("SeleniumScreenshotRenderer");

/**
 * A screenshot renderer that uses a browser controlled by Selenium to take
 * screenshots on the current platform.
 */
export class SeleniumScreenshotRenderer implements ScreenshotRenderer {
  private seleniumProcess: ChildProcess | null = null;

  private browser: WebdriverIOAsync.BrowserObject | null = null;

  constructor(private readonly capabilities: WebDriver.DesiredCapabilities) {}

  async start() {
    logDebug(`start() initiated.`);

    logDebug(`Ensuring that Selenium is installed.`);
    await new Promise((resolve) => {
      selenium.install(resolve);
    });
    logDebug(`Selenium is installed.`);

    logDebug(`Starting Selenium server.`);
    this.seleniumProcess = await new Promise((resolve, reject) =>
      selenium.start((error, childProcess) => {
        if (error) {
          reject(error);
        } else {
          resolve(childProcess);
        }
      })
    );
    logDebug(`Selenium server started.`);

    logDebug(`Launching browser.`);
    this.browser = await webdriverio.remote({
      capabilities: this.capabilities,
      logLevel: "warn",
    });
    logDebug(`Browser launched.`);
  }

  async stop() {
    logDebug(`stop() initiated.`);

    if (!this.browser) {
      throw new Error(
        "Browser is not open! Please make sure that start() was called."
      );
    }
    await this.browser.closeWindow();
    if (this.seleniumProcess) {
      // Kill Selenium server.
      await this.seleniumProcess.kill();
    }
  }

  async render(name: string, url: string, viewport?: Viewport) {
    logDebug(`render() invoked with (name = ${name}, url = ${url}).`);

    if (!this.browser) {
      throw new Error("Please call start() once before render().");
    }
    if (viewport) {
      this.browser.setWindowSize(
        viewport.isLandscape ? viewport.height : viewport.width,
        viewport.isLandscape ? viewport.width : viewport.height
      );
    }
    await this.browser.navigateTo(url);
    return Buffer.from(await this.browser.takeScreenshot(), "base64");
  }
}
