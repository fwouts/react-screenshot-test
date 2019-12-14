import { ScreenshotRenderer, Viewport } from "../screenshot-renderer/api";
import { HttpScreenshotRenderer } from "../screenshot-renderer/HttpScreenshotRenderer";
import {
  SCREENSHOT_MODE,
  SCREENSHOT_SERVER_PORT
} from "../screenshot-server/config";
import { NodeDescription, ReactComponentServer } from "./ReactComponentServer";

/**
 * ReactScreenshotTaker renders screenshots of React components.
 */
export class ReactScreenshotTaker {
  constructor(
    private readonly componentServer = new ReactComponentServer(),
    private readonly screenshotRenderer: ScreenshotRenderer = new HttpScreenshotRenderer(
      `http://localhost:${SCREENSHOT_SERVER_PORT}`
    )
  ) {}

  async start() {
    await Promise.all([
      this.componentServer.start(),
      this.screenshotRenderer.start()
    ]);
  }

  async stop() {
    await Promise.all([
      this.componentServer.stop(),
      this.screenshotRenderer.stop()
    ]);
  }

  async render(node: NodeDescription, viewport?: Viewport) {
    return this.componentServer.serve(node, async (port, path) => {
      const url =
        SCREENSHOT_MODE === "local"
          ? `http://localhost:${port}${path}`
          : `http://host.docker.internal:${port}${path}`;
      return viewport
        ? this.screenshotRenderer.render(url, viewport)
        : this.screenshotRenderer.render(url);
    });
  }
}
