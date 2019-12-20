# Supporting CSS

We've talked about [supporting static assets](./supporting-static-assets.md) such as images. But what about CSS?

## Styling components in React

There are [a lot of ways](https://github.com/MicheleBertoli/css-in-js) to do CSS in React. Here is a quick refresher of the most common approaches, which are all supported by React Screenshot Test.

### CSS imports

This is what I like to call "the old way": import a CSS stylesheet and add class names to components.

```tsx
import React from "react";
import "./style.css";

export const UserProfile = () => (
  <div className="user-profile">
    <h1>User</h1>
  </div>
);
```

```css
/* style.css */
.user-profile {
  background: black;
}

.user-profile h1 {
  font-size: 14px;
}
```

### CSS Modules

[CSS Modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/) allow class names to be automatically generated to avoid conflicts between stylesheets.

```tsx
import React from "react";
import styles from "./style.module.css";

// className may end up being "UserProfile_container_ax7yz"
export const UserProfile = () => (
  <div className={styles.container}>
    <h1>User</h1>
  </div>
);
```

```scss
/* style.module.css */
.container {
  background: black;
}

.container h1 {
  font-size: 14px;
}
```

### Sass stylesheets

[Sass](https://sass-lang.com/guide) is an extension to CSS which lets you define variables, nested rules, etc.

```tsx
import React from "react";
import "./style.scss";

export const UserProfile = () => (
  <div className="user-profile">
    <h1>User</h1>
  </div>
);
```

```scss
/* style.scss */
@import "./constants.scss";

.user-profile {
  background: $backgroundColor;

  h1 {
    font-size: 14px;
  }
}
```

### CSS-in-JS

You can also disregard CSS stylesheets entirely and use inline styles:

```tsx
import React from "react";

export const UserProfile = () => (
  <div style={{ background: "black" }}>
    <h1 style={{ fontSize: "14px" }}>User</h1>
  </div>
);
```

### Styled Components

A more scalable approach to CSS-in-JS is to use a library. [Styled Components](https://www.styled-components.com/) is one of them:

```tsx
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: black;
`;

const Header = styled.h1`
  font-size: 14px;
`;

export const UserProfile = () => (
  <Container>
    <Header>User</Header>
  </Container>
);
```

### Emotion

[Emotion](https://emotion.sh/) is a competing library. If you use `@emotion/styled`, it looks exactly the same:

```tsx
import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  background: black;
`;

const Header = styled.h1`
  font-size: 14px;
`;

export const UserProfile = () => (
  <Container>
    <Header>User</Header>
  </Container>
);
```

## Supporting each method

Let's go through each method and explain how it works with React Screenshot Test.

### CSS imports

Every time we encounter an import of a `.css` file, we record its content. Later, when the component is rendered by the component server, we inline the CSS into the generated HTML.

```js
module.exports = {
  // ...
  transform: {
    "^.+\\.css$": "react-screenshot-test/css-transform"
  }
};
```

```js
// css-transform/index.js
module.exports = {
  process: (src, filename) => {
    return `
      const { recordCss } = require("react-screenshot-test");
      recordCss(${JSON.stringify(src)});
      module.exports = {};
    `;
  }
};
```

What does [`recordCSS()`](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/recorded-css.ts) do?

- It stores the CSS in memory.
- It leverages [ReactComponentServer](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/react/ReactComponentServer.ts) to include the CSS into a `<style>` element.

### CSS Modules

Supporting CSS Modules is a bit more complicated. Thanks to [Dominik Ferber](https://twitter.com/dferber90) for his work here, without which I would probably never have figured it out.

The idea is similar to the above, but we invoke PostCSS to generate the compiled CSS. Best to just [dig into the code](https://github.com/fwouts/react-screenshot-test/blob/master/css-modules-transform/index.js) if you'd like to understand it all!

The one difference compared to plain CSS is that we must return a mapping of JS symbols to generated class names. In the example above, we'd generate:

```js
const { recordCss } = require("react-screenshot-test");
recordCss(`
.UserProfile_container_ax7yz {
  background: black;
}

.UserProfile_container_ax7yz h1 {
  font-size: 14px;
}
`);
module.exports = {
  container: "UserProfile_container_ax7yz"
};
```

### Sass stylesheets

Browsers cannot read Sass stylesheets. They need to be preprocessed.

Here is a simplified version of `react-screenshot-test/sass-transform` (see the [real deal](https://github.com/fwouts/react-screenshot-test/blob/master/sass-transform/index.js)):

```js
const sass = require("node-sass");

module.exports = {
  process: (src, filename) => {
    const { css: buffer } = sass.renderSync({
      file: filename
    });
    const css = buffer.toString("utf8");
    return `
      const { recordCss } = require("react-screenshot-test");
      recordCss(${JSON.stringify(css)});
      module.exports = {};
    `;
  }
};
```

It's quite convenient that `node-sass` exposes a `renderSync()` function. Thank you strangers!

### CSS-in-JS

Inline styles are rendered in plain HTML. Therefore, they #justwork with server-side rendering. Wonderful!

### Styled Components

Styled Components doesn't work out of the box with server-side rendering. A bit of extra work is required to "collect" the generated styles (see [documentation](https://www.styled-components.com/docs/advanced#server-side-rendering)). This is done inside [`renderWithStyledComponents()`](https://github.com/fwouts/react-screenshot-test/blob/master/src/lib/react/ReactComponentServer.ts) in ReactComponentServer.

One consideration is that most users of React Screenshot Test won't be using Styled Components. This is addressed by the following, slightly hacky logic:

```js
import("styled-components")
  .then(({ ServerStyleSheet }) =>
    this.renderWithStyledComponents(new ServerStyleSheet(), node)
  )
  // If the project where react-screenshot-test is being used doesn't use
  // styled-components, the import will fail and this will be used instead.
  .catch(() => this.renderWithoutStyledComponents(node))
  .then(html => res.send(html));
```

### Emotion

Emotion works out of the box. Lovely!

## Supporting more approaches to styling

If you'd like React Screenshot Test to support another format (e.g. Less) or another library (e.g. Aphrodite), please follow these steps:

- Consider whether it's common enough to be supported. The more we support, the more it costs to maintain over time.
- Read the [contributing guidelines](../CONTRIBUTING.md).
- Start by filing an issue. You never know if someone else is already working on it.
- Ideally after you've heard back from other contributors, send a PR :)
