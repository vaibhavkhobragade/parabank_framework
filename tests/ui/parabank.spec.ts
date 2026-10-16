// import { test, expect } from '@playwright/test';
// //import { LoginPage } from '../../pages/LoginPage';
// import { OpenAccountPage } from '../pages/OpenAccountPage';
// import { LoanPage } from '../pages/LoanPage';
// import { createTestUser } from '../test-data';

// test('open checking account and apply for loan', async ({ page }) => {
//   const user = createTestUser();

//   // IMPORTANT:
//   // For an already registered user, load the saved credentials
//   // instead of generating a new username and password.
//   const loginPage = new LoginPage(page);
//   await loginPage.login(user.username, user.password);

//   // Step 1: Open Checking account.
//   const openAccountPage = new OpenAccountPage(page);
//   const checkingAccountId =
//     await openAccountPage.openCheckingAccount();

//   expect(checkingAccountId).toBeTruthy();

//   // Step 2: Apply for a loan using the generated account ID.
//   const loanPage = new LoanPage(page);

//   const loanAccountNumber = await loanPage.applyForLoan(
//     checkingAccountId,
//     5000, // Requested loan amount
//     1000  // Down payment
//   );

//   expect(loanAccountNumber).toBeTruthy();

//   console.log('Checking Account ID:', checkingAccountId);
//   console.log('Loan Account Number:', loanAccountNumber);
// });