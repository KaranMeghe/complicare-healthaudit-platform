/** @format */

import { type Request, type Response, type NextFunction } from 'express';
import { loginUser, logoutUser, refreshAccessToken, registerUser } from './auth.service.js';
import { UnauthorizedError } from '../../middleware/errors/unauthorizedError.js';

// Signup / Register user.
export const registerController = async (req: Request, res: Response, _next: NextFunction) => {
  const result = await registerUser(req.body);

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: 'success',
    user: result.user,
    message: 'User registered successfully',
  });
};

// Login
export const loginController = async (req: Request, res: Response, _next: NextFunction) => {
  const result = await loginUser(req.body);

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    user: result.user,
    message: 'User logged in successfully',
  });
};

// Refresh
export const refreshController = async (req: Request, res: Response, _next: NextFunction) => {
  // Extract the token
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const result = await refreshAccessToken(refreshToken);

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Token refreshed successfully',
  });
};

// Logout
export const logoutController = async (req: Request, res: Response, _next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });

  res.status(200).json({
    status: 'success',
    message: 'User logged out successfully',
  });
};
