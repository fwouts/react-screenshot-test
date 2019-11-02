import isDocker from "is-docker";

export const SCREENSHOT_SERVER_PORT = parseInt(
  process.env.SCREENSHOT_SERVER_PORT || "3038"
);

export const SCREENSHOT_MODE = getScreenshotMode();

function getScreenshotMode(): "local" | "docker" {
  if (process.env.SCREENSHOT_MODE) {
    switch (process.env.SCREENSHOT_MODE) {
      case "local":
      case "docker":
        return process.env.SCREENSHOT_MODE;
      default:
        throw new Error(
          `Valid values for SCREENSHOT_MODE are 'local' and 'docker'. Received '${process.env.SCREENSHOT_MODE}'.`
        );
    }
  }
  return isDocker() ? "local" : "docker";
}
