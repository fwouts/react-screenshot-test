import express, { Express } from "express";
import getPort from "get-port";
import { Server } from "net";
import React from "react";
import ReactDOMServer from "react-dom/server";
import uuid from "uuid";
import { ASSET_SERVING_PREFIX, getAssetFilename } from "../recorded-assets";
import { readRecordedCss } from "../recorded-css";

// Import ServerStyleSheet without importing styled-components, so that
// projects which don't use styled-components don't crash.
type ServerStyleSheet = import("styled-components").ServerStyleSheet;

const viewportMeta = React.createElement("meta", {
  name: "viewport",
  content: "width=device-width, initial-scale=1.0"
});

/**
 * ReactComponentServer renders React nodes in a plain HTML page.
 */
export class ReactComponentServer {
  private readonly app: Express;

  private server: Server | null = null;

  private port: number | null = null;

  private readonly nodes: {
    [id: string]: NodeDescription;
  } = {};

  constructor() {
    this.app = express();
    this.app.get("/render/:nodeId", (req, res) => {
      const { nodeId } = req.params;
      const node = this.nodes[nodeId];
      if (!node) {
        throw new Error(`No node to render for ID: ${nodeId}`);
      }

      // In order to render styled components, we need to collect the styles.
      // However, some projects don't use styled components, and it woudln't be
      // fair to ask them to install it. Therefore, we rely on a dynamic import
      // which we expect to fail if the package isn't installed. That's OK,
      // because that means we can render without it.
      import("styled-components")
        .then(({ ServerStyleSheet }) =>
          this.renderWithStyledComponents(new ServerStyleSheet(), node)
        )
        .catch(() => this.renderWithoutStyledComponents(node))
        .then(html => res.send(html));
    });
    this.app.get(`${ASSET_SERVING_PREFIX}:asset.:ext`, (req, res) => {
      const filePath = getAssetFilename(req.path);
      res.sendFile(filePath);
    });
  }

  private renderWithStyledComponents(
    sheet: ServerStyleSheet,
    node: NodeDescription
  ) {
    // See https://www.styled-components.com/docs/advanced#server-side-rendering
    // for details.
    try {
      const rendered = ReactDOMServer.renderToString(
        sheet.collectStyles(node.reactNode)
      );
      const html = ReactDOMServer.renderToString(
        React.createElement(
          "html",
          null,
          React.createElement(
            "head",
            null,
            viewportMeta,
            ...node.remoteStylesheetUrls.map(url =>
              React.createElement("link", {
                rel: "stylesheet",
                href: url
              })
            ),
            React.createElement("style", null, readRecordedCss()),
            sheet.getStyleElement()
          ),
          React.createElement("body", {
            dangerouslySetInnerHTML: { __html: rendered }
          })
        )
      );
      return html;
    } finally {
      sheet.seal();
    }
  }

  private renderWithoutStyledComponents(node: NodeDescription) {
    // Simply render the node. This works with Emotion, too!
    return ReactDOMServer.renderToString(
      React.createElement(
        "html",
        null,
        React.createElement(
          "head",
          null,
          viewportMeta,
          ...node.remoteStylesheetUrls.map(url =>
            React.createElement("link", {
              rel: "stylesheet",
              href: url
            })
          ),
          React.createElement("style", null, readRecordedCss())
        ),
        React.createElement("body", null, node.reactNode)
      )
    );
  }

  async start(): Promise<void> {
    if (this.server) {
      throw new Error(
        "Server is already running! Please only call start() once."
      );
    }
    this.port = await getPort();
    return new Promise(resolve => {
      this.server = this.app.listen(this.port, resolve);
    });
  }

  stop(): Promise<void> {
    const { server } = this;
    if (!server) {
      throw new Error(
        "Server is not running! Please make sure that start() was called."
      );
    }
    return new Promise((resolve, reject) => {
      server.close(err => (err ? reject(err) : resolve()));
    });
  }

  async serve<T>(
    node: NodeDescription,
    ready: (port: number, path: string) => Promise<T>,
    id = uuid.v4()
  ): Promise<T> {
    if (!this.server || !this.port) {
      throw new Error(
        "Server is not running! Please make sure that start() was called."
      );
    }
    this.nodes[id] = node;
    const result = await ready(this.port, `/render/${id}`);
    delete this.nodes[id];
    return result;
  }
}

export interface NodeDescription {
  reactNode: React.ReactNode;
  remoteStylesheetUrls: string[];
}
