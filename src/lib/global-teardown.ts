import { clearScreenshotServer, getScreenshotServer } from "./global-setup";
import { debugLogger } from "./logger";

const logDebug = debugLogger("global-teardown");

export async function tearDownScreenshotServer() {
  logDebug(`Screenshot server teardown initiated.`);

  const screenshotServer = getScreenshotServer();
  if (screenshotServer) {
    logDebug(`Stopping screenshot server.`);
    await screenshotServer.stop();
    logDebug(`Screenshot server stopped.`);
  } else {
    logDebug(`No screenshot server was found.`);
  }
  clearScreenshotServer();
}

export default tearDownScreenshotServer;
