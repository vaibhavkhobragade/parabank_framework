
import { Page, expect } from '@playwright/test';

export class FindTransactionsPage {
  constructor(private page: Page) {}

  async getTransactionAmounts(
    accountId: string
  ): Promise<number[]> {
    await this.page.goto('/findtrans.htm');

    // Select the account whose transactions you want to inspect.
    await this.page.locator('#accountId')
      .selectOption(accountId);

    // Find transactions for this account.
    await this.page.getByRole('button', {
      name: /find transactions/i
    }).click();

    const table = this.page.locator('#transactionTable');

    await expect(table).toBeVisible({ timeout: 15000 });

    // Read all transaction rows.
    const rows = table.locator('tbody tr');
    const amounts: number[] = [];

    for (let i = 0; i < await rows.count(); i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');

      if (await cells.count() < 4) {
        continue;
      }

      // ParaBank transaction table:
      // Date | Transaction | Debit | Credit
      const debitText = (await cells.nth(2).innerText()).trim();

      if (debitText) {
        amounts.push(this.parseCurrency(debitText));
      }
    }

    return amounts;
  }

  private parseCurrency(text: string): number {
    const normalized = text
      .replace(/[$,\s]/g, '')
      .replace(/[()]/g, '');

    const value = Number(normalized);

    if (!Number.isFinite(value)) {
      throw new Error(`Invalid currency value: "${text}"`);
    }

    return Math.round(value * 100) / 100;
  }
}
