import isDocker from "is-docker";

export const SCREENSHOT_SERVER_PORT = parseInt(
  process.env.SCREENSHOT_SERVER_PORT || "3038",
  10
);

export const SCREENSHOT_MODE = getScreenshotMode();

function getScreenshotMode(): "puppeteer" | "selenium" | "docker" | "percy" {
  if (process.env.SCREENSHOT_MODE) {
    switch (process.env.SCREENSHOT_MODE) {
      case "puppeteer":
      case "selenium":
      case "docker":
      case "percy":
        return process.env.SCREENSHOT_MODE;
      default:
        throw new Error(
          `Valid values for SCREENSHOT_MODE are 'puppeteer', 'selenium', 'docker' and 'percy'. Received '${process.env.SCREENSHOT_MODE}'.`
        );
    }
  }
  return isDocker() ? "puppeteer" : "docker";
}

export function getSeleniumBrowser() {
  const browser = process.env.SCREENSHOT_SELENIUM_BROWSER;
  if (!browser) {
    throw new Error(
      `Please set SCREENSHOT_SELENIUM_BROWSER. Valid values are "chrome", "firefox", "internet explorer", "opera" or "safari".`
    );
  }
  return browser;
}

export function getScreenshotPrefix() {
  return process.env.SCREENSHOT_PREFIX || "";
}
