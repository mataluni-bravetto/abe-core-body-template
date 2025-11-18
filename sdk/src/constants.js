/**
 * AiGuardian SDK Constants
 * Centralized constants for SDK configuration and operation
 */

// SDK Version
export const SDK_VERSION = '1.0.0';

// Default Configuration
export const DEFAULT_CONFIG = {
  // API Configuration
  baseUrl: 'https://api.aiguardian.ai',
  apiKey: null,
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second

  // Analysis Configuration
  defaultGuards: ['biasguard', 'trustguard', 'contextguard'],
  confidence: 0.7,
  maxBatchSize: 10,
  concurrency: 3,

  // Cache Configuration
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    maxSize: 100
  },

  // Rate Limiting Configuration
  rateLimit: {
    enabled: true,
    requests: 100, // requests per window
    window: 60000, // 1 minute in milliseconds
    burst: 10 // burst allowance
  },

  // Logging Configuration
  logging: {
    level: 'info', // error, warn, info, debug
    enabled: true,
    includeTimestamp: true,
    includeTraceId: true,
    remoteLogging: true,
    maxLogSize: 1000
  },

  // Tracing Configuration
  tracing: {
    enabled: true,
    sampleRate: 1.0, // 100% sampling
    maxTraces: 1000,
    includeMetrics: true
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

// Error Codes
export const ERROR_CODES = {
  INVALID_API_KEY: 'INVALID_API_KEY',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TEXT_TOO_LONG: 'TEXT_TOO_LONG',
  TEXT_TOO_SHORT: 'TEXT_TOO_SHORT',
  INVALID_TEXT: 'INVALID_TEXT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR'
};

// Analysis Types
export const ANALYSIS_TYPES = {
  BIAS_DETECTION: 'bias_detection',
  TOXICITY_DETECTION: 'toxicity_detection',
  SENTIMENT_ANALYSIS: 'sentiment_analysis',
  FACT_CHECKING: 'fact_checking',
  OBJECTIVITY_ANALYSIS: 'objectivity_analysis',
  EMOTIONAL_ANALYSIS: 'emotional_analysis'
};

// Guard Services
export const GUARD_SERVICES = {
  BIAS_GUARD: 'biasguard',
  TRUST_GUARD: 'trustguard',
  CONTEXT_GUARD: 'contextguard',
  SECURITY_GUARD: 'securityguard',
  TOKEN_GUARD: 'tokenguard',
  HEALTH_GUARD: 'healthguard'
};

// Log Levels
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

// Validation Rules
export const VALIDATION_RULES = {
  TEXT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10000,
    ALLOWED_CHARS: /^[\w\s.,!?\-;:()'"’“”\n\r\t]+$/u
  },
  API_KEY: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200,
    PATTERN: /^[A-Za-z0-9_\-]+$/
  },
  URL: {
    PATTERN: /^https:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/,
    REQUIRE_HTTPS: true
  }
};

// Cache Keys
export const CACHE_KEYS = {
  ANALYSIS: 'analysis',
  GUARD_STATUS: 'guard_status',
  HEALTH_CHECK: 'health_check',
  CONFIG: 'config'
};

// Metric Names
export const METRICS = {
  ANALYSIS_COMPLETED: 'analysis_completed',
  ANALYSIS_FAILED: 'analysis_failed',
  CACHE_HIT: 'cache_hit',
  CACHE_MISS: 'cache_miss',
  HEALTH_CHECK_SUCCESSFUL: 'health_check_successful',
  HEALTH_CHECK_FAILED: 'health_check_failed',
  BATCH_ANALYSIS_COMPLETED: 'batch_analysis_completed',
  BATCH_ANALYSIS_FAILED: 'batch_analysis_failed'
};

// Event Types
export const EVENT_TYPES = {
  ANALYSIS_STARTED: 'analysis_started',
  ANALYSIS_COMPLETED: 'analysis_completed',
  ANALYSIS_FAILED: 'analysis_failed',
  CACHE_HIT: 'cache_hit',
  CACHE_MISS: 'cache_miss',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  NETWORK_ERROR: 'network_error',
  CONFIGURATION_UPDATED: 'configuration_updated'
};
