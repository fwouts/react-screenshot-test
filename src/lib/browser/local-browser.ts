import puppeteer from "puppeteer";
import { Browser } from "./api";

export class LocalBrowser implements Browser {
  private browser: puppeteer.Browser | null = null;

  async start() {
    this.browser = await puppeteer.launch({
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

  async render(url: string): Promise<string> {
    if (!this.browser) {
      throw new Error(`Please call start() once before render().`);
    }
    const page = await this.browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot();
    await page.close();
    return screenshot;
  }
}
