/**
 * AiGuardian SDK - Centralized Configuration Management
 *
 * Provides unified configuration management with validation,
 * persistence, and dynamic updates.
 */

import { DEFAULT_CONFIG, VALIDATION_RULES } from './constants.js';

/**
 * Centralized configuration management system
 */
export class ConfigManager {
  /**
   * Creates a new configuration manager
   * @param {Object} initialConfig - Initial configuration
   */
  constructor(initialConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...initialConfig };
    this.listeners = new Map();
    this.storageKey = 'aiguardian_sdk_config';
    this.persistenceEnabled = initialConfig.persistence !== false;

    // Load persisted configuration
    if (this.persistenceEnabled) {
      this.loadPersistedConfig();
    }

    // Validate initial configuration
    this.validateConfig(this.config);
  }

  /**
   * Gets a configuration value by path
   * @param {string} path - Dot-separated path (e.g., 'api.timeout')
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} Configuration value
   */
  get(path, defaultValue = undefined) {
    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  /**
   * Sets a configuration value by path
   * @param {string} path - Dot-separated path
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.');
    let obj = this.config;

    // Navigate to the parent object
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in obj) || typeof obj[key] !== 'object') {
        obj[key] = {};
      }
      obj = obj[key];
    }

    // Set the value
    const finalKey = keys[keys.length - 1];
    obj[finalKey] = value;

    // Validate the updated config
    this.validateConfig(this.config);

    // Persist if enabled
    if (this.persistenceEnabled) {
      this.persistConfig();
    }

    // Notify listeners
    this.notifyListeners(path, value);
  }

  /**
   * Updates multiple configuration values
   * @param {Object} updates - Configuration updates
   */
  update(updates) {
    this.updateRecursive(this.config, updates);

    // Validate the updated config
    this.validateConfig(this.config);

    // Persist if enabled
    if (this.persistenceEnabled) {
      this.persistConfig();
    }

    // Notify listeners for each updated path
    this.notifyListenersForUpdates(updates);
  }

  /**
   * Recursively updates configuration object
   * @param {Object} target - Target configuration object
   * @param {Object} source - Source updates
   */
  updateRecursive(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null &&
            typeof target[key] === 'object' && target[key] !== null) {
          this.updateRecursive(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  /**
   * Gets all configuration as a plain object
   * @returns {Object} Complete configuration
   */
  getAll() {
    return JSON.parse(JSON.stringify(this.config)); // Deep clone
  }

  /**
   * Resets configuration to defaults
   * @param {boolean} persist - Whether to persist the reset
   */
  reset(persist = true) {
    this.config = { ...DEFAULT_CONFIG };

    if (persist && this.persistenceEnabled) {
      this.persistConfig();
    }

    this.notifyListeners('config.reset', this.config);
  }

  /**
   * Validates configuration object
   * @param {Object} config - Configuration to validate
   * @throws {Error} If configuration is invalid
   */
  validateConfig(config) {
    const errors = [];

    // Validate API key if provided
    if (config.apiKey && !this.validateApiKey(config.apiKey)) {
      errors.push('Invalid API key format');
    }

    // Validate base URL
    if (config.baseUrl && !this.validateUrl(config.baseUrl)) {
      errors.push('Invalid base URL format');
    }

    // Validate timeout
    if (config.timeout && (typeof config.timeout !== 'number' || config.timeout < 1000)) {
      errors.push('Timeout must be a number >= 1000ms');
    }

    // Validate rate limits
    if (config.rateLimit) {
      const rl = config.rateLimit;
      if (rl.requests && (typeof rl.requests !== 'number' || rl.requests <= 0)) {
        errors.push('Rate limit requests must be a positive number');
      }
      if (rl.window && (typeof rl.window !== 'number' || rl.window <= 0)) {
        errors.push('Rate limit window must be a positive number');
      }
    }

    // Validate cache settings
    if (config.cache) {
      const cache = config.cache;
      if (cache.ttl && (typeof cache.ttl !== 'number' || cache.ttl <= 0)) {
        errors.push('Cache TTL must be a positive number');
      }
      if (cache.maxSize && (typeof cache.maxSize !== 'number' || cache.maxSize <= 0)) {
        errors.push('Cache max size must be a positive number');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Validates API key format
   * @param {string} apiKey - API key to validate
   * @returns {boolean} True if valid
   */
  validateApiKey(apiKey) {
    if (typeof apiKey !== 'string') return false;
    const rule = VALIDATION_RULES.API_KEY;
    return apiKey.length >= rule.MIN_LENGTH &&
           apiKey.length <= rule.MAX_LENGTH &&
           rule.PATTERN.test(apiKey);
  }

  /**
   * Validates URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid
   */
  validateUrl(url) {
    if (typeof url !== 'string') return false;
    const rule = VALIDATION_RULES.URL;
    return rule.PATTERN.test(url) && url.startsWith('https://');
  }

  /**
   * Adds a configuration change listener
   * @param {string} path - Configuration path to listen for
   * @param {Function} callback - Callback function
   * @returns {string} Listener ID for removal
   */
  addListener(path, callback) {
    const id = `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.listeners.set(id, { path, callback });
    return id;
  }

  /**
   * Removes a configuration change listener
   * @param {string} listenerId - Listener ID to remove
   */
  removeListener(listenerId) {
    this.listeners.delete(listenerId);
  }

  /**
   * Notifies listeners of configuration changes
   * @param {string} path - Changed path
   * @param {*} value - New value
   */
  notifyListeners(path, value) {
    this.listeners.forEach(({ path: listenerPath, callback }) => {
      if (this.matchesPath(path, listenerPath)) {
        try {
          callback(path, value, this.config);
        } catch (error) {
          console.error('[AiGuardian] Config listener error:', error);
        }
      }
    });
  }

  /**
   * Notifies listeners for bulk updates
   * @param {Object} updates - Updates object
   */
  notifyListenersForUpdates(updates) {
    // Flatten the updates object to paths
    const paths = this.flattenObjectKeys(updates);
    paths.forEach(path => {
      const value = this.get(path);
      this.notifyListeners(path, value);
    });
  }

  /**
   * Checks if a path matches a listener path (supports wildcards)
   * @param {string} path - Actual path
   * @param {string} listenerPath - Listener path (may contain *)
   * @returns {boolean} True if matches
   */
  matchesPath(path, listenerPath) {
    if (listenerPath === '*' || listenerPath === '**') return true;

    const pathParts = path.split('.');
    const listenerParts = listenerPath.split('.');

    if (pathParts.length !== listenerParts.length && !listenerPath.includes('**')) {
      return false;
    }

    for (let i = 0; i < listenerParts.length; i++) {
      if (listenerParts[i] === '*') continue;
      if (listenerParts[i] === '**') return true;
      if (listenerParts[i] !== pathParts[i]) return false;
    }

    return true;
  }

  /**
   * Flattens object keys to dot notation paths
   * @param {Object} obj - Object to flatten
   * @param {string} prefix - Current path prefix
   * @returns {Array<string>} Array of flattened paths
   */
  flattenObjectKeys(obj, prefix = '') {
    const paths = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newPath = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          paths.push(...this.flattenObjectKeys(obj[key], newPath));
        } else {
          paths.push(newPath);
        }
      }
    }

    return paths;
  }

  /**
   * Loads persisted configuration from storage
   */
  loadPersistedConfig() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const persisted = JSON.parse(stored);
        this.config = { ...this.config, ...persisted };
      }
    } catch (error) {
      console.warn('[AiGuardian] Failed to load persisted config:', error);
    }
  }

  /**
   * Persists current configuration to storage
   */
  persistConfig() {
    try {
      const toPersist = { ...this.config };
      // Don't persist sensitive data
      delete toPersist.apiKey;

      localStorage.setItem(this.storageKey, JSON.stringify(toPersist));
    } catch (error) {
      console.warn('[AiGuardian] Failed to persist config:', error);
    }
  }

  /**
   * Clears persisted configuration
   */
  clearPersistedConfig() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('[AiGuardian] Failed to clear persisted config:', error);
    }
  }

  /**
   * Gets configuration schema for validation
   * @returns {Object} Configuration schema
   */
  getSchema() {
    return {
      apiKey: { type: 'string', required: true, validator: 'apiKey' },
      baseUrl: { type: 'string', required: false, validator: 'url' },
      timeout: { type: 'number', required: false, min: 1000 },
      retryAttempts: { type: 'number', required: false, min: 0, max: 10 },
      cache: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean' },
          ttl: { type: 'number', min: 0 },
          maxSize: { type: 'number', min: 0 }
        }
      },
      rateLimit: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean' },
          requests: { type: 'number', min: 1 },
          window: { type: 'number', min: 1000 }
        }
      }
    };
  }
}
