/** @format */

import { Router } from 'express';
import { loginController, logoutController, refreshController, registerController } from './auth.controller.js';
import { validateRequest } from '../../middleware/auth.middleware.js';
import { loginSchema, signupSchema } from './auth.validation.js';
import asyncHandler from '../../middleware/errors/asyncHandler.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validateRequest(signupSchema), asyncHandler(registerController));

// POST /api/v1/auth/login
router.post('/login', validateRequest(loginSchema), asyncHandler(loginController));

// POST /api/v1/auth/refresh
router.post('/refresh', asyncHandler(refreshController));

// POST /api/v1/auth/logout
router.post('/logout', asyncHandler(logoutController));

export default router;
