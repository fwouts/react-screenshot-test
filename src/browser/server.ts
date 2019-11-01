import bodyParser from "body-parser";
import express from "express";
import { LocalBrowser } from "../lib/browser/local-browser";

const PORT = 3000;

async function main() {
  const browser = new LocalBrowser();
  await browser.start();
  const app = express();
  app.use(bodyParser.json());
  app.post("/render", async (req, res) => {
    const url = req.body.url;
    const screenshot = await browser.render(url);
    res.contentType("image/png");
    res.end(screenshot);
  });
  await new Promise(resolve => app.listen(PORT, resolve));
  console.log("Ready.");
}

main().catch(console.error);
