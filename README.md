# react-screenshot-test

[![CircleCI](https://img.shields.io/circleci/build/github/fwouts/react-screenshot-test)](https://circleci.com/gh/fwouts/react-screenshot-test/tree/master)
[![npm](https://img.shields.io/npm/v/react-screenshot-test)](https://www.npmjs.com/package/react-screenshot-test)

This is a dead simple library to screenshot test React components.

```typescript
// my-component.spec.jsx (or .tsx)

import React from "react";
import { ReactScreenshotTest } from "../lib";
import { VIEWPORTS } from "./viewports";

ReactScreenshotTest.create("Using runner")
  .viewports(VIEWPORTS)
  .shoot("with title", <MyComponent title="Hello, World!" />)
  .shoot("without title", <MyComponent title={null} />)
  .run();
```

That's it. Well, almost!

All that's left is configuring Jest's `globalSetup` and `globalTeardown` scripts:

```typescript
// globalSetup
export default async () => setUpScreenshotServer();

// globalTeardown
export default async () => tearDownScreenshotServer();
```

## How does it work?

Under the hood, we start a local server which renders components server-side. Each component is given its own dedicated page (e.g. /render/my-component). Then we use Puppeteer to take a screenshot of that page.

## Cross-platform consistency

If you work on a team where developers use a different OS (e.g. Mac OS and
Linux), or if you develop on Mac OS but use Linux for continuous integration,
you would quickly run into issues where screenshots are inconsistent across
platforms. This is, for better or worse, expected behaviour.

In order to work around this issue, `react-screenshot-test` will default to
running Puppeteer inside Docker to take screenshots of your components. This
ensures that generated screenshots are consistent regardless of which platform
you run your tests on.

You can override this behaviour by setting the `SCREENSHOT_MODE` environment
variable to `local`, which will always use a local browser instead of Docker.

## CSS support

Because of how it's built, `react-screenshot-test` does not support CSS imports. However, libraries such as Emotion and Styled Components are supported.

| CSS technique                                          | Supported |
| ------------------------------------------------------ | --------- |
| `<div style={...}`                                     | ✅        |
| [Emotion](https://emotion.sh)                          | ✅        |
| [Styled Components](https://www.styled-components.com) | ✅        |
| `import "./style.css"`                                 | ❌        |
| `import css from "./style.css"`                        | ❌        |

## Simulating various screen sizes

The `render()` method takes an optional `viewport` argument, which you can leverage to simulate various screen sizes or mobile devices.

For example, you can define the following viewports:

```typescript
import { devices } from "puppeteer";
import { Viewport } from "react-screenshot-test";

export const VIEWPORTS: {
  [name: string]: Viewport;
} = {
  Desktop: {
    width: 1024,
    height: 768
  },
  "iPhone X": devices["iPhone X"].viewport
};
```

then use a loop to generate a separate test for each viewport:

```typescript
for (const [device, viewport] of Object.entries(VIEWPORTS)) {
  describe(device, () => {
    it("takes screenshot with simple element", async () => {
      expect(
        await renderer.render(<div>Simple element</div>, viewport)
      ).toMatchImageSnapshot();
    });
  });
}
```

## Storing image snapshots

We recommend using [Git LFS](https://git-lfs.github.com) to store image
snapshots. This will help prevent your Git repository from becoming bloated over time. See our [`.gitattributes`](.gitattributes) for an example setup.

## TypeScript support

This library is written in TypeScript. All declarations are included.
