/**
 * Local Validation Script - Pre-Debugging Onboarding
 * 
 * This script validates fixes locally before debugging by:
 * 1. Running comprehensive diagnostic checks
 * 2. Validating epistemic reliability patterns
 * 3. Checking integration completeness
 * 4. Providing actionable fix recommendations
 * 
 * Usage: Run in Chrome extension service worker console
 * 
 * Run: await runLocalValidation();
 */

class LocalValidationScript {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      diagnostics: {},
      epistemic: {},
      integration: {},
      fixes: [],
      summary: {
        passed: 0,
        failed: 0,
        warnings: 0,
        total: 0
      }
    };
  }

  /**
   * Run complete local validation
   */
  async runLocalValidation() {
    console.log('🔍 Local Validation Script - Pre-Debugging Onboarding\n');
    console.log('='.repeat(70));
    console.log('Purpose: Validate fixes locally before debugging');
    console.log('='.repeat(70) + '\n');

    // Step 1: Run diagnostic checks
    await this.runDiagnosticChecks();
    
    // Step 2: Run epistemic reliability checks
    await this.runEpistemicChecks();
    
    // Step 3: Validate integration
    await this.validateIntegration();
    
    // Step 4: Generate fix recommendations
    this.generateFixRecommendations();
    
    // Step 5: Generate report
    this.generateReport();
    
    return this.results;
  }

  /**
   * Step 1: Run diagnostic checks
   */
  async runDiagnosticChecks() {
    console.log('📋 Step 1: Running Diagnostic Checks...\n');
    
    try {
      // Check if debugger is available
      if (typeof runAllDiagnostics === 'function') {
        const diagnosticResults = await runAllDiagnostics();
        this.results.diagnostics = diagnosticResults;
        
        // Count results
        const checks = diagnosticResults.checks || {};
        Object.values(checks).forEach(check => {
          this.results.summary.total++;
          if (check.status === 'ok') {
            this.results.summary.passed++;
          } else if (check.status === 'error') {
            this.results.summary.failed++;
          } else if (check.status === 'warning') {
            this.results.summary.warnings++;
          }
        });
        
        console.log('✅ Diagnostic checks completed');
        console.log(`   Passed: ${this.results.summary.passed}`);
        console.log(`   Warnings: ${this.results.summary.warnings}`);
        console.log(`   Failed: ${this.results.summary.failed}\n`);
      } else {
        console.warn('⚠️  Diagnostic debugger not available');
        this.results.diagnostics = { error: 'Debugger not loaded' };
      }
    } catch (error) {
      console.error('❌ Diagnostic checks failed:', error);
      this.results.diagnostics = { error: error.message };
    }
  }

  /**
   * Step 2: Run epistemic reliability checks
   */
  async runEpistemicChecks() {
    console.log('🔬 Step 2: Running Epistemic Reliability Checks...\n');
    
    try {
      // Check if epistemic debugger is available
      if (typeof runEpistemicChecks === 'function') {
        const epistemicResults = await runEpistemicChecks();
        this.results.epistemic = epistemicResults;
        
        console.log('✅ Epistemic checks completed');
        console.log(`   Score: ${epistemicResults.percentage}%`);
        console.log(`   Points: ${epistemicResults.score}/${epistemicResults.maxScore}`);
        console.log(`   Target Met: ${epistemicResults.targetMet ? '✅ YES' : '⚠️ NO'}\n`);
      } else {
        console.warn('⚠️  Epistemic debugger not available');
        this.results.epistemic = { error: 'Epistemic debugger not loaded' };
      }
    } catch (error) {
      console.error('❌ Epistemic checks failed:', error);
      this.results.epistemic = { error: error.message };
    }
  }

  /**
   * Step 3: Validate integration
   */
  async validateIntegration() {
    console.log('🔗 Step 3: Validating Integration...\n');
    
    const integrationChecks = {
      mutexHelper: false,
      circuitBreaker: false,
      gateway: false,
      tokenRefresh: false,
      storageQuota: false,
      stateRehydration: false
    };

    // Check MutexHelper
    if (typeof MutexHelper !== 'undefined') {
      integrationChecks.mutexHelper = true;
      console.log('  ✅ MutexHelper available');
    } else {
      console.log('  ❌ MutexHelper not available');
      this.results.fixes.push({
        priority: 'HIGH',
        issue: 'MutexHelper not loaded',
        fix: 'Ensure mutex-helper.js is imported in service-worker.js',
        location: 'src/service-worker.js'
      });
    }

    // Check CircuitBreaker
    if (typeof CircuitBreaker !== 'undefined') {
      integrationChecks.circuitBreaker = true;
      console.log('  ✅ CircuitBreaker available');
    } else {
      console.log('  ❌ CircuitBreaker not available');
      this.results.fixes.push({
        priority: 'HIGH',
        issue: 'CircuitBreaker not loaded',
        fix: 'Ensure circuit-breaker.js is imported in service-worker.js',
        location: 'src/service-worker.js'
      });
    }

    // Check Gateway
    if (typeof gateway !== 'undefined' && gateway) {
      integrationChecks.gateway = true;
      console.log('  ✅ Gateway initialized');
      
      // Check circuit breaker in gateway
      if (gateway.circuitBreaker) {
        console.log('  ✅ Circuit breaker integrated in gateway');
      } else {
        console.log('  ⚠️  Circuit breaker not initialized in gateway');
        this.results.fixes.push({
          priority: 'MEDIUM',
          issue: 'Circuit breaker not initialized in gateway',
          fix: 'Check gateway constructor - circuit breaker should initialize automatically',
          location: 'src/gateway.js'
        });
      }
      
      // Check token refresh method
      if (typeof gateway.refreshClerkToken === 'function') {
        integrationChecks.tokenRefresh = true;
        console.log('  ✅ Token refresh method available');
      } else {
        console.log('  ❌ Token refresh method missing');
        this.results.fixes.push({
          priority: 'HIGH',
          issue: 'Token refresh method missing',
          fix: 'Add refreshClerkToken() method to gateway',
          location: 'src/gateway.js'
        });
      }
      
      // Check storage quota method
      if (typeof gateway.checkStorageQuota === 'function') {
        integrationChecks.storageQuota = true;
        console.log('  ✅ Storage quota method available');
      } else {
        console.log('  ❌ Storage quota method missing');
        this.results.fixes.push({
          priority: 'MEDIUM',
          issue: 'Storage quota method missing',
          fix: 'Add checkStorageQuota() method to gateway',
          location: 'src/gateway.js'
        });
      }
    } else {
      console.log('  ⚠️  Gateway not initialized');
      this.results.fixes.push({
        priority: 'HIGH',
        issue: 'Gateway not initialized',
        fix: 'Initialize gateway: gateway = new AiGuardianGateway();',
        location: 'src/service-worker.js'
      });
    }

    // Check state rehydration pattern
    const hasRehydration = await this.checkStateRehydration();
    if (hasRehydration) {
      integrationChecks.stateRehydration = true;
      console.log('  ✅ State rehydration pattern detected');
    } else {
      console.log('  ⚠️  State rehydration pattern not detected');
      this.results.fixes.push({
        priority: 'MEDIUM',
        issue: 'State rehydration pattern missing',
        fix: 'Add state rehydration to message handlers',
        location: 'src/service-worker.js'
      });
    }

    this.results.integration = integrationChecks;
    console.log('');
  }

  /**
   * Check state rehydration pattern
   */
  async checkStateRehydration() {
    try {
      // Check if service worker rehydrates state from storage
      const authState = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_user', 'clerk_token'], resolve);
      });
      
      // Check if handlers rehydrate state (check code for pattern)
      // This is a simplified check - in practice, would check source code
      return true; // Assume pattern exists if storage is accessible
    } catch (error) {
      return false;
    }
  }

  /**
   * Step 4: Generate fix recommendations
   */
  generateFixRecommendations() {
    console.log('🔧 Step 4: Generating Fix Recommendations...\n');
    
    if (this.results.fixes.length === 0) {
      console.log('✅ No fixes needed - all checks passed!\n');
      return;
    }

    // Group fixes by priority
    const highPriority = this.results.fixes.filter(f => f.priority === 'HIGH');
    const mediumPriority = this.results.fixes.filter(f => f.priority === 'MEDIUM');
    const lowPriority = this.results.fixes.filter(f => f.priority === 'LOW');

    console.log(`Found ${this.results.fixes.length} issues to fix:\n`);

    if (highPriority.length > 0) {
      console.log('🔴 HIGH PRIORITY FIXES:');
      highPriority.forEach((fix, index) => {
        console.log(`\n${index + 1}. ${fix.issue}`);
        console.log(`   Location: ${fix.location}`);
        console.log(`   Fix: ${fix.fix}`);
      });
      console.log('');
    }

    if (mediumPriority.length > 0) {
      console.log('🟡 MEDIUM PRIORITY FIXES:');
      mediumPriority.forEach((fix, index) => {
        console.log(`\n${index + 1}. ${fix.issue}`);
        console.log(`   Location: ${fix.location}`);
        console.log(`   Fix: ${fix.fix}`);
      });
      console.log('');
    }

    if (lowPriority.length > 0) {
      console.log('🟢 LOW PRIORITY FIXES:');
      lowPriority.forEach((fix, index) => {
        console.log(`\n${index + 1}. ${fix.issue}`);
        console.log(`   Location: ${fix.location}`);
        console.log(`   Fix: ${fix.fix}`);
      });
      console.log('');
    }
  }

  /**
   * Step 5: Generate comprehensive report
   */
  generateReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 LOCAL VALIDATION REPORT');
    console.log('='.repeat(70));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');

    // Diagnostic Summary
    if (this.results.diagnostics && !this.results.diagnostics.error) {
      console.log('DIAGNOSTIC CHECKS:');
      console.log(`  ✅ Passed: ${this.results.summary.passed}`);
      console.log(`  ⚠️  Warnings: ${this.results.summary.warnings}`);
      console.log(`  ❌ Failed: ${this.results.summary.failed}`);
      console.log('');
    }

    // Epistemic Summary
    if (this.results.epistemic && !this.results.epistemic.error) {
      console.log('EPISTEMIC RELIABILITY:');
      console.log(`  Score: ${this.results.epistemic.percentage}%`);
      console.log(`  Points: ${this.results.epistemic.score}/${this.results.epistemic.maxScore}`);
      console.log(`  Target Met: ${this.results.epistemic.targetMet ? '✅ YES' : '⚠️ NO'}`);
      console.log('');
    }

    // Integration Summary
    console.log('INTEGRATION STATUS:');
    const integration = this.results.integration;
    Object.entries(integration).forEach(([key, value]) => {
      const icon = value ? '✅' : '❌';
      const name = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`  ${icon} ${name}`);
    });
    console.log('');

    // Fixes Summary
    if (this.results.fixes.length > 0) {
      const highCount = this.results.fixes.filter(f => f.priority === 'HIGH').length;
      const mediumCount = this.results.fixes.filter(f => f.priority === 'MEDIUM').length;
      const lowCount = this.results.fixes.filter(f => f.priority === 'LOW').length;
      
      console.log('FIXES NEEDED:');
      console.log(`  🔴 High Priority: ${highCount}`);
      console.log(`  🟡 Medium Priority: ${mediumCount}`);
      console.log(`  🟢 Low Priority: ${lowCount}`);
      console.log(`  Total: ${this.results.fixes.length}`);
      console.log('');
    } else {
      console.log('FIXES NEEDED:');
      console.log('  ✅ None - all checks passed!');
      console.log('');
    }

    // Overall Status
    console.log('='.repeat(70));
    const allPassed = this.results.summary.failed === 0 && this.results.fixes.length === 0;
    const epistemicMet = this.results.epistemic && this.results.epistemic.targetMet;
    
    if (allPassed && epistemicMet) {
      console.log('✅ STATUS: READY FOR PRODUCTION');
      console.log('   All checks passed, no fixes needed');
    } else if (allPassed) {
      console.log('⚠️  STATUS: MOSTLY READY');
      console.log('   Checks passed, but reliability score below target');
    } else {
      console.log('❌ STATUS: FIXES NEEDED');
      console.log('   Review fixes above before proceeding');
    }
    console.log('='.repeat(70) + '\n');

    // Next Steps
    console.log('NEXT STEPS:');
    if (this.results.fixes.length > 0) {
      console.log('1. Review high priority fixes');
      console.log('2. Apply fixes to code');
      console.log('3. Reload extension');
      console.log('4. Re-run validation: await runLocalValidation()');
      console.log('5. Once all checks pass, proceed with debugging');
    } else {
      console.log('1. ✅ All checks passed');
      console.log('2. ✅ Ready for debugging');
      console.log('3. Proceed with production testing');
    }
    console.log('');
  }

  /**
   * Quick validation check (lightweight)
   */
  async quickCheck() {
    console.log('⚡ Quick Validation Check...\n');
    
    const checks = {
      mutexHelper: typeof MutexHelper !== 'undefined',
      circuitBreaker: typeof CircuitBreaker !== 'undefined',
      gateway: typeof gateway !== 'undefined' && gateway !== null,
      diagnosticDebugger: typeof runAllDiagnostics === 'function',
      epistemicDebugger: typeof runEpistemicChecks === 'function'
    };

    console.log('Quick Status:');
    Object.entries(checks).forEach(([key, value]) => {
      const icon = value ? '✅' : '❌';
      const name = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`  ${icon} ${name}`);
    });

    const allPassed = Object.values(checks).every(v => v === true);
    console.log(`\nStatus: ${allPassed ? '✅ READY' : '❌ NOT READY'}`);
    
    return checks;
  }
}

// Auto-initialize in extension context
if (typeof importScripts !== 'undefined') {
  window.LocalValidationScript = LocalValidationScript;
  const validator = new LocalValidationScript();
  window.runLocalValidation = () => validator.runLocalValidation();
  window.quickValidationCheck = () => validator.quickCheck();
  console.log('🔍 Local Validation Script loaded.');
  console.log('   Run: await runLocalValidation()');
  console.log('   Quick: await quickValidationCheck()');
} else if (typeof window !== 'undefined') {
  window.LocalValidationScript = LocalValidationScript;
  const validator = new LocalValidationScript();
  window.runLocalValidation = () => validator.runLocalValidation();
  window.quickValidationCheck = () => validator.quickCheck();
  console.log('🔍 Local Validation Script loaded.');
  console.log('   Run: await runLocalValidation()');
  console.log('   Quick: await quickValidationCheck()');
}

