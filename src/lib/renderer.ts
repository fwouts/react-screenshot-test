import React from "react";
import { ReactComponentServer } from "./component-server";
import { ScreenshotRenderer, Viewport } from "./screenshot-renderer/api";
import { ServerRenderer } from "./screenshot-renderer/server-renderer";
import {
  SCREENSHOT_MODE,
  SCREENSHOT_SERVER_PORT
} from "./screenshot-server/config";

/**
 * ReactScreenshotRenderer renders screenshots of React components.
 */
export class ReactScreenshotRenderer {
  constructor(
    private readonly componentServer = new ReactComponentServer(),
    private readonly screenshotRenderer: ScreenshotRenderer = new ServerRenderer(
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

  async render(node: React.ReactNode, viewport?: Viewport) {
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
