
import { randomUUID } from 'node:crypto';

export function createTestUser() {
  const id = randomUUID().replace(/-/g, '').slice(0, 12);

  return {
    firstName: 'Vaibhav',
    lastName: 'khobragade',
    address: 'A 408 Ashok Vatika',
    city: 'Nagpur',
    state: 'Maharashtra',
    zipCode: '440001',
    phoneNumber: '7276333728',
    ssn: id,
    username: `qa_${id}`,
    password: `Qa_${id}!Test`,
  };
}
