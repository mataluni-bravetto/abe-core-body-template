/**
 * Critical Diagnostics Script
 * 
 * Diagnoses critical issues in the actual AiGuardian Chrome Extension
 * Runs comprehensive checks and identifies blocking issues
 * 
 * Usage: await runCriticalDiagnostics()
 */

class CriticalDiagnostics {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      critical: [],
      high: [],
      medium: [],
      checks: {},
      summary: {
        critical: 0,
        high: 0,
        medium: 0,
        total: 0
      }
    };
  }

  /**
   * Run all critical diagnostics
   */
  async run() {
    console.log('🔍 Critical Diagnostics - AiGuardian Chrome Extension\n');
    console.log('='.repeat(70));
    console.log('Analyzing actual extension for critical issues...');
    console.log('='.repeat(70) + '\n');

    await this.checkServiceWorker();
    await this.checkGateway();
    await this.checkAuthentication();
    await this.checkStorage();
    await this.checkErrorHandling();
    await this.checkIntegration();
    await this.checkEpistemicPatterns();

    this.generateReport();
    return this.results;
  }

  /**
   * Check 1: Service Worker Critical Issues
   */
  async checkServiceWorker() {
    console.log('📋 Checking Service Worker...\n');

    const issues = [];

    // Check if service worker is loaded
    if (typeof importScripts === 'undefined') {
      issues.push({
        severity: 'CRITICAL',
        category: 'Service Worker',
        issue: 'Not running in service worker context',
        fix: 'This script must run in service worker console, not regular console'
      });
    }

    // Check gateway initialization
    if (typeof gateway === 'undefined' || !gateway) {
      issues.push({
        severity: 'CRITICAL',
        category: 'Service Worker',
        issue: 'Gateway not initialized',
        fix: 'Gateway must be initialized: gateway = new AiGuardianGateway()'
      });
    } else {
      // Check gateway initialization status
      if (!gateway.isInitialized) {
        issues.push({
          severity: 'HIGH',
          category: 'Service Worker',
          issue: 'Gateway exists but not initialized',
          fix: 'Call: await gateway.initializeGateway()'
        });
      }
    }

    // Check for required imports
    const requiredImports = ['gateway.js', 'logger.js', 'auth.js'];
    // Can't directly check imports, but can check if classes exist
    if (typeof AiGuardianGateway === 'undefined') {
      issues.push({
        severity: 'CRITICAL',
        category: 'Service Worker',
        issue: 'AiGuardianGateway class not available',
        fix: 'Ensure gateway.js is imported in service-worker.js'
      });
    }

    this.results.checks.serviceWorker = {
      gatewayInitialized: typeof gateway !== 'undefined' && gateway && gateway.isInitialized,
      gatewayExists: typeof gateway !== 'undefined' && gateway !== null,
      gatewayClassAvailable: typeof AiGuardianGateway !== 'undefined',
      issues: issues
    };

    this.categorizeIssues(issues);
    this.printIssues('Service Worker', issues);
  }

  /**
   * Check 2: Gateway Critical Issues
   */
  async checkGateway() {
    console.log('🔗 Checking Gateway...\n');

    const issues = [];

    if (typeof gateway === 'undefined' || !gateway) {
      console.log('  ⚠️  Gateway not available - skipping gateway checks');
      this.results.checks.gateway = { available: false };
      return;
    }

    // Check circuit breaker
    if (!gateway.circuitBreaker) {
      issues.push({
        severity: 'HIGH',
        category: 'Gateway',
        issue: 'Circuit breaker not initialized',
        fix: 'Circuit breaker should be initialized in gateway constructor'
      });
    }

    // Check token refresh method
    if (typeof gateway.refreshClerkToken !== 'function') {
      issues.push({
        severity: 'HIGH',
        category: 'Gateway',
        issue: 'Token refresh method missing',
        fix: 'Add refreshClerkToken() method to gateway'
      });
    }

    // Check storage quota method
    if (typeof gateway.checkStorageQuota !== 'function') {
      issues.push({
        severity: 'MEDIUM',
        category: 'Gateway',
        issue: 'Storage quota check missing',
        fix: 'Add checkStorageQuota() method to gateway'
      });
    }

    // Check 401/403 handling
    try {
      const code = gateway.sendToGateway.toString();
      const has401Handling = code.includes('401') || code.includes('Unauthorized');
      const has403Handling = code.includes('403') || code.includes('Forbidden');
      
      if (!has401Handling) {
        issues.push({
          severity: 'CRITICAL',
          category: 'Gateway',
          issue: 'No 401 error handling - authentication failures not handled',
          fix: 'Add 401 error handling with token refresh in sendToGateway()'
        });
      }

      if (!has403Handling) {
        issues.push({
          severity: 'HIGH',
          category: 'Gateway',
          issue: 'No 403 error handling - authorization failures not handled',
          fix: 'Add explicit 403 error handling in sendToGateway()'
        });
      }
    } catch (e) {
      console.log('  ⚠️  Could not analyze gateway code:', e.message);
    }

    // Check unified endpoint usage
    try {
      const code = gateway.sendToGateway.toString();
      const usesUnifiedEndpoint = code.includes('api/v1/guards/process') ||
                                  code.includes('guards/process');
      
      if (!usesUnifiedEndpoint) {
        issues.push({
          severity: 'HIGH',
          category: 'Gateway',
          issue: 'Gateway may not use unified guard endpoint',
          fix: 'Ensure analyze endpoint maps to api/v1/guards/process'
        });
      }
    } catch (e) {
      console.log('  ⚠️  Could not verify endpoint usage');
    }

    this.results.checks.gateway = {
      available: true,
      circuitBreaker: !!gateway.circuitBreaker,
      tokenRefresh: typeof gateway.refreshClerkToken === 'function',
      storageQuota: typeof gateway.checkStorageQuota === 'function',
      issues: issues
    };

    this.categorizeIssues(issues);
    this.printIssues('Gateway', issues);
  }

  /**
   * Check 3: Authentication Critical Issues
   */
  async checkAuthentication() {
    console.log('🔐 Checking Authentication...\n');

    const issues = [];

    // Check Clerk token availability
    if (typeof gateway !== 'undefined' && gateway) {
      try {
        const token = await gateway.getClerkSessionToken();
        if (!token) {
          issues.push({
            severity: 'HIGH',
            category: 'Authentication',
            issue: 'No Clerk session token available',
            fix: 'User must sign in - token will be available after authentication'
          });
        }
      } catch (e) {
        issues.push({
          severity: 'HIGH',
          category: 'Authentication',
          issue: 'Error retrieving Clerk token: ' + e.message,
          fix: 'Check authentication flow and token storage'
        });
      }
    }

    // Check auth module
    if (typeof AiGuardianAuth === 'undefined') {
      issues.push({
        severity: 'MEDIUM',
        category: 'Authentication',
        issue: 'AiGuardianAuth class not available',
        fix: 'Ensure auth.js is imported'
      });
    }

    // Check token storage
    try {
      const stored = await new Promise(resolve => {
        chrome.storage.local.get(['clerk_token'], resolve);
      });
      
      if (!stored.clerk_token) {
        issues.push({
          severity: 'MEDIUM',
          category: 'Authentication',
          issue: 'No token stored in chrome.storage.local',
          fix: 'Token will be stored after user signs in'
        });
      }
    } catch (e) {
      issues.push({
        severity: 'HIGH',
        category: 'Authentication',
        issue: 'Error accessing storage: ' + e.message,
        fix: 'Check chrome.storage.local permissions'
      });
    }

    this.results.checks.authentication = {
      tokenAvailable: false, // Will be set if token exists
      authClassAvailable: typeof AiGuardianAuth !== 'undefined',
      issues: issues
    };

    this.categorizeIssues(issues);
    this.printIssues('Authentication', issues);
  }

  /**
   * Check 4: Storage Critical Issues
   */
  async checkStorage() {
    console.log('💾 Checking Storage...\n');

    const issues = [];

    // Check storage API availability
    if (typeof chrome === 'undefined' || !chrome.storage) {
      issues.push({
        severity: 'CRITICAL',
        category: 'Storage',
        issue: 'Chrome storage API not available',
        fix: 'Extension must have storage permission in manifest.json'
      });
    } else {
      // Test storage access
      try {
        await new Promise((resolve, reject) => {
          chrome.storage.local.get(['test'], () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          });
        });
      } catch (e) {
        issues.push({
          severity: 'CRITICAL',
          category: 'Storage',
          issue: 'Storage access failed: ' + e.message,
          fix: 'Check storage permissions and quota'
        });
      }

      // Check storage quota
      if (typeof gateway !== 'undefined' && gateway && 
          typeof gateway.checkStorageQuota === 'function') {
        try {
          const quota = await gateway.checkStorageQuota();
          if (quota.usagePercent > 90) {
            issues.push({
              severity: 'HIGH',
              category: 'Storage',
              issue: `Storage quota nearly exceeded: ${quota.usagePercent.toFixed(2)}%`,
              fix: 'Clean up old data or request unlimitedStorage permission'
            });
          }
        } catch (e) {
          console.log('  ⚠️  Could not check storage quota:', e.message);
        }
      }
    }

    // Check mutex helper for storage operations
    if (typeof MutexHelper === 'undefined') {
      issues.push({
        severity: 'HIGH',
        category: 'Storage',
        issue: 'MutexHelper not available - race conditions possible',
        fix: 'Import mutex-helper.js in service-worker.js'
      });
    }

    this.results.checks.storage = {
      apiAvailable: typeof chrome !== 'undefined' && !!chrome.storage,
      mutexAvailable: typeof MutexHelper !== 'undefined',
      issues: issues
    };

    this.categorizeIssues(issues);
    this.printIssues('Storage', issues);
  }

  /**
   * Check 5: Error Handling Critical Issues
   */
  async checkErrorHandling() {
    console.log('🛡️  Checking Error Handling...\n');

    const issues = [];

    // Check circuit breaker
    if (typeof CircuitBreaker === 'undefined') {
      issues.push({
        severity: 'HIGH',
        category: 'Error Handling',
        issue: 'CircuitBreaker class not available',
        fix: 'Import circuit-breaker.js in service-worker.js'
      });
    }

    // Check error handler
    if (typeof AiGuardianErrorHandler === 'undefined') {
      issues.push({
        severity: 'MEDIUM',
        category: 'Error Handling',
        issue: 'AiGuardianErrorHandler not available',
        fix: 'Ensure error-handler.js is imported'
      });
    }

    // Check gateway error handling
    if (typeof gateway !== 'undefined' && gateway) {
      try {
        const code = gateway.sendToGateway.toString();
        const hasTryCatch = code.includes('try') && code.includes('catch');
        const hasErrorLogging = code.includes('error') || code.includes('Error');
        
        if (!hasTryCatch) {
          issues.push({
            severity: 'HIGH',
            category: 'Error Handling',
            issue: 'Gateway sendToGateway may not have try-catch blocks',
            fix: 'Add comprehensive error handling in sendToGateway()'
          });
        }
      } catch (e) {
        console.log('  ⚠️  Could not analyze error handling');
      }
    }

    this.results.checks.errorHandling = {
      circuitBreaker: typeof CircuitBreaker !== 'undefined',
      errorHandler: typeof AiGuardianErrorHandler !== 'undefined',
      issues: issues
    };

    this.categorizeIssues(issues);
    this.printIssues('Error Handling', issues);
  }

  /**
   * Check 6: Integration Critical Issues
   */
  async checkIntegration() {
    console.log('🔗 Checking Integration...\n');

    const issues = [];

    // Check mutex helper integration
    if (typeof MutexHelper === 'undefined') {
      issues.push({
        severity: 'HIGH',
        category: 'Integration',
        issue: 'MutexHelper not imported',
        fix: 'Add importScripts("mutex-helper.js") in service-worker.js'
      });
    }

    // Check circuit breaker integration
    if (typeof CircuitBreaker === 'undefined') {
      issues.push({
        severity: 'HIGH',
        category: 'Integration',
        issue: 'CircuitBreaker not imported',
        fix: 'Add importScripts("circuit-breaker.js") in service-worker.js'
      });
    }

    // Check gateway integration
    if (typeof gateway !== 'undefined' && gateway) {
      if (!gateway.circuitBreaker) {
        issues.push({
          severity: 'HIGH',
          category: 'Integration',
          issue: 'Circuit breaker not integrated in gateway',
          fix: 'Initialize circuit breaker in gateway constructor'
        });
      }
    }

    // Check guard services configuration
    if (typeof DEFAULT_CONFIG === 'undefined' || !DEFAULT_CONFIG.GUARD_SERVICES) {
      issues.push({
        severity: 'MEDIUM',
        category: 'Integration',
        issue: 'Guard services configuration not found',
        fix: 'Ensure DEFAULT_CONFIG.GUARD_SERVICES is defined in constants.js'
      });
    }

    this.results.checks.integration = {
      mutexHelper: typeof MutexHelper !== 'undefined',
      circuitBreaker: typeof CircuitBreaker !== 'undefined',
      gatewayCircuitBreaker: typeof gateway !== 'undefined' && 
                            gateway && gateway.circuitBreaker,
      guardServices: typeof DEFAULT_CONFIG !== 'undefined' && 
                    !!DEFAULT_CONFIG.GUARD_SERVICES,
      issues: issues
    };

    this.categorizeIssues(issues);
    this.printIssues('Integration', issues);
  }

  /**
   * Check 7: Epistemic Patterns Critical Issues
   */
  async checkEpistemicPatterns() {
    console.log('🔬 Checking Epistemic Patterns...\n');

    const issues = [];

    // Check mutex patterns
    if (typeof MutexHelper === 'undefined') {
      issues.push({
        severity: 'HIGH',
        category: 'Epistemic Patterns',
        issue: 'Mutex patterns not available - race conditions possible',
        fix: 'Import mutex-helper.js for race condition prevention'
      });
    }

    // Check state rehydration
    if (typeof rehydrateState === 'undefined') {
      issues.push({
        severity: 'MEDIUM',
        category: 'Epistemic Patterns',
        issue: 'State rehydration function not found',
        fix: 'Add rehydrateState() function to service-worker.js'
      });
    }

    // Check storage quota monitoring
    if (typeof gateway === 'undefined' || !gateway || 
        typeof gateway.checkStorageQuota !== 'function') {
      issues.push({
        severity: 'MEDIUM',
        category: 'Epistemic Patterns',
        issue: 'Storage quota monitoring not available',
        fix: 'Add checkStorageQuota() method to gateway'
      });
    }

    // Check circuit breaker
    if (typeof CircuitBreaker === 'undefined') {
      issues.push({
        severity: 'HIGH',
        category: 'Epistemic Patterns',
        issue: 'Circuit breaker pattern not available',
        fix: 'Import circuit-breaker.js for resilience'
      });
    }

    this.results.checks.epistemicPatterns = {
      mutex: typeof MutexHelper !== 'undefined',
      rehydration: typeof rehydrateState === 'function',
      quotaMonitoring: typeof gateway !== 'undefined' && 
                      gateway && typeof gateway.checkStorageQuota === 'function',
      circuitBreaker: typeof CircuitBreaker !== 'undefined',
      issues: issues
    };

    this.categorizeIssues(issues);
    this.printIssues('Epistemic Patterns', issues);
  }

  /**
   * Categorize issues by severity
   */
  categorizeIssues(issues) {
    issues.forEach(issue => {
      if (issue.severity === 'CRITICAL') {
        this.results.critical.push(issue);
        this.results.summary.critical++;
      } else if (issue.severity === 'HIGH') {
        this.results.high.push(issue);
        this.results.summary.high++;
      } else if (issue.severity === 'MEDIUM') {
        this.results.medium.push(issue);
        this.results.summary.medium++;
      }
      this.results.summary.total++;
    });
  }

  /**
   * Print issues for a category
   */
  printIssues(category, issues) {
    if (issues.length === 0) {
      console.log(`  ✅ ${category}: No issues found\n`);
      return;
    }

    issues.forEach(issue => {
      const icon = issue.severity === 'CRITICAL' ? '🔴' :
                   issue.severity === 'HIGH' ? '🟠' : '🟡';
      console.log(`  ${icon} [${issue.severity}] ${issue.issue}`);
      console.log(`     Fix: ${issue.fix}`);
    });
    console.log('');
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 CRITICAL DIAGNOSTICS REPORT');
    console.log('='.repeat(70));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');

    // Summary
    console.log('SUMMARY:');
    console.log(`  🔴 Critical: ${this.results.summary.critical}`);
    console.log(`  🟠 High: ${this.results.summary.high}`);
    console.log(`  🟡 Medium: ${this.results.summary.medium}`);
    console.log(`  Total Issues: ${this.results.summary.total}`);
    console.log('');

    // Critical Issues
    if (this.results.critical.length > 0) {
      console.log('🔴 CRITICAL ISSUES (Must Fix):');
      this.results.critical.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.category}] ${issue.issue}`);
        console.log(`   Fix: ${issue.fix}`);
      });
      console.log('');
    }

    // High Priority Issues
    if (this.results.high.length > 0) {
      console.log('🟠 HIGH PRIORITY ISSUES:');
      this.results.high.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.category}] ${issue.issue}`);
        console.log(`   Fix: ${issue.fix}`);
      });
      console.log('');
    }

    // Medium Priority Issues
    if (this.results.medium.length > 0) {
      console.log('🟡 MEDIUM PRIORITY ISSUES:');
      this.results.medium.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.category}] ${issue.issue}`);
        console.log(`   Fix: ${issue.fix}`);
      });
      console.log('');
    }

    // Overall Status
    console.log('='.repeat(70));
    if (this.results.summary.critical === 0 && this.results.summary.high === 0) {
      console.log('✅ STATUS: NO CRITICAL OR HIGH PRIORITY ISSUES');
      console.log('   Extension is in good shape!');
    } else if (this.results.summary.critical === 0) {
      console.log('⚠️  STATUS: HIGH PRIORITY ISSUES FOUND');
      console.log('   Review and fix high priority items');
    } else {
      console.log('❌ STATUS: CRITICAL ISSUES FOUND');
      console.log('   Fix critical issues immediately!');
    }
    console.log('='.repeat(70) + '\n');

    // Next Steps
    if (this.results.summary.critical > 0 || this.results.summary.high > 0) {
      console.log('NEXT STEPS:');
      console.log('1. Review critical/high priority issues above');
      console.log('2. Apply fixes to code');
      console.log('3. Reload extension');
      console.log('4. Re-run diagnostics: await runCriticalDiagnostics()');
      console.log('');
    }
  }
}

// Auto-initialize
if (typeof importScripts !== 'undefined') {
  window.CriticalDiagnostics = CriticalDiagnostics;
  const diagnostics = new CriticalDiagnostics();
  window.runCriticalDiagnostics = () => diagnostics.run();
  console.log('🔍 Critical Diagnostics loaded.');
  console.log('   Run: await runCriticalDiagnostics()');
} else if (typeof window !== 'undefined') {
  window.CriticalDiagnostics = CriticalDiagnostics;
  const diagnostics = new CriticalDiagnostics();
  window.runCriticalDiagnostics = () => diagnostics.run();
  console.log('🔍 Critical Diagnostics loaded.');
  console.log('   Run: await runCriticalDiagnostics()');
}

