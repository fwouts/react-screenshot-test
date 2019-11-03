import { toMatchImageSnapshot } from "jest-image-snapshot";
import React from "react";
import { ReactScreenshotRenderer } from "../lib";
import { EmotionExample } from "./components/emotion-example";
import { InlineStyleExample } from "./components/inline-style-example";
import { StyledComponentsExample } from "./components/styled-components-example";
import { VIEWPORTS } from "./viewports";

expect.extend({ toMatchImageSnapshot });

describe("Styled components", () => {
  const renderer = new ReactScreenshotRenderer();

  beforeAll(async () => {
    await renderer.start();
  });

  afterAll(async () => {
    await renderer.stop();
  });

  for (const [device, viewport] of Object.entries(VIEWPORTS)) {
    describe(device, () => {
      it("takes screenshot with inline style CSS example", async () => {
        expect(
          await renderer.render(<InlineStyleExample />, viewport)
        ).toMatchImageSnapshot();
      });

      it("takes screenshot with emotion CSS example", async () => {
        expect(
          await renderer.render(<EmotionExample />, viewport)
        ).toMatchImageSnapshot();
      });

      it("takes screenshot with styled-components CSS example", async () => {
        expect(
          await renderer.render(<StyledComponentsExample />, viewport)
        ).toMatchImageSnapshot();
      });
    });
  }
});
