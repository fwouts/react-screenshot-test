import React from "react";
import { ReactScreenshotPercy } from "../lib/react/ReactScreenshotPercy";
import { EmotionComponent } from "./components/emotion";
import { InlineStyleComponent } from "./components/inline-style";
import { StyledComponentsComponent } from "./components/styled-components";

ReactScreenshotPercy.create("Styled")
  .shoot("inline style CSS", <InlineStyleComponent />)
  .shoot("emotion CSS", <EmotionComponent />)
  .shoot("styled-components CSS", <StyledComponentsComponent />)
  // Note: we intentionally use components that use the same class name. This is
  // used to highlight conflicts, which are expected to occur when two
  // components that use global CSS imports have conflicting class names.
  // .shoot("global CSS orange", <GlobalCssOrangeComponent />)
  // // This will end up orange instead of blue!
  // .shoot("global CSS blue", <GlobalCssBlueComponent />)
  // // CSS modules components should not conflict, because a new classname is
  // // generated for each.
  // .shoot("CSS modules red", <CssModulesRedComponent />)
  // .shoot("CSS modules green", <CssModulesGreenComponent />)
  // .shoot("PNG", <PngComponent />)
  // .shoot("SVG", <SvgComponent />)
  .run();
