/** @format */

import cron from 'node-cron';
import { cleanupExpiredRefreshTokens } from '../modules/auth/refreshTokenCleanup.service.js';

cron.schedule(
  '0 2 * * *',
  async () => {
    console.info('[Worker] Starting refresh token cleanup');

    try {
      const result = await cleanupExpiredRefreshTokens();
      console.info('[Worker] Cleanup result:', result);
    } catch (error) {
      console.error('[Worker] Cleanup failed:', error);
    }
  },
  {
    timezone: 'Asia/Kolkata',
  },
);

console.info('[Worker] Refresh token cleanup scheduled daily at 2:00 AM IST');
