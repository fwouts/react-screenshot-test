import assertNever from "assert-never";
import chalk from "chalk";
import { PACKAGE_NAME } from "./constants";
import { ChromeScreenshotRenderer } from "./screenshot-renderer/ChromeScreenshotRenderer";
import { ScreenshotServer } from "./screenshot-server/api";
import {
  SCREENSHOT_MODE,
  SCREENSHOT_SERVER_PORT
} from "./screenshot-server/config";
import { DockerizedScreenshotServer } from "./screenshot-server/DockerizedScreenshotServer";
import { LocalScreenshotServer } from "./screenshot-server/LocalScreenshotServer";

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
        new ChromeScreenshotRenderer(),
        SCREENSHOT_SERVER_PORT
      );
    case "docker":
      return new DockerizedScreenshotServer(SCREENSHOT_SERVER_PORT);
    default:
      throw assertNever(SCREENSHOT_MODE);
  }
}

export default setUpScreenshotServer;
