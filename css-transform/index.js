// Note: this was forked from
// https://github.com/dferber90/jest-transform-css/blob/master/index.js

// Note: you must increment this version whenever you update this script or
// anything that it uses.
const TRANSFORM_VERSION = "1";

const crypto = require("crypto");
const { cosmiconfigSync } = require("cosmiconfig");
const crossSpawn = require("cross-spawn");

const explorer = cosmiconfigSync("react-screenshot-test");
const transformConfig = explorer.search();

module.exports = {
  getCacheKey: (fileData, filename, configString, { instrument }) => {
    return (
      crypto
        .createHash("md5")
        .update(TRANSFORM_VERSION)
        .update("\0", "utf8")
        .update(fileData)
        .update("\0", "utf8")
        .update(filename)
        .update("\0", "utf8")
        .update(configString)
        .update("\0", "utf8")
        .update(JSON.stringify(transformConfig))
        // TODO load postcssrc (the config) sync and make it part of the cache
        // key
        // .update("\0", "utf8")
        // .update(getPostCssConfig(filename))
        .update("\0", "utf8")
        .update(instrument ? "instrument" : "")
        .digest("hex")
    );
  },

  process: (src, filename) => {
    // No modules processing when plain CSS is used.
    // You can create react-screenshot-test.config.js in your project and add
    // module.exports = { modules: true };
    // or
    // module.exports = { modules: filename => filename.endsWith(".mod.css") };
    // to enable css module transformation.
    const useModules =
      transformConfig &&
      transformConfig.config &&
      ((typeof transformConfig.config.cssModules === "boolean" &&
        transformConfig.config.cssModules) ||
        (typeof transformConfig.config.cssModules === "function" &&
          transformConfig.config.cssModules(filename)));
    if (!useModules) {
      return `
        const { recordCss } = require("react-screenshot-test");
        recordCss(${JSON.stringify(src)});
        module.exports = {};
      `;
    }

    // The "process" function of this Jest transform must be sync,
    // but postcss is async. So we spawn a sync process to do an sync
    // transformation!
    // https://twitter.com/kentcdodds/status/1043194634338324480
    const postcssRunner = `${__dirname}/postcss-runner.js`;
    const result = crossSpawn.sync("node", [
      "-e",
      `
        require("${postcssRunner}")(
          ${JSON.stringify({
            src,
            filename
            // config,
            // options
          })}
        )
        .then(out => { console.log(JSON.stringify(out)) })
      `
    ]);

    // check for errors of postcss-runner.js
    const error = result.stderr.toString();
    if (error) throw error;

    // read results of postcss-runner.js from stdout
    let css;
    let tokens;
    try {
      // we likely logged something to the console from postcss-runner
      // in order to debug, and hence the parsing fails!
      const parsed = JSON.parse(result.stdout.toString());
      css = parsed.css;
      tokens = parsed.tokens;
      if (Array.isArray(parsed.warnings))
        parsed.warnings.forEach(warning => {
          console.warn(warning);
        });
    } catch (error) {
      // we forward the logs and return no mappings
      console.error(result.stderr.toString());
      console.log(result.stdout.toString());
      return `
        console.error("transform-css: Failed to load '${filename}'");
        module.exports = {};
      `;
    }

    // Finally, inject the styles to the document
    return `
      const { recordCss } = require("react-screenshot-test");
      recordCss(${JSON.stringify(css)});
      module.exports = ${JSON.stringify(tokens)};
    `;
  }
};
