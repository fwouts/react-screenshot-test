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

  it("takes a screenshot 1", async () => {
    await taker.render(<div>Test 1</div>, "example-1.png");
  });

  it("takes a screenshot 2", async () => {
    await taker.render(<div>Test 2</div>, "example-2.png");
  });

  it("takes a screenshot 3", async () => {
    await taker.render(<div>Test 3</div>, "example-3.png");
  });
});
