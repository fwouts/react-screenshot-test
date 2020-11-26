import React from "react";
import { ReactScreenshotTest } from "../lib";
import { PngComponent } from "./components/png";
import { StaticImageComponent } from "./components/static-image";
import { SvgComponent } from "./components/svg";
import { VIEWPORTS } from "./viewports";

describe("screenshots", () => {
  ReactScreenshotTest.create("Images")
    .viewports(VIEWPORTS)
    .static("/public", "src/tests/public")
    .shoot("PNG", <PngComponent />)
    .shoot("SVG", <SvgComponent />)
    .shoot("Static image", <StaticImageComponent />)
    .run();
});
