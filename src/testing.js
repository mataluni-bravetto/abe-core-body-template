/**
 * AI Guardians Testing Framework
 * 
 * This module provides comprehensive testing capabilities for guard services
 * and the central gateway integration.
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Configure your test data and expected results
 * - Add custom test cases for your guard services
 * - Integrate with your CI/CD pipeline
 * - Add performance and load testing
 */

class AIGuardiansTesting {
  constructor() {
    this.testResults = [];
    this.gateway = null;
    this.testData = this.initializeTestData();
  }

  /**
   * TRACER BULLET: Initialize test data for guard services
   */
  initializeTestData() {
    return {
      bias_detection: {
        positive_cases: [
          {
            text: "This product is clearly superior to all competitors and anyone who disagrees is wrong.",
            expected_bias_score: 0.8,
            expected_bias_type: "opinion_bias"
          },
          {
            text: "Women are naturally better at cooking than men.",
            expected_bias_score: 0.9,
            expected_bias_type: "gender_bias"
          },
          {
            text: "All politicians are corrupt liars who only care about money.",
            expected_bias_score: 0.7,
            expected_bias_type: "political_bias"
          }
        ],
        negative_cases: [
          {
            text: "The weather today is sunny with a temperature of 75 degrees.",
            expected_bias_score: 0.1,
            expected_bias_type: "neutral"
          },
          {
            text: "According to the research study, 85% of participants showed improvement.",
            expected_bias_score: 0.2,
            expected_bias_type: "neutral"
          }
        ]
      },
      toxicity_detection: {
        positive_cases: [
          {
            text: "You are an idiot and I hate you!",
            expected_toxicity_score: 0.9,
            expected_toxicity_type: "insult"
          },
          {
            text: "This is the worst thing I've ever seen, you should be ashamed.",
            expected_toxicity_score: 0.8,
            expected_toxicity_type: "harassment"
          }
        ],
        negative_cases: [
          {
            text: "Thank you for your help, I appreciate it.",
            expected_toxicity_score: 0.1,
            expected_toxicity_type: "neutral"
          }
        ]
      },
      sentiment_analysis: {
        positive_cases: [
          {
            text: "I love this new feature, it's amazing!",
            expected_sentiment: "positive",
            expected_confidence: 0.9
          },
          {
            text: "This is terrible, I'm very disappointed.",
            expected_sentiment: "negative",
            expected_confidence: 0.8
          }
        ],
        neutral_cases: [
          {
            text: "The meeting is scheduled for 3 PM tomorrow.",
            expected_sentiment: "neutral",
            expected_confidence: 0.7
          }
        ]
      }
    };
  }

  /**
   * TRACER BULLET: Run comprehensive guard service tests
   */
  async runGuardServiceTests() {
    console.log("[Testing] Starting guard service tests...");
    
    const results = {
      total_tests: 0,
      passed_tests: 0,
      failed_tests: 0,
      guard_results: {}
    };

    for (const [guardName, testCases] of Object.entries(this.testData)) {
      console.log(`[Testing] Testing ${guardName}...`);
      
      const guardResults = await this.testGuardService(guardName, testCases);
      results.guard_results[guardName] = guardResults;
      results.total_tests += guardResults.total;
      results.passed_tests += guardResults.passed;
      results.failed_tests += guardResults.failed;
    }

    results.success_rate = (results.passed_tests / results.total_tests) * 100;
    
    console.log("[Testing] Test results:", results);
    return results;
  }

  /**
   * TRACER BULLET: Test individual guard service
   */
  async testGuardService(guardName, testCases) {
    const results = {
      guard_name: guardName,
      total: 0,
      passed: 0,
      failed: 0,
      test_details: []
    };

    for (const [category, cases] of Object.entries(testCases)) {
      for (const testCase of cases) {
        results.total++;
        
        try {
          const testResult = await this.runSingleTest(guardName, testCase);
          results.test_details.push(testResult);
          
          if (testResult.passed) {
            results.passed++;
          } else {
            results.failed++;
          }
        } catch (err) {
          results.failed++;
          results.test_details.push({
            test_case: testCase,
            passed: false,
            error: err.message,
            category
          });
        }
      }
    }

    return results;
  }

  /**
   * TRACER BULLET: Run single test case
   */
  async runSingleTest(guardName, testCase) {
    try {
      // Send test request to background script
      const response = await this.sendTestRequest(guardName, testCase.text);
      
      if (!response.success) {
        return {
          test_case: testCase,
          passed: false,
          error: response.error,
          actual_result: null
        };
      }

      // Validate results based on guard type
      const validation = this.validateTestResult(guardName, testCase, response.result);
      
      return {
        test_case: testCase,
        passed: validation.passed,
        expected: testCase,
        actual_result: response.result,
        validation_errors: validation.errors,
        score_difference: validation.score_difference
      };
    } catch (err) {
      return {
        test_case: testCase,
        passed: false,
        error: err.message,
        actual_result: null
      };
    }
  }

  /**
   * TRACER BULLET: Send test request to background script
   */
  async sendTestRequest(guardName, text) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: "TEST_GUARD_SERVICE",
        payload: {
          guard_name: guardName,
          text: text
        }
      }, (response) => {
        resolve(response || { success: false, error: "No response" });
      });
    });
  }

  /**
   * TRACER BULLET: Validate test results
   */
  validateTestResult(guardName, expected, actual) {
    const validation = {
      passed: true,
      errors: [],
      score_difference: 0
    };

    switch (guardName) {
      case 'bias_detection':
        if (expected.expected_bias_score !== undefined) {
          const scoreDiff = Math.abs(actual.score - expected.expected_bias_score);
          validation.score_difference = scoreDiff;
          
          if (scoreDiff > 0.2) { // Allow 20% tolerance
            validation.passed = false;
            validation.errors.push(`Bias score mismatch: expected ${expected.expected_bias_score}, got ${actual.score}`);
          }
        }
        break;

      case 'toxicity_detection':
        if (expected.expected_toxicity_score !== undefined) {
          const scoreDiff = Math.abs(actual.score - expected.expected_toxicity_score);
          validation.score_difference = scoreDiff;
          
          if (scoreDiff > 0.2) {
            validation.passed = false;
            validation.errors.push(`Toxicity score mismatch: expected ${expected.expected_toxicity_score}, got ${actual.score}`);
          }
        }
        break;

      case 'sentiment_analysis':
        if (expected.expected_sentiment !== undefined) {
          if (actual.sentiment !== expected.expected_sentiment) {
            validation.passed = false;
            validation.errors.push(`Sentiment mismatch: expected ${expected.expected_sentiment}, got ${actual.sentiment}`);
          }
        }
        break;
    }

    return validation;
  }

  /**
   * TRACER BULLET: Run performance tests
   */
  async runPerformanceTests() {
    console.log("[Testing] Starting performance tests...");
    
    const performanceResults = {
      response_times: [],
      throughput: 0,
      error_rate: 0,
      memory_usage: 0
    };

    const testTexts = [
      "This is a test text for performance testing.",
      "Another test text with different content.",
      "Performance testing with various text lengths."
    ];

    const startTime = Date.now();
    const promises = [];

    // Run concurrent tests
    for (let i = 0; i < 10; i++) {
      for (const text of testTexts) {
        promises.push(this.measureResponseTime(text));
      }
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();

    performanceResults.response_times = results;
    performanceResults.throughput = results.length / ((endTime - startTime) / 1000);
    performanceResults.error_rate = results.filter(r => r.error).length / results.length;

    console.log("[Testing] Performance results:", performanceResults);
    return performanceResults;
  }

  /**
   * TRACER BULLET: Measure response time for single request
   */
  async measureResponseTime(text) {
    const startTime = Date.now();
    
    try {
      const response = await this.sendTestRequest('bias_detection', text);
      const endTime = Date.now();
      
      return {
        response_time: endTime - startTime,
        success: response.success,
        error: response.error
      };
    } catch (err) {
      const endTime = Date.now();
      return {
        response_time: endTime - startTime,
        success: false,
        error: err.message
      };
    }
  }

  /**
   * TRACER BULLET: Run integration tests
   */
  async runIntegrationTests() {
    console.log("[Testing] Starting integration tests...");
    
    const integrationResults = {
      gateway_connection: false,
      guard_services_status: {},
      configuration_valid: false,
      logging_functional: false
    };

    try {
      // Test gateway connection
      const gatewayResponse = await this.testGatewayConnection();
      integrationResults.gateway_connection = gatewayResponse.success;

      // Test guard services status
      const statusResponse = await this.getGuardServicesStatus();
      integrationResults.guard_services_status = statusResponse;

      // Test configuration
      const configResponse = await this.getConfiguration();
      integrationResults.configuration_valid = configResponse.success;

      // Test logging
      const loggingResponse = await this.testLogging();
      integrationResults.logging_functional = loggingResponse.success;

    } catch (err) {
      console.error("[Testing] Integration test failed:", err);
    }

    console.log("[Testing] Integration results:", integrationResults);
    return integrationResults;
  }

  /**
   * TRACER BULLET: Test gateway connection
   */
  async testGatewayConnection() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: "TEST_GATEWAY_CONNECTION"
      }, (response) => {
        resolve(response || { success: false, error: "No response" });
      });
    });
  }

  /**
   * TRACER BULLET: Get guard services status
   */
  async getGuardServicesStatus() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: "GET_GUARD_STATUS"
      }, (response) => {
        resolve(response || { success: false, error: "No response" });
      });
    });
  }

  /**
   * TRACER BULLET: Get configuration
   */
  async getConfiguration() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: "GET_CENTRAL_CONFIG"
      }, (response) => {
        resolve(response || { success: false, error: "No response" });
      });
    });
  }

  /**
   * TRACER BULLET: Test logging functionality
   */
  async testLogging() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        type: "TEST_LOGGING",
        payload: {
          level: "info",
          message: "Test log message",
          metadata: { test: true }
        }
      }, (response) => {
        resolve(response || { success: false, error: "No response" });
      });
    });
  }

  /**
   * TRACER BULLET: Generate test report
   */
  generateTestReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      extension_version: chrome.runtime.getManifest().version,
      test_summary: {
        total_tests: results.total_tests,
        passed_tests: results.passed_tests,
        failed_tests: results.failed_tests,
        success_rate: results.success_rate
      },
      guard_results: results.guard_results,
      recommendations: this.generateRecommendations(results)
    };

    return report;
  }

  /**
   * TRACER BULLET: Generate recommendations based on test results
   */
  generateRecommendations(results) {
    const recommendations = [];

    if (results.success_rate < 80) {
      recommendations.push("Consider reviewing guard service configurations");
    }

    if (results.failed_tests > 0) {
      recommendations.push("Investigate failed test cases and update expected values");
    }

    for (const [guardName, guardResults] of Object.entries(results.guard_results)) {
      if (guardResults.failed > 0) {
        recommendations.push(`Review ${guardName} configuration and thresholds`);
      }
    }

    return recommendations;
  }
}

// Export for use in other modules
window.AIGuardiansTesting = AIGuardiansTesting;
