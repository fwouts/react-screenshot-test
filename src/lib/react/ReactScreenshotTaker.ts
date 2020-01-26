import { ScreenshotRenderer, Viewport } from "../screenshot-renderer/api";
import { SCREENSHOT_MODE } from "../screenshot-server/config";
import { NodeDescription, ReactComponentServer } from "./ReactComponentServer";

/**
 * ReactScreenshotTaker renders screenshots of React components.
 */
export class ReactScreenshotTaker {
  constructor(
    private readonly componentServer: ReactComponentServer,
    private readonly screenshotRenderer: ScreenshotRenderer
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
        SCREENSHOT_MODE === "docker"
          ? `http://host.docker.internal:${port}${path}`
          : `http://localhost:${port}${path}`;
      return viewport
        ? this.screenshotRenderer.render(node.name, url, viewport)
        : this.screenshotRenderer.render(node.name, url);
    });
  }
}
