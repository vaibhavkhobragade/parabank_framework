
import { APIRequestContext, expect } from '@playwright/test';

export class ParaBankApi {
  constructor(private request: APIRequestContext) {}

  async getCustomer(customerId: number) {
    const response = await this.request.get(
      `/services/bank/customers/${customerId}`,
      { headers: { Accept: 'application/json' } },
    );

    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  async getAccounts(customerId: number) {
    const response = await this.request.get(
      `/services/bank/customers/${customerId}/accounts`,
      { headers: { Accept: 'application/json' } },
    );

    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  async deposit(accountId: number, amount: number) {
    const response = await this.request.post(
      '/services/bank/deposit',
      {
        params: { accountId, amount },
        headers: { Accept: 'application/json' },
      },
    );

    expect(response.ok()).toBeTruthy();
    return response;
  }

  async getTransactions(accountId: number) {
    const response = await this.request.get(
      `/services/bank/accounts/${accountId}/transactions`,
      { headers: { Accept: 'application/json' } },
    );

    expect(response.ok()).toBeTruthy();
    return response.json();
  }
}
