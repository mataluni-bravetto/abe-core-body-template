#!/usr/bin/env node
/**
 * Backend Integration Test Runner
 *
 * Simple script to run backend integration tests with proper configuration
 *
 * Usage:
 *   node scripts/run-backend-integration-tests.js
 *   node scripts/run-backend-integration-tests.js --url http://localhost:8000
 *   node scripts/run-backend-integration-tests.js --url https://api.aiguardian.ai --key your-api-key
 */

const path = require('path');
const BackendIntegrationTester = require('../tests/integration/backend-integration.test.js');

// Parse command line arguments
const args = process.argv.slice(2);
const config = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && args[i + 1]) {
    config.gatewayUrl = args[i + 1];
    i++;
  } else if (args[i] === '--key' && args[i + 1]) {
    config.apiKey = args[i + 1];
    i++;
  } else if (args[i] === '--timeout' && args[i + 1]) {
    config.timeout = parseInt(args[i + 1], 10);
    i++;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
Backend Integration Test Runner

Usage:
  node scripts/run-backend-integration-tests.js [options]

Options:
  --url <url>       Backend gateway URL (default: from env or https://api.aiguardian.ai)
  --key <key>       API key (default: from AIGUARDIAN_API_KEY env var)
  --timeout <ms>    Request timeout in milliseconds (default: 10000)
  --help, -h        Show this help message

Environment Variables:
  AIGUARDIAN_GATEWAY_URL    Backend gateway URL
  AIGUARDIAN_API_KEY        API key for authentication

Examples:
  # Use environment variables
  export AIGUARDIAN_API_KEY="your-key"
  node scripts/run-backend-integration-tests.js

  # Override URL
  node scripts/run-backend-integration-tests.js --url http://localhost:8000

  # Provide API key via command line
  node scripts/run-backend-integration-tests.js --key your-api-key
`);
    process.exit(0);
  }
}

// Merge with environment variables
const finalConfig = {
  gatewayUrl:
    config.gatewayUrl || process.env.AIGUARDIAN_GATEWAY_URL || 'https://api.aiguardian.ai',
  apiKey: config.apiKey || process.env.AIGUARDIAN_API_KEY || '',
  timeout: config.timeout || 10000,
};

// Check if API key is provided
if (!finalConfig.apiKey) {
  console.warn('⚠️  Warning: No API key provided. Some tests may fail.');
  console.warn('   Set AIGUARDIAN_API_KEY environment variable or use --key option\n');
}

// Run tests
const tester = new BackendIntegrationTester(finalConfig);

tester
  .runAllTests()
  .then((results) => {
    const failed = results.filter((r) => r.status === 'FAILED');
    process.exit(failed.length > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  });
