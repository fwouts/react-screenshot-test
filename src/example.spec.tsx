import React from "react";
import { ScreenshotServer, ScreenshotTaker } from "./screenshot";

describe("Example", () => {
  const server = new ScreenshotServer();
  const taker = new ScreenshotTaker(server);

  beforeAll(async () => {
    await server.start(3000);
  });

  afterAll(async () => {
    await server.stop();
  });

  it("takes a screenshot", async () => {
    await taker.render(<div>Test</div>);
  });
});
