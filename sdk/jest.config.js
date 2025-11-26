/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverage: false,
  verbose: true,
  // ES Module support for SDK
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
