import React from "react";
import { ReactScreenshotTest } from "../lib";
import { VIEWPORTS } from "./viewports";

ReactScreenshotTest.create("Remote stylesheet")
  .viewports(VIEWPORTS)
  .remoteStylesheet(
    "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
  )
  .shoot("basic div", <div>Simple element</div>)
  .run();
