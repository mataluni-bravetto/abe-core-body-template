/**
 * Circuit Breaker for Chrome Extension MV3
 *
 * Implements circuit breaker pattern to prevent infinite retries on backend failures.
 * Fails fast when backend is unavailable, reducing resource consumption.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Too many failures, requests fail immediately
 * - HALF_OPEN: Testing if backend recovered, allows one probe request
 */

class CircuitBreaker {
  constructor(options = {}) {
    // Configuration
    this.failureThreshold = options.failureThreshold || 5; // Open after 5 failures
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute cooldown
    this.timeout = options.timeout || 10000; // 10 second request timeout

    // State
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
    this.lastFailureTime = null;
    this.lastSuccessTime = null;

    // Statistics
    this.stats = {
      totalRequests: 0,
      totalFailures: 0,
      totalSuccesses: 0,
      stateChanges: [],
    };
  }

  /**
   * Execute a function with circuit breaker protection
   *
   * @param {Function} fn - Async function to execute
   * @param {Object} context - Additional context for logging
   * @returns {Promise<any>} Result of the function
   */
  async execute(fn, context = {}) {
    this.stats.totalRequests++;

    // Check if circuit is open
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        const waitTime = Math.ceil((this.nextAttempt - Date.now()) / 1000);
        Logger.warn('[CircuitBreaker] Circuit OPEN - failing fast', {
          ...context,
          waitTimeSeconds: waitTime,
          failureCount: this.failureCount,
        });
        this.stats.totalFailures++;
        throw new Error(`Circuit breaker is OPEN - backend unavailable. Retry in ${waitTime}s`);
      }

      // Timeout expired - move to HALF_OPEN
      this.state = 'HALF_OPEN';
      this.failureCount = 0;
      this.successCount = 0;
      this.logStateChange('OPEN → HALF_OPEN', 'Timeout expired');
      Logger.info('[CircuitBreaker] Moving to HALF_OPEN state - testing recovery', context);
    }

    try {
      // Execute with timeout
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout)
        ),
      ]);

      // Success
      this.onSuccess(context);
      return result;
    } catch (error) {
      // Failure
      this.onFailure(error, context);
      throw error;
    }
  }

  /**
   * Handle successful execution
   */
  onSuccess(context = {}) {
    this.lastSuccessTime = Date.now();
    this.stats.totalSuccesses++;

    if (this.state === 'HALF_OPEN') {
      // Success in HALF_OPEN - close circuit
      this.state = 'CLOSED';
      this.failureCount = 0;
      this.logStateChange('HALF_OPEN → CLOSED', 'Probe succeeded');
      Logger.info('[CircuitBreaker] Circuit CLOSED - backend recovered', context);
    } else {
      // Success in CLOSED - reset failure count
      this.failureCount = 0;
    }
  }

  /**
   * Handle failed execution
   */
  onFailure(error, context = {}) {
    this.lastFailureTime = Date.now();
    this.failureCount++;
    this.stats.totalFailures++;

    Logger.warn('[CircuitBreaker] Request failed', {
      ...context,
      failureCount: this.failureCount,
      threshold: this.failureThreshold,
      error: error.message,
    });

    if (this.state === 'HALF_OPEN') {
      // Failure in HALF_OPEN - open circuit
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      this.logStateChange('HALF_OPEN → OPEN', 'Probe failed');
      Logger.error('[CircuitBreaker] Circuit OPENED - backend still unavailable', context);
    } else if (this.failureCount >= this.failureThreshold) {
      // Threshold reached - open circuit
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      this.logStateChange('CLOSED → OPEN', `Failure threshold (${this.failureThreshold}) reached`);
      Logger.error('[CircuitBreaker] Circuit OPENED - too many failures', {
        ...context,
        failureCount: this.failureCount,
        threshold: this.failureThreshold,
      });
    }
  }

  /**
   * Log state change for observability
   */
  logStateChange(transition, reason) {
    this.stats.stateChanges.push({
      transition,
      reason,
      timestamp: new Date().toISOString(),
      failureCount: this.failureCount,
    });
  }

  /**
   * Get current state information
   */
  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      nextAttempt: this.nextAttempt,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      stats: { ...this.stats },
    };
  }

  /**
   * Reset circuit breaker (for testing or manual recovery)
   */
  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
    this.logStateChange('MANUAL RESET', 'Reset by user');
    Logger.info('[CircuitBreaker] Circuit breaker reset manually');
  }

  /**
   * Check if circuit is open
   */
  isOpen() {
    return this.state === 'OPEN' && Date.now() < this.nextAttempt;
  }

  /**
   * Check if circuit is closed (allowing requests)
   */
  isClosed() {
    return this.state === 'CLOSED';
  }

  /**
   * Check if circuit is half-open (testing recovery)
   */
  isHalfOpen() {
    return this.state === 'HALF_OPEN';
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.CircuitBreaker = CircuitBreaker;
}
// In service worker context, available globally via importScripts
