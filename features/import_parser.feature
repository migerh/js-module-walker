Feature: js-module-walker resolves dependencies between files

  Background:
    Given a directory named "source"
    And a file named "source/file2.js" with:
    """
    import stuff from './sub/file1';
    import fs from 'fs';
    """
    And a directory named "source/sub"
    And a file named "source/sub/file1.js" with:
    """
    import stuff from '../file2';
    """

  Scenario: A local dependency is found when the module is imported with import
    When I run `js-module-walker ./source/file2.js ./source/sub/file1.js`
    Then the output should contain:
    """
    "file2.js" -> "sub/file1.js"
    """

  Scenario: An npm dependency is found when the package is imported with import
    When I run `js-module-walker ./source/file2.js`
    Then the output should contain:
    """
    "file2.js" -> "fs"
    """