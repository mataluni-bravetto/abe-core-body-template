/**
 * AiGuardian SDK - Cache Manager
 *
 * Provides intelligent caching with TTL, LRU eviction, and request deduplication.
 */

/**
 * Cache entry with metadata
 */
class CacheEntry {
  /**
   * Creates a new cache entry
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   * @param {Object} metadata - Additional metadata
   */
  constructor(value, ttl, metadata = {}) {
    this.value = value;
    this.timestamp = Date.now();
    this.ttl = ttl;
    this.metadata = metadata;
    this.accessCount = 0;
    this.lastAccessed = Date.now();
  }

  /**
   * Checks if the entry is expired
   * @returns {boolean} True if expired
   */
  isExpired() {
    return Date.now() - this.timestamp > this.ttl;
  }

  /**
   * Updates access statistics
   */
  access() {
    this.accessCount++;
    this.lastAccessed = Date.now();
  }

  /**
   * Gets the age of the entry in milliseconds
   * @returns {number} Age in milliseconds
   */
  getAge() {
    return Date.now() - this.timestamp;
  }
}

/**
 * Intelligent cache manager with TTL and LRU eviction
 */
export class CacheManager {
  /**
   * Creates a new cache manager
   * @param {Object} config - Cache configuration
   */
  constructor(config = {}) {
    this.config = {
      enabled: config.enabled !== false,
      ttl: config.ttl || 300000, // 5 minutes default
      maxSize: config.maxSize || 100,
      evictionPolicy: config.evictionPolicy || 'lru' // lru or fifo
    };

    this.cache = new Map();
    this.queuedRequests = new Map(); // For request deduplication
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      clears: 0
    };
  }

  /**
   * Generates a cache key from endpoint and payload
   * @param {string} endpoint - API endpoint
   * @param {Object} payload - Request payload
   * @returns {string} Cache key
   */
  generateKey(endpoint, payload = {}) {
    // Create a deterministic key from endpoint and relevant payload fields
    const keyData = {
      endpoint,
      // Include only relevant fields for caching
      text: payload.text ? this.hashString(payload.text.substring(0, 100)) : null,
      guards: payload.guards ? payload.guards.sort().join(',') : null,
      confidence: payload.confidence
    };

    return btoa(JSON.stringify(keyData)).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Gets a value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if not found/expired
   */
  get(key) {
    if (!this.config.enabled) return null;

    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (entry.isExpired()) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    entry.access();
    this.stats.hits++;
    return entry.value;
  }

  /**
   * Sets a value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live (optional, uses default if not provided)
   * @param {Object} metadata - Additional metadata
   */
  set(key, value, ttl = null, metadata = {}) {
    if (!this.config.enabled) return;

    const actualTtl = ttl || this.config.ttl;

    // Check if we need to evict entries
    if (this.cache.size >= this.config.maxSize) {
      this.evictEntries();
    }

    const entry = new CacheEntry(value, actualTtl, metadata);
    this.cache.set(key, entry);
    this.stats.sets++;
  }

  /**
   * Checks if a key exists in cache (doesn't update access stats)
   * @param {string} key - Cache key
   * @returns {boolean} True if exists and not expired
   */
  has(key) {
    if (!this.config.enabled) return false;

    const entry = this.cache.get(key);
    return entry && !entry.isExpired();
  }

  /**
   * Deletes a key from cache
   * @param {string} key - Cache key
   * @returns {boolean} True if key was deleted
   */
  delete(key) {
    return this.cache.delete(key);
  }

  /**
   * Clears all cache entries
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.queuedRequests.clear();
    this.stats.clears++;
    this.resetStats();
  }

  /**
   * Gets cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    return {
      enabled: this.config.enabled,
      size: this.cache.size,
      maxSize: this.config.maxSize,
      ttl: this.config.ttl,
      evictionPolicy: this.config.evictionPolicy,
      ...this.stats,
      hitRate: this.stats.hits + this.stats.misses > 0
        ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
        : 0
    };
  }

  /**
   * Gets all cache entries (for debugging)
   * @returns {Array} Array of cache entries
   */
  getEntries() {
    const entries = [];
    for (const [key, entry] of this.cache) {
      entries.push({
        key,
        age: entry.getAge(),
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
        expired: entry.isExpired(),
        metadata: entry.metadata
      });
    }
    return entries;
  }

  /**
   * Gets a queued request promise (for deduplication)
   * @param {string} key - Request key
   * @returns {Promise|null} Queued request promise or null
   */
  getQueuedRequest(key) {
    const queued = this.queuedRequests.get(key);
    if (queued && Date.now() - queued.timestamp < 30000) { // 30 second timeout
      return queued.promise;
    }
    this.queuedRequests.delete(key);
    return null;
  }

  /**
   * Sets a queued request for deduplication
   * @param {string} key - Request key
   * @param {Promise} promise - Request promise
   */
  setQueuedRequest(key, promise) {
    this.queuedRequests.set(key, {
      promise,
      timestamp: Date.now()
    });

    // Clean up after promise resolves
    promise.finally(() => {
      this.queuedRequests.delete(key);
    });
  }

  /**
   * Evicts entries based on eviction policy
   */
  evictEntries() {
    if (this.config.evictionPolicy === 'lru') {
      this.evictLRU();
    } else if (this.config.evictionPolicy === 'fifo') {
      this.evictFIFO();
    }

    this.stats.evictions++;
  }

  /**
   * Evicts least recently used entries
   */
  evictLRU() {
    let oldestKey = null;
    let oldestAccess = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < oldestAccess) {
        oldestAccess = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Evicts first-in-first-out entries
   */
  evictFIFO() {
    // Find the oldest entry by timestamp
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Cleans up expired entries
   * @returns {number} Number of entries cleaned up
   */
  cleanup() {
    let cleaned = 0;
    for (const [key, entry] of this.cache) {
      if (entry.isExpired()) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    return cleaned;
  }

  /**
   * Resets cache statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      clears: 0
    };
  }

  /**
   * Updates cache configuration
   * @param {Object} config - New configuration
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };

    // If cache was disabled, clear it
    if (!this.config.enabled) {
      this.clear();
    }
  }

  /**
   * Creates a simple hash of a string
   * @param {string} str - String to hash
   * @returns {string} Hash string
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Gets cache size information
   * @returns {Object} Size information
   */
  getSizeInfo() {
    return {
      current: this.cache.size,
      max: this.config.maxSize,
      utilization: (this.cache.size / this.config.maxSize) * 100,
      queuedRequests: this.queuedRequests.size
    };
  }
}
