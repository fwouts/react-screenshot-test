module.exports = {
  env: {
    es6: true,
    node: true,
    "jest/globals": true
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "jest", "@typescript-eslint"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    "class-methods-use-this": 0,
    "import/extensions": [
      "error",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ],
    "import/no-extraneous-dependencies": 0,
    "import/prefer-default-export": 0,
    "no-empty-function": 0,
    "no-loop-func": 0,
    "no-restricted-syntax": 0,
    "no-underscore-dangle": 0,
    "no-unused-vars": 0,
    "no-use-before-define": 0,
    "no-useless-constructor": 0,
    "react/button-has-type": 0,
    "react/jsx-filename-extension": 0
  }
};
