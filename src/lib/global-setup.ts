import assertNever from "assert-never";
import chalk from "chalk";
import { PACKAGE_NAME } from "./constants";
import { LocalChromeRenderer } from "./screenshot-renderer/local-chrome-renderer";
import { ScreenshotServer } from "./screenshot-server/api";
import {
  SCREENSHOT_MODE,
  SCREENSHOT_SERVER_PORT
} from "./screenshot-server/config";
import { DockerScreenshotServer } from "./screenshot-server/docker-server";
import { LocalScreenshotServer } from "./screenshot-server/local-server";

export let screenshotServer: ScreenshotServer | null = null;

export async function setUpScreenshotServer() {
  if (screenshotServer) {
    throw new Error(`Please only call setUpScreenshotServer() once.`);
  }
  screenshotServer = createScreenshotServer();
  try {
    await screenshotServer.start();
  } catch (e) {
    if (e.message.indexOf("connect ECONNREFUSED /var/run/docker.sock") !== -1) {
      throw chalk.red(
        `\n\nBy default, ${PACKAGE_NAME} requires Docker to produce consistent screenshots across platforms.\n\nPlease ensure Docker is running, or force local rendering with:\n$ export SCREENSHOT_MODE=local\n`
      );
    }
    throw e;
  }
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

export default setUpScreenshotServer;
