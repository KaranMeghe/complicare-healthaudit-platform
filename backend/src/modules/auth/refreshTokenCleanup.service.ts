/** @format */

import { pool, prisma } from '../../lib/prisma.js';

const CLEANUP_LOCK_ID = 741852963;
const BATCH_SIZE = 1000;

interface CleanupResult {
  status: 'completed' | 'skipped';
  deletedCount: number;
}

export const cleanupExpiredRefreshTokens = async (): Promise<CleanupResult> => {
  const client = await pool.connect();

  let lockAcquired = false;
  let destroyConnection = false;

  const startedAt = Date.now();
  const cutoff = new Date();

  try {
    // 1. Acquire PostgreSQL advisory lock
    const lockResult = await client.query<{ acquired: boolean }>(
      'SELECT pg_try_advisory_lock($1::bigint) AS acquired',
      [CLEANUP_LOCK_ID],
    );

    lockAcquired = lockResult.rows[0]?.acquired === true;

    // Another worker is already executing cleanup
    if (!lockAcquired) {
      console.info('[RefreshTokenCleanup] Skipped: lock unavailable');

      return {
        status: 'skipped',
        deletedCount: 0,
      };
    }

    console.info('[RefreshTokenCleanup] Started');

    let deletedCount = 0;

    // 2. Delete expired records in batches
    while (true) {
      const expiredTokens = await prisma.refreshToken.findMany({
        where: {
          expiresAt: {
            lte: cutoff,
          },
        },
        select: {
          id: true,
        },
        orderBy: {
          expiresAt: 'asc',
        },
        take: BATCH_SIZE,
      });

      // No more expired records
      if (expiredTokens.length === 0) {
        break;
      }

      const tokenIds = expiredTokens.map((token) => token.id);

      // 3. Delete only the selected expired records
      const result = await prisma.refreshToken.deleteMany({
        where: {
          id: {
            in: tokenIds,
          },
          expiresAt: {
            lte: cutoff,
          },
        },
      });

      deletedCount += result.count;
    }

    // 4. Log successful execution
    console.info('[RefreshTokenCleanup] Completed', {
      deletedCount,
      durationMs: Date.now() - startedAt,
    });

    return {
      status: 'completed',
      deletedCount,
    };
  } catch (error) {
    console.error('[RefreshTokenCleanup] Failed', {
      error,
      durationMs: Date.now() - startedAt,
    });

    throw error;
  } finally {
    // 5. Release the advisory lock
    if (lockAcquired) {
      try {
        const unlockResult = await client.query<{ released: boolean }>(
          'SELECT pg_advisory_unlock($1::bigint) AS released',
          [CLEANUP_LOCK_ID],
        );

        if (unlockResult.rows[0]?.released !== true) {
          destroyConnection = true;
          console.error('[RefreshTokenCleanup] Lock release not confirmed');
        }
      } catch (unlockError) {
        // Destroy connection so PostgreSQL releases its session lock
        destroyConnection = true;

        console.error('[RefreshTokenCleanup] Lock release failed', {
          error: unlockError,
        });
      }
    }

    // Return connection to pool or destroy it if lock state is uncertain
    client.release(destroyConnection);
  }
};
