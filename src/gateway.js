/**
 * AI Guardians Central Gateway Bridge
 * 
 * This module provides a unified interface for connecting the Chrome extension
 * to the AI Guardians backend services through a central gateway.
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Configure your AI Guardians gateway endpoint
 * - Implement authentication with your guard services
 * - Add custom guard types and analysis pipelines
 * - Integrate with your central logging and monitoring
 */

class AIGuardiansGateway {
  /**
   * Sanitizes request data to prevent XSS and injection attacks
   * @function sanitizeRequestData
   * @param {Object} data - The data to sanitize
   * @returns {Object} The sanitized data
   */
  sanitizeRequestData(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }
    
    const sanitized = { ...data };
    
    // Sanitize text content using optimized string operations
    if (sanitized.text && typeof sanitized.text === 'string') {
      sanitized.text = StringOptimizer.optimizedSanitize(
        sanitized.text, 
        TEXT_ANALYSIS.MAX_TEXT_LENGTH
      );
    }
    
    // Sanitize other string fields using optimized operations
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 0) {
        sanitized[key] = StringOptimizer.optimizedSanitize(
          sanitized[key], 
          SECURITY.MAX_STRING_LENGTH
        );
      }
    });
    
    return sanitized;
  }

  
  /**
   * Logs messages securely without exposing sensitive data
   * @function secureLog
   * @param {string} level - The log level (info, warn, error, trace)
   * @param {string} message - The log message
   * @param {Object} data - Additional data to log
   * @returns {void}
   */
  secureLog(level, message, data = {}) {
    // Sanitize data before logging
    const sanitizedData = this.sanitizePayload(data);
    
    // Log with sanitized data
    switch (level) {
      case 'info':
        Logger.info(`[Gateway] ${message}`, sanitizedData);
        break;
      case 'warn':
        Logger.warn(`[Gateway] ${message}`, sanitizedData);
        break;
      case 'error':
        Logger.error(`[Gateway] ${message}`, sanitizedData);
        break;
      case 'trace':
        Logger.info(`[Gateway-TRACE] ${message}`, sanitizedData);
        break;
    }
  }

  
  /**
   * Validates request parameters and payload before sending
   * @function validateRequest
   * @param {string} endpoint - The API endpoint to validate
   * @param {Object} payload - The request payload to validate
   * @returns {void}
   * @throws {Error} If validation fails
   */
  validateRequest(endpoint, payload) {
    // Validate endpoint
    const allowedEndpoints = ['analyze', 'health', 'logging', 'guards', 'config'];
    if (!allowedEndpoints.includes(endpoint)) {
      throw new Error(`Invalid endpoint: ${endpoint}`);
    }
    
    // Validate payload based on endpoint
    switch (endpoint) {
      case 'analyze':
        if (!payload || typeof payload !== 'object') {
          throw new Error('Invalid payload: must be an object');
        }
        if (!payload.text || typeof payload.text !== 'string') {
          throw new Error('Invalid payload: text field is required');
        }
        if (payload.text.length > 10000) {
          throw new Error('Invalid payload: text too long');
        }
        break;
        
      case 'health':
        // Health checks don't require payload validation
        break;
        
      case 'logging':
        if (!payload || typeof payload !== 'object') {
          throw new Error('Invalid payload: must be an object');
        }
        if (!payload.level || !payload.message) {
          throw new Error('Invalid payload: level and message are required');
        }
        break;
        
      case 'guards':
        // Guard requests don't require payload validation
        break;
        
      case 'config':
        if (payload && typeof payload !== 'object') {
          throw new Error('Invalid payload: must be an object');
        }
        break;
    }
    
    return true;
  }

  
  /**
   * Handles errors with comprehensive logging and context
   * @function handleError
   * @param {Error} error - The error to handle
   * @param {Object} context - Additional context about the error
   * @returns {Object} Error information object
   */
  handleError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      extensionVersion: chrome.runtime.getManifest().version
    };
    
    // Log error securely (without sensitive data)
    Logger.error('[Gateway] Error occurred:', {
      message: error.message,
      context: context,
      timestamp: errorInfo.timestamp
    });
    
    // Update trace stats
    this.traceStats.failures++;
    this.traceStats.errorCounts[error.name] = (this.traceStats.errorCounts[error.name] || 0) + 1;
    
    // Send error to central logging if available
    if (this.centralLogger) {
      this.centralLogger.error('Gateway error', errorInfo);
    }
    
    return errorInfo;
  }

  
  constructor() {
    // Import constants
    import { API_CONFIG, DEFAULT_CONFIG, SECURITY } from './constants.js';
    
    this.config = {
      gatewayUrl: DEFAULT_CONFIG.GATEWAY_URL,
      timeout: API_CONFIG.TIMEOUT,
      retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: API_CONFIG.RETRY_DELAY
    };
    
    // Enhanced tracing and logging
    this.traceStats = {
      requests: 0,
      successes: 0,
      failures: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      lastRequestTime: null,
      errorCounts: {}
    };
    
    this.logger = this.initializeLogger();
    
    this.guardServices = new Map();
    this.centralLogger = null;
    this.centralConfig = null;
    
    this.initializeGateway();
  }

  /**
   * TRACER BULLET: Initialize enhanced logger with tracing
   */
  initializeLogger() {
    return {
      info: (message, metadata = {}) => {
        this.secureLog("info", message, metadata);
        this.updateTraceStats('info', message, metadata);
      },
      warn: (message, metadata = {}) => {
        this.secureLog("warn", message, metadata);
        this.updateTraceStats('warn', message, metadata);
      },
      error: (message, metadata = {}) => {
        this.secureLog("error", message, metadata);
        this.updateTraceStats('error', message, metadata);
      },
      trace: (message, metadata = {}) => {
        Logger.info(`[Gateway-TRACE] ${message}`, metadata);
        this.updateTraceStats('trace', message, metadata);
      }
    };
  }

  /**
   * TRACER BULLET: Update trace statistics
   */
  updateTraceStats(level, message, metadata) {
    this.traceStats.lastRequestTime = new Date().toISOString();
    
    if (level === 'error') {
      this.traceStats.failures++;
      const errorType = metadata.error || 'unknown';
      this.traceStats.errorCounts[errorType] = (this.traceStats.errorCounts[errorType] || 0) + 1;
    } else if (level === 'info' && message.includes('successful')) {
      this.traceStats.successes++;
    }
    
    if (metadata.response_time) {
      this.traceStats.totalResponseTime += metadata.response_time;
      this.traceStats.averageResponseTime = this.traceStats.totalResponseTime / this.traceStats.requests;
    }
  }

  /**
   * TRACER BULLET: Get trace statistics
   */
  getTraceStats() {
    return {
      ...this.traceStats,
      successRate: this.traceStats.requests > 0 ? (this.traceStats.successes / this.traceStats.requests) * 100 : 0,
      failureRate: this.traceStats.requests > 0 ? (this.traceStats.failures / this.traceStats.requests) * 100 : 0
    };
  }

  /**
   * TRACER BULLET: Initialize gateway connection
   */
  async initializeGateway() {
    try {
      // Load configuration from storage
      await this.loadConfiguration();
      
      // Initialize central logging
      await this.initializeCentralLogging();
      
      // Initialize guard services
      await this.initializeGuardServices();
      
      Logger.info('[Gateway] Initialized AI Guardians gateway');
    } catch (err) {
      Logger.error('[Gateway] Initialization failed', err);
    }
  }

  /**
   * TRACER BULLET: Load central configuration
   */
  async loadConfiguration() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([
        'gateway_url',
        'api_key',
        'guard_services',
        'logging_config',
        'analysis_pipeline'
      ], (data) => {
        this.config = {
          ...this.config,
          gatewayUrl: data.gateway_url || this.config.gatewayUrl,
          apiKey: data.api_key || '',
          guardServices: data.guard_services || {},
          loggingConfig: data.logging_config || {},
          analysisPipeline: data.analysis_pipeline || 'default'
        };
        resolve();
      });
    });
  }

  /**
   * TRACER BULLET: Initialize central logging bridge
   */
  async initializeCentralLogging() {
    this.centralLogger = {
      log: async (level, message, metadata = {}) => {
        try {
          // Send to central logging service
          await this.sendToGateway('logging', {
            level,
            message,
            metadata: {
              ...metadata,
              timestamp: new Date().toISOString(),
              extension_version: chrome.runtime.getManifest().version,
              user_agent: navigator.userAgent
            }
          });
        } catch (err) {
          Logger.error('[Central Logger] Failed to send log:', err);
        }
      },
      
      info: (message, metadata) => this.centralLogger.log('info', message, metadata),
      warn: (message, metadata) => this.centralLogger.log('warn', message, metadata),
      error: (message, metadata) => this.centralLogger.log('error', message, metadata)
    };
  }

  /**
   * TRACER BULLET: Initialize guard services
   */
  async initializeGuardServices() {
    // Updated to match backend guard service names
    const defaultGuards = {
      biasguard: {
        enabled: true,
        threshold: 0.5,
        pipeline: 'bias_analysis_v2',
        displayName: 'Bias Detection'
      },
      trustguard: {
        enabled: true,
        threshold: 0.7,
        pipeline: 'trust_analysis_v1',
        displayName: 'Trust Analysis'
      },
      contextguard: {
        enabled: false,
        threshold: 0.6,
        pipeline: 'context_analysis_v1',
        displayName: 'Context Analysis'
      },
      securityguard: {
        enabled: false,
        threshold: 0.8,
        pipeline: 'security_analysis_v1',
        displayName: 'Security Analysis'
      },
      tokenguard: {
        enabled: false,
        threshold: 0.5,
        pipeline: 'token_optimization_v1',
        displayName: 'Token Optimization'
      },
      healthguard: {
        enabled: false,
        threshold: 0.5,
        pipeline: 'health_monitoring_v1',
        displayName: 'Health Monitoring'
      }
    };

    // Load guard services configuration
    const guardConfig = this.config.guardServices || defaultGuards;
    
    for (const [guardName, config] of Object.entries(guardConfig)) {
      this.guardServices.set(guardName, {
        ...config,
        lastUsed: null,
        successCount: 0,
        errorCount: 0
      });
    }
  }

  /**
   * TRACER BULLET: Send request to central gateway with enhanced tracing
   */
  async sendToGateway(endpoint, payload) {
    // Sanitize payload data
    payload = this.sanitizeRequestData(payload);
    try {
      this.validateRequest(endpoint, payload);
    } catch (error) {
      Logger.error('[Error Context]', { file: 'src/gateway.js', error: error.message, stack: error.stack });
      this.handleError(error, { endpoint, payload });
      throw error;
    }
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    
    // Check cache first (for GET requests and analyze endpoint)
    const cacheKey = this.cacheManager.generateCacheKey(endpoint, payload);
    const cachedResponse = this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      this.logger.trace('Cache hit', { endpoint, requestId });
      return cachedResponse;
    }
    
    // Check if request is already in progress (deduplication)
    const queuedRequest = this.cacheManager.getQueuedRequest(cacheKey);
    if (queuedRequest) {
      this.logger.trace('Request deduplication', { endpoint, requestId });
      return await queuedRequest;
    }
    
    // Map extension endpoints to backend API endpoints
    const endpointMapping = {
      'analyze': 'posts',
      'health': 'posts/1',
      'logging': 'posts',
      'guards': 'posts',
      'config': 'posts/1'
    };
    
    const mappedEndpoint = endpointMapping[endpoint] || endpoint;
    const url = this.config.gatewayUrl + '/' + mappedEndpoint;
    
    this.traceStats.requests++;
    
    this.logger.trace('Sending request to gateway', {
      requestId,
      endpoint: mappedEndpoint,
      url,
      payload: this.sanitizePayload(payload)
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.config.apiKey,
        'X-Extension-Version': chrome.runtime.getManifest().version,
        'X-Request-ID': requestId,
        'X-Timestamp': new Date().toISOString()
      },
      body: JSON.stringify(payload)
    };

    let lastError;
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        this.logger.trace(`Attempt ${attempt}/${this.config.retryAttempts}`, {
          requestId,
          endpoint: mappedEndpoint,
          attempt
        });
        
        const response = await fetch(url, requestOptions);
        const responseTime = Date.now() - startTime;
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
        
        const result = await response.json();
        
        // Validate response data
        const validationResult = this.validateApiResponse(result, endpoint);
        if (!validationResult.isValid) {
          this.logger.warn('API response validation failed', {
            requestId,
            endpoint: mappedEndpoint,
            validationErrors: validationResult.errors
          });
        }
        
        // Use transformed response if available (for mock API)
        const finalResult = validationResult.transformedResponse || result;
        
        // Update trace stats
        this.traceStats.successes++;
        this.traceStats.totalResponseTime += responseTime;
        this.traceStats.averageResponseTime = this.traceStats.totalResponseTime / this.traceStats.requests;
        
        this.logger.info('Gateway request successful', {
          requestId,
          endpoint: mappedEndpoint,
          attempt,
          responseTime,
          statusCode: response.status,
          responseSize: JSON.stringify(finalResult).length
        });
        
        return finalResult;
      } catch (err) {
        lastError = err;
        const responseTime = Date.now() - startTime;
        
        this.logger.error('Gateway request failed', {
          requestId,
          endpoint: mappedEndpoint,
          attempt,
          error: err.message,
          responseTime,
          errorType: err.name
        });
        
        if (attempt < this.config.retryAttempts) {
          const delayTime = this.config.retryDelay * attempt;
          this.logger.trace(`Retrying in ${delayTime}ms`, {
            requestId,
            attempt,
            nextAttempt: attempt + 1
          });
          await this.delay(delayTime);
        }
      }
    }
    
    // Final failure
    this.traceStats.failures++;
    this.logger.error('All retry attempts failed', {
      requestId,
      endpoint: mappedEndpoint,
      totalAttempts: this.config.retryAttempts,
      finalError: lastError.message
    });
    
    throw lastError;
  }

  /**
   * TRACER BULLET: Analyze text through guard services
   */
  async analyzeText(text, options = {}) {
    const analysisId = this.generateRequestId();
    const startTime = Date.now();
    
    try {
      await this.centralLogger?.info('Starting text analysis', {
        analysis_id: analysisId,
        text_length: text.length,
        options
      });

      // Get enabled guard services
      const enabledGuards = Array.from(this.guardServices.entries())
        .filter(([name, config]) => config.enabled)
        .map(([name, config]) => ({ name, config }));

      if (enabledGuards.length === 0) {
        throw new Error('No guard services enabled');
      }

      // Send analysis request to gateway
      const result = await this.sendToGateway('analyze', {
        analysis_id: analysisId,
        text,
        guards: enabledGuards.map(g => g.name),
        options: {
          ...options,
          pipeline: this.config.analysisPipeline,
          timestamp: new Date().toISOString()
        }
      });

      // Update guard service statistics
      for (const guard of enabledGuards) {
        const guardData = this.guardServices.get(guard.name);
        guardData.lastUsed = new Date().toISOString();
        guardData.successCount++;
      }

      await this.centralLogger?.info('Text analysis completed', {
        analysis_id: analysisId,
        duration: Date.now() - startTime,
        results_count: result.guards?.length || 0
      });

      return result;
    } catch (err) {
      // Update error statistics
      for (const [name, guardData] of this.guardServices.entries()) {
        if (guardData.enabled) {
          guardData.errorCount++;
        }
      }

      await this.centralLogger?.error('Text analysis failed', {
        analysis_id: analysisId,
        duration: Date.now() - startTime,
        error: err.message
      });

      throw err;
    }
  }

  /**
   * TRACER BULLET: Get guard service status
   */
  async getGuardServiceStatus() {
    const status = {
      gateway_connected: await this.testGatewayConnection(),
      guard_services: {},
      total_requests: 0,
      success_rate: 0
    };

    for (const [name, data] of this.guardServices.entries()) {
      status.guard_services[name] = {
        enabled: data.enabled,
        last_used: data.lastUsed,
        success_count: data.successCount,
        error_count: data.errorCount,
        success_rate: data.successCount + data.errorCount > 0 
          ? (data.successCount / (data.successCount + data.errorCount)) * 100 
          : 0
      };
      
      status.total_requests += data.successCount + data.errorCount;
    }

    if (status.total_requests > 0) {
      const totalSuccess = Array.from(this.guardServices.values())
        .reduce((sum, data) => sum + data.successCount, 0);
      status.success_rate = (totalSuccess / status.total_requests) * 100;
    }

    return status;
  }

  /**
   * TRACER BULLET: Test gateway connection
   */
  async testGatewayConnection() {
    try {
      await this.sendToGateway('health', { test: true });
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * TRACER BULLET: Update guard service configuration
   */
  async updateGuardService(guardName, config) {
    const currentConfig = this.guardServices.get(guardName);
    if (!currentConfig) {
      throw new Error(`Guard service '${guardName}' not found`);
    }

    const updatedConfig = { ...currentConfig, ...config };
    this.guardServices.set(guardName, updatedConfig);

    // Save to storage
    await new Promise((resolve) => {
      chrome.storage.sync.set({
        guard_services: Object.fromEntries(this.guardServices)
      }, resolve);
    });

    await this.centralLogger?.info('Guard service updated', {
      guard_name: guardName,
      config: updatedConfig
    });
  }

  /**
   * TRACER BULLET: Get central configuration
   */
  async getCentralConfiguration() {
    return {
      gateway_url: this.config.gatewayUrl,
      api_key_configured: !!this.config.apiKey,
      guard_services: Object.fromEntries(this.guardServices),
      logging_config: this.config.loggingConfig,
      analysis_pipeline: this.config.analysisPipeline
    };
  }

  /**
   * TRACER BULLET: Update central configuration
   */
  async updateCentralConfiguration(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    await new Promise((resolve) => {
      chrome.storage.sync.set({
        gateway_url: this.config.gatewayUrl,
        api_key: this.config.apiKey,
        guard_services: Object.fromEntries(this.guardServices),
        logging_config: this.config.loggingConfig,
        analysis_pipeline: this.config.analysisPipeline
      }, resolve);
    });

    await this.centralLogger?.info('Central configuration updated', newConfig);
  }

  /**
   * TRACER BULLET: Sanitize payload for logging
   */
  sanitizePayload(payload) {
    if (!payload) return payload;
    
    const sanitized = { ...payload };
    
    // Remove sensitive data with bounds checking
    if (sanitized.text && typeof sanitized.text === 'string' && sanitized.text.length > 100) {
      sanitized.text = sanitized.text.substring(0, 100) + '...';
    }
    
    // Remove API keys
    if (sanitized.apiKey) {
      sanitized.apiKey = '***REDACTED***';
    }
    
    return sanitized;
  }

  /**
   * TRACER BULLET: Validate API response data
   */
  validateApiResponse(response, endpoint) {
    const errors = [];
    
    if (!response) {
      errors.push('Response is null or undefined');
      return { isValid: false, errors };
    }
    
    // For mock API testing, we'll transform the response
    if (endpoint === 'analyze') {
      // Transform mock response to expected format
      if (Array.isArray(response)) {
        // Mock API returns array, transform to expected format
        const mockResult = {
          analysis_id: this.generateRequestId(),
          overall_score: Math.random() * 0.8 + 0.1, // Random score between 0.1-0.9
          bias_type: 'mock_analysis',
          confidence: 0.85,
          guards: {
            biasguard: {
              score: Math.random() * 0.8 + 0.1,
              enabled: true,
              threshold: 0.5
            },
            trustguard: {
              score: Math.random() * 0.8 + 0.1,
              enabled: true,
              threshold: 0.7
            }
          },
          suggestions: ['This is a mock analysis result'],
          timestamp: new Date().toISOString()
        };
        return { isValid: true, errors: [], transformedResponse: mockResult };
      }
    }
    
    // For other endpoints, accept any response for testing
    return {
      isValid: true,
      errors: []
    };
  }

  /**
   * TRACER BULLET: Get comprehensive diagnostics
   */
  getDiagnostics() {
    return {
      traceStats: this.getTraceStats(),
      configuration: {
        gatewayUrl: this.config.gatewayUrl,
        timeout: this.config.timeout,
        retryAttempts: this.config.retryAttempts,
        retryDelay: this.config.retryDelay
      },
      guardServices: Array.from(this.guardServices.entries()).map(([name, config]) => ({
        name,
        enabled: config.enabled,
        threshold: config.threshold,
        successCount: config.successCount,
        errorCount: config.errorCount,
        lastUsed: config.lastUsed
      })),
      systemInfo: {
        extensionVersion: chrome.runtime.getManifest().version,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Utility methods
  generateRequestId() {
    return `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use in other modules
window.AIGuardiansGateway = AIGuardiansGateway;
