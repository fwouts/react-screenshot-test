import React from "react";
import { ReactScreenshotTest } from "../lib";
import FlowList, { FlowListItem } from "./components/flow-list";
import { VIEWPORTS } from "./viewports";

const Components = (): React.ReactElement => {
  return (
    <FlowList>
      <FlowListItem title="DO SOMETHING!">
        <ul>
          <li>You can put a list in here</li>
          <li>Or any other content</li>
          <li>Whatever you want</li>
        </ul>
      </FlowListItem>
      <FlowListItem title="DO SOMETHING ELSE!!">
        <p>Here is a paragraph. Just put a block of text here if you want</p>
      </FlowListItem>
      <FlowListItem title="DONE!!!" />
    </FlowList>
  );
};

ReactScreenshotTest.create("FlowList")
  .viewports(VIEWPORTS)
  .shoot("all variants", <Components />)
  .run();
