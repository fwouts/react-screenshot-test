module.exports = {
  testEnvironment: "node",
  globalSetup: "./src/lib/global-setup.ts",
  globalTeardown: "./src/lib/global-teardown.ts",
  moduleNameMapper: {
    "^react-screenshot-test$": "<rootDir>/src/lib"
  },
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
    "^.+\\.css$": "./css-transform",
    "^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "./asset-transform"
  },
  testMatch: ["**/?(*.)+(screenshot).[jt]s?(x)"],
  testPathIgnorePatterns: ["/dist/", "/example/", "/node_modules/"]
};
