import assertNever from "assert-never";
import { LocalChromeRenderer } from "./screenshot-renderer/local-chrome-renderer";
import { ScreenshotServer } from "./screenshot-server/api";
import {
  SCREENSHOT_MODE,
  SCREENSHOT_SERVER_PORT
} from "./screenshot-server/config";
import { DockerScreenshotServer } from "./screenshot-server/docker-server";
import { LocalScreenshotServer } from "./screenshot-server/local-server";

let screenshotServer: ScreenshotServer | null = null;

export async function setUpScreenshotServer() {
  if (screenshotServer) {
    throw new Error(`Please only call setUpScreenshotServer() once.`);
  }
  screenshotServer = createScreenshotServer();
  await screenshotServer.start();
}

export async function tearDownScreenshotServer() {
  if (!screenshotServer) {
    throw new Error(
      `Please make sure that setUpScreenshotServer() was called.`
    );
  }
  await screenshotServer.stop();
}

function createScreenshotServer(): ScreenshotServer {
  switch (SCREENSHOT_MODE) {
    case "local":
      return new LocalScreenshotServer(
        new LocalChromeRenderer(),
        SCREENSHOT_SERVER_PORT
      );
    case "docker":
      return new DockerScreenshotServer(SCREENSHOT_SERVER_PORT);
    default:
      throw assertNever(SCREENSHOT_MODE);
  }
}
