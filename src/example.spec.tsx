import React from "react";
import { ScreenshotTaker } from "./screenshot";

describe("Example", () => {
  const taker = new ScreenshotTaker();

  beforeAll(async () => {
    await taker.start();
  });

  afterAll(async () => {
    await taker.stop();
  });

  it("takes a screenshot", async () => {
    await taker.render(<div>Test</div>);
  });
});
