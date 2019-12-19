import { getScreenshotServer } from "./global-setup";

export async function tearDownScreenshotServer() {
  const screenshotServer = getScreenshotServer();
  if (screenshotServer) {
    await screenshotServer.stop();
  }
}

export default tearDownScreenshotServer;
