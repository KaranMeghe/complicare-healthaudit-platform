/** @format */

import 'dotenv/config';
import app from './app.js';
import { prisma } from './lib/prisma.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

startServer();
