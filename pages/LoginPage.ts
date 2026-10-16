
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
   // await this.page.goto('https://parabank.parasoft.com/parabank/login.htm');
    
   //await this.page.reload();
  // await this.page.pause();
      await this.page.locator("//a[contains(text(),'Open New Account')]").click();
     // await this.page.pause();
      await this.page.locator('//input[@value="Open New Account"]').click();
      await this.page.waitForTimeout(3000);
      const accountno=   await this.page.locator('//a[@id="newAccountId"]').textContent();
      console.log(accountno);

       await this.page.locator("//a[contains(text(),'Request Loan')]").click();
       //await this.page.pause();
       await this.page.locator('//input[@id="amount"]').fill("50000");
       await this.page.locator('//input[@id="downPayment"]').fill("5000");
       await this.page.locator('//input[@value="Apply Now"]').click();
       await this.page.locator("//a[contains(text(),'Transfer Funds')]").click();
       await this.page.locator('//input[@id="amount"]').click();
       await this.page.locator('//input[@id="amount"]').fill("50000");
       await this.page.locator('//input[@value="Transfer"]').click();

       const tranferamount =       await this.page.locator('//span[@id="amountResult"]').textContent();
       console.log(tranferamount);
      // await this.page.pause();


    // await this.page.locator('input[name="username"]').fill(username);
    // await this.page.locator('input[name="password"]').fill(password);

    // await this.page.getByRole('button', { name: /log in/i }).click();

    // await expect(
    //   this.page.getByRole('link', { name: /accounts overview/i })
    // ).toBeVisible();
  }
}
