Feature: Basic invocation

  Scenario: Run with no input arguments
    When I run `js-module-walker`
    Then the output should contain:
    """
    No path given.
    """

  Scenario: Run with a path provided
    Given a directory named "source"
    When I run `js-module-walker ./source`
    Then the output should contain:
    """
    digraph
    """