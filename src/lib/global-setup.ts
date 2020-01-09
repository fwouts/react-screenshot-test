import assertNever from "assert-never";
import chalk from "chalk";
import { PACKAGE_NAME } from "./constants";
import { PuppeteerScreenshotRenderer } from "./screenshot-renderer/ChromeScreenshotRenderer";
import { SeleniumScreenshotRenderer } from "./screenshot-renderer/WebdriverScreenshotRenderer";
import { ScreenshotServer } from "./screenshot-server/api";
import {
  getSeleniumBrowser,
  SCREENSHOT_MODE,
  SCREENSHOT_SERVER_PORT
} from "./screenshot-server/config";
import { DockerizedScreenshotServer } from "./screenshot-server/DockerizedScreenshotServer";
import { LocalScreenshotServer } from "./screenshot-server/LocalScreenshotServer";

let screenshotServer: ScreenshotServer | null = null;

export function getScreenshotServer() {
  return screenshotServer;
}

export async function setUpScreenshotServer() {
  if (screenshotServer) {
    throw new Error("Please only call setUpScreenshotServer() once.");
  }
  screenshotServer = createScreenshotServer();
  if (!screenshotServer) {
    // If no screenshot server was needed (e.g. Percy), abort early.
    return;
  }
  try {
    await screenshotServer.start();
  } catch (e) {
    if (e.message.indexOf("connect ECONNREFUSED /var/run/docker.sock") !== -1) {
      throw chalk.red(
        `

By default, ${PACKAGE_NAME} requires Docker to produce consistent screenshots across platforms.

Please ensure Docker is running, or force local rendering with:
$ export SCREENSHOT_MODE=puppeteer (or selenium)

Alternatively if you'd like to use Percy (https://percy.io), set it up with:
$ export SCREENSHOT_MODE=percy
$ export PERCY_TOKEN=...
`
      );
    }
    throw e;
  }
}

function createScreenshotServer(): ScreenshotServer | null {
  switch (SCREENSHOT_MODE) {
    case "puppeteer":
      return new LocalScreenshotServer(
        new PuppeteerScreenshotRenderer(),
        SCREENSHOT_SERVER_PORT
      );
    case "selenium":
      return new LocalScreenshotServer(
        new SeleniumScreenshotRenderer({
          browserName: getSeleniumBrowser()
        }),
        SCREENSHOT_SERVER_PORT
      );
    case "docker":
      return new DockerizedScreenshotServer(SCREENSHOT_SERVER_PORT);
    case "percy":
      // No need for a screenshot server.
      return null;
    default:
      throw assertNever(SCREENSHOT_MODE);
  }
}

export default setUpScreenshotServer;
