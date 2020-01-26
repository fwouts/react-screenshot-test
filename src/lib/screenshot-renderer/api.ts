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

  /**
   * Returns a buffer representing a PNG screenshot, or `null` when screenshot
   * comparison is delegated to a third-party.
   */
  render(
    name: string,
    url: string,
    viewport?: Viewport
  ): Promise<Buffer | null>;
}

export interface Viewport {
  /** The page width in pixels. */
  width: number;
  /** The page height in pixels. */
  height: number;
  /**
   * Specify device scale factor (can be thought of as dpr).
   * @default 1
   */
  deviceScaleFactor?: number;
  /**
   * Whether the `meta viewport` tag is taken into account.
   * @default false
   */
  isMobile?: boolean;
  /**
   * Specifies if viewport supports touch events.
   * @default false
   */
  hasTouch?: boolean;
  /**
   * Specifies if viewport is in landscape mode.
   * @default false
   */
  isLandscape?: boolean;
}
