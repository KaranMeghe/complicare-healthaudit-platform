/** @format */

import { hashPassword, comparePassword } from '../password.js';

describe('hashPassword', () => {
  it('should return a bcrypt hash', async () => {
    const password = 'CityCentral@123';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[aby]\$/);
  });
});

describe('comparePassword', () => {
  it('should return true when password matches the hash', async () => {
    const password = 'Citycentral@123';
    const hash = await hashPassword(password);
    const result = await comparePassword(password, hash);
    expect(result).toBe(true);
  });

  it('should return false when password does not match hash', async () => {
    const password = 'Citycentral@123';
    const hash = await hashPassword(password);
    const result = await comparePassword('WrongPassword', hash);
    expect(result).toBe(false);
  });
});
