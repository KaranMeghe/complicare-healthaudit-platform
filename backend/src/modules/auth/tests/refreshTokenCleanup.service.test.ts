/** @format */

import { pool, prisma } from '../../../lib/prisma.js';
import { cleanupExpiredRefreshTokens } from '../refreshTokenCleanup.service.js';

jest.mock('../../../lib/prisma.js', () => ({
  pool: {
    connect: jest.fn(),
  },
  prisma: {
    refreshToken: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

const mockFindMany = prisma.refreshToken.findMany as jest.Mock;
const mockDeleteMany = prisma.refreshToken.deleteMany as jest.Mock;

describe('cleanupExpiredRefreshTokens', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(pool, 'connect').mockResolvedValue(mockClient as never);

    // Simulate successful lock acquisition and release.
    mockClient.query
      .mockResolvedValueOnce({ rows: [{ acquired: true }] })
      .mockResolvedValueOnce({ rows: [{ released: true }] });
  });

  it('should delete expired refresh tokens', async () => {
    mockFindMany.mockResolvedValueOnce([{ id: 'token-1' }]).mockResolvedValueOnce([]);

    mockDeleteMany.mockResolvedValueOnce({ count: 1 });

    const result = await cleanupExpiredRefreshTokens();

    expect(result).toEqual({
      status: 'completed',
      deletedCount: 1,
    });

    expect(mockFindMany).toHaveBeenCalledTimes(2);
    expect(mockDeleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { in: ['token-1'] },
          expiresAt: { lte: expect.any(Date) },
        }),
      }),
    );

    expect(mockClient.release).toHaveBeenCalledWith(false);
  });

  it('should skip cleanup when advisory lock is unavailable', async () => {
    mockClient.query.mockReset().mockResolvedValueOnce({
      rows: [{ acquired: false }],
    });

    const result = await cleanupExpiredRefreshTokens();

    expect(result).toEqual({
      status: 'skipped',
      deletedCount: 0,
    });

    expect(mockFindMany).not.toHaveBeenCalled();
    expect(mockDeleteMany).not.toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalledWith(false);
  });

  it('should release the lock when database operation fails', async () => {
    mockFindMany.mockRejectedValueOnce(new Error('Database error'));

    await expect(cleanupExpiredRefreshTokens()).rejects.toThrow('Database error');

    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(mockClient.release).toHaveBeenCalledWith(false);
  });

  it('should destroy the connection if advisory lock release fails', async () => {
    mockClient.query
      .mockReset()
      .mockResolvedValueOnce({ rows: [{ acquired: true }] })
      .mockRejectedValueOnce(new Error('Unlock failed'));

    mockFindMany.mockResolvedValueOnce([]);

    const result = await cleanupExpiredRefreshTokens();

    expect(result.status).toBe('completed');
    expect(mockClient.release).toHaveBeenCalledWith(true);
  });
});
