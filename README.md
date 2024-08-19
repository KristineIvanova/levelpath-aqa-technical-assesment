# Automated tests for e-CSDD system

This repository contains automated tests written in Playwright and TypeScript to ensure the e-CSDD system is working as expected.

## Tests overview

We have three main tests to verify the system's functionality.

### Test 1: User profile verification

1. Make sure you're logged into the e-CSDD system.
2. Go to the user profile page by clicking on your profile icon/avatar and then "Edit Profile".
3. Check that the page displays the email address you used to log in.

### Test 2: Vehicle registry search

1. Make sure you're logged into the e-CSDD system.
2. Go to the Vehicle Registry page.
3. Search for vehicles using specific criteria: Mark (Citroen), Model (C3), Fuel type (Petrol), Transmission type (Manual), and Price range (500-10,000).
4. Verify that the search results match your expectations.
5. Click on the first result and check that the car info page displays the correct details.

### Bonus test: Negative case

1. Test what happens when the search returns no results.

## Setting up and running the tests

To get started, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Run the tests using `npx playwright test`.

## Additional Information

- **Playwright Documentation:** [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
- **TypeScript Documentation:** [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
