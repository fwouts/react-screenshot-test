import "normalize.css";
import React from "react";
import { ReactScreenshotTest } from "../lib";
import { CssModulesGreenComponent } from "./components/css-modules-green";
import { CssModulesRedComponent } from "./components/css-modules-red";
import { EmotionComponent } from "./components/emotion";
import { GlobalCssBlueComponent } from "./components/global-css-blue";
import { GlobalCssOrangeComponent } from "./components/global-css-orange";
import { InlineStyleComponent } from "./components/inline-style";
import { SassGreenComponent } from "./components/sass-green";
import { StyledComponentsComponent } from "./components/styled-components";
import "./global-style.css";
import { VIEWPORTS } from "./viewports";

describe("screenshots", () => {
  ReactScreenshotTest.create("Styled components")
    .viewports(VIEWPORTS)
    .shoot("inline style CSS", <InlineStyleComponent />)
    .shoot("emotion CSS", <EmotionComponent />)
    .shoot("styled-components CSS", <StyledComponentsComponent />)
    // Note: we intentionally use components that use the same class name. This is
    // used to highlight conflicts, which are expected to occur when two
    // components that use global CSS imports have conflicting class names.
    .shoot("global CSS orange", <GlobalCssOrangeComponent />)
    // This will end up orange instead of blue!
    .shoot("global CSS blue", <GlobalCssBlueComponent />)
    // CSS modules components should not conflict, because a new classname is
    // generated for each.
    .shoot("CSS modules red", <CssModulesRedComponent />)
    .shoot("CSS modules green", <CssModulesGreenComponent />)
    .shoot("SASS green", <SassGreenComponent />)
    .run();
});
