<h1 align="center">
  <img src="./assets/logo.png" alt="secure-rm" width="25%">
  <br>
  <strong>Secure-rm</strong>
  <br>
</h1>
<p align="center">Data erasure solution for files and drives</p>

<p align="center">
  <a href="https://www.npmjs.com/package/secure-rm"><img src="https://img.shields.io/npm/v/secure-rm.svg?style=flat-square" alt="Version"></a>
  <a href="https://www.npmjs.com/package/secure-rm"><img src="https://img.shields.io/npm/dw/secure-rm.svg?style=flat-square" alt="Downloads/week"></a>
  <a href="https://github.com/oganexon/secure-rm/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/secure-rm.svg?style=flat-square" alt="License: MIT"></a>
</p>
<p align="center">
  <a href="https://github.com/secure-rm/core/actions?query=branch%3Amaster"><img alt="GitHub Workflow Status (branch)" src="https://img.shields.io/github/workflow/status/secure-rm/core/Node%20CI/master?style=flat-square&label=master%20build" alt="Build Status: master"></a>
  <a href="https://github.com/secure-rm/core/actions?query=branch%3Adevelop"><img alt="GitHub Workflow Status (branch)" src="https://img.shields.io/github/workflow/status/secure-rm/core/Node%20CI/develop?style=flat-square&label=dev%20build" alt="Build Status: develop"></a>
  <a href="https://coveralls.io/github/secure-rm/core"><img src="https://img.shields.io/coveralls/github/secure-rm/core?style=flat-square" alt="Code coverage"></a>
</p>

## ❓ Why

Secure-rm is composed of two parts: a Node.js module with a straightforward API and a [command line interface](https://www.npmjs.com/package/secure-rm-cli) optimized to delete files on the fly.

When you delete a file using the `rm` UNIX command or `fs.unlink` in node, it only removes direct pointers to the data disk sectors and make the data recovery possible with common software tools.

Permanent data erasure goes beyond basic file deletion commands, which:

1. Allow for selection of a specific standard, based on unique needs,
2. Verify the overwriting method has been successful and removed data across the entire device.

## 🔩 How It Works

The basic principle is to write files before deletion in order to make recovery harder. With secure-rm, you get to choose the standard that follow your needs. Each one is composed of instructions about how many passes it should perform.

It goes from a simple pass of zeros to a 35 passes algorithm. Secure-rm comes with its own algorithm to ensure your data is safe:

* A pass of cryptographically strong pseudo-random data,
* The file is then renamed,
* And finally truncated to hide the file size.

## ✨ Features

* [Choose your standard](https://docs.secure-rm.com/core/standards)
* [Create your own standard](https://docs.secure-rm.com/core/custom-standard)
  * [on files](https://docs.secure-rm.com/core/custom-standard/unlink-methods)
  * [on directories](https://docs.secure-rm.com/core/custom-standard/rmdir-methods)
* [Use events to follow the progression with huge files](https://docs.secure-rm.com/core/events.md)

### 📚 [Documentation](https://docs.secure-rm.com/core/getting-started)

## 📦 Installation

[Node](https://nodejs.org/) and [npm](https://www.npmjs.com/) required.

```shell
$ yarn add secure-rm
# or
$ npm install secure-rm
```

## 🚀 Quick Start

If you want your application to delete specific files with a pass of cryptographically strong pseudo-random data, use one of these code snippets:

```javascript
const srm = require('secure-rm')

srm.remove('./folder/file.js').result
  .then(() => console.log('Files successfully deleted !'))
  .catch(console.error)

// OR

srm.remove('./folder/file.js', (err) => {
  if (err) throw err
  console.log('Files successfully deleted !')
})
```

## 📋 Examples

```javascript
const options = {
  standard: srm.standards.gutmann,
  maxBusyTries: 5
}

srm.remove('./data/file.js', options).result
  .then(({count, index}) => console.log(`Successfully deleted ${count} files: ${index}`))
  .catch(console.error)

const events = srm.remove('./trash/dir/', { standard: srm.standards.schneier }, (err, {count, index}) => {
  if (err) throw err
  console.log(`Successfully deleted ${count} files: ${index}`))
})

event.on('removed', (fileName) => console.log(fileName))
```

## 📜 Changelog / History

See the [changelog](/CHANGELOG.md) or [releases](https://github.com/oganexon/secure-rm/releases).

## 🏗️ Contributing

<p align="center">
  <a href="https://libraries.io/npm/secure-rm"><img src="https://img.shields.io/librariesio/release/npm/secure-rm?style=flat-square&logo=npm" alt="Dependencies"></a>
  <img src="https://img.shields.io/github/contributors/secure-rm/core?style=flat-square" alt="Contributors">
  <img src="https://img.shields.io/github/last-commit/secure-rm/core/develop?style=flat-square" alt="Last commit">
  <img src="https://img.shields.io/npm/collaborators/secure-rm?style=flat-square" alt="npm collaborators">
</p>
<p align="center">
  <a href="https://jestjs.io"><img src="https://img.shields.io/badge/-jest-99424f?style=flat-square&logo=jest" alt="Tested with Jest"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/-node-gray?style=flat-square&logo=node.js" alt="Node version"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/-typescript-blue?style=flat-square&logo=typescript" alt="language"></a>
</p>

See [contributing guidelines](/CONTRIBUTING.md)

## Todo

[] Fix wipeDrive (removed from 5.0)

### Licensing

Icon library by [Icons8](https://icons8.com/).

This project is under [MIT License](/LICENSE).
