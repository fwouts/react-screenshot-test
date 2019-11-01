import isDocker from "is-docker";
import React from "react";
import { ReactComponentServer } from "./component-server";
import { ScreenshotRenderer } from "./screenshot-renderer/api";
import { DockerRenderer } from "./screenshot-renderer/docker-renderer";
import { LocalChromeRenderer } from "./screenshot-renderer/local-chrome-renderer";

export class ReactScreenshotRenderer {
  private readonly server: ReactComponentServer;
  private readonly browser: ScreenshotRenderer;
  private readonly mode: "local" | "docker";

  constructor(
    options: {
      port?: number;
      mode?: "default" | "local" | "docker";
    } = {}
  ) {
    this.server = new ReactComponentServer(options.port || 3037);
    switch (options.mode || "default") {
      case "local":
        this.mode = "local";
        break;
      case "docker":
        this.mode = "docker";
        break;
      default:
        this.mode = isDocker() ? "local" : "docker";
    }
    this.browser =
      this.mode === "local" ? new LocalChromeRenderer() : new DockerRenderer();
  }

  async start() {
    await Promise.all([this.server.start(), this.browser.start()]);
  }

  async stop() {
    await Promise.all([this.server.stop(), this.browser.stop()]);
  }

  async render(node: React.ReactNode) {
    return this.server.serve(node, async (port, path) => {
      const url =
        this.mode === "local"
          ? `http://localhost:${port}${path}`
          : `http://host.docker.internal:${port}${path}`;
      return this.browser.render(url);
    });
  }
}
