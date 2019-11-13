import { ChromeScreenshotRenderer } from "./screenshot-renderer/ChromeScreenshotRenderer";
import { LocalScreenshotServer } from "./screenshot-server/LocalScreenshotServer";

const screenshotServer = new LocalScreenshotServer(
  new ChromeScreenshotRenderer(),
  3000
);
screenshotServer
  .start()
  .then(() => console.log("Ready."))
  .catch(console.error);
