<p align="center">
  <a href="https://jestjs.io"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg?style=for-the-badge&logo=jest" alt="Tested with Jest"></a>
  <a href="https://www.npmjs.com"><img src="https://img.shields.io/librariesio/release/npm/secure-rm?style=for-the-badge&logo=npm" alt="Dependencies"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/secure-rm?style=for-the-badge" alt="Node version"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/language-typescript-blue?style=for-the-badge" alt="language"></a>
</p>
<p align="center">
  <img src="https://img.shields.io/github/contributors/oganexon/secure-rm?style=for-the-badge" alt="Contributors">
  <img src="https://img.shields.io/github/last-commit/oganexon/secure-rm/develop?style=for-the-badge" alt="Last commit">
  <img src="https://img.shields.io/npm/collaborators/secure-rm?style=for-the-badge" alt="npm collaborators">
</p>

# Contributing / Developing

Contributions are welcome. Fork this repository and issue a pull request with your changes.

Please add new tests for new functionality, adapt the existing ones if needed, and make sure that `npm test` succeeds.

### Prerequisites
You need to have [Git](https://git-scm.com/downloads) and [npm](https://www.npmjs.com/get-npm) installed on your system.

### Setting up Dev
You'll need to clone the repository and install the required packages.
Just execute these commands:

```shell
git clone https://github.com/secure-rm/core.git
cd ./secure-rm/
npm install
```

### Building

```shell
npm run build
```

If you want to start compilation in watch mode:
```shell
npm run watch-ts
```

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).


### Tests

This project uses the framework [Jest](https://jestjs.io/). Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

Simply run `jest` to run the tests.

There are not enough tests, you can add more.

### Style guide

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

This project uses [JavaScript Standard Style](https://cdn.rawgit.com/standard/standard/master/badge.svg). Please respect this convention.

You can install a [plugin](https://standardjs.com/awesome.html#editor-plugins) for your favorite editor if you want.

### Pull request

Please follow the [pull request template](./github/PULL_REQUEST_TEMPLATE/pull_request_template.md).

### Deploying / Publishing

Submit a pull request after running `npm run build` to ensure it runs correctly.
The package is automatically published to npm when a new release is published on github.
