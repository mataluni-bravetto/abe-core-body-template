/**
 * Unit Tests for String Optimizer Module
 */

import { testRunner } from './test-runner.js';

const { test, assert, assertEqual, assertTrue, assertFalse, assertThrows } = testRunner;
// Use the global StringOptimizer class and instance exposed by src/string-optimizer.js
const StringOptimizer =
  window.StringOptimizer || (typeof StringOptimizer !== 'undefined' ? StringOptimizer : null);
// Get the instance - use global instance if available, otherwise create a new one
const stringOptimizer = window.stringOptimizer || (StringOptimizer ? new StringOptimizer() : null);

/**
 * Test String Optimizer Class
 */
test('StringOptimizer.optimizedReplace works correctly', () => {
  const str = 'Hello <script>alert("xss")</script> World';
  const result = stringOptimizer.optimizedReplace(str, /<script[^>]*>.*?<\/script>/gi, '');

  assertFalse(result.includes('<script>'), 'Script tags should be removed');
  assertTrue(result.includes('Hello'), 'Other text should be preserved');
  assertTrue(result.includes('World'), 'Other text should be preserved');
});

test('StringOptimizer.safeSubstring handles bounds correctly', () => {
  const str = 'Hello World';

  // Normal substring
  assertEqual(stringOptimizer.safeSubstring(str, 0, 5), 'Hello', 'Normal substring should work');

  // Out of bounds start
  assertEqual(
    stringOptimizer.safeSubstring(str, -1, 5),
    'Hello',
    'Negative start should be clamped'
  );

  // Out of bounds end
  assertEqual(
    stringOptimizer.safeSubstring(str, 0, 20),
    'Hello World',
    'Large end should be clamped'
  );

  // Empty string
  assertEqual(stringOptimizer.safeSubstring('', 0, 5), '', 'Empty string should return empty');
});

test('StringOptimizer.optimizedSanitize removes dangerous content', () => {
  const maliciousStr =
    '<script>alert("xss")</script><iframe src="javascript:alert(1)"></iframe>Hello World';
  const result = stringOptimizer.optimizedSanitize(maliciousStr);

  assertFalse(result.includes('<script>'), 'Script tags should be removed');
  assertFalse(result.includes('<iframe>'), 'Iframe tags should be removed');
  assertFalse(result.includes('javascript:'), 'JavaScript URLs should be removed');
  assertTrue(result.includes('Hello World'), 'Safe text should be preserved');
});

test('StringOptimizer.removeHtmlTags removes HTML tags', () => {
  const htmlStr = '<div><p>Hello</p><span>World</span></div>';
  const result = stringOptimizer.removeHtmlTags(htmlStr);

  assertFalse(result.includes('<div>'), 'Div tags should be removed');
  assertFalse(result.includes('<p>'), 'P tags should be removed');
  assertFalse(result.includes('<span>'), 'Span tags should be removed');
  assertTrue(result.includes('Hello'), 'Text content should be preserved');
  assertTrue(result.includes('World'), 'Text content should be preserved');
});

test('StringOptimizer.truncateWithEllipsis truncates long strings', () => {
  const longStr = 'This is a very long string that should be truncated';
  const result = stringOptimizer.truncateWithEllipsis(longStr, 20);

  assertTrue(result.length <= 20, 'Result should not exceed max length');
  assertTrue(result.endsWith('...'), 'Should end with ellipsis');
  assertTrue(result.startsWith('This is a very'), 'Should start with original text');
});

test('StringOptimizer.isValidString validates strings correctly', () => {
  // Valid strings
  assertTrue(stringOptimizer.isValidString('Hello'), 'Valid string should return true');
  assertTrue(stringOptimizer.isValidString('a'), 'Single character should be valid');

  // Invalid inputs
  assertFalse(stringOptimizer.isValidString(''), 'Empty string should be invalid');
  assertFalse(stringOptimizer.isValidString(null), 'Null should be invalid');
  assertFalse(stringOptimizer.isValidString(undefined), 'Undefined should be invalid');
  assertFalse(stringOptimizer.isValidString(123), 'Number should be invalid');

  // Too long string
  const longStr = 'a'.repeat(1001);
  assertFalse(stringOptimizer.isValidString(longStr, 1000), 'String too long should be invalid');
});

test('StringOptimizer.getSafeLength returns correct length', () => {
  assertEqual(
    stringOptimizer.getSafeLength('Hello'),
    5,
    'Normal string should return correct length'
  );
  assertEqual(stringOptimizer.getSafeLength(''), 0, 'Empty string should return 0');
  assertEqual(stringOptimizer.getSafeLength(null), 0, 'Null should return 0');

  const longStr = 'a'.repeat(1001);
  assertEqual(stringOptimizer.getSafeLength(longStr, 1000), 1000, 'Long string should be clamped');
});

test('StringOptimizer.safeConcat concatenates safely', () => {
  const strings = ['Hello', ' ', 'World'];
  const result = stringOptimizer.safeConcat(strings, 20);

  assertEqual(result, 'Hello World', 'Should concatenate correctly');
  assertTrue(result.length <= 20, 'Should not exceed max length');
});

test('StringOptimizer.safeSplit splits correctly', () => {
  const str = 'Hello,World,Test';
  const result = stringOptimizer.safeSplit(str, ',');

  assertEqual(result.length, 3, 'Should split into 3 parts');
  assertEqual(result[0], 'Hello', 'First part should be correct');
  assertEqual(result[1], 'World', 'Second part should be correct');
  assertEqual(result[2], 'Test', 'Third part should be correct');
});

test('StringOptimizer.safeTrim trims correctly', () => {
  assertEqual(stringOptimizer.safeTrim('  Hello  '), 'Hello', 'Should trim spaces');
  assertEqual(stringOptimizer.safeTrim('Hello'), 'Hello', 'Should not affect already trimmed');
  assertEqual(stringOptimizer.safeTrim(''), '', 'Empty string should remain empty');
});

// Run tests
testRunner
  .run()
  .then((results) => {
    Logger.info('[String Optimizer Tests] Completed:', results.summary);
  })
  .catch((error) => {
    Logger.error('[String Optimizer Tests] Failed:', error);
  });
