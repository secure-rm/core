<h1 align="center">
  <img src="./assets/secure-rm.png" alt="Logo of the project">
  <br>
  Completely erases files by making recovery impossible.
  <br>
  <br>
</h1>

<p align="center">
  <a href="https://travis-ci.org/standard/standard"><img src="https://img.shields.io/npm/v/secure-rm.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/standard"><img src="https://img.shields.io/npm/dw/secure-rm.svg" alt="Downloads/week"></a>
  <a href="https://www.npmjs.com/package/eslint-config-standard"><img src="https://img.shields.io/npm/l/secure-rm.svg" alt="License"></a>
</p>

> :warning: **WARNING** :warning: THIS TOOL IS STILL IN DEVELOPEMENT, USE IT AT YOUR OWN RISKS!
> But it will be ready soon...

# Installing

You can use this package in two different ways, the _npm module version_:

```shell
$ npm install secure-rm --save
```

Or the _command-line version_:

```shell
$ npm install secure-rm -g
```

# Getting started

If you want your application to delete specific files with a single pass (method 1), use this code snippet:
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

# Documentation / Usage

## npm module 

```javascript
rm(path, [method,[ callback)
```
It will search for files if the path is a glob pattern, or the folder/file specified.
By default, method 1 is chosen. (British HMG IS5(Baseline))
You can pick another one, they are described below.
The function (asynchronous) then run the callback when all the files has been removed.

### Events

```javascript
rm.event.on('starting', (file) => console.log('Starting ' + file))
rm.event.on('unlinking', (file) => console.log('Unlinking ' + file))
rm.event.on('done', (file) => console.log('Done ' + file))

rm.event.on('info', (file, info) => console.log('Info ' + info + file))

rm.event.on('warn', (file, err) => console.log('Warning ' + err + file))
rm.event.on('error', (file, err) => console.log('Error ' + err + file))
```

## Command line tool
```shell
$ secure-rm <PATHS> [OPTIONS]
```
The tool supports file globbing and multiple arguments like:
```shell
$ secure-rm ./folder/*.js ./garbage ./file.js
```
The different flags are detailed in the built-in help:

<!--AUTO GENERATED HELP START-->
```shell
CLI help:

USAGE
  $ secure-rm PATH

OPTIONS
  -f, --force                   avoid checks
  -h, --help                    show CLI help
  -m, --method=0|1|2|3|4|5|6|7  select the erasure method
  -t, --table                   show the methods table
  -v, --version                 show CLI version

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
 7 | US Department of Defense DoD 5220.22-M (E) | 3 | Pass 1: Overwriting with zeroes as well as checking the writing;<br>Pass 2: Overwriting with ones and checking the writing;<br>Pass 3: Overwriting with random data as well as verifying the writing.
<!--AUTO GENERATED METHODS TABLE END-->

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
You are ready to develop.

### Deploying / Publishing
give instructions on how to build and release a new version
In case there's some step you have to take that publishes this project to a
server, this is the right time to state it.

```shell
packagemanager deploy your-project -s server.com -u username -p password
```

And again you'd need to tell what the previous code actually does.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).


## Configuration

Here you should write what are all of the configurations a user can enter when
using the project.

## Tests

Describe and show how to run the tests with code examples.
Explain what these tests test and why.

```shell
Give an example
```

## Style guide

Explain your code style and show how to check it.

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Licensing

State what the license is and how to find the text version of the license.


