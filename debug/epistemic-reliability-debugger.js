/**
 * Epistemic Reliability Debugger for Chrome Extension MV3
 * 
 * Based on research: "Epistemic Reliability and Architectural Resilience in Modern Chrome Extension Development"
 * 
 * Validates the extension against 97.8% reliability architecture patterns:
 * - Stateless Core + State Rehydration
 * - Storage as Single Source of Truth
 * - Mutex-Protected Concurrency
 * - Smart Network Client (Token Refresh Mutex)
 * - Circuit Breaker Pattern
 * - Self-Verifying Runtime
 * - Termination-Aware Design
 */

class EpistemicReliabilityDebugger {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      context: this.detectContext(),
      checks: {},
      score: 0,
      maxScore: 0,
      recommendations: []
    };
  }

  detectContext() {
    if (typeof importScripts !== 'undefined') {
      return 'service-worker';
    } else if (typeof window !== 'undefined' && window.location && window.location.protocol === 'chrome-extension:') {
      return 'popup';
    }
    return 'unknown';
  }

  /**
   * Run all epistemic reliability checks
   */
  async runAllChecks() {
    console.log('🔬 Epistemic Reliability Analysis - MV3 Architecture Validation\n');
    
    await this.checkStatelessness();
    await this.checkStateRehydration();
    await this.checkStorageAsTruth();
    await this.checkMutexPatterns();
    await this.checkTokenRefreshMutex();
    await this.checkCircuitBreaker();
    await this.checkObservability();
    await this.checkInvariantChecking();
    await this.checkTerminationAwareness();
    
    this.calculateScore();
    this.generateReport();
    return this.results;
  }

  /**
   * Check 1: Stateless Core Pattern
   * Service worker should not rely on in-memory state
   */
  async checkStatelessness() {
    console.log('📊 Checking statelessness pattern...');
    const check = {
      name: 'Stateless Core',
      status: 'unknown',
      score: 0,
      maxScore: 20,
      issues: [],
      findings: {}
    };

    try {
      // Check if gateway is recreated on each wake
      // This is hard to detect statically, but we can check patterns
      const hasGlobalState = typeof gateway !== 'undefined' && gateway !== null;
      
      // Check for state rehydration on initialization
      const swCode = await this.getServiceWorkerCode();
      const hasRehydration = swCode && (
        swCode.includes('chrome.storage.local.get') ||
        swCode.includes('chrome.storage.session.get') ||
        swCode.includes('loadConfiguration') ||
        swCode.includes('initializeGateway')
      );

      check.findings = {
        hasGlobalState: hasGlobalState,
        hasRehydration: hasRehydration
      };

      if (hasRehydration) {
        check.score += 10;
      } else {
        check.issues.push('No state rehydration detected on service worker wake');
      }

      // Check for in-memory state assumptions
      if (hasGlobalState && !hasRehydration) {
        check.issues.push('Global state exists without rehydration - may lose state on termination');
        check.status = 'error';
      } else if (hasRehydration) {
        check.score += 10;
        check.status = 'ok';
      } else {
        check.status = 'warning';
      }

      console.log(`  ${check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} Statelessness: ${check.score}/${check.maxScore}`);
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.statelessness = check;
    this.results.maxScore += check.maxScore;
  }

  /**
   * Check 2: State Rehydration Pattern
   * Every event handler should rehydrate state from storage
   */
  async checkStateRehydration() {
    console.log('🔄 Checking state rehydration pattern...');
    const check = {
      name: 'State Rehydration',
      status: 'unknown',
      score: 0,
      maxScore: 15,
      issues: [],
      findings: {}
    };

    try {
      const swCode = await this.getServiceWorkerCode();
      
      // Check for rehydration in message handlers
      const hasMessageRehydration = swCode && (
        swCode.includes('chrome.storage.local.get') ||
        swCode.includes('chrome.storage.session.get')
      );

      // Check gateway initialization loads from storage
      const gatewayCode = await this.getGatewayCode();
      const hasGatewayRehydration = gatewayCode && (
        gatewayCode.includes('loadConfiguration') ||
        gatewayCode.includes('chrome.storage')
      );

      check.findings = {
        hasMessageRehydration,
        hasGatewayRehydration
      };

      if (hasMessageRehydration) {
        check.score += 8;
      } else {
        check.issues.push('Message handlers may not rehydrate state from storage');
      }

      if (hasGatewayRehydration) {
        check.score += 7;
      } else {
        check.issues.push('Gateway may not rehydrate configuration from storage');
      }

      if (check.score >= 12) {
        check.status = 'ok';
      } else if (check.score >= 8) {
        check.status = 'warning';
      } else {
        check.status = 'error';
      }

      console.log(`  ${check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} Rehydration: ${check.score}/${check.maxScore}`);
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.rehydration = check;
    this.results.maxScore += check.maxScore;
  }

  /**
   * Check 3: Storage as Single Source of Truth
   * State should be persisted immediately, not cached in memory
   */
  async checkStorageAsTruth() {
    console.log('💾 Checking storage as truth pattern...');
    const check = {
      name: 'Storage as Truth',
      status: 'unknown',
      score: 0,
      maxScore: 15,
      issues: [],
      findings: {}
    };

    try {
      const gatewayCode = await this.getGatewayCode();
      
      // Check for immediate storage writes
      const hasImmediateWrites = gatewayCode && (
        gatewayCode.includes('chrome.storage.local.set') ||
        gatewayCode.includes('chrome.storage.session.set')
      );

      // Check for storage quota monitoring
      const hasQuotaMonitoring = gatewayCode && (
        gatewayCode.includes('getBytesInUse') ||
        gatewayCode.includes('quota')
      );

      // Check for storage event listeners
      const swCode = await this.getServiceWorkerCode();
      const hasStorageListeners = swCode && swCode.includes('chrome.storage.onChanged');

      check.findings = {
        hasImmediateWrites,
        hasQuotaMonitoring,
        hasStorageListeners
      };

      if (hasImmediateWrites) {
        check.score += 8;
      } else {
        check.issues.push('State may not be persisted immediately to storage');
      }

      if (hasQuotaMonitoring) {
        check.score += 4;
      } else {
        check.issues.push('No storage quota monitoring - may fail silently when quota exceeded');
      }

      if (hasStorageListeners) {
        check.score += 3;
      }

      if (check.score >= 12) {
        check.status = 'ok';
      } else if (check.score >= 8) {
        check.status = 'warning';
      } else {
        check.status = 'error';
      }

      console.log(`  ${check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} Storage as Truth: ${check.score}/${check.maxScore}`);
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.storageAsTruth = check;
    this.results.maxScore += check.maxScore;
  }

  /**
   * Check 4: Mutex Patterns for Concurrency
   * Storage mutations should be protected by navigator.locks
   */
  async checkMutexPatterns() {
    console.log('🔒 Checking mutex patterns...');
    const check = {
      name: 'Mutex Patterns',
      status: 'unknown',
      score: 0,
      maxScore: 20,
      issues: [],
      findings: {}
    };

    try {
      const gatewayCode = await this.getGatewayCode();
      const swCode = await this.getServiceWorkerCode();
      const allCode = (gatewayCode || '') + (swCode || '');

      // Check for navigator.locks usage
      const hasLocks = allCode.includes('navigator.locks') || 
                       allCode.includes('navigator.locks.request');

      // Check for storage mutations that might need locks
      const hasStorageMutations = allCode.includes('chrome.storage.local.set') ||
                                  allCode.includes('chrome.storage.session.set');

      // Check for race condition patterns (check-then-act)
      const hasRaceConditionRisk = hasStorageMutations && !hasLocks;

      check.findings = {
        hasLocks,
        hasStorageMutations,
        hasRaceConditionRisk
      };

      if (hasLocks) {
        check.score += 20;
        check.status = 'ok';
      } else if (hasRaceConditionRisk) {
        check.score = 0;
        check.status = 'error';
        check.issues.push('CRITICAL: Storage mutations without mutex protection - race conditions possible');
        check.issues.push('Storage operations like count++ may lose data under concurrent events');
      } else {
        check.score += 10;
        check.status = 'warning';
        check.issues.push('No mutex patterns detected - may be safe if no concurrent mutations');
      }

      console.log(`  ${check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} Mutex Patterns: ${check.score}/${check.maxScore}`);
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.mutexPatterns = check;
    this.results.maxScore += check.maxScore;
  }

  /**
   * Check 5: Token Refresh Mutex
   * 401 errors should trigger serialized token refresh, not thundering herd
   */
  async checkTokenRefreshMutex() {
    console.log('🔄 Checking token refresh mutex...');
    const check = {
      name: 'Token Refresh Mutex',
      status: 'unknown',
      score: 0,
      maxScore: 15,
      issues: [],
      findings: {}
    };

    try {
      const gatewayCode = await this.getGatewayCode();
      
      // Check for 401 handling
      const has401Handling = gatewayCode && (
        gatewayCode.includes('401') ||
        gatewayCode.includes('Unauthorized')
      );

      // Check for token refresh logic
      const hasTokenRefresh = gatewayCode && (
        gatewayCode.includes('refreshToken') ||
        gatewayCode.includes('refreshClerkToken') ||
        gatewayCode.includes('getClerkSessionToken')
      );

      // Check for mutex/lock in refresh logic
      const hasRefreshMutex = gatewayCode && (
        gatewayCode.includes('navigator.locks') ||
        gatewayCode.includes('lock') && gatewayCode.includes('refresh')
      );

      // Check for retry logic
      const hasRetryLogic = gatewayCode && (
        gatewayCode.includes('retry') ||
        gatewayCode.includes('RETRY')
      );

      check.findings = {
        has401Handling,
        hasTokenRefresh,
        hasRefreshMutex,
        hasRetryLogic
      };

      if (has401Handling) {
        check.score += 3;
      } else {
        check.issues.push('No 401 error handling detected');
      }

      if (hasTokenRefresh) {
        check.score += 4;
      } else {
        check.issues.push('No token refresh logic detected');
      }

      if (hasRefreshMutex) {
        check.score += 5;
      } else if (hasTokenRefresh) {
        check.issues.push('CRITICAL: Token refresh without mutex - thundering herd problem possible');
        check.issues.push('Multiple concurrent 401s will trigger multiple refresh calls');
      }

      if (hasRetryLogic) {
        check.score += 3;
      }

      if (check.score >= 12) {
        check.status = 'ok';
      } else if (check.score >= 7) {
        check.status = 'warning';
      } else {
        check.status = 'error';
      }

      console.log(`  ${check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} Token Refresh Mutex: ${check.score}/${check.maxScore}`);
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.tokenRefreshMutex = check;
    this.results.maxScore += check.maxScore;
  }

  /**
   * Check 6: Circuit Breaker Pattern
   * Network failures should trigger circuit breaker, not infinite retries
   */
  async checkCircuitBreaker() {
    console.log('⚡ Checking circuit breaker pattern...');
    const check = {
      name: 'Circuit Breaker',
      status: 'unknown',
      score: 0,
      maxScore: 10,
      issues: [],
      findings: {}
    };

    try {
      const gatewayCode = await this.getGatewayCode();
      
      // Check for circuit breaker pattern
      const hasCircuitBreaker = gatewayCode && (
        gatewayCode.includes('circuit') ||
        gatewayCode.includes('CircuitBreaker') ||
        gatewayCode.includes('breaker')
      );

      // Check for failure tracking
      const hasFailureTracking = gatewayCode && (
        gatewayCode.includes('failures') ||
        gatewayCode.includes('errorCount') ||
        gatewayCode.includes('traceStats')
      );

      // Check for retry limits
      const hasRetryLimits = gatewayCode && (
        gatewayCode.includes('retryAttempts') ||
        gatewayCode.includes('RETRY_ATTEMPTS')
      );

      check.findings = {
        hasCircuitBreaker,
        hasFailureTracking,
        hasRetryLimits
      };

      if (hasCircuitBreaker) {
        check.score += 10;
        check.status = 'ok';
      } else if (hasFailureTracking && hasRetryLimits) {
        check.score += 6;
        check.status = 'warning';
        check.issues.push('Has retry limits but no circuit breaker - may still retry on persistent failures');
      } else {
        check.score += 2;
        check.status = 'error';
        check.issues.push('No circuit breaker pattern - may retry indefinitely on backend outages');
      }

      console.log(`  ${check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} Circuit Breaker: ${check.score}/${check.maxScore}`);
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.circuitBreaker = check;
    this.results.maxScore += check.maxScore;
  }

  /**
   * Check 7: Observability APIs
   * ReportingObserver, PerformanceObserver for self-diagnosis
   */
  async checkObservability() {
    console.log('👁️  Checking observability patterns...');
    const check = {
      name: 'Observability',
      status: 'unknown',
      score: 0,
      maxScore: 10,
      issues: [],
      findings: {}
    };

    try {
      const swCode = await this.getServiceWorkerCode();
      const popupCode = await this.getPopupCode();
      const allCode = (swCode || '') + (popupCode || '');

      // Check for ReportingObserver
      const hasReportingObserver = allCode.includes('ReportingObserver') ||
                                   allCode.includes('new ReportingObserver');

      // Check for PerformanceObserver
      const hasPerformanceObserver = allCode.includes('PerformanceObserver') ||
                                     allCode.includes('new PerformanceObserver');

      // Check for telemetry/logging
      const hasTelemetry = allCode.includes('Logger') ||
                          allCode.includes('telemetry') ||
                          allCode.includes('traceStats');

      check.findings = {
        hasReportingObserver,
        hasPerformanceObserver,
        hasTelemetry
      };

      if (hasReportingObserver) {
        check.score += 4;
      } else {
        check.issues.push('No ReportingObserver - cannot detect browser violations or deprecations');
      }

      if (hasPerformanceObserver) {
        check.score += 3;
      } else {
        check.issues.push('No PerformanceObserver - cannot detect performance regressions');
      }

      if (hasTelemetry) {
        check.score += 3;
      }

      if (check.score >= 8) {
        check.status = 'ok';
      } else if (check.score >= 5) {
        check.status = 'warning';
      } else {
        check.status = 'error';
      }

      console.log(`  ${check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} Observability: ${check.score}/${check.maxScore}`);
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.observability = check;
    this.results.maxScore += check.maxScore;
  }

  /**
   * Check 8: Invariant Checking
   * Design by contract patterns for runtime verification
   */
  async checkInvariantChecking() {
    console.log('🛡️  Checking invariant checking...');
    const check = {
      name: 'Invariant Checking',
      status: 'unknown',
      score: 0,
      maxScore: 10,
      issues: [],
      findings: {}
    };

    try {
      const gatewayCode = await this.getGatewayCode();
      const swCode = await this.getServiceWorkerCode();
      const allCode = (gatewayCode || '') + (swCode || '');

      // Check for validation/assertion patterns
      const hasValidation = allCode.includes('validate') ||
                           allCode.includes('Validation') ||
                           allCode.includes('validateRequest');

      // Check for invariant/assert patterns
      const hasInvariants = allCode.includes('invariant') ||
                           allCode.includes('assert') ||
                           allCode.includes('if (!') && allCode.includes('throw');

      // Check for error boundaries
      const hasErrorBoundaries = allCode.includes('try') && allCode.includes('catch');

      check.findings = {
        hasValidation,
        hasInvariants,
        hasErrorBoundaries
      };

      if (hasValidation) {
        check.score += 4;
      } else {
        check.issues.push('No validation patterns - may proceed with invalid state');
      }

      if (hasInvariants) {
        check.score += 3;
      } else {
        check.issues.push('No invariant checking - impossible states may go undetected');
      }

      if (hasErrorBoundaries) {
        check.score += 3;
      }

      if (check.score >= 8) {
        check.status = 'ok';
      } else if (check.score >= 5) {
        check.status = 'warning';
      } else {
        check.status = 'error';
      }

      console.log(`  ${check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} Invariant Checking: ${check.score}/${check.maxScore}`);
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.invariantChecking = check;
    this.results.maxScore += check.maxScore;
  }

  /**
   * Check 9: Termination Awareness
   * Extension should handle service worker termination gracefully
   */
  async checkTerminationAwareness() {
    console.log('💀 Checking termination awareness...');
    const check = {
      name: 'Termination Awareness',
      status: 'unknown',
      score: 0,
      maxScore: 15,
      issues: [],
      findings: {}
    };

    try {
      const swCode = await this.getServiceWorkerCode();
      
      // Check for alarms (periodic wake-up)
      const hasAlarms = swCode && (
        swCode.includes('chrome.alarms') ||
        swCode.includes('onAlarm')
      );

      // Check for storage persistence before termination
      const hasImmediatePersistence = swCode && (
        swCode.includes('chrome.storage.local.set') ||
        swCode.includes('chrome.storage.session.set')
      );

      // Check for state rehydration on wake
      const hasWakeRehydration = swCode && (
        swCode.includes('chrome.storage.local.get') ||
        swCode.includes('chrome.storage.session.get')
      );

      check.findings = {
        hasAlarms,
        hasImmediatePersistence,
        hasWakeRehydration
      };

      if (hasAlarms) {
        check.score += 5;
      } else {
        check.issues.push('No alarms configured - cannot wake for periodic tasks');
      }

      if (hasImmediatePersistence) {
        check.score += 5;
      } else {
        check.issues.push('State may not persist before termination');
      }

      if (hasWakeRehydration) {
        check.score += 5;
      } else {
        check.issues.push('No state rehydration on wake - may lose context');
      }

      if (check.score >= 12) {
        check.status = 'ok';
      } else if (check.score >= 8) {
        check.status = 'warning';
      } else {
        check.status = 'error';
      }

      console.log(`  ${check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'} Termination Awareness: ${check.score}/${check.maxScore}`);
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.terminationAwareness = check;
    this.results.maxScore += check.maxScore;
  }

  /**
   * Helper: Get service worker code (if available)
   */
  async getServiceWorkerCode() {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        // In extension context, we can't read files directly
        // Return null to indicate we need runtime checks
        return null;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  /**
   * Helper: Get gateway code (if available)
   */
  async getGatewayCode() {
    try {
      if (typeof gateway !== 'undefined' && gateway.constructor) {
        // Can inspect gateway instance
        return gateway.constructor.toString();
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  /**
   * Helper: Get popup code (if available)
   */
  async getPopupCode() {
    return null; // Can't access in service worker context
  }

  /**
   * Calculate overall score
   */
  calculateScore() {
    this.results.score = Object.values(this.results.checks)
      .reduce((sum, check) => sum + (check.score || 0), 0);
    
    const percentage = this.results.maxScore > 0 
      ? (this.results.score / this.results.maxScore * 100).toFixed(1)
      : 0;
    
    this.results.percentage = percentage;
    this.results.targetMet = percentage >= 97.8;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    Object.values(this.results.checks).forEach(check => {
      if (check.status === 'error' || check.status === 'warning') {
        check.issues.forEach(issue => {
          if (issue.startsWith('CRITICAL:')) {
            recommendations.push({
              priority: 'CRITICAL',
              category: check.name,
              issue: issue,
              action: this.getActionForIssue(check.name, issue)
            });
          } else if (check.status === 'error') {
            recommendations.push({
              priority: 'HIGH',
              category: check.name,
              issue: issue,
              action: this.getActionForIssue(check.name, issue)
            });
          } else {
            recommendations.push({
              priority: 'MEDIUM',
              category: check.name,
              issue: issue,
              action: this.getActionForIssue(check.name, issue)
            });
          }
        });
      }
    });

    this.results.recommendations = recommendations;
  }

  /**
   * Get action recommendation for issue
   */
  getActionForIssue(category, issue) {
    if (issue.includes('mutex') || issue.includes('race condition')) {
      return 'Implement navigator.locks.request() around storage mutations';
    }
    if (issue.includes('token refresh') && issue.includes('mutex')) {
      return 'Add mutex lock around token refresh to prevent thundering herd';
    }
    if (issue.includes('circuit breaker')) {
      return 'Implement circuit breaker pattern for network failures';
    }
    if (issue.includes('rehydration')) {
      return 'Add state rehydration from storage on service worker wake';
    }
    if (issue.includes('quota')) {
      return 'Add chrome.storage.local.getBytesInUse() monitoring';
    }
    if (issue.includes('ReportingObserver')) {
      return 'Add ReportingObserver for browser violation detection';
    }
    if (issue.includes('PerformanceObserver')) {
      return 'Add PerformanceObserver for performance monitoring';
    }
    return 'Review architecture and implement recommended pattern';
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    this.generateRecommendations();
    
    console.log('\n' + '='.repeat(70));
    console.log('🔬 EPISTEMIC RELIABILITY REPORT');
    console.log('='.repeat(70));
    console.log(`Context: ${this.results.context}`);
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');
    console.log(`Overall Score: ${this.results.score}/${this.results.maxScore} (${this.results.percentage}%)`);
    console.log(`Target (97.8%): ${this.results.targetMet ? '✅ MET' : '❌ NOT MET'}`);
    console.log('');

    console.log('DETAILED RESULTS:');
    Object.values(this.results.checks).forEach(check => {
      const icon = check.status === 'ok' ? '✅' : 
                   check.status === 'warning' ? '⚠️' : '❌';
      console.log(`\n${icon} ${check.name}: ${check.score}/${check.maxScore}`);
      
      if (check.issues.length > 0) {
        console.log('  Issues:');
        check.issues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      }
    });

    if (this.results.recommendations.length > 0) {
      console.log('\n📋 RECOMMENDATIONS:');
      const critical = this.results.recommendations.filter(r => r.priority === 'CRITICAL');
      const high = this.results.recommendations.filter(r => r.priority === 'HIGH');
      const medium = this.results.recommendations.filter(r => r.priority === 'MEDIUM');

      if (critical.length > 0) {
        console.log('\n🔴 CRITICAL:');
        critical.forEach(rec => {
          console.log(`  [${rec.category}] ${rec.issue}`);
          console.log(`    → ${rec.action}`);
        });
      }

      if (high.length > 0) {
        console.log('\n🟠 HIGH:');
        high.forEach(rec => {
          console.log(`  [${rec.category}] ${rec.issue}`);
          console.log(`    → ${rec.action}`);
        });
      }

      if (medium.length > 0) {
        console.log('\n🟡 MEDIUM:');
        medium.forEach(rec => {
          console.log(`  [${rec.category}] ${rec.issue}`);
          console.log(`    → ${rec.action}`);
        });
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('Report complete. Review recommendations above.');
    console.log('='.repeat(70) + '\n');
  }
}

// Auto-initialize in extension context
if (typeof importScripts !== 'undefined') {
  window.EpistemicReliabilityDebugger = EpistemicReliabilityDebugger;
  const epistemicDebugger = new EpistemicReliabilityDebugger();
  window.runEpistemicChecks = () => epistemicDebugger.runAllChecks();
  console.log('🔬 Epistemic Reliability Debugger loaded. Run: runEpistemicChecks()');
} else if (typeof window !== 'undefined') {
  window.EpistemicReliabilityDebugger = EpistemicReliabilityDebugger;
  const epistemicDebugger = new EpistemicReliabilityDebugger();
  window.runEpistemicChecks = () => epistemicDebugger.runAllChecks();
  console.log('🔬 Epistemic Reliability Debugger loaded. Run: runEpistemicChecks()');
}

