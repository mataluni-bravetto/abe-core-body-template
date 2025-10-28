# AiGuardian Client SDK

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/aiguardian/sdk)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**AiGuardian Client SDK** - AI-powered content analysis with centralized logging, tracing, and configuration management for skeptical developers who demand transparency.

## 🚀 Quick Start

### Installation

```bash
# Via npm
npm install @aiguardian/sdk

# Via yarn
yarn add @aiguardian/sdk

# Via CDN (Browser)
<script src="https://cdn.aiguardian.ai/sdk/v1.0.0/aiguardian-sdk.js"></script>
```

### Basic Usage

```javascript
import AiGuardianClient from '@aiguardian/sdk';

// Initialize with your API key
const client = new AiGuardianClient({
  apiKey: 'your-api-key-here'
});

// Analyze text for bias
const result = await client.analyzeText(
  "This new technology will revolutionize everything!"
);

console.log(`Bias Score: ${result.score}`);
console.log(`Bias Type: ${result.analysis.bias_type}`);
console.log(`Confidence: ${result.analysis.confidence}`);
```

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Core API](#-core-api)
- [Advanced Usage](#-advanced-usage)
- [Centralized Systems](#-centralized-systems)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Migration Guide](#-migration-guide)
- [API Reference](#-api-reference)
- [Support](#-support)

## ✨ Features

### Core Analysis
- **Text Analysis**: Detect bias, emotional language, and objectivity
- **Batch Processing**: Analyze multiple texts concurrently
- **Confidence Scoring**: Clear uncertainty indicators
- **Guard Services**: Modular analysis components

### Centralized Systems
- **Unified Logging**: Structured logging with trace correlation
- **Performance Tracing**: Request timing and metrics collection
- **Configuration Management**: Dynamic config with validation
- **Intelligent Caching**: TTL-based caching with LRU eviction

### Enterprise Features
- **Rate Limiting**: Token bucket algorithm with burst allowance
- **Request Deduplication**: Prevent duplicate API calls
- **Input Validation**: XSS protection and sanitization
- **Error Recovery**: Automatic retries with exponential backoff

## 📦 Installation

### NPM/Yarn (Recommended)

```bash
npm install @aiguardian/sdk
# or
yarn add @aiguardian/sdk
```

```javascript
import AiGuardianClient from '@aiguardian/sdk';
// or
import { AiGuardianClient, Logger, Tracer } from '@aiguardian/sdk';
```

### CDN (Browser)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.aiguardian.ai/sdk/v1.0.0/aiguardian-sdk.js"></script>
</head>
<body>
  <script>
    const client = new AiGuardianClient({
      apiKey: 'your-api-key-here'
    });
  </script>
</body>
</html>
```

### Node.js

```javascript
const { AiGuardianClient } = require('@aiguardian/sdk');
// ES modules also supported
import AiGuardianClient from '@aiguardian/sdk';
```

## ⚙️ Configuration

### Basic Configuration

```javascript
const client = new AiGuardianClient({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.aiguardian.ai', // Optional
  timeout: 30000, // 30 seconds
  logging: {
    level: 'info',
    enabled: true
  }
});
```

### Advanced Configuration

```javascript
const client = new AiGuardianClient({
  // API Configuration
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.aiguardian.ai',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,

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
    requests: 100, // per window
    window: 60000, // 1 minute
    burst: 10
  },

  // Logging Configuration
  logging: {
    level: 'info',
    enabled: true,
    includeTimestamp: true,
    includeTraceId: true,
    remoteLogging: true,
    maxLogSize: 1000
  },

  // Tracing Configuration
  tracing: {
    enabled: true,
    sampleRate: 1.0,
    maxTraces: 1000,
    includeMetrics: true
  }
});
```

## 🎯 Core API

### Text Analysis

#### Single Text Analysis

```javascript
const result = await client.analyzeText("Text to analyze", {
  guards: ['biasguard', 'trustguard'],
  confidence: 0.8,
  cache: true
});

console.log(result);
// {
//   success: true,
//   score: 0.75,
//   analysis: {
//     bias_type: 'emotional',
//     confidence: 0.9,
//     word_count: 25,
//     emotional_indicators: 3,
//     subjective_indicators: 2
//   },
//   timestamp: "2025-10-26T12:00:00Z"
// }
```

#### Batch Text Analysis

```javascript
const texts = [
  "This is amazing technology!",
  "The data shows clear evidence.",
  "I feel this is the best solution."
];

const results = await client.analyzeBatch(texts, {
  guards: ['biasguard'],
  confidence: 0.7
});

results.forEach((result, index) => {
  console.log(`Text ${index + 1}: ${result.score} - ${result.analysis.bias_type}`);
});
```

### Health & Status

#### Health Check

```javascript
const health = await client.healthCheck();
console.log(health);
// {
//   status: 'healthy',
//   responseTime: 245,
//   timestamp: "2025-10-26T12:00:00Z",
//   version: "1.0.0"
// }
```

#### Guard Status

```javascript
const guardStatus = await client.getGuardStatus();
console.log(guardStatus);
// {
//   guards: {
//     biasguard: { enabled: true, status: 'active', version: '1.0.0' },
//     trustguard: { enabled: true, status: 'active', version: '1.0.0' }
//   }
// }
```

## 🔧 Advanced Usage

### Custom Configuration Management

```javascript
// Get current configuration
const config = client.getConfig();

// Update configuration
client.updateConfig({
  logging: { level: 'debug' },
  cache: { ttl: 600000 } // 10 minutes
});

// Listen for configuration changes
const listenerId = client.config.addListener('logging.level', (path, value) => {
  console.log(`Logging level changed to: ${value}`);
});

// Remove listener
client.config.removeListener(listenerId);
```

### Centralized Logging

```javascript
// Access the logger
const logger = client.logger;

// Log messages with different levels
logger.info('Analysis started', { textLength: 150 });
logger.warn('High bias score detected', { score: 0.85 });
logger.error('API request failed', { error: 'timeout' });

// Get recent logs
const logs = logger.getLogs(50);
console.log(logs);
```

### Performance Tracing

```javascript
// Get trace statistics
const stats = client.getTraceStats();
console.log(stats);
// {
//   activeTraces: 0,
//   completedTraces: 15,
//   totalOperations: 15,
//   averageDuration: 245,
//   metrics: { analysis_completed: 12, cache_hit: 3 }
// }

// Export traces for analysis
const traceData = client.tracer.exportTraces();
console.log(traceData);
```

### Cache Management

```javascript
// Get cache statistics
const cacheStats = client.cache.getStats();
console.log(cacheStats);
// {
//   size: 8,
//   maxSize: 100,
//   hitRate: 75.5,
//   hits: 45,
//   misses: 15
// }

// Clear cache
client.clearCache();

// Get cache entries
const entries = client.cache.getEntries();
console.log(entries);
```

### Rate Limiting

```javascript
// Check rate limit status
const rateStats = client.rateLimiter.getStats();
console.log(rateStats);
// {
//   currentTokens: 85,
//   maxTokens: 110,
//   utilization: 22.7,
//   nextRefill: 1640995200000
// }

// Get wait time for next request
const waitTime = client.rateLimiter.getWaitTime();
if (waitTime > 0) {
  console.log(`Wait ${waitTime}ms before next request`);
}
```

## 📊 Centralized Systems

### Logging System

The SDK provides centralized logging with:

- **Structured Logging**: Consistent log format with metadata
- **Trace Correlation**: Automatic trace ID inclusion
- **Multiple Outputs**: Console, memory, and remote logging
- **Log Levels**: ERROR, WARN, INFO, DEBUG, TRACE
- **Data Sanitization**: Automatic sensitive data removal

```javascript
// Configure logging
client.updateConfig({
  logging: {
    level: 'debug',
    remoteLogging: true,
    includeTraceId: true
  }
});

// Custom remote logger
client.logger.setRemoteLogger(async (logEntry) => {
  await fetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify(logEntry)
  });
});
```

### Tracing System

Comprehensive tracing for performance monitoring:

- **Operation Tracing**: Track API calls and processing time
- **Metrics Collection**: Automatic metrics gathering
- **Trace Export**: Export traces for analysis
- **Session Tracking**: Correlate traces by session
- **Event Recording**: Record events within traces

```javascript
// Get comprehensive tracing stats
const traceStats = client.getTraceStats();

// Filter traces by operation
const analysisTraces = client.tracer.getTracesByOperation('analyze_text', 10);

// Export all trace data
const exportData = client.tracer.exportTraces({
  includeActive: true,
  includeMetrics: true
});
```

### Configuration Management

Dynamic configuration with validation:

- **Dot Notation**: Access nested config with `config.get('api.timeout')`
- **Validation**: Automatic config validation
- **Persistence**: Optional localStorage persistence
- **Change Listeners**: React to config changes
- **Deep Merging**: Safe config updates

```javascript
// Path-based access
const timeout = client.config.get('api.timeout');
const logLevel = client.config.get('logging.level', 'info');

// Update nested config
client.config.update({
  api: { timeout: 45000 },
  cache: { ttl: 600000 }
});

// Listen for changes
client.config.addListener('api.timeout', (path, value) => {
  console.log(`API timeout changed to ${value}ms`);
});
```

## 🚨 Error Handling

### Error Types

```javascript
try {
  const result = await client.analyzeText("Sample text");
} catch (error) {
  switch (error.code) {
    case 'INVALID_API_KEY':
      console.error('Invalid API key provided');
      break;
    case 'RATE_LIMIT_EXCEEDED':
      console.error('Rate limit exceeded, try again later');
      break;
    case 'TEXT_TOO_LONG':
      console.error('Text exceeds maximum length');
      break;
    case 'NETWORK_ERROR':
      console.error('Network error:', error.message);
      break;
    case 'TIMEOUT_ERROR':
      console.error('Request timed out');
      break;
    default:
      console.error('Unknown error:', error.message);
  }
}
```

### Error Recovery

```javascript
// Automatic retry with exponential backoff
client.updateConfig({
  retryAttempts: 3,
  retryDelay: 1000
});

// Manual error recovery
async function analyzeWithRetry(text, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.analyzeText(text);
    } catch (error) {
      if (attempt === maxRetries) throw error;

      // Wait before retry
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

## 🧪 Testing

### Unit Tests

```javascript
// Test configuration validation
describe('ConfigManager', () => {
  test('validates API key format', () => {
    const config = new ConfigManager();
    expect(() => config.set('apiKey', 'invalid')).toThrow();
  });
});

// Test input validation
describe('InputValidator', () => {
  test('validates text length', () => {
    const validator = new InputValidator();
    expect(() => validator.validateText('')).toThrow();
  });
});
```

### Integration Tests

```javascript
describe('AiGuardianClient', () => {
  let client;

  beforeEach(() => {
    client = new AiGuardianClient({
      apiKey: 'test-key',
      // Mock configuration for testing
    });
  });

  test('analyzes text successfully', async () => {
    const result = await client.analyzeText('Sample text for analysis');
    expect(result.success).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  test('handles batch analysis', async () => {
    const texts = ['Text 1', 'Text 2', 'Text 3'];
    const results = await client.analyzeBatch(texts);
    expect(results).toHaveLength(3);
  });
});
```

## 🔄 Migration Guide

### From Extension API

If you're migrating from the Chrome extension API:

```javascript
// Old extension API
chrome.runtime.sendMessage({
  type: "ANALYZE_TEXT",
  payload: "text to analyze"
}, (response) => {
  console.log(response);
});

// New SDK API
const client = new AiGuardianClient({ apiKey: 'your-key' });
const result = await client.analyzeText("text to analyze");
console.log(result);
```

### Configuration Migration

```javascript
// Old config format
const oldConfig = {
  gateway_url: 'https://api.example.com',
  api_key: 'your-key',
  timeout: 30000
};

// New config format
const newConfig = {
  baseUrl: oldConfig.gateway_url,
  apiKey: oldConfig.api_key,
  timeout: oldConfig.timeout
};

const client = new AiGuardianClient(newConfig);
```

## 📚 API Reference

### AiGuardianClient

#### Constructor
```javascript
new AiGuardianClient(config?: object)
```

#### Methods

##### `analyzeText(text, options?)`
Analyzes a single text for bias and content issues.

**Parameters:**
- `text` (string): Text to analyze (10-10000 characters)
- `options` (object, optional): Analysis options
  - `guards` (array): Specific guards to run
  - `confidence` (number): Minimum confidence threshold
  - `cache` (boolean): Whether to use cache

**Returns:** Promise\<AnalysisResult\>

##### `analyzeBatch(texts, options?)`
Analyzes multiple texts concurrently.

**Parameters:**
- `texts` (array): Array of texts to analyze
- `options` (object, optional): Analysis options

**Returns:** Promise\<Array\<AnalysisResult\>\>

##### `healthCheck()`
Tests API connectivity and health.

**Returns:** Promise\<HealthStatus\>

##### `getGuardStatus()`
Gets status of guard services.

**Returns:** Promise\<GuardStatus\>

##### `getTraceStats()`
Gets tracing statistics.

**Returns:** TraceStats

##### `getConfig()`
Gets current configuration.

**Returns:** object

##### `updateConfig(updates)`
Updates configuration.

**Parameters:**
- `updates` (object): Configuration updates

##### `clearCache()`
Clears all cached data.

### Logger

#### Methods

##### `error(message, metadata?)`
Logs error message.

##### `warn(message, metadata?)`
Logs warning message.

##### `info(message, metadata?)`
Logs info message.

##### `debug(message, metadata?)`
Logs debug message.

##### `trace(message, metadata?)`
Logs trace message.

### Tracer

#### Methods

##### `startTrace(operation, metadata?)`
Starts a trace.

**Returns:** string (trace ID)

##### `endTrace(operation, traceId, result?)`
Ends a trace.

##### `getStats()`
Gets trace statistics.

**Returns:** TraceStats

### ConfigManager

#### Methods

##### `get(path, defaultValue?)`
Gets configuration value by path.

##### `set(path, value)`
Sets configuration value by path.

##### `update(updates)`
Updates multiple configuration values.

##### `addListener(path, callback)`
Adds configuration change listener.

**Returns:** string (listener ID)

##### `removeListener(listenerId)`
Removes configuration change listener.

## 🆘 Support

### Getting Help

- **Documentation**: Full API reference and guides
- **GitHub Issues**: Report bugs and request features
- **Discord Community**: Real-time support and discussions
- **Email Support**: support@aiguardian.ai

### Common Issues

#### "Invalid API key" Error
```javascript
// Ensure your API key is correct
const client = new AiGuardianClient({
  apiKey: 'your-valid-api-key-here'
});
```

#### "Rate limit exceeded" Error
```javascript
// Check your rate limit status
const stats = client.rateLimiter.getStats();
console.log(`Requests remaining: ${stats.currentTokens}`);

// Wait for reset or reduce request frequency
const waitTime = client.rateLimiter.getWaitTime();
if (waitTime > 0) {
  setTimeout(() => {
    // Retry request
  }, waitTime);
}
```

#### "Text too short/long" Error
```javascript
// Validate text length before sending
const text = "Your text here";
if (text.length < 10) {
  console.error('Text must be at least 10 characters');
} else if (text.length > 10000) {
  console.error('Text must not exceed 10000 characters');
} else {
  const result = await client.analyzeText(text);
}
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 🔗 Links

- [Website](https://aiguardian.ai)
- [Dashboard](https://dashboard.aiguardian.ai)
- [API Documentation](https://docs.aiguardian.ai)
- [GitHub](https://github.com/aiguardian/sdk)
- [NPM](https://npmjs.com/package/@aiguardian/sdk)

---

**Built with ❤️ by the AiGuardian team**
