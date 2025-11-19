/**
 * Storage Quota Manager - Production-Grade Storage Management
 * 
 * Prevents storage quota exceeded errors by:
 * - Monitoring storage usage
 * - Enforcing item size limits
 * - Automatically cleaning up old data
 * - Compressing large data before storage
 * 
 * Usage:
 *   importScripts('debug/storage-quota-manager.js');
 *   StorageQuotaManager.store('key', data);
 */

class StorageQuotaManager {
  constructor() {
    this.ITEM_QUOTA = 8 * 1024; // 8KB per item
    this.LOCAL_QUOTA = 10 * 1024 * 1024; // 10MB total
    this.SYNC_QUOTA = 1024 * 1024; // 1MB total
    this.SAFE_BUFFER = 0.9; // Use 90% of quota as safe limit
  }

  /**
   * Store data with quota management
   */
  async store(key, data, area = 'local', options = {}) {
    const {
      compress = true,
      maxSize = this.ITEM_QUOTA * this.SAFE_BUFFER,
      cleanupOld = true,
      essentialFields = null
    } = options;

    try {
      // Prepare data
      let dataToStore = data;

      // Extract only essential fields if specified
      if (essentialFields && Array.isArray(essentialFields)) {
        dataToStore = {};
        essentialFields.forEach(field => {
          if (data[field] !== undefined) {
            dataToStore[field] = data[field];
          }
        });
      }

      // Check size
      const dataSize = JSON.stringify(dataToStore).length;

      if (dataSize > maxSize) {
        console.warn(`[StorageQuotaManager] Data size (${dataSize} bytes) exceeds limit (${maxSize} bytes)`);
        
        // Try compression
        if (compress) {
          dataToStore = this.compressData(dataToStore, maxSize);
        }

        // If still too large, store minimal data
        const finalSize = JSON.stringify(dataToStore).length;
        if (finalSize > maxSize) {
          console.warn(`[StorageQuotaManager] Compressed data still too large, storing minimal data`);
          dataToStore = this.extractMinimalData(dataToStore);
        }
      }

      // Check quota before storing
      if (cleanupOld) {
        await this.ensureQuotaAvailable(area, JSON.stringify(dataToStore).length);
      }

      // Store data
      return new Promise((resolve, reject) => {
        const storageArea = area === 'sync' ? chrome.storage.sync : chrome.storage.local;
        const storageData = { [key]: dataToStore };

        storageArea.set(storageData, () => {
          if (chrome.runtime.lastError) {
            if (chrome.runtime.lastError.message.includes('quota')) {
              // Quota exceeded - try cleanup and retry
              this.handleQuotaExceeded(area, key, dataToStore)
                .then(resolve)
                .catch(reject);
            } else {
              reject(new Error(chrome.runtime.lastError.message));
            }
          } else {
            resolve(dataToStore);
          }
        });
      });
    } catch (error) {
      console.error('[StorageQuotaManager] Store failed:', error);
      throw error;
    }
  }

  /**
   * Compress data to fit within size limit
   */
  compressData(data, maxSize) {
    // Remove null/undefined values
    const cleaned = JSON.parse(JSON.stringify(data, (key, value) => {
      if (value === null || value === undefined) return undefined;
      return value;
    }));

    // Remove large fields
    const compressed = { ...cleaned };
    
    // Remove metadata if present
    if (compressed.metadata) delete compressed.metadata;
    if (compressed.raw) delete compressed.raw;
    if (compressed.full_response) delete compressed.full_response;

    // Truncate long strings
    for (const [key, value] of Object.entries(compressed)) {
      if (typeof value === 'string' && value.length > 500) {
        compressed[key] = value.substring(0, 500) + '...';
      }
    }

    return compressed;
  }

  /**
   * Extract minimal essential data
   */
  extractMinimalData(data) {
    // Extract only the most essential fields
    const minimal = {
      timestamp: data.timestamp || Date.now()
    };

    // Try to preserve score/type if available
    if (data.score !== undefined) minimal.score = data.score;
    if (data.analysis?.bias_score !== undefined) minimal.bias_score = data.analysis.bias_score;
    if (data.analysis?.bias_type) minimal.bias_type = data.analysis.bias_type;
    if (data.analysis?.type) minimal.type = data.analysis.type;
    if (data.success !== undefined) minimal.success = data.success;
    if (data.error) minimal.error = data.error;

    return minimal;
  }

  /**
   * Ensure quota is available
   */
  async ensureQuotaAvailable(area, requiredBytes) {
    const quota = area === 'sync' ? this.SYNC_QUOTA : this.LOCAL_QUOTA;
    const safeLimit = quota * this.SAFE_BUFFER;

    const currentUsage = await new Promise((resolve) => {
      const storageArea = area === 'sync' ? chrome.storage.sync : chrome.storage.local;
      storageArea.getBytesInUse(null, (bytes) => {
        resolve(bytes);
      });
    });

    if (currentUsage + requiredBytes > safeLimit) {
      console.warn(`[StorageQuotaManager] Quota usage high (${currentUsage} bytes), cleaning up...`);
      await this.cleanupOldData(area, requiredBytes);
    }
  }

  /**
   * Clean up old data
   */
  async cleanupOldData(area, requiredBytes) {
    const storageArea = area === 'sync' ? chrome.storage.sync : chrome.storage.local;
    
    return new Promise((resolve) => {
      storageArea.get(null, (items) => {
        const keysToRemove = [];

        // Find old analysis history entries
        if (items.analysis_history && Array.isArray(items.analysis_history)) {
          // Keep only last 50 entries
          if (items.analysis_history.length > 50) {
            items.analysis_history = items.analysis_history.slice(-50);
            storageArea.set({ analysis_history: items.analysis_history });
          }
        }

        // Remove old temporary keys
        for (const key of Object.keys(items)) {
          if (key.startsWith('_temp_') || key.startsWith('_debug_')) {
            keysToRemove.push(key);
          }
        }

        // Remove old keys if still needed
        if (keysToRemove.length > 0) {
          storageArea.remove(keysToRemove, resolve);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Handle quota exceeded error
   */
  async handleQuotaExceeded(area, key, data) {
    console.error(`[StorageQuotaManager] Quota exceeded for key: ${key}`);

    // Try cleanup
    await this.cleanupOldData(area, 0);

    // Try storing minimal data
    const minimalData = this.extractMinimalData(data);
    const minimalSize = JSON.stringify(minimalData).length;

    if (minimalSize > this.ITEM_QUOTA) {
      throw new Error(`Data too large even after compression: ${minimalSize} bytes`);
    }

    // Retry with minimal data
    return this.store(key, minimalData, area, { compress: false, cleanupOld: false });
  }

  /**
   * Get storage usage statistics
   */
  async getUsageStats(area = 'local') {
    const quota = area === 'sync' ? this.SYNC_QUOTA : this.LOCAL_QUOTA;
    const storageArea = area === 'sync' ? chrome.storage.sync : chrome.storage.local;

    const usage = await new Promise((resolve) => {
      storageArea.getBytesInUse(null, (bytes) => {
        resolve(bytes);
      });
    });

    const items = await new Promise((resolve) => {
      storageArea.get(null, resolve);
    });

    const itemSizes = {};
    for (const [key, value] of Object.entries(items)) {
      itemSizes[key] = JSON.stringify(value).length;
    }

    return {
      area: area,
      usage: usage,
      usageMB: (usage / 1024 / 1024).toFixed(2),
      quota: quota,
      quotaMB: (quota / 1024 / 1024).toFixed(2),
      usagePercent: ((usage / quota) * 100).toFixed(2),
      itemCount: Object.keys(items).length,
      itemSizes: itemSizes,
      largestItem: Object.entries(itemSizes).sort((a, b) => b[1] - a[1])[0]
    };
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.StorageQuotaManager = StorageQuotaManager;
}
if (typeof self !== 'undefined') {
  self.StorageQuotaManager = StorageQuotaManager;
}

