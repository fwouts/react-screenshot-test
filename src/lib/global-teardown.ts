import { screenshotServer } from "./global-setup";

export async function tearDownScreenshotServer() {
  if (!screenshotServer) {
    throw new Error(
      `Please make sure that setUpScreenshotServer() was called.`
    );
  }
  await screenshotServer.stop();
}

export default tearDownScreenshotServer;
