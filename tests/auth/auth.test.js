/**
 * Authentication Feature Tests
 *
 * Tests for Clerk authentication integration in Chrome extension
 */

// Mock Chrome APIs for testing
const mockChrome = {
  storage: {
    sync: {
      get: (keys, callback) => {
        const data = {
          clerk_publishable_key: 'pk_test_mock_key_12345',
          gateway_url: 'https://api.aiguardian.ai',
          api_key: 'test_api_key',
        };
        callback(data);
      },
      set: (data, callback) => {
        if (callback) callback();
      },
    },
    local: {
      get: (keys, callback) => {
        const data = {
          clerk_user: {
            id: 'user_123',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            username: 'testuser',
            imageUrl: 'https://example.com/avatar.jpg',
          },
        };
        callback(data);
      },
      set: (data, callback) => {
        if (callback) callback();
      },
      remove: (keys, callback) => {
        if (callback) callback();
      },
    },
  },
  runtime: {
    getURL: (path) => `chrome-extension://test-id/${path}`,
    id: 'test-extension-id',
    sendMessage: (message, callback) => {
      if (callback) callback({ success: true, key: 'pk_test_mock_key_12345' });
    },
    onMessage: {
      addListener: () => {},
    },
  },
  tabs: {
    create: (options) => {
      console.log('Tab created:', options.url);
      return Promise.resolve({ id: 1 });
    },
    query: (query, callback) => {
      callback([{ id: 1, url: 'https://example.com' }]);
    },
  },
};

// Mock Logger
const Logger = {
  info: (msg, data) => console.log('[INFO]', msg, data || ''),
  warn: (msg, data) => console.warn('[WARN]', msg, data || ''),
  error: (msg, data) => console.error('[ERROR]', msg, data || ''),
  debug: (msg, data) => console.debug('[DEBUG]', msg, data || ''),
};

// Mock Clerk SDK
class MockClerk {
  constructor(publishableKey) {
    this.publishableKey = publishableKey;
    this.user = null;
    this.loaded = false;
  }

  async load() {
    this.loaded = true;
    // Simulate user being logged in
    this.user = {
      id: 'user_123',
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      imageUrl: 'https://example.com/avatar.jpg',
    };
    return Promise.resolve();
  }

  async signOut() {
    this.user = null;
    return Promise.resolve();
  }
}

// Set up global mocks
global.chrome = mockChrome;
global.Logger = Logger;
global.Clerk = MockClerk;

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

function assert(condition, message) {
  if (condition) {
    testResults.passed++;
    testResults.tests.push({ status: 'PASS', message });
    console.log(`✅ PASS: ${message}`);
  } else {
    testResults.failed++;
    testResults.tests.push({ status: 'FAIL', message });
    console.error(`❌ FAIL: ${message}`);
  }
}

async function testAuthInitialization() {
  console.log('\n=== Testing Authentication Initialization ===');

  try {
    // Load auth module
    const authModule = await import('../../src/auth.js');
    const AiGuardianAuth = window.AiGuardianAuth || authModule.AiGuardianAuth;

    const auth = new AiGuardianAuth();
    assert(auth !== null, 'Auth instance created');
    assert(auth.clerk === null, 'Clerk initially null');
    assert(auth.isInitialized === false, 'Not initialized initially');

    const initialized = await auth.initialize();
    assert(initialized === true, 'Auth initialized successfully');
    assert(auth.isInitialized === true, 'isInitialized flag set');
    assert(auth.publishableKey === 'pk_test_mock_key_12345', 'Publishable key loaded');

    return auth;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Initialization test: ${error.message}`);
    return null;
  }
}

async function testUserSession() {
  console.log('\n=== Testing User Session Management ===');

  try {
    const authModule = await import('../../src/auth.js');
    const AiGuardianAuth = window.AiGuardianAuth || authModule.AiGuardianAuth;

    const auth = new AiGuardianAuth();
    await auth.initialize();

    await auth.checkUserSession();
    assert(auth.isAuthenticated() === true, 'User authenticated');
    assert(auth.getCurrentUser() !== null, 'Current user retrieved');

    const displayName = auth.getUserDisplayName();
    assert(displayName === 'Test User', `Display name correct: ${displayName}`);

    const avatarUrl = auth.getUserAvatar();
    assert(avatarUrl !== null, 'Avatar URL retrieved');

    return auth;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `User session test: ${error.message}`);
    return null;
  }
}

async function testSignIn() {
  console.log('\n=== Testing Sign In Flow ===');

  try {
    const authModule = await import('../../src/auth.js');
    const AiGuardianAuth = window.AiGuardianAuth || authModule.AiGuardianAuth;

    const auth = new AiGuardianAuth();
    await auth.initialize();

    let tabCreated = false;
    const originalCreate = chrome.tabs.create;
    chrome.tabs.create = (options) => {
      tabCreated = true;
      assert(options.url.includes('accounts.clerk.com'), 'Sign in URL contains Clerk domain');
      assert(options.url.includes('sign-in'), 'Sign in URL contains sign-in path');
      assert(options.url.includes('redirect_url'), 'Sign in URL contains redirect_url');
      return originalCreate(options);
    };

    await auth.signIn();
    assert(tabCreated === true, 'Sign in tab created');

    chrome.tabs.create = originalCreate;
    return auth;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Sign in test: ${error.message}`);
    return null;
  }
}

async function testSignUp() {
  console.log('\n=== Testing Sign Up Flow ===');

  try {
    const authModule = await import('../../src/auth.js');
    const AiGuardianAuth = window.AiGuardianAuth || authModule.AiGuardianAuth;

    const auth = new AiGuardianAuth();
    await auth.initialize();

    let tabCreated = false;
    const originalCreate = chrome.tabs.create;
    chrome.tabs.create = (options) => {
      tabCreated = true;
      assert(options.url.includes('accounts.clerk.com'), 'Sign up URL contains Clerk domain');
      assert(options.url.includes('sign-up'), 'Sign up URL contains sign-up path');
      assert(options.url.includes('redirect_url'), 'Sign up URL contains redirect_url');
      return originalCreate(options);
    };

    await auth.signUp();
    assert(tabCreated === true, 'Sign up tab created');

    chrome.tabs.create = originalCreate;
    return auth;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Sign up test: ${error.message}`);
    return null;
  }
}

async function testSignOut() {
  console.log('\n=== Testing Sign Out Flow ===');

  try {
    const authModule = await import('../../src/auth.js');
    const AiGuardianAuth = window.AiGuardianAuth || authModule.AiGuardianAuth;

    const auth = new AiGuardianAuth();
    await auth.initialize();
    await auth.checkUserSession();

    assert(auth.isAuthenticated() === true, 'User authenticated before sign out');

    let storageCleared = false;
    const originalRemove = chrome.storage.local.remove;
    chrome.storage.local.remove = (keys, callback) => {
      storageCleared = true;
      assert(keys.includes('clerk_user'), 'Removing clerk_user from storage');
      if (callback) callback();
    };

    await auth.signOut();
    assert(auth.isAuthenticated() === false, 'User not authenticated after sign out');
    assert(storageCleared === true, 'Storage cleared on sign out');

    chrome.storage.local.remove = originalRemove;
    return auth;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Sign out test: ${error.message}`);
    return null;
  }
}

async function testStoredUserFallback() {
  console.log('\n=== Testing Stored User Fallback ===');

  try {
    const authModule = await import('../../src/auth.js');
    const AiGuardianAuth = window.AiGuardianAuth || authModule.AiGuardianAuth;

    const auth = new AiGuardianAuth();

    // Mock Clerk to throw error
    const originalClerk = global.Clerk;
    global.Clerk = class {
      constructor() {}
      async load() {
        throw new Error('Clerk not available');
      }
    };

    // Should still work with stored user
    await auth.checkUserSession();
    const stored = await auth.getStoredUser();
    assert(stored !== null, 'Stored user retrieved');

    if (stored) {
      auth.user = stored;
      const displayName = auth.getUserDisplayName();
      assert(displayName !== null, 'Display name from stored user');
    }

    global.Clerk = originalClerk;
    return auth;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Stored user test: ${error.message}`);
    return null;
  }
}

async function testTokenRetrieval() {
  console.log('\n=== Testing Token Retrieval ===');

  try {
    const authModule = await import('../../src/auth.js');
    const AiGuardianAuth = window.AiGuardianAuth || authModule.AiGuardianAuth;

    const auth = new AiGuardianAuth();
    await auth.initialize();

    const token = await auth.getToken();
    // Token might be null if not authenticated, which is acceptable
    assert(token !== undefined, 'Token retrieval does not throw');

    return auth;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Token retrieval test: ${error.message}`);
    return null;
  }
}

async function runAllTests() {
  console.log('🧪 Starting Authentication Feature Tests\n');
  console.log('='.repeat(60));

  try {
    await testAuthInitialization();
    await testUserSession();
    await testSignIn();
    await testSignUp();
    await testSignOut();
    await testStoredUserFallback();
    await testTokenRetrieval();

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Total: ${testResults.passed + testResults.failed}`);
    console.log(
      `🎯 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`
    );

    if (testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      testResults.tests
        .filter((t) => t.status === 'FAIL')
        .forEach((t) => console.log(`   - ${t.message}`));
    }

    return testResults.failed === 0;
  } catch (error) {
    console.error('Test suite error:', error);
    return false;
  }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testResults };
}

// Run tests if executed directly
if (typeof window === 'undefined') {
  runAllTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
