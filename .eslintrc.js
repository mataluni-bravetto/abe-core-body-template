module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [
    'security',
  ],
  rules: {
    // Security rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // Best practices
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    
    // Code quality
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-throw-literal': 'error',
    'prefer-const': 'warn',
    
    // Chrome Extension specific
    'no-undef': 'error',
  },
  globals: {
    // Chrome Extension APIs
    chrome: 'readonly',
    browser: 'readonly',
    
    // Global constants from constants.js
    TEXT_ANALYSIS: 'readonly',
    API_CONFIG: 'readonly',
    SECURITY: 'readonly',
    UI: 'readonly',
    DEFAULT_CONFIG: 'readonly',
    Logger: 'readonly',
    AiGuardianGateway: 'readonly',
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js',
    'vendor/',
    'sdk/',
  ],
};

