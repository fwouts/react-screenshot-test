import React from "react";
import { ReactScreenshotTest } from "../lib";
import { VIEWPORTS } from "./viewports";

describe("screenshots", () => {
  ReactScreenshotTest.create("Simple HTML")
    .viewports(VIEWPORTS)
    .shoot("basic div", <div>Simple element</div>)
    .run();
});
