let recordedCss = "";

export function recordCss(css: string) {
  recordedCss += css;
}

export function readCss() {
  return recordedCss;
}
