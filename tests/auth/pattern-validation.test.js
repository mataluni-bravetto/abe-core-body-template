/**
 * Authentication Pattern Validation Test
 *
 * Validates that Clerk authentication fixes match existing codebase patterns.
 * This test ensures code consistency and adherence to established conventions.
 *
 * Validates:
 * 1. Storage operation patterns
 * 2. Error handling patterns
 * 3. Retry logic patterns
 * 4. Logging patterns
 * 5. Clerk SDK access patterns
 * 6. Promise patterns
 * 7. User data structure patterns
 * 8. Message handling patterns
 * 9. Storage verification patterns
 * 10. Code consistency
 */

const fs = require('fs');
const path = require('path');

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

function test(name, condition, message) {
  if (condition) {
    results.passed++;
    results.tests.push({ name, status: 'PASS', message });
    console.log(`✅ PASS: ${name}`);
  } else {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', message });
    console.error(`❌ FAIL: ${name} - ${message}`);
  }
}

function warn(name, message) {
  results.warnings++;
  results.tests.push({ name, status: 'WARN', message });
  console.warn(`⚠️  WARN: ${name} - ${message}`);
}

// Read source files (tests/auth/ -> ../src/)
const rootDir = path.join(__dirname, '..', '..');
const authCallbackPath = path.join(rootDir, 'src', 'auth-callback.js');
const popupPath = path.join(rootDir, 'src', 'popup.js');
const serviceWorkerPath = path.join(rootDir, 'src', 'service-worker.js');
const authPath = path.join(rootDir, 'src', 'auth.js');
const gatewayPath = path.join(rootDir, 'src', 'gateway.js');

const authCallbackCode = fs.readFileSync(authCallbackPath, 'utf8');
const popupCode = fs.readFileSync(popupPath, 'utf8');
const serviceWorkerCode = fs.readFileSync(serviceWorkerPath, 'utf8');
const authCode = fs.readFileSync(authPath, 'utf8');

console.log('\n🔍 Source Pattern Validation Test\n');
console.log('='.repeat(60));

// ============================================================================
// PATTERN 1: Storage Operations
// ============================================================================
console.log('\n📦 PATTERN 1: Storage Operations');

// Check: Storage operations use chrome.storage.local.get/set with callbacks
test(
  'auth-callback: storeAuthState uses chrome.storage.local.set with callback',
  /chrome\.storage\.local\.set\([^,]+,\s*\(\)\s*=>/s.test(authCallbackCode),
  'Should use chrome.storage.local.set with callback pattern'
);

test(
  'auth-callback: verifyStorage uses chrome.storage.local.get with callback',
  /chrome\.storage\.local\.get\(\[['"]clerk_user['"]\],\s*\(data\)\s*=>/s.test(authCallbackCode),
  'Should use chrome.storage.local.get with callback pattern'
);

test(
  'auth-callback: Storage operations check chrome.runtime.lastError',
  /chrome\.runtime\.lastError/s.test(authCallbackCode),
  'Should check chrome.runtime.lastError for storage errors'
);

// Compare with existing pattern in service-worker.js
const serviceWorkerHasVerification =
  /chrome\.storage\.local\.get\(\[['"]clerk_user['"]\],\s*\(verifyData\)\s*=>/s.test(
    serviceWorkerCode
  );
test(
  'Pattern match: verifyStorage matches service-worker verification pattern',
  serviceWorkerHasVerification && /verifyStorage/s.test(authCallbackCode),
  'verifyStorage method should match existing verification pattern in service-worker.js'
);

// ============================================================================
// PATTERN 2: Error Handling
// ============================================================================
console.log('\n🛡️  PATTERN 2: Error Handling');

test(
  'auth-callback: storeAuthState rejects on storage error',
  /reject\(new Error\(chrome\.runtime\.lastError\.message\)\)/s.test(authCallbackCode),
  'Should reject Promise on storage error'
);

test(
  'auth-callback: verifyStorage resolves false on error',
  /resolve\(false\)/s.test(authCallbackCode) &&
    /chrome\.runtime\.lastError/s.test(authCallbackCode),
  'Should resolve false when storage read fails'
);

test(
  'auth-callback: Try-catch blocks around critical operations',
  /try\s*\{[\s\S]*await\s+clerk\.handleRedirectCallback\(\)[\s\S]*catch/s.test(authCallbackCode),
  'Should have try-catch around Clerk operations'
);

// ============================================================================
// PATTERN 3: Retry Logic
// ============================================================================
console.log('\n🔄 PATTERN 3: Retry Logic');

test(
  'auth-callback: Retry loop uses for loop with maxRetries',
  /for\s*\(let\s+attempt\s*=\s*0[^}]+maxRetries/s.test(authCallbackCode),
  'Should use for loop with maxRetries constant'
);

test(
  'auth-callback: Retry delay uses setTimeout Promise pattern',
  /new Promise\(resolve\s*=>\s*setTimeout\(resolve,\s*retryDelay\)\)/s.test(authCallbackCode),
  'Should use Promise-wrapped setTimeout for retry delay'
);

test(
  'auth-callback: Retry pattern matches gateway.js retry pattern',
  /const\s+maxRetries\s*=\s*\d+/s.test(authCallbackCode) &&
    /const\s+retryDelay\s*=\s*\d+/s.test(authCallbackCode),
  'Retry constants should match existing retry patterns'
);

// Compare with existing retry pattern
const gatewayCode = fs.readFileSync(gatewayPath, 'utf8');
const hasGatewayRetryPattern = /for\s*\(let\s+attempt\s*=\s*1[^}]+retryAttempts/s.test(gatewayCode);
test(
  'Pattern match: Retry loop structure matches gateway.js pattern',
  hasGatewayRetryPattern && /for\s*\(let\s+attempt\s*=\s*0[^}]+maxRetries/s.test(authCallbackCode),
  'Retry loop should follow similar structure to gateway.js'
);

// ============================================================================
// PATTERN 4: Logging
// ============================================================================
console.log('\n📝 PATTERN 4: Logging');

test(
  'auth-callback: Uses Logger.info/warn/error with context prefix',
  /Logger\.(info|warn|error)\(['"]\[AuthCallback\]/s.test(authCallbackCode),
  'Should use Logger with [AuthCallback] context prefix'
);

test(
  'auth-callback: Logging matches existing patterns',
  /Logger\.info\(['"]\[AuthCallback\]\s+✅/s.test(authCallbackCode),
  'Should use ✅ emoji in success logs (matching service-worker pattern)'
);

test(
  'popup: Uses Logger with [Popup] context prefix',
  /Logger\.(info|warn|error)\(['"]\[Popup\]/s.test(popupCode),
  'Should use Logger with [Popup] context prefix'
);

// Compare logging patterns
const hasServiceWorkerLogging = /Logger\.(info|warn|error)\(['"]\[BG\]/s.test(serviceWorkerCode);
test(
  'Pattern match: Logging prefixes match existing patterns',
  hasServiceWorkerLogging &&
    /Logger\.(info|warn|error)\(['"]\[AuthCallback\]/s.test(authCallbackCode),
  'Logging should match [BG], [CS], [Popup] pattern'
);

// ============================================================================
// PATTERN 5: Clerk SDK Access
// ============================================================================
console.log('\n🔐 PATTERN 5: Clerk SDK Access');

test(
  'auth-callback: Checks clerk.load() method exists before calling',
  /typeof\s+clerk\.load\s*===\s*['"]function['"]/s.test(authCallbackCode),
  'Should check typeof clerk.load === "function" before calling'
);

test(
  'auth-callback: Checks clerk.loaded before calling load()',
  /!clerk\.loaded/s.test(authCallbackCode) && /typeof\s+clerk\.load/s.test(authCallbackCode),
  'Should check !clerk.loaded before calling load()'
);

test(
  'auth-callback: Accesses clerk.user directly (not via await)',
  /clerk\.user/s.test(authCallbackCode) && !/await\s+clerk\.user/s.test(authCallbackCode),
  'Should access clerk.user directly, not with await'
);

test(
  'auth-callback: Accesses clerk.session with await',
  /await\s+clerk\.session/s.test(authCallbackCode),
  "Should await clerk.session (it's a Promise)"
);

// Compare with existing Clerk access patterns
const hasAuthClerkPattern = /typeof\s+this\.clerk\.load\s*===\s*['"]function['"]/s.test(authCode);
test(
  'Pattern match: Clerk access matches auth.js pattern',
  hasAuthClerkPattern && /typeof\s+clerk\.load\s*===\s*['"]function['"]/s.test(authCallbackCode),
  'Clerk SDK access should match auth.js patterns'
);

// ============================================================================
// PATTERN 6: Promise Patterns
// ============================================================================
console.log('\n⚡ PATTERN 6: Promise Patterns');

test(
  'auth-callback: storeAuthState returns Promise with resolve/reject',
  /return\s+new\s+Promise\(\(resolve,\s*reject\)/s.test(authCallbackCode) &&
    /storeAuthState/s.test(authCallbackCode),
  'Should return Promise with resolve/reject callbacks'
);

test(
  'auth-callback: verifyStorage returns Promise',
  /async\s+verifyStorage\(/s.test(authCallbackCode) &&
    /return\s+new\s+Promise\(\(resolve\)/s.test(authCallbackCode),
  'verifyStorage should be async and return Promise'
);

// ============================================================================
// PATTERN 7: User Data Structure
// ============================================================================
console.log('\n👤 PATTERN 7: User Data Structure');

test(
  'auth-callback: User object structure matches auth.js pattern',
  /clerk_user:\s*\{[\s\S]*id:\s*user\.id[\s\S]*email:/s.test(authCallbackCode),
  'clerk_user structure should match auth.js storeAuthState pattern'
);

test(
  'auth-callback: Handles primaryEmailAddress fallback',
  /user\.primaryEmailAddress\?\.emailAddress\s*\|\|\s*user\.emailAddresses\?\.\[0\]\?\.emailAddress/s.test(
    authCallbackCode
  ) || /primaryEmailAddress\?\.emailAddress.*emailAddresses\?\.\[0\]/s.test(authCallbackCode),
  'Should handle email address fallback pattern'
);

// Compare with auth.js user structure
const authUserStructure =
  /clerk_user:\s*\{[\s\S]*id:\s*user\.id[\s\S]*email:\s*user\.primaryEmailAddress/s.test(authCode);
test(
  'Pattern match: User structure matches auth.js',
  authUserStructure && /clerk_user:\s*\{[\s\S]*id:\s*user\.id/s.test(authCallbackCode),
  'User data structure should match auth.js storeAuthState'
);

// ============================================================================
// PATTERN 8: Message Handling
// ============================================================================
console.log('\n📨 PATTERN 8: Message Handling');

test(
  'auth-callback: Sends AUTH_CALLBACK_SUCCESS message',
  /type:\s*['"]AUTH_CALLBACK_SUCCESS['"]/s.test(authCallbackCode),
  'Should send AUTH_CALLBACK_SUCCESS message type'
);

test(
  'popup: Listens for AUTH_CALLBACK_SUCCESS message',
  /request\.type\s*===\s*['"]AUTH_CALLBACK_SUCCESS['"]/s.test(popupCode),
  'Popup should listen for AUTH_CALLBACK_SUCCESS'
);

test(
  'popup: Checks storage immediately on message receive',
  /chrome\.storage\.local\.get\(\[['"]clerk_user['"]\],\s*async\s*\(data\)/s.test(popupCode) &&
    /AUTH_CALLBACK_SUCCESS/s.test(popupCode),
  'Popup should check storage immediately when receiving callback success'
);

// ============================================================================
// PATTERN 9: Storage Verification Pattern
// ============================================================================
console.log('\n✅ PATTERN 9: Storage Verification');

test(
  'auth-callback: Has verifyStorage method',
  /async\s+verifyStorage\(userId\)/s.test(authCallbackCode),
  'Should have verifyStorage method'
);

test(
  'auth-callback: verifyStorage checks userId match',
  /data\.clerk_user\s*&&\s*data\.clerk_user\.id\s*===\s*userId/s.test(authCallbackCode),
  'verifyStorage should verify userId matches'
);

test(
  'Pattern match: Verification matches service-worker pattern',
  serviceWorkerHasVerification && /verifyStorage/s.test(authCallbackCode),
  'verifyStorage should follow same pattern as service-worker verification'
);

// ============================================================================
// PATTERN 10: Code Consistency
// ============================================================================
console.log('\n🔗 PATTERN 10: Code Consistency');

// Check that popup updateAuthUI checks storage first
test(
  'popup: updateAuthUI checks storage first',
  /chrome\.storage\.local\.get\(\[['"]clerk_user['"]\],\s*\(data\)/s.test(popupCode) &&
    /updateAuthUI/s.test(popupCode),
  'updateAuthUI should check storage first (fastest path)'
);

// Check that error messages are user-friendly
test(
  'auth-callback: Error messages are descriptive',
  /Authentication failed/s.test(authCallbackCode) &&
    /no user session found/s.test(authCallbackCode),
  'Error messages should be descriptive and user-friendly'
);

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('\n📊 Validation Results Summary:');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);
console.log(`📈 Total: ${results.passed + results.failed + results.warnings}`);
console.log(
  `🎯 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`
);

if (results.failed > 0) {
  console.log('\n❌ Failed Tests:');
  results.tests
    .filter((t) => t.status === 'FAIL')
    .forEach((t) => console.log(`   - ${t.name}: ${t.message}`));
}

if (results.warnings > 0) {
  console.log('\n⚠️  Warnings:');
  results.tests
    .filter((t) => t.status === 'WARN')
    .forEach((t) => console.log(`   - ${t.name}: ${t.message}`));
}

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
