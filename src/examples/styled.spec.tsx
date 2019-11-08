import React from "react";
import { ReactScreenshotTest } from "../lib";
import { EmotionExample } from "./components/emotion-example";
import { InlineStyleExample } from "./components/inline-style-example";
import { StyledComponentsExample } from "./components/styled-components-example";
import { VIEWPORTS } from "./viewports";

ReactScreenshotTest.create("Styled components")
  .viewports(VIEWPORTS)
  .shoot("inline style CSS", <InlineStyleExample />)
  .shoot("emotion CSS", <EmotionExample />)
  .shoot("styled-components CSS", <StyledComponentsExample />)
  .run();
