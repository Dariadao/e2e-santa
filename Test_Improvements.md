# Test Improvements Documentation

## Changes

### Add pageLoadTimeout for Test Stability

Set pageLoadTimeout to 100000 milliseconds for better stability during slow page loads.

Lines 15
Cypress.config("pageLoadTimeout", 100000);

### Move Selectors to Fixtures

Move selectors to fixtures for easier maintenance and updates
Lines 53, 82

### Add Cookie to Fixtures

Move Cookie to fixtures for easier access and maintenance.
Line 145
