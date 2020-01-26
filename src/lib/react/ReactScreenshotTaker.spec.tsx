import React from "react";
import { partialMock } from "../../testing/partial-mock";
import { ScreenshotRenderer } from "../screenshot-renderer/api";
import { NodeDescription, ReactComponentServer } from "./ReactComponentServer";
import { ReactScreenshotTaker } from "./ReactScreenshotTaker";

describe("ReactScreenshotTaker", () => {
  let mockComponentServer: jest.Mocked<ReactComponentServer>;
  let mockScreenshotRenderer: jest.Mocked<ScreenshotRenderer>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockComponentServer = partialMock<ReactComponentServer>({
      start: jest.fn(),
      stop: jest.fn(),
      serve: jest.fn()
    });
    mockComponentServer.serve.mockImplementation((_node, callback) =>
      callback(1234, "/rendered")
    );
    mockScreenshotRenderer = partialMock<ScreenshotRenderer>({
      start: jest.fn(),
      stop: jest.fn(),
      render: jest.fn()
    });
  });

  describe("start", () => {
    it("starts both", async () => {
      const renderer = new ReactScreenshotTaker(
        mockComponentServer,
        mockScreenshotRenderer
      );
      await renderer.start();
      expect(mockComponentServer.start).toHaveBeenCalled();
      expect(mockScreenshotRenderer.start).toHaveBeenCalled();
    });
  });

  describe("stop", () => {
    it("stops both", async () => {
      const renderer = new ReactScreenshotTaker(
        mockComponentServer,
        mockScreenshotRenderer
      );
      await renderer.stop();
      expect(mockComponentServer.stop).toHaveBeenCalled();
      expect(mockScreenshotRenderer.stop).toHaveBeenCalled();
    });
  });

  describe("render", () => {
    it("delegates without viewport", async () => {
      const renderer = new ReactScreenshotTaker(
        mockComponentServer,
        mockScreenshotRenderer
      );
      const node: NodeDescription = {
        name: "test",
        reactNode: <div>Hello, World!</div>,
        remoteStylesheetUrls: []
      };
      await renderer.render(node);
      expect(mockComponentServer.serve).toHaveBeenCalledWith(
        node,
        expect.anything()
      );
      expect(mockScreenshotRenderer.render).toHaveBeenCalledWith(
        "test",
        expect.stringMatching(":1234/rendered")
      );
    });

    it("delegates with viewport", async () => {
      const renderer = new ReactScreenshotTaker(
        mockComponentServer,
        mockScreenshotRenderer
      );
      const node: NodeDescription = {
        name: "test",
        reactNode: <div>Hello, World!</div>,
        remoteStylesheetUrls: []
      };
      await renderer.render(node, {
        width: 1024,
        height: 768
      });
      expect(mockComponentServer.serve).toHaveBeenCalledWith(
        node,
        expect.anything()
      );
      expect(mockScreenshotRenderer.render).toHaveBeenCalledWith(
        "test",
        expect.stringMatching(":1234/rendered"),
        {
          width: 1024,
          height: 768
        }
      );
    });
  });
});
