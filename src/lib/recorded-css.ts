/**
 * A concatenated string of all CSS stylesheets imported directly or indirectly from the test.
 *
 * Transitions and animations are always disabled.
 */
let recordedCss = `
* {
  transition: none !important;
  animation: none !important;
}
`;

/**
 * Record an imported CSS stylesheet.
 */
export function recordCss(css: string) {
  recordedCss += css;
}

/**
 * Read all CSS stylesheets as a single CSS string.
 */
export function readRecordedCss() {
  return recordedCss;
}
