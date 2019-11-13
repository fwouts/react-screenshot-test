import React from "react";
import { ReactScreenshotTest } from "react-screenshot-test";
import { FancyButton } from "./FancyButton";

ReactScreenshotTest.create("FancyButton")
  .viewport("Desktop", {
    width: 1024,
    height: 768
  })
  .viewport("iPhone X", {
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    isLandscape: false
  })
  .shoot("with label", <FancyButton label="Hello, World!" />)
  .shoot("empty label", <FancyButton />)
  .run();
