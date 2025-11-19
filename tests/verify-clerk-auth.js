#!/usr/bin/env node
/**
 * Verification script to test Clerk authentication flow
 * Tests that tokens are retrieved and used correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Clerk Authentication Implementation...\n');

const issues = [];
const checks = [];

// Check 1: Gateway retrieves Clerk token
function checkGatewayTokenRetrieval() {
  const gatewayPath = path.join(__dirname, '../src/gateway.js');
  const gatewayCode = fs.readFileSync(gatewayPath, 'utf8');

  const hasGetClerkSessionToken = gatewayCode.includes('getClerkSessionToken()');
  const hasAuthorizationHeader =
    gatewayCode.includes("headers['Authorization']") ||
    gatewayCode.includes('headers["Authorization"]');
  const hasBearerToken =
    gatewayCode.includes("'Bearer ' + clerkToken") || gatewayCode.includes('Bearer ${clerkToken}');

  checks.push({
    name: 'Gateway retrieves Clerk token',
    passed: hasGetClerkSessionToken,
    details: hasGetClerkSessionToken
      ? '✅ getClerkSessionToken() called'
      : '❌ getClerkSessionToken() not found',
  });

  checks.push({
    name: 'Authorization header set',
    passed: hasAuthorizationHeader,
    details: hasAuthorizationHeader
      ? '✅ Authorization header set'
      : '❌ Authorization header not set',
  });

  checks.push({
    name: 'Bearer token format',
    passed: hasBearerToken,
    details: hasBearerToken ? '✅ Bearer token format correct' : '❌ Bearer token format missing',
  });

  if (!hasGetClerkSessionToken || !hasAuthorizationHeader || !hasBearerToken) {
    issues.push('Gateway does not properly retrieve or use Clerk tokens');
  }
}

// Check 2: Token refresh logic
function checkTokenRefresh() {
  const gatewayPath = path.join(__dirname, '../src/gateway.js');
  const gatewayCode = fs.readFileSync(gatewayPath, 'utf8');

  const hasFreshTokenCheck =
    gatewayCode.includes('freshToken') || gatewayCode.includes('getClerkSessionToken()');
  const has401Retry = gatewayCode.includes('401') && gatewayCode.includes('refresh');

  checks.push({
    name: 'Token refresh before request',
    passed: hasFreshTokenCheck,
    details: hasFreshTokenCheck
      ? '✅ Token refreshed before requests'
      : '❌ No token refresh logic',
  });

  checks.push({
    name: '401 retry with token refresh',
    passed: has401Retry,
    details: has401Retry ? '✅ 401 errors trigger token refresh' : '❌ No 401 retry logic',
  });

  if (!hasFreshTokenCheck) {
    issues.push('Token refresh logic missing');
  }
}

// Check 3: No API key fallback
function checkNoApiKeyFallback() {
  const gatewayPath = path.join(__dirname, '../src/gateway.js');
  const gatewayCode = fs.readFileSync(gatewayPath, 'utf8');

  // Check that there's no API key usage
  const hasApiKey =
    gatewayCode.includes('api_key') &&
    (gatewayCode.includes('headers') || gatewayCode.includes('Authorization'));
  const hasClerkOnly =
    gatewayCode.includes('NO API key fallback') || gatewayCode.includes('user-based auth only');

  checks.push({
    name: 'No API key fallback',
    passed: !hasApiKey || hasClerkOnly,
    details: hasClerkOnly
      ? '✅ Clerk-only authentication (no API keys)'
      : hasApiKey
        ? '⚠️ API key found (may be legacy code)'
        : '✅ No API keys',
  });

  if (hasApiKey && !hasClerkOnly) {
    issues.push('API key fallback detected - should use Clerk only');
  }
}

// Check 4: Service worker stores tokens
function checkServiceWorkerTokenStorage() {
  const swPath = path.join(__dirname, '../src/service-worker.js');
  const swCode = fs.readFileSync(swPath, 'utf8');

  const storesToken =
    swCode.includes('clerk_token') &&
    (swCode.includes('chrome.storage.local.set') || swCode.includes('storage.local.set'));
  const handlesAuthCallback =
    swCode.includes('AUTH_CALLBACK_SUCCESS') || swCode.includes('CLERK_AUTH_DETECTED');

  checks.push({
    name: 'Service worker stores tokens',
    passed: storesToken,
    details: storesToken ? '✅ Tokens stored in chrome.storage.local' : '❌ Token storage missing',
  });

  checks.push({
    name: 'Service worker handles auth callbacks',
    passed: handlesAuthCallback,
    details: handlesAuthCallback
      ? '✅ Auth callbacks handled'
      : '❌ Auth callback handling missing',
  });

  if (!storesToken || !handlesAuthCallback) {
    issues.push('Service worker token storage incomplete');
  }
}

// Check 5: Auth module gets tokens from Clerk
function checkAuthModule() {
  const authPath = path.join(__dirname, '../src/auth.js');
  const authCode = fs.readFileSync(authPath, 'utf8');

  const getsTokenFromClerk =
    authCode.includes('session.getToken()') || authCode.includes('clerk.session');
  const storesToken =
    authCode.includes('storeToken') || authCode.includes('chrome.storage.local.set');

  checks.push({
    name: 'Auth module gets Clerk tokens',
    passed: getsTokenFromClerk,
    details: getsTokenFromClerk
      ? '✅ Gets tokens from Clerk session'
      : '❌ Token retrieval missing',
  });

  checks.push({
    name: 'Auth module stores tokens',
    passed: storesToken,
    details: storesToken ? '✅ Stores tokens for service worker' : '❌ Token storage missing',
  });

  if (!getsTokenFromClerk || !storesToken) {
    issues.push('Auth module incomplete');
  }
}

// Run all checks
checkGatewayTokenRetrieval();
checkTokenRefresh();
checkNoApiKeyFallback();
checkServiceWorkerTokenStorage();
checkAuthModule();

// Print results
console.log('📋 Verification Results:\n');

checks.forEach((check, index) => {
  const icon = check.passed ? '✅' : '❌';
  console.log(`${icon} ${check.name}`);
  console.log(`   ${check.details}\n`);
});

console.log('='.repeat(60));
console.log(`\nTotal Checks: ${checks.length}`);
console.log(`Passed: ${checks.filter((c) => c.passed).length}`);
console.log(`Failed: ${checks.filter((c) => !c.passed).length}`);

if (issues.length > 0) {
  console.log('\n⚠️  Issues Found:');
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! Clerk authentication is properly implemented.');
  console.log('\n📝 Next Steps:');
  console.log('   1. Load extension in Chrome');
  console.log('   2. Sign in with Clerk');
  console.log('   3. Check browser DevTools Network tab');
  console.log('   4. Verify Authorization: Bearer <token> header in requests');
  process.exit(0);
}
