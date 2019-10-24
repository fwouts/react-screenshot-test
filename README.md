# react-screenshot-test

This is a dead simple library to screenshot test React components.

It works best in conjunction with `jest-image-snapshot`.

```typescript
import { toMatchImageSnapshot } from "jest-image-snapshot";
import React from "react";
import { ScreenshotRenderer } from "react-screenshot-test";

expect.extend({ toMatchImageSnapshot });

describe("Example", () => {
  const renderer = new ScreenshotRenderer();

  beforeAll(async () => {
    await renderer.start();
  });

  afterAll(async () => {
    await renderer.stop();
  });

  it("takes screenshot", async () => {
    const image = await renderer.render(<div>Test</div>);
    expect(image).toMatchImageSnapshot();
  });
});
```

That's it.

## How does it work?

Under the hood, we start a local server which renders components server-side. Each component is given its own dedicated page (e.g. /render/my-component). Then we use Puppeteer to take a screenshot of that page.

## TypeScript support

This library is written in TypeScript. All declarations are included.
