# Contributing / Developing

Contributions are welcome. Fork this repository and issue a pull request with your changes.

Please add new tests for new functionality, adapt the existing ones if needed, and make sure that `npm test` succeeds.

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