import getPort from "get-port";
import { partialMock } from "../../testing/partial-mock";
import { ScreenshotRenderer } from "../screenshot-renderer/api";
import { LocalScreenshotServer } from "./LocalScreenshotServer";
import { fetch } from "../network/fetch";

describe("LocalScreenshotServer", () => {
  let mockRenderer: jest.Mocked<ScreenshotRenderer>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockRenderer = partialMock<ScreenshotRenderer>({
      start: jest.fn(),
      stop: jest.fn(),
      render: jest.fn(),
    });
  });

  it("renders with viewport", async () => {
    const port = await getPort();
    const server = new LocalScreenshotServer(mockRenderer, port);

    await server.start();
    expect(mockRenderer.start).toHaveBeenCalled();

    await fetch(`http://localhost:${port}/render`, "POST", {
      name: "screenshot",
      url: "http://example.com",
      viewport: {
        with: 1024,
        height: 768,
      },
    });
    expect(mockRenderer.render).toHaveBeenCalledWith(
      "screenshot",
      "http://example.com",
      {
        with: 1024,
        height: 768,
      }
    );

    await server.stop();
    expect(mockRenderer.stop).toHaveBeenCalled();
  });

  it("renders without viewport", async () => {
    const port = await getPort();
    const server = new LocalScreenshotServer(mockRenderer, port);

    await server.start();
    expect(mockRenderer.start).toHaveBeenCalled();

    await fetch(`http://localhost:${port}/render`, "POST", {
      name: "screenshot",
      url: "http://example.com",
    });
    expect(mockRenderer.render).toHaveBeenCalledWith(
      "screenshot",
      "http://example.com"
    );

    await server.stop();
    expect(mockRenderer.stop).toHaveBeenCalled();
  });
});
