# Contributing to `react-screenshot-test`

First of all, thank you for helping out!

## Understanding how it works

Please refer to the [internal documentation](./docs/index.md) to understand how React Screenshot Test works.

## Code contributions

Here is a quick guide to contribute to the library.

1. Fork and clone the repo to your local machine.

2. Create a new branch from `master` with a meaningful name for a new feature or an issue you want to work on: `git checkout -b your-branch-name`

3. Install packages by running:

   ```sh
   yarn install
   ```

4. If you've added a code that should be tested, ensure the test suite still passes and update snapshots.

   ```sh
   # Run all unit tests.
   yarn unit-test -u

   # Run screenshot tests locally.
   yarn screenshot-test-local -u
   ```

5. Please make sure your code is well-tested. Feel free to add new tests and sample code.

6. Ensure your code lints without errors.

   ```sh
   yarn lint
   ```

7. Ensure build passes.

   ```sh
   yarn build
   ```

8. Push your branch: `git push -u origin your-branch-name`

9. Submit a pull request to the upstream react-screenshot-test repository.

10. Choose a descriptive title and describe your changes briefly.

## Coding style

Please follow the coding style of the project. React Screenshot Test uses eslint and prettier. If possible, enable their respective plugins in your editor to get real-time feedback.

Linting can be run manually with the following command: `yarn lint`

## License

By contributing your code to the react-screenshot-test GitHub repository, you agree to license your contribution under the MIT license.
