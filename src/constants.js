/**
 * Constants for AiGuardian Chrome Extension
 * 
 * This module centralizes all configuration constants to improve maintainability
 * and reduce hardcoded values throughout the codebase.
 * 
 * Note: Using global variables instead of ES6 exports for Chrome extension compatibility
 */

/**
 * Text Analysis Constants
 */
const TEXT_ANALYSIS = {
  MIN_SELECTION_LENGTH: 10,
  MAX_SELECTION_LENGTH: 5000,
  MAX_TEXT_LENGTH: 10000,
  DEBOUNCE_DELAY: 300,
  BADGE_DISPLAY_TIME: 3000
};

/**
 * API Configuration Constants
 */
const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  MAX_REQUEST_SIZE: 10000,
  CACHE_TTL: 30000 // 30 seconds
};

/**
 * Security Constants
 */
const SECURITY = {
  MAX_API_KEY_LENGTH: 200,
  MIN_API_KEY_LENGTH: 10,
  MAX_STRING_LENGTH: 1000,
  MAX_PAYLOAD_LENGTH: 100
};

/**
 * UI Constants
 */
const UI = {
  BADGE_DISPLAY_TIME: 3000,
  LOADING_TIMEOUT: 5000,
  ANIMATION_DURATION: 300
};

/**
 * Error Messages
 */
const ERROR_MESSAGES = {
  SELECTION_TOO_SHORT: 'Selection too short for analysis',
  SELECTION_TOO_LONG: 'Text too long for analysis',
  ANALYSIS_FAILED: 'Analysis failed',
  CONNECTION_FAILED: 'Connection to backend failed',
  INVALID_API_KEY: 'Invalid API key format',
  TIMEOUT_ERROR: 'Request timed out'
};

/**
 * Success Messages
 */
const SUCCESS_MESSAGES = {
  ANALYSIS_COMPLETE: 'Analysis complete',
  CONNECTION_SUCCESS: 'Connected to backend',
  CONFIG_SAVED: 'Configuration saved'
};

/**
 * Feature flags / environment detection
 */
// Basic runtime heuristic: treat extension as "development" when built with NODE_ENV=development
// or when a special chrome.storage flag is present (see options.js for overrides).
// Note: process.env.NODE_ENV may be undefined in MV3 runtime; we guard access defensively.
// This flag is intentionally simple and is used only for gating developer-facing UI, not logic.
const SHOW_DEV_UI = (function() {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      return true;
    }
  } catch (e) {
    // Ignore - process may not exist in extension contexts
  }
  // Fallback: allow an override via chrome.storage.local flag "show_dev_ui"
  // Initialize window property to undefined (will be set by async callback)
  if (typeof window !== 'undefined') {
    window.__AIG_SHOW_DEV_UI = undefined;
  }
  // Check storage asynchronously - callback will set window.__AIG_SHOW_DEV_UI
  // Code that uses this flag checks both SHOW_DEV_UI || window.__AIG_SHOW_DEV_UI
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['show_dev_ui'], (data) => {
        if (typeof window !== 'undefined') {
          if (typeof data.show_dev_ui === 'boolean') {
            window.__AIG_SHOW_DEV_UI = data.show_dev_ui;
          } else {
            // Explicitly set to false if not present in storage
            window.__AIG_SHOW_DEV_UI = false;
          }
        }
      });
    }
  } catch (e) {
    // Ignore storage errors; default remains false unless process.env says otherwise
    if (typeof window !== 'undefined') {
      window.__AIG_SHOW_DEV_UI = false;
    }
  }
  return false;
})();

/**
 * Default Configuration Values
 * ALIGNED WITH BACKEND: AIGuards-Backend codeguardians-gateway
 */
const DEFAULT_CONFIG = {
  // Backend API Gateway URL - Production endpoint
  // Extension will try to fetch Clerk key from backend automatically
  GATEWAY_URL: 'https://api.aiguardian.ai',
  // For internal/testing: 'https://api.internal.aiguardian.ai'
  // For local development: 'http://localhost:8000'
  
  // Clerk Publishable Key - Hardcoded fallback (safe to expose, publishable keys are public)
  // This is used if backend API doesn't return it and user hasn't configured manually
  CLERK_PUBLISHABLE_KEY: 'pk_test_ZmFjdHVhbC1oYXJlLTMuY2xlcmsuYWNjb3VudHMuZGV2JA',
  
  API_KEY: '', // User must configure via extension options
  SERVICE_ENABLED: true,
  LOGGING_CONFIG: {
    level: 'info',
    enable_central_logging: true,
    enable_local_logging: true
  },
  ANALYSIS_PIPELINE: 'unified', // Uses /api/v1/guards/process endpoint
  
  // Guard Services Configuration
  // Maps to backend guard services: TokenGuard, TrustGuard, ContextGuard, BiasGuard, HealthGuard
  GUARD_SERVICES: {
    // BiasGuard (Port 8004) - Bias detection and content analysis
    biasguard: { 
      enabled: true, 
      threshold: 0.5,
      service_type: 'biasguard'
    },
    // TrustGuard (Port 8002) - Trust validation and reliability
    trustguard: { 
      enabled: true, 
      threshold: 0.7,
      service_type: 'trustguard'
    },
    // ContextGuard (Port 8003) - Context drift detection
    contextguard: { 
      enabled: true, 
      threshold: 0.6,
      service_type: 'contextguard'
    },
    // TokenGuard (Port 8001) - Token optimization
    tokenguard: { 
      enabled: false, 
      threshold: 0.5,
      service_type: 'tokenguard'
    },
    // HealthGuard (Port 8006) - Health monitoring and validation
    healthguard: { 
      enabled: false, 
      threshold: 0.8,
      service_type: 'healthguard'
    }
  }
};

/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Log Levels
 */
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace'
};

/**
 * Analysis Types
 */
const ANALYSIS_TYPES = {
  BIAS_DETECTION: 'bias_detection',
  TOXICITY_DETECTION: 'toxicity_detection',
  SENTIMENT_ANALYSIS: 'sentiment_analysis',
  FACT_CHECKING: 'fact_checking'
};

/**
 * Event Types
 */
const EVENT_TYPES = {
  ANALYZE_TEXT: 'ANALYZE_TEXT',
  GET_GUARD_STATUS: 'GET_GUARD_STATUS',
  UPDATE_GUARD_CONFIG: 'UPDATE_GUARD_CONFIG',
  GET_CENTRAL_CONFIG: 'GET_CENTRAL_CONFIG',
  UPDATE_CENTRAL_CONFIG: 'UPDATE_CENTRAL_CONFIG',
  GET_DIAGNOSTICS: 'GET_DIAGNOSTICS',
  GET_TRACE_STATS: 'GET_TRACE_STATS',
  TEST_GATEWAY_CONNECTION: 'TEST_GATEWAY_CONNECTION'
};

