
import { Page, expect } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async register(user: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    ssn: string;
    username: string;
    password: string;
  }) {
    await this.page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await this.page.locator("//a[contains(text(),'Register')]").click();

    const fields: Record<string, string> = {
      'customer.firstName': user.firstName,
      'customer.lastName': user.lastName,
      'customer.address.street': user.address,
      'customer.address.city': user.city,
      'customer.address.state': user.state,
      'customer.address.zipCode': user.zipCode,
      'customer.phoneNumber': user.phoneNumber,
      'customer.ssn': user.ssn,
      'customer.username': user.username,
      'customer.password': user.password,
      'repeatedPassword': user.password,
    };

    for (const [name, value] of Object.entries(fields)) {
      await this.page.locator(`[name="${name}"]`).fill(value);
    }

    await this.page.getByRole('button', {
      name: /register/i,
    }).click();

    await this.page.waitForTimeout(4000);
    // await expect(
    //  this.page.getByText(/welcome/i),
    // ).toBeVisible();
  }
}
