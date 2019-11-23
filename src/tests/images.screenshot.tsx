import React from "react";
import { ReactScreenshotTest } from "../lib";
import { PngComponent } from "./components/png";
import { SvgComponent } from "./components/svg";
import { VIEWPORTS } from "./viewports";

ReactScreenshotTest.create("Images")
  .viewports(VIEWPORTS)
  .shoot("PNG", <PngComponent />)
  .shoot("SVG", <SvgComponent />)
  .run();
