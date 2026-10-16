import { Page, expect } from '@playwright/test';

export class OpenAccountPage {
  constructor(private page: Page) {}

  async openCheckingAccount(): Promise<string> {
    await this.page.goto('/openaccount.htm');

    // Select Checking as the account type.
    await this.page.locator('#type').selectOption({ label: 'CHECKING' });

    // Select an existing account to fund the new account.
    const fundingAccount = this.page.locator('#fromAccountId');
    await expect(fundingAccount.locator('option').nth(1))
      .toBeAttached();

    await fundingAccount.selectOption({
      index: 1,
    });

    // Submit the account-opening request.
    await this.page.getByRole('button', {
      name: /open new account/i,
    }).click();

    // Wait for the new account confirmation.
    const confirmation = this.page.locator('#newAccountId');
    await expect(confirmation).toBeVisible();

    const accountNumber = (await confirmation.innerText()).trim();

    expect(accountNumber).not.toBe('');

    console.log('New Checking Account Number:', accountNumber);

    return accountNumber;
  }
}