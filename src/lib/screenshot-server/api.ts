/**
 * A screenshot server takes screenshots of arbitrary URLs.
 *
 * The server should expose a POST /render endpoint that accepts a JSON payload
 * containing the URL to render.
 */
export interface ScreenshotServer {
  start(): Promise<void>;
  stop(): Promise<void>;
}
