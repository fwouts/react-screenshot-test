import { resolve } from "path";
import React from "react";
import { ReactScreenshotTest } from "../lib";
import { PngComponent } from "./components/png";
import { StaticImageComponent } from "./components/static-image";
import { SvgComponent } from "./components/svg";
import { VIEWPORTS } from "./viewports";

ReactScreenshotTest.create("Images")
  .viewports(VIEWPORTS)
  .static("/public", resolve("src/tests/public"))
  .shoot("PNG", <PngComponent />)
  .shoot("SVG", <SvgComponent />)
  .shoot("Static image", <StaticImageComponent />)
  .run();
