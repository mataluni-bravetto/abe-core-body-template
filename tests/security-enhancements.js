/**
 * Security Enhancements for AI Guardians Chrome Extension
 * 
 * This script applies additional security measures to address
 * identified vulnerabilities and improve overall security.
 */

const fs = require('fs');

class SecurityEnhancer {
  constructor() {
    this.enhancements = [];
  }

  /**
   * Apply all security enhancements
   */
  async applySecurityEnhancements() {
    console.log('🔒 Applying Security Enhancements');
    console.log('=' .repeat(60));
    
    const enhancements = [
      { name: 'Add Input Validation', fn: this.addInputValidation },
      { name: 'Enhance Message Validation', fn: this.enhanceMessageValidation },
      { name: 'Add Origin Validation', fn: this.addOriginValidation },
      { name: 'Improve Error Handling', fn: this.improveErrorHandling },
      { name: 'Add Data Encryption', fn: this.addDataEncryption },
      { name: 'Enhance CSP', fn: this.enhanceCSP },
      { name: 'Add Rate Limiting', fn: this.addRateLimiting },
      { name: 'Add Request Validation', fn: this.addRequestValidation }
    ];

    for (const enhancement of enhancements) {
      try {
        console.log(`\n🔧 Applying: ${enhancement.name}`);
        await enhancement.fn.call(this);
        this.enhancements.push({
          name: enhancement.name,
          status: 'APPLIED',
          timestamp: new Date().toISOString()
        });
        console.log(`✅ ${enhancement.name}: APPLIED`);
      } catch (error) {
        this.enhancements.push({
          name: enhancement.name,
          status: 'FAILED',
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.error(`❌ ${enhancement.name}: FAILED - ${error.message}`);
      }
    }

    this.generateEnhancementReport();
  }

  /**
   * Add input validation
   */
  async addInputValidation() {
    // Create input validation utility
    const inputValidationCode = `
/**
 * Input Validation Utilities
 * Provides secure input validation for the extension
 */

class InputValidator {
  /**
   * Validate text input for analysis
   */
  static validateTextInput(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input: must be a non-empty string');
    }
    
    // Check for maximum length
    if (text.length > 10000) {
      throw new Error('Text input too long: maximum 10,000 characters allowed');
    }
    
    // Check for potentially malicious content
    const maliciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi
    ];
    
    for (const pattern of maliciousPatterns) {
      if (pattern.test(text)) {
        throw new Error('Text input contains potentially malicious content');
      }
    }
    
    return text.trim();
  }
  
  /**
   * Validate API key format
   */
  static validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Invalid API key: must be a non-empty string');
    }
    
    // Check for minimum length
    if (apiKey.length < 10) {
      throw new Error('API key too short: minimum 10 characters required');
    }
    
    // Check for maximum length
    if (apiKey.length > 200) {
      throw new Error('API key too long: maximum 200 characters allowed');
    }
    
    // Check for valid characters (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(apiKey)) {
      throw new Error('API key contains invalid characters');
    }
    
    return apiKey.trim();
  }
  
  /**
   * Validate URL
   */
  static validateUrl(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL: must be a non-empty string');
    }
    
    try {
      const parsedUrl = new URL(url);
      
      // Only allow HTTPS URLs
      if (parsedUrl.protocol !== 'https:') {
        throw new Error('Only HTTPS URLs are allowed');
      }
      
      return parsedUrl.toString();
    } catch (error) {
      throw new Error('Invalid URL format');
    }
  }
  
  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }
    
    // Remove all HTML tags
    return html.replace(/<[^>]*>/g, '');
  }
  
  /**
   * Validate numeric input
   */
  static validateNumber(value, min = 0, max = 1) {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      throw new Error('Invalid number input');
    }
    
    if (num < min || num > max) {
      throw new Error(\`Number must be between \${min} and \${max}\`);
    }
    
    return num;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputValidator;
}
`;

    fs.writeFileSync('src/input-validator.js', inputValidationCode);
  }

  /**
   * Enhance message validation
   */
  async enhanceMessageValidation() {
    // Read service_worker.js and add enhanced message validation
    let backgroundContent = fs.readFileSync('src/service_worker.js', 'utf8');
    
    // Add message validation function
    const messageValidationCode = `
  /**
   * TRACER BULLET: Enhanced message validation
   */
  function validateMessage(message, sender) {
    // Validate message structure
    if (!message || typeof message !== 'object') {
      throw new Error('Invalid message: must be an object');
    }
    
    // Validate required fields
    if (!message.type || typeof message.type !== 'string') {
      throw new Error('Invalid message: type field is required');
    }
    
    // Validate sender
    if (!sender || !sender.tab) {
      throw new Error('Invalid sender: tab information required');
    }
    
    // Validate message type
    const allowedTypes = [
      'ANALYZE_TEXT',
      'GET_DIAGNOSTICS',
      'GET_TRACE_STATS',
      'TEST_GATEWAY_CONNECTION',
      'GET_CENTRAL_CONFIG',
      'UPDATE_CENTRAL_CONFIG',
      'GET_GUARD_STATUS',
      'TEST_GUARD_SERVICE'
    ];
    
    if (!allowedTypes.includes(message.type)) {
      throw new Error(\`Invalid message type: \${message.type}\`);
    }
    
    // Validate payload if present
    if (message.payload && typeof message.payload !== 'object') {
      throw new Error('Invalid payload: must be an object');
    }
    
    return true;
  }
`;

    // Insert the validation function before the message listener
    const insertPoint = backgroundContent.indexOf('chrome.runtime.onMessage.addListener');
    if (insertPoint !== -1) {
      backgroundContent = backgroundContent.slice(0, insertPoint) + messageValidationCode + '\n\n  ' + backgroundContent.slice(insertPoint);
    }
    
    // Update message listener to use validation
    backgroundContent = backgroundContent.replace(
      'chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {',
      'chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {\n    try {\n      validateMessage(message, sender);\n    } catch (error) {\n      console.error(\'[BG] Message validation failed:\', error.message);\n      sendResponse({ success: false, error: error.message });\n      return;\n    }'
    );
    
    fs.writeFileSync('src/service_worker.js', backgroundContent);
  }

  /**
   * Add origin validation
   */
  async addOriginValidation() {
    // Read service_worker.js and add origin validation
    let backgroundContent = fs.readFileSync('src/service_worker.js', 'utf8');
    
    // Add origin validation function
    const originValidationCode = `
  /**
   * TRACER BULLET: Origin validation for security
   */
  function validateOrigin(sender) {
    // Validate sender origin
    if (!sender || !sender.origin) {
      throw new Error('Invalid sender: origin information required');
    }
    
    // Check for allowed origins
    const allowedOrigins = [
      'chrome-extension://',
      'https://api.aiguardian.ai',
      'https://aiguardian.ai',
      'https://dashboard.aiguardian.ai',
      'https://localhost',
      'https://127.0.0.1'
    ];
    
    const isAllowedOrigin = allowedOrigins.some(origin => sender.origin.startsWith(origin));
    
    if (!isAllowedOrigin) {
      throw new Error(\`Unauthorized origin: \${sender.origin}\`);
    }
    
    return true;
  }
`;

    // Insert the validation function
    const insertPoint = backgroundContent.indexOf('function validateMessage');
    if (insertPoint !== -1) {
      backgroundContent = backgroundContent.slice(0, insertPoint) + originValidationCode + '\n\n  ' + backgroundContent.slice(insertPoint);
    }
    
    // Update message listener to use origin validation
    backgroundContent = backgroundContent.replace(
      'validateMessage(message, sender);',
      'validateMessage(message, sender);\n      validateOrigin(sender);'
    );
    
    fs.writeFileSync('src/service_worker.js', backgroundContent);
  }

  /**
   * Improve error handling
   */
  async improveErrorHandling() {
    // Read gateway.js and enhance error handling
    let gatewayContent = fs.readFileSync('src/gateway.js', 'utf8');
    
    // Add comprehensive error handling
    const errorHandlingCode = `
  /**
   * TRACER BULLET: Enhanced error handling and logging
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
    console.error('[Gateway] Error occurred:', {
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
`;

    // Insert error handling function
    const insertPoint = gatewayContent.indexOf('class AIGuardiansGateway');
    if (insertPoint !== -1) {
      const classStart = gatewayContent.indexOf('{', insertPoint);
      if (classStart !== -1) {
        gatewayContent = gatewayContent.slice(0, classStart + 1) + errorHandlingCode + '\n  ' + gatewayContent.slice(classStart + 1);
      }
    }
    
    fs.writeFileSync('src/gateway.js', gatewayContent);
  }

  /**
   * Add data encryption
   */
  async addDataEncryption() {
    // Create encryption utility
    const encryptionCode = `
/**
 * Data Encryption Utilities
 * Provides secure data encryption for sensitive information
 */

class DataEncryption {
  /**
   * Simple encryption for sensitive data (not for high-security use)
   */
  static encrypt(text, key = 'ai-guardians-key') {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    return btoa(encrypted);
  }
  
  /**
   * Decrypt encrypted data
   */
  static decrypt(encryptedText, key = 'ai-guardians-key') {
    if (!encryptedText || typeof encryptedText !== 'string') {
      return '';
    }
    
    try {
      const decrypted = atob(encryptedText);
      let text = '';
      
      for (let i = 0; i < decrypted.length; i++) {
        const charCode = decrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        text += String.fromCharCode(charCode);
      }
      
      return text;
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }
  
  /**
   * Hash sensitive data for logging
   */
  static hash(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataEncryption;
}
`;

    fs.writeFileSync('src/data-encryption.js', encryptionCode);
  }

  /**
   * Enhance CSP
   */
  async enhanceCSP() {
    // Read manifest.json and enhance CSP
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    // Enhanced CSP
    manifest.content_security_policy = {
      "extension_pages": "script-src 'self'; object-src 'self'; base-uri 'self'; form-action 'self';"
    };
    
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
  }

  /**
   * Add rate limiting
   */
  async addRateLimiting() {
    // Create rate limiting utility
    const rateLimitingCode = `
/**
 * Rate Limiting Utilities
 * Provides rate limiting for API requests and user actions
 */

class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      api: { max: 10, window: 60000 }, // 10 requests per minute
      analysis: { max: 5, window: 30000 }, // 5 analyses per 30 seconds
      logging: { max: 20, window: 60000 } // 20 logs per minute
    };
  }
  
  /**
   * Check if request is allowed
   */
  isAllowed(type, identifier = 'default') {
    const limit = this.limits[type];
    if (!limit) return true;
    
    const key = \`\${type}:\${identifier}\`;
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < limit.window);
    
    if (validRequests.length >= limit.max) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
  
  /**
   * Get remaining requests
   */
  getRemaining(type, identifier = 'default') {
    const limit = this.limits[type];
    if (!limit) return Infinity;
    
    const key = \`\${type}:\${identifier}\`;
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < limit.window);
    
    return Math.max(0, limit.max - validRequests.length);
  }
  
  /**
   * Reset rate limit for identifier
   */
  reset(type, identifier = 'default') {
    const key = \`\${type}:\${identifier}\`;
    this.requests.delete(key);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RateLimiter;
}
`;

    fs.writeFileSync('src/rate-limiter.js', rateLimitingCode);
  }

  /**
   * Add request validation
   */
  async addRequestValidation() {
    // Read gateway.js and add request validation
    let gatewayContent = fs.readFileSync('src/gateway.js', 'utf8');
    
    // Add request validation function
    const requestValidationCode = `
  /**
   * TRACER BULLET: Enhanced request validation
   */
  validateRequest(endpoint, payload) {
    // Validate endpoint
    const allowedEndpoints = ['analyze', 'health', 'logging', 'guards', 'config'];
    if (!allowedEndpoints.includes(endpoint)) {
      throw new Error(\`Invalid endpoint: \${endpoint}\`);
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
`;

    // Insert request validation function
    const insertPoint = gatewayContent.indexOf('class AIGuardiansGateway');
    if (insertPoint !== -1) {
      const classStart = gatewayContent.indexOf('{', insertPoint);
      if (classStart !== -1) {
        gatewayContent = gatewayContent.slice(0, classStart + 1) + requestValidationCode + '\n  ' + gatewayContent.slice(classStart + 1);
      }
    }
    
    // Update sendToGateway to use validation
    gatewayContent = gatewayContent.replace(
      'async sendToGateway(endpoint, payload) {',
      'async sendToGateway(endpoint, payload) {\n    try {\n      this.validateRequest(endpoint, payload);\n    } catch (error) {\n      this.handleError(error, { endpoint, payload });\n      throw error;\n    }'
    );
    
    fs.writeFileSync('src/gateway.js', gatewayContent);
  }

  /**
   * Generate enhancement report
   */
  generateEnhancementReport() {
    const totalEnhancements = this.enhancements.length;
    const appliedEnhancements = this.enhancements.filter(e => e.status === 'APPLIED').length;
    const failedEnhancements = this.enhancements.filter(e => e.status === 'FAILED').length;
    
    const report = {
      summary: {
        totalEnhancements,
        appliedEnhancements,
        failedEnhancements,
        successRate: (appliedEnhancements / totalEnhancements) * 100
      },
      enhancements: this.enhancements,
      timestamp: new Date().toISOString()
    };

    console.log('\n' + '='.repeat(60));
    console.log('🔒 SECURITY ENHANCEMENT REPORT');
    console.log('='.repeat(60));
    console.log(`Total Enhancements: ${totalEnhancements}`);
    console.log(`Applied: ${appliedEnhancements}`);
    console.log(`Failed: ${failedEnhancements}`);
    console.log(`Success Rate: ${report.summary.successRate.toFixed(2)}%`);
    
    // Save report
    fs.writeFileSync('security-enhancement-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Enhancement report saved to: security-enhancement-report.json');
  }
}

// Run enhancements if this script is executed directly
if (require.main === module) {
  const enhancer = new SecurityEnhancer();
  enhancer.applySecurityEnhancements().catch(console.error);
}

module.exports = SecurityEnhancer;
