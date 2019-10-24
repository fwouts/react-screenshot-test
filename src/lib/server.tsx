import express, { Express } from "express";
import { Server } from "net";
import React from "react";
import ReactDOMServer from "react-dom/server";
import uuid from "uuid";

export class ScreenshotServer {
  private readonly app: Express;
  private server: Server | null = null;

  private readonly nodes: {
    [id: string]: React.ReactNode;
  } = {};

  constructor(private readonly port: number) {
    this.app = express();
    this.app.get("/render/:nodeId", (req, res) => {
      const nodeId = req.params.nodeId;
      const node = this.nodes[nodeId];
      if (!node) {
        throw new Error(`No node to render for ID: ${nodeId}`);
      }
      res.send(
        ReactDOMServer.renderToString(
          <html>
            <body>{node}</body>
          </html>
        )
      );
    });
  }

  start(): Promise<void> {
    if (this.server) {
      throw new Error(
        `Server is already running! Please only call start() once.`
      );
    }
    return new Promise(resolve => {
      this.server = this.app.listen(this.port, resolve);
    });
  }

  stop(): Promise<void> {
    const server = this.server;
    if (!server) {
      throw new Error(
        `Server is not running! Please make sure that start() was called.`
      );
    }
    return new Promise((resolve, reject) => {
      server.close(err => (err ? reject(err) : resolve()));
    });
  }

  async serve<T>(
    node: React.ReactNode,
    ready: (url: string) => Promise<T>,
    id = uuid.v4()
  ): Promise<T> {
    this.nodes[id] = node;
    const result = await ready(`http://localhost:${this.port}/render/${id}`);
    delete this.nodes[id];
    return result;
  }
}
