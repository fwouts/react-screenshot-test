import React from "react";
import { ReactScreenshotTest } from "react-screenshot-test";
import { FancyButton } from "./FancyButton";
import "./global.css";
import { redLabel } from "./style.module.css";

describe("screenshots", () => {
  ReactScreenshotTest.create("FancyButton")
    .viewport("Desktop", {
      width: 1024,
      height: 768,
    })
    .viewport("iPhone X", {
      width: 375,
      height: 812,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      isLandscape: false,
    })
    .shoot("with label", <FancyButton label="Hello, World!" />)
    .shoot("empty label", <FancyButton />)
    .shoot(
      "custom label",
      <FancyButton label={<span className={redLabel}>Red label</span>} />
    )
    .run();
});
