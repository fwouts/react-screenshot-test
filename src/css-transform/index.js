// Note: this was forked from
// https://github.com/dferber90/jest-transform-css/blob/master/index.js

const crossSpawn = require("cross-spawn");

module.exports = {
  process: (src, filename, config, options) => {
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
      const { recordCss } = require("${__dirname}/recorded-css");
      recordCss(${JSON.stringify(css)});
      module.exports = ${JSON.stringify(tokens)};
    `;
  }
};
