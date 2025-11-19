module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
    node: true,
    jest: true,
    serviceworker: true,
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
    'no-case-declarations': 'off', // Allow case declarations (use block scopes when needed)
    'no-control-regex': 'warn', // Downgrade to warning for security-related regex patterns
    'no-inner-declarations': 'warn', // Allow function declarations in blocks (common in Chrome extensions)
    'no-useless-escape': 'warn', // Allow escaped characters (often needed for regex patterns)
    'no-empty': 'warn', // Allow empty blocks (sometimes needed for placeholders)
    'no-script-url': 'warn', // Allow javascript: URLs (sometimes needed for Chrome extension APIs)
    
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
    
    // Global classes loaded via importScripts or window context
    CacheManager: 'readonly',
    CircuitBreaker: 'readonly',
    SubscriptionService: 'readonly',
    MutexHelper: 'readonly',
    AiGuardianAuth: 'readonly',
    AiGuardianErrorHandler: 'readonly',
    AiGuardianOnboarding: 'readonly',
    BackendIntegrationTester: 'readonly',
    
    // Global utility functions
    checkCookiesForAuth: 'readonly',
    checkSignedInPage: 'readonly',
    
    // Dev/testing flags
    SHOW_DEV_UI: 'readonly',
    
    // Service Worker APIs
    importScripts: 'readonly',
    
    // Test framework globals (jest)
    jest: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    test: 'readonly',
    expect: 'readonly',
    beforeAll: 'readonly',
    beforeEach: 'readonly',
    afterAll: 'readonly',
    afterEach: 'readonly',
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js',
    'vendor/',
    'sdk/',
  ],
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: {
        jest: true,
        node: true,
        browser: true,
      },
      globals: {
        gateway: 'readonly', // Test files may reference gateway instances
      },
    },
  ],
};

