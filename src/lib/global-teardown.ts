import { screenshotServer } from "./global-setup";

export async function tearDownScreenshotServer() {
  if (screenshotServer) {
    await screenshotServer.stop();
  }
}

export default tearDownScreenshotServer;
