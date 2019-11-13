import mockPuppeteer, { Browser, Page } from "puppeteer";
import { dummy } from "../../testing/dummy";
import { mocked } from "../../testing/mock";
import { partialMock } from "../../testing/partial-mock";
import { ChromeScreenshotRenderer } from "./ChromeScreenshotRenderer";

jest.mock("puppeteer");

describe("ChromeScreenshotRenderer", () => {
  let mockBrowser: jest.Mocked<Browser>;
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockPage = partialMock<Page>({
      goto: jest.fn(),
      screenshot: jest.fn(),
      setViewport: jest.fn(),
      close: jest.fn()
    });
    mockBrowser = partialMock<Browser>({
      newPage: jest.fn().mockReturnValue(mockPage),
      close: jest.fn()
    });
    mocked(mockPuppeteer.launch).mockResolvedValue(mockBrowser);
  });

  describe("start", () => {
    it("does not launch the browser if start() isn't called", async () => {
      new ChromeScreenshotRenderer();
      expect(mockPuppeteer.launch).not.toHaveBeenCalled();
    });

    it("launches the browser when start() is called", async () => {
      const renderer = new ChromeScreenshotRenderer();
      await renderer.start();
      expect(mockPuppeteer.launch).toHaveBeenCalled();
    });

    it("fails to start if browser could not be launched", async () => {
      mocked(mockPuppeteer.launch).mockRejectedValue(
        new Error(`Could not start!`)
      );
      const renderer = new ChromeScreenshotRenderer();
      await expect(renderer.start()).rejects.toEqual(
        new Error(`Could not start!`)
      );
    });
  });

  describe("stop", () => {
    it("cannot close the browser without first starting it", async () => {
      const renderer = new ChromeScreenshotRenderer();
      await expect(renderer.stop()).rejects.toEqual(
        new Error(
          `Browser is not open! Please make sure that start() was called.`
        )
      );
    });

    it("closes the browser when stop() is called", async () => {
      const renderer = new ChromeScreenshotRenderer();
      await renderer.start();
      await renderer.stop();
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it("fails to stop if browser could not be closed", async () => {
      mockBrowser.close.mockRejectedValue(new Error(`Could not stop!`));
      const renderer = new ChromeScreenshotRenderer();
      await renderer.start();
      await expect(renderer.stop()).rejects.toEqual(
        new Error(`Could not stop!`)
      );
    });
  });

  describe("render", () => {
    it("cannot render without first starting it", async () => {
      const renderer = new ChromeScreenshotRenderer();
      await expect(renderer.render("http://example.com")).rejects.toEqual(
        new Error(`Please call start() once before render().`)
      );
    });

    it("takes a screenshot", async () => {
      const dummyBinaryScreenshot: Buffer = dummy();
      mockPage.screenshot.mockResolvedValue(dummyBinaryScreenshot);
      const renderer = new ChromeScreenshotRenderer();
      await renderer.start();
      const screenshot = await renderer.render("http://example.com");
      expect(screenshot).toBe(dummyBinaryScreenshot);
      expect(mockPage.goto).toHaveBeenCalledWith("http://example.com");
      expect(mockPage.screenshot).toHaveBeenCalledWith({
        encoding: "binary"
      });
      expect(mockPage.close).toHaveBeenCalled();
    });

    it("sets the viewport if provided", async () => {
      const renderer = new ChromeScreenshotRenderer();
      await renderer.start();
      await renderer.render("http://example.com", {
        width: 1024,
        height: 768
      });
      expect(mockPage.setViewport).toHaveBeenCalledWith({
        width: 1024,
        height: 768
      });
    });

    it("does not set the viewport if not provided", async () => {
      const renderer = new ChromeScreenshotRenderer();
      await renderer.start();
      await renderer.render("http://example.com");
      expect(mockPage.setViewport).not.toHaveBeenCalled();
    });
  });
});
