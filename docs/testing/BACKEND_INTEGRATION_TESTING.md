# Backend Integration Testing Guide

This guide explains how to conduct integration tests with your AiGuardian backend API.

## Overview

Integration tests verify that your Chrome extension correctly communicates with the backend API. These tests make **real API calls** to your backend to ensure:

- ✅ Backend connectivity
- ✅ Authentication works
- ✅ API endpoints respond correctly
- ✅ Data formats match expectations
- ✅ Error handling works properly
- ✅ Performance meets requirements

## Prerequisites

1. **Backend API Running**
   - Production: `https://api.aiguardian.ai`
   - Development: `http://localhost:8000`

2. **API Key**
   - Get your API key from your backend administrator
   - Store it securely (see Configuration below)

3. **Node.js** (for running tests outside Chrome)
   - Node.js 14+ recommended

## Quick Start

### Option 1: Run Tests from Command Line (Node.js)

```bash
# Set your API key
export AIGUARDIAN_API_KEY="your-api-key-here"

# Set backend URL (optional, defaults to production)
export AIGUARDIAN_GATEWAY_URL="https://api.aiguardian.ai"

# Run integration tests
node tests/integration/backend-integration.test.js
```

### Option 2: Run Tests from Chrome Extension

1. Open Chrome Extension Options page
2. Open browser console (F12)
3. Run:

```javascript
// Load the test file
const script = document.createElement('script');
script.src = chrome.runtime.getURL('tests/integration/backend-integration.test.js');
document.head.appendChild(script);

// Wait for script to load, then run tests
setTimeout(() => {
  const tester = new BackendIntegrationTester({
    gatewayUrl: 'https://api.aiguardian.ai',
    apiKey: 'your-api-key-here'
  });
  
  tester.runAllTests().then(results => {
    console.log('Test Results:', results);
  });
}, 1000);
```

### Option 3: Use Existing Testing UI

The extension includes a testing interface in `src/testing.js`. You can trigger backend integration tests from the Options page:

1. Go to Extension Options
2. Click "Run Integration Tests"
3. View results in the test results panel

## Configuration

### Environment Variables

```bash
# Backend URL
AIGUARDIAN_GATEWAY_URL=https://api.aiguardian.ai

# API Key (required for authenticated endpoints)
AIGUARDIAN_API_KEY=your-api-key-here
```

### Programmatic Configuration

```javascript
const tester = new BackendIntegrationTester({
  gatewayUrl: 'https://api.aiguardian.ai',
  apiKey: 'your-api-key-here',
  timeout: 10000,        // Request timeout in ms
  retryAttempts: 3        // Number of retry attempts
});
```

## Test Suite

The integration test suite includes:

### 1. Health Check
- Verifies backend is alive
- Tests `/health/live` endpoint
- Checks response time

### 2. Authentication
- Tests API key authentication
- Verifies protected endpoints work
- Checks for proper error handling on invalid keys

### 3. Text Analysis Tests
- **BiasGuard**: Tests bias detection service
- **TrustGuard**: Tests trust/reliability analysis
- **ContextGuard**: Tests context analysis
- Each test validates:
  - Request format
  - Response structure
  - Data types
  - Processing time

### 4. Unified Analysis
- Tests multi-guard analysis
- Verifies orchestration works
- Checks response aggregation

### 5. Error Handling
- Tests invalid requests
- Verifies proper error responses
- Checks error message formats

### 6. Performance Testing
- Measures response times
- Tests multiple concurrent requests
- Calculates average processing time

### 7. Configuration Management
- Tests config retrieval
- Verifies configuration format

## Understanding Test Results

### Success Example

```
🚀 Starting Backend Integration Tests
======================================================================
Backend URL: https://api.aiguardian.ai
API Key: ***configured***
======================================================================

📋 Testing: Health Check
✅ Health Check: PASSED
   Response Time: 145ms

📋 Testing: Authentication
✅ Authentication: PASSED
   Response Time: 89ms

📋 Testing: Text Analysis - BiasGuard
✅ Text Analysis - BiasGuard: PASSED
   Response Time: 234ms

...

======================================================================
📊 BACKEND INTEGRATION TEST REPORT
======================================================================
Total Tests: 9
✅ Passed: 9
❌ Failed: 0
Success Rate: 100.0%
Duration: 2345ms
======================================================================
```

### Failure Example

```
❌ Authentication: FAILED
   Error: Authentication failed: Invalid API key

...

❌ FAILED TESTS:

  Authentication:
    Error: Authentication failed: Invalid API key
```

## Common Issues & Solutions

### Issue: "Network error: Unable to connect"

**Solution:**
- Verify backend is running
- Check backend URL is correct
- Verify network connectivity
- Check firewall settings

### Issue: "Authentication failed: Invalid API key"

**Solution:**
- Verify API key is correct
- Check API key hasn't expired
- Ensure API key has proper permissions
- Contact backend administrator

### Issue: "Request timeout"

**Solution:**
- Increase timeout in config
- Check backend performance
- Verify network latency
- Check if backend is under heavy load

### Issue: "Response missing status field"

**Solution:**
- Backend response format may have changed
- Check backend API documentation
- Verify backend version matches expected format
- Update test expectations if needed

## Continuous Integration

### GitHub Actions Example

```yaml
name: Backend Integration Tests

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Run Integration Tests
        env:
          AIGUARDIAN_GATEWAY_URL: ${{ secrets.BACKEND_URL }}
          AIGUARDIAN_API_KEY: ${{ secrets.API_KEY }}
        run: |
          node tests/integration/backend-integration.test.js
```

## Best Practices

1. **Use Environment Variables**
   - Never commit API keys to git
   - Use secrets management in CI/CD

2. **Test Against Staging First**
   - Use staging environment for development
   - Only test production when ready

3. **Monitor Test Results**
   - Track success rates over time
   - Alert on test failures
   - Monitor response times

4. **Regular Testing**
   - Run tests before deployments
   - Run tests after backend changes
   - Include in CI/CD pipeline

5. **Isolate Tests**
   - Use separate test API keys
   - Clean up test data
   - Don't affect production data

## Test Data

The tests use sample text that triggers various guard services:

- **Bias Detection**: "Women are naturally better at multitasking than men..."
- **Trust Analysis**: Standard test text
- **Context Analysis**: Contextual test content

You can customize test data by modifying the test payloads in `backend-integration.test.js`.

## Advanced Usage

### Custom Test Configuration

```javascript
const tester = new BackendIntegrationTester({
  gatewayUrl: 'http://localhost:8000',
  apiKey: 'dev-api-key',
  timeout: 5000,
  retryAttempts: 2
});

// Run specific test
const healthResult = await tester.testHealthCheck();
console.log('Health:', healthResult);

// Run all tests
const allResults = await tester.runAllTests();
```

### Integration with CI/CD

```bash
#!/bin/bash
# Run tests and fail if success rate < 80%

node tests/integration/backend-integration.test.js > test-output.json

SUCCESS_RATE=$(cat test-output.json | jq '.summary.successRate')

if (( $(echo "$SUCCESS_RATE < 80" | bc -l) )); then
  echo "Tests failed: Success rate $SUCCESS_RATE% < 80%"
  exit 1
fi
```

## Troubleshooting

### Enable Debug Logging

```javascript
const tester = new BackendIntegrationTester({
  gatewayUrl: 'https://api.aiguardian.ai',
  apiKey: 'your-key',
  debug: true  // Enable detailed logging
});
```

### Check Backend Logs

If tests fail, check backend logs for:
- Request received
- Authentication status
- Processing errors
- Response sent

### Verify Backend Status

```bash
# Check backend health
curl https://api.aiguardian.ai/health/live

# Check with authentication
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.aiguardian.ai/api/v1/config
```

## Next Steps

1. ✅ Set up your API key
2. ✅ Run initial integration tests
3. ✅ Fix any failures
4. ✅ Add to CI/CD pipeline
5. ✅ Monitor test results regularly

For more information, see:
- [Backend API Documentation](../BACKEND_ALIGNMENT.md)
- [Testing Strategy](../agentsuite/workflows/Protocol_Chrome_Extension_Testing_Strategy.md)

