export interface ScreenshotRenderer {
  start(): Promise<void>;
  stop(): Promise<void>;
  render(url: string): Promise<Buffer>;
}
