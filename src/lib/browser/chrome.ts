export type Browser = import("puppeteer").Browser;

export async function launchChrome(): Promise<Browser> {
  // Puppeteer is not a dependency, because most users would likely use Docker
  // which is the default behaviour.
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch (e) {
    throw new Error(
      `Please install the 'puppeteer' package:\n\nUsing NPM:\n$ npm install -D puppeteer\n\nUsing Yarn:\n$ yarn add -D puppeteer`
    );
  }
  return puppeteer.default.launch({
    args: ["--no-sandbox"]
  });
}
