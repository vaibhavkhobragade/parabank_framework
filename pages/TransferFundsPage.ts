
import { Page, expect } from '@playwright/test';

export class TransferFundsPage {
  constructor(private page: Page) {}

  async transferFunds(
    fromAccountId: string,
    toAccountId: string,
    amount: number
  ): Promise<void> {
    await this.page.goto('https://parabank.parasoft.com/parabank/transfer.htm');

    await this.page.locator('#amount').fill(amount.toFixed(2));
     await this.page.locator('//input[@value="Transfer"]').click();
    // await this.page.pause();
    await this.page.locator('#fromAccountId')
      .selectOption(fromAccountId);

    await expect(
      this.page.locator('#toAccountId option')
    ).toHaveCount(2, { timeout: 10000 }).catch(async () => {
      // The destination dropdown can contain more than two options.
      await expect(
        this.page.locator('#toAccountId option[value="' + toAccountId + '"]')
      ).toBeAttached();
    });

    await this.page.locator('#toAccountId')
      .selectOption(toAccountId);

    await this.page.getByRole('button', { name: /transfer/i }).click();

    await expect(
      this.page.getByText(/transfer complete/i)
    ).toBeVisible({ timeout: 15000 });
  }
}
