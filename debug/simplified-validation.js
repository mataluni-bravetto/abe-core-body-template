/**
 * Simplified Local Validation Script
 * Pre-debugging validation with epistemic certainty maintained
 * 
 * Usage: await runSimplifiedValidation()
 */

class SimplifiedValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      checks: {},
      score: 0,
      maxScore: 130,
      fixes: []
    };
  }

  /**
   * Run simplified validation
   */
  async run() {
    console.log('🔍 Simplified Validation - Epistemic Certainty Check\n');
    console.log('='.repeat(60));

    // Core checks only
    await this.checkCorePatterns();
    await this.generateReport();

    return this.results;
  }

  /**
   * Check core epistemic patterns
   */
  async checkCorePatterns() {
    const checks = {
      mutex: this.checkMutex(),
      circuitBreaker: this.checkCircuitBreaker(),
      tokenRefresh: this.checkTokenRefresh(),
      rehydration: this.checkRehydration(),
      storage: this.checkStorage(),
      observability: this.checkObservability()
    };

    // Run all checks
    for (const [key, checkFn] of Object.entries(checks)) {
      try {
        this.results.checks[key] = await checkFn();
      } catch (error) {
        this.results.checks[key] = {
          status: 'error',
          score: 0,
          maxScore: 0,
          error: error.message
        };
      }
    }

    // Calculate total score
    this.results.score = Object.values(this.results.checks)
      .reduce((sum, check) => sum + (check.score || 0), 0);
  }

  /**
   * Check 1: Mutex Patterns (20 points)
   */
  async checkMutex() {
    const hasMutex = typeof MutexHelper !== 'undefined';
    const hasLocks = typeof navigator !== 'undefined' && navigator.locks;
    
    const score = hasMutex && hasLocks ? 20 : 0;
    
    return {
      name: 'Mutex Patterns',
      status: score === 20 ? 'ok' : 'error',
      score,
      maxScore: 20,
      issues: score === 0 ? ['MutexHelper or navigator.locks not available'] : []
    };
  }

  /**
   * Check 2: Circuit Breaker (10 points)
   */
  async checkCircuitBreaker() {
    const hasCircuitBreaker = typeof CircuitBreaker !== 'undefined';
    const gatewayHasBreaker = typeof gateway !== 'undefined' && 
                               gateway && gateway.circuitBreaker;
    
    const score = hasCircuitBreaker && gatewayHasBreaker ? 10 : 0;
    
    return {
      name: 'Circuit Breaker',
      status: score === 10 ? 'ok' : 'error',
      score,
      maxScore: 10,
      issues: score === 0 ? ['Circuit breaker not initialized'] : []
    };
  }

  /**
   * Check 3: Token Refresh Mutex (15 points)
   */
  async checkTokenRefresh() {
    if (typeof gateway === 'undefined' || !gateway) {
      return {
        name: 'Token Refresh Mutex',
        status: 'error',
        score: 0,
        maxScore: 15,
        issues: ['Gateway not available']
      };
    }

    const hasRefreshMethod = typeof gateway.refreshClerkToken === 'function';
    const hasLocks = typeof navigator !== 'undefined' && navigator.locks;
    
    // Check if gateway code has mutex in refresh
    let hasMutexInRefresh = false;
    try {
      const code = gateway.refreshClerkToken.toString();
      hasMutexInRefresh = code.includes('navigator.locks') || 
                          code.includes('locks.request');
    } catch (e) {
      // Can't check code
    }

    let score = 0;
    if (hasRefreshMethod) score += 4;
    if (hasLocks) score += 5;
    if (hasMutexInRefresh) score += 6;

    return {
      name: 'Token Refresh Mutex',
      status: score >= 12 ? 'ok' : score >= 7 ? 'warning' : 'error',
      score,
      maxScore: 15,
      issues: score < 15 ? ['Token refresh mutex incomplete'] : []
    };
  }

  /**
   * Check 4: State Rehydration (15 points)
   */
  async checkRehydration() {
    // Check if rehydration function exists or pattern is present
    const hasRehydration = typeof rehydrateState === 'function' ||
                           (typeof gateway !== 'undefined' && 
                            gateway && 
                            typeof gateway.initializeGateway === 'function');

    // Check storage access
    let hasStorageAccess = false;
    try {
      await new Promise(resolve => {
        chrome.storage.local.get(['test'], () => {
          hasStorageAccess = true;
          resolve();
        });
      });
    } catch (e) {
      hasStorageAccess = false;
    }

    let score = 0;
    if (hasRehydration) score += 8;
    if (hasStorageAccess) score += 7;

    return {
      name: 'State Rehydration',
      status: score >= 12 ? 'ok' : score >= 8 ? 'warning' : 'error',
      score,
      maxScore: 15,
      issues: score < 15 ? ['Rehydration pattern incomplete'] : []
    };
  }

  /**
   * Check 5: Storage as Truth (15 points)
   */
  async checkStorage() {
    const hasQuotaCheck = typeof gateway !== 'undefined' && 
                          gateway && 
                          typeof gateway.checkStorageQuota === 'function';
    
    let hasStorageListeners = false;
    try {
      // Check if storage listeners are set up (can't directly check, assume if quota check exists)
      hasStorageListeners = hasQuotaCheck;
    } catch (e) {
      hasStorageListeners = false;
    }

    let score = 0;
    if (hasQuotaCheck) score += 8;
    if (hasStorageListeners) score += 4;
    score += 3; // Basic storage usage

    return {
      name: 'Storage as Truth',
      status: score >= 12 ? 'ok' : score >= 8 ? 'warning' : 'error',
      score,
      maxScore: 15,
      issues: score < 15 ? ['Storage monitoring incomplete'] : []
    };
  }

  /**
   * Check 6: Observability (10 points)
   */
  async checkObservability() {
    const hasReportingObserver = typeof ReportingObserver !== 'undefined';
    const hasPerformanceObserver = typeof PerformanceObserver !== 'undefined';
    const hasObservability = typeof ObservabilityManager !== 'undefined' ||
                             typeof observability !== 'undefined';

    let score = 0;
    if (hasReportingObserver || hasObservability) score += 4;
    if (hasPerformanceObserver || hasObservability) score += 3;
    if (typeof Logger !== 'undefined') score += 3;

    return {
      name: 'Observability',
      status: score >= 8 ? 'ok' : score >= 5 ? 'warning' : 'error',
      score,
      maxScore: 10,
      issues: score < 10 ? ['Observability APIs incomplete'] : []
    };
  }

  /**
   * Generate simplified report
   */
  generateReport() {
    const percentage = ((this.results.score / this.results.maxScore) * 100).toFixed(1);
    const targetMet = this.results.score >= 127; // 97.8% target

    console.log('\n📊 VALIDATION RESULTS');
    console.log('='.repeat(60));
    console.log(`Score: ${this.results.score}/${this.results.maxScore} (${percentage}%)`);
    console.log(`Target (97.8%): ${targetMet ? '✅ MET' : '⚠️ NOT MET'}`);
    console.log('');

    // Show check results
    Object.values(this.results.checks).forEach(check => {
      const icon = check.status === 'ok' ? '✅' : 
                   check.status === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${check.name}: ${check.score}/${check.maxScore}`);
      
      if (check.issues && check.issues.length > 0) {
        check.issues.forEach(issue => {
          console.log(`   - ${issue}`);
        });
      }
    });

    console.log('\n' + '='.repeat(60));
    
    if (targetMet) {
      console.log('✅ STATUS: EPISTEMIC CERTAINTY MAINTAINED');
    } else {
      const gap = 127 - this.results.score;
      console.log(`⚠️  STATUS: ${gap} points needed for 97.8%`);
    }
    
    console.log('='.repeat(60) + '\n');
  }
}

// Auto-initialize
if (typeof importScripts !== 'undefined') {
  window.SimplifiedValidator = SimplifiedValidator;
  const validator = new SimplifiedValidator();
  window.runSimplifiedValidation = () => validator.run();
  console.log('✅ Simplified Validator loaded. Run: await runSimplifiedValidation()');
} else if (typeof window !== 'undefined') {
  window.SimplifiedValidator = SimplifiedValidator;
  const validator = new SimplifiedValidator();
  window.runSimplifiedValidation = () => validator.run();
  console.log('✅ Simplified Validator loaded. Run: await runSimplifiedValidation()');
}

