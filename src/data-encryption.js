
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
      // Silently fail decryption - return empty string
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
