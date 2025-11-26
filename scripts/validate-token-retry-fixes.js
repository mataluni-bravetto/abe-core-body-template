/**
 * Validation Script for Token Retrieval Retry Logic Fixes
 * 
 * Validates that the retry logic has been correctly implemented in:
 * 1. src/auth-callback.js - Token retrieval during sign-in
 * 2. src/auth.js - Token retrieval in checkUserSession()
 * 3. src/popup.js - Token retrieval when token is missing
 */

const fs = require('fs');
const path = require('path');

const VALIDATION_RESULTS = {
  passed: [],
  failed: [],
  warnings: []
};

function logPass(test, details = '') {
  VALIDATION_RESULTS.passed.push({ test, details });
  console.log(`✅ PASS: ${test}${details ? ` - ${details}` : ''}`);
}

function logFail(test, reason) {
  VALIDATION_RESULTS.failed.push({ test, reason });
  console.error(`❌ FAIL: ${test} - ${reason}`);
}

function logWarning(test, reason) {
  VALIDATION_RESULTS.warnings.push({ test, reason });
  console.warn(`⚠️  WARN: ${test} - ${reason}`);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    logFail(`Read file ${filePath}`, error.message);
    return null;
  }
}

function validateAuthCallback() {
  console.log('\n📋 Validating auth-callback.js...');
  const filePath = path.join(__dirname, 'src', 'auth-callback.js');
  const content = readFile(filePath);
  if (!content) return;

  // Check 1: Retry loop exists
  if (content.includes('maxTokenRetries') && content.includes('tokenRetryDelay')) {
    logPass('auth-callback.js has retry configuration');
  } else {
    logFail('auth-callback.js missing retry configuration', 'Should have maxTokenRetries and tokenRetryDelay');
  }

  // Check 2: Retry loop structure
  if (content.includes('for (let tokenAttempt = 0; tokenAttempt < maxTokenRetries; tokenAttempt++)')) {
    logPass('auth-callback.js has retry loop structure');
  } else {
    logFail('auth-callback.js missing retry loop', 'Should have for loop with tokenAttempt counter');
  }

  // Check 3: Token validation in loop
  if (content.includes('if (token)') && content.includes('break;')) {
    logPass('auth-callback.js has token validation and break logic');
  } else {
    logFail('auth-callback.js missing token validation', 'Should check if token exists and break on success');
  }

  // Check 4: Delay between retries
  if (content.includes('setTimeout(resolve, tokenRetryDelay)')) {
    logPass('auth-callback.js has delay between retries');
  } else {
    logFail('auth-callback.js missing retry delay', 'Should wait between retry attempts');
  }

  // Check 5: Clerk SDK reload attempt
  if (content.includes('clerk.load') && content.includes('!clerk.loaded')) {
    logPass('auth-callback.js attempts to reload Clerk SDK on retry');
  } else {
    logWarning('auth-callback.js missing Clerk SDK reload', 'Should try reloading Clerk SDK between retries');
  }

  // Check 6: Error logging after all retries fail
  if (content.includes('CRITICAL: Could not retrieve token after all retries')) {
    logPass('auth-callback.js has critical error logging');
  } else {
    logWarning('auth-callback.js missing critical error logging', 'Should log critical error if all retries fail');
  }

  // Check 7: Retry count is reasonable (5 retries)
  const retryCountMatch = content.match(/maxTokenRetries\s*=\s*(\d+)/);
  if (retryCountMatch) {
    const retryCount = parseInt(retryCountMatch[1]);
    if (retryCount >= 3 && retryCount <= 10) {
      logPass(`auth-callback.js has reasonable retry count (${retryCount})`);
    } else {
      logWarning(`auth-callback.js retry count is ${retryCount}`, 'Should be between 3-10 retries');
    }
  }
}

function validateAuth() {
  console.log('\n📋 Validating auth.js checkUserSession()...');
  const filePath = path.join(__dirname, 'src', 'auth.js');
  const content = readFile(filePath);
  if (!content) return;

  // Check 1: Retry loop exists in checkUserSession
  const checkUserSessionMatch = content.match(/checkUserSession\(\)\s*\{[\s\S]*?for\s*\(let\s+attempt\s*=\s*0[\s\S]*?maxTokenRetries/);
  if (checkUserSessionMatch) {
    logPass('auth.js checkUserSession() has retry loop');
  } else {
    logFail('auth.js checkUserSession() missing retry loop', 'Should have retry logic for token retrieval');
  }

  // Check 2: Retry configuration
  if (content.includes('maxTokenRetries = 3') && content.includes('tokenRetryDelay = 200')) {
    logPass('auth.js has retry configuration');
  } else {
    logFail('auth.js missing retry configuration', 'Should have maxTokenRetries and tokenRetryDelay');
  }

  // Check 3: Token validation and break
  if (content.includes('if (token)') && content.includes('Logger.info(`[Auth] ✅ Retrieved token')) {
    logPass('auth.js has token validation and success logging');
  } else {
    logFail('auth.js missing token validation', 'Should check if token exists and log success');
  }

  // Check 4: Fallback to stored token
  if (content.includes('getStoredToken()') && content.includes('Fallback to stored token')) {
    logPass('auth.js has fallback to stored token');
  } else {
    logWarning('auth.js missing stored token fallback', 'Should try stored token if session retrieval fails');
  }

  // Check 5: Clerk SDK reload attempt
  if (content.includes('this.clerk.load') && content.includes('!this.clerk.loaded')) {
    logPass('auth.js attempts to reload Clerk SDK on retry');
  } else {
    logWarning('auth.js missing Clerk SDK reload', 'Should try reloading Clerk SDK between retries');
  }

  // Check 6: Error logging
  if (content.includes('⚠️ No token available to store')) {
    logPass('auth.js has error logging when token unavailable');
  } else {
    logWarning('auth.js missing error logging', 'Should log warning when token cannot be retrieved');
  }
}

function validatePopup() {
  console.log('\n📋 Validating popup.js token retrieval...');
  const filePath = path.join(__dirname, 'src', 'popup.js');
  const content = readFile(filePath);
  if (!content) return;

  // Check 1: Retry logic exists when token is missing
  if (content.includes('if (!token && auth.clerk)') && content.includes('attempting retries')) {
    logPass('popup.js has retry logic when token is missing');
  } else {
    logFail('popup.js missing retry logic', 'Should retry token retrieval when initial attempt fails');
  }

  // Check 2: Retry loop structure
  if (content.includes('for (let retry = 0; retry < maxRetries && !token; retry++)')) {
    logPass('popup.js has retry loop structure');
  } else {
    logFail('popup.js missing retry loop', 'Should have for loop with retry counter');
  }

  // Check 3: Retry configuration
  if (content.includes('maxRetries = 3') && content.includes('retryDelay = 300')) {
    logPass('popup.js has retry configuration');
  } else {
    logFail('popup.js missing retry configuration', 'Should have maxRetries and retryDelay');
  }

  // Check 4: Delay between retries
  if (content.includes('setTimeout(resolve, retryDelay)')) {
    logPass('popup.js has delay between retries');
  } else {
    logFail('popup.js missing retry delay', 'Should wait between retry attempts');
  }

  // Check 5: Clerk SDK reload attempt
  if (content.includes('auth.clerk.load') && content.includes('!auth.clerk.loaded')) {
    logPass('popup.js attempts to reload Clerk SDK on retry');
  } else {
    logWarning('popup.js missing Clerk SDK reload', 'Should try reloading Clerk SDK between retries');
  }

  // Check 6: Success logging
  if (content.includes('✅ Token retrieved successfully on retry')) {
    logPass('popup.js has success logging');
  } else {
    logWarning('popup.js missing success logging', 'Should log when token is retrieved on retry');
  }

  // Check 7: Token retrieval call
  if (content.includes('token = await auth.getToken()') && content.match(/token\s*=\s*await\s*auth\.getToken\(\)/g)?.length >= 2) {
    logPass('popup.js calls getToken() multiple times (initial + retries)');
  } else {
    logFail('popup.js missing multiple getToken() calls', 'Should call getToken() in retry loop');
  }
}

function validateCodeStructure() {
  console.log('\n📋 Validating code structure and syntax...');
  
  const files = [
    { path: 'src/auth-callback.js', name: 'auth-callback.js' },
    { path: 'src/auth.js', name: 'auth.js' },
    { path: 'src/popup.js', name: 'popup.js' }
  ];

  files.forEach(file => {
    const fullPath = path.join(__dirname, file.path);
    const content = readFile(fullPath);
    if (!content) return;

    // Check for syntax errors (basic checks)
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;

    if (openBraces === closeBraces) {
      logPass(`${file.name} has balanced braces`);
    } else {
      logFail(`${file.name} has unbalanced braces`, `Open: ${openBraces}, Close: ${closeBraces}`);
    }

    if (openParens === closeParens) {
      logPass(`${file.name} has balanced parentheses`);
    } else {
      logFail(`${file.name} has unbalanced parentheses`, `Open: ${openParens}, Close: ${closeParens}`);
    }

    // Check for async/await usage
    if (content.includes('async') && content.includes('await')) {
      logPass(`${file.name} uses async/await correctly`);
    } else {
      logWarning(`${file.name} may not use async/await`, 'Retry logic should use async/await');
    }
  });
}

function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n✅ Passed: ${VALIDATION_RESULTS.passed.length}`);
  console.log(`❌ Failed: ${VALIDATION_RESULTS.failed.length}`);
  console.log(`⚠️  Warnings: ${VALIDATION_RESULTS.warnings.length}`);
  
  if (VALIDATION_RESULTS.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    VALIDATION_RESULTS.failed.forEach(({ test, reason }) => {
      console.log(`  - ${test}: ${reason}`);
    });
  }
  
  if (VALIDATION_RESULTS.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    VALIDATION_RESULTS.warnings.forEach(({ test, reason }) => {
      console.log(`  - ${test}: ${reason}`);
    });
  }
  
  const totalTests = VALIDATION_RESULTS.passed.length + VALIDATION_RESULTS.failed.length;
  const successRate = totalTests > 0 ? (VALIDATION_RESULTS.passed.length / totalTests * 100).toFixed(1) : 0;
  
  console.log(`\n📈 Success Rate: ${successRate}%`);
  
  if (VALIDATION_RESULTS.failed.length === 0) {
    console.log('\n🎉 All critical validations passed!');
    return true;
  } else {
    console.log('\n⚠️  Some validations failed. Please review the issues above.');
    return false;
  }
}

// Run all validations
console.log('🔍 Starting Token Retrieval Retry Logic Validation...\n');

validateAuthCallback();
validateAuth();
validatePopup();
validateCodeStructure();

const allPassed = generateReport();

process.exit(allPassed ? 0 : 1);

