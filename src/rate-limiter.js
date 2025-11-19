/**
 * Rate Limiting Utilities
 * Provides rate limiting for API requests and user actions
 */

class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      api: { max: 10, window: 60000 }, // 10 requests per minute
      analysis: { max: 5, window: 30000 }, // 5 analyses per 30 seconds
      logging: { max: 20, window: 60000 }, // 20 logs per minute
    };
  }

  /**
   * Check if request is allowed
   */
  isAllowed(type, identifier = 'default') {
    const limit = this.limits[type];
    if (!limit) return true;

    const key = `${type}:${identifier}`;
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < limit.window);

    if (validRequests.length >= limit.max) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }

  /**
   * Get remaining requests
   */
  getRemaining(type, identifier = 'default') {
    const limit = this.limits[type];
    if (!limit) return Infinity;

    const key = `${type}:${identifier}`;
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter((time) => now - time < limit.window);

    return Math.max(0, limit.max - validRequests.length);
  }

  /**
   * Reset rate limit for identifier
   */
  reset(type, identifier = 'default') {
    const key = `${type}:${identifier}`;
    this.requests.delete(key);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RateLimiter;
}
