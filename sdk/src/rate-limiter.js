/**
 * AiGuardian SDK - Rate Limiter
 *
 * Implements token bucket algorithm for API rate limiting
 * with burst allowance and configurable limits.
 */

/**
 * Token bucket rate limiter implementation
 */
export class RateLimiter {
  /**
   * Creates a new rate limiter
   * @param {Object} config - Rate limiting configuration
   */
  constructor(config = {}) {
    this.config = {
      enabled: config.enabled !== false,
      requests: config.requests || 100, // requests per window
      window: config.window || 60000, // window in milliseconds (1 minute)
      burst: config.burst || 10 // burst allowance
    };

    this.buckets = new Map(); // userId -> bucket
  }

  /**
   * Checks if a request is allowed
   * @param {string} userId - User identifier (optional, uses global bucket if not provided)
   * @param {number} tokens - Number of tokens to consume (default: 1)
   * @returns {boolean} True if request is allowed
   */
  checkLimit(userId = 'global', tokens = 1) {
    if (!this.config.enabled) return true;

    const bucket = this.getBucket(userId);

    // Refill tokens based on time passed
    this.refillBucket(bucket);

    // Check if we have enough tokens
    if (bucket.tokens >= tokens) {
      bucket.tokens -= tokens;
      bucket.lastRequest = Date.now();
      return true;
    }

    return false;
  }

  /**
   * Consumes tokens without checking (assumes checkLimit was called first)
   * @param {string} userId - User identifier
   * @param {number} tokens - Number of tokens to consume
   */
  consumeTokens(userId = 'global', tokens = 1) {
    if (!this.config.enabled) return;

    const bucket = this.getBucket(userId);
    bucket.tokens = Math.max(0, bucket.tokens - tokens);
    bucket.lastRequest = Date.now();
  }

  /**
   * Gets the time until the next request is allowed
   * @param {string} userId - User identifier
   * @returns {number} Milliseconds until next request, or 0 if allowed now
   */
  getWaitTime(userId = 'global') {
    if (!this.config.enabled) return 0;

    const bucket = this.getBucket(userId);
    this.refillBucket(bucket);

    if (bucket.tokens >= 1) return 0;

    // Calculate time needed to get one token
    const tokensNeeded = 1 - bucket.tokens;
    const refillRate = this.config.requests / this.config.window; // tokens per millisecond
    return Math.ceil(tokensNeeded / refillRate);
  }

  /**
   * Gets rate limiting statistics
   * @param {string} userId - User identifier
   * @returns {Object} Rate limiting statistics
   */
  getStats(userId = 'global') {
    const bucket = this.getBucket(userId);
    this.refillBucket(bucket);

    return {
      enabled: this.config.enabled,
      requests: this.config.requests,
      window: this.config.window,
      burst: this.config.burst,
      currentTokens: bucket.tokens,
      maxTokens: this.config.requests + this.config.burst,
      utilization: ((this.config.requests + this.config.burst - bucket.tokens) /
                   (this.config.requests + this.config.burst)) * 100,
      lastRequest: bucket.lastRequest,
      nextRefill: bucket.lastRefill + this.config.window
    };
  }

  /**
   * Resets rate limiting for a user
   * @param {string} userId - User identifier
   */
  reset(userId = 'global') {
    if (this.buckets.has(userId)) {
      this.buckets.delete(userId);
    }
  }

  /**
   * Resets all rate limiting
   */
  resetAll() {
    this.buckets.clear();
  }

  /**
   * Updates rate limiting configuration
   * @param {Object} config - New configuration
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };

    // If disabled, clear all buckets
    if (!this.config.enabled) {
      this.resetAll();
    }
  }

  /**
   * Gets or creates a token bucket for a user
   * @param {string} userId - User identifier
   * @returns {Object} Token bucket
   */
  getBucket(userId) {
    if (!this.buckets.has(userId)) {
      this.buckets.set(userId, {
        tokens: this.config.requests + this.config.burst, // Start with full burst allowance
        lastRefill: Date.now(),
        lastRequest: 0
      });
    }

    return this.buckets.get(userId);
  }

  /**
   * Refills tokens in a bucket based on time passed
   * @param {Object} bucket - Token bucket
   */
  refillBucket(bucket) {
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;

    if (timePassed >= this.config.window) {
      // Full window has passed, refill to maximum
      bucket.tokens = this.config.requests + this.config.burst;
      bucket.lastRefill = now;
    } else {
      // Partial refill based on time passed
      const refillRate = this.config.requests / this.config.window; // tokens per millisecond
      const tokensToAdd = Math.floor(timePassed * refillRate);

      if (tokensToAdd > 0) {
        bucket.tokens = Math.min(
          this.config.requests + this.config.burst,
          bucket.tokens + tokensToAdd
        );
        bucket.lastRefill = now;
      }
    }
  }

  /**
   * Gets all active buckets (for monitoring)
   * @returns {Object} All buckets with their stats
   */
  getAllBuckets() {
    const result = {};

    for (const [userId, bucket] of this.buckets) {
      this.refillBucket(bucket);
      result[userId] = {
        tokens: bucket.tokens,
        lastRefill: bucket.lastRefill,
        lastRequest: bucket.lastRequest,
        maxTokens: this.config.requests + this.config.burst
      };
    }

    return result;
  }

  /**
   * Cleans up inactive buckets (older than 1 hour)
   * @returns {number} Number of buckets cleaned up
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour
    let cleaned = 0;

    for (const [userId, bucket] of this.buckets) {
      if (now - bucket.lastRequest > maxAge) {
        this.buckets.delete(userId);
        cleaned++;
      }
    }

    return cleaned;
  }
}
