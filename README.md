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

## TypeScript support

This library is written in TypeScript. All declarations are included.
