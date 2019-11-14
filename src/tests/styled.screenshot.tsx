import React from "react";
import { ReactScreenshotTest } from "../lib";
import { CssModulesComponent } from "./components/css-modules";
import { EmotionComponent } from "./components/emotion";
import { GlobalCssComponent } from "./components/global-css";
import { InlineStyleComponent } from "./components/inline-style";
import { StyledComponentsComponent } from "./components/styled-components";
import { VIEWPORTS } from "./viewports";

ReactScreenshotTest.create("Styled components")
  .viewports(VIEWPORTS)
  .shoot("global CSS", <GlobalCssComponent />)
  .shoot("CSS modules", <CssModulesComponent />)
  .shoot("inline style CSS", <InlineStyleComponent />)
  .shoot("emotion CSS", <EmotionComponent />)
  .shoot("styled-components CSS", <StyledComponentsComponent />)
  .run();
