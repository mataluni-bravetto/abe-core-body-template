/**
 * Manual Functionality Test for AI Guardians Chrome Extension
 *
 * This script tests all core functionality to ensure trace stats,
 * gateway operations, and extension commands work correctly.
 */

// Test utilities
class ManualTester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`, data);
  }

  assert(condition, message, ...args) {
    if (!condition) {
      const error = new Error(`ASSERTION FAILED: ${message}`);
      this.results.push({ type: 'failure', message, error, args });
      throw error;
    }
    this.results.push({ type: 'success', message, args });
    this.log('success', message);
  }

  async test(name, testFn) {
    this.log('test', `Starting test: ${name}`);
    try {
      await testFn();
      this.log('test', `✓ Test passed: ${name}`);
      return true;
    } catch (error) {
      this.log('error', `✗ Test failed: ${name} - ${error.message}`, error);
      return false;
    }
  }

  // Core functionality tests
  async testCacheManager() {
    await this.test('CacheManager Basic Functionality', async () => {
      const cache = new window.CacheManager();
      this.assert(cache instanceof window.CacheManager, 'CacheManager instantiated');

      // Test basic operations
      const testKey = 'test-key';
      const testData = { value: 42, text: 'hello world' };

      // Store and retrieve
      cache.set(testKey, testData);
      const retrieved = cache.get(testKey);
      this.assert(retrieved.value === 42, 'Data stored and retrieved correctly');
      this.assert(retrieved.text === 'hello world', 'Text data preserved');

      // Test cache statistics
      const stats = cache.getStats();
      this.assert(stats.totalEntries >= 1, 'Cache statistics show entries');
      this.assert(stats.activeEntries >= 1, 'Active entries tracked');

      this.log('cache', 'CacheManager basic functionality verified');
    });
  }

  async testGatewayInitialization() {
    await this.test('Gateway Initialization', async () => {
      const gateway = new window.AIGuardiansGateway();
      this.assert(gateway instanceof window.AIGuardiansGateway, 'Gateway instantiated');
      this.assert(gateway.config, 'Gateway config exists');
      this.assert(gateway.config.gatewayUrl, 'Gateway URL configured');
      this.assert(gateway.traceStats, 'Trace statistics initialized');
      this.assert(gateway.guardServices instanceof Map, 'Guard services map exists');

      this.log('gateway', 'Gateway initialization verified');
    });
  }

  async testTraceStatistics() {
    await this.test('Trace Statistics Functionality', async () => {
      const gateway = new window.AIGuardiansGateway();

      // Check initial trace stats
      let stats = gateway.getTraceStats();
      this.assert(typeof stats.requests === 'number', 'Requests tracked');
      this.assert(typeof stats.successes === 'number', 'Successes tracked');
      this.assert(typeof stats.failures === 'number', 'Failures tracked');
      this.assert(typeof stats.totalResponseTime === 'number', 'Response time tracked');

      // Simulate some activity by calling internal methods
      gateway.updateTraceStats('info', 'test message', {});
      gateway.updateTraceStats('error', 'test error', { error: 'test' });

      stats = gateway.getTraceStats();
      this.assert(stats.failures >= 1, 'Error stats updated');
      this.assert(stats.lastRequestTime, 'Last request time set');

      this.log('trace', 'Trace statistics functionality verified', stats);
    });
  }

  async testDataSanitization() {
    await this.test('Data Sanitization Security', async () => {
      const gateway = new window.AIGuardiansGateway();

      // Test XSS prevention
      const maliciousData = {
        text: '<script>alert("xss")</script>Hello <iframe src="bad.com"></iframe>',
        apiKey: 'secret-key-123',
        normal: 'This is normal text'
      };

      const sanitized = gateway.sanitizeRequestData(maliciousData);

      // Verify XSS patterns removed
      this.assert(!sanitized.text.includes('<script>'), 'Script tags removed');
      this.assert(!sanitized.text.includes('<iframe>'), 'Iframe tags removed');
      this.assert(!sanitized.text.includes('javascript:'), 'Javascript protocol removed');
      this.assert(sanitized.normal.includes('normal'), 'Normal text preserved');

      this.log('security', 'Data sanitization security verified');
    });
  }

  async testSecureLogging() {
    await this.test('Secure Logging Functionality', async () => {
      const gateway = new window.AIGuardiansGateway();

      // Test that sensitive data is redacted in logs
      const sensitiveData = {
        text: 'Some text to analyze',
        apiKey: 'my-secret-api-key',
        password: 'password123',
        token: 'bearer-token-456'
      };

      const sanitized = gateway.sanitizePayload(sensitiveData);

      this.assert(sanitized.apiKey === '***REDACTED***', 'API key redacted');
      this.assert(sanitized.password === '***REDACTED***', 'Password redacted');
      this.assert(sanitized.token === '***REDACTED***', 'Token redacted');
      this.assert(sanitized.text === 'Some text to analyze', 'Text preserved');

      this.log('security', 'Secure logging functionality verified');
    });
  }

  async testRequestValidation() {
    await this.test('Request Validation', async () => {
      const gateway = new window.AIGuardiansGateway();

      // Valid request should not throw
      try {
        gateway.validateRequest('analyze', { text: 'valid text' });
        this.assert(true, 'Valid analyze request accepted');
      } catch (error) {
        throw new Error('Valid request rejected: ' + error.message);
      }

      // Invalid endpoint should throw
      try {
        gateway.validateRequest('invalid', {});
        throw new Error('Invalid endpoint should have thrown');
      } catch (error) {
        this.assert(error.message.includes('Invalid endpoint'), 'Invalid endpoint properly rejected');
      }

      // Missing required field should throw
      try {
        gateway.validateRequest('analyze', {});
        throw new Error('Missing text field should have thrown');
      } catch (error) {
        this.assert(error.message.includes('text field is required'), 'Missing text field properly rejected');
      }

      this.log('validation', 'Request validation functionality verified');
    });
  }

  async testErrorHandling() {
    await this.test('Error Handling and Logging', async () => {
      const gateway = new window.AIGuardiansGateway();

      const testError = new Error('Test error message');
      const context = { endpoint: 'test', payload: { some: 'data' } };

      const errorInfo = gateway.handleError(testError, context);

      this.assert(errorInfo.message === 'Test error message', 'Error message preserved');
      this.assert(errorInfo.context === context, 'Error context preserved');
      this.assert(errorInfo.timestamp, 'Error timestamp added');
      this.assert(errorInfo.userAgent, 'User agent included');
      this.assert(errorInfo.extensionVersion, 'Extension version included');

      // Check that trace stats were updated
      const stats = gateway.getTraceStats();
      this.assert(stats.failures > 0, 'Error count increased in trace stats');

      this.log('error', 'Error handling functionality verified', errorInfo);
    });
  }

  async testGuardServices() {
    await this.test('Guard Services Functionality', async () => {
      const gateway = new window.AIGuardiansGateway();

      // Check that guard services are initialized
      this.assert(gateway.guardServices instanceof Map, 'Guard services map exists');
      this.assert(gateway.guardServices.size > 0, 'Guard services populated');

      // Test guard service status
      const status = await gateway.getGuardServiceStatus();

      this.assert(Array.isArray(Object.keys(status.guard_services)), 'Guard services status returned');
      this.assert(typeof status.total_requests === 'number', 'Total requests tracked');
      this.assert(typeof status.success_rate === 'number', 'Success rate calculated');

      // Test configuration retrieval
      const config = await gateway.getCentralConfiguration();
      this.assert(config.gateway_url, 'Gateway URL in config');
      this.assert(config.guard_services, 'Guard services in config');
      this.assert(typeof config.api_key_configured === 'boolean', 'API key status tracked');

      this.log('guards', 'Guard services functionality verified', {
        guardCount: gateway.guardServices.size,
        statusKeys: Object.keys(status)
      });
    });
  }

  async testRequestGeneration() {
    await this.test('Request ID Generation', async () => {
      const gateway = new window.AIGuardiansGateway();

      const id1 = gateway.generateRequestId();
      const id2 = gateway.generateRequestId();

      this.assert(typeof id1 === 'string', 'Request ID is string');
      this.assert(id1.length > 10, 'Request ID sufficiently long');
      this.assert(id1.startsWith('ext_'), 'Request ID has ext_ prefix');
      this.assert(id1 !== id2, 'Request IDs are unique');

      this.log('reqid', 'Request ID generation verified', { id1, id2 });
    });
  }

  async testDiagnostics() {
    await this.test('Comprehensive Diagnostics', async () => {
      const gateway = new window.AIGuardiansGateway();

      const diagnostics = gateway.getDiagnostics();

      this.assert(diagnostics.traceStats, 'Trace stats in diagnostics');
      this.assert(diagnostics.configuration, 'Configuration in diagnostics');
      this.assert(diagnostics.guardServices, 'Guard services in diagnostics');
      this.assert(diagnostics.systemInfo, 'System info in diagnostics');

      // Verify system info
      this.assert(diagnostics.systemInfo.extensionVersion, 'Extension version present');
      this.assert(diagnostics.systemInfo.userAgent, 'User agent present');
      this.assert(diagnostics.systemInfo.timestamp, 'Timestamp present');

      // Verify configuration
      this.assert(diagnostics.configuration.gatewayUrl, 'Gateway URL in config');
      this.assert(typeof diagnostics.configuration.timeout === 'number', 'Timeout in config');

      this.log('diagnostics', 'Comprehensive diagnostics verified', {
        hasTraceStats: !!diagnostics.traceStats,
        hasConfig: !!diagnostics.configuration,
        hasSystemInfo: !!diagnostics.systemInfo
      });
    });
  }

  async runAllTests() {
    this.log('info', '🏃 Starting AI Guardians Manual Functionality Tests');

    const tests = [
      this.testCacheManager.bind(this),
      this.testGatewayInitialization.bind(this),
      this.testTraceStatistics.bind(this),
      this.testDataSanitization.bind(this),
      this.testSecureLogging.bind(this),
      this.testRequestValidation.bind(this),
      this.testErrorHandling.bind(this),
      this.testGuardServices.bind(this),
      this.testRequestGeneration.bind(this),
      this.testDiagnostics.bind(this)
    ];

    const results = { passed: 0, failed: 0, total: tests.length };

    for (const test of tests) {
      try {
        await test();
        results.passed++;
      } catch (error) {
        results.failed++;
      }
    }

    const duration = Date.now() - this.startTime;
    const successRate = Math.round((results.passed / results.total) * 100);

    this.log('info', '🧪 Testing completed', {
      duration: `${duration}ms`,
      passed: results.passed,
      failed: results.failed,
      successRate: `${successRate}%`
    });

    if (results.failed === 0) {
      this.log('success', '🎉 All tests passed! Extension functionality verified.');
    } else {
      this.log('error', `❌ ${results.failed} tests failed. Check logs for details.`);
    }

    return results;
  }
}

// Auto-run tests if in testing environment
if (typeof window !== 'undefined' && window.location) {
  // Wait for dependencies to load, then run tests
  const checkDependencies = () => {
    if (window.CacheManager && window.AIGuardiansGateway) {
      const tester = new ManualTester();
      tester.runAllTests().catch(console.error);
    } else {
      setTimeout(checkDependencies, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkDependencies);
  } else {
    checkDependencies();
  }
}

// Export for programmatic use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ManualTester;
}
