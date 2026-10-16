
import { APIRequestContext, expect } from '@playwright/test';

export class AdminApi {
  constructor(private request: APIRequestContext) {}

  async setParameter(name: string, value: string) {
    const response = await this.request.post(
      `/services/bank/setParameter/${encodeURIComponent(name)}/${encodeURIComponent(value)}`,
    );

    expect(response.ok()).toBeTruthy();
  }

  async cleanDatabase() {
    if (process.env.ALLOW_GLOBAL_RESET !== 'true') {
      throw new Error(
        'Global reset blocked. Enable only in an approved isolated environment.',
      );
    }

    const response = await this.request.post(
      '/services/bank/cleanDB',
    );

    expect(response.ok()).toBeTruthy();
  }

  async initializeDatabase() {
    if (process.env.ALLOW_GLOBAL_RESET !== 'true') {
      throw new Error(
        'Database initialization blocked by safety guard.',
      );
    }

    const response = await this.request.post(
      '/services/bank/initializeDB',
    );

    expect(response.ok()).toBeTruthy();
  }
}
