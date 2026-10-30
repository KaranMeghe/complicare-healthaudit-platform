/** @format */

import type { NextFunction, Request, Response } from 'express';
import { ConflictError } from './ConflictError.js';
import { UnauthorizedError } from './unauthorizedError.js';

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err instanceof ConflictError) {
    return res.status(409).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      status: 'error',
      message: err.message,
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
