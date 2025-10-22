/**
 * Unit Tests for Gateway Module
 */

import { testRunner } from './test-runner.js';
import { AIGuardiansGateway } from '../../src/gateway.js';

const { test, assert, assertEqual, assertTrue, assertFalse, assertThrows } = testRunner;

/**
 * Test Gateway Class
 */
test('Gateway constructor initializes correctly', () => {
  const gateway = new AIGuardiansGateway();
  
  assertTrue(gateway.config, 'Config should be initialized');
  assertTrue(gateway.config.gatewayUrl, 'Gateway URL should be set');
  assertTrue(gateway.config.timeout > 0, 'Timeout should be positive');
  assertTrue(gateway.config.retryAttempts > 0, 'Retry attempts should be positive');
});

test('Gateway sanitizes request data correctly', () => {
  const gateway = new AIGuardiansGateway();
  
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
  const gateway = new AIGuardiansGateway();
  
  // Valid request
  assertThrows(() => {
    gateway.validateRequest('analyze', { text: 'test' });
  }, null, 'Valid request should not throw');
  
  // Invalid endpoint
  assertThrows(() => {
    gateway.validateRequest('invalid', {});
  }, 'Invalid endpoint', 'Invalid endpoint should throw');
  
  // Invalid payload for analyze
  assertThrows(() => {
    gateway.validateRequest('analyze', {});
  }, 'text field is required', 'Missing text should throw');
});

test('Gateway handles errors correctly', () => {
  const gateway = new AIGuardiansGateway();
  
  const error = new Error('Test error');
  const context = { endpoint: 'test', payload: {} };
  
  const errorInfo = gateway.handleError(error, context);
  
  assertEqual(errorInfo.message, 'Test error', 'Error message should be preserved');
  assertTrue(errorInfo.context, 'Context should be included');
  assertEqual(errorInfo.context.endpoint, 'test', 'Context endpoint should be preserved');
});

test('Gateway generates unique request IDs', () => {
  const gateway = new AIGuardiansGateway();
  
  const id1 = gateway.generateRequestId();
  const id2 = gateway.generateRequestId();
  
  assertTrue(id1.length > 0, 'Request ID should not be empty');
  assertTrue(id2.length > 0, 'Request ID should not be empty');
  assertNotEqual(id1, id2, 'Request IDs should be unique');
});

test('Gateway sanitizes payload for logging', () => {
  const gateway = new AIGuardiansGateway();
  
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



