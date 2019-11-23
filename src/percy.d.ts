declare module "@percy/script" {
  import { Page } from "puppeteer";
  function run(
    runner: (
      page: Page,
      percySnapshot: (
        name: string,
        options?: {
          widths?: number[];
          minHeight?: number;
          percyCSS?: string;
          requestHeaders?: Record<string, string>;
        }
      ) => Promise<void>
    ) => Promise<void>
  ): void;
}
