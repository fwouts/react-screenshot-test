import { Viewport } from "puppeteer";
import { Browser, launchChrome } from "../browser/chrome";
import { debugLogger } from "../logger";
import { ScreenshotRenderer } from "./api";

const logDebug = debugLogger("PercyScreenshotRenderer");

/**
 * A screenshot renderer that uses Percy to take and compare screenshots.
 */
export class PercyScreenshotRenderer implements ScreenshotRenderer {
  private browser: Browser | null = null;

  constructor() {}

  async start() {
    logDebug(`start() initiated.`);

    logDebug(`Launching Chrome browser.`);
    this.browser = await launchChrome();
    logDebug(`Chrome browser launched.`);
  }

  async stop() {
    logDebug(`stop() initiated.`);

    if (this.browser) {
      logDebug(`Closing Chrome browser.`);
      await this.browser.close();
      logDebug(`Chrome browser closed.`);
    } else {
      logDebug(`No Chrome browser found.`);
    }
  }

  async render(name: string, url: string, viewport?: Viewport) {
    logDebug(`render() invoked with (name = ${name}, url = ${url}).`);

    if (!this.browser) {
      throw new Error("Browser was not launched successfully.");
    }
    const page = await this.browser.newPage();
    await page.goto(url);
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
      name,
      viewport && {
        widths: [viewport.width / (viewport.deviceScaleFactor || 1)],
      }
    );
  }
}
