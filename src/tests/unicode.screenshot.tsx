import React from "react";
import { ReactScreenshotTest } from "../lib";
import { VIEWPORTS } from "./viewports";

ReactScreenshotTest.create("Unicode")
  .viewports(VIEWPORTS)
  .shoot("French", <div>Bonjour Sébastien, comment ça va ?</div>)
  .shoot("Chinese", <div>你好！</div>)
  .shoot("Japanese", <div>こんにちは</div>)
  // Disabled as Docker currently doesn't have the right font.
  // .shoot("Emoji", <div>😃</div>)
  .run();
