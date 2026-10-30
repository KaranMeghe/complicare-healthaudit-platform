/** @format */

import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes.js';
import { errorMiddleware } from './middleware/errors/error.middleware.js';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json()); // parse json data from the request body
app.use(cookieParser()); // parse cookies
app.use('/api/v1/auth', authRoutes); // hands off to the auth routes
app.use(errorMiddleware); // catches any errors at the end

export default app;
