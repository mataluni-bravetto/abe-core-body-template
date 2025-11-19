/**
 * Authentication Feature Validation Tests
 *
 * Validates authentication features through code analysis and logic testing
 */

const fs = require('fs');
const path = require('path');

const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

function assert(condition, message, isWarning = false) {
  if (condition) {
    testResults.passed++;
    testResults.tests.push({ status: 'PASS', message });
    console.log(`✅ PASS: ${message}`);
  } else if (isWarning) {
    testResults.warnings++;
    testResults.tests.push({ status: 'WARN', message });
    console.log(`⚠️  WARN: ${message}`);
  } else {
    testResults.failed++;
    testResults.tests.push({ status: 'FAIL', message });
    console.error(`❌ FAIL: ${message}`);
  }
}

function testFileExists(filePath, description) {
  const fullPath = path.join(__dirname, '../../', filePath);
  const exists = fs.existsSync(fullPath);
  assert(exists, `${description} exists: ${filePath}`);
  return exists;
}

function testFileContent(filePath, checks, description) {
  const fullPath = path.join(__dirname, '../../', filePath);
  if (!fs.existsSync(fullPath)) {
    assert(false, `${description} file not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');

  checks.forEach((check) => {
    const result = typeof check === 'function' ? check(content) : content.includes(check);
    assert(result, `${description}: ${typeof check === 'function' ? check.toString() : check}`);
  });
}

async function testFileStructure() {
  console.log('\n=== Testing File Structure ===');

  testFileExists('src/auth.js', 'Authentication module');
  testFileExists('src/auth-callback.js', 'Callback handler');
  testFileExists('src/clerk-callback.html', 'Callback HTML page');
  testFileExists('src/popup.html', 'Popup HTML');
  testFileExists('src/popup.js', 'Popup script');
  testFileExists('src/popup.css', 'Popup styles');
  testFileExists('src/options.html', 'Options page');
  testFileExists('src/options.js', 'Options script');
  testFileExists('src/service-worker.js', 'Service worker');
  testFileExists('manifest.json', 'Manifest file');
}

async function testAuthModule() {
  console.log('\n=== Testing Authentication Module ===');

  testFileContent(
    'src/auth.js',
    [
      'class AiGuardianAuth',
      'async initialize()',
      'async signIn()',
      'async signUp()',
      'async signOut()',
      'checkUserSession()',
      'getCurrentUser()',
      'isAuthenticated()',
      'getUserAvatar()',
      'getUserDisplayName()',
      'getStoredUser()',
      'clearStoredUser()',
      'chrome.storage',
      'accounts.clerk.com',
    ],
    'Auth module'
  );
}

async function testCallbackHandler() {
  console.log('\n=== Testing Callback Handler ===');

  testFileContent(
    'src/auth-callback.js',
    [
      'class AuthCallbackHandler',
      'async initialize()',
      'async handleCallback()',
      'storeAuthState',
      'redirectToExtension',
      'AUTH_CALLBACK_SUCCESS',
      'chrome.runtime.sendMessage',
    ],
    'Callback handler'
  );
}

async function testPopupIntegration() {
  console.log('\n=== Testing Popup Integration ===');

  testFileContent(
    'src/popup.html',
    [
      'id="authSection"',
      'id="userProfile"',
      'id="authButtons"',
      'id="signInBtn"',
      'id="signUpBtn"',
      'id="signOutBtn"',
      'id="userAvatar"',
      'id="userName"',
      'auth.js',
    ],
    'Popup HTML'
  );

  testFileContent(
    'src/popup.js',
    [
      'initializeAuth()',
      'updateAuthUI()',
      'auth.signIn()',
      'auth.signUp()',
      'auth.signOut()',
      'AUTH_CALLBACK_SUCCESS',
      'chrome.runtime.onMessage',
    ],
    'Popup script'
  );
}

async function testServiceWorkerIntegration() {
  console.log('\n=== Testing Service Worker Integration ===');

  testFileContent(
    'src/service-worker.js',
    ['GET_CLERK_KEY', 'AUTH_CALLBACK_SUCCESS', 'clerk_publishable_key', 'clerk_user'],
    'Service worker'
  );
}

async function testManifestConfiguration() {
  console.log('\n=== Testing Manifest Configuration ===');

  const manifestPath = path.join(__dirname, '../../manifest.json');
  if (!fs.existsSync(manifestPath)) {
    assert(false, 'Manifest file not found');
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  assert(
    manifest.permissions && manifest.permissions.includes('identity'),
    'Identity permission present'
  );
  assert(manifest.content_security_policy, 'CSP configured');

  // CSP is an object with extension_pages property
  const csp =
    manifest.content_security_policy.extension_pages ||
    (typeof manifest.content_security_policy === 'string' ? manifest.content_security_policy : '');
  assert(csp.includes('clerk.com'), 'Clerk domains in CSP');
  assert(manifest.web_accessible_resources, 'Web accessible resources configured');

  const hasCallbackResource = manifest.web_accessible_resources.some(
    (resource) => resource.resources && resource.resources.includes('src/clerk-callback.html')
  );
  assert(hasCallbackResource, 'Callback HTML in web accessible resources');
}

async function testOptionsPage() {
  console.log('\n=== Testing Options Page ===');

  testFileContent(
    'src/options.html',
    ['clerk_publishable_key', 'Authentication', 'Clerk Dashboard'],
    'Options HTML'
  );

  testFileContent(
    'src/options.js',
    ['clerk_publishable_key', 'updateClerkPublishableKey', 'chrome.storage.sync'],
    'Options script'
  );
}

async function testCSSStyling() {
  console.log('\n=== Testing CSS Styling ===');

  testFileContent(
    'src/popup.css',
    ['.auth-section', '.user-profile', '.user-avatar', '.user-name', '.auth-buttons'],
    'Popup CSS'
  );
}

async function testErrorHandling() {
  console.log('\n=== Testing Error Handling ===');

  testFileContent(
    'src/auth.js',
    ['try', 'catch', 'error', 'Logger.error'],
    'Error handling in auth module'
  );

  testFileContent(
    'src/auth-callback.js',
    ['try', 'catch', 'showError', 'Logger.error'],
    'Error handling in callback'
  );
}

async function testSecurityFeatures() {
  console.log('\n=== Testing Security Features ===');

  testFileContent(
    'src/auth.js',
    ['encodeURIComponent', 'chrome.storage.local', 'chrome.storage.sync'],
    'Security features'
  );

  const manifestPath = path.join(__dirname, '../../manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const csp =
    manifest.content_security_policy.extension_pages ||
    (typeof manifest.content_security_policy === 'string' ? manifest.content_security_policy : '');
  assert(csp.includes("script-src 'self'"), 'CSP restricts script sources');
  assert(csp.includes('clerk.com'), 'Clerk domains allowed in CSP');
}

async function testIntegrationPoints() {
  console.log('\n=== Testing Integration Points ===');

  // Check that popup loads auth.js
  const popupHtml = fs.readFileSync(path.join(__dirname, '../../src/popup.html'), 'utf8');
  assert(popupHtml.includes('auth.js'), 'Popup HTML includes auth.js');

  // Check that callback HTML loads callback script
  const callbackHtml = fs.readFileSync(
    path.join(__dirname, '../../src/clerk-callback.html'),
    'utf8'
  );
  assert(callbackHtml.includes('auth-callback.js'), 'Callback HTML includes auth-callback.js');

  // Check that options page can save clerk key
  const optionsJs = fs.readFileSync(path.join(__dirname, '../../src/options.js'), 'utf8');
  assert(optionsJs.includes('clerk_publishable_key'), 'Options script handles clerk key');
}

async function runAllTests() {
  console.log('🧪 Starting Authentication Feature Validation Tests\n');
  console.log('='.repeat(70));

  try {
    await testFileStructure();
    await testAuthModule();
    await testCallbackHandler();
    await testPopupIntegration();
    await testServiceWorkerIntegration();
    await testManifestConfiguration();
    await testOptionsPage();
    await testCSSStyling();
    await testErrorHandling();
    await testSecurityFeatures();
    await testIntegrationPoints();

    console.log('\n' + '='.repeat(70));
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`⚠️  Warnings: ${testResults.warnings}`);
    console.log(`📈 Total: ${testResults.passed + testResults.failed + testResults.warnings}`);
    console.log(
      `🎯 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`
    );

    if (testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      testResults.tests
        .filter((t) => t.status === 'FAIL')
        .forEach((t) => console.log(`   - ${t.message}`));
    }

    if (testResults.warnings > 0) {
      console.log('\n⚠️  Warnings:');
      testResults.tests
        .filter((t) => t.status === 'WARN')
        .forEach((t) => console.log(`   - ${t.message}`));
    }

    // Save report
    const reportPath = path.join(__dirname, 'validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);

    return testResults.failed === 0;
  } catch (error) {
    console.error('Test suite error:', error);
    return false;
  }
}

// Run tests
if (require.main === module) {
  runAllTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllTests, testResults };
