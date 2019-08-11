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

Choose one of the multiple methods provided (8 to date), it's up to you!

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

If you want your application to delete specific files with a pass of cryptographically strong pseudo-random data, use this code snippet:
```javascript
const rm = require('secure-rm')

rm('./folder/*.js', (err) => {
  if (err) throw err
  console.log('Success!')
})
```

If you want to delete files on the fly, just use the command line tool:
```shell
$ secure-rm ./folder/*.js
```

## Usage

### npm module 

**`rm(path[, method], callback)`**

* `path` [\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type):
  * an absolute path (e.g. `D:\data`, `/d/data`)
  * a relative path (e.g. `./data/file.js`, `../../data`)
  * a [glob pattern](https://www.npmjs.com/package/glob#glob-primer) (e.g. `./*.js`, `./**/*`, `@(pattern|pat*|pat?erN)`)
* `method` [\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (optional):
  * By default, method 0 (Pseudorandom data)
  * You can pick another one, they are described below.
* `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  * returns `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) when finished.

Example:
```javascript
rm('./data/file.js', '7' (err) => {
  if (err) throw err
  console.log('Success!')
})
```

#### Events
When running, secure-rm emits events to let you know the progression of the deletion.

You can indeed intercept error and ending events for _each_ file.

```javascript
rm.event.on('start', (file) => console.log('Starting ' + file))
rm.event.on('unlink', (file) => console.log('Unlinking ' + file))
rm.event.on('done', (file) => console.log('Done ' + file))

rm.event.on('info', (file, info) => console.log('Info ' + info + file))

rm.event.on('warn', (file, err) => console.log('Warning ' + err + file))
rm.event.on('error', (file, err) => console.log('Error ' + err + file))
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
  -f, --force                       avoid checks
  -h, --help                        show CLI help
  -m, --method=0|1|2|3|4|5|6|7|8|9  select the erasure method
  -t, --table                       show the methods table
  -v, --version                     show CLI version

DESCRIPTION
  Completely erases files by making recovery impossible.
  For extra documentation, go to https://www.npmjs.com/package/secure-rm


```
<!--AUTO GENERATED HELP END-->

### Methods

<!--AUTO GENERATED METHODS TABLE START-->
ID | Name | Passes | Description
-- | ---- | ------ | -----------
 0 | Pseudorandom data | 1 | Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)
 1 | Pseudorandom byte | 1 | Overwriting with a random byte.
 2 | Zeroes | 1 | Overwriting with zeroes.
 3 | Ones | 1 | Overwriting with ones.
 4 | Russian GOST P50739-95 | 2 | Pass 1: Overwriting with zeroes;<br>Pass 2: Overwriting with random data.
 5 | British HMG Infosec Standard 5 | 3 | Pass 1: Overwriting with zeroes;<br>Pass 2: Overwriting with ones;<br>Pass 3: Overwriting with random data as well as verifying the writing of this data.
 6 | US Army AR380-19 | 3 | Pass 1: Overwriting with random data;<br>Pass 2: Overwriting with a random byte;<br>Pass 3: Overwriting with the complement of the 2nd pass, and verifying the writing.
 7 | Bruce Schneier Algorithm | 7 | Pass 1: Overwriting with zeros;<br>Pass 2: Overwriting with ones;<br>Pass 3-7: Overwriting with random data.
 8 | Bruce Schneier Algorithm | 33 | Pass 1-33: Overwriting with random data.
 9 | Peter Gutmann Algorithm | 35 | Pass 1-4: Overwriting with random data;<br>Pass 5: Overwriting with 0x55;<br>Pass 6: Overwriting with 0xAA;<br>Pass 7-9: Overwriting with 0x92 0x49 0x24, then cycling through the bytes;<br>Pass 10-25: Overwriting with 0x00, incremented by 1 at each pass, until 0xFF;<br>Pass 26-28: Same as 7-9;<br>Pass 29-31: Overwriting with 0x6D 0xB6 0xDB, then cycling through the bytes;<br>Pass 32-35: Overwriting with random data.
<!--AUTO GENERATED METHODS TABLE END-->

## Troubleshooting / Common issues

### "WARN Too many open files, cannot ...:"

Don't worry, you've just submited too much file for Node.
The tool will retry 3 times to ensure the task succeeded.
While you don't get an error, the tool can handle this issue.

If you really need to delete millions of file in one time, split the task (e.g. ./your_folder/a* then ./your_folder/b* ...).

## Developing

### Prerequisites
You need to have [Git](https://git-scm.com/downloads) and [npm](https://www.npmjs.com/get-npm) installed on your system.

### Setting up Dev
You'll need to clone the repository and install the required packages.
Just execute these commands:

```shell
git clone https://github.com/oganexon/secure-rm.git
cd ./secure-rm/
npm install
```
To invoke the command line tool, run:
```shell
npm start -- [ARGS]
```

<!--### Deploying / Publishing
give instructions on how to build and release a new version
In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

```shell
packagemanager deploy your-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.
-->

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).

<!--## Configuration

Here you should write what are all of the configurations a user can enter when
using the project.
-->

### Tests

> Soon
<!--
Describe and show how to run the tests with code examples.
Explain what these tests test and why.

```shell
Give an example
```
-->

### Style guide

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

This project uses [JavaScript Standard Style](https://cdn.rawgit.com/standard/standard/master/badge.svg). Please respect this convention.

We provide an easy installation for you, just run:
```shell
$ npm run style-setup
```

And then `npm run style` each time you want to check style.

Or install a [plugin](https://standardjs.com/awesome.html#editor-plugins) for your favorite editor and ignore the recommandations above.

### Licensing

This project is under [MIT License](/LICENSE).
