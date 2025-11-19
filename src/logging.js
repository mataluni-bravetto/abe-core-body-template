/**
 * Enhanced Logger for AiGuardian Chrome Extension
 * 
 * Pattern: TRUTH × CLARITY × DEBUG × ONE
 * 
 * Enhanced for comprehensive debugging and bias score diagnosis
 * Works even when script is on debugger ignore list
 * 
 * SAFETY: Defensive error handling to prevent Logger from breaking extension
 */
const Logger = {
  /**
   * Safe JSON stringify with circular reference handling
   */
  _safeStringify: function(obj, maxDepth = 10) {
    try {
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        // Handle non-serializable values
        if (value === undefined) return '[undefined]';
        if (typeof value === 'function') return '[Function]';
        if (value instanceof Error) return value.toString();
        return value;
      }, 2);
    } catch (e) {
      return '[Unable to stringify]';
    }
  },

  /**
   * Log informational messages with enhanced formatting
   * SAFETY: Never throws - always falls back to basic console.log
   */
  info: function (message, meta) {
    try {
      // SAFETY: Ensure message is a string
      const msg = String(message || '');
      
      if (meta !== undefined && meta !== null) {
        // Enhanced formatting for objects
        if (typeof meta === 'object') {
          try {
            console.log(`[INFO] ${msg}`, meta);
            // Also log as formatted JSON for better readability
            try {
              const formatted = Logger._safeStringify(meta);
              if (formatted && formatted !== '[Unable to stringify]') {
                console.log(`[INFO] ${msg} (formatted):`, formatted);
              }
            } catch (e) {
              // If JSON.stringify fails, just use the object - non-critical
            }
          } catch (e) {
            // Fallback: try basic console.log
            console.log(`[INFO] ${msg}`, meta);
          }
        } else {
          console.log(`[INFO] ${msg}`, meta);
        }
      } else {
        console.log(`[INFO] ${msg}`);
      }
    } catch (e) {
      // Fallback: try basic console.log with just message
      try {
        console.log(`[INFO] ${String(message || '')}`);
      } catch (e2) {
        // Last resort: silent fail (should never happen)
      }
    }
  },

  /**
   * Log warning messages with enhanced formatting
   * SAFETY: Never throws - always falls back to basic console.warn
   */
  warn: function (message, meta) {
    try {
      const msg = String(message || '');
      
      if (meta !== undefined && meta !== null) {
        if (typeof meta === 'object') {
          try {
            console.warn(`[WARN] ${msg}`, meta);
            try {
              const formatted = Logger._safeStringify(meta);
              if (formatted && formatted !== '[Unable to stringify]') {
                console.warn(`[WARN] ${msg} (formatted):`, formatted);
              }
            } catch (e) {
              // If JSON.stringify fails, just use the object - non-critical
            }
          } catch (e) {
            console.warn(`[WARN] ${msg}`, meta);
          }
        } else {
          console.warn(`[WARN] ${msg}`, meta);
        }
      } else {
        console.warn(`[WARN] ${msg}`);
      }
    } catch (e) {
      try {
        console.warn(`[WARN] ${String(message || '')}`);
      } catch (e2) {}
    }
  },

  /**
   * Log error messages with enhanced formatting
   * SAFETY: Never throws - always falls back to basic console.error
   */
  error: function (message, err) {
    try {
      const msg = String(message || '');
      
      if (err !== undefined && err !== null) {
        if (err instanceof Error) {
          try {
            console.error(`[ERROR] ${msg}`, err);
            if (err.stack) {
              console.error(`[ERROR] ${msg} - Stack:`, err.stack);
            }
          } catch (e) {
            console.error(`[ERROR] ${msg}`);
          }
        } else if (typeof err === 'object') {
          try {
            console.error(`[ERROR] ${msg}`, err);
            try {
              const formatted = Logger._safeStringify(err);
              if (formatted && formatted !== '[Unable to stringify]') {
                console.error(`[ERROR] ${msg} (formatted):`, formatted);
              }
            } catch (e) {
              // If JSON.stringify fails, just use the object - non-critical
            }
          } catch (e) {
            console.error(`[ERROR] ${msg}`);
          }
        } else {
          console.error(`[ERROR] ${msg}`, err);
        }
      } else {
        console.error(`[ERROR] ${msg}`);
      }
    } catch (e) {
      try {
        console.error(`[ERROR] ${String(message || '')}`);
      } catch (e2) {}
    }
  },

  /**
   * Log debug messages with enhanced formatting
   * SAFETY: Never throws - always falls back to basic console.log
   */
  debug: function (message, meta) {
    try {
      const msg = String(message || '');
      
      if (meta !== undefined && meta !== null) {
        if (typeof meta === 'object') {
          try {
            console.log(`[DEBUG] ${msg}`, meta);
            try {
              const formatted = Logger._safeStringify(meta);
              if (formatted && formatted !== '[Unable to stringify]') {
                console.log(`[DEBUG] ${msg} (formatted):`, formatted);
              }
            } catch (e) {
              // If JSON.stringify fails, just use the object - non-critical
            }
          } catch (e) {
            console.log(`[DEBUG] ${msg}`, meta);
          }
        } else {
          console.log(`[DEBUG] ${msg}`, meta);
        }
      } else {
        console.log(`[DEBUG] ${msg}`);
      }
    } catch (e) {
      try {
        console.log(`[DEBUG] ${String(message || '')}`);
      } catch (e2) {}
    }
  },

  /**
   * Enhanced trace logging for detailed debugging
   * Specifically for bias score diagnosis
   * SAFETY: Never throws - always falls back to basic console.log
   */
  trace: function (message, meta) {
    try {
      const msg = String(message || '');
      const timestamp = new Date().toISOString();
      const traceMessage = `[TRACE] [${timestamp}] ${msg}`;
      
      if (meta !== undefined && meta !== null) {
        if (typeof meta === 'object') {
          try {
            console.log(traceMessage, meta);
            try {
              const formatted = Logger._safeStringify(meta);
              if (formatted && formatted !== '[Unable to stringify]') {
                console.log(`${traceMessage} (formatted):`, formatted);
              }
            } catch (e) {
              // If JSON.stringify fails, just use the object - non-critical
            }
          } catch (e) {
            console.log(traceMessage, meta);
          }
        } else {
          console.log(traceMessage, meta);
        }
      } else {
        console.log(traceMessage);
      }
    } catch (e) {
      try {
        console.log(`[TRACE] ${String(message || '')}`);
      } catch (e2) {}
    }
  },

  /**
   * Log bias score diagnosis - specialized for our use case
   * SAFETY: Never throws - handles all edge cases
   */
  biasScore: function (message, scoreData) {
    try {
      const msg = String(message || '');
      
      // SAFETY: Safely merge scoreData to avoid spread operator issues
      let scoreInfo = {
        message: msg,
        timestamp: new Date().toISOString(),
      };
      
      // Safely copy properties from scoreData
      if (scoreData && typeof scoreData === 'object') {
        try {
          Object.keys(scoreData).forEach(key => {
            try {
              scoreInfo[key] = scoreData[key];
            } catch (e) {
              // Skip problematic properties
            }
          });
        } catch (e) {
          // If copying fails, use empty object
        }
      }
      
      // SAFETY: Check if console.group is available (not in all contexts)
      if (typeof console.group === 'function') {
        try {
          console.group(`🔍 [BIAS_SCORE] ${msg}`);
        } catch (e) {
          // Fallback if group fails
        }
      }
      
      try {
      console.log('Score Data:', scoreInfo);
      } catch (e) {
        // Fallback
        console.log(`[BIAS_SCORE] ${msg}`);
      }
      
      if (scoreData && typeof scoreData === 'object') {
        try {
        if (scoreData.rawScore !== undefined) {
          console.log(`  Raw Score: ${scoreData.rawScore} (${typeof scoreData.rawScore})`);
        }
        if (scoreData.scorePercentage !== undefined) {
          console.log(`  Percentage: ${scoreData.scorePercentage}%`);
        }
        if (scoreData.biasTypes) {
          console.log(`  Bias Types:`, scoreData.biasTypes);
        }
        if (scoreData.responseStructure) {
          console.log(`  Response Structure:`, scoreData.responseStructure);
          }
        } catch (e) {
          // Skip individual property logging if it fails
        }
      }
      
      // SAFETY: Check if console.groupEnd is available
      if (typeof console.groupEnd === 'function') {
        try {
      console.groupEnd();
        } catch (e) {
          // Fallback if groupEnd fails
        }
      }
    } catch (e) {
      // Fallback: try basic console.log
      try {
        const msg = String(message || '');
        console.log(`[BIAS_SCORE] ${msg}`, scoreData);
      } catch (e2) {
        // Last resort: silent fail
        try {
          console.log(`[BIAS_SCORE] ${String(message || '')}`);
        } catch (e3) {}
      }
    }
  }
};
