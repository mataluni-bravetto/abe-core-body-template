/**
 * Unit Tests for String Optimizer Module
 */

import { testRunner } from './test-runner.js';
import { StringOptimizer } from '../../src/string-optimizer.js';

const { test, assert, assertEqual, assertTrue, assertFalse, assertThrows } = testRunner;

/**
 * Test String Optimizer Class
 */
test('StringOptimizer.optimizedReplace works correctly', () => {
  const str = 'Hello <script>alert("xss")</script> World';
  const result = StringOptimizer.optimizedReplace(str, /<script[^>]*>.*?<\/script>/gi, '');
  
  assertFalse(result.includes('<script>'), 'Script tags should be removed');
  assertTrue(result.includes('Hello'), 'Other text should be preserved');
  assertTrue(result.includes('World'), 'Other text should be preserved');
});

test('StringOptimizer.safeSubstring handles bounds correctly', () => {
  const str = 'Hello World';
  
  // Normal substring
  assertEqual(StringOptimizer.safeSubstring(str, 0, 5), 'Hello', 'Normal substring should work');
  
  // Out of bounds start
  assertEqual(StringOptimizer.safeSubstring(str, -1, 5), 'Hello', 'Negative start should be clamped');
  
  // Out of bounds end
  assertEqual(StringOptimizer.safeSubstring(str, 0, 20), 'Hello World', 'Large end should be clamped');
  
  // Empty string
  assertEqual(StringOptimizer.safeSubstring('', 0, 5), '', 'Empty string should return empty');
});

test('StringOptimizer.optimizedSanitize removes dangerous content', () => {
  const maliciousStr = '<script>alert("xss")</script><iframe src="javascript:alert(1)"></iframe>Hello World';
  const result = StringOptimizer.optimizedSanitize(maliciousStr);
  
  assertFalse(result.includes('<script>'), 'Script tags should be removed');
  assertFalse(result.includes('<iframe>'), 'Iframe tags should be removed');
  assertFalse(result.includes('javascript:'), 'JavaScript URLs should be removed');
  assertTrue(result.includes('Hello World'), 'Safe text should be preserved');
});

test('StringOptimizer.removeHtmlTags removes HTML tags', () => {
  const htmlStr = '<div><p>Hello</p><span>World</span></div>';
  const result = StringOptimizer.removeHtmlTags(htmlStr);
  
  assertFalse(result.includes('<div>'), 'Div tags should be removed');
  assertFalse(result.includes('<p>'), 'P tags should be removed');
  assertFalse(result.includes('<span>'), 'Span tags should be removed');
  assertTrue(result.includes('Hello'), 'Text content should be preserved');
  assertTrue(result.includes('World'), 'Text content should be preserved');
});

test('StringOptimizer.truncateWithEllipsis truncates long strings', () => {
  const longStr = 'This is a very long string that should be truncated';
  const result = StringOptimizer.truncateWithEllipsis(longStr, 20);
  
  assertTrue(result.length <= 20, 'Result should not exceed max length');
  assertTrue(result.endsWith('...'), 'Should end with ellipsis');
  assertTrue(result.startsWith('This is a very'), 'Should start with original text');
});

test('StringOptimizer.isValidString validates strings correctly', () => {
  // Valid strings
  assertTrue(StringOptimizer.isValidString('Hello'), 'Valid string should return true');
  assertTrue(StringOptimizer.isValidString('a'), 'Single character should be valid');
  
  // Invalid inputs
  assertFalse(StringOptimizer.isValidString(''), 'Empty string should be invalid');
  assertFalse(StringOptimizer.isValidString(null), 'Null should be invalid');
  assertFalse(StringOptimizer.isValidString(undefined), 'Undefined should be invalid');
  assertFalse(StringOptimizer.isValidString(123), 'Number should be invalid');
  
  // Too long string
  const longStr = 'a'.repeat(1001);
  assertFalse(StringOptimizer.isValidString(longStr, 1000), 'String too long should be invalid');
});

test('StringOptimizer.getSafeLength returns correct length', () => {
  assertEqual(StringOptimizer.getSafeLength('Hello'), 5, 'Normal string should return correct length');
  assertEqual(StringOptimizer.getSafeLength(''), 0, 'Empty string should return 0');
  assertEqual(StringOptimizer.getSafeLength(null), 0, 'Null should return 0');
  
  const longStr = 'a'.repeat(1001);
  assertEqual(StringOptimizer.getSafeLength(longStr, 1000), 1000, 'Long string should be clamped');
});

test('StringOptimizer.safeConcat concatenates safely', () => {
  const strings = ['Hello', ' ', 'World'];
  const result = StringOptimizer.safeConcat(strings, 20);
  
  assertEqual(result, 'Hello World', 'Should concatenate correctly');
  assertTrue(result.length <= 20, 'Should not exceed max length');
});

test('StringOptimizer.safeSplit splits correctly', () => {
  const str = 'Hello,World,Test';
  const result = StringOptimizer.safeSplit(str, ',');
  
  assertEqual(result.length, 3, 'Should split into 3 parts');
  assertEqual(result[0], 'Hello', 'First part should be correct');
  assertEqual(result[1], 'World', 'Second part should be correct');
  assertEqual(result[2], 'Test', 'Third part should be correct');
});

test('StringOptimizer.safeTrim trims correctly', () => {
  assertEqual(StringOptimizer.safeTrim('  Hello  '), 'Hello', 'Should trim spaces');
  assertEqual(StringOptimizer.safeTrim('Hello'), 'Hello', 'Should not affect already trimmed');
  assertEqual(StringOptimizer.safeTrim(''), '', 'Empty string should remain empty');
});

// Run tests
testRunner.run().then(results => {
  Logger.info('[String Optimizer Tests] Completed:', results.summary);
}).catch(error => {
  Logger.error('[String Optimizer Tests] Failed:', error);
});



