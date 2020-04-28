import { getLoggingLevel } from "./screenshot-server/config";

export type LoggingConfig = "DEBUG" | "NORMAL";

function logDebug(tag: string, message: string) {
  if (getLoggingLevel() !== "DEBUG") {
    return;
  }
  console.log(`[DEBUG:${tag}] ${message}`);
}

export const debugLogger = (tag: string) => (message: string) =>
  logDebug(tag, message);
