
import { Page, expect } from '@playwright/test';

export class openCheckingAccount {
  constructor(private page: Page) {}

  async openCheckingAccount(
    existingAccountId: string,
  ): Promise<string> {
    await this.page.goto('/openaccount.htm');

    const accountType = this.page.locator('#type');
    const sourceAccount = this.page.locator('#fromAccountId');

    // Select Checking as the new account type.
    await accountType.selectOption({ label: 'CHECKING' }).catch(
      async () => {
        await accountType.selectOption({ label: /checking/i });
      },
    );

    // Wait until the source account dropdown has a usable option.
    await expect(sourceAccount.locator('option').first())
      .toBeAttached();

    await expect(sourceAccount.locator('option'))
      .toContainText(existingAccountId);

    await sourceAccount.selectOption(existingAccountId);

    await this.page.getByRole('button', {
      name: /open new account/i,
    }).click();

    // Wait for ParaBank to populate the generated account number.
    const newAccountLink = this.page.locator('#newAccountId');

    await expect(newAccountLink).toBeVisible();
    await expect(newAccountLink).not.toHaveText('');

    const newAccountId = (await newAccountLink.innerText()).trim();

    expect(newAccountId).toMatch(/^\d+$/);

    return newAccountId;
  }
}
