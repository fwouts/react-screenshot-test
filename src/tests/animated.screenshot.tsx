import React from "react";
import { ReactScreenshotTest } from "../lib";
import { AnimatedComponent } from "./components/animated";
import { VIEWPORTS } from "./viewports";

describe("screenshots", () => {
  ReactScreenshotTest.create("Animated components")
    .viewports(VIEWPORTS)
    .shoot("animated", <AnimatedComponent />)
    .run();
});
