import { Viewport } from "puppeteer";

/**
 * A screenshot renderer takes screenshots of arbitrary URLs.
 *
 * This is an abstraction around a browser. In particular, it allows us to wrap
 * Chrome within Docker to ensure screenshots are consistent even when tests are
 * run from a different platform (e.g. Mac OS).
 */
export interface ScreenshotRenderer {
  start(): Promise<void>;
  stop(): Promise<void>;
  render(url: string, viewport?: Viewport): Promise<Buffer>;
}
