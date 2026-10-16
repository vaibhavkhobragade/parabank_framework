import { Page, expect } from '@playwright/test';

export class LoanPage {
  constructor(private page: Page) {}

  async applyForLoan(
    fundingAccountId: string,
    amount: number,
    downPayment: number
  ): Promise<string> {
    await this.page.goto('/requestloan.htm');

    // Wait until the newly opened account is available in the dropdown.
    const fundingDropdown = this.page.locator('#fromAccountId');

    await expect(
      fundingDropdown.locator('option').filter({
        hasText: fundingAccountId,
      })
    ).toHaveCount(1);

    await fundingDropdown.selectOption(fundingAccountId);

    // Enter loan details.
    await this.page.locator('#amount').fill(String(amount));
    await this.page.locator('#downPayment')
      .fill(String(downPayment));

    await this.page.getByRole('button', {
      name: /apply now/i,
    }).click();

    // Wait for the loan response and validate approval.
    const status = this.page.locator('#loanStatus');
    await expect(status).toBeVisible();

    await expect(status).toContainText(/approved/i);

    // Extract the generated loan account number.
    const loanAccountLink = this.page.locator(
      '#loanAccountId'
    );

    await expect(loanAccountLink).toBeVisible();

    const loanAccountNumber =
      (await loanAccountLink.innerText()).trim();

    expect(loanAccountNumber).not.toBe('');

    console.log('Loan Status:', await status.innerText());
    console.log('Loan Account Number:', loanAccountNumber);

    return loanAccountNumber;
  }
}