/**
 * AiGuardian Client SDK - Main Client Class
 *
 * Provides unified interface for AI content analysis with centralized
 * logging, tracing, and configuration management.
 */

import { Logger } from './logging.js';
import { Tracer } from './tracer.js';
import { ConfigManager } from './config.js';
import { HttpClient } from './http-client.js';
import { InputValidator } from './input-validator.js';
import { CacheManager } from './cache-manager.js';
import { RateLimiter } from './rate-limiter.js';
import { SDK_VERSION, DEFAULT_CONFIG } from './constants.js';

/**
 * Main AiGuardian SDK client class
 */
export class AiGuardianClient {
  /**
   * Creates a new AiGuardian client instance
   * @param {Object} config - Configuration options
   * @param {string} config.apiKey - API key for authentication
   * @param {string} config.baseUrl - Base URL for the API (default: https://api.aiguardian.ai)
   * @param {Object} config.logging - Logging configuration
   * @param {Object} config.tracing - Tracing configuration
   * @param {Object} config.cache - Cache configuration
   * @param {Object} config.rateLimit - Rate limiting configuration
   */
  constructor(config = {}) {
    // Initialize core components
    this.config = new ConfigManager({ ...DEFAULT_CONFIG, ...config });
    this.logger = new Logger(this.config.get('logging'));
    this.tracer = new Tracer(this.config.get('tracing'));
    this.httpClient = new HttpClient(this.config, this.logger, this.tracer);
    this.validator = new InputValidator();
    this.cache = new CacheManager(this.config.get('cache'));
    this.rateLimiter = new RateLimiter(this.config.get('rateLimit'));

    // Track initialization
    this.logger.info('AiGuardian SDK initialized', {
      version: SDK_VERSION,
      config: this.config.getAll()
    });

    this.tracer.startTrace('sdk_initialization');
    this.tracer.endTrace('sdk_initialization');
  }

  /**
   * Analyzes text for bias, emotional language, and objectivity
   * @param {string} text - Text to analyze
   * @param {Object} options - Analysis options
   * @param {Array<string>} options.guards - Specific guards to run
   * @param {number} options.confidence - Minimum confidence threshold
   * @param {boolean} options.cache - Whether to use cache (default: true)
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeText(text, options = {}) {
    const traceId = this.tracer.startTrace('analyze_text', { textLength: text.length });

    try {
      // Validate input
      this.validator.validateText(text);

      // Check rate limits
      if (!this.rateLimiter.checkLimit()) {
        throw new Error('Rate limit exceeded');
      }

      // Check cache
      const cacheKey = this.cache.generateKey('analyze', { text, options });
      if (options.cache !== false) {
        const cached = this.cache.get(cacheKey);
        if (cached) {
          this.logger.info('Cache hit for text analysis', { traceId, cacheKey });
          this.tracer.addMetric('cache_hit');
          return cached;
        }
      }

      // Prepare request
      const requestData = {
        text: text.trim(),
        options: {
          guards: options.guards || this.config.get('defaultGuards'),
          confidence: options.confidence || this.config.get('confidence'),
          timestamp: new Date().toISOString(),
          sdk_version: SDK_VERSION
        }
      };

      // Make API call
      const response = await this.httpClient.request('/api/v1/analyze', requestData);

      // Validate response
      this.validator.validateAnalysisResponse(response);

      // Cache result
      if (options.cache !== false) {
        this.cache.set(cacheKey, response, this.config.get('cache.ttl'));
      }

      // Log success
      this.logger.info('Text analysis completed', {
        traceId,
        score: response.score,
        biasType: response.analysis?.bias_type,
        confidence: response.analysis?.confidence
      });

      this.tracer.addMetric('analysis_completed');
      return response;

    } catch (error) {
      this.logger.error('Text analysis failed', { traceId, error: error.message });
      this.tracer.addMetric('analysis_failed');
      throw error;
    } finally {
      this.tracer.endTrace('analyze_text', traceId);
    }
  }

  /**
   * Batch analyzes multiple texts
   * @param {Array<string>} texts - Array of texts to analyze
   * @param {Object} options - Analysis options
   * @returns {Promise<Array<Object>>} Array of analysis results
   */
  async analyzeBatch(texts, options = {}) {
    const traceId = this.tracer.startTrace('analyze_batch', { batchSize: texts.length });

    try {
      // Validate batch size
      if (texts.length > this.config.get('maxBatchSize')) {
        throw new Error(`Batch size exceeds maximum of ${this.config.get('maxBatchSize')}`);
      }

      // Validate all texts
      texts.forEach(text => this.validator.validateText(text));

      // Check rate limits
      if (!this.rateLimiter.checkLimit(texts.length)) {
        throw new Error('Rate limit exceeded for batch analysis');
      }

      const results = [];
      const errors = [];

      // Process in parallel with concurrency control
      const concurrency = Math.min(texts.length, this.config.get('concurrency'));

      for (let i = 0; i < texts.length; i += concurrency) {
        const batch = texts.slice(i, i + concurrency);
        const batchPromises = batch.map(text => this.analyzeText(text, options));

        try {
          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);
        } catch (error) {
          errors.push(error);
          this.logger.warn('Batch analysis partial failure', { batchIndex: i, error: error.message });
        }
      }

      if (errors.length > 0) {
        this.logger.warn('Batch analysis completed with errors', {
          totalTexts: texts.length,
          successful: results.length,
          errors: errors.length
        });
      }

      this.tracer.addMetric('batch_analysis_completed', { batchSize: texts.length });
      return results;

    } catch (error) {
      this.logger.error('Batch analysis failed', { traceId, error: error.message });
      this.tracer.addMetric('batch_analysis_failed');
      throw error;
    } finally {
      this.tracer.endTrace('analyze_batch', traceId);
    }
  }

  /**
   * Gets guard service status and configuration
   * @returns {Promise<Object>} Guard services status
   */
  async getGuardStatus() {
    const traceId = this.tracer.startTrace('get_guard_status');

    try {
      const response = await this.httpClient.request('/api/v1/guards/status');
      this.logger.info('Guard status retrieved', { traceId });
      return response;
    } catch (error) {
      this.logger.error('Failed to get guard status', { traceId, error: error.message });
      throw error;
    } finally {
      this.tracer.endTrace('get_guard_status', traceId);
    }
  }

  /**
   * Tests API connectivity and health
   * @returns {Promise<Object>} Health check results
   */
  async healthCheck() {
    const traceId = this.tracer.startTrace('health_check');

    try {
      const startTime = Date.now();
      const response = await this.httpClient.request('/health/live');
      const responseTime = Date.now() - startTime;

      const result = {
        status: 'healthy',
        responseTime,
        timestamp: new Date().toISOString(),
        ...response
      };

      this.logger.info('Health check successful', { traceId, responseTime });
      this.tracer.addMetric('health_check_successful');
      return result;

    } catch (error) {
      this.logger.error('Health check failed', { traceId, error: error.message });
      this.tracer.addMetric('health_check_failed');
      throw error;
    } finally {
      this.tracer.endTrace('health_check', traceId);
    }
  }

  /**
   * Gets trace statistics
   * @returns {Object} Trace statistics
   */
  getTraceStats() {
    return this.tracer.getStats();
  }

  /**
   * Gets current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return this.config.getAll();
  }

  /**
   * Updates configuration
   * @param {Object} updates - Configuration updates
   */
  updateConfig(updates) {
    this.config.update(updates);
    this.logger.info('Configuration updated', { updates });
  }

  /**
   * Clears all cached data
   */
  clearCache() {
    this.cache.clear();
    this.logger.info('Cache cleared');
  }

  /**
   * Gets SDK version
   * @returns {string} SDK version
   */
  getVersion() {
    return SDK_VERSION;
  }
}
