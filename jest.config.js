module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./src/examples/jest-config/global-setup.ts",
  globalTeardown: "./src/examples/jest-config/global-teardown.ts",
  testPathIgnorePatterns: ["/dist/", "/node_modules/"]
};
