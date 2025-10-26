/**
 * AiGuardian SDK - Input Validator
 *
 * Provides comprehensive input validation and sanitization
 * for all SDK inputs and API responses.
 */

import { VALIDATION_RULES, ERROR_CODES } from './constants.js';

/**
 * Input validation and sanitization utilities
 */
export class InputValidator {
  /**
   * Validates text input for analysis
   * @param {string} text - Text to validate
   * @throws {Error} If validation fails
   */
  validateText(text) {
    if (!text) {
      throw new Error('Text is required');
    }

    if (typeof text !== 'string') {
      throw new Error('Text must be a string');
    }

    const rule = VALIDATION_RULES.TEXT;

    if (text.length < rule.MIN_LENGTH) {
      throw new Error(`Text must be at least ${rule.MIN_LENGTH} characters long`);
    }

    if (text.length > rule.MAX_LENGTH) {
      throw new Error(`Text must not exceed ${rule.MAX_LENGTH} characters`);
    }

    if (!rule.ALLOWED_CHARS.test(text)) {
      throw new Error('Text contains invalid characters');
    }

    // Check for excessive whitespace
    const words = text.trim().split(/\s+/);
    if (words.length < 3) {
      throw new Error('Text must contain at least 3 words');
    }
  }

  /**
   * Validates API key format
   * @param {string} apiKey - API key to validate
   * @throws {Error} If validation fails
   */
  validateApiKey(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    if (typeof apiKey !== 'string') {
      throw new Error('API key must be a string');
    }

    const rule = VALIDATION_RULES.API_KEY;

    if (apiKey.length < rule.MIN_LENGTH) {
      throw new Error(`API key must be at least ${rule.MIN_LENGTH} characters long`);
    }

    if (apiKey.length > rule.MAX_LENGTH) {
      throw new Error(`API key must not exceed ${rule.MAX_LENGTH} characters`);
    }

    if (!rule.PATTERN.test(apiKey)) {
      throw new Error('API key contains invalid characters');
    }
  }

  /**
   * Validates URL format
   * @param {string} url - URL to validate
   * @throws {Error} If validation fails
   */
  validateUrl(url) {
    if (!url) {
      throw new Error('URL is required');
    }

    if (typeof url !== 'string') {
      throw new Error('URL must be a string');
    }

    const rule = VALIDATION_RULES.URL;

    if (!rule.PATTERN.test(url)) {
      throw new Error('Invalid URL format');
    }

    if (!url.startsWith('https://')) {
      throw new Error('URL must use HTTPS protocol');
    }
  }

  /**
   * Validates analysis options
   * @param {Object} options - Analysis options to validate
   * @throws {Error} If validation fails
   */
  validateAnalysisOptions(options) {
    if (!options || typeof options !== 'object') {
      return; // Options are optional
    }

    // Validate guards array
    if (options.guards) {
      if (!Array.isArray(options.guards)) {
        throw new Error('Guards must be an array');
      }

      const validGuards = ['biasguard', 'trustguard', 'contextguard', 'securityguard', 'tokenguard', 'healthguard'];
      options.guards.forEach(guard => {
        if (typeof guard !== 'string') {
          throw new Error('Guard names must be strings');
        }
        if (!validGuards.includes(guard)) {
          throw new Error(`Invalid guard: ${guard}`);
        }
      });
    }

    // Validate confidence threshold
    if (options.confidence !== undefined) {
      if (typeof options.confidence !== 'number') {
        throw new Error('Confidence must be a number');
      }
      if (options.confidence < 0 || options.confidence > 1) {
        throw new Error('Confidence must be between 0 and 1');
      }
    }

    // Validate cache option
    if (options.cache !== undefined && typeof options.cache !== 'boolean') {
      throw new Error('Cache option must be a boolean');
    }
  }

  /**
   * Validates batch analysis input
   * @param {Array<string>} texts - Array of texts to validate
   * @throws {Error} If validation fails
   */
  validateBatchTexts(texts) {
    if (!Array.isArray(texts)) {
      throw new Error('Batch input must be an array of texts');
    }

    if (texts.length === 0) {
      throw new Error('Batch must contain at least one text');
    }

    if (texts.length > 100) {
      throw new Error('Batch size cannot exceed 100 texts');
    }

    texts.forEach((text, index) => {
      try {
        this.validateText(text);
      } catch (error) {
        throw new Error(`Text at index ${index}: ${error.message}`);
      }
    });
  }

  /**
   * Validates API response format
   * @param {Object} response - API response to validate
   * @param {string} endpoint - Endpoint that was called
   * @throws {Error} If validation fails
   */
  validateAnalysisResponse(response) {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format: expected object');
    }

    // Required fields for analysis response
    const requiredFields = ['success', 'score', 'analysis', 'timestamp'];
    const missingFields = requiredFields.filter(field => !(field in response));

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate success field
    if (typeof response.success !== 'boolean') {
      throw new Error('Success field must be a boolean');
    }

    // Validate score field
    if (typeof response.score !== 'number' || response.score < 0 || response.score > 1) {
      throw new Error('Score must be a number between 0 and 1');
    }

    // Validate analysis object
    if (!response.analysis || typeof response.analysis !== 'object') {
      throw new Error('Analysis field must be an object');
    }

    // Validate timestamp
    if (!response.timestamp || !this.isValidTimestamp(response.timestamp)) {
      throw new Error('Invalid timestamp format');
    }

    // Validate analysis sub-fields
    const analysis = response.analysis;
    if (typeof analysis.bias_type !== 'string') {
      throw new Error('Analysis.bias_type must be a string');
    }

    if (typeof analysis.confidence !== 'number' || analysis.confidence < 0 || analysis.confidence > 1) {
      throw new Error('Analysis.confidence must be a number between 0 and 1');
    }
  }

  /**
   * Validates health check response
   * @param {Object} response - Health check response
   * @throws {Error} If validation fails
   */
  validateHealthResponse(response) {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid health response format');
    }

    if (typeof response.status !== 'string') {
      throw new Error('Health response must include status field');
    }

    if (!['healthy', 'unhealthy', 'maintenance'].includes(response.status)) {
      throw new Error('Invalid health status');
    }
  }

  /**
   * Sanitizes text input to prevent XSS and injection attacks
   * @param {string} text - Text to sanitize
   * @returns {string} Sanitized text
   */
  sanitizeText(text) {
    if (typeof text !== 'string') return text;

    // Remove null bytes and control characters (except common whitespace)
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Basic HTML entity encoding for dangerous characters
    text = text.replace(/[<>]/g, (match) => {
      return match === '<' ? '&lt;' : '&gt;';
    });

    // Remove potential script tags (basic protection)
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    return text;
  }

  /**
   * Checks if a string is a valid ISO 8601 timestamp
   * @param {string} timestamp - Timestamp to validate
   * @returns {boolean} True if valid
   */
  isValidTimestamp(timestamp) {
    if (typeof timestamp !== 'string') return false;

    const date = new Date(timestamp);
    return !isNaN(date.getTime()) && timestamp === date.toISOString();
  }

  /**
   * Validates configuration object
   * @param {Object} config - Configuration to validate
   * @returns {Array<string>} Array of validation errors
   */
  validateConfiguration(config) {
    const errors = [];

    if (!config || typeof config !== 'object') {
      errors.push('Configuration must be an object');
      return errors;
    }

    // Validate API key if present
    if (config.apiKey !== undefined) {
      try {
        this.validateApiKey(config.apiKey);
      } catch (error) {
        errors.push(`API Key: ${error.message}`);
      }
    }

    // Validate base URL if present
    if (config.baseUrl !== undefined) {
      try {
        this.validateUrl(config.baseUrl);
      } catch (error) {
        errors.push(`Base URL: ${error.message}`);
      }
    }

    // Validate numeric fields
    const numericFields = {
      timeout: { min: 1000, max: 60000 },
      retryAttempts: { min: 0, max: 10 },
      maxBatchSize: { min: 1, max: 100 },
      concurrency: { min: 1, max: 10 }
    };

    Object.entries(numericFields).forEach(([field, limits]) => {
      if (config[field] !== undefined) {
        if (typeof config[field] !== 'number') {
          errors.push(`${field} must be a number`);
        } else if (config[field] < limits.min || config[field] > limits.max) {
          errors.push(`${field} must be between ${limits.min} and ${limits.max}`);
        }
      }
    });

    return errors;
  }
}
