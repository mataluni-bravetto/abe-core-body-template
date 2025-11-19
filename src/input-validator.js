
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
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>[\s\S]*?<\/iframe>/gi
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
      throw new Error(`Number must be between ${min} and ${max}`);
    }
    
    return num;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputValidator;
}
