/**
 * Mutex Helper for Chrome Extension MV3
 *
 * Provides mutex-protected storage operations to prevent race conditions.
 * Based on Web Locks API (navigator.locks) for browser-managed concurrency control.
 *
 * CRITICAL: Prevents "check-then-act" race conditions in storage mutations.
 * If service worker terminates while holding a lock, browser automatically releases it.
 */

class MutexHelper {
  /**
   * Execute a storage mutation with mutex protection
   *
   * @param {string} lockName - Unique lock name for this operation
   * @param {Function} operation - Async function that performs storage operations
   * @returns {Promise<any>} Result of the operation
   */
  static async withLock(lockName, operation) {
    // Check if Web Locks API is available
    if (typeof navigator === 'undefined' || !navigator.locks) {
      Logger.warn('[Mutex] Web Locks API not available, executing without lock');
      return await operation();
    }

    return await navigator.locks.request(lockName, async (lock) => {
      // Lock acquired - execute operation
      return await operation();
    });
  }

  /**
   * Mutex-protected storage read-modify-write pattern
   *
   * @param {string} key - Storage key to update
   * @param {Function} modifier - Function that modifies the value (receives current value, returns new value)
   * @param {string} storageArea - 'local' or 'session' (default: 'local')
   * @returns {Promise<any>} New value after modification
   */
  static async updateStorage(key, modifier, storageArea = 'local') {
    const lockName = `storage_update_${key}`;

    return await this.withLock(lockName, async () => {
      // Read current value
      const storage = storageArea === 'session' ? chrome.storage.session : chrome.storage.local;
      const data = await new Promise((resolve) => {
        storage.get([key], (result) => {
          resolve(result[key] || null);
        });
      });

      // Modify value
      const newValue = modifier(data);

      // Write back
      await new Promise((resolve) => {
        storage.set({ [key]: newValue }, resolve);
      });

      return newValue;
    });
  }

  /**
   * Mutex-protected counter increment
   * Prevents race conditions when multiple events increment the same counter
   *
   * @param {string} key - Storage key for counter
   * @param {number} increment - Amount to increment (default: 1)
   * @param {string} storageArea - 'local' or 'session' (default: 'local')
   * @returns {Promise<number>} New counter value
   */
  static async incrementCounter(key, increment = 1, storageArea = 'local') {
    return await this.updateStorage(
      key,
      (currentValue) => {
        const current = typeof currentValue === 'number' ? currentValue : 0;
        return current + increment;
      },
      storageArea
    );
  }

  /**
   * Mutex-protected counter decrement
   *
   * @param {string} key - Storage key for counter
   * @param {number} decrement - Amount to decrement (default: 1)
   * @param {string} storageArea - 'local' or 'session' (default: 'local')
   * @returns {Promise<number>} New counter value
   */
  static async decrementCounter(key, decrement = 1, storageArea = 'local') {
    return await this.incrementCounter(key, -decrement, storageArea);
  }

  /**
   * Mutex-protected array append
   *
   * @param {string} key - Storage key for array
   * @param {any} item - Item to append
   * @param {number} maxLength - Maximum array length (default: unlimited)
   * @param {string} storageArea - 'local' or 'session' (default: 'local')
   * @returns {Promise<Array>} Updated array
   */
  static async appendToArray(key, item, maxLength = null, storageArea = 'local') {
    return await this.updateStorage(
      key,
      (currentValue) => {
        const array = Array.isArray(currentValue) ? currentValue : [];
        array.push(item);

        // Trim if maxLength specified
        if (maxLength !== null && array.length > maxLength) {
          return array.slice(-maxLength);
        }

        return array;
      },
      storageArea
    );
  }

  /**
   * Mutex-protected map update
   *
   * @param {string} key - Storage key for map/object
   * @param {string} mapKey - Key within the map to update
   * @param {any} value - Value to set
   * @param {string} storageArea - 'local' or 'session' (default: 'local')
   * @returns {Promise<Object>} Updated map
   */
  static async updateMap(key, mapKey, value, storageArea = 'local') {
    return await this.updateStorage(
      key,
      (currentValue) => {
        const map = typeof currentValue === 'object' && currentValue !== null ? currentValue : {};
        return { ...map, [mapKey]: value };
      },
      storageArea
    );
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.MutexHelper = MutexHelper;
}
// In service worker context, available globally via importScripts
