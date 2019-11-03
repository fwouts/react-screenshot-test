import { toMatchImageSnapshot } from "jest-image-snapshot";
import React from "react";
import { ReactScreenshotRenderer } from "../lib";
import { VIEWPORTS } from "./viewports";

expect.extend({ toMatchImageSnapshot });

describe("Simple HTML", () => {
  const renderer = new ReactScreenshotRenderer();

  beforeAll(async () => {
    await renderer.start();
  });

  afterAll(async () => {
    await renderer.stop();
  });

  for (const [device, viewport] of Object.entries(VIEWPORTS)) {
    describe(device, () => {
      it("takes screenshot with simple element", async () => {
        expect(
          await renderer.render(<div>Simple element</div>, viewport)
        ).toMatchImageSnapshot();
      });
    });
  }
});
