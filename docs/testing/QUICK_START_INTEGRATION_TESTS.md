# Quick Start: Backend Integration Tests

## 🚀 Run Tests in 3 Steps

### Step 1: Set Your API Key

```bash
export AIGUARDIAN_API_KEY="your-api-key-here"
```

### Step 2: Run Tests

```bash
# Option A: Use the test runner script (recommended)
node scripts/run-backend-integration-tests.js

# Option B: Run directly
node tests/integration/backend-integration.test.js

# Option C: Use npm script (if configured)
npm run test:integration
```

### Step 3: Review Results

The tests will output:
- ✅ Passed tests
- ❌ Failed tests  
- 📊 Summary report
- 📄 Detailed JSON report

## 📋 What Gets Tested

1. **Health Check** - Backend is alive
2. **Authentication** - API key works
3. **BiasGuard** - Bias detection service
4. **TrustGuard** - Trust analysis service
5. **ContextGuard** - Context analysis service
6. **Unified Analysis** - Multi-guard processing
7. **Error Handling** - Invalid requests handled properly
8. **Performance** - Response times acceptable
9. **Configuration** - Config retrieval works

## 🔧 Configuration Options

### Environment Variables

```bash
# Backend URL (optional, defaults to production)
export AIGUARDIAN_GATEWAY_URL="https://api.aiguardian.ai"

# API Key (required)
export AIGUARDIAN_API_KEY="your-api-key"
```

### Command Line Options

```bash
# Custom backend URL
node scripts/run-backend-integration-tests.js --url http://localhost:8000

# Provide API key
node scripts/run-backend-integration-tests.js --key your-api-key

# Custom timeout
node scripts/run-backend-integration-tests.js --timeout 5000
```

## ✅ Expected Output

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

## 🐛 Troubleshooting

### "Network error: Unable to connect"
- Check backend is running
- Verify URL is correct
- Check firewall/network

### "Authentication failed"
- Verify API key is correct
- Check API key hasn't expired
- Ensure proper permissions

### "Request timeout"
- Increase timeout: `--timeout 20000`
- Check backend performance
- Verify network latency

## 📚 More Information

- [Full Testing Guide](./BACKEND_INTEGRATION_TESTING.md)
- [Backend API Documentation](../BACKEND_ALIGNMENT.md)
- [Testing Strategy](../../agentsuite/workflows/Protocol_Chrome_Extension_Testing_Strategy.md)

