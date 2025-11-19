/**
 * Enhanced Logger for AiGuardian Chrome Extension
 * 
 * Pattern: TRUTH × CLARITY × DEBUG × ONE
 * 
 * Enhanced for comprehensive debugging and bias score diagnosis
 * Works even when script is on debugger ignore list
 */
const Logger = {
  /**
   * Log informational messages with enhanced formatting
   */
  info: function (message, meta) {
    try {
      if (meta !== undefined && meta !== null) {
        // Enhanced formatting for objects
        if (typeof meta === 'object') {
          console.log(`[INFO] ${message}`, meta);
          // Also log as formatted JSON for better readability
          try {
            console.log(`[INFO] ${message} (formatted):`, JSON.stringify(meta, null, 2));
          } catch (e) {
            // If JSON.stringify fails, just use the object
          }
        } else {
          console.log(`[INFO] ${message}`, meta);
        }
      } else {
        console.log(`[INFO] ${message}`);
      }
    } catch (e) {
      // Fallback: try basic console.log
      try {
        console.log(`[INFO] ${message}`);
      } catch (e2) {}
    }
  },

  /**
   * Log warning messages with enhanced formatting
   */
  warn: function (message, meta) {
    try {
      if (meta !== undefined && meta !== null) {
        if (typeof meta === 'object') {
          console.warn(`[WARN] ${message}`, meta);
          try {
            console.warn(`[WARN] ${message} (formatted):`, JSON.stringify(meta, null, 2));
          } catch (e) {}
        } else {
          console.warn(`[WARN] ${message}`, meta);
        }
      } else {
        console.warn(`[WARN] ${message}`);
      }
    } catch (e) {
      try {
        console.warn(`[WARN] ${message}`);
      } catch (e2) {}
    }
  },

  /**
   * Log error messages with enhanced formatting
   */
  error: function (message, err) {
    try {
      if (err !== undefined && err !== null) {
        if (err instanceof Error) {
          console.error(`[ERROR] ${message}`, err);
          console.error(`[ERROR] ${message} - Stack:`, err.stack);
        } else if (typeof err === 'object') {
          console.error(`[ERROR] ${message}`, err);
          try {
            console.error(`[ERROR] ${message} (formatted):`, JSON.stringify(err, null, 2));
          } catch (e) {}
        } else {
          console.error(`[ERROR] ${message}`, err);
        }
      } else {
        console.error(`[ERROR] ${message}`);
      }
    } catch (e) {
      try {
        console.error(`[ERROR] ${message}`);
      } catch (e2) {}
    }
  },

  /**
   * Log debug messages with enhanced formatting
   */
  debug: function (message, meta) {
    try {
      if (meta !== undefined && meta !== null) {
        if (typeof meta === 'object') {
          console.log(`[DEBUG] ${message}`, meta);
          try {
            console.log(`[DEBUG] ${message} (formatted):`, JSON.stringify(meta, null, 2));
          } catch (e) {}
        } else {
          console.log(`[DEBUG] ${message}`, meta);
        }
      } else {
        console.log(`[DEBUG] ${message}`);
      }
    } catch (e) {
      try {
        console.log(`[DEBUG] ${message}`);
      } catch (e2) {}
    }
  },

  /**
   * Enhanced trace logging for detailed debugging
   * Specifically for bias score diagnosis
   */
  trace: function (message, meta) {
    try {
      const timestamp = new Date().toISOString();
      const traceMessage = `[TRACE] [${timestamp}] ${message}`;
      
      if (meta !== undefined && meta !== null) {
        if (typeof meta === 'object') {
          console.log(traceMessage, meta);
          try {
            console.log(`${traceMessage} (formatted):`, JSON.stringify(meta, null, 2));
          } catch (e) {}
        } else {
          console.log(traceMessage, meta);
        }
      } else {
        console.log(traceMessage);
      }
    } catch (e) {
      try {
        console.log(`[TRACE] ${message}`);
      } catch (e2) {}
    }
  },

  /**
   * Log bias score diagnosis - specialized for our use case
   */
  biasScore: function (message, scoreData) {
    try {
      const scoreInfo = {
        message: message,
        timestamp: new Date().toISOString(),
        ...scoreData
      };
      
      console.group(`🔍 [BIAS_SCORE] ${message}`);
      console.log('Score Data:', scoreInfo);
      
      if (scoreData) {
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
      }
      
      console.groupEnd();
    } catch (e) {
      try {
        console.log(`[BIAS_SCORE] ${message}`, scoreData);
      } catch (e2) {}
    }
  }
};
