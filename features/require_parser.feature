Feature: js-module-walker resolves dependencies between files

  Background:
    Given a directory named "source"
    And a file named "source/file2.js" with:
    """
    const stuff = require('./sub/file1'),
      fs = require('fs');
    """
    And a directory named "source/sub"
    And a file named "source/sub/file1.js" with:
    """
    const stuff = require('../file2');
    """

  Scenario: A local dependency is found when the module is imported with require
    When I run `js-module-walker ./source/file2.js ./source/sub/file1.js`
    Then the output should contain:
    """
    "file2.js" -> "sub/file1.js"
    """

  Scenario: An npm dependency is found when the package is imported with require
    When I run `js-module-walker ./source/file2.js`
    Then the output should contain:
    """
    "file2.js" -> "fs"
    """
  
  Scenario: Calls to require are also find below if statements
    Given a file named "source/file3.js" with:
    """
    if (true) {
      fs = require('fs');
    }
    """
    When I run `js-module-walker ./source/file3.js`
    Then the output should contain:
    """
    "file3.js" -> "fs"
    """