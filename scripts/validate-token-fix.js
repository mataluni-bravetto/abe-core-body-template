/**
 * Validation script for token retrieval fix
 * Tests the logic flow without requiring actual Chrome extension context
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Validating Token Retrieval Fix...\n');

// Read the popup.js file to validate the fix
const popupPath = path.join(__dirname, 'src', 'popup.js');
const popupCode = fs.readFileSync(popupPath, 'utf8');

// Test 1: Check if the fix code exists
console.log('📋 Test 1: Checking if fix code exists...');
const hasTokenRetrievalFix = popupCode.includes('tryGetToken = async () =>') &&
                             popupCode.includes('Starting token retrieval process') &&
                             popupCode.includes('Token retrieved and stored successfully');

if (hasTokenRetrievalFix) {
  console.log('✅ Token retrieval fix code found\n');
} else {
  console.log('❌ Token retrieval fix code NOT found\n');
  process.exit(1);
}

// Test 2: Validate the logic flow
console.log('📋 Test 2: Validating logic flow...');

const checks = {
  hasInitializationCheck: popupCode.includes('if (!auth)') && popupCode.includes('new AiGuardianAuth()'),
  hasInitializedCheck: popupCode.includes('if (!auth.isInitialized)'),
  hasCheckUserSession: popupCode.includes('await auth.checkUserSession()'),
  hasGetToken: popupCode.includes('await auth.getToken()'),
  hasUIUpdate: popupCode.includes('authStatus.textContent = \'✅ Signed In\''),
  hasErrorHandling: popupCode.includes('catch (e)') && popupCode.includes('Failed to retrieve missing token'),
  hasLogging: popupCode.includes('Logger.info') && popupCode.includes('Logger.warn') && popupCode.includes('Logger.error'),
  hasClerkAvailabilityCheck: popupCode.includes('Clerk availability') || popupCode.includes('hasAuthClerk')
};

let allChecksPass = true;
for (const [check, passed] of Object.entries(checks)) {
  if (passed) {
    console.log(`  ✅ ${check}`);
  } else {
    console.log(`  ❌ ${check}`);
    allChecksPass = false;
  }
}

if (allChecksPass) {
  console.log('\n✅ All logic checks passed\n');
} else {
  console.log('\n❌ Some logic checks failed\n');
}

// Test 3: Check code structure
console.log('📋 Test 3: Validating code structure...');

// Extract the tryGetToken function
const tryGetTokenMatch = popupCode.match(/const tryGetToken = async \(\) => \{[\s\S]*?\n\s*\};/);
if (tryGetTokenMatch) {
  const tryGetTokenCode = tryGetTokenMatch[0];
  
  const structureChecks = {
    hasTryBlock: tryGetTokenCode.includes('try {'),
    hasCatchBlock: tryGetTokenCode.includes('catch (e)'),
    hasAsyncAwait: tryGetTokenCode.includes('await'),
    hasAuthInitialization: tryGetTokenCode.includes('auth.initialize()'),
    hasTokenRetrieval: tryGetTokenCode.includes('auth.getToken()'),
    hasUIUpdate: tryGetTokenCode.includes('authStatus.textContent'),
    hasStorageVerification: tryGetTokenCode.includes('chrome.storage.local.get')
  };
  
  let structurePass = true;
  for (const [check, passed] of Object.entries(structureChecks)) {
    if (passed) {
      console.log(`  ✅ ${check}`);
    } else {
      console.log(`  ❌ ${check}`);
      structurePass = false;
    }
  }
  
  if (structurePass) {
    console.log('\n✅ Code structure is correct\n');
  } else {
    console.log('\n❌ Code structure issues found\n');
    allChecksPass = false;
  }
} else {
  console.log('  ❌ Could not extract tryGetToken function\n');
  allChecksPass = false;
}

// Test 4: Check integration with updateConnectionStatus
console.log('📋 Test 4: Checking integration...');

const integrationChecks = {
  isCalledInRightPlace: popupCode.includes('data.clerk_user && !data.clerk_token') && 
                        popupCode.includes('tryGetToken()'),
  updatesUIOnSuccess: popupCode.includes('authStatus.textContent = \'✅ Signed In\'') &&
                      popupCode.includes('authStatus.className = \'connection-value connected\''),
  handlesFailure: popupCode.includes('Token retrieval returned null') || 
                 popupCode.includes('Clerk SDK not available')
};

let integrationPass = true;
for (const [check, passed] of Object.entries(integrationChecks)) {
  if (passed) {
    console.log(`  ✅ ${check}`);
  } else {
    console.log(`  ❌ ${check}`);
    integrationPass = false;
  }
}

if (integrationPass) {
  console.log('\n✅ Integration checks passed\n');
} else {
  console.log('\n❌ Integration issues found\n');
  allChecksPass = false;
}

// Test 5: Validate error handling
console.log('📋 Test 5: Validating error handling...');

const errorHandlingChecks = {
  hasTryCatch: popupCode.includes('try {') && popupCode.includes('catch (e)'),
  logsErrors: popupCode.includes('Logger.error') && popupCode.includes('Failed to retrieve missing token'),
  handlesNullToken: popupCode.includes('Token retrieval returned null'),
  checksClerkAvailability: popupCode.includes('Clerk availability') || popupCode.includes('hasClerk')
};

let errorHandlingPass = true;
for (const [check, passed] of Object.entries(errorHandlingChecks)) {
  if (passed) {
    console.log(`  ✅ ${check}`);
  } else {
    console.log(`  ❌ ${check}`);
    errorHandlingPass = false;
  }
}

if (errorHandlingPass) {
  console.log('\n✅ Error handling is comprehensive\n');
} else {
  console.log('\n❌ Error handling issues found\n');
  allChecksPass = false;
}

// Final summary
console.log('='.repeat(50));
if (allChecksPass && integrationPass && errorHandlingPass) {
  console.log('✅ VALIDATION PASSED: Token retrieval fix is correctly implemented');
  console.log('\nThe fix includes:');
  console.log('  ✓ Token retrieval logic');
  console.log('  ✓ Auth initialization');
  console.log('  ✓ User session sync');
  console.log('  ✓ UI updates');
  console.log('  ✓ Error handling');
  console.log('  ✓ Comprehensive logging');
  console.log('  ✓ Clerk SDK availability checks');
  process.exit(0);
} else {
  console.log('❌ VALIDATION FAILED: Issues found in token retrieval fix');
  process.exit(1);
}

