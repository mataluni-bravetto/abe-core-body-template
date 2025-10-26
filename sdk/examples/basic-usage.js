/**
 * AiGuardian SDK - Basic Usage Examples
 *
 * This file demonstrates the most common use cases for the AiGuardian SDK.
 */

import AiGuardianClient from '../src/index.js';

// Initialize the client
const client = new AiGuardianClient({
  apiKey: 'your-api-key-here', // Replace with your actual API key
  logging: { level: 'info' },
  tracing: { enabled: true }
});

/**
 * Example 1: Basic Text Analysis
 */
async function basicAnalysis() {
  console.log('=== Basic Text Analysis ===');

  try {
    const text = "This new technology will revolutionize the entire industry!";
    const result = await client.analyzeText(text);

    console.log('Analysis Result:');
    console.log(`- Text: "${text}"`);
    console.log(`- Bias Score: ${(result.score * 100).toFixed(1)}%`);
    console.log(`- Bias Type: ${result.analysis.bias_type}`);
    console.log(`- Confidence: ${(result.analysis.confidence * 100).toFixed(1)}%`);
    console.log(`- Emotional Indicators: ${result.analysis.emotional_indicators}`);
    console.log(`- Word Count: ${result.analysis.word_count}`);

  } catch (error) {
    console.error('Analysis failed:', error.message);
  }
}

/**
 * Example 2: Batch Analysis
 */
async function batchAnalysis() {
  console.log('\n=== Batch Text Analysis ===');

  const texts = [
    "This product is absolutely amazing and will change everything!",
    "Based on the data, we can conclude that the results are statistically significant.",
    "I strongly believe this is the best solution available.",
    "The evidence clearly shows a correlation between these variables."
  ];

  try {
    const results = await client.analyzeBatch(texts);

    results.forEach((result, index) => {
      console.log(`Text ${index + 1}: ${(result.score * 100).toFixed(1)}% ${result.analysis.bias_type}`);
    });

  } catch (error) {
    console.error('Batch analysis failed:', error.message);
  }
}

/**
 * Example 3: Custom Analysis Options
 */
async function customAnalysis() {
  console.log('\n=== Custom Analysis Options ===');

  try {
    const result = await client.analyzeText(
      "This breakthrough discovery will transform healthcare forever!",
      {
        guards: ['biasguard', 'trustguard'], // Only run specific guards
        confidence: 0.8, // Higher confidence threshold
        cache: false // Skip cache for fresh analysis
      }
    );

    console.log('Custom Analysis Result:');
    console.log(`- Score: ${(result.score * 100).toFixed(1)}%`);
    console.log(`- Guards Used: ${result.options?.guards?.join(', ') || 'default'}`);
    console.log(`- Cached: ${result.cached ? 'Yes' : 'No'}`);

  } catch (error) {
    console.error('Custom analysis failed:', error.message);
  }
}

/**
 * Example 4: Health Check and Status
 */
async function healthAndStatus() {
  console.log('\n=== Health Check and Status ===');

  try {
    // Health check
    const health = await client.healthCheck();
    console.log('API Health:', health.status);
    console.log('Response Time:', health.responseTime + 'ms');

    // Guard status
    const guardStatus = await client.getGuardStatus();
    console.log('Available Guards:');
    Object.entries(guardStatus.guards).forEach(([name, status]) => {
      console.log(`- ${name}: ${status.status} (${status.version})`);
    });

  } catch (error) {
    console.error('Status check failed:', error.message);
  }
}

/**
 * Example 5: Configuration Management
 */
async function configurationDemo() {
  console.log('\n=== Configuration Management ===');

  // Get current config
  const currentConfig = client.getConfig();
  console.log('Current timeout:', currentConfig.timeout + 'ms');

  // Update configuration
  client.updateConfig({
    timeout: 45000,
    logging: { level: 'debug' }
  });

  console.log('Updated timeout:', client.getConfig().timeout + 'ms');

  // Listen for config changes
  const listenerId = client.config.addListener('timeout', (path, value) => {
    console.log(`Config changed - ${path}: ${value}`);
  });

  // Another config change
  client.updateConfig({ timeout: 30000 });

  // Clean up listener
  client.config.removeListener(listenerId);
}

/**
 * Example 6: Monitoring and Diagnostics
 */
async function monitoringDemo() {
  console.log('\n=== Monitoring and Diagnostics ===');

  // Run some analyses to generate data
  await client.analyzeText("Sample text for monitoring");
  await client.analyzeText("Another sample for metrics");

  // Get trace statistics
  const traceStats = client.getTraceStats();
  console.log('Trace Statistics:');
  console.log(`- Total Operations: ${traceStats.totalOperations}`);
  console.log(`- Average Duration: ${traceStats.averageDuration}ms`);
  console.log(`- Success Rate: ${((traceStats.completedTraces / traceStats.totalOperations) * 100).toFixed(1)}%`);

  // Get cache statistics
  const cacheStats = client.cache.getStats();
  console.log('Cache Statistics:');
  console.log(`- Cache Size: ${cacheStats.size}/${cacheStats.maxSize}`);
  console.log(`- Hit Rate: ${cacheStats.hitRate.toFixed(1)}%`);
  console.log(`- Total Hits: ${cacheStats.hits}`);

  // Get rate limiter status
  const rateStats = client.rateLimiter.getStats();
  console.log('Rate Limiter Status:');
  console.log(`- Tokens Remaining: ${rateStats.currentTokens}/${rateStats.maxTokens}`);
  console.log(`- Utilization: ${rateStats.utilization.toFixed(1)}%`);
}

/**
 * Example 7: Error Handling
 */
async function errorHandlingDemo() {
  console.log('\n=== Error Handling ===');

  // Invalid text (too short)
  try {
    await client.analyzeText("Hi");
  } catch (error) {
    console.log('Expected error (text too short):', error.message);
  }

  // Invalid API key simulation
  const badClient = new AiGuardianClient({
    apiKey: 'invalid-key',
    retryAttempts: 1 // Don't retry for demo
  });

  try {
    await badClient.analyzeText("This should fail with invalid key");
  } catch (error) {
    console.log('Expected error (invalid API key):', error.message);
  }
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('🚀 AiGuardian SDK Examples\n');

  await basicAnalysis();
  await batchAnalysis();
  await customAnalysis();
  await healthAndStatus();
  await configurationDemo();
  await monitoringDemo();
  await errorHandlingDemo();

  console.log('\n✨ All examples completed!');
}

// Export for use in other files
export {
  basicAnalysis,
  batchAnalysis,
  customAnalysis,
  healthAndStatus,
  configurationDemo,
  monitoringDemo,
  errorHandlingDemo,
  runAllExamples
};

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
