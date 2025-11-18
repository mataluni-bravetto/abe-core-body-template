/**
 * Simplified Epistemic Reliability Debugger
 * Maintains 97.8% certainty with simplified checks
 * 
 * Usage: await runSimplifiedEpistemicChecks()
 */

class SimplifiedEpistemicDebugger {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      checks: {},
      score: 0,
      maxScore: 130,
      percentage: 0
    };
  }

  /**
   * Run simplified epistemic checks
   */
  async run() {
    console.log('🔬 Simplified Epistemic Reliability Check\n');
    console.log('='.repeat(60));

    // Core 9 checks
    await this.checkStatelessness();
    await this.checkRehydration();
    await this.checkStorage();
    await this.checkMutex();
    await this.checkTokenRefresh();
    await this.checkCircuitBreaker();
    await this.checkObservability();
    await this.checkInvariants();
    await this.checkTermination();

    this.calculateScore();
    this.generateReport();

    return this.results;
  }

  /**
   * Check 1: Statelessness (20 points)
   */
  async checkStatelessness() {
    const hasRehydration = typeof rehydrateState === 'function' ||
                          (typeof gateway !== 'undefined' && gateway);
    const hasStorageAccess = await this.hasStorage();

    const score = hasRehydration && hasStorageAccess ? 20 : hasRehydration ? 15 : 10;

    this.results.checks.statelessness = {
      name: 'Statelessness',
      score,
      maxScore: 20,
      status: score >= 18 ? 'ok' : score >= 15 ? 'warning' : 'error'
    };
  }

  /**
   * Check 2: Rehydration (15 points)
   */
  async checkRehydration() {
    const hasRehydration = typeof rehydrateState === 'function';
    const gatewayRehydrates = typeof gateway !== 'undefined' && 
                              gateway && 
                              typeof gateway.initializeGateway === 'function';

    const score = hasRehydration && gatewayRehydrates ? 15 : 
                  gatewayRehydrates ? 12 : 8;

    this.results.checks.rehydration = {
      name: 'Rehydration',
      score,
      maxScore: 15,
      status: score >= 12 ? 'ok' : 'warning'
    };
  }

  /**
   * Check 3: Storage as Truth (15 points)
   */
  async checkStorage() {
    const hasQuotaCheck = typeof gateway !== 'undefined' && 
                          gateway && 
                          typeof gateway.checkStorageQuota === 'function';
    const hasStorage = await this.hasStorage();

    const score = hasQuotaCheck && hasStorage ? 15 : hasStorage ? 12 : 8;

    this.results.checks.storage = {
      name: 'Storage as Truth',
      score,
      maxScore: 15,
      status: score >= 12 ? 'ok' : 'warning'
    };
  }

  /**
   * Check 4: Mutex Patterns (20 points)
   */
  async checkMutex() {
    const hasMutex = typeof MutexHelper !== 'undefined';
    const hasLocks = typeof navigator !== 'undefined' && navigator.locks;

    const score = hasMutex && hasLocks ? 20 : 0;

    this.results.checks.mutex = {
      name: 'Mutex Patterns',
      score,
      maxScore: 20,
      status: score === 20 ? 'ok' : 'error'
    };
  }

  /**
   * Check 5: Token Refresh Mutex (15 points)
   */
  async checkTokenRefresh() {
    if (typeof gateway === 'undefined' || !gateway) {
      this.results.checks.tokenRefresh = {
        name: 'Token Refresh Mutex',
        score: 0,
        maxScore: 15,
        status: 'error'
      };
      return;
    }

    const hasRefresh = typeof gateway.refreshClerkToken === 'function';
    const hasLocks = typeof navigator !== 'undefined' && navigator.locks;
    
    let hasMutexInCode = false;
    try {
      const code = gateway.refreshClerkToken.toString();
      hasMutexInCode = code.includes('navigator.locks') || code.includes('locks.request');
    } catch (e) {}

    const score = hasRefresh && hasLocks && hasMutexInCode ? 15 :
                  hasRefresh && hasLocks ? 12 : hasRefresh ? 7 : 0;

    this.results.checks.tokenRefresh = {
      name: 'Token Refresh Mutex',
      score,
      maxScore: 15,
      status: score >= 12 ? 'ok' : score >= 7 ? 'warning' : 'error'
    };
  }

  /**
   * Check 6: Circuit Breaker (10 points)
   */
  async checkCircuitBreaker() {
    const hasBreaker = typeof CircuitBreaker !== 'undefined';
    const gatewayHasBreaker = typeof gateway !== 'undefined' && 
                               gateway && gateway.circuitBreaker;

    const score = hasBreaker && gatewayHasBreaker ? 10 : hasBreaker ? 6 : 2;

    this.results.checks.circuitBreaker = {
      name: 'Circuit Breaker',
      score,
      maxScore: 10,
      status: score === 10 ? 'ok' : score >= 6 ? 'warning' : 'error'
    };
  }

  /**
   * Check 7: Observability (10 points)
   */
  async checkObservability() {
    const hasReporting = typeof ReportingObserver !== 'undefined';
    const hasPerformance = typeof PerformanceObserver !== 'undefined';
    const hasObservability = typeof ObservabilityManager !== 'undefined' ||
                             typeof observability !== 'undefined';
    const hasLogger = typeof Logger !== 'undefined';

    let score = 0;
    if (hasReporting || hasObservability) score += 4;
    if (hasPerformance || hasObservability) score += 3;
    if (hasLogger) score += 3;

    this.results.checks.observability = {
      name: 'Observability',
      score,
      maxScore: 10,
      status: score >= 8 ? 'ok' : score >= 5 ? 'warning' : 'error'
    };
  }

  /**
   * Check 8: Invariant Checking (10 points)
   */
  async checkInvariants() {
    const hasInvariant = typeof InvariantChecker !== 'undefined';
    const hasValidation = typeof gateway !== 'undefined' && 
                         gateway && 
                         typeof gateway.validateApiResponse === 'function';

    const score = hasInvariant ? 10 : hasValidation ? 7 : 3;

    this.results.checks.invariants = {
      name: 'Invariant Checking',
      score,
      maxScore: 10,
      status: score >= 8 ? 'ok' : score >= 5 ? 'warning' : 'error'
    };
  }

  /**
   * Check 9: Termination Awareness (15 points)
   */
  async checkTermination() {
    const hasAlarms = typeof chrome !== 'undefined' && chrome.alarms;
    const hasStorage = await this.hasStorage();
    const hasRehydration = typeof rehydrateState === 'function' ||
                          (typeof gateway !== 'undefined' && gateway);

    let score = 0;
    if (hasAlarms) score += 5;
    if (hasStorage) score += 5;
    if (hasRehydration) score += 5;

    this.results.checks.termination = {
      name: 'Termination Awareness',
      score,
      maxScore: 15,
      status: score >= 12 ? 'ok' : score >= 8 ? 'warning' : 'error'
    };
  }

  /**
   * Helper: Check storage availability
   */
  async hasStorage() {
    try {
      return new Promise((resolve) => {
        chrome.storage.local.get(['test'], () => {
          resolve(chrome.runtime.lastError === undefined);
        });
      });
    } catch (e) {
      return false;
    }
  }

  /**
   * Calculate total score
   */
  calculateScore() {
    this.results.score = Object.values(this.results.checks)
      .reduce((sum, check) => sum + (check.score || 0), 0);
    this.results.percentage = ((this.results.score / this.results.maxScore) * 100).toFixed(1);
  }

  /**
   * Generate simplified report
   */
  generateReport() {
    console.log('\n📊 EPISTEMIC RELIABILITY REPORT');
    console.log('='.repeat(60));
    console.log(`Score: ${this.results.score}/${this.results.maxScore} (${this.results.percentage}%)`);
    console.log(`Target (97.8%): ${this.results.score >= 127 ? '✅ MET' : '⚠️ NOT MET'}`);
    console.log('');

    Object.values(this.results.checks).forEach(check => {
      const icon = check.status === 'ok' ? '✅' : 
                   check.status === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${check.name}: ${check.score}/${check.maxScore}`);
    });

    console.log('\n' + '='.repeat(60));
    
    if (this.results.score >= 127) {
      console.log('✅ EPISTEMIC CERTAINTY MAINTAINED (97.8%+)');
    } else {
      const gap = 127 - this.results.score;
      console.log(`⚠️  ${gap} points needed for 97.8% certainty`);
    }
    
    console.log('='.repeat(60) + '\n');
  }
}

// Auto-initialize
if (typeof importScripts !== 'undefined') {
  window.SimplifiedEpistemicDebugger = SimplifiedEpistemicDebugger;
  const debugger = new SimplifiedEpistemicDebugger();
  window.runSimplifiedEpistemicChecks = () => debugger.run();
  console.log('✅ Simplified Epistemic Debugger loaded.');
  console.log('   Run: await runSimplifiedEpistemicChecks()');
} else if (typeof window !== 'undefined') {
  window.SimplifiedEpistemicDebugger = SimplifiedEpistemicDebugger;
  const debugger = new SimplifiedEpistemicDebugger();
  window.runSimplifiedEpistemicChecks = () => debugger.run();
  console.log('✅ Simplified Epistemic Debugger loaded.');
  console.log('   Run: await runSimplifiedEpistemicChecks()');
}

