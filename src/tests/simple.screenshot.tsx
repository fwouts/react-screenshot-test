import React from "react";
import { ReactScreenshotTest } from "../lib";
import { VIEWPORTS } from "./viewports";

ReactScreenshotTest.create("Simple HTML")
  .viewports(VIEWPORTS)
  .shoot("basic div", <div>Simple element</div>)
  .run();
