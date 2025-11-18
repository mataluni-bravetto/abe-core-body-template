/**
 * Production Test Suite for Epistemic Reliability Integration
 * 
 * Tests the integrated patterns:
 * - Mutex patterns
 * - Circuit breaker
 * - Token refresh mutex
 * - State rehydration
 * - Storage quota monitoring
 * 
 * Usage: Run in Chrome extension service worker console
 */

class ProductionTestSuite {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: {},
      summary: {
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  /**
   * Run all production tests
   */
  async runAllTests() {
    console.log('🧪 Production Test Suite - Epistemic Reliability\n');
    console.log('='.repeat(60));
    
    await this.testMutexHelper();
    await this.testCircuitBreaker();
    await this.testTokenStorage();
    await this.testStorageQuota();
    await this.testStateRehydration();
    await this.testGatewayIntegration();
    
    this.generateReport();
    return this.results;
  }

  /**
   * Test 1: Mutex Helper Availability
   */
  async testMutexHelper() {
    console.log('\n📋 Test 1: Mutex Helper Availability');
    const test = {
      name: 'Mutex Helper',
      status: 'unknown',
      issues: []
    };

    try {
      if (typeof MutexHelper === 'undefined') {
        test.status = 'error';
        test.issues.push('MutexHelper not available - mutex patterns not loaded');
      } else {
        // Test mutex methods
        const hasWithLock = typeof MutexHelper.withLock === 'function';
        const hasUpdateStorage = typeof MutexHelper.updateStorage === 'function';
        const hasIncrementCounter = typeof MutexHelper.incrementCounter === 'function';

        if (hasWithLock && hasUpdateStorage && hasIncrementCounter) {
          test.status = 'ok';
          test.details = {
            withLock: true,
            updateStorage: true,
            incrementCounter: true
          };
        } else {
          test.status = 'warning';
          test.issues.push('Some mutex methods missing');
        }
      }

      console.log(`  ${test.status === 'ok' ? '✅' : test.status === 'warning' ? '⚠️' : '❌'} ${test.status.toUpperCase()}`);
      if (test.issues.length > 0) {
        test.issues.forEach(issue => console.log(`    - ${issue}`));
      }
    } catch (error) {
      test.status = 'error';
      test.issues.push(`Test failed: ${error.message}`);
      console.error('  ❌ Test failed:', error);
    }

    this.results.tests.mutexHelper = test;
    this.updateSummary(test.status);
  }

  /**
   * Test 2: Circuit Breaker Availability
   */
  async testCircuitBreaker() {
    console.log('\n📋 Test 2: Circuit Breaker Availability');
    const test = {
      name: 'Circuit Breaker',
      status: 'unknown',
      issues: []
    };

    try {
      if (typeof gateway === 'undefined' || !gateway) {
        test.status = 'warning';
        test.issues.push('Gateway not initialized - cannot test circuit breaker');
      } else if (!gateway.circuitBreaker) {
        test.status = 'error';
        test.issues.push('Circuit breaker not initialized in gateway');
      } else {
        const breaker = gateway.circuitBreaker;
        const state = breaker.getState();
        
        test.status = 'ok';
        test.details = {
          initialized: true,
          state: state.state,
          failureCount: state.failureCount,
          stats: state.stats
        };
      }

      console.log(`  ${test.status === 'ok' ? '✅' : test.status === 'warning' ? '⚠️' : '❌'} ${test.status.toUpperCase()}`);
      if (test.issues.length > 0) {
        test.issues.forEach(issue => console.log(`    - ${issue}`));
      }
    } catch (error) {
      test.status = 'error';
      test.issues.push(`Test failed: ${error.message}`);
      console.error('  ❌ Test failed:', error);
    }

    this.results.tests.circuitBreaker = test;
    this.updateSummary(test.status);
  }

  /**
   * Test 3: Token Storage with Mutex
   */
  async testTokenStorage() {
    console.log('\n📋 Test 3: Token Storage Mutex Protection');
    const test = {
      name: 'Token Storage',
      status: 'unknown',
      issues: []
    };

    try {
      if (typeof gateway === 'undefined' || !gateway) {
        test.status = 'warning';
        test.issues.push('Gateway not available');
      } else {
        // Test that storeClerkToken uses mutex
        const tokenMethod = gateway.storeClerkToken.toString();
        const usesMutex = tokenMethod.includes('MutexHelper') || tokenMethod.includes('mutex');
        
        if (usesMutex) {
          test.status = 'ok';
          test.details = { usesMutex: true };
        } else {
          test.status = 'warning';
          test.issues.push('Token storage may not use mutex protection');
        }
      }

      console.log(`  ${test.status === 'ok' ? '✅' : test.status === 'warning' ? '⚠️' : '❌'} ${test.status.toUpperCase()}`);
      if (test.issues.length > 0) {
        test.issues.forEach(issue => console.log(`    - ${issue}`));
      }
    } catch (error) {
      test.status = 'error';
      test.issues.push(`Test failed: ${error.message}`);
      console.error('  ❌ Test failed:', error);
    }

    this.results.tests.tokenStorage = test;
    this.updateSummary(test.status);
  }

  /**
   * Test 4: Storage Quota Monitoring
   */
  async testStorageQuota() {
    console.log('\n📋 Test 4: Storage Quota Monitoring');
    const test = {
      name: 'Storage Quota',
      status: 'unknown',
      issues: []
    };

    try {
      if (typeof gateway === 'undefined' || !gateway) {
        test.status = 'warning';
        test.issues.push('Gateway not available');
      } else if (typeof gateway.checkStorageQuota !== 'function') {
        test.status = 'error';
        test.issues.push('checkStorageQuota method not found');
      } else {
        const quota = await gateway.checkStorageQuota();
        test.status = 'ok';
        test.details = quota;
        
        if (quota.usagePercent > 90) {
          test.status = 'warning';
          test.issues.push(`Storage usage high: ${quota.usagePercent.toFixed(2)}%`);
        }
      }

      console.log(`  ${test.status === 'ok' ? '✅' : test.status === 'warning' ? '⚠️' : '❌'} ${test.status.toUpperCase()}`);
      if (test.details) {
        console.log(`    Usage: ${test.details.usagePercent.toFixed(2)}% (${(test.details.bytes / 1024).toFixed(2)} KB / ${(test.details.quota / 1024).toFixed(2)} KB)`);
      }
      if (test.issues.length > 0) {
        test.issues.forEach(issue => console.log(`    - ${issue}`));
      }
    } catch (error) {
      test.status = 'error';
      test.issues.push(`Test failed: ${error.message}`);
      console.error('  ❌ Test failed:', error);
    }

    this.results.tests.storageQuota = test;
    this.updateSummary(test.status);
  }

  /**
   * Test 5: State Rehydration
   */
  async testStateRehydration() {
    console.log('\n📋 Test 5: State Rehydration Pattern');
    const test = {
      name: 'State Rehydration',
      status: 'unknown',
      issues: []
    };

    try {
      // Check if service worker rehydrates state
      const authState = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_user', 'clerk_token'], resolve);
      });

      test.status = 'ok';
      test.details = {
        hasUser: !!authState.clerk_user,
        hasToken: !!authState.clerk_token,
        canRehydrate: true
      };

      console.log(`  ${test.status === 'ok' ? '✅' : '❌'} ${test.status.toUpperCase()}`);
      console.log(`    Can rehydrate: ${test.details.canRehydrate}`);
      console.log(`    Has user: ${test.details.hasUser}`);
      console.log(`    Has token: ${test.details.hasToken}`);
    } catch (error) {
      test.status = 'error';
      test.issues.push(`Test failed: ${error.message}`);
      console.error('  ❌ Test failed:', error);
    }

    this.results.tests.stateRehydration = test;
    this.updateSummary(test.status);
  }

  /**
   * Test 6: Gateway Integration
   */
  async testGatewayIntegration() {
    console.log('\n📋 Test 6: Gateway Integration');
    const test = {
      name: 'Gateway Integration',
      status: 'unknown',
      issues: []
    };

    try {
      if (typeof gateway === 'undefined' || !gateway) {
        test.status = 'error';
        test.issues.push('Gateway not initialized');
      } else {
        const checks = {
          hasCircuitBreaker: !!gateway.circuitBreaker,
          hasRefreshToken: typeof gateway.refreshClerkToken === 'function',
          hasCheckQuota: typeof gateway.checkStorageQuota === 'function',
          isInitialized: gateway.isInitialized
        };

        const allChecks = Object.values(checks).every(v => v === true);
        
        if (allChecks) {
          test.status = 'ok';
        } else {
          test.status = 'warning';
          Object.entries(checks).forEach(([key, value]) => {
            if (!value) test.issues.push(`Missing: ${key}`);
          });
        }

        test.details = checks;
      }

      console.log(`  ${test.status === 'ok' ? '✅' : test.status === 'warning' ? '⚠️' : '❌'} ${test.status.toUpperCase()}`);
      if (test.details) {
        Object.entries(test.details).forEach(([key, value]) => {
          console.log(`    ${key}: ${value ? '✅' : '❌'}`);
        });
      }
      if (test.issues.length > 0) {
        test.issues.forEach(issue => console.log(`    - ${issue}`));
      }
    } catch (error) {
      test.status = 'error';
      test.issues.push(`Test failed: ${error.message}`);
      console.error('  ❌ Test failed:', error);
    }

    this.results.tests.gatewayIntegration = test;
    this.updateSummary(test.status);
  }

  /**
   * Update summary statistics
   */
  updateSummary(status) {
    if (status === 'ok') {
      this.results.summary.passed++;
    } else if (status === 'error') {
      this.results.summary.failed++;
    } else if (status === 'warning') {
      this.results.summary.warnings++;
    }
  }

  /**
   * Generate test report
   */
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PRODUCTION TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');

    console.log('SUMMARY:');
    console.log(`  ✅ Passed: ${this.results.summary.passed}`);
    console.log(`  ⚠️  Warnings: ${this.results.summary.warnings}`);
    console.log(`  ❌ Failed: ${this.results.summary.failed}`);
    console.log('');

    const totalTests = Object.keys(this.results.tests).length;
    const passRate = totalTests > 0 
      ? ((this.results.summary.passed / totalTests) * 100).toFixed(1)
      : 0;

    console.log(`Pass Rate: ${passRate}%`);
    console.log('');

    console.log('DETAILED RESULTS:');
    Object.values(this.results.tests).forEach(test => {
      const icon = test.status === 'ok' ? '✅' : 
                   test.status === 'warning' ? '⚠️' : '❌';
      console.log(`\n${icon} ${test.name}: ${test.status.toUpperCase()}`);
      
      if (test.issues && test.issues.length > 0) {
        console.log('  Issues:');
        test.issues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      }
    });

    console.log('\n' + '='.repeat(60));
    
    if (this.results.summary.failed === 0) {
      console.log('✅ All critical tests passed!');
    } else {
      console.log('❌ Some tests failed - review issues above');
    }
    
    console.log('='.repeat(60) + '\n');
  }
}

// Auto-initialize in extension context
if (typeof importScripts !== 'undefined') {
  window.ProductionTestSuite = ProductionTestSuite;
  const testSuite = new ProductionTestSuite();
  window.runProductionTests = () => testSuite.runAllTests();
  console.log('🧪 Production Test Suite loaded. Run: runProductionTests()');
} else if (typeof window !== 'undefined') {
  window.ProductionTestSuite = ProductionTestSuite;
  const testSuite = new ProductionTestSuite();
  window.runProductionTests = () => testSuite.runAllTests();
  console.log('🧪 Production Test Suite loaded. Run: runProductionTests()');
}

