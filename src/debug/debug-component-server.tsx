import React from "react";
import { StyledComponentsExample } from "../examples/components/styled-components-example";
import { ReactComponentServer } from "../lib/react/ReactComponentServer";

(async function() {
  const server = new ReactComponentServer();
  await server.start();
  await server.serve(
    <StyledComponentsExample />,
    (port, path) => {
      console.log(`Ready to serve at http://localhost:${port}${path}`);
      return new Promise(() => {
        // Never resolve.
      });
    },
    "debug"
  );
})();
