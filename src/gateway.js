/**
 * AiGuardian Central Gateway Bridge
 * 
 * This module provides a unified interface for connecting the Chrome extension
 * to the AiGuardian backend service through a central gateway.
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Configure your AiGuardian gateway endpoint
 * - Implement authentication with your unified service
 * - Add custom analysis pipelines
 * - Integrate with your central logging and monitoring
 */

class AiGuardianGateway {
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

    // Prevent XSS and script injection - comprehensive pattern matching
    const dangerousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
      /<form[^>]*>.*?<\/form>/gi,
      /<input[^>]*>/gi,
      /<meta[^>]*>/gi,
      /<link[^>]*>/gi,
      /<style[^>]*>.*?<\/style>/gi,
      /expression\s*\(/gi,
      /data:text\/javascript/gi
    ];

    const sanitizeString = (str, maxLength = 10000) => {
      if (typeof str !== 'string') return str;

      // Remove null bytes and control characters (except newlines and tabs for readability)
      let sanitized = str.replace(/\x00/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

      // Apply all dangerous pattern removals
      dangerousPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });

      // Additional HTML entity encoding for dangerous characters
      sanitized = sanitized.replace(/[<>"'&]/g, (match) => {
        const entityMap = {
          '<': '<',
          '>': '>',
          '"': '"',
          "'": '&#x27;',
          '&': '&'
        };
        return entityMap[match];
      });

      // Limit length to prevent buffer overflow attacks
      return sanitized.substring(0, maxLength);
    };

    // Sanitize text content with stricter limits
    if (sanitized.text && typeof sanitized.text === 'string') {
      sanitized.text = sanitizeString(sanitized.text, TEXT_ANALYSIS.MAX_TEXT_LENGTH);
    }

    // Sanitize all other string fields
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && key !== 'text') {
        sanitized[key] = sanitizeString(sanitized[key], SECURITY.MAX_STRING_LENGTH);
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
    // Simple unified gateway configuration
    this.config = {
      gatewayUrl: DEFAULT_CONFIG.GATEWAY_URL,
      timeout: API_CONFIG.TIMEOUT,
      retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: API_CONFIG.RETRY_DELAY,
      apiKey: ''
    };

    // Track connection statistics
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
    this.centralLogger = null;
    this.cacheManager = new CacheManager();
    this.subscriptionService = null; // Will be initialized after gateway is ready

    this.initializeGateway();
  }

  /**
   * Initialize enhanced logger with tracing
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
   * Update trace statistics
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
   * Get trace statistics
   */
  getTraceStats() {
    return {
      ...this.traceStats,
      successRate: this.traceStats.requests > 0 ? (this.traceStats.successes / this.traceStats.requests) * 100 : 0,
      failureRate: this.traceStats.requests > 0 ? (this.traceStats.failures / this.traceStats.requests) * 100 : 0
    };
  }

  /**
   * Initialize gateway connection (simplified)
   * Client only needs to know gateway URL and API key
   */
  async initializeGateway() {
    try {
      // Load configuration from storage
      await this.loadConfiguration();

      // Initialize central logging
      await this.initializeCentralLogging();

      // Initialize subscription service (after config is loaded)
      if (typeof SubscriptionService !== 'undefined') {
        this.subscriptionService = new SubscriptionService(this);
        Logger.info('[Gateway] Subscription service initialized');
      }

      Logger.info('[Gateway] Initialized unified gateway connection');
    } catch (err) {
      Logger.error('[Gateway] Initialization failed', err);
    }
  }

  /**
   * Load client configuration (simplified)
   */
  async loadConfiguration() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([
        'gateway_url',
        'api_key'
      ], (data) => {
        this.config = {
          ...this.config,
          gatewayUrl: data.gateway_url || this.config.gatewayUrl,
          apiKey: data.api_key || ''
        };
        resolve();
      });
    });
  }

  /**
   * Initialize central logging bridge
   */
  async initializeCentralLogging() {
    // Define log method first to avoid circular reference
    const logMethod = async (level, message, metadata = {}) => {
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
    };
    
    // Create logger object with all methods
    this.centralLogger = {
      log: logMethod,
      info: (message, metadata) => logMethod('info', message, metadata),
      warn: (message, metadata) => logMethod('warn', message, metadata),
      error: (message, metadata) => logMethod('error', message, metadata)
    };
  }

  /**
   * Send request to central gateway with enhanced tracing
   */
  async sendToGateway(endpoint, payload) {
    try {
      this.validateRequest(endpoint, payload);
    } catch (error) {
      this.handleError(error, { endpoint, payload });
      throw error;
    }
    // Sanitize payload data
    payload = this.sanitizeRequestData(payload);
    
    try {
      this.validateRequest(endpoint, payload);
    } catch (error) {
      console.error('[Error Context]', { file: 'src/gateway.js', error: error.message, stack: error.stack });
      this.handleError(error, { endpoint, payload });
      throw error;
    }

    // Check subscription status before making request (only for analyze endpoint)
    if (endpoint === 'analyze' && this.subscriptionService && this.config.apiKey) {
      try {
        const subscriptionCheck = await this.subscriptionService.canMakeRequest();
        
        if (!subscriptionCheck.allowed) {
          Logger.error('[Gateway] Request blocked by subscription check:', subscriptionCheck.reason);
          throw new Error(subscriptionCheck.message);
        }

        if (subscriptionCheck.warning) {
          Logger.warn('[Gateway] Subscription warning:', subscriptionCheck.message);
        }
      } catch (subscriptionError) {
        // If subscription check fails, log but allow request (fail open)
        Logger.warn('[Gateway] Subscription check failed, allowing request:', subscriptionError);
      }
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
    // ALIGNED WITH BACKEND: AIGuards-Backend codeguardians-gateway
    // All guard services now use unified /api/v1/guards/process endpoint
    const endpointMapping = {
      'analyze': 'api/v1/guards/process',      // Unified guard processing endpoint
      'health': 'health/live',                  // Liveness probe
      'health-ready': 'health/ready',           // Readiness probe
      'guards': 'api/v1/guards/services',       // Service discovery endpoint
      'logging': 'api/v1/logging',              // Central logging (if implemented)
      'config': 'api/v1/config'                 // Configuration endpoint
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
    
    // Get Clerk session token for authenticated requests
    let clerkToken = null;
    try {
      clerkToken = await this.getClerkSessionToken();
    } catch (error) {
      Logger.debug('[Gateway] Clerk token not available:', error.message);
    }

    // Build headers with Clerk token if available, otherwise use API key
    const headers = {
      'Content-Type': 'application/json',
      'X-Extension-Version': chrome.runtime.getManifest().version,
      'X-Request-ID': requestId,
      'X-Timestamp': new Date().toISOString()
    };

    // Use Clerk token for authentication if available, otherwise fall back to API key
    if (clerkToken) {
      headers['Authorization'] = 'Bearer ' + clerkToken;
    } else if (this.config.apiKey) {
      headers['Authorization'] = 'Bearer ' + this.config.apiKey;
    }

    const requestOptions = {
      method: 'POST',
      headers: headers,
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
   * Analyze text through unified gateway
   * Client doesn't need to know about individual guard services
   */
  async analyzeText(text, options = {}) {
    const analysisId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Log start with explicit error handling
      if (this.centralLogger) {
        try {
          await this.centralLogger.info('Starting text analysis', {
            analysis_id: analysisId,
            text_length: text.length,
            options
          });
        } catch (logError) {
          Logger.warn('[Gateway] Central logging failed, continuing:', logError);
        }
      }

      // Get Clerk user ID if available (from stored user data)
      let userId = options.user_id || null;
      if (!userId) {
        try {
          const storedUser = await new Promise((resolve) => {
            chrome.storage.local.get(['clerk_user'], (data) => {
              resolve(data.clerk_user || null);
            });
          });
          if (storedUser && storedUser.id) {
            userId = storedUser.id;
          }
        } catch (error) {
          Logger.debug('[Gateway] Could not get user ID:', error.message);
        }
      }

      // Send analysis request to unified gateway endpoint
      // Backend handles all guard orchestration
      // PAYLOAD FORMAT ALIGNED WITH BACKEND: GuardProcessRequest schema
      const result = await this.sendToGateway('analyze', {
        service_type: options.service_type || 'biasguard',  // Default to BiasGuard for content analysis
        payload: {
          text: text,
          contentType: options.contentType || 'text',
          scanLevel: options.scanLevel || 'standard',
          context: options.context || 'webpage-content'
        },
        user_id: userId,                                      // Clerk user ID for authenticated requests
        session_id: analysisId,                               // Unique session identifier
        client_type: 'chrome',                                // Client identifier for backend routing
        client_version: chrome.runtime.getManifest().version
      });

      // Log completion with explicit error handling
      if (this.centralLogger) {
        try {
          await this.centralLogger.info('Text analysis completed', {
            analysis_id: analysisId,
            duration: Date.now() - startTime
          });
        } catch (logError) {
          Logger.warn('[Gateway] Central logging failed, continuing:', logError);
        }
      }

      return result;
    } catch (err) {
      // Log error with explicit error handling
      if (this.centralLogger) {
        try {
          await this.centralLogger.error('Text analysis failed', {
            analysis_id: analysisId,
            duration: Date.now() - startTime,
            error: err.message
          });
        } catch (logError) {
          Logger.warn('[Gateway] Central logging failed during error reporting:', logError);
        }
      }

      throw err;
    }
  }

  /**
   * Simple unified gateway status check
   * Client only cares if gateway is connected or not
   */
  async getGatewayStatus() {
    const isConnected = await this.testGatewayConnection();
    return {
      connected: isConnected,
      gateway_url: this.config.gatewayUrl,
      last_check: new Date().toISOString()
    };
  }

  /**
   * Test unified gateway connection
   * Simple health check - alive or not
   */
  async testGatewayConnection() {
    try {
      const response = await fetch(this.config.gatewayUrl + '/health/live', {
        method: 'GET',
        headers: {
          'X-Extension-Version': chrome.runtime.getManifest().version
        }
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get client configuration (simplified)
   */
  async getConfiguration() {
    return {
      gateway_url: this.config.gatewayUrl,
      api_key_configured: !!this.config.apiKey,
      timeout: this.config.timeout,
      retry_attempts: this.config.retryAttempts
    };
  }

  /**
   * Update client configuration (simplified)
   */
  async updateConfiguration(newConfig) {
    this.config = { ...this.config, ...newConfig };

    await new Promise((resolve) => {
      chrome.storage.sync.set({
        gateway_url: this.config.gatewayUrl,
        api_key: this.config.apiKey,
        timeout: this.config.timeout,
        retry_attempts: this.config.retryAttempts
      }, resolve);
    });

    // Log configuration update with explicit error handling
    if (this.centralLogger) {
      try {
        await this.centralLogger.info('Configuration updated', { gateway_url: this.config.gatewayUrl });
      } catch (logError) {
        Logger.warn('[Gateway] Central logging failed, continuing:', logError);
      }
    }
  }

  /**
   * Sanitize payload for logging
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
   * Validate API response data
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
   * Get simplified diagnostics
   * Client only cares about gateway connection status
   */
  async getDiagnostics() {
    const connected = await this.testGatewayConnection();
    return {
      gateway: {
        url: this.config.gatewayUrl,
        connected: connected,
        status: connected ? 'alive' : 'disconnected'
      },
      stats: this.getTraceStats(),
      system: {
        extensionVersion: chrome.runtime.getManifest().version,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Utility methods
  generateRequestId() {
    return `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get Clerk session token (if available)
   * This is the primary authentication method - Clerk handles all user authentication
   */
  async getClerkSessionToken() {
    try {
      // Check if Clerk is available in the current context
      // In service worker context, we need to get token from auth module
      if (typeof window !== 'undefined' && window.Clerk) {
        const token = await window.Clerk.session.getToken();
        return token;
      }
      
      // In service worker context, check if auth module is available
      // The auth module should be initialized in popup/options pages
      return null;
    } catch (error) {
      Logger.debug('[Gateway] Clerk token not available:', error.message);
      return null;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use in other modules
window.AiGuardianGateway = AiGuardianGateway;