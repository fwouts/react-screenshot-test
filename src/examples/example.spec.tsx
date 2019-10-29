import { toMatchImageSnapshot } from "jest-image-snapshot";
import React from "react";
import { ScreenshotRenderer } from "../lib";
import { EmotionExample } from "./emotion-example";
import { InlineStyleExample } from "./inline-style-example";
import { StyledComponentsExample } from "./styled-components-example";

expect.extend({ toMatchImageSnapshot });

describe("Example", () => {
  const renderer = new ScreenshotRenderer();

  beforeAll(async () => {
    await renderer.start();
  });

  afterAll(async () => {
    await renderer.stop();
  });

  it("takes screenshot with simple element", async () => {
    expect(await renderer.render(<div>■■■■■</div>)).toMatchImageSnapshot();
  });

  it("takes screenshot with inline style CSS example", async () => {
    expect(
      await renderer.render(<InlineStyleExample />)
    ).toMatchImageSnapshot();
  });

  it("takes screenshot with emotion CSS example", async () => {
    expect(await renderer.render(<EmotionExample />)).toMatchImageSnapshot();
  });

  it("takes screenshot with styled-components CSS example", async () => {
    expect(
      await renderer.render(<StyledComponentsExample />)
    ).toMatchImageSnapshot();
  });
});
