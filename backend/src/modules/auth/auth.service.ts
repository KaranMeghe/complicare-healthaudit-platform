/** @format */

import { prisma } from '../../lib/prisma.js';
import type { LoginRequest, SignupRequest } from './auth.types.js';
import { hashPassword, comparePassword } from '../../lib/password.js';
import { ConflictError } from '../../middleware/errors/ConflictError.js';
import { generateAccessToken, generateRefreshToken, hashToken } from '../../lib/token.js';
import { UnauthorizedError } from '../../middleware/errors/unauthorizedError.js';

// Register user
export const registerUser = async (data: SignupRequest) => {
  // email already exists check
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ConflictError('Email already exists');
  }

  // password hashing
  const passwordHash = await hashPassword(data.password);

  // Save the user and refresh-token record as one transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create and store user to User Table
    const user = await tx.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    // Genrate Access and RefreshToken and Hash RefreshToken
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = hashToken(refreshToken);

    // Store hashedRefreshToken to RefreshToken Table
    await tx.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  });

  // RETURN SAFE USER DETAILS AND TOKENS
  return {
    user: {
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      createdAt: result.user.createdAt.toISOString(),
      updatedAt: result.user.updatedAt.toISOString(),
    },
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
};

// Login user
export const loginUser = async (data: LoginRequest) => {
  // Check user exist by their email
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!existingUser) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check password is valid or not
  const isPasswordValid = await comparePassword(data.password, existingUser.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Genrate Access and Hash Token
  const accessToken = generateAccessToken(existingUser.id);
  const refreshToken = generateRefreshToken();
  const hashedRefreshToken = hashToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      userId: existingUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: {
      id: existingUser.id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      createdAt: existingUser.createdAt.toISOString(),
      updatedAt: existingUser.updatedAt.toISOString(),
    },
    accessToken,
    refreshToken,
  };
};

// Refresh Access Token
export const refreshAccessToken = async (token: string) => {
  // Hash refresh token
  const hashedRefreshToken = hashToken(token);

  // Find refresh token in RefreshToken table
  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: {
      token: hashedRefreshToken,
    },
  });

  if (!refreshTokenRecord) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  // Check token expiry
  if (refreshTokenRecord.expiresAt < new Date()) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  // Generate new access token
  const accessToken = generateAccessToken(refreshTokenRecord.userId);

  return {
    accessToken,
  };
};

// Logout the user
export const logoutUser = async (token: string) => {
  const hashedRefreshToken = hashToken(token);

  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: {
      token: hashedRefreshToken,
    },
  });

  if (!refreshTokenRecord) {
    return;
  }

  await prisma.refreshToken.delete({
    where: {
      id: refreshTokenRecord.id,
    },
  });
};
