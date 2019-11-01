import { toMatchImageSnapshot } from "jest-image-snapshot";
import React from "react";
import { ReactScreenshotRenderer } from "../lib";
import { EmotionExample } from "./components/emotion-example";
import { InlineStyleExample } from "./components/inline-style-example";
import { StyledComponentsExample } from "./components/styled-components-example";

expect.extend({ toMatchImageSnapshot });

describe("Example", () => {
  const renderer = new ReactScreenshotRenderer();

  beforeAll(async () => {
    await renderer.start();
  });

  afterAll(async () => {
    await renderer.stop();
  });

  it("takes screenshot with simple element", async () => {
    expect(
      await renderer.render(<div>Simple element</div>)
    ).toMatchImageSnapshot();
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
