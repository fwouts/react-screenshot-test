import axios from "axios";
import React from "react";
import { ReactComponentServer } from "./ReactComponentServer";

describe("ReactComponentServer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders the requested node", async () => {
    const server = new ReactComponentServer();
    await server.start();
    let rendered = false;
    await server.serve(
      {
        name: "test",
        reactNode: <div>Hello, World!</div>,
        remoteStylesheetUrls: [
          "https://fonts.googleapis.com/css?family=Roboto",
        ],
      },
      async (port, path) => {
        const { data } = await axios.get(`http://localhost:${port}${path}`);
        // Fuzzy match.
        expect(data).toContain("<div>Hello, World!</div>");
        // Exact match.
        expect(data).toMatchInlineSnapshot(`
          "<html data-reactroot=\\"\\"><head><meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\"/><link rel=\\"stylesheet\\" href=\\"https://fonts.googleapis.com/css?family=Roboto\\"/><style>
          * {
            transition: none !important;
            animation: none !important;
          }
          </style><style data-styled=\\"\\" data-styled-version=\\"5.0.1\\"></style></head><body><div>Hello, World!</div></body></html>"
        `);
        rendered = true;
      }
    );
    expect(rendered).toBe(true);
    await server.stop();
  });
});
