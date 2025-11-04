/**
 * Cache Manager for AiGuardian Chrome Extension
 * 
 * Provides intelligent caching for API responses to improve performance
 * and reduce backend load.
 */

// Constants are available via importScripts in service worker context

/**
 * Cache Manager Class
 * Handles response caching with TTL and intelligent invalidation
 */
class CacheManager {
  /**
   * Initializes the cache manager
   * @constructor
   */
  constructor() {
    this.cache = new Map();
    this.requestQueue = new Map();
    this.cleanupInterval = null;
    
    // Start cleanup interval
    this.startCleanupInterval();
  }

  /**
   * Generates a cache key for a request
   * @function generateCacheKey
   * @param {string} endpoint - The API endpoint
   * @param {Object} payload - The request payload
   * @returns {string} The cache key
   */
  generateCacheKey(endpoint, payload) {
    const payloadString = JSON.stringify(payload);
    return `${endpoint}:${this.hashString(payloadString)}`;
  }

  /**
   * Creates a hash of a string for cache keys
   * @function hashString
   * @param {string} str - The string to hash
   * @returns {string} The hash
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Gets a cached response if available and not expired
   * @function get
   * @param {string} key - The cache key
   * @returns {Object|null} The cached response or null if not found/expired
   */
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Update access time for LRU
    cached.lastAccessed = Date.now();
    return cached.data;
  }

  /**
   * Stores a response in the cache
   * @function set
   * @param {string} key - The cache key
   * @param {Object} data - The response data to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   * @returns {void}
   */
  set(key, data, ttl = API_CONFIG.CACHE_TTL) {
    const now = Date.now();
    this.cache.set(key, {
      data,
      createdAt: now,
      expiresAt: now + ttl,
      lastAccessed: now
    });
  }

  /**
   * Checks if a request is already in progress (deduplication)
   * @function isRequestInProgress
   * @param {string} key - The cache key
   * @returns {boolean} True if request is in progress
   */
  isRequestInProgress(key) {
    return this.requestQueue.has(key);
  }

  /**
   * Adds a request to the queue for deduplication
   * @function addToQueue
   * @param {string} key - The cache key
   * @param {Promise} promise - The request promise
   * @returns {Promise} The request promise
   */
  addToQueue(key, promise) {
    this.requestQueue.set(key, promise);
    
    // Clean up when promise resolves/rejects
    promise.finally(() => {
      this.requestQueue.delete(key);
    });
    
    return promise;
  }

  /**
   * Gets a queued request if it exists
   * @function getQueuedRequest
   * @param {string} key - The cache key
   * @returns {Promise|null} The queued request or null
   */
  getQueuedRequest(key) {
    return this.requestQueue.get(key) || null;
  }

  /**
   * Clears expired cache entries
   * @function cleanup
   * @returns {void}
   */
  cleanup() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears all cache entries
   * @function clear
   * @returns {void}
   */
  clear() {
    this.cache.clear();
    this.requestQueue.clear();
  }

  /**
   * Gets cache statistics
   * @function getStats
   * @returns {Object} Cache statistics
   */
  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let totalSize = 0;

    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        expiredCount++;
      }
      totalSize += JSON.stringify(cached.data).length;
    }

    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      activeEntries: this.cache.size - expiredCount,
      totalSize,
      queuedRequests: this.requestQueue.size
    };
  }

  /**
   * Starts the cleanup interval
   * @function startCleanupInterval
   * @returns {void}
   */
  startCleanupInterval() {
    // Clean up every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Stops the cleanup interval
   * @function stopCleanupInterval
   * @returns {void}
   */
  stopCleanupInterval() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Destroys the cache manager and cleans up resources
   * @function destroy
   * @returns {void}
   */
  destroy() {
    this.stopCleanupInterval();
    this.clear();
  }
}

// Create global instance for Chrome extension compatibility
const cacheManager = new CacheManager();

// Export globally
if (typeof window !== 'undefined') {
  window.CacheManager = CacheManager;
  window.cacheManager = cacheManager;
}
