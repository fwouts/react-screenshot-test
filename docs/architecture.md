# Architecture

There are multiple layers to the library:

- **[ReactScreenshotTest](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/react/ReactScreenshotTest.ts) is the library's main entrypoint.**
  - It exposes a simple API.
  - Internally, it coordinates Jest, the component server and the screenshot renderer.
- **[ReactComponentServer](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/react/ReactComponentServer.ts) is an HTTP server that renders React components server-side.**
- **[ScreenshotRenderer](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/screenshot-renderer/api.ts) is an interface wrapping a browser.**
  - There are multiple implementations, in particular [**ChromeScreenshotRenderer**](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/screenshot-renderer/ChromeScreenshotRenderer.ts) (using Puppeteer) and [**PercyScreenshotRenderer**](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/screenshot-renderer/PercyScreenshotRenderer.ts) (loading screenshots over HTTP).
- **[ScreenshotServer](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/screenshot-server/api.ts) is an HTTP server that takes a screenshot of a particular URL.**
  - A screenshot server can either be local or it can run within Docker.
  - Running it in Docker allows us to take consistent snapshots across platforms.
