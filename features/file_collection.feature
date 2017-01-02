Feature: js-module-walker collects files

  Background:
    Given a directory named "source"
    And a file named "source/file2.js" with:
    """
    import stuff from './sub/file1';
    """
    And a directory named "source/sub"
    And a file named "source/sub/file1.js" with:
    """
    import stuff from '../file2';
    """

  Scenario: User can provide a folder and the source files in this folder are considered
    When I run `js-module-walker ./source`
    Then the output should contain:
    """
    "file2.js" -> "sub/file1.js"
    """

  Scenario: Folders are traversed recursively
    When I run `js-module-walker ./source`
    Then the output should contain:
    """
    "file2.js" -> "sub/file1.js"
    """
    And the output should contain:
    """
    "sub/file1.js" -> "file2.js"
    """
