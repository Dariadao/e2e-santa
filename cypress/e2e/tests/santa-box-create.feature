
Feature: The user can create a box and run it

  Scenario: The user logs in and creates a box
    Given the user is on the login page
    When the user logs in with table
      | login                                | password  |
      | daria361987+usertest-main@gmail.com  | qwerty123 |
      And the user creates a box
    Then the user is on the box page


  Scenario: The author adds participants in the box manually
    Given the user is on the box page
    When the author adds the following users
      | nameSelector                                  | emailSelector                                 | name      | email                  |
      | :nth-child(1) > .frm-wrapper > #input-table-0 | :nth-child(2) > .frm-wrapper > #input-table-0 | usertest4 | daria361987+usertest4@gmail.com |
      | :nth-child(3) > .frm-wrapper > #input-table-1 | :nth-child(4) > .frm-wrapper > #input-table-1 | usertest5 | daria361987+usertest5@gmail.com |
      | :nth-child(5) > .frm-wrapper > #input-table-2 | :nth-child(6) > .frm-wrapper > #input-table-2 | usertest6 | daria361987+usertest6@gmail.com |
    Then the participant's cards created successfuly


  Scenario: Add participants by sending a link and approve invitations
    Given the user navigates to the invite page for the box
    When the user gets the invite link
    And the user approves the invitation as "<email>" with "<password>"
    Then the notice for the participant displays
    Examples:
      | email                           | password  |
      | daria361987+usertest1@gmail.com | qwerty123 |
      | daria361987+usertest2@gmail.com | qwerty123 |
      | daria361987+usertest3@gmail.com | qwerty123 |


  Scenario: The author starts a draw
    Given the author logs in
    When the author is on the draw page
    And the author starts the draw
    Then the draws's list displays


  Scenario: The author deletes new box
    Given the author is on login page
    When the author logs in with data table
      | login                                | password  |
      | daria361987+usertest-main@gmail.com  | qwerty123 |
    Then the author deletes new box
