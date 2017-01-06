Feature: js-module-walker can filter some dependencies

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

  Scenario: The npm dependency 'fs' is ignored when the --ignore-packages flag is provided
    When I run `js-module-walker --ignore-packages ./source/file2.js ./source/sub/file1.js`
    Then the output should contain:
    """
    digraph dependencies {
      "file2.js" -> "sub/file1.js"
      "sub/file1.js" -> "file2.js"
    }
    """