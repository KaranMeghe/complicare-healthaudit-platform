/** @format */

import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 10;

// Hash password
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS);
};

// Compare password
export const comparePassword = async (plainPassword: string, storedHashPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, storedHashPassword);
};
