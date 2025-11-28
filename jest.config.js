/**
 * Jest Configuration
 * 
 * Pattern: TEST × CONFIG × JEST × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 * Guardians: AEYON (999 Hz) + JØHN (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'shared/**/*.ts',
    'backend/api/src/**/*.ts',
    'frontend/web/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@/(.*)$': '<rootDir>/frontend/web/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/shared/test-utils.ts'],
};

