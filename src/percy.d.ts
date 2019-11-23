declare module "@percy/puppeteer" {
  import { Page } from "puppeteer";
  function percySnapshot(
    page: Page,
    name: string,
    options?: {
      widths?: number[];
      minHeight?: number;
      percyCSS?: string;
      requestHeaders?: Record<string, string>;
    }
  ): Promise<void>;
}
