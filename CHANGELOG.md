# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--Types of changes
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security -->

<!-- ## [Unreleased] -->

## [4.0.0] - 2019-10-27

### Added
- Custom directory removal.
- More tests.
- Wiki.
- Preview standard.

### Changed
- Repository location.
- New custom standard syntax.

### Security
- Libraries update.

## [3.0.3] - 2019-08-30

### Fixed
- Default standard when none is provided. (Tests are now a priority)

## [3.0.2] - 2019-08-30

### Fixed
- Default standard when none is provided.

## [3.0.1] - 2019-08-30

### Security
- Bumped eslint-utils from 1.4.0 to 1.4.2 

## [3.0.0] - 2019-08-29

### Added
- Dependabot.

### Removed
- CLI support. See [secure-rm-cli](https://www.npmjs.com/package/secure-rm-cli)
- Unused packages.

## [2.0.1] - 2019-08-27

### Added
- Code coverage.

### Deprecated
- The CLI is deprecated, it moved over `secure-rm-cli`.

## [2.0.0] - 2019-08-26

### Added
- End message when the process is finished.
- Types definitions.
- Mute argument in cli.
- New badges in readme.
- Travis Continuous Integration.

### Changed
- All JavaScript files have been converted to TypeScript files.
- 'Method' is now 'standard' in the cli and in the lib.
- Custom standard has changed. See the doc.

### Soon deprecated
- CLI will be ported in its own package.

## [1.1.1] - 2019-08-20

### Added
- Comments on every file.
- Error recap at the end of the process.

## [1.1.0] - 2019-08-19

### Fixed
- Command line tool bugs with paths.

## [1.0.1] - 2019-08-16

Release of 1.0.0 (stable API)
(messed up 1.0.0 on npm so it's 1.0.1)

## [1.0.0-beta] - 2019-08-16

### Added
- More tests.

### Changed
- Documentation:
  - Windows advice.
  - Beautified the whole.

## [0.14.0] - 2019-08-15

### Added
- Changelog.
- Promises support.
- `options` argument in `srm` function:
  - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (optional) :
    - `method` [\<String\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) : ID of the method (default: 'secure');
    - `customMethod` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) : your own method to remove a file (if specified, priority over `method`);
    - `maxBusyTries` [\<Number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) : number of retries if an error occur;
    - `disableGlob` [\<Boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) : allow or not file globbing (default: true).
- CLI args accordingly.

### Changed
- Methods IDs are now textual rather than numerical.
- Args for `srm(path, methodID)` are now `srm(path, options)`.
- Updated documentation.
