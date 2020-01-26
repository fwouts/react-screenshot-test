import { PuppeteerScreenshotRenderer } from "./screenshot-renderer/PuppeteerScreenshotRenderer";
import { LocalScreenshotServer } from "./screenshot-server/LocalScreenshotServer";

const screenshotServer = new LocalScreenshotServer(
  new PuppeteerScreenshotRenderer(),
  3000
);
screenshotServer
  .start()
  // eslint-disable-next-line no-console
  .then(() => console.log("Ready."))
  // eslint-disable-next-line no-console
  .catch(console.error);
