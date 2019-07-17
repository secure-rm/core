![Logo of the project](./assets/secure-rm.png)

[![Version](https://img.shields.io/npm/v/secure-rm.svg)](https://npmjs.org/package/secure-rm)
[![Downloads/week](https://img.shields.io/npm/dw/secure-rm.svg)](https://npmjs.org/package/secure-rm)
[![License](https://img.shields.io/npm/l/secure-rm.svg)](https://github.com/MaelAcier/secure-rm/blob/master/package.json)
[![](https://img.shields.io/badge/status-STILL_IN_BETA-red.svg)]()

**WARNING** THIS TOOL IS STILL IN DEVELOPEMENT, USE IT AT YOUR OWN RISKS!
The documentation is not complete either.

Completely erases files by making recovery impossible.

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

rm('./folder/*.js', '1', (err) => {
  if (err) throw err
  console.log('Success!')
})
```

If you want to delete files on the fly, just use the command line tool:
```shell
$ secure-rm ./folder/*.js
```

# Documentation

## npm module 

```javascript
rm(path, method, callback)
```
It will search for files if the path is a glob pattern, or the folder/file specified.
You have to specify a method, they are described below.
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
![Built-in help](./assets/built-in_help.png)

### Methods

ID | Name | Passes | Description
-- | ---- | ------ | -----------
 0 | Pseudorandom data | 1 | The fastest wiping scheme. Your data is overwritten with random data (if you use a CSPRNG the data is indistinguishable from random noise.)
 1 | British HMG IS5(Baseline) | 1 | Your data is overwritten with zeroes.
 2 | Russian GOST P50739-95 | 2 | GOST P50739-95 wiping scheme calls for a single pass of zeroes followed by a single pass of random data.
 3 | British HMG IS5 (Enhanced) | 3 | British HMG IS5 (Enhanced) is a three pass overwriting algorithm: first pass – with zeroes, second pass – with ones and the last pass with random data.
 4 | US Army AR380-19 | 3 | AR380-19 is data wiping scheme specified and published by the U.S. Army. AR380-19 is three pass overwriting algorithm: first pass – with random data, second with a random byte and the third pass with the complement of the 2nd pass.
 5 | US Department of Defense DoD 5220.22-M (E) | 3 | DoD 5220.22-M (E) is a three pass overwriting algorithm: first pass – with zeroes, second pass – with ones and the last pass – with random data.

## Developing

### Built With
List main libraries, frameworks used including versions (React, Angular etc...)

### Prerequisites
What is needed to set up the dev environment. For instance, global dependencies or any other tools. include download links.


### Setting up Dev

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
git clone https://github.com/oganexon/secure-rm.git
cd secure-rm/
npm install
```

And state what happens step-by-step. If there is any virtual environment, local server or database feeder needed, explain here.

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

## Api Reference

If the api is external, link to api documentation. If not describe your api including authentication methods as well as explaining all the endpoints with their required parameters.


## Database

Explaining what database (and version) has been used. Provide download links.
Documents your database design and schemas, relations etc... 

## Licensing

State what the license is and how to find the text version of the license.

# Usage

# Commands

> Additional information or tag line

