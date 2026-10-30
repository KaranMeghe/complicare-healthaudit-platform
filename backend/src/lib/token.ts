/** @format */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET as string;
const ACCESS_TOKEN_EXPIRY = '15m';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

// Genrate Access Token (JWT)
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Genrate Refresh Token
export const generateRefreshToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Hashes a refresh token before storing it in the database.
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
