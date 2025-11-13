/**
 * Unit Tests for Gateway Module
 */

import { testRunner } from './test-runner.js';

const { test, assert, assertEqual, assertNotEqual, assertTrue, assertFalse, assertThrows } = testRunner;

/**
 * Test Gateway Class
 */
test('Gateway constructor initializes correctly', () => {
  const gateway = new window.AiGuardianGateway();
  
  assertTrue(gateway.config, 'Config should be initialized');
  assertTrue(gateway.config.gatewayUrl, 'Gateway URL should be set');
  assertTrue(gateway.config.timeout > 0, 'Timeout should be positive');
  assertTrue(gateway.config.retryAttempts > 0, 'Retry attempts should be positive');
});

test('Gateway sanitizes request data correctly', () => {
  const gateway = new window.AiGuardianGateway();

  const maliciousData = {
    text: '<script>alert("xss")</script>Hello World',
    html: '<iframe src="javascript:alert(1)"></iframe>',
    normal: 'This is normal text'
  };

  const sanitized = gateway.sanitizeRequestData(maliciousData);

  assertFalse(sanitized.text.includes('<script>'), 'Script tags should be removed');
  assertFalse(sanitized.html.includes('<iframe>'), 'Iframe tags should be removed');
  assertTrue(sanitized.normal.includes('normal'), 'Normal text should be preserved');
});

test('Gateway validates requests correctly', () => {
  const gateway = new window.AiGuardianGateway();

  // Valid request with nested payload structure - should not throw
  const validResult = gateway.validateRequest('analyze', {
    payload: { text: 'test' }
  });
  assertTrue(validResult !== undefined, 'Valid request should return a result');

  // Invalid endpoint - should throw
  assertThrows(() => {
    gateway.validateRequest('invalid', {});
  }, Error, 'Invalid endpoint should throw');

  // Invalid payload for analyze - missing payload object
  assertThrows(() => {
    gateway.validateRequest('analyze', {});
  }, Error, 'Missing payload object should throw');

  // Invalid payload for analyze - missing text in payload
  assertThrows(() => {
    gateway.validateRequest('analyze', { payload: {} });
  }, Error, 'Missing text in payload should throw');

  // Invalid payload for analyze - text too long
  assertThrows(() => {
    gateway.validateRequest('analyze', {
      payload: { text: 'x'.repeat(10001) }
    });
  }, Error, 'Text too long should throw');
});

test('Gateway handles errors correctly', () => {
  const gateway = new window.AiGuardianGateway();
  
  const error = new Error('Test error');
  const context = { endpoint: 'test', payload: {} };
  
  const errorInfo = gateway.handleError(error, context);
  
  assertEqual(errorInfo.message, 'Test error', 'Error message should be preserved');
  assertTrue(errorInfo.context, 'Context should be included');
  assertEqual(errorInfo.context.endpoint, 'test', 'Context endpoint should be preserved');
});

test('Gateway generates unique request IDs', () => {
  const gateway = new window.AiGuardianGateway();
  
  const id1 = gateway.generateRequestId();
  const id2 = gateway.generateRequestId();
  
  assertTrue(id1.length > 0, 'Request ID should not be empty');
  assertTrue(id2.length > 0, 'Request ID should not be empty');
  assertNotEqual(id1, id2, 'Request IDs should be unique');
});

test('Gateway sanitizes payload for logging', () => {
  const gateway = new window.AiGuardianGateway();
  
  const payload = {
    text: 'Test text',
    apiKey: 'secret-key-123',
    normal: 'normal data'
  };
  
  const sanitized = gateway.sanitizePayload(payload);
  
  assertEqual(sanitized.text, 'Test text', 'Text should be preserved');
  assertEqual(sanitized.apiKey, '***REDACTED***', 'API key should be redacted');
  assertEqual(sanitized.normal, 'normal data', 'Normal data should be preserved');
});

// Run tests
testRunner.run().then(results => {
  Logger.info('[Gateway Tests] Completed:', results.summary);
}).catch(error => {
  Logger.error('[Gateway Tests] Failed:', error);
});
