import { LocalChromeRenderer } from "./screenshot-renderer/local-chrome-renderer";
import { LocalScreenshotServer } from "./screenshot-server/local-server";

const screenshotServer = new LocalScreenshotServer(
  new LocalChromeRenderer(),
  3000
);
screenshotServer
  .start()
  .then(() => console.log("Ready."))
  .catch(console.error);
