import isDocker from "is-docker";
import React from "react";
import { Browser } from "./browser/api";
import { DockerBrowser } from "./browser/docker-browser";
import { LocalBrowser } from "./browser/local-browser";
import { ScreenshotServer } from "./server";

export class ScreenshotRenderer {
  private readonly server: ScreenshotServer;
  private readonly browser: Browser;
  private readonly inDocker: boolean;

  constructor(port = 3037) {
    this.server = new ScreenshotServer(port);
    this.inDocker = isDocker();
    this.browser = this.inDocker ? new LocalBrowser() : new DockerBrowser();
  }

  async start() {
    await Promise.all([this.server.start(), this.browser.start()]);
  }

  async stop() {
    await Promise.all([this.server.stop(), this.browser.stop()]);
  }

  async render(node: React.ReactNode): Promise<string> {
    return this.server.serve(node, async (port, path) => {
      const url = this.inDocker
        ? `http://localhost:${port}${path}`
        : `http://host.docker.internal:${port}${path}`;
      return this.browser.render(url);
    });
  }
}
