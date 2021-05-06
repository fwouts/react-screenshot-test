import express, { Express } from "express";
import getPort from "get-port";
import { Server } from "net";
import React from "react";
import ReactDOMServer from "react-dom/server";
import * as uuid from "uuid";
import { debugLogger } from "../logger";
import { ASSET_SERVING_PREFIX, getAssetFilename } from "../recorded-assets";
import { readRecordedCss } from "../recorded-css";

// Import ServerStyleSheet without importing styled-components, so that
// projects which don't use styled-components don't crash.
type ServerStyleSheet = import("styled-components").ServerStyleSheet;

const viewportMeta = React.createElement("meta", {
  name: "viewport",
  content: "width=device-width, initial-scale=1.0",
});
const charsetMeta = React.createElement("meta", {
  name: "charset",
  content: "UTF-8",
});

const logDebug = debugLogger("ReactComponentServer");

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

  constructor(staticPaths: Record<string, string>) {
    this.app = express();
    for (const [mappedPath, dirOrFilePath] of Object.entries(staticPaths)) {
      this.app.use(mappedPath, express.static(dirOrFilePath));
    }
    this.app.get("/render/:nodeId", (req, res) => {
      const { nodeId } = req.params;
      const node = this.nodes[nodeId];
      logDebug(`Received request to render node ${nodeId}.`);
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
        .then((html) => {
          logDebug(`Finished render successfully.`);
          res.header("Content-Type", "text/html; charset=utf-8");
          res.send(html);
          logDebug(`Rendered HTML sent.`);
        })
        .catch(console.error);
    });
    this.app.get(`${ASSET_SERVING_PREFIX}:asset.:ext`, (req, res) => {
      const filePath = getAssetFilename(req.path);
      logDebug(`Serving static asset ${req.path} from ${filePath}.`);
      res.sendFile(filePath);
    });
  }

  private renderWithStyledComponents(
    sheet: ServerStyleSheet,
    node: NodeDescription
  ) {
    logDebug(`Initiating render with styled-components.`);

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
            charsetMeta,
            viewportMeta,
            ...node.remoteStylesheetUrls.map((url) =>
              React.createElement("link", {
                rel: "stylesheet",
                href: url,
              })
            ),
            React.createElement("style", {
              dangerouslySetInnerHTML: { __html: readRecordedCss() },
            }),
            sheet.getStyleElement()
          ),
          React.createElement("body", {
            dangerouslySetInnerHTML: { __html: rendered },
          })
        )
      );
      return html;
    } finally {
      sheet.seal();
    }
  }

  private renderWithoutStyledComponents(node: NodeDescription) {
    logDebug(`Initiating render without styled-components.`);

    // Simply render the node. This works with Emotion, too!
    return ReactDOMServer.renderToString(
      React.createElement(
        "html",
        null,
        React.createElement(
          "head",
          null,
          charsetMeta,
          viewportMeta,
          ...node.remoteStylesheetUrls.map((url) =>
            React.createElement("link", {
              rel: "stylesheet",
              href: url,
            })
          ),
          React.createElement("style", {
            dangerouslySetInnerHTML: { __html: readRecordedCss() },
          })
        ),
        React.createElement("body", null, node.reactNode)
      )
    );
  }

  async start(): Promise<void> {
    logDebug(`start() initiated.`);

    if (this.server) {
      throw new Error(
        "Server is already running! Please only call start() once."
      );
    }
    this.port = await getPort();

    logDebug(`Attempting to listen on port ${this.port}.`);
    await new Promise<void>((resolve) => {
      this.server = this.app.listen(this.port, resolve);
    });
    logDebug(`Successfully listening on port ${this.port}.`);
  }

  async stop(): Promise<void> {
    logDebug(`stop() initiated.`);

    const { server } = this;
    if (!server) {
      throw new Error(
        "Server is not running! Please make sure that start() was called."
      );
    }

    logDebug(`Attempting to shutdown server.`);
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    logDebug(`Successfully shutdown server.`);
  }

  async serve<T>(
    node: NodeDescription,
    ready: (port: number, path: string) => Promise<T>,
    id = uuid.v4()
  ): Promise<T> {
    logDebug(`serve() initiated with node ID: ${id}`);

    if (!this.server || !this.port) {
      throw new Error(
        "Server is not running! Please make sure that start() was called."
      );
    }

    logDebug(`Storing node.`);
    this.nodes[id] = node;

    logDebug(`Rendering node.`);
    const result = await ready(this.port, `/render/${id}`);
    logDebug(`Node rendered.`);

    logDebug(`Deleting node.`);
    delete this.nodes[id];

    return result;
  }
}

export interface NodeDescription {
  name: string;
  reactNode: React.ReactNode;
  remoteStylesheetUrls: string[];
}
