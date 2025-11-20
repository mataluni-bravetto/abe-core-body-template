/**
 * Unit Tests for Gateway Score Extraction Optimization
 * Tests the optimized score extraction order, ScoreUtils functions, and edge cases
 */

import { testRunner } from './test-runner.js';

const { test, assertEqual, assertTrue, assertFalse, assertNull } = testRunner;

/**
 * Test optimized extraction order - popup_data.bias_score prioritized
 */
test('Should prioritize popup_data.bias_score for BiasGuard', () => {
  const gateway = new window.AiGuardianGateway();
  
  const response = {
    success: true,
    service_type: 'biasguard',
    data: {
      bias_score: 0.5,
      popup_data: { bias_score: 0.75 },
      raw_response: [{ bias_score: 0.6 }]
    }
  };
  
  const result = gateway.validateApiResponse(response, 'analyze');
  
  assertTrue(result.isValid, 'Response should be valid');
  assertEqual(result.transformedResponse.score, 0.75, 'Should use popup_data.bias_score (0.75)');
  // Note: scoreSource is not exposed in transformedResponse, but we can verify the score is correct
});

/**
 * Test string score handling
 */
test('Should parse valid string scores correctly', () => {
  const gateway = new window.AiGuardianGateway();
  
  const testCases = [
    { input: { data: { bias_score: '0.75' } }, expected: 0.75 },
    { input: { data: { bias_score: '0' } }, expected: 0 },
    { input: { data: { bias_score: '1' } }, expected: 1 },
    { input: { data: { bias_score: '0.5' } }, expected: 0.5 },
  ];
  
  testCases.forEach(({ input, expected }) => {
    const response = {
      success: true,
      service_type: 'biasguard',
      ...input
    };
    
    const result = gateway.validateApiResponse(response, 'analyze');
    assertTrue(result.isValid, 'Response should be valid');
    assertEqual(result.transformedResponse.score, expected, `String "${input.data.bias_score}" should parse to ${expected}`);
  });
});

/**
 * Test invalid string scores
 */
test('Should handle invalid string scores', () => {
  const gateway = new window.AiGuardianGateway();
  
  const invalidCases = [
    { data: { bias_score: 'N/A' } },
    { data: { bias_score: '' } },
    { data: { bias_score: 'invalid' } },
    { data: { bias_score: 'n/a' } },
  ];
  
  invalidCases.forEach((input) => {
    const response = {
      success: true,
      service_type: 'biasguard',
      ...input
    };
    
    const result = gateway.validateApiResponse(response, 'analyze');
    // Invalid strings should result in null score
    assertNull(result.transformedResponse.score, `Invalid string "${input.data.bias_score}" should result in null score`);
  });
});

/**
 * Test score clamping for out-of-range values
 */
test('Should clamp out-of-range scores to [0, 1]', () => {
  const gateway = new window.AiGuardianGateway();
  
  const testCases = [
    { input: { data: { bias_score: 1.5 } }, expected: 1 },
    { input: { data: { bias_score: -0.5 } }, expected: 0 },
    { input: { data: { bias_score: 2.0 } }, expected: 1 },
    { input: { data: { bias_score: -1.0 } }, expected: 0 },
    { input: { data: { bias_score: '1.5' } }, expected: 1 },
    { input: { data: { bias_score: '-0.5' } }, expected: 0 },
  ];
  
  testCases.forEach(({ input, expected }) => {
    const response = {
      success: true,
      service_type: 'biasguard',
      ...input
    };
    
    const result = gateway.validateApiResponse(response, 'analyze');
    assertTrue(result.isValid, 'Response should be valid');
    assertEqual(result.transformedResponse.score, expected, `Score ${input.data.bias_score} should be clamped to ${expected}`);
  });
});

/**
 * Test edge cases: NaN, Infinity, boolean
 */
test('Should handle edge cases correctly', () => {
  const gateway = new window.AiGuardianGateway();
  
  // NaN should result in null
  const nanResponse = {
    success: true,
    service_type: 'biasguard',
    data: { bias_score: NaN }
  };
  const nanResult = gateway.validateApiResponse(nanResponse, 'analyze');
  assertNull(nanResult.transformedResponse.score, 'NaN should result in null score');
  
  // Infinity should result in null
  const infResponse = {
    success: true,
    service_type: 'biasguard',
    data: { bias_score: Infinity }
  };
  const infResult = gateway.validateApiResponse(infResponse, 'analyze');
  assertNull(infResult.transformedResponse.score, 'Infinity should result in null score');
  
  // Boolean true should convert to 1.0
  const trueResponse = {
    success: true,
    service_type: 'biasguard',
    data: { bias_score: true }
  };
  const trueResult = gateway.validateApiResponse(trueResponse, 'analyze');
  assertEqual(trueResult.transformedResponse.score, 1.0, 'Boolean true should convert to 1.0');
  
  // Boolean false should convert to 0.0
  const falseResponse = {
    success: true,
    service_type: 'biasguard',
    data: { bias_score: false }
  };
  const falseResult = gateway.validateApiResponse(falseResponse, 'analyze');
  assertEqual(falseResult.transformedResponse.score, 0.0, 'Boolean false should convert to 0.0');
});

/**
 * Test extraction order fallback
 */
test('Should fallback to data.bias_score when popup_data.bias_score is missing', () => {
  const gateway = new window.AiGuardianGateway();
  
  const response = {
    success: true,
    service_type: 'biasguard',
    data: {
      bias_score: 0.6,
      // No popup_data
    }
  };
  
  const result = gateway.validateApiResponse(response, 'analyze');
  assertTrue(result.isValid, 'Response should be valid');
  assertEqual(result.transformedResponse.score, 0.6, 'Should fallback to data.bias_score');
});

/**
 * Test missing score handling
 */
test('Should return null score when no score fields are present', () => {
  const gateway = new window.AiGuardianGateway();
  
  const response = {
    success: true,
    service_type: 'biasguard',
    data: {
      // No score fields
      bias_type: 'gender'
    }
  };
  
  const result = gateway.validateApiResponse(response, 'analyze');
  assertTrue(result.isValid, 'Response should be valid');
  assertNull(result.transformedResponse.score, 'Should return null when no score fields present');
});

/**
 * Test valid zero score
 */
test('Should handle valid zero score correctly', () => {
  const gateway = new window.AiGuardianGateway();
  
  const response = {
    success: true,
    service_type: 'biasguard',
    data: {
      bias_score: 0,
      bias_type: 'none'
    }
  };
  
  const result = gateway.validateApiResponse(response, 'analyze');
  assertTrue(result.isValid, 'Response should be valid');
  assertEqual(result.transformedResponse.score, 0, 'Zero score should be preserved (not null)');
});

/**
 * Test extraction from raw_response fallback
 */
test('Should extract score from raw_response when primary fields missing', () => {
  const gateway = new window.AiGuardianGateway();
  
  const response = {
    success: true,
    service_type: 'biasguard',
    data: {
      raw_response: [{ bias_score: 0.8 }]
      // No popup_data or top-level bias_score
    }
  };
  
  const result = gateway.validateApiResponse(response, 'analyze');
  assertTrue(result.isValid, 'Response should be valid');
  assertEqual(result.transformedResponse.score, 0.8, 'Should extract from raw_response[0].bias_score');
});

/**
 * Test is_poisoned fallback (backward compatibility)
 */
test('Should use is_poisoned fallback when bias_score missing', () => {
  const gateway = new window.AiGuardianGateway();
  
  // Test is_poisoned = false
  const falseResponse = {
    success: true,
    service_type: 'biasguard',
    data: {
      raw_response: [{ is_poisoned: false }]
      // No bias_score field
    }
  };
  
  const falseResult = gateway.validateApiResponse(falseResponse, 'analyze');
  assertTrue(falseResult.isValid, 'Response should be valid');
  assertEqual(falseResult.transformedResponse.score, 0, 'is_poisoned=false should result in score 0');
  
  // Test is_poisoned = true with confidence
  const trueResponse = {
    success: true,
    service_type: 'biasguard',
    data: {
      raw_response: [{ is_poisoned: true, confidence: 0.7 }]
      // No bias_score field
    }
  };
  
  const trueResult = gateway.validateApiResponse(trueResponse, 'analyze');
  assertTrue(trueResult.isValid, 'Response should be valid');
  assertEqual(trueResult.transformedResponse.score, 0.7, 'is_poisoned=true with confidence should use confidence as score');
});

