import bodyParser from "body-parser";
import express, { Express } from "express";
import { Server } from "net";
import { ScreenshotRenderer } from "../screenshot-renderer/api";
import { ScreenshotServer } from "./api";
import { debugLogger } from "../logger";

const logDebug = debugLogger("LocalScreenshotServer");

/**
 * A local server with a /render POST endpoint, which takes a payload such as
 *
 * ```json
 * {
 *   "url": "https://www.google.com"
 * }
 * ```
 *
 * and returns a PNG screenshot of the URL.
 */
export class LocalScreenshotServer implements ScreenshotServer {
  private readonly app: Express;

  private server: Server | null = null;

  constructor(
    private readonly renderer: ScreenshotRenderer,
    private readonly port: number
  ) {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.post("/render", async (req, res) => {
      const { name, url, viewport } = req.body;
      const screenshot = await (viewport
        ? this.renderer.render(name, url, viewport)
        : this.renderer.render(name, url));
      if (screenshot) {
        res.contentType("image/png");
        res.end(screenshot);
      } else {
        res.status(204);
        res.end();
      }
    });
  }

  async start() {
    logDebug(`start() initiated.`);

    logDebug(`Starting renderer.`);
    await this.renderer.start();
    logDebug(`Renderer started.`);

    logDebug(`Attempting to listen on port ${this.port}.`);
    await new Promise((resolve) => {
      this.server = this.app.listen(this.port, resolve);
    });
    logDebug(`Successfully listening on port ${this.port}.`);
  }

  async stop() {
    logDebug(`stop() initiated.`);

    const { server } = this;
    if (!server) {
      throw new Error(
        "Server is not running! Please make sure that start() was called."
      );
    }

    logDebug(`Attempting to shutdown server.`);
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    logDebug(`Successfully shutdown server.`);

    logDebug(`Stopping renderer.`);
    await this.renderer.stop();
    logDebug(`Renderer stopped.`);
  }
}
