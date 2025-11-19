/**
 * String Optimizer for AiGuardian Chrome Extension
 *
 * Provides optimized string operations to improve performance
 * and reduce memory usage.
 */

// Constants are available via importScripts in service worker context

/**
 * String Optimizer Class
 * Handles efficient string operations with bounds checking
 */
class StringOptimizer {
  /**
   * Optimized string replacement with bounds checking
   * @function optimizedReplace
   * @param {string} str - The string to process
   * @param {RegExp} pattern - The pattern to replace
   * @param {string} replacement - The replacement string
   * @param {number} maxLength - Maximum string length
   * @returns {string} The processed string
   */
  optimizedReplace(str, pattern, replacement, maxLength = SECURITY.MAX_STRING_LENGTH) {
    if (!str || typeof str !== 'string') {
      return '';
    }

    // Early return for empty strings
    if (str.length === 0) {
      return str;
    }

    // Truncate if too long before processing
    if (str.length > maxLength) {
      str = str.substring(0, maxLength);
    }

    return str.replace(pattern, replacement);
  }

  /**
   * Optimized substring with bounds checking
   * @function safeSubstring
   * @param {string} str - The string to substring
   * @param {number} start - Start index
   * @param {number} end - End index
   * @param {number} maxLength - Maximum string length
   * @returns {string} The substring
   */
  safeSubstring(
    str,
    start = 0,
    end = SECURITY.MAX_STRING_LENGTH,
    maxLength = SECURITY.MAX_STRING_LENGTH
  ) {
    if (!str || typeof str !== 'string') {
      return '';
    }

    // Ensure bounds are valid
    start = Math.max(0, Math.min(start, str.length));
    end = Math.max(start, Math.min(end, str.length, maxLength));

    return str.substring(start, end);
  }

  /**
   * Optimized string sanitization with performance improvements
   * @function optimizedSanitize
   * @param {string} str - The string to sanitize
   * @param {number} maxLength - Maximum string length
   * @returns {string} The sanitized string
   */
  optimizedSanitize(str, maxLength = SECURITY.MAX_STRING_LENGTH) {
    if (!str || typeof str !== 'string') {
      return '';
    }

    // Early return for empty strings
    if (str.length === 0) {
      return str;
    }

    // Truncate if too long before processing
    if (str.length > maxLength) {
      str = str.substring(0, maxLength);
    }

    // Use single pass for multiple replacements
    // SAFETY: Using [\s\S]*? instead of .*? to match newlines reliably (multiline safety)
    return str
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/[<>"'&]/g, '');
  }

  /**
   * Optimized HTML tag removal
   * @function removeHtmlTags
   * @param {string} str - The string to process
   * @param {number} maxLength - Maximum string length
   * @returns {string} The string without HTML tags
   */
  removeHtmlTags(str, maxLength = SECURITY.MAX_STRING_LENGTH) {
    if (!str || typeof str !== 'string') {
      return '';
    }

    if (str.length > maxLength) {
      str = str.substring(0, maxLength);
    }

    return str.replace(/<[^>]*>/g, '');
  }

  /**
   * Optimized string truncation with ellipsis
   * @function truncateWithEllipsis
   * @param {string} str - The string to truncate
   * @param {number} maxLength - Maximum string length
   * @param {string} ellipsis - The ellipsis string (default: '...')
   * @returns {string} The truncated string
   */
  truncateWithEllipsis(str, maxLength = SECURITY.MAX_STRING_LENGTH, ellipsis = '...') {
    if (!str || typeof str !== 'string') {
      return '';
    }

    if (str.length <= maxLength) {
      return str;
    }

    const truncateLength = maxLength - ellipsis.length;
    return str.substring(0, truncateLength) + ellipsis;
  }

  /**
   * Optimized string validation
   * @function isValidString
   * @param {*} value - The value to validate
   * @param {number} maxLength - Maximum string length
   * @returns {boolean} True if valid string
   */
  isValidString(value, maxLength = SECURITY.MAX_STRING_LENGTH) {
    return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
  }

  /**
   * Optimized string length check
   * @function getSafeLength
   * @param {string} str - The string to check
   * @param {number} maxLength - Maximum string length
   * @returns {number} The safe length
   */
  getSafeLength(str, maxLength = SECURITY.MAX_STRING_LENGTH) {
    if (!str || typeof str !== 'string') {
      return 0;
    }
    return Math.min(str.length, maxLength);
  }

  /**
   * Optimized string concatenation with bounds checking
   * @function safeConcat
   * @param {string[]} strings - Array of strings to concatenate
   * @param {number} maxLength - Maximum total length
   * @param {string} separator - Separator between strings
   * @returns {string} The concatenated string
   */
  safeConcat(strings, maxLength = SECURITY.MAX_STRING_LENGTH, separator = '') {
    if (!Array.isArray(strings)) {
      return '';
    }

    let result = '';
    for (const str of strings) {
      if (typeof str === 'string') {
        const newLength = result.length + str.length + separator.length;
        if (newLength > maxLength) {
          break;
        }
        result += (result.length > 0 ? separator : '') + str;
      }
    }

    return result;
  }

  /**
   * Optimized string splitting with bounds checking
   * @function safeSplit
   * @param {string} str - The string to split
   * @param {string|RegExp} separator - The separator
   * @param {number} maxLength - Maximum string length
   * @returns {string[]} The split strings
   */
  safeSplit(str, separator, maxLength = SECURITY.MAX_STRING_LENGTH) {
    if (!str || typeof str !== 'string') {
      return [];
    }

    if (str.length > maxLength) {
      str = str.substring(0, maxLength);
    }

    return str.split(separator);
  }

  /**
   * Optimized string trimming with bounds checking
   * @function safeTrim
   * @param {string} str - The string to trim
   * @param {number} maxLength - Maximum string length
   * @returns {string} The trimmed string
   */
  safeTrim(str, maxLength = SECURITY.MAX_STRING_LENGTH) {
    if (!str || typeof str !== 'string') {
      return '';
    }

    let trimmed = str.trim();

    if (trimmed.length > maxLength) {
      trimmed = trimmed.substring(0, maxLength);
    }

    return trimmed;
  }
}

// Create global instance for Chrome extension compatibility
const stringOptimizer = new StringOptimizer();

// Make utility functions available globally
const optimizedReplace = stringOptimizer.optimizedReplace.bind(stringOptimizer);
const safeSubstring = stringOptimizer.safeSubstring.bind(stringOptimizer);
const optimizedSanitize = stringOptimizer.optimizedSanitize.bind(stringOptimizer);
const removeHtmlTags = stringOptimizer.removeHtmlTags.bind(stringOptimizer);
const truncateWithEllipsis = stringOptimizer.truncateWithEllipsis.bind(stringOptimizer);
const isValidString = stringOptimizer.isValidString.bind(stringOptimizer);
const getSafeLength = stringOptimizer.getSafeLength.bind(stringOptimizer);
const safeConcat = stringOptimizer.safeConcat.bind(stringOptimizer);
const safeSplit = stringOptimizer.safeSplit.bind(stringOptimizer);
const safeTrim = stringOptimizer.safeTrim.bind(stringOptimizer);

// Expose class and instance on window for browser/unit-test usage
if (typeof window !== 'undefined') {
  window.StringOptimizer = StringOptimizer;
  window.stringOptimizer = stringOptimizer;
}
