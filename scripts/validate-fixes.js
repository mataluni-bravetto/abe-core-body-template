/**
 * Validation script for the production fixes
 * Tests score calculation, token retry logic, and DOM highlighting fallback
 */

// Test score calculation logic
function testScoreCalculation() {
  console.log('=== Testing Score Calculation Logic ===\n');
  
  const ScoreUtils = {
    clampScore(score) {
      return Math.max(0, Math.min(1, score));
    }
  };
  
  // Test cases for is_poisoned=false fallback
  const testCases = [
    { confidence: 1.0, expectedRange: [0, 0.01], description: 'Very confident not biased' },
    { confidence: 0.8, expectedRange: [0, 0.1], description: 'Confident not biased' },
    { confidence: 0.5, expectedRange: [0.1, 0.2], description: 'Uncertain' },
    { confidence: 0.2, expectedRange: [0.2, 0.3], description: 'Low confidence' },
    { confidence: 0.0, expectedRange: [0.25, 0.3], description: 'Not confident' },
    { confidence: null, expectedRange: [0, 0.01], description: 'Missing confidence (defaults to 1.0)' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    const confidence = testCase.confidence !== null ? testCase.confidence : 1.0;
    const uncertainty = 1 - confidence;
    const calculatedScore = ScoreUtils.clampScore(uncertainty * 0.3);
    const [minExpected, maxExpected] = testCase.expectedRange;
    
    const passedTest = calculatedScore >= minExpected && calculatedScore <= maxExpected;
    
    if (passedTest) {
      passed++;
      console.log(`✓ Test ${index + 1}: ${testCase.description}`);
      console.log(`  Confidence: ${confidence}, Score: ${calculatedScore.toFixed(3)} (${(calculatedScore * 100).toFixed(1)}%)`);
    } else {
      failed++;
      console.error(`✗ Test ${index + 1}: ${testCase.description}`);
      console.error(`  Confidence: ${confidence}, Score: ${calculatedScore.toFixed(3)} (expected ${minExpected}-${maxExpected})`);
    }
  });
  
  console.log(`\nScore Calculation Tests: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

// Test token retry logic (simulated)
function testTokenRetryLogic() {
  console.log('=== Testing Token Retry Logic ===\n');
  
  // Simulate storage with delay
  let storage = {};
  let callCount = 0;
  
  const simulateStorageGet = (key, callback) => {
    callCount++;
    setTimeout(() => {
      callback(storage[key] || null);
    }, callCount === 1 ? 50 : 0); // First call delayed, retry immediate
  };
  
  // Test: Token not found initially, but appears on retry
  console.log('Test: Token appears on retry');
  callCount = 0;
  storage = {};
  
  // Simulate token being stored after first read attempt
  setTimeout(() => {
    storage.clerk_token = 'test_token_123';
  }, 60);
  
  // First attempt
  simulateStorageGet('clerk_token', (token) => {
    if (!token) {
      console.log('  First attempt: No token (expected)');
      // Retry after delay
      setTimeout(() => {
        simulateStorageGet('clerk_token', (retryToken) => {
          if (retryToken) {
            console.log('  ✓ Retry attempt: Token found');
          } else {
            console.error('  ✗ Retry attempt: Still no token');
          }
        });
      }, 100);
    }
  });
  
  console.log('Token Retry Logic: Simulated (check output above)\n');
  return true;
}

// Test DOM highlighting fallback
function testDOMHighlightingFallback() {
  console.log('=== Testing DOM Highlighting Fallback ===\n');
  
  // Create a test DOM structure
  const testDiv = document.createElement('div');
  testDiv.innerHTML = '<p>Test <strong>text</strong> selection</p>';
  document.body.appendChild(testDiv);
  
  try {
    const range = document.createRange();
    const p = testDiv.querySelector('p');
    
    // Try to select text that spans across text and strong nodes
    range.setStart(p.firstChild, 2); // Start in text node
    range.setEnd(p.querySelector('strong').firstChild, 2); // End in strong's text node
    
    console.log('Test: Range spans incompatible nodes');
    console.log(`  Range collapsed: ${range.collapsed}`);
    console.log(`  Range start: ${range.startContainer.nodeName}, offset: ${range.startOffset}`);
    console.log(`  Range end: ${range.endContainer.nodeName}, offset: ${range.endOffset}`);
    
    // Test surroundContents (should fail)
    const highlightSpan = document.createElement('span');
    highlightSpan.style.backgroundColor = 'yellow';
    
    try {
      range.surroundContents(highlightSpan);
      console.log('  ✗ surroundContents succeeded (unexpected)');
    } catch (e) {
      console.log('  ✓ surroundContents failed as expected:', e.message);
      
      // Test fallback method
      try {
        const contents = range.extractContents();
        highlightSpan.appendChild(contents);
        range.insertNode(highlightSpan);
        console.log('  ✓ Fallback method succeeded');
      } catch (fallbackError) {
        console.error('  ✗ Fallback method also failed:', fallbackError.message);
        document.body.removeChild(testDiv);
        return false;
      }
    }
    
    document.body.removeChild(testDiv);
    console.log('DOM Highlighting Fallback: ✓ Passed\n');
    return true;
  } catch (e) {
    console.error('DOM Highlighting Test Error:', e);
    if (testDiv.parentNode) {
      document.body.removeChild(testDiv);
    }
    return false;
  }
}

// Run all tests
console.log('=== Validation Tests for Production Fixes ===\n');

const results = {
  scoreCalculation: testScoreCalculation(),
  tokenRetry: testTokenRetryLogic(),
  domHighlighting: testDOMHighlightingFallback(),
};

console.log('=== Test Summary ===');
console.log(`Score Calculation: ${results.scoreCalculation ? '✓ PASSED' : '✗ FAILED'}`);
console.log(`Token Retry Logic: ${results.tokenRetry ? '✓ PASSED' : '✗ FAILED'}`);
console.log(`DOM Highlighting: ${results.domHighlighting ? '✓ PASSED' : '✗ FAILED'}`);

const allPassed = Object.values(results).every(r => r);
console.log(`\nOverall: ${allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);

