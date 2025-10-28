/**
 * AiGuardian SDK - Basic Tests
 *
 * Unit tests for core SDK functionality
 */

import { AiGuardianClient } from '../src/client.js';
import { Logger } from '../src/logging.js';
import { ConfigManager } from '../src/config.js';
import { InputValidator } from '../src/input-validator.js';

// Mock fetch for testing
global.fetch = jest.fn();

describe('AiGuardianClient', () => {
  let client;

  beforeEach(() => {
    // Reset mocks
    fetch.mockClear();

    // Create client with test configuration
    client = new AiGuardianClient({
      apiKey: 'test-key',
      baseUrl: 'https://api.test.com',
      logging: { enabled: false }, // Disable logging for tests
      tracing: { enabled: false },
      cache: { enabled: false },
      rateLimit: { enabled: false }
    });
  });

  describe('Initialization', () => {
    test('should create client with default config', () => {
      const defaultClient = new AiGuardianClient();
      expect(defaultClient).toBeInstanceOf(AiGuardianClient);
      expect(defaultClient.getVersion()).toBe('1.0.0');
    });

    test('should initialize with custom config', () => {
      expect(client.getConfig().apiKey).toBe('test-key');
      expect(client.getConfig().baseUrl).toBe('https://api.test.com');
    });
  });

  describe('Configuration', () => {
    test('should get configuration values', () => {
      expect(client.getConfig().apiKey).toBe('test-key');
      expect(client.getConfig().timeout).toBe(30000);
    });

    test('should update configuration', () => {
      client.updateConfig({ timeout: 45000 });
      expect(client.getConfig().timeout).toBe(45000);
    });
  });

  describe('Input Validation', () => {
    test('should validate text input', async () => {
      // Mock successful API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          score: 0.5,
          analysis: {
            bias_type: 'neutral',
            confidence: 0.8,
            word_count: 10
          },
          timestamp: new Date().toISOString()
        })
      });

      const result = await client.analyzeText('This is a test text for analysis.');
      expect(result.success).toBe(true);
      expect(result.score).toBe(0.5);
    });

    test('should reject invalid text', async () => {
      await expect(client.analyzeText('Hi')).rejects.toThrow('Text must be at least 10 characters');
    });

    test('should reject empty text', async () => {
      await expect(client.analyzeText('')).rejects.toThrow('Text is required');
    });
  });

  describe('API Communication', () => {
    test('should make API call with correct parameters', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          score: 0.3,
          analysis: { bias_type: 'neutral', confidence: 0.9 },
          timestamp: new Date().toISOString()
        })
      });

      await client.analyzeText('This is neutral content for testing.');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.com/api/v1/analyze',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-key'
          })
        })
      );
    });

    test('should handle API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      await expect(client.analyzeText('Test text')).rejects.toThrow();
    });
  });

  describe('Health Check', () => {
    test('should perform health check', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          status: 'healthy',
          version: '1.0.0'
        })
      });

      const health = await client.healthCheck();
      expect(health.status).toBe('healthy');
      expect(health).toHaveProperty('responseTime');
    });
  });

  describe('Batch Analysis', () => {
    test('should analyze multiple texts', async () => {
      const mockResponse = {
        success: true,
        score: 0.4,
        analysis: { bias_type: 'neutral', confidence: 0.8 },
        timestamp: new Date().toISOString()
      };

      fetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockResponse) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockResponse) });

      const texts = ['First test text.', 'Second test text.'];
      const results = await client.analyzeBatch(texts);

      expect(results).toHaveLength(2);
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    test('should reject invalid batch input', async () => {
      await expect(client.analyzeBatch([])).rejects.toThrow('Batch must contain at least one text');
    });
  });

  describe('Caching', () => {
    test('should use cache when enabled', async () => {
      const cacheClient = new AiGuardianClient({
        apiKey: 'test-key',
        cache: { enabled: true, ttl: 60000 }
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          score: 0.5,
          analysis: { bias_type: 'neutral', confidence: 0.8 },
          timestamp: new Date().toISOString()
        })
      });

      // First call should hit API
      await cacheClient.analyzeText('Test text for caching');
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await cacheClient.analyzeText('Test text for caching');
      expect(fetch).toHaveBeenCalledTimes(1); // Still 1 call
    });
  });

  describe('Tracing', () => {
    test('should collect trace statistics', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          score: 0.5,
          analysis: { bias_type: 'neutral', confidence: 0.8 },
          timestamp: new Date().toISOString()
        })
      });

      await client.analyzeText('Test text for tracing');

      const stats = client.getTraceStats();
      expect(stats.totalOperations).toBeGreaterThan(0);
      expect(stats).toHaveProperty('averageDuration');
    });
  });
});

describe('Logger', () => {
  let logger;

  beforeEach(() => {
    logger = new Logger({ enabled: false }); // Disable for testing
  });

  test('should create log entries', () => {
    const entry = logger.createLogEntry('info', 'Test message', { key: 'value' });
    expect(entry.level).toBe('INFO');
    expect(entry.message).toBe('Test message');
    expect(entry).toHaveProperty('timestamp');
  });

  test('should sanitize sensitive data', () => {
    const entry = logger.createLogEntry('info', 'Test', {
      apiKey: 'secret-key',
      password: 'secret',
      normalField: 'normal'
    });

    expect(entry.apiKey).toBe('[REDACTED]');
    expect(entry.password).toBe('[REDACTED]');
    expect(entry.normalField).toBe('normal');
  });
});

describe('ConfigManager', () => {
  let config;

  beforeEach(() => {
    config = new ConfigManager({
      apiKey: 'test-key',
      timeout: 30000
    });
  });

  test('should get configuration values', () => {
    expect(config.get('apiKey')).toBe('test-key');
    expect(config.get('timeout')).toBe(30000);
    expect(config.get('nonexistent', 'default')).toBe('default');
  });

  test('should set configuration values', () => {
    config.set('timeout', 45000);
    expect(config.get('timeout')).toBe(45000);
  });

  test('should validate configuration', () => {
    expect(() => config.set('apiKey', '')).toThrow();
    expect(() => config.set('timeout', -1)).toThrow();
  });
});

describe('InputValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new InputValidator();
  });

  test('should validate text', () => {
    expect(() => validator.validateText('Short')).toThrow();
    expect(() => validator.validateText('This is a valid text for testing purposes.')).not.toThrow();
  });

  test('should validate API key', () => {
    expect(() => validator.validateApiKey('')).toThrow();
    expect(() => validator.validateApiKey('valid-api-key-123')).not.toThrow();
  });

  test('should validate URL', () => {
    expect(() => validator.validateUrl('http://example.com')).toThrow();
    expect(() => validator.validateUrl('https://example.com')).not.toThrow();
  });
});
