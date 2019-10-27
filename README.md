<h1 align="center">
  <img src="./assets/secure-rm-min.png" alt="secure-rm">
  <br>
  Completely erases files by making recovery impossible.
  <br>
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/secure-rm"><img src="https://img.shields.io/npm/v/secure-rm.svg?style=flat-square" alt="Version"></a>
  <a href="https://www.npmjs.com/package/secure-rm"><img src="https://img.shields.io/npm/dw/secure-rm.svg?style=flat-square" alt="Downloads/week"></a>
  <a href="https://github.com/oganexon/secure-rm/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/secure-rm.svg?style=flat-square" alt="License: MIT"></a>
</p>
<p align="center">
  <a href="https://actions-badge.atrox.dev/secure-rm/core/goto?ref=master"><img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fsecure-rm%2Fcore%2Fbadge%3Fref%3Dmaster&style=flat-square&label=master%20build" alt="Build Status: master"/></a>
  <a href="https://actions-badge.atrox.dev/secure-rm/core/goto?ref=develop"><img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fsecure-rm%2Fcore%2Fbadge%3Fref%3Ddevelop&style=flat-square&label=dev%20build" alt="Build Status: develop" /></a>
  <a href="https://coveralls.io/github/secure-rm/core"><img src="https://img.shields.io/coveralls/github/secure-rm/core?style=flat-square" alt="Code coverage"></a>
</p>

## ❓ Why

When you delete a file using the `rm` command or `fs.unlink` in node, it only removes direct pointers to the data disk sectors and make the data recovery possible with common software tools.

Permanent data erasure goes beyond basic file deletion commands, which:
1. Allow for selection of a specific standard, based on unique needs,
2. Verify the overwriting method has been successful and removed data across the entire device.

## 📦 Installation

[Node](https://nodejs.org/) and [npm](https://www.npmjs.com/) required.

```shell
npm install secure-rm
```

Looking for a **command line interface**? [Click here.](https://www.npmjs.com/package/secure-rm-cli)

## 🚀 Getting started

If you want your application to delete specific files with a pass of cryptographically strong pseudo-random data, use one of these code snippets:

### Callback version

```javascript
const srm = require('secure-rm')

srm('./folder/*.js', (err) => {
  if (err) throw err
  console.log('Files successfully deleted !')
})
```

### Promise version

```javascript
const srm = require('secure-rm')

srm('./folder/*.js')
  .then(() => console.log('Files successfully deleted !'))
  .catch((err) => {throw err})
```

## 📚 Usage

Visit the [wiki]((https://github.com/secure-rm/core/wiki)) to discover all the possibilities secure-rm offers!

- Choose a standard,
- Customize your standard,
- Respond to events,
- etc.

### Example:
```javascript
const options = {
  standard: 'gutmann',
  maxBusyTries: 5,
  disableGlob: true
}

srm('./data/file*.js', options, (err) => {
  if (err) throw err
  console.log('Files successfully deleted !')
})
```

## 📜 Changelog / History

See the [changelog](/CHANGELOG.md) or [releases](https://github.com/oganexon/secure-rm/releases).

## 📌 TODO

- [x] Implement more tests
- [ ] Support of 64bit files

## 🏗 Contributing

<p align="center">
  <a href="https://jestjs.io"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg?style=flat-square&logo=jest" alt="Tested with Jest"></a>
  <a href="https://www.npmjs.com"><img src="https://img.shields.io/librariesio/release/npm/secure-rm?style=flat-square&logo=npm" alt="Dependencies"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/secure-rm?style=flat-square" alt="Node version"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/github/languages/top/oganexon/secure-rm?style=flat-square" alt="language"></a>
</p>
<p align="center">
  <img src="https://img.shields.io/github/contributors/oganexon/secure-rm?style=flat-square" alt="Contributors">
  <img src="https://img.shields.io/github/last-commit/oganexon/secure-rm/develop?style=flat-square" alt="Last commit">
  <img src="https://img.shields.io/npm/collaborators/secure-rm?style=flat-square" alt="npm collaborators">
</p>

See [contributing guidelines](/CONTRIBUTING.md)

### Licensing

This project is under [MIT License](/LICENSE).
