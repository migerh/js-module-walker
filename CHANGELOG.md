# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [Unreleased]
### Added
- Parse `require()` calls to analyze projects that do not (exclusively) use es6
import syntax.

### Changed
- Remove the babel dependency from production code to make the build step
obsolete. `js-module-walker` can now be installed directly from the github
repository.

## [0.2.0] - 2017-04-26
### Changed
- Uee babylon instead of regex to parse for import statements.
- Allow non-top-level `import` statements.
- Prefer `.jsx` files before `.js` files.

## [0.1.0] - 2017-01-06
### Added
- Initial release.

[Unreleased]: https://github.com/migerh/js-module-walker/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/migerh/js-module-walker/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/migerh/js-module-walker/compare/7c6f0abb9705a...v0.1.0