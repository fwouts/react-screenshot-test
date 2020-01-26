import isDocker from "is-docker";

export const SCREENSHOT_SERVER_PORT = parseInt(
  process.env.SCREENSHOT_SERVER_PORT || "3038",
  10
);

export const SCREENSHOT_SERVER_URL =
  process.env.SCREENSHOT_SERVER_URL ||
  `http://localhost:${SCREENSHOT_SERVER_PORT}`;

export const SCREENSHOT_MODE = getScreenshotMode();

function getScreenshotMode(): "local" | "docker" | "percy" {
  if (process.env.SCREENSHOT_MODE) {
    switch (process.env.SCREENSHOT_MODE) {
      case "local":
      case "docker":
      case "percy":
        return process.env.SCREENSHOT_MODE;
      default:
        throw new Error(
          `Valid values for SCREENSHOT_MODE are 'local', 'docker' and 'percy'. Received '${process.env.SCREENSHOT_MODE}'.`
        );
    }
  }
  return isDocker() ? "local" : "docker";
}
