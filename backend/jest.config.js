export default {
  transform: {
    '^.+\\.tsx?$': ['@swc/jest'],
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/src/test/setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};