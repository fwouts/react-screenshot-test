import { toMatchImageSnapshot } from "jest-image-snapshot";
import React from "react";
import { ScreenshotTaker } from "../lib/taker";

expect.extend({ toMatchImageSnapshot });

describe("Example", () => {
  const taker = new ScreenshotTaker();

  beforeAll(async () => {
    await taker.start();
  });

  afterAll(async () => {
    await taker.stop();
  });

  it("takes screenshot 1", async () => {
    expect(await taker.render(<div>Test 1</div>)).toMatchImageSnapshot();
  });

  it("takes screenshot 2", async () => {
    expect(await taker.render(<div>Test 2</div>)).toMatchImageSnapshot();
  });
});
