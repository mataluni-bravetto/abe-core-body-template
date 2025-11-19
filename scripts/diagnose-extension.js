/**
 * Extension Diagnostic Script
 *
 * Run this script to diagnose issues with the Chrome extension.
 * Can be run from popup console or service worker console.
 */

async function diagnoseExtension() {
  const results = {
    timestamp: new Date().toISOString(),
    checks: {},
    errors: [],
    warnings: [],
  };

  console.log('🔍 Starting Extension Diagnostics...\n');

  // Check 1: Extension Context
  try {
    const manifest = chrome.runtime.getManifest();
    results.checks.extensionContext = {
      status: '✅',
      message: 'Extension context available',
      version: manifest.version,
      name: manifest.name,
    };
    console.log('✅ Extension context: OK');
  } catch (e) {
    results.checks.extensionContext = {
      status: '❌',
      message: 'Extension context not available',
      error: e.message,
    };
    results.errors.push('Extension context check failed');
    console.error('❌ Extension context: FAILED', e);
  }

  // Check 2: Service Worker Status
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      results.checks.serviceWorker = {
        status: '✅',
        message: 'Service worker context detected',
        extensionId: chrome.runtime.id,
      };
      console.log('✅ Service worker context: OK');
    } else {
      results.checks.serviceWorker = {
        status: '⚠️',
        message: 'Not in service worker context (this is OK if running from popup)',
      };
      console.log('⚠️ Service worker context: Not applicable');
    }
  } catch (e) {
    results.checks.serviceWorker = {
      status: '❌',
      message: 'Service worker check failed',
      error: e.message,
    };
    results.errors.push('Service worker check failed');
    console.error('❌ Service worker check: FAILED', e);
  }

  // Check 3: Storage Access
  try {
    await new Promise((resolve, reject) => {
      chrome.storage.sync.get(['gateway_url'], (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data);
        }
      });
    });
    results.checks.storageAccess = {
      status: '✅',
      message: 'Storage API accessible',
    };
    console.log('✅ Storage access: OK');
  } catch (e) {
    results.checks.storageAccess = {
      status: '❌',
      message: 'Storage API not accessible',
      error: e.message,
    };
    results.errors.push('Storage access check failed');
    console.error('❌ Storage access: FAILED', e);
  }

  // Check 4: Gateway Configuration
  try {
    const config = await new Promise((resolve) => {
      chrome.storage.sync.get(['gateway_url', 'api_key', 'clerk_publishable_key'], (data) => {
        resolve(data);
      });
    });

    results.checks.gatewayConfig = {
      status: config.gateway_url ? '✅' : '⚠️',
      message: config.gateway_url ? 'Gateway URL configured' : 'Gateway URL not configured',
      gateway_url: config.gateway_url || 'Not set',
      has_api_key: !!config.api_key,
      has_clerk_key: !!config.clerk_publishable_key,
    };

    if (!config.gateway_url) {
      results.warnings.push('Gateway URL not configured - using default');
    }

    console.log(`✅ Gateway config: ${config.gateway_url ? 'OK' : 'WARNING - using default'}`);
  } catch (e) {
    results.checks.gatewayConfig = {
      status: '❌',
      message: 'Failed to read gateway configuration',
      error: e.message,
    };
    results.errors.push('Gateway config check failed');
    console.error('❌ Gateway config: FAILED', e);
  }

  // Check 5: Authentication State
  try {
    const authState = await new Promise((resolve) => {
      chrome.storage.local.get(['clerk_user', 'clerk_token'], (data) => {
        resolve(data);
      });
    });

    results.checks.authState = {
      status: authState.clerk_user ? '✅' : '⚠️',
      message: authState.clerk_user ? 'User authenticated' : 'User not authenticated',
      has_user: !!authState.clerk_user,
      has_token: !!authState.clerk_token,
      user_id: authState.clerk_user?.id || null,
    };

    if (!authState.clerk_user) {
      results.warnings.push('User not authenticated - sign in required');
    }

    console.log(`✅ Auth state: ${authState.clerk_user ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
  } catch (e) {
    results.checks.authState = {
      status: '❌',
      message: 'Failed to read authentication state',
      error: e.message,
    };
    results.errors.push('Auth state check failed');
    console.error('❌ Auth state: FAILED', e);
  }

  // Check 6: Backend Connectivity
  try {
    const gatewayUrl = await new Promise((resolve) => {
      chrome.storage.sync.get(['gateway_url'], (data) => {
        resolve(data.gateway_url || 'https://api.aiguardian.ai');
      });
    });

    const testUrl = `${gatewayUrl.replace(/\/$/, '')}/health/live`;
    console.log(`Testing backend connectivity: ${testUrl}`);

    const startTime = Date.now();
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'X-Extension-Version': chrome.runtime.getManifest().version,
      },
    });
    const responseTime = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      results.checks.backendConnectivity = {
        status: '✅',
        message: 'Backend is reachable',
        responseTime: `${responseTime}ms`,
        statusCode: response.status,
        response: data,
      };
      console.log(`✅ Backend connectivity: OK (${responseTime}ms)`);
    } else {
      results.checks.backendConnectivity = {
        status: '⚠️',
        message: `Backend returned ${response.status}`,
        responseTime: `${responseTime}ms`,
        statusCode: response.status,
      };
      results.warnings.push(`Backend returned status ${response.status}`);
      console.log(`⚠️ Backend connectivity: Status ${response.status}`);
    }
  } catch (e) {
    results.checks.backendConnectivity = {
      status: '❌',
      message: 'Backend not reachable',
      error: e.message,
      errorType: e.name,
    };
    results.errors.push('Backend connectivity check failed');
    console.error('❌ Backend connectivity: FAILED', e);
  }

  // Check 7: Service Worker Message Handling
  try {
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'TEST_GATEWAY_CONNECTION' }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });

    results.checks.messageHandling = {
      status: response?.success ? '✅' : '⚠️',
      message: response?.success
        ? 'Service worker responding'
        : 'Service worker responded but test failed',
      response: response,
    };

    if (response?.success) {
      console.log('✅ Message handling: OK');
    } else {
      console.log(`⚠️ Message handling: ${response?.error || 'Unknown error'}`);
      results.warnings.push('Service worker message test failed');
    }
  } catch (e) {
    results.checks.messageHandling = {
      status: '❌',
      message: 'Service worker not responding',
      error: e.message,
    };
    results.errors.push('Message handling check failed');
    console.error('❌ Message handling: FAILED', e);
  }

  // Summary
  console.log('\n📊 Diagnostic Summary:');
  console.log('='.repeat(50));

  const errorCount = results.errors.length;
  const warningCount = results.warnings.length;
  const checkCount = Object.keys(results.checks).length;
  const successCount = Object.values(results.checks).filter((c) => c.status === '✅').length;

  console.log(`Total Checks: ${checkCount}`);
  console.log(`✅ Passed: ${successCount}`);
  console.log(`⚠️ Warnings: ${warningCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  if (errorCount > 0) {
    console.log('\n❌ Errors Found:');
    results.errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
  }

  if (warningCount > 0) {
    console.log('\n⚠️ Warnings:');
    results.warnings.forEach((warn, i) => {
      console.log(`  ${i + 1}. ${warn}`);
    });
  }

  console.log('\n📋 Detailed Results:');
  Object.entries(results.checks).forEach(([key, check]) => {
    console.log(`  ${check.status} ${key}: ${check.message}`);
  });

  console.log('\n💾 Full results saved to results object');
  console.log('Run: console.log(JSON.stringify(results, null, 2)) to see full details');

  return results;
}

// Auto-run if in console context
if (typeof window !== 'undefined' || typeof self !== 'undefined') {
  // Make function available globally
  if (typeof window !== 'undefined') {
    window.diagnoseExtension = diagnoseExtension;
  }
  if (typeof self !== 'undefined') {
    self.diagnoseExtension = diagnoseExtension;
  }

  console.log('💡 Run diagnoseExtension() to start diagnostics');
}
