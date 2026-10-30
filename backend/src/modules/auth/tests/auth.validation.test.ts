/** @format */

import { loginSchema, signupSchema } from '../auth.validation.js';

// SignUp/Register
const validSignupData = {
  email: 'aman@citycentral.com',
  password: 'CityCentral@123',
  firstName: 'Aman',
  lastName: 'Sharma',
};

describe('signupSchema', () => {
  it('accepts valid signup data', () => {
    const result = signupSchema.safeParse(validSignupData);
    expect(result.success).toBe(true);
  });

  it.each([
    ['minimum length', 'short', 'Password must be at least 8 characters'],
    ['uppercase character', 'citycentral@123', 'Password must contain at least one uppercase letter'],
    ['lowercase character', 'CITYCENTRAL@123', 'Password must contain at least one lowercase letter'],
    ['number', 'CityCentral@abc', 'Password must contain at least one number'],
    ['special character', 'CityCentral123', 'Password must contain at least one special character'],
  ])('rejects a password without a %s', (_rule, password, message) => {
    const result = signupSchema.safeParse({ ...validSignupData, password });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ['password'], message })]),
      );
    }
  });

  it('rejects an invalid email', () => {
    const result = signupSchema.safeParse({ ...validSignupData, email: 'not-an-email' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(expect.arrayContaining([expect.objectContaining({ path: ['email'] })]));
    }
  });

  it('rejects a first name shorter than two characters', () => {
    const result = signupSchema.safeParse({ ...validSignupData, firstName: 'A' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['firstName'],
            message: 'First name must be at least 2 characters',
          }),
        ]),
      );
    }
  });

  it('rejects a last name shorter than two characters', () => {
    const result = signupSchema.safeParse({ ...validSignupData, lastName: 'S' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ['lastName'],
            message: 'Last name must be at least 2 characters',
          }),
        ]),
      );
    }
  });
});

// Login

describe('loginSchema', () => {
  it('should accept valid login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'arun@citycentral.com',
      password: 'CityCentral@123',
    });

    expect(result.success).toBe(true);
  });

  it('should reject an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'CityCentral@123',
    });

    expect(result.success).toBe(false);
  });

  it('should reject an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'arun@citycentral.com',
      password: '',
    });

    expect(result.success).toBe(false);
  });
});
