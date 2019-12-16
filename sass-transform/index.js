// Note: this was forked from
// https://github.com/dferber90/jest-transform-css/blob/master/index.js

// Note: you must increment this version whenever you update this script or
// anything that it uses.
const TRANSFORM_VERSION = "1";

const crypto = require("crypto");
const sass = require("node-sass");

module.exports = {
  getCacheKey: (fileData, filename, configString, { instrument }) => {
    return crypto
      .createHash("md5")
      .update(TRANSFORM_VERSION)
      .update("\0", "utf8")
      .update(fileData)
      .update("\0", "utf8")
      .update(filename)
      .update("\0", "utf8")
      .update(configString)
      .update("\0", "utf8")
      .update(instrument ? "instrument" : "")
      .digest("hex");
  },

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
