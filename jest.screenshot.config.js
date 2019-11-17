module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./src/lib/global-setup.ts",
  globalTeardown: "./src/lib/global-teardown.ts",
  moduleNameMapper: {
    "^react-screenshot-test$": "<rootDir>/src/lib"
  },
  transform: {
    "^.+\\.css$": "./css-transform"
  },
  testMatch: ["**/?(*.)+(screenshot).[jt]s?(x)"],
  testPathIgnorePatterns: ["/dist/", "/example/", "/node_modules/"]
};
