import isDocker from "is-docker";
import { LoggingConfig } from "../logger";

export const SCREENSHOT_MODE = getScreenshotMode();

const serverDefaultPort =
  process.platform === "linux" && SCREENSHOT_MODE === "docker"
    ? "3001"
    : "3038";
export const SCREENSHOT_SERVER_PORT = parseInt(
  process.env.SCREENSHOT_SERVER_PORT || serverDefaultPort,
  10
);

export const SCREENSHOT_SERVER_URL =
  process.env.SCREENSHOT_SERVER_URL ||
  `http://localhost:${SCREENSHOT_SERVER_PORT}`;

function getScreenshotMode(): "puppeteer" | "selenium" | "docker" | "percy" {
  if (process.env.SCREENSHOT_MODE) {
    switch (process.env.SCREENSHOT_MODE) {
      case "local":
      case "puppeteer":
        return "puppeteer";
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

export function getLoggingLevel(): LoggingConfig {
  return (process.env.SCREENSHOT_LOGGING_LEVEL || "").toLowerCase() === "debug"
    ? "DEBUG"
    : "NORMAL";
}
