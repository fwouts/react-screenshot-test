import axios from "axios";
import { Viewport } from "puppeteer";
import { ScreenshotRenderer } from "./api";

/**
 * A screenshot renderer that leverages a screenshot server (not necessarily
 * running on the same machine) to take screenshots.
 */
export class ServerRenderer implements ScreenshotRenderer {
  constructor(private readonly baseUrl: string) {}

  async start() {
    // Do nothing.
  }

  async stop() {
    // Do nothing.
  }

  async render(url: string, viewport?: Viewport) {
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
  }
}
