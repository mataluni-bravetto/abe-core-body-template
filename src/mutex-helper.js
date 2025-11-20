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
   * Helper function to trim array to fit within quota
   * Removes oldest entries until array size is below maxSizeBytes
   * @param {Array} array - Array to trim
   * @param {number} maxSizeBytes - Maximum size in bytes (default: 7168 = 7KB safety margin)
   * @returns {Array} Trimmed array
   */
  static trimArrayForQuota(array, maxSizeBytes = 7168) {
    if (!Array.isArray(array)) {
      return array;
    }

    let currentSize = JSON.stringify(array).length;
    const originalLength = array.length;

    // Remove oldest entries (from end) until size is below quota
    while (currentSize > maxSizeBytes && array.length > 0) {
      array.pop(); // Remove oldest entry
      currentSize = JSON.stringify(array).length;
    }

    if (originalLength !== array.length) {
      Logger.warn('[MutexHelper] Trimmed array to fit quota:', {
        originalLength,
        trimmedLength: array.length,
        trimmedSizeKB: (currentSize / 1024).toFixed(2),
        maxSizeKB: (maxSizeBytes / 1024).toFixed(2),
      });
    }

    return array;
  }

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
   * @param {string} storageArea - 'local', 'session', or 'sync' (default: 'local')
   * @returns {Promise<any>} New value after modification
   */
  static async updateStorage(key, modifier, storageArea = 'local') {
    const lockName = `storage_update_${key}`;

    return await this.withLock(lockName, async () => {
      try {
        // Read current value
        let storage;
        if (storageArea === 'session') {
          storage = chrome.storage.session;
        } else if (storageArea === 'sync') {
          storage = chrome.storage.sync;
        } else {
          storage = chrome.storage.local;
        }

        const data = await new Promise((resolve) => {
          storage.get([key], (result) => {
            if (chrome.runtime.lastError) {
              Logger.error('[MutexHelper] updateStorage - error reading:', {
                key,
                error: chrome.runtime.lastError.message,
                storageArea,
              });
            }
            resolve(result[key] || null);
          });
        });

        const currentSize = data ? JSON.stringify(data).length : 0;
        Logger.info('[MutexHelper] updateStorage - current value:', {
          key,
          currentSize,
          currentSizeKB: (currentSize / 1024).toFixed(2),
          storageArea,
        });

        // Modify value
        let newValue = modifier(data);

        // For sync storage, check quota before storing (8KB limit)
        if (storageArea === 'sync' && Array.isArray(newValue)) {
          const SYNC_STORAGE_QUOTA = 8192; // 8KB limit
          const SAFETY_MARGIN = 7168; // 7KB safety margin
          const newSize = JSON.stringify(newValue).length;

          if (newSize > SAFETY_MARGIN) {
            Logger.warn('[MutexHelper] Sync storage array size approaching quota, trimming:', {
              key,
              newSize,
              newSizeKB: (newSize / 1024).toFixed(2),
              entriesBeforeTrim: newValue.length,
            });
            
            // Trim to fit within safety margin
            newValue = this.trimArrayForQuota([...newValue], SAFETY_MARGIN);
            
            Logger.info('[MutexHelper] Array trimmed for sync storage:', {
              key,
              entriesAfterTrim: newValue.length,
              finalSizeKB: (JSON.stringify(newValue).length / 1024).toFixed(2),
            });
          }
        }

        // Log new value size before storing
        const newSize = JSON.stringify(newValue).length;
        Logger.info('[MutexHelper] updateStorage - new value size:', {
          key,
          newSize,
          newSizeKB: (newSize / 1024).toFixed(2),
          sizeIncrease: newSize - currentSize,
          sizeIncreaseKB: ((newSize - currentSize) / 1024).toFixed(2),
          storageArea,
        });

        // Write back with error handling and quota retry
        await new Promise((resolve, reject) => {
          try {
            storage.set({ [key]: newValue }, () => {
              if (chrome.runtime.lastError) {
                const error = chrome.runtime.lastError;
                const isQuotaError = error.message && (
                  error.message.includes('quota') || 
                  error.message.includes('QUOTA') ||
                  error.message.includes('exceeded')
                );

                Logger.error('[MutexHelper] updateStorage - error writing:', {
                  key,
                  error: error.message,
                  errorCode: error.message,
                  newSize,
                  newSizeKB: (newSize / 1024).toFixed(2),
                  storageArea,
                  isQuotaError,
                });

                // If quota error and sync storage with array, try trimming and retry
                if (isQuotaError && storageArea === 'sync' && Array.isArray(newValue)) {
                  Logger.warn('[MutexHelper] Quota error detected for sync storage array, attempting trim and retry:', {
                    key,
                    newSize,
                    newSizeKB: (newSize / 1024).toFixed(2),
                    entriesBeforeTrim: newValue.length,
                  });

                  // Trim more aggressively and retry
                  const retryValue = this.trimArrayForQuota([...newValue], 6144); // Trim to 6KB
                  
                  storage.set({ [key]: retryValue }, () => {
                    if (chrome.runtime.lastError) {
                      Logger.error('[MutexHelper] updateStorage - retry failed after trim:', {
                        key,
                        error: chrome.runtime.lastError.message,
                        retrySizeKB: (JSON.stringify(retryValue).length / 1024).toFixed(2),
                        storageArea,
                      });
                      reject(new Error(chrome.runtime.lastError.message));
                    } else {
                      Logger.info('[MutexHelper] updateStorage - successfully wrote after quota trim:', {
                        key,
                        retrySizeKB: (JSON.stringify(retryValue).length / 1024).toFixed(2),
                        entriesAfterTrim: retryValue.length,
                        storageArea,
                      });
                      resolve();
                    }
                  });
                } else {
                  reject(new Error(error.message));
                }
              } else {
                Logger.info('[MutexHelper] updateStorage - successfully wrote:', {
                  key,
                  newSize,
                  newSizeKB: (newSize / 1024).toFixed(2),
                  storageArea,
                });
                resolve();
              }
            });
          } catch (setError) {
            Logger.error('[MutexHelper] updateStorage - exception during set:', {
              key,
              error: setError.message,
              stack: setError.stack,
              newSize,
              newSizeKB: (newSize / 1024).toFixed(2),
              storageArea,
            });
            reject(setError);
          }
        });

        return newValue;
      } catch (error) {
        Logger.error('[MutexHelper] updateStorage - fatal error:', {
          key,
          error: error.message,
          stack: error.stack,
          storageArea,
        });
        throw error;
      }
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
   * @param {string} storageArea - 'local', 'session', or 'sync' (default: 'local')
   * @returns {Promise<Array>} Updated array
   */
  static async appendToArray(key, item, maxLength = null, storageArea = 'local') {
    try {
      // Log item size and current array info before appending
      const itemSize = JSON.stringify(item).length;
      Logger.info('[MutexHelper] appendToArray - preparing to append:', {
        key,
        itemSize,
        itemSizeKB: (itemSize / 1024).toFixed(2),
        maxLength,
        storageArea,
      });
      
      return await this.updateStorage(
        key,
        (currentValue) => {
          const array = Array.isArray(currentValue) ? currentValue : [];
          const currentArraySize = JSON.stringify(array).length;
          const currentLength = array.length;
          
          Logger.info('[MutexHelper] appendToArray - current array state:', {
            key,
            currentLength,
            currentArraySize,
            currentArraySizeKB: (currentArraySize / 1024).toFixed(2),
            maxLength,
            storageArea,
          });
          
          array.push(item);

          // Trim if maxLength specified
          if (maxLength !== null && array.length > maxLength) {
            const trimmedArray = array.slice(-maxLength);
            const trimmedSize = JSON.stringify(trimmedArray).length;
            Logger.info('[MutexHelper] appendToArray - trimmed array by maxLength:', {
              key,
              originalLength: array.length,
              trimmedLength: trimmedArray.length,
              trimmedSize,
              trimmedSizeKB: (trimmedSize / 1024).toFixed(2),
              storageArea,
            });
            return trimmedArray;
          }

          // For sync storage, check quota before returning (updateStorage will also check, but this is proactive)
          if (storageArea === 'sync') {
            const SYNC_STORAGE_QUOTA = 8192; // 8KB limit
            const SAFETY_MARGIN = 7168; // 7KB safety margin
            const newArraySize = JSON.stringify(array).length;

            if (newArraySize > SAFETY_MARGIN) {
              Logger.warn('[MutexHelper] appendToArray - sync storage array size approaching quota, trimming:', {
                key,
                newArraySize,
                newArraySizeKB: (newArraySize / 1024).toFixed(2),
                entriesBeforeTrim: array.length,
              });
              
              // Trim to fit within safety margin
              const trimmedArray = this.trimArrayForQuota([...array], SAFETY_MARGIN);
              
              Logger.info('[MutexHelper] appendToArray - trimmed array for sync storage:', {
                key,
                entriesAfterTrim: trimmedArray.length,
                finalSizeKB: (JSON.stringify(trimmedArray).length / 1024).toFixed(2),
                storageArea,
              });
              
              return trimmedArray;
            }
          }

          const newArraySize = JSON.stringify(array).length;
          Logger.info('[MutexHelper] appendToArray - new array state:', {
            key,
            newLength: array.length,
            newArraySize,
            newArraySizeKB: (newArraySize / 1024).toFixed(2),
            storageArea,
          });

          return array;
        },
        storageArea
      );
    } catch (error) {
      Logger.error('[MutexHelper] appendToArray error:', {
        key,
        error: error.message,
        stack: error.stack,
        itemSize: JSON.stringify(item).length,
        storageArea,
      });
      throw error;
    }
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
