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
      /data:text\/javascript/gi,
    ];

    const sanitizeString = (str, maxLength = 10000) => {
      if (typeof str !== 'string') {return str;}

      // Remove null bytes and control characters (except newlines and tabs for readability)
      // SAFETY: Control character regex needed for security sanitization
      // eslint-disable-next-line no-control-regex
      let sanitized = str.replace(/\x00/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

      // Apply all dangerous pattern removals
      dangerousPatterns.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, '');
      });

      // Additional HTML entity encoding for dangerous characters
      // SAFETY: & must be escaped FIRST to prevent double-escaping
      sanitized = sanitized.replace(/[&<>"'`]/g, (match) => {
        const entityMap = {
          '&': '&amp;', // FIRST - prevents double-escaping
          '<': '<',
          '>': '>',
          '"': '"',
          "'": '&#x27;',
          '`': '&#x60;',
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
    Object.keys(sanitized).forEach((key) => {
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
        // Check for nested payload structure: payload.payload.text
        if (!payload.payload || typeof payload.payload !== 'object') {
          throw new Error('Invalid payload: payload field must be an object');
        }
        if (!payload.payload.text || typeof payload.payload.text !== 'string') {
          throw new Error('Invalid payload: text field is required in payload');
        }
        if (payload.payload.text.length > TEXT_ANALYSIS.MAX_TEXT_LENGTH) {
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
      extensionVersion: chrome.runtime.getManifest().version,
    };

    // Log error securely (without sensitive data)
    Logger.error('[Gateway] Error occurred:', {
      message: error.message,
      context: context,
      timestamp: errorInfo.timestamp,
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
    // SAFETY: Track initialization state
    this.isInitialized = false;
    this._initializing = false;
    this._initializationError = null; // SAFETY: Track initialization errors

    // Simple unified gateway configuration
    this.config = {
      gatewayUrl: DEFAULT_CONFIG.GATEWAY_URL,
      timeout: API_CONFIG.TIMEOUT,
      retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: API_CONFIG.RETRY_DELAY,
      apiKey: '',
    };

    // Track connection statistics
    this.traceStats = {
      requests: 0,
      successes: 0,
      failures: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      lastRequestTime: null,
      errorCounts: {},
    };

    this.logger = this.initializeLogger();
    this.centralLogger = null;
    this.cacheManager = new CacheManager();
    this.subscriptionService = null; // Will be initialized after gateway is ready

    // EPISTEMIC: Circuit breaker for resilience (fail-fast on backend outages)
    if (typeof CircuitBreaker !== 'undefined') {
      this.circuitBreaker = new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 60000, // 1 minute cooldown
        timeout: API_CONFIG.TIMEOUT,
      });
      Logger.info('[Gateway] Circuit breaker initialized');
    } else {
      Logger.warn('[Gateway] CircuitBreaker not available - resilience reduced');
      this.circuitBreaker = null;
    }

    this.initializeGateway();
  }

  /**
   * Initialize enhanced logger with tracing
   */
  initializeLogger() {
    return {
      info: (message, metadata = {}) => {
        this.secureLog('info', message, metadata);
        this.updateTraceStats('info', message, metadata);
      },
      warn: (message, metadata = {}) => {
        this.secureLog('warn', message, metadata);
        this.updateTraceStats('warn', message, metadata);
      },
      error: (message, metadata = {}) => {
        this.secureLog('error', message, metadata);
        this.updateTraceStats('error', message, metadata);
      },
      trace: (message, metadata = {}) => {
        Logger.info(`[Gateway-TRACE] ${message}`, metadata);
        this.updateTraceStats('trace', message, metadata);
      },
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
      this.traceStats.averageResponseTime =
        this.traceStats.totalResponseTime / this.traceStats.requests;
    }
  }

  /**
   * Get trace statistics
   */
  getTraceStats() {
    return {
      ...this.traceStats,
      successRate:
        this.traceStats.requests > 0
          ? (this.traceStats.successes / this.traceStats.requests) * 100
          : 0,
      failureRate:
        this.traceStats.requests > 0
          ? (this.traceStats.failures / this.traceStats.requests) * 100
          : 0,
    };
  }

  /**
   * Initialize gateway connection (simplified)
   * Client only needs to know gateway URL and API key
   * SAFETY: Properly handles and reports initialization failures
   */
  async initializeGateway() {
    // Prevent concurrent initialization
    if (this._initializing) {
      // Wait for ongoing initialization to complete
      while (this._initializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    if (this.isInitialized) {
      return; // Already initialized
    }

    this._initializing = true;
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

      // VERIFY: Ensure critical components initialized
      if (!this.config || !this.config.gatewayUrl) {
        throw new Error('Gateway configuration missing after initialization');
      }

      this.isInitialized = true;
      this._initializationError = null;
      Logger.info('[Gateway] Initialized unified gateway connection');
    } catch (err) {
      Logger.error('[Gateway] Initialization failed', {
        error: err.message,
        stack: err.stack,
      });
      this.isInitialized = false;
      this._initializationError = err;
      throw err; // Re-throw to allow caller to handle
    } finally {
      this._initializing = false;
    }
  }

  /**
   * Load client configuration (simplified)
   */
  async loadConfiguration() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['gateway_url', 'api_key'], (data) => {
        this.config = {
          ...this.config,
          gatewayUrl: data.gateway_url || this.config.gatewayUrl,
          apiKey: data.api_key || '',
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
            user_agent: navigator.userAgent,
          },
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
      error: (message, metadata) => logMethod('error', message, metadata),
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
    // Sanitize payload data (after validation - sanitization should only make data safer, not invalid)
    payload = this.sanitizeRequestData(payload);

    // Get Clerk session token for authenticated requests (user-based auth only)
    // This is retrieved once and used for both subscription check and API request
    let clerkToken = null;
    try {
      clerkToken = await this.getClerkSessionToken();
    } catch (error) {
      Logger.warn('[Gateway] Clerk token not available:', error.message);
    }

    // Check subscription status before making request (only for analyze endpoint)
    // Only check if user is authenticated via Clerk (has session token)
    if (endpoint === 'analyze' && this.subscriptionService && clerkToken) {
      try {
        const subscriptionCheck = await this.subscriptionService.canMakeRequest();

        if (!subscriptionCheck.allowed) {
          Logger.error(
            '[Gateway] Request blocked by subscription check:',
            subscriptionCheck.reason
          );
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
      analyze: 'api/v1/guards/process', // Unified guard processing endpoint
      health: 'health/live', // Liveness probe
      'health-ready': 'health/ready', // Readiness probe
      guards: 'api/v1/guards/services', // Service discovery endpoint
      logging: 'api/v1/logging', // Central logging (if implemented)
      config: 'api/v1/config/config', // Configuration endpoint (public config)
    };

    const mappedEndpoint = endpointMapping[endpoint] || endpoint;
    const url = this.config.gatewayUrl + '/' + mappedEndpoint;

    this.traceStats.requests++;

    this.logger.trace('Sending request to gateway', {
      requestId,
      endpoint: mappedEndpoint,
      url,
      payload: this.sanitizePayload(payload),
    });

    // Clerk token already retrieved above - reuse it here

    // Build headers - ONLY use Clerk user authentication tokens
    const headers = {
      'Content-Type': 'application/json',
      'X-Extension-Version': chrome.runtime.getManifest().version,
      'X-Request-ID': requestId,
      'X-Timestamp': new Date().toISOString(),
    };

    // Use Clerk session token for authentication (user-based auth only)
    // NO API key fallback - all requests must be authenticated via Clerk user session
    if (clerkToken) {
      headers['Authorization'] = 'Bearer ' + clerkToken;
      // Log token status (without exposing full token)
      const tokenPreview =
        clerkToken.substring(0, 20) + '...' + clerkToken.substring(clerkToken.length - 10);
      Logger.info('[Gateway] Adding Authorization header with Clerk token', {
        tokenLength: clerkToken.length,
        tokenPreview: tokenPreview,
        hasBearer: true,
      });
    } else {
      // If no Clerk token, request will fail with 401 - user must sign in
      Logger.warn('[Gateway] No Clerk session token available - user must authenticate');
    }

    // Log request details for debugging (sanitized)
    Logger.info('[Gateway] Request details', {
      url: url,
      method: 'POST',
      headers: {
        'Content-Type': headers['Content-Type'],
        'X-Extension-Version': headers['X-Extension-Version'],
        'X-Request-ID': headers['X-Request-ID'],
        Authorization: clerkToken ? 'Bearer [REDACTED]' : 'NOT SET',
        'X-Timestamp': headers['X-Timestamp'],
      },
      payloadSize: JSON.stringify(payload).length,
      hasToken: !!clerkToken,
    });

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    };

    // EPISTEMIC: Wrap fetch in circuit breaker for resilience
    const executeRequest = async () => {
      let lastError;
      for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
        try {
          this.logger.trace(`Attempt ${attempt}/${this.config.retryAttempts}`, {
            requestId,
            endpoint: mappedEndpoint,
            attempt,
          });
          const response = await fetch(url, requestOptions);
          const responseTime = Date.now() - startTime;

          if (!response.ok) {
            // EPISTEMIC: Handle 401 with automatic token refresh
            if (response.status === 401 && clerkToken && attempt < this.config.retryAttempts) {
              try {
                // Try to refresh token
                const newToken = await this.refreshClerkToken();
                if (newToken && newToken !== clerkToken) {
                  // Token was refreshed - retry request with new token
                  Logger.info('[Gateway] Token refreshed, retrying request with new token', {
                    requestId,
                    endpoint: mappedEndpoint,
                    attempt,
                  });

                  // Update headers with new token
                  const newHeaders = { ...headers, Authorization: 'Bearer ' + newToken };
                  const newRequestOptions = { ...requestOptions, headers: newHeaders };

                  // Retry request with new token (don't increment attempt counter)
                  const retryResponse = await fetch(url, newRequestOptions);
                  if (retryResponse.ok) {
                    const result = await retryResponse.json();
                    const validationResult = this.validateApiResponse(result, endpoint);
                    const finalResult = validationResult.transformedResponse || result;
                    this.traceStats.successes++;
                    this.traceStats.totalResponseTime += Date.now() - startTime;
                    this.traceStats.averageResponseTime =
                      this.traceStats.totalResponseTime / this.traceStats.requests;
                    return finalResult;
                  }
                  // If retry still fails, continue with error handling below
                } else {
                  Logger.debug(
                    '[Gateway] Token refresh returned same token or failed, continuing with error handling'
                  );
                }
              } catch (refreshError) {
                Logger.warn(
                  '[Gateway] Token refresh failed, continuing with error handling:',
                  refreshError
                );
              }
            }

            // EPISTEMIC: Handle 403 Forbidden explicitly with enhanced messaging
            if (response.status === 403) {
              Logger.error('[Gateway] 403 Forbidden - Authentication/Authorization failed', {
                requestId,
                endpoint: mappedEndpoint,
                url,
                hasToken: !!clerkToken,
              });

              // Try to get more context from response body
              let errorDetail = 'Access denied.';
              try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                  const errorData = await response.json();
                  errorDetail =
                    errorData?.detail || errorData?.error || errorData?.message || errorDetail;
                }
              } catch (e) {
                // If parsing fails, use default message
              }

              const errorResponse = {
                success: false,
                error:
                  errorDetail || 'Access denied. Please check your authentication and try again.',
                status: 403,
                requiresAuth: true,
                requestId,
                endpoint: mappedEndpoint,
                suggestion: clerkToken
                  ? 'Your session may have expired. Please refresh the page and try again.'
                  : 'Please sign in to continue.',
              };

              if (endpoint === 'analyze') {
                return errorResponse;
              }
              throw new Error(errorResponse.error);
            }

            // Try to parse JSON error response first
            let errorData = null;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              try {
                errorData = await response.json();
              } catch (e) {
                // If JSON parsing fails, fall back to text
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
              }
            } else {
              const errorText = await response.text();
              throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            // Create error response object that will be properly handled
            const errorResponse = {
              success: false,
              error:
                errorData?.detail ||
                errorData?.error ||
                errorData?.message ||
                `HTTP ${response.status}: ${response.statusText}`,
              status: response.status,
              ...errorData,
            };

            // For analyze endpoint, return error response structure instead of throwing
            // This allows the caller to handle it gracefully
            if (endpoint === 'analyze') {
              return errorResponse;
            }

            // For other endpoints, throw error
            throw new Error(errorResponse.error);
          }

          const result = await response.json();

          // Validate response data
          const validationResult = this.validateApiResponse(result, endpoint);
          if (!validationResult.isValid) {
            this.logger.warn('API response validation failed', {
              requestId,
              endpoint: mappedEndpoint,
              validationErrors: validationResult.errors,
            });
          }

          // Use transformed response if available (for mock API)
          // If validation failed but we have a transformed response, use it
          // Otherwise use the original result
          const finalResult = validationResult.transformedResponse || result;

          // Update trace stats only if result is successful
          const isSuccess = finalResult && finalResult.success !== false && !finalResult.error;
          if (isSuccess) {
            this.traceStats.successes++;
            this.traceStats.totalResponseTime += responseTime;
            this.traceStats.averageResponseTime =
              this.traceStats.totalResponseTime / this.traceStats.requests;

            this.logger.info('Gateway request successful', {
              requestId,
              endpoint: mappedEndpoint,
              attempt,
              responseTime,
              statusCode: response.status,
              responseSize: JSON.stringify(finalResult).length,
            });
          } else {
            // Log warning for unsuccessful responses
            this.logger.warn('Gateway request returned error response', {
              requestId,
              endpoint: mappedEndpoint,
              attempt,
              responseTime,
              statusCode: response.status,
              error: finalResult?.error,
            });
          }

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
            errorType: err.name,
          });

          if (attempt < this.config.retryAttempts) {
            const delayTime = this.config.retryDelay * attempt;
            this.logger.trace(`Retrying in ${delayTime}ms`, {
              requestId,
              attempt,
              nextAttempt: attempt + 1,
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
        finalError: lastError.message,
      });

      throw lastError;
    };

    // Execute with circuit breaker if available
    if (this.circuitBreaker) {
      try {
        return await this.circuitBreaker.execute(executeRequest, {
          requestId,
          endpoint: mappedEndpoint,
          url,
        });
      } catch (error) {
        // Circuit breaker error (OPEN state)
        if (error.message.includes('Circuit breaker is OPEN')) {
          this.traceStats.failures++;
          throw error;
        }
        // Re-throw other errors
        throw error;
      }
    } else {
      // Fallback to direct execution if circuit breaker not available
      return await executeRequest();
    }
  }

  /**
   * Analyze text through unified gateway
   * Client doesn't need to know about individual guard services
   * SAFETY: Validates initialization before processing
   */
  async analyzeText(text, options = {}) {
    // SAFETY: Check if gateway initialized successfully
    if (!this.isInitialized) {
      if (this._initializationError) {
        throw new Error(`Gateway not initialized: ${this._initializationError.message}`);
      }
      // Try to initialize if not already initializing
      if (!this._initializing) {
        try {
          await this.initializeGateway();
        } catch (initErr) {
          throw new Error(`Gateway initialization failed: ${initErr.message}`);
        }
      } else {
        // Wait for ongoing initialization
        await this.waitForInitialization();
      }
    }

    const analysisId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Log start with explicit error handling
      if (this.centralLogger) {
        try {
          await this.centralLogger.info('Starting text analysis', {
            analysis_id: analysisId,
            text_length: text.length,
            options,
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
          // User ID not critical for request - silently continue
        }
      }

      // Send analysis request to unified gateway endpoint
      // Backend handles all guard orchestration
      // PAYLOAD FORMAT ALIGNED WITH BACKEND: GuardProcessRequest schema
      const result = await this.sendToGateway('analyze', {
        service_type: options.service_type || 'biasguard', // Default to BiasGuard for content analysis
        payload: {
          text: text,
          contentType: options.contentType || 'text',
          scanLevel: options.scanLevel || 'standard',
          context: options.context || 'webpage-content',
        },
        user_id: userId, // Clerk user ID for authenticated requests
        session_id: analysisId, // Unique session identifier
        client_type: 'chrome', // Client identifier for backend routing
        client_version: chrome.runtime.getManifest().version,
      });

      // Log completion with explicit error handling
      if (this.centralLogger) {
        try {
          await this.centralLogger.info('Text analysis completed', {
            analysis_id: analysisId,
            duration: Date.now() - startTime,
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
            error: err.message,
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
      last_check: new Date().toISOString(),
    };
  }

  /**
   * SAFETY: Wait for gateway initialization to complete
   * Useful for ensuring gateway is ready before use
   */
  async waitForInitialization(timeout = 5000) {
    const start = Date.now();
    while (!this.isInitialized && Date.now() - start < timeout) {
      if (!this._initializing) {
        // Not initializing and not initialized - try to initialize
        try {
          await this.initializeGateway();
          break;
        } catch (err) {
          throw new Error(
            `Gateway initialization timeout after ${timeout}ms. Error: ${err.message}`
          );
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!this.isInitialized) {
      throw new Error(
        `Gateway initialization timeout after ${timeout}ms. Error: ${this._initializationError?.message || 'Unknown'}`
      );
    }
    return true;
  }

  /**
   * SAFETY: Get comprehensive health check including initialization status
   */
  async healthCheck() {
    return {
      initialized: this.isInitialized,
      initializationError: this._initializationError?.message || null,
      gatewayConnected: await this.testGatewayConnection(),
      gatewayUrl: this.config?.gatewayUrl || 'not configured',
      traceStats: this.getTraceStats(),
      subscriptionService: this.subscriptionService ? 'available' : 'not initialized',
    };
  }

  /**
   * Test unified gateway connection
   * Simple health check - alive or not
   * Includes timeout handling and better error reporting
   */
  async testGatewayConnection() {
    const timeout = 5000; // 5 second timeout
    const healthUrl = this.config.gatewayUrl + '/health/live';

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'X-Extension-Version': chrome.runtime.getManifest().version,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return true;
      } else {
        Logger.warn('[Gateway] Health check returned non-OK status:', response.status);
        return false;
      }
    } catch (err) {
      // Handle different error types
      if (err.name === 'AbortError') {
        Logger.warn('[Gateway] Health check timed out after', timeout, 'ms');
      } else if (err.message && err.message.includes('Failed to fetch')) {
        Logger.warn('[Gateway] Health check failed - network error:', err.message);
      } else {
        Logger.warn('[Gateway] Health check failed:', err.message || err);
      }
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
      retry_attempts: this.config.retryAttempts,
    };
  }

  /**
   * Update client configuration (simplified)
   * EPISTEMIC: Uses mutex protection to prevent race conditions
   */
  async updateConfiguration(newConfig) {
    this.config = { ...this.config, ...newConfig };

    // EPISTEMIC: Use mutex for storage updates to prevent race conditions
    if (typeof MutexHelper !== 'undefined') {
      await MutexHelper.withLock('config_update', async () => {
        await new Promise((resolve) => {
          chrome.storage.sync.set(
            {
              gateway_url: this.config.gatewayUrl,
              api_key: this.config.apiKey,
              timeout: this.config.timeout,
              retry_attempts: this.config.retryAttempts,
            },
            resolve
          );
        });
      });
    } else {
      await new Promise((resolve) => {
        chrome.storage.sync.set(
          {
            gateway_url: this.config.gatewayUrl,
            api_key: this.config.apiKey,
            timeout: this.config.timeout,
            retry_attempts: this.config.retryAttempts,
          },
          resolve
        );
      });
    }

    // Log configuration update with explicit error handling
    if (this.centralLogger) {
      try {
        await this.centralLogger.info('Configuration updated', {
          gateway_url: this.config.gatewayUrl,
        });
      } catch (logError) {
        Logger.warn('[Gateway] Central logging failed, continuing:', logError);
      }
    }
  }

  /**
   * EPISTEMIC: Check storage quota before writes
   * Prevents silent failures when quota is exceeded
   */
  async checkStorageQuota() {
    return new Promise((resolve) => {
      chrome.storage.local.getBytesInUse(null, (bytes) => {
        const quota = chrome.storage.local.QUOTA_BYTES || 5242880; // 5MB default
        const usagePercent = (bytes / quota) * 100;

        if (usagePercent > 90) {
          Logger.warn('[Gateway] Storage quota nearly exceeded', {
            bytes,
            quota,
            usagePercent: usagePercent.toFixed(2) + '%',
            remainingBytes: quota - bytes,
          });
        }

        resolve({ bytes, quota, usagePercent, remainingBytes: quota - bytes });
      });
    });
  }

  /**
   * Sanitize payload for logging
   */
  sanitizePayload(payload) {
    if (!payload) {return payload;}

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
   * Validate and normalize API response data from the backend.
   *
   * For the analyze endpoint, the backend returns a standard envelope:
   *   { success: boolean, data: { ...guard specific... }, processing_time, ... }
   *
   * The extension UI expects a simpler shape:
   *   { success, score, analysis, raw }
   *
   * This method bridges that gap so callers (service worker/content script)
   * don't need to know backend-specific fields.
   */
  validateApiResponse(response, endpoint) {
    const errors = [];
    let transformedResponse = null;

    if (!response || typeof response !== 'object') {
      errors.push('Response is null, undefined, or not an object');
      return { isValid: false, errors, transformedResponse };
    }

    // Validate response structure based on endpoint
    if (endpoint === 'analyze') {
      // Check if response indicates an error BEFORE transformation
      // Error responses should not be transformed into analysis results
      if (
        response.success === false ||
        response.error ||
        (response.status && response.status >= 400) ||
        (response.detail && typeof response.detail === 'string')
      ) {
        // This is an error response - return it as-is without transformation
        return {
          isValid: false,
          errors: ['API error response'],
          transformedResponse: {
            success: false,
            error: response.error || response.detail || response.message || 'API request failed',
            status: response.status,
            raw: response,
          },
        };
      }

      // Expect backend envelope: { success, data, ... }
      if (typeof response.success !== 'boolean') {
        errors.push('Response missing success boolean');
      }
      // SAFETY: Use Object.prototype.hasOwnProperty to avoid prototype pollution
      if (!Object.prototype.hasOwnProperty.call(response, 'data')) {
        errors.push('Response missing data field');
      }

      const data = response.data || {};

      // Derive a generic score for the UI from common guard fields.
      let score = 0;
      if (typeof data.bias_score === 'number') {
        score = data.bias_score; // BiasGuard
      } else if (typeof data.trust_score === 'number') {
        score = data.trust_score; // TrustGuard
      } else if (typeof data.confidence === 'number') {
        score = data.confidence; // TokenGuard-style confidence
      } else if (typeof data.score === 'number') {
        score = data.score; // Fallback generic score
      }

      // Clamp score into [0, 1] if it looks like a 0-1 value; ignore NaN
      if (typeof score === 'number' && !Number.isNaN(score)) {
        if (score < 0) {score = 0;}
        if (score > 1) {score = 1;}
      } else {
        score = 0;
      }

      transformedResponse = {
        success: !!response.success,
        score,
        // Flatten data into an analysis object but preserve important envelope fields
        analysis: {
          ...data,
          service_type: response.service_type,
          processing_time: response.processing_time,
          metadata: response.metadata,
        },
        // Preserve the full backend response for debugging/advanced use
        raw: response,
      };
    }

    return {
      isValid: errors.length === 0,
      errors,
      transformedResponse,
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
        status: connected ? 'alive' : 'disconnected',
      },
      stats: this.getTraceStats(),
      system: {
        extensionVersion: chrome.runtime.getManifest().version,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Utility methods
  generateRequestId() {
    return `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get Clerk session token (if available)
   * This is the primary authentication method - Clerk handles all user authentication
   *
   * ALWAYS tries to get fresh token from Clerk SDK first (if available)
   * Falls back to stored token only if Clerk SDK is not accessible
   * This ensures we use valid, non-expired tokens
   *
   * In service worker context, retrieves token from chrome.storage.local
   * In popup/options context, gets fresh token from Clerk SDK
   */
  async getClerkSessionToken() {
    const context = typeof window !== 'undefined' ? 'window' : 'service_worker';
    Logger.info(`[Gateway] Getting Clerk token (context: ${context})`);

    try {
      // PRIORITY 1: Try to get fresh token from Clerk SDK (if in window context)
      // This ensures we always use valid, non-expired tokens
      if (typeof window !== 'undefined' && window.Clerk) {
        try {
          const clerk = window.Clerk;
          Logger.info('[Gateway] Clerk SDK available, attempting to get fresh token');

          // Only call load() if it exists
          if (typeof clerk.load === 'function' && !clerk.loaded) {
            Logger.info('[Gateway] Loading Clerk SDK...');
            await clerk.load();
          }

          // Check if user is authenticated
          const user = clerk.user;
          if (user) {
            Logger.info(`[Gateway] User found: ${user.id}`);
            const session = await clerk.session;
            if (session) {
              // Get fresh token from Clerk session
              const token = await session.getToken();
              // Always store fresh token for service worker access
              if (token) {
                // Validate token format (JWT tokens start with eyJ)
                if (this.validateTokenFormat(token)) {
                  await this.storeClerkToken(token);
                  Logger.info('[Gateway] Retrieved fresh Clerk token from SDK (valid format)');
                  return token;
                } else {
                  Logger.warn(
                    '[Gateway] Token from SDK has invalid format, falling back to stored token'
                  );
                }
              } else {
                Logger.warn('[Gateway] No token available from Clerk session');
              }
            } else {
              Logger.warn('[Gateway] No Clerk session found');
            }
          } else {
            Logger.warn('[Gateway] No Clerk user found');
          }
        } catch (e) {
          Logger.warn('[Gateway] Could not get fresh token from Clerk SDK:', e.message);
          // Fall through to stored token
        }
      } else {
        Logger.info('[Gateway] Clerk SDK not available (service worker context or not loaded)');
      }

      // PRIORITY 2: Fall back to stored token (for service worker context)
      // Service workers can't access Clerk SDK directly, so use stored token
      Logger.info('[Gateway] Attempting to retrieve stored token from chrome.storage.local');
      const storedToken = await this.getStoredClerkToken();
      if (storedToken) {
        // Validate stored token format
        if (this.validateTokenFormat(storedToken)) {
          Logger.info('[Gateway] Using stored Clerk token (service worker context)');
          return storedToken;
        } else {
          Logger.error('[Gateway] Stored token has invalid format, clearing it');
          await this.clearStoredClerkToken();
          return null;
        }
      } else {
        Logger.warn('[Gateway] No stored token found in chrome.storage.local');
      }

      Logger.warn('[Gateway] No Clerk token available - user must sign in');
      return null;
    } catch (error) {
      Logger.error('[Gateway] Error getting Clerk token:', error.message);
      return null;
    }
  }

  /**
   * EPISTEMIC: Refresh Clerk session token
   * Used for automatic token refresh on 401 errors
   *
   * Works in both service worker and window contexts:
   * - Window context: Uses Clerk SDK directly
   * - Service worker: Sends message to popup/content script to refresh via Clerk SDK
   *
   * @returns {Promise<string|null>} New token or null if refresh failed
   */
  async refreshClerkToken() {
    try {
      // Try to get fresh token from Clerk SDK (if in window context)
      if (typeof window !== 'undefined' && window.Clerk) {
        const clerk = window.Clerk;
        if (typeof clerk.load === 'function' && !clerk.loaded) {
          await clerk.load();
        }
        const session = await clerk.session;
        if (session) {
          const newToken = await session.getToken();
          if (newToken) {
            await this.storeClerkToken(newToken);
            Logger.info('[Gateway] Token refreshed successfully (window context)');
            return newToken;
          }
        }
      }

      // Service worker context: Request token refresh via message passing
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        try {
          // Send message to popup/content script to refresh token via Clerk SDK
          const response = await new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'REFRESH_CLERK_TOKEN' }, (response) => {
              if (chrome.runtime.lastError) {
                Logger.debug(
                  '[Gateway] Token refresh message failed:',
                  chrome.runtime.lastError.message
                );
                resolve(null);
              } else {
                resolve(response);
              }
            });
          });

          if (response && response.success && response.token) {
            await this.storeClerkToken(response.token);
            Logger.info('[Gateway] Token refreshed successfully (service worker context)');
            return response.token;
          }
        } catch (messageError) {
          Logger.debug('[Gateway] Token refresh via message failed:', messageError);
        }
      }

      // Fallback: return null (user must re-authenticate)
      Logger.warn('[Gateway] Token refresh failed - user must re-authenticate');
      return null;
    } catch (error) {
      Logger.error('[Gateway] Token refresh error:', error);
      return null;
    }
  }

  /**
   * Get stored Clerk token from chrome.storage.local
   */
  async getStoredClerkToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['clerk_token'], (data) => {
        resolve(data.clerk_token || null);
      });
    });
  }

  /**
   * Store Clerk token in chrome.storage.local
   * EPISTEMIC: Uses mutex protection to prevent race conditions
   */
  async storeClerkToken(token) {
    // Use mutex if available, otherwise fallback to direct storage
    if (typeof MutexHelper !== 'undefined') {
      return await MutexHelper.updateStorage('clerk_token', () => token, 'local');
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.set({ clerk_token: token }, resolve);
      });
    }
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export for use in other modules
// Works in both service worker (global scope) and window contexts
if (typeof window !== 'undefined') {
  window.AiGuardianGateway = AiGuardianGateway;
}
// In service worker context, the class is already available globally via importScripts
