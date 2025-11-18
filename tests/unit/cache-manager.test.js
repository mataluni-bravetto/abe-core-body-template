/**
 * Unit Tests for Cache Manager Module
 */

// Mock dependencies for testing
if (typeof window !== 'undefined') {
  window.API_CONFIG = {
    CACHE_TTL: 3600000, // 1 hour
    TIMEOUT: 5000,
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 1000
  };

  window.Logger = {
    info: console.log,
    warn: console.warn,
    error: console.error
  };
}

import { testRunner } from './test-runner.js';

const { test, assert, assertEqual, assertNotEqual, assertTrue, assertFalse, assertThrows } = testRunner;

/**
 * Test Cache Manager Class
 */
test('CacheManager constructor initializes correctly', () => {
  const cache = new window.CacheManager();

  assertTrue(cache.cache instanceof Map, 'Cache should be a Map');
  assertTrue(cache.requestQueue instanceof Map, 'Request queue should be a Map');
  assertTrue(cache.cleanupInterval !== null, 'Cleanup interval should be set');
});

test('CacheManager generates consistent cache keys', () => {
  const cache = new window.CacheManager();

  const key1 = cache.generateCacheKey('analyze', { text: 'hello' });
  const key2 = cache.generateCacheKey('analyze', { text: 'hello' });
  const key3 = cache.generateCacheKey('analyze', { text: 'world' });

  assertEqual(key1, key2, 'Same payload should generate same key');
  assertNotEqual(key1, key3, 'Different payload should generate different key');
});

test('CacheManager stores and retrieves data correctly', () => {
  const cache = new window.CacheManager();
  const key = 'test-key';
  const data = { result: 'test data' };

  // Initially should not be in cache
  assertFalse(cache.get(key), 'Cache should be empty initially');

  // Store data
  cache.set(key, data);

  // Should retrieve data
  const retrieved = cache.get(key);
  assertEqual(retrieved.result, 'test data', 'Should retrieve stored data');
});

test('CacheManager handles expiration correctly', () => {
  const cache = new window.CacheManager();
  const key = 'test-key';
  const data = { result: 'test data' };

  // Store with very short TTL
  cache.set(key, data, 1);

  // Should be available immediately
  assertTrue(cache.get(key), 'Data should be available immediately');

  // Wait for expiration
  setTimeout(() => {
    assertFalse(cache.get(key), 'Data should be expired after TTL');
  }, 10);
});

test('CacheManager handles request deduplication', () => {
  const cache = new window.CacheManager();
  const key = 'test-key';

  // Should not be in progress initially
  assertFalse(cache.isRequestInProgress(key), 'Request should not be in progress initially');

  // Create a mock promise
  const promise = Promise.resolve('test result');

  // Add to queue
  const queuedPromise = cache.addToQueue(key, promise);

  // Should be in progress
  assertTrue(cache.isRequestInProgress(key), 'Request should be in progress');

  // Should return same promise
  assertEqual(queuedPromise, promise, 'Should return same promise');
});

test('CacheManager cleans up expired entries', () => {
  const cache = new window.CacheManager();

  // Add expired entry
  cache.cache.set('expired', {
    data: { test: 'data' },
    createdAt: Date.now() - 10000,
    expiresAt: Date.now() - 5000,
    lastAccessed: Date.now() - 5000
  });

  // Add valid entry
  cache.cache.set('valid', {
    data: { test: 'data' },
    createdAt: Date.now(),
    expiresAt: Date.now() + 10000,
    lastAccessed: Date.now()
  });

  // Cleanup
  cache.cleanup();

  // Expired should be removed, valid should remain
  assertFalse(cache.get('expired'), 'Expired entry should be removed');
  assertTrue(cache.get('valid'), 'Valid entry should remain');
});

test('CacheManager provides correct statistics', () => {
  const cache = new window.CacheManager();

  // Add some data
  cache.set('key1', { data: 'test1' });
  cache.set('key2', { data: 'test2' });

  const stats = cache.getStats();

  assertTrue(stats.totalEntries >= 2, 'Should have at least 2 entries');
  assertTrue(stats.activeEntries >= 2, 'Should have at least 2 active entries');
  assertTrue(stats.totalSize > 0, 'Total size should be positive');
});

test('CacheManager clears all data', () => {
  const cache = new window.CacheManager();

  // Add some data
  cache.set('key1', { data: 'test1' });
  cache.set('key2', { data: 'test2' });

  // Clear
  cache.clear();

  // Should be empty
  assertEqual(cache.cache.size, 0, 'Cache should be empty');
  assertEqual(cache.requestQueue.size, 0, 'Request queue should be empty');
});

test('CacheManager destroys correctly', () => {
  const cache = new window.CacheManager();

  // Should have cleanup interval
  assertTrue(cache.cleanupInterval !== null, 'Should have cleanup interval');

  // Destroy
  cache.destroy();

  // Should clear interval and data
  assertFalse(cache.cleanupInterval, 'Cleanup interval should be cleared');
  assertEqual(cache.cache.size, 0, 'Cache should be empty');
});

// Run tests
testRunner.run().then(results => {
  Logger.info('[Cache Manager Tests] Completed:', results.summary);
}).catch(error => {
  Logger.error('[Cache Manager Tests] Failed:', error);
});
