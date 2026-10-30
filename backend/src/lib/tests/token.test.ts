/** @format */

import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../token.js';

describe('generateAccessToken', () => {
  it('should generate a valid JWT with the user ID as sub', () => {
    const userId = 'test-user-id';
    const token = generateAccessToken(userId);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    expect(decoded.sub).toBe(userId);
  });

  it('should expire in 15 minutes', () => {
    const userId = 'test-user-id';
    const token = generateAccessToken(userId);
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp! - decoded.iat!).toBe(15 * 60);
  });
});
