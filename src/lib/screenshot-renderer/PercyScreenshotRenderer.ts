import { Viewport } from "puppeteer";
import { Browser, launchChrome } from "../browser/chrome";
import { ScreenshotRenderer } from "./api";

/**
 * A screenshot renderer that uses Percy to take and compare screenshots.
 */
export class PercyScreenshotRenderer implements ScreenshotRenderer {
  private browser: Browser | null = null;

  constructor() {}

  async start() {
    this.browser = await launchChrome();
  }

  async stop() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async render(name: string, url: string, viewport?: Viewport) {
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
    return null;
  }
}
