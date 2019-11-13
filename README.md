# react-screenshot-test

[![CircleCI](https://img.shields.io/circleci/build/github/fwouts/react-screenshot-test)](https://circleci.com/gh/fwouts/react-screenshot-test/tree/master)
[![npm](https://img.shields.io/npm/v/react-screenshot-test)](https://www.npmjs.com/package/react-screenshot-test)

This is a dead simple library to screenshot test React components.

```typescript
// FancyButton.screenshot.jsx (or .tsx)

import React from "react";
import { ReactScreenshotTest } from "react-screenshot-test";
import { FancyButton } from "./FancyButton";

ReactScreenshotTest.create("FancyButton")
  .viewport("Desktop", {
    width: 1024,
    height: 768
  })
  .viewport("iPhone X", {
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    isLandscape: false
  })
  .shoot("with label", <FancyButton label="Hello, World!" />)
  .shoot("empty label", <FancyButton />)
  .run();
```

That's it. Well, almost!

All that's left is configuring Jest for your screenshot tests:

```js
// jest.screenshot.config.js

module.exports = {
  preset: "ts-jest", // Only if you use TypeScript
  testEnvironment: "node",
  globalSetup: "react-screenshot-test/global-setup",
  globalTeardown: "react-screenshot-test/global-teardown",
  testMatch: ["**/?(*.)+(screenshot).[jt]s?(x)"]
};
```

You can then generate screenshots with `jest -c jest.screenshot.config.js -u`,
just like you would with Jest snapshots.

## What does it look like?

Here's a [real example](https://github.com/fwouts/react-screenshot-test/pull/18/files?short_path=9fa0253#diff-9fa0253d6c3a2b1cf8ec498eec18360e) of a pull request where a component was changed:
[![Example PR](example-pr.png)](https://github.com/fwouts/react-screenshot-test/pull/18/files?short_path=c1101dd#diff-c1101ddb11729f8ee0750df5e9595b47)

## How does it work?

Under the hood, we start a local server which renders components server-side. Each component is given its own dedicated page (e.g. /render/my-component). Then we use Puppeteer to take a screenshot of that page.

## Cross-platform consistency

If you work on a team where developers use a different OS (e.g. Mac OS and
Linux), or if you develop on Mac OS but use Linux for continuous integration,
you would quickly run into issues where screenshots are inconsistent across
platforms. This is, for better or worse, expected behaviour.

In order to work around this issue, `react-screenshot-test` will default to
running Puppeteer (i.e. Chrome) inside Docker to take screenshots of your
components. This ensures that generated screenshots are consistent regardless of
which platform you run your tests on.

You can override this behaviour by setting the `SCREENSHOT_MODE` environment
variable to `local`, which will always use a local browser instead of Docker.

## CSS support

CSS-in-JS libraries such as Emotion and Styled Components are supported.

However, CSS imports are mocked out by Jest, which means that `react-screenshot-test` cannot support them.

| CSS technique                                          | Supported |
| ------------------------------------------------------ | --------- |
| `<div style={...}`                                     | ✅        |
| [Emotion](https://emotion.sh)                          | ✅        |
| [Styled Components](https://www.styled-components.com) | ✅        |
| `import "./style.css"`                                 | ❌        |
| `import css from "./style.css"`                        | ❌        |

## Storing image snapshots

We recommend using [Git LFS](https://git-lfs.github.com) to store image
snapshots. This will help prevent your Git repository from becoming bloated over time. See our [`.gitattributes`](.gitattributes) for an example setup.

## TypeScript support

This library is written in TypeScript. All declarations are included.

## Browser support

At the moment, screenshots are only generated with Chrome. However, the design can be extended to any headless browser. File an issue if you'd like to help make this happen.
