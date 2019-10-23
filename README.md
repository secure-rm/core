<h1 align="center">
  <img src="./assets/secure-rm.png" alt="secure-rm">
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
  <a href="https://codecov.io/gh/secure-rm/core"><img src="https://img.shields.io/codecov/c/github/secure-rm/core?style=flat-square" alt="Code coverage"></a>
  
</p>

## ❓ Why

When you delete a file using the `rm` command or `fs.unlink` in node, it only removes direct pointers to the data disk sectors and make the data recovery possible with common software tools.

Permanent data erasure goes beyond basic file deletion commands, which:
1. Allow for selection of a specific standard, based on unique needs, and
2. Verify the overwriting method has been successful and removed data across the entire device.

## 📦 Install

To install this package, just run: (Node and npm required)

```shell
npm install secure-rm
```

Looking for a **command line interface**? See: [secure-rm-cli](https://www.npmjs.com/package/secure-rm-cli)

Secure-rm will retry 3 times if an error occur to ensure the task succeeded.

## 🚀 Getting started

If you want your application to delete specific files with a pass of cryptographically strong pseudo-random data, use one of these code snippets:

### Callback version

```javascript
const srm = require('secure-rm')

srm('./folder/*.js', (err, path) => {
  if (err) throw err
  console.log(`Successfully removed ${path} !`)
})
```

### Promise version

```javascript
const srm = require('secure-rm')

srm('./folder/*.js')
  .then((path) => console.log(`Successfully removed ${path} !`))
  .catch((err) => {throw err})
```

## 📚 Usage

**`rm(path[, options] [, callback])`**

- `path` [\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) :
  - an absolute path (e.g. `D:\data`, `/d/data`);
  - a relative path (e.g. `./data/file.js`, `../../data`);
  - a [glob pattern](https://www.npmjs.com/package/glob#glob-primer) (e.g. `./*.js`, `./**/*`, `@(pattern|pat*|pat?erN)`).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (optional) :
  - `standard` [\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) : ID of the standard (default: 'secure');
  - `customStandard` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) : your own standard to remove a file (if specified, priority over `standard`);
  - `maxBusyTries` [\<Number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) : number of retries if an error occur;
  - `disableGlob` [\<Boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) : allow or not file globbing (default: true).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) (if missing, return a promise):
  - returns `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) when finished.

### Examples:
```javascript
const options = {
  standard: 'gutmann',
  maxBusyTries: 5,
  disableGlob: true
}

srm('./data/file*.js', options, (err, path) => {
  if (err) throw err
  console.log(`Successfully removed ${path} !`)
})
```

```javascript
const options = {
  customStandard: new srm.UnlinkStandard({
    method: function (file, callback) {
    srm.write.init(file)
      .then(({ fileSize, file }) => srm.write.zeroes(file, fileSize))
      .then(({ fileSize, file }) => srm.write.ones(file, fileSize))
      .then(({ fileSize, file }) => srm.write.random(file, fileSize))
      .then(({ file }) => srm.write.unlink(file))
      .then(() => callback())
      .catch((err) => callback(err))
  })
}

srm('./*', options)
  .then((path) => console.log(`Successfully removed ${path} !`))
  .catch((err) => {throw err})
```

If you want to make your own custom standard, see [write.js](./lib/write.js) file for more details.

### Events
When running, secure-rm emits events to let you know the progression of the deletion.

You can indeed intercept error and ending events for _each_ file.

```javascript
srm.event.on('start', (file) => console.log('Starting ' + file))
srm.event.on('unlink', (file) => console.log('Unlinking ' + file))
srm.event.on('done', (file) => console.log('Done ' + file))

srm.event.on('info', (file, info) => console.log('Info ' + info + file))

srm.event.on('warn', (file, err) => console.log('Warning ' + err + file))
srm.event.on('error', (file, err) => console.log('Error ' + err + file))
```

### The `srm` Object

When you import the library, you can do this in two different ways:
```javascript
const srm = require('secure-rm')
```
And then get the properties:
```javascript
srm.event
srm.write
srm.validIDs
...
```
Or you can import each property:
```javascript
import srm, { event, write, standard, validIDs, UnlinkStandard } from 'secure-rm'
// Or
const { event, write, standards, validIDs, UnlinkStandard } = require('secure-rm')
```

It is structured as follows:

`srm` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) :
The main function, as described [above](#-usage).
- `event` [\<events.EventEmitter\>](https://nodejs.org/dist/latest-v12.x/docs/api/events.html) : event object to follow the process, as described [above](#-events);
- `write` [Object\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) : the object containing writing funtions, see [write.js](./lib/write.js);
- `standard` [Object\<UnlinkStandard\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) : the object containing the standards;
- `validIDs` [Array\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) : array containing valid text IDs of standards;
- `UnlinkStandard` [\<UnlinkStandard\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) : the class to create new standards.

## Standards

ID | Name | Passes | Description
-- | ---- | ------ | -----------
 randomData | Pseudorandom data | 1 | Also known as "Australian Information Security Manual Standard ISM 6.2.92"<br>and "New Zealand Information and Communications Technology Standard NZSIT 402" <br>Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)
 randomByte | Pseudorandom byte | 1 | Overwriting with a random byte.
 zeroes | Zeroes | 1 | Overwriting with zeroes.
 ones | Ones | 1 | Overwriting with ones.
 secure | **Secure-rm standard** | 3 | Pass 1: Overwriting with random data;<br>Pass 2: Renaming the file with random data;<br>Pass 3: Truncating between 25% and 75% of the file.
 GOST_R50739-95 | Russian State Standard GOST R 50739-95 | 2 | Pass 1: Overwriting with zeroes;<br>Pass 2: Overwriting with random data.
 HMG_IS5 | British HMG Infosec Standard 5 | 3 | Also known as "Air Force System Security Instructions AFSSI-5020",<br>"Standard of the American Department of Defense (DoD 5220.22 M)"<br>"National Computer Security Center NCSC-TG-025 Standard"<br>and "Navy Staff Office Publication NAVSO P-5239-26"<br>Pass 1: Overwriting with zeroes;<br>Pass 2: Overwriting with ones;<br>Pass 3: Overwriting with random data as well as verifying the writing of this data.
 AR380-19 | US Army AR380-19 | 3 | Pass 1: Overwriting with random data;<br>Pass 2: Overwriting with a random byte;<br>Pass 3: Overwriting with the complement of the 2nd pass, and verifying the writing.
 VSITR | Standard of the Federal Office for Information Security (BSI-VSITR)| 7 | Also known as "Royal Canadian Mounted Police TSSIT OPS-II"<br>Pass 1: Overwriting with zeroes;<br>Pass 2: Overwriting with ones;<br>Pass 3-6: Same as 1-2;<br>Pass 7: Overwriting with a random data as well as review the writing of this character.
 schneier | Bruce Schneier Algorithm | 7 | Pass 1: Overwriting with zeros;<br>Pass 2: Overwriting with ones;<br>Pass 3-7: Overwriting with random data.
 pfitzner | Pfitzner Method | 33 | Pass 1-33: Overwriting with random data.
 gutmann | Peter Gutmann Algorithm | 35 | Pass 1-4: Overwriting with random data;<br>Pass 5: Overwriting with 0x55;<br>Pass 6: Overwriting with 0xAA;<br>Pass 7-9: Overwriting with 0x92 0x49 0x24, then cycling through the bytes;<br>Pass 10-25: Overwriting with 0x00, incremented by 1 at each pass, until 0xFF;<br>Pass 26-28: Same as 7-9;<br>Pass 29-31: Overwriting with 0x6D 0xB6 0xDB, then cycling through the bytes;<br>Pass 32-35: Overwriting with random data.

Note: Node ensures that the file is correctly written, checking the writing in these algorithms is unnecessary. (Report this if I'm wrong)

## 🚩 Troubleshooting / Common issues

Should work on OS X, Linux (almost, see below), and Windows. (See build status)

### File systems

secure-rm will only work on file systems that overwrite blocks in place.

List of known file systems that will not work:
- ext3
- ext4
- AthFS – AtheOS
- OneFS
- ssd's at large
- reiserfs
- ...
- especially on the vast majority of
journaled file systems.

### "WARN Too many open files, cannot ...:"

Don't worry, you've just submitted too much file for Node.
The tool will retry 3 times to ensure the task succeeded.
While you don't get an error, the tool can handle this issue.

If you really need to delete millions of file in one time, split the task (e.g. ./your_folder/a* then ./your_folder/b* ...).

### Using Windows:

Be sure to use `".\path\file"` with double quotes since back-slashes will always be interpreted as escape characters, not path separators.

Another solution is to double the back-slashes like: `.\\path\\file`

Or if you can, use forward slashes!

## 📜 Changelog

See the [changelog](/CHANGELOG.md) or [releases](https://github.com/oganexon/secure-rm/releases).

## 📌 TODO

- [ ] Implement more tests
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
