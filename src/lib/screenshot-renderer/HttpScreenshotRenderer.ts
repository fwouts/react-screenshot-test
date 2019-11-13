import axios from "axios";
import chalk from "chalk";
import { Viewport } from "puppeteer";
import { ScreenshotRenderer } from "./api";

/**
 * A screenshot renderer that leverages a screenshot server (not necessarily
 * running on the same machine) to take screenshots.
 */
export class HttpScreenshotRenderer implements ScreenshotRenderer {
  constructor(private readonly baseUrl: string) {}

  async start() {
    // Do nothing.
  }

  async stop() {
    // Do nothing.
  }

  async render(url: string, viewport?: Viewport) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/render`,
        {
          url,
          viewport
        },
        {
          responseType: "arraybuffer"
        }
      );
      return response.data;
    } catch (e) {
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
