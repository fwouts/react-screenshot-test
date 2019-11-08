module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./src/lib/global-setup.ts",
  globalTeardown: "./src/lib/global-teardown.ts",
  testPathIgnorePatterns: ["/dist/", "/node_modules/"]
};
