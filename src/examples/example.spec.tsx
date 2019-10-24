import { toMatchImageSnapshot } from "jest-image-snapshot";
import React from "react";
import { ScreenshotRenderer } from "../lib/renderer";

expect.extend({ toMatchImageSnapshot });

describe("Example", () => {
  const renderer = new ScreenshotRenderer();

  beforeAll(async () => {
    await renderer.start();
  });

  afterAll(async () => {
    await renderer.stop();
  });

  it("takes screenshot 1", async () => {
    expect(await renderer.render(<div>Test 1</div>)).toMatchImageSnapshot();
  });

  it("takes screenshot 2", async () => {
    expect(await renderer.render(<div>Test 2</div>)).toMatchImageSnapshot();
  });
});
