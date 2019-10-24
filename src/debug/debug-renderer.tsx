import React from "react";
import { StyledComponentsExample } from "../examples/styled-components-example";
import { ScreenshotServer } from "../lib/server";

(async function() {
  const server = new ScreenshotServer(3000);
  await server.start();
  await server.serve(
    <StyledComponentsExample />,
    url => {
      console.log(`Ready to serve at ${url}`);
      return new Promise(() => {
        // Never resolve.
      });
    },
    "debug"
  );
})();
