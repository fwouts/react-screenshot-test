import React from "react";
import { ReactScreenshotTest } from "../lib";
import { EmotionComponent } from "./components/emotion";
import { InlineStyleComponent } from "./components/inline-style";
import { StyledComponentsComponent } from "./components/styled-components";
import { VIEWPORTS } from "./viewports";

ReactScreenshotTest.create("Styled components")
  .viewports(VIEWPORTS)
  .shoot("inline style CSS", <InlineStyleComponent />)
  .shoot("emotion CSS", <EmotionComponent />)
  .shoot("styled-components CSS", <StyledComponentsComponent />)
  .run();
