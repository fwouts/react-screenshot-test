import bodyParser from "body-parser";
import express from "express";
import { LocalChromeRenderer } from "./screenshot-renderer/local-chrome-renderer";

const PORT = 3000;

async function main() {
  const browser = new LocalChromeRenderer();
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
