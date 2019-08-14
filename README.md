<h1 align="center">
  <img src="./assets/secure-rm.png" alt="Logo of the project">
  <br>
  Completely erases files by making recovery impossible.
  <br>
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/secure-rm"><img src="https://img.shields.io/npm/v/secure-rm.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/secure-rm"><img src="https://img.shields.io/npm/dw/secure-rm.svg" alt="Downloads/week"></a>
  <a href="https://github.com/oganexon/secure-rm/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/secure-rm.svg" alt="License"></a>
</p>

> :warning: **WARNING** :warning: THIS TOOL IS STILL IN DEVELOPEMENT, USE IT AT YOUR OWN RISKS!
> But it will be ready soon...

## Install

You can use this package in two different ways, the _npm module version_:

```shell
$ npm install secure-rm --save
```

Or the _command-line version_:

```shell
$ npm install secure-rm -g
```

Secure-rm will retry 3 times if an error occur to ensure the task succeeded.

## Getting started

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

### Command line version

If you want to delete files on the fly, just use the command line tool:
```shell
$ secure-rm ./folder/*.js
```

## Usage

### npm module 

**`rm(path[, options] [, callback])`**

* `path` [\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) :
  * an absolute path (e.g. `D:\data`, `/d/data`)
  * a relative path (e.g. `./data/file.js`, `../../data`)
  * a [glob pattern](https://www.npmjs.com/package/glob#glob-primer) (e.g. `./*.js`, `./**/*`, `@(pattern|pat*|pat?erN)`)
* `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (optional) :
  * `method` [\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) : ID of the method (default: 'secure')
  * `customMethod` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) : your own method to remove a file (if specified, priority over `method`)
  * `maxBusyTries` [\<Number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) : number of retries if an error is encountered.
  * `disableGlob` [\<Boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) : allow or not file globbing (default: true)
* `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) (if missing, return a promise):
  * returns `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) when finished.

#### Examples:
```javascript
srm('./data/file.js', (err, path) => {
  if (err) throw err
  console.log(`Successfully removed ${path} !`)
})

srm('/data/*.js', 7, (err, path) => {
  if (err) throw err
  console.log(`Successfully removed ${path} !`)
})

srm('./*')
  .then((path) => console.log(`Successfully removed ${path} !`))
  .catch((err) => {throw err})

srm('./folder/*.js', 5)
  .then((path) => console.log(`Successfully removed ${path} !`))
  .catch((err) => {throw err})

```

#### Events
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

### Command line tool
```shell
$ secure-rm <PATHS> [OPTIONS]
```
* `PATHS`:
  * one or multiple paths (e.g. `D:\data /d/data ./data/file.js ../../data`)
  * supports [glob patterns](https://www.npmjs.com/package/glob#glob-primer) (e.g. `./*.js ./**/* @(pattern|pat*|pat?erN)`)
* `OPTIONS` (flags):
  * `-f, --force`: avoid checks if you want to use it in a shell or bash file;
  * `-h, --help`: show CLI help, see below;
  * `-m, --method`: numerical ID of the method, default is 0. See them detailed below;
  * `-t, --table `: show the methods table. See them detailed below;
  * `-v, --version ` show CLI version.

Example:
```shell
$ secure-rm ./folder/*.js ./garbage ./file.js -m 6 -f
```
You can invoke the built-in help with `secure-rm -h`:

<!--AUTO GENERATED HELP START-->
```shell
CLI help:

USAGE
  $ secure-rm PATH

OPTIONS
  -f, --force                             avoid checks
  -h, --help                              show CLI help
  -m, --method=0|1|2|3|4|5|6|7|8|9|10|11  select the erasure method
  -t, --table                             show the methods table
  -v, --version                           show CLI version

DESCRIPTION
  Completely erases files by making recovery impossible.
  For extra documentation, go to https://www.npmjs.com/package/secure-rm


```
<!--AUTO GENERATED HELP END-->

### Methods

<!--AUTO GENERATED METHODS TABLE START-->
ID | Name | Passes | Description
-- | ---- | ------ | -----------
 randomData | Pseudorandom data | 1 | Also kwown as "Australian Information Security Manual Standard ISM 6.2.92"<br>and "New Zealand Information and Communications Technology Standard NZSIT 402" <br>Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)
 randomByte | Pseudorandom byte | 1 | Overwriting with a random byte.
 zeroes | Zeroes | 1 | Overwriting with zeroes.
 ones | Ones | 1 | Overwriting with ones.
 secure | **Secure-rm method** | 3 | Pass 1: Overwriting with random data;<br>Pass 2: Renaming the file with random data;<br>Pass 3: Truncating between 25% and 75% of the file.
 GOST_R50739-95 | Russian State Standard GOST R 50739-95 | 2 | Pass 1: Overwriting with zeroes;<br>Pass 2: Overwriting with random data.
 HMG_IS5 | British HMG Infosec Standard 5 | 3 | Also known as "Air Force System Security Instructions AFSSI-5020",<br>"Standard of the American Department of Defense (DoD 5220.22 M)"<br>"National Computer Security Center NCSC-TG-025 Standard"<br>and "Navy Staff Office Publication NAVSO P-5239-26"<br>Pass 1: Overwriting with zeroes;<br>Pass 2: Overwriting with ones;<br>Pass 3: Overwriting with random data as well as verifying the writing of this data.
 AR380-19 | US Army AR380-19 | 3 | Pass 1: Overwriting with random data;<br>Pass 2: Overwriting with a random byte;<br>Pass 3: Overwriting with the complement of the 2nd pass, and verifying the writing.
 VSITR | Standard of the Federal Office for Information Security (BSI-VSITR)| 7 | Also known as "Royal Canadian Mounted Police TSSIT OPS-II"<br>Pass 1: Overwriting with zeroes;<br>Pass 2: Overwriting with ones;<br>Pass 3-6: Same as 1-2;<br>Pass 7: Overwriting with a random data as well as review the writing of this character.
 schneier | Bruce Schneier Algorithm | 7 | Pass 1: Overwriting with zeros;<br>Pass 2: Overwriting with ones;<br>Pass 3-7: Overwriting with random data.
 pfitzner | Pfitzner Method | 33 | Pass 1-33: Overwriting with random data.
 gutmann | Peter Gutmann Algorithm | 35 | Pass 1-4: Overwriting with random data;<br>Pass 5: Overwriting with 0x55;<br>Pass 6: Overwriting with 0xAA;<br>Pass 7-9: Overwriting with 0x92 0x49 0x24, then cycling through the bytes;<br>Pass 10-25: Overwriting with 0x00, incremented by 1 at each pass, until 0xFF;<br>Pass 26-28: Same as 7-9;<br>Pass 29-31: Overwriting with 0x6D 0xB6 0xDB, then cycling through the bytes;<br>Pass 32-35: Overwriting with random data.
<!--AUTO GENERATED METHODS TABLE END-->

Note: Node ensures that the file is correctly written, checking the writing in these algorithms is unnecessary.

## Troubleshooting / Common issues

### "WARN Too many open files, cannot ...:"

Don't worry, you've just submited too much file for Node.
The tool will retry 3 times to ensure the task succeeded.
While you don't get an error, the tool can handle this issue.

If you really need to delete millions of file in one time, split the task (e.g. ./your_folder/a* then ./your_folder/b* ...).

## Changelog

See the [changelog](/CHANGELOG.md) or [releases](https://github.com/oganexon/secure-rm/releases).

## TODO

- [ ] Release of 1.0.0 (stable API)
- [ ] Implement more tests
- [ ] TypeScript
- [ ] Support of 64bit files

## Contributing

See [contributing guidelines](/CONTRIBUTING.md)

### Licensing

This project is under [MIT License](/LICENSE).
