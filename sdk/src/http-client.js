/**
 * AiGuardian SDK - HTTP Client
 *
 * Handles all HTTP communication with the AiGuardian API including
 * authentication, retries, and error handling.
 */

import { HTTP_STATUS, ERROR_CODES } from './constants.js';

/**
 * HTTP client for API communication
 */
export class HttpClient {
  /**
   * Creates a new HTTP client
   * @param {ConfigManager} config - Configuration manager
   * @param {Logger} logger - Logger instance
   * @param {Tracer} tracer - Tracer instance
   */
  constructor(config, logger, tracer) {
    this.config = config;
    this.logger = logger;
    this.tracer = tracer;
  }

  /**
   * Makes an HTTP request to the API
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {Object} data - Request data
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  async request(endpoint, data = {}, options = {}) {
    const traceId = this.tracer.startTrace('http_request', { endpoint });
    const startTime = Date.now();

    try {
      const url = this.buildUrl(endpoint);
      const requestOptions = this.buildRequestOptions(data, options);

      this.logger.debug('Making HTTP request', {
        traceId,
        url,
        method: requestOptions.method,
        hasData: !!data
      });

      let lastError;
      let response;

      // Retry logic
      for (let attempt = 1; attempt <= this.config.get('retryAttempts'); attempt++) {
        try {
          this.tracer.recordEvent(traceId, 'request_attempt', { attempt });

          response = await fetch(url, requestOptions);

          // Check for successful response
          if (response.ok) {
            const result = await this.parseResponse(response);

            this.logger.info('HTTP request successful', {
              traceId,
              endpoint,
              attempt,
              statusCode: response.status,
              responseTime: Date.now() - startTime
            });

            this.tracer.addMetric('http_request_success');
            return result;
          }

          // Handle error responses
          const errorData = await this.parseErrorResponse(response);
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          lastError.code = ERROR_CODES.NETWORK_ERROR;
          lastError.statusCode = response.status;
          lastError.details = errorData;

          // Don't retry on client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            break;
          }

        } catch (error) {
          lastError = error;
          this.logger.warn('HTTP request attempt failed', {
            traceId,
            attempt,
            error: error.message
          });
        }

        // Wait before retry (except on last attempt)
        if (attempt < this.config.get('retryAttempts')) {
          const delay = this.config.get('retryDelay') * attempt;
          await this.delay(delay);
        }
      }

      // All attempts failed
      this.logger.error('HTTP request failed after all retries', {
        traceId,
        endpoint,
        totalAttempts: this.config.get('retryAttempts'),
        finalError: lastError.message
      });

      this.tracer.addMetric('http_request_failed');
      throw lastError;

    } catch (error) {
      // Handle network-level errors
      if (!error.code) {
        error.code = ERROR_CODES.NETWORK_ERROR;
      }

      this.logger.error('HTTP request error', {
        traceId,
        endpoint,
        error: error.message,
        code: error.code
      });

      throw error;

    } finally {
      this.tracer.endTrace('http_request', traceId, {
        responseTime: Date.now() - startTime
      });
    }
  }

  /**
   * Builds the full URL for the request
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL
   */
  buildUrl(endpoint) {
    const baseUrl = this.config.get('baseUrl');
    const cleanBaseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove leading slash

    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  /**
   * Create abort signal with timeout (Node.js 16+ compatible)
   * Falls back to AbortController if AbortSignal.timeout is not available
   * @param {number} timeoutMs - Timeout in milliseconds
   * @returns {AbortSignal} Abort signal for fetch request
   */
  createTimeoutSignal(timeoutMs) {
    // Use AbortSignal.timeout if available (Node.js 17.3+)
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      return AbortSignal.timeout(timeoutMs);
    }
    
    // Fallback for Node.js 16.x using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
    
    // Clean up timeout if signal is aborted early
    const signal = controller.signal;
    if (signal.addEventListener) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
      });
    }
    
    return signal;
  }

  /**
   * Builds request options for fetch
   * @param {Object} data - Request data
   * @param {Object} options - Additional options
   * @returns {Object} Fetch options
   */
  buildRequestOptions(data, options) {
    const method = options.method || 'POST';
    const timeout = this.config.get('timeout');

    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-SDK-Version': '1.0.0',
        'X-Request-ID': this.generateRequestId(),
        ...options.headers
      },
      signal: this.createTimeoutSignal(timeout)
    };

    // Add API key if available
    const apiKey = this.config.get('apiKey');
    if (apiKey) {
      requestOptions.headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Add body for non-GET requests
    if (method !== 'GET' && data && Object.keys(data).length > 0) {
      requestOptions.body = JSON.stringify(data);
    }

    return requestOptions;
  }

  /**
   * Parses successful response
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} Parsed response data
   */
  async parseResponse(response) {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      return { data: text, contentType };
    }
  }

  /**
   * Parses error response
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} Parsed error data
   */
  async parseErrorResponse(response) {
    try {
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        return { message: text };
      }
    } catch (error) {
      return { message: response.statusText || 'Unknown error' };
    }
  }

  /**
   * Generates a unique request ID
   * @returns {string} Request ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delays execution for retry logic
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
