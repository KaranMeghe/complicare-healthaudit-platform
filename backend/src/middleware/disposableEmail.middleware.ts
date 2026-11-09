/** @format */

import type { RequestHandler } from 'express';
import { checkDisposableEmail, EmailValidationProviderError } from '../modules/auth/emailValidation.service.js';

export const disposableEmailMiddleware: RequestHandler = async (req, res, next) => {
  // 1. Extract and validate email
  const email = req.body?.email;

  // Defensive check: Zod should already validate this.
  if (typeof email !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid email address',
    });
  }

  try {
    // 2. Check disposable email
    const isDisposable = await checkDisposableEmail(email);

    if (isDisposable) {
      return res.status(400).json({
        status: 'error',
        message: 'Disposable email addresses are not allowed',
      });
    }
  } catch (error) {
    // 3. Handle provider errors (Fail Open)
    if (error instanceof EmailValidationProviderError) {
      console.error('[EmailValidation] Provider failure', {
        reason: error.reason,
        statusCode: error.statusCode,
      });
    } else {
      console.error('[EmailValidation] Unexpected failure');
    }

    // Fail Open: allow signup if provider verification fails.
  }

  return next();
};
