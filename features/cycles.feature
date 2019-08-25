Feature: js-module-walker can find cyclic dependencies

  Background:
    Given a directory named "source"
    And a directory named "result"
    And a file named "source/file2.js" with:
    """
    import stuff from './sub/file1';
    import stuff2 from './sub/file3';
    import fs from 'fs';
    """
    And a directory named "source/sub"
    And a file named "source/sub/file1.js" with:
    """
    import stuff from '../file2';
    """
    And a file named "source/sub/file3.js" with:
    """
    import fs from 'fs';
    """

  Scenario: js-module-walker will highlight cycles if requested
    When I run `js-module-walker --find-cycles ./source/file2.js ./source/sub/file1.js ./source/sub/file3.js`
    Then the output should contain:
    """
    digraph dependencies {
      "file2.js" -> "sub/file1.js" [color=red]
      "file2.js" -> "sub/file3.js"
      "file2.js" -> "fs"
      "sub/file1.js" -> "file2.js" [color=red]
      "sub/file3.js" -> "fs"
    }
    """