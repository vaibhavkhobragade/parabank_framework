import { test, expect } from '@playwright/test';
import { createTestUser } from '../../utils/testData';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';
import { OpenAccountPage } from '../../pages/OpenAccountPage';
import { LoanPage } from '../../pages/LoanPage';
import { TransferFundsPage } from '../../pages/TransferFundsPage';
import { FindTransactionsPage } from '../../pages/FindTransactionsPage';

test('register user and complete loan workflow', async ({ page }) => {
  const user = createTestUser();

    const registerPage = new RegisterPage(page);
  await registerPage.register(user);

    const loginPage = new LoginPage(page);
   await loginPage.login(user.username, user.password);

});

test('Scenario B - aggregate transfer transactions', async ({ page }) => {
  // Replace these with account IDs captured in Scenario A.
 
  // Step 2: Generate a new user
  const user = createTestUser();

  // Step 3: Create the RegisterPage object
  const registerPage = new RegisterPage(page);

  // Step 4: Perform registration
  await registerPage.register(user);
  const originAccountId = 'YOUR_ORIGIN_ACCOUNT_ID';
  const destinationAccountId = 'YOUR_DESTINATION_ACCOUNT_ID';

  const expectedTransfers = [150.00, 25.50, 8.99];

  const transferPage = new TransferFundsPage(page);

  // Step 1: Execute three distinct transfers.
  for (const amount of expectedTransfers) {
    await transferPage.transferFunds(
      originAccountId,
      destinationAccountId,
      amount
    );
  }
});


  // Next:
  // 1. Open a Checking account.
  // 2. Capture the generated account number.
  // 3. Wait for the account ID to appear in the loan dropdown.
  // 4. Submit the loan request.
  // 5. Assert the approval status.
  // 6. Verify the loan account and deposited balance.



