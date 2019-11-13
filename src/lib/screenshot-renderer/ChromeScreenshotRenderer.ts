import { ScreenshotRenderer, Viewport } from "./api";

type Browser = import("puppeteer").Browser;

/**
 * A screenshot renderer that uses Chrome (via Puppeteer) to take screenshots on
 * the current platform.
 */
export class ChromeScreenshotRenderer implements ScreenshotRenderer {
  private browser: Browser | null = null;

  async start() {
    // Puppeteer is not a dependency, because most users would likely use Docker
    // which is the default behaviour.
    let puppeteer;
    try {
      puppeteer = await import("puppeteer");
    } catch (e) {
      throw new Error(
        `Please install the 'puppeteer' package:\n\nUsing NPM:\n$ npm install -D puppeteer\n\nUsing Yarn:\n$ yarn add -D puppeteer`
      );
    }
    this.browser = await puppeteer.default.launch({
      args: ["--no-sandbox"]
    });
  }

  async stop() {
    if (!this.browser) {
      throw new Error(
        `Browser is not open! Please make sure that start() was called.`
      );
    }
    await this.browser.close();
  }

  async render(url: string, viewport?: Viewport) {
    if (!this.browser) {
      throw new Error(`Please call start() once before render().`);
    }
    const page = await this.browser.newPage();
    if (viewport) {
      await page.setViewport(viewport);
    }
    await page.goto(url);
    const screenshot = await page.screenshot({
      encoding: "binary"
    });
    await page.close();
    return screenshot;
  }
}
