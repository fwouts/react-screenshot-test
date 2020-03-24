import { Browser, launchChrome } from "../browser/chrome";
import { ScreenshotRenderer, Viewport } from "./api";

/**
 * A screenshot renderer that uses Chrome (via Puppeteer) to take screenshots on
 * the current platform.
 */
export class PuppeteerScreenshotRenderer implements ScreenshotRenderer {
  private browser: Browser | null = null;

  async start() {
    this.browser = await launchChrome();
  }

  async stop() {
    if (!this.browser) {
      throw new Error(
        "Browser is not open! Please make sure that start() was called."
      );
    }
    await this.browser.close();
  }

  async render(_name: string, url: string, viewport?: Viewport) {
    if (!this.browser) {
      throw new Error("Please call start() once before render().");
    }
    const page = await this.browser.newPage();
    if (viewport) {
      await page.setViewport(viewport);
    }
    await page.goto(url);
    const screenshot = await page.screenshot({
      encoding: "binary",
    });
    await page.close();
    return screenshot;
  }
}
