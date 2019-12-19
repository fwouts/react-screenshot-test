# Supporting static assets

It's common to see the following in a React component:

```typescript
import React from "react";
import logo from "./logo.svg";

const Logo = () => <img src={logo} />;
```

If you tried testing this component with `react-screenshot-test`, it would fail with the following error:

```sh
    SyntaxError: Unexpected token '<'

      1 | import React from "react";
    > 2 | import logo from "./logo.svg";
        | ^
      3 |
      4 | const Logo = () => <img src={logo} />;

```

That's because SVG isn't valid JavaScript.

It's easy to forget that Webpack does a lot of magic for us. As explained [in the Webpack documentation](https://webpack.js.org/guides/asset-management/), the `file-loader` plugin will automatically convert imports of static assets into a URL, and add them to the output directory.

For better or worse, Jest doesn't run through Webpack. Luckily, there's a workaround: we can declare `transforms` in our Jest config:

```js
module.exports = {
  // ...
  transform: {
    "^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "react-screenshot-test/asset-transform"
  }
};
```

This will invoke the `asset-transform` script every time we import an asset that matches the regular expression.

Here is a simplified implementation (see the [real deal](https://github.com/fwouts/react-screenshot-test/blob/master/asset-transform/index.js)):

```js
module.exports = {
  process: (src, filename) => {
    return `
      const { recordAsset } = require("react-screenshot-test");
      module.exports = recordAsset(${JSON.stringify(filename)});
    `;
  }
};
```

What does [`recordAsset()`](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/recorded-assets.ts) do? Glad you asked:

- It allocates a random ID to the asset.
- It leverages [ReactComponentServer](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/react/ReactComponentServer.ts) to expose the asset at `/assets/[asset-id]`.
- It returns the string `"/assets/[asset-id]"`, which will then be a valid URL.

This solves our problem. Imports of static assets now work!
