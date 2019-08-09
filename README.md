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
  <img src="https://img.shields.io/badge/status-STILL_IN_BETA-red.svg">
</p>

> :warning: **WARNING** :warning: THIS TOOL IS STILL IN DEVELOPEMENT, USE IT AT YOUR OWN RISKS!
> The documentation is not complete either.

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

## Command line tool

```shell
$ secure-rm <PATHS> [OPTIONS]
```
The tool supports file globbing and multiple arguments like:
```shell
$ secure-rm ./folder/*.js ./garbage ./file.js
```
The different flags are detailed in the built-in help:
```shell
$ secure-rm -h

USAGE
  $ secure-rm PATH

OPTIONS
  -f, --force               avoid checks
  -h, --help                show CLI help
  -m, --method=0|1|2|3|4|5  erasure method
  -t, --table               show the methods table
  -v, --version             show CLI version
```

### Methods

ID | Name | Passes | Description
-- | ---- | ------ | -----------
 0 | Pseudorandom data | 1 | Your data is overwritten with cryptographically strong pseudo-random data. (The data is indistinguishable from random noise.)
 1 | Pseudorandom byte | 1 | Overwriting with a random byte.
 2 | Zeroes | 1 | Overwriting with zeroes.
 3 | Ones | 1 | Overwriting with ones.
 4 | Russian GOST P50739-95 | 2 | Pass 1: Overwriting with zeroes; \nPass 2: Overwriting with random data.
 5 | British HMG Infosec Standard 5 | 3 | Pass 1: Overwriting with zeroes;
Pass 2: Overwriting with ones;
Pass 3: Overwriting with random data as well as verifying the writing of this data.
 6 | US Army AR380-19 | 3 | Pass 1: Overwriting with random data;
Pass 2: Overwriting with a random byte;
Pass 3: Overwriting with the complement of the 2nd pass, and verifying the writing.
 7 | US Department of Defense DoD 5220.22-M (E) | 3 | Pass 1: Overwriting with zeroes as well as checking the writing;
Pass 2: Overwriting with ones and checking the writing;
Pass 3: Overwriting with random data as well as verifying the writing.

## Developing

### Main packages
* [oclif](https://github.com/oclif/oclif) : CLI Framework
* [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) : interactive command line user interfaces

### Prerequisites
You need to have [Git](https://git-scm.com/downloads) and [npm](https://www.npmjs.com/get-npm) installed on your system.

### Setting up Dev
You'll need to clone the repository and install the required packages.
Just execute these commands:

```shell
git clone https://github.com/oganexon/secure-rm.git
cd secure-rm/
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

## Api Reference

If the api is external, link to api documentation. If not describe your api including authentication methods as well as explaining all the endpoints with their required parameters.


## Database

Explaining what database (and version) has been used. Provide download links.
Documents your database design and schemas, relations etc... 

## Licensing

State what the license is and how to find the text version of the license.


