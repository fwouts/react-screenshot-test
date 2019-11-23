import React from "react";
import { ReactScreenshotPercy } from "./lib/react/ReactScreenshotPercy";
import { CssModulesGreenComponent } from "./tests/components/css-modules-green";
import { CssModulesRedComponent } from "./tests/components/css-modules-red";
import { EmotionComponent } from "./tests/components/emotion";
import { GlobalCssBlueComponent } from "./tests/components/global-css-blue";
import { InlineStyleComponent } from "./tests/components/inline-style";
import { PngComponent } from "./tests/components/png";
import { StyledComponentsComponent } from "./tests/components/styled-components";
import { SvgComponent } from "./tests/components/svg";

ReactScreenshotPercy.create("Styled")
  .shoot("inline style CSS", <InlineStyleComponent />)
  .shoot("emotion CSS", <EmotionComponent />)
  .shoot("styled-components CSS", <StyledComponentsComponent />)
  // Note: we intentionally use components that use the same class name. This is
  // used to highlight conflicts, which are expected to occur when two
  // components that use global CSS imports have conflicting class names.
  // .shoot("global CSS orange", <GlobalCssOrangeComponent />)
  // This will end up orange instead of blue!
  .shoot("global CSS blue", <GlobalCssBlueComponent />)
  // CSS modules components should not conflict, because a new classname is
  // generated for each.
  .shoot("CSS modules red", <CssModulesRedComponent />)
  .shoot("CSS modules green", <CssModulesGreenComponent />)
  .shoot("PNG", <PngComponent />)
  .shoot("SVG", <SvgComponent />)
  .run();
