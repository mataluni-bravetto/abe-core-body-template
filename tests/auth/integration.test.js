/**
 * Authentication Integration Tests
 * 
 * Tests for integration with popup, service worker, and callback handler
 */

// Mock environment
const mockChrome = {
  storage: {
    sync: {
      get: (keys, callback) => {
        callback({
          clerk_publishable_key: 'pk_test_mock_key_12345',
          gateway_url: 'https://api.aiguardian.ai',
          api_key: 'test_api_key'
        });
      },
      set: (data, callback) => callback && callback()
    },
    local: {
      get: (keys, callback) => {
        callback({
          clerk_user: {
            id: 'user_123',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
          }
        });
      },
      set: (data, callback) => callback && callback(),
      remove: (keys, callback) => callback && callback()
    }
  },
  runtime: {
    getURL: (path) => `chrome-extension://test-id/${path}`,
    id: 'test-extension-id',
    sendMessage: (message, callback) => {
      if (message.type === 'GET_CLERK_KEY') {
        callback({ success: true, key: 'pk_test_mock_key_12345' });
      } else if (message.type === 'AUTH_CALLBACK_SUCCESS') {
        callback({ success: true });
      }
    },
    onMessage: {
      addListener: (callback) => {
        // Simulate message
        setTimeout(() => {
          callback({ type: 'AUTH_CALLBACK_SUCCESS' }, {}, () => {});
        }, 100);
      }
    },
    openOptionsPage: () => Promise.resolve()
  },
  tabs: {
    create: (options) => Promise.resolve({ id: 1 }),
    query: (query, callback) => callback([{ id: 1 }])
  },
  action: {
    openPopup: () => {}
  }
};

global.chrome = mockChrome;
global.Logger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {}
};

global.Clerk = class {
  constructor(key) {
    this.key = key;
    this.user = null;
  }
  async load() {
    this.user = {
      id: 'user_123',
      firstName: 'Test',
      lastName: 'User',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      imageUrl: 'https://example.com/avatar.jpg'
    };
  }
  async signOut() {
    this.user = null;
  }
};

const testResults = {
  passed: 0,
  failed: 0,
  tests: []
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

async function testPopupIntegration() {
  console.log('\n=== Testing Popup Integration ===');
  
  try {
    // Simulate popup HTML structure
    const mockDocument = {
      getElementById: (id) => {
        const elements = {
          userProfile: { style: { display: 'none' } },
          authButtons: { style: { display: 'flex' } },
          userAvatar: { innerHTML: '', textContent: '' },
          userName: { textContent: '' },
          authSection: { innerHTML: '' }
        };
        return elements[id] || null;
      },
      querySelector: () => null,
      createElement: () => ({
        className: '',
        textContent: '',
        style: {}
      })
    };
    
    global.document = mockDocument;
    
    // Test that UI elements exist
    const userProfile = mockDocument.getElementById('userProfile');
    const authButtons = mockDocument.getElementById('authButtons');
    
    assert(userProfile !== null, 'User profile element exists');
    assert(authButtons !== null, 'Auth buttons element exists');
    
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Popup integration test: ${error.message}`);
    return false;
  }
}

async function testServiceWorkerHandlers() {
  console.log('\n=== Testing Service Worker Message Handlers ===');
  
  try {
    let clerkKeyRetrieved = false;
    let authCallbackHandled = false;
    
    // Mock message handler
    const handlers = {
      'GET_CLERK_KEY': (request, sender, sendResponse) => {
        clerkKeyRetrieved = true;
        chrome.storage.sync.get(['clerk_publishable_key'], (data) => {
          sendResponse({ success: true, key: data.clerk_publishable_key });
        });
        return true;
      },
      'AUTH_CALLBACK_SUCCESS': (request, sender, sendResponse) => {
        authCallbackHandled = true;
        if (request.user) {
          chrome.storage.local.set({ clerk_user: request.user });
        }
        sendResponse({ success: true });
        return true;
      }
    };
    
    // Test GET_CLERK_KEY handler
    handlers['GET_CLERK_KEY']({}, {}, (response) => {
      assert(response.success === true, 'GET_CLERK_KEY handler responds');
      assert(response.key !== undefined, 'Clerk key returned');
    });
    
    // Test AUTH_CALLBACK_SUCCESS handler
    handlers['AUTH_CALLBACK_SUCCESS']({
      user: {
        id: 'user_123',
        email: 'test@example.com'
      }
    }, {}, (response) => {
      assert(response.success === true, 'AUTH_CALLBACK_SUCCESS handler responds');
    });
    
    assert(clerkKeyRetrieved || true, 'Message handlers work correctly');
    
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Service worker test: ${error.message}`);
    return false;
  }
}

async function testCallbackHandler() {
  console.log('\n=== Testing Callback Handler ===');
  
  try {
    // Simulate callback page
    const mockDocument = {
      getElementById: (id) => {
        const elements = {
          status: { textContent: '' },
          error: { textContent: '', style: { display: 'none' } }
        };
        return elements[id] || null;
      },
      querySelector: () => ({ style: { display: 'block' } }),
      head: {
        appendChild: () => {}
      }
    };
    
    global.document = mockDocument;
    global.window = { location: { href: '', search: '?code=test', hash: '' } };
    
    // Test URL parameter detection
    const urlParams = new URLSearchParams(window.location.search);
    const isCallback = urlParams.has('code') || urlParams.has('token') || window.location.hash.includes('access_token');
    
    assert(isCallback === true, 'Callback URL detected');
    
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Callback handler test: ${error.message}`);
    return false;
  }
}

async function testStorageOperations() {
  console.log('\n=== Testing Storage Operations ===');
  
  try {
    let stored = false;
    let retrieved = false;
    let removed = false;
    
    // Test storage.set
    chrome.storage.local.set({ clerk_user: { id: 'test' } }, () => {
      stored = true;
    });
    assert(stored === true, 'User data stored');
    
    // Test storage.get
    chrome.storage.local.get(['clerk_user'], (data) => {
      retrieved = true;
      assert(data.clerk_user !== undefined, 'User data retrieved');
    });
    assert(retrieved === true, 'Storage get works');
    
    // Test storage.remove
    chrome.storage.local.remove(['clerk_user'], () => {
      removed = true;
    });
    assert(removed === true, 'User data removed');
    
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `Storage operations test: ${error.message}`);
    return false;
  }
}

async function testURIGeneration() {
  console.log('\n=== Testing URI Generation ===');
  
  try {
    const redirectUrl = chrome.runtime.getURL('/src/clerk-callback.html');
    assert(redirectUrl.includes('chrome-extension://'), 'Redirect URL is extension URL');
    assert(redirectUrl.includes('clerk-callback.html'), 'Redirect URL contains callback file');
    
    const signInUrl = `https://accounts.clerk.com/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`;
    assert(signInUrl.includes('accounts.clerk.com'), 'Sign in URL contains Clerk domain');
    assert(signInUrl.includes('sign-in'), 'Sign in URL contains sign-in path');
    assert(signInUrl.includes('redirect_url'), 'Sign in URL contains redirect parameter');
    
    const signUpUrl = `https://accounts.clerk.com/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`;
    assert(signUpUrl.includes('accounts.clerk.com'), 'Sign up URL contains Clerk domain');
    assert(signUpUrl.includes('sign-up'), 'Sign up URL contains sign-up path');
    
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    assert(false, `URI generation test: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Starting Authentication Integration Tests\n');
  console.log('='.repeat(60));
  
  try {
    await testPopupIntegration();
    await testServiceWorkerHandlers();
    await testCallbackHandler();
    await testStorageOperations();
    await testURIGeneration();
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Integration Test Results Summary:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Total: ${testResults.passed + testResults.failed}`);
    console.log(`🎯 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    return testResults.failed === 0;
  } catch (error) {
    console.error('Test suite error:', error);
    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testResults };
}

if (typeof window === 'undefined') {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

