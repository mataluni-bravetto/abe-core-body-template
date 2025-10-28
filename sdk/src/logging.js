/**
 * AiGuardian SDK - Centralized Logging System
 *
 * Provides unified logging with multiple outputs, structured logging,
 * and trace correlation.
 */

import { LOG_LEVELS, SDK_VERSION } from './constants.js';

/**
 * Centralized logging system for the SDK
 */
export class Logger {
  /**
   * Creates a new logger instance
   * @param {Object} config - Logging configuration
   */
  constructor(config = {}) {
    this.config = {
      level: config.level || 'info',
      enabled: config.enabled !== false,
      includeTimestamp: config.includeTimestamp !== false,
      includeTraceId: config.includeTraceId !== false,
      remoteLogging: config.remoteLogging !== false,
      maxLogSize: config.maxLogSize || 1000,
      outputs: config.outputs || ['console']
    };

    this.logs = [];
    this.remoteLogger = null;
    this.level = LOG_LEVELS[this.config.level.toUpperCase()] || LOG_LEVELS.INFO;
  }

  /**
   * Logs an error message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  error(message, metadata = {}) {
    this.log('error', message, metadata);
  }

  /**
   * Logs a warning message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  warn(message, metadata = {}) {
    this.log('warn', message, metadata);
  }

  /**
   * Logs an info message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  info(message, metadata = {}) {
    this.log('info', message, metadata);
  }

  /**
   * Logs a debug message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  debug(message, metadata = {}) {
    this.log('debug', message, metadata);
  }

  /**
   * Logs a trace message
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  trace(message, metadata = {}) {
    this.log('trace', message, metadata);
  }

  /**
   * Core logging method
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  log(level, message, metadata = {}) {
    if (!this.config.enabled) return;

    const levelValue = LOG_LEVELS[level.toUpperCase()];
    if (levelValue > this.level) return;

    const logEntry = this.createLogEntry(level, message, metadata);

    // Store in memory for debugging
    this.storeLogEntry(logEntry);

    // Output to configured destinations
    this.outputLogEntry(logEntry);

    // Send to remote logging if enabled
    if (this.config.remoteLogging && this.remoteLogger) {
      this.sendToRemote(logEntry);
    }
  }

  /**
   * Creates a structured log entry
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Structured log entry
   */
  createLogEntry(level, message, metadata = {}) {
    const entry = {
      timestamp: this.config.includeTimestamp ? new Date().toISOString() : undefined,
      level: level.toUpperCase(),
      message: this.sanitizeMessage(message),
      sdk_version: SDK_VERSION,
      ...this.sanitizeMetadata(metadata)
    };

    // Add trace ID if available
    if (this.config.includeTraceId && metadata.traceId) {
      entry.trace_id = metadata.traceId;
    }

    // Add session ID if available
    if (metadata.sessionId) {
      entry.session_id = metadata.sessionId;
    }

    return entry;
  }

  /**
   * Sanitizes log message to prevent injection and limit size
   * @param {string} message - Raw message
   * @returns {string} Sanitized message
   */
  sanitizeMessage(message) {
    if (typeof message !== 'string') {
      message = String(message);
    }

    // Remove potential injection characters
    message = message.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Limit message length
    if (message.length > this.config.maxLogSize) {
      message = message.substring(0, this.config.maxLogSize) + '...';
    }

    return message;
  }

  /**
   * Sanitizes metadata to remove sensitive information
   * @param {Object} metadata - Raw metadata
   * @returns {Object} Sanitized metadata
   */
  sanitizeMetadata(metadata) {
    if (!metadata || typeof metadata !== 'object') return {};

    const sanitized = { ...metadata };

    // Remove sensitive fields
    const sensitiveFields = ['password', 'apiKey', 'token', 'secret', 'key'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    // Truncate large values
    Object.keys(sanitized).forEach(key => {
      const value = sanitized[key];
      if (typeof value === 'string' && value.length > 500) {
        sanitized[key] = value.substring(0, 500) + '...';
      }
    });

    return sanitized;
  }

  /**
   * Stores log entry in memory (for debugging)
   * @param {Object} entry - Log entry
   */
  storeLogEntry(entry) {
    this.logs.push(entry);

    // Keep only last 1000 entries
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
  }

  /**
   * Outputs log entry to configured destinations
   * @param {Object} entry - Log entry
   */
  outputLogEntry(entry) {
    const outputs = this.config.outputs || ['console'];

    outputs.forEach(output => {
      switch (output) {
        case 'console':
          this.outputToConsole(entry);
          break;
        case 'memory':
          // Already stored above
          break;
        default:
          // Custom output handler
          if (typeof output === 'function') {
            output(entry);
          }
      }
    });
  }

  /**
   * Outputs log entry to browser console
   * @param {Object} entry - Log entry
   */
  outputToConsole(entry) {
    const prefix = `[AiGuardian ${entry.level}]`;
    const message = entry.timestamp
      ? `${prefix} ${entry.timestamp}: ${entry.message}`
      : `${prefix} ${entry.message}`;

    const metadata = { ...entry };
    delete metadata.timestamp;
    delete metadata.level;
    delete metadata.message;

    switch (entry.level) {
      case 'ERROR':
        console.error(message, metadata);
        break;
      case 'WARN':
        console.warn(message, metadata);
        break;
      case 'INFO':
        console.info(message, metadata);
        break;
      case 'DEBUG':
      case 'TRACE':
        console.debug(message, metadata);
        break;
    }
  }

  /**
   * Sends log entry to remote logging service
   * @param {Object} entry - Log entry
   */
  async sendToRemote(entry) {
    if (!this.remoteLogger) return;

    try {
      await this.remoteLogger.log(entry);
    } catch (error) {
      // Don't log remote logging failures to avoid infinite loops
      console.warn('[AiGuardian] Remote logging failed:', error.message);
    }
  }

  /**
   * Sets remote logger function
   * @param {Function} logger - Remote logging function
   */
  setRemoteLogger(logger) {
    this.remoteLogger = logger;
  }

  /**
   * Gets recent log entries
   * @param {number} limit - Maximum number of entries to return
   * @returns {Array} Recent log entries
   */
  getLogs(limit = 100) {
    return this.logs.slice(-limit);
  }

  /**
   * Clears stored logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Updates logging configuration
   * @param {Object} config - New configuration
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };
    this.level = LOG_LEVELS[this.config.level.toUpperCase()] || LOG_LEVELS.INFO;
  }

  /**
   * Gets current logging configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...this.config };
  }
}
