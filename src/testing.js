/**
 * AiGuardian Chrome Extension - Comprehensive Testing Suite
 * 
 * This module provides comprehensive testing, tracing, and validation
 * for the AiGuardian Chrome extension.
 */

class AIGuardiansTester {
  constructor() {
    this.testResults = [];
    this.traceData = [];
    this.startTime = Date.now();
    
    this.initializeTester();
  }

  /**
   * Initialize the testing framework
   */
  async initializeTester() {
    Logger.info('[TESTER] Initializing AiGuardian Testing Suite');
    
    // Set up test environment
    await this.setupTestEnvironment();
    
    // Run comprehensive tests
    await this.runAllTests();
    
    // Generate test report
    this.generateTestReport();
  }

  /**
   * Set up test environment
   */
  async setupTestEnvironment() {
    Logger.info('[TESTER] Setting up test environment');
    
    // Configure test gateway URL (mock backend)
    this.testConfig = {
      gatewayUrl: 'https://api.aiguardian.ai', // Production API server
      timeout: 5000,
      retryAttempts: 2,
      retryDelay: 1000
    };
    
    // Initialize test data
    this.testData = {
      sampleTexts: [
        "This is a test text for bias detection",
        "The quick brown fox jumps over the lazy dog",
        "Artificial intelligence will revolutionize healthcare",
        "Women are naturally better at multitasking than men",
        "All politicians are corrupt and untrustworthy"
      ],
      expectedResponses: {
        biasguard: ['score', 'detected_biases', 'suggestions'],
        trustguard: ['score', 'trust_metrics', 'reliability'],
        contextguard: ['score', 'context_drift', 'coherence']
      }
    };
  }

  /**
   * Run all comprehensive tests
   */
  async runAllTests() {
    Logger.info('[TESTER] Starting comprehensive test suite');
    
    const tests = [
      { name: 'Gateway Connection Test', fn: this.testGatewayConnection },
      { name: 'API Endpoint Validation', fn: this.testApiEndpoints },
      { name: 'Guard Service Integration', fn: this.testGuardServices },
      { name: 'Data Validation', fn: this.testDataValidation },
      { name: 'Error Handling', fn: this.testErrorHandling },
      { name: 'Performance Testing', fn: this.testPerformance },
      { name: 'Trace Statistics', fn: this.testTraceStatistics },
      { name: 'Configuration Management', fn: this.testConfiguration }
    ];

    for (const test of tests) {
      try {
        Logger.info(`[TESTER] Running: ${test.name}`);
        const result = await test.fn.call(this);
        this.testResults.push({
          name: test.name,
          status: 'PASSED',
          result,
          timestamp: new Date().toISOString()
        });
        Logger.info(`[TESTER] ✅ ${test.name}: PASSED`);
      } catch (error) {
        this.testResults.push({
          name: test.name,
          status: 'FAILED',
          error: error.message,
          timestamp: new Date().toISOString()
        });
        Logger.error(`[TESTER] ❌ ${test.name}: FAILED - ${error.message}`);
      }
    }
  }

  /**
   * Test gateway connection
   */
  async testGatewayConnection() {
    const startTime = Date.now();
    
    try {
      const response = await this.sendTestRequest('health', { test: true });
      const responseTime = Date.now() - startTime;
      
      this.traceData.push({
        test: 'gateway_connection',
        responseTime,
        success: true,
        timestamp: new Date().toISOString()
      });
      
      return {
        connected: true,
        responseTime,
        status: response.status || 'unknown'
      };
    } catch (error) {
      this.traceData.push({
        test: 'gateway_connection',
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw new Error(`Gateway connection failed: ${error.message}`);
    }
  }

  /**
   * Test API endpoints
   */
  async testApiEndpoints() {
    const endpoints = [
      { name: 'api/v1/analyze', method: 'POST', required: ['text'] },
      { name: 'api/v1/health', method: 'GET', required: ['status'] },
      { name: 'api/v1/guards', method: 'GET', required: ['guards'] },
      { name: 'api/v1/config', method: 'GET', required: ['config'] }
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.sendTestRequest(endpoint.name, {});
        results[endpoint.name] = {
          status: 'available',
          response: this.sanitizeResponse(response)
        };
      } catch (error) {
        results[endpoint.name] = {
          status: 'error',
          error: error.message
        };
      }
    }
    
    return results;
  }

  /**
   * Test guard services
   */
  async testGuardServices() {
    const guardServices = ['biasguard', 'trustguard', 'contextguard', 'securityguard'];
    const results = {};
    
    for (const guard of guardServices) {
      try {
        const testPayload = {
          text: this.testData.sampleTexts[0],
          guards: [guard],
          options: { threshold: 0.5 }
        };
        
        const response = await this.sendTestRequest('analyze/text', testPayload);
        
        // Validate response structure
        const validation = this.validateGuardResponse(response, guard);
        
        results[guard] = {
          status: 'working',
          validation,
          responseTime: response.processing_time || 0
        };
      } catch (error) {
        results[guard] = {
          status: 'error',
          error: error.message
        };
      }
    }
    
    return results;
  }

  /**
   * Test data validation
   */
  async testDataValidation() {
    const validationTests = [
      {
        name: 'Valid Text Analysis',
        payload: { text: 'Valid test text', guards: ['biasguard'] },
        shouldPass: true
      },
      {
        name: 'Empty Text',
        payload: { text: '', guards: ['biasguard'] },
        shouldPass: false
      },
      {
        name: 'Invalid Guard Service',
        payload: { text: 'Test text', guards: ['invalidguard'] },
        shouldPass: false
      },
      {
        name: 'Missing Required Fields',
        payload: { guards: ['biasguard'] },
        shouldPass: false
      }
    ];
    
    const results = {};
    
    for (const test of validationTests) {
      try {
        const response = await this.sendTestRequest('analyze/text', test.payload);
        results[test.name] = {
          expected: test.shouldPass,
          actual: true,
          passed: test.shouldPass === true
        };
      } catch (error) {
        results[test.name] = {
          expected: test.shouldPass,
          actual: false,
          passed: test.shouldPass === false,
          error: error.message
        };
      }
    }
    
    return results;
  }

  /**
   * Test error handling
   */
  async testErrorHandling() {
    const errorTests = [
      {
        name: 'Network Timeout',
        action: () => this.sendTestRequest('analyze/text', { text: 'test' }, { timeout: 1 })
      },
      {
        name: 'Invalid Endpoint',
        action: () => this.sendTestRequest('invalid/endpoint', {})
      },
      {
        name: 'Malformed Payload',
        action: () => this.sendTestRequest('analyze/text', 'invalid json')
      }
    ];
    
    const results = {};
    
    for (const test of errorTests) {
      try {
        await test.action();
        results[test.name] = { handled: false, error: 'Expected error but got success' };
      } catch (error) {
        results[test.name] = { 
          handled: true, 
          errorType: error.name,
          errorMessage: error.message 
        };
      }
    }
    
    return results;
  }

  /**
   * Test performance
   */
  async testPerformance() {
    const performanceTests = [];
    const iterations = 5;
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      try {
        await this.sendTestRequest('analyze/text', {
          text: this.testData.sampleTexts[i % this.testData.sampleTexts.length],
          guards: ['biasguard', 'trustguard']
        });
        
        const responseTime = Date.now() - startTime;
        performanceTests.push({
          iteration: i + 1,
          responseTime,
          success: true
        });
      } catch (error) {
        performanceTests.push({
          iteration: i + 1,
          responseTime: Date.now() - startTime,
          success: false,
          error: error.message
        });
      }
    }
    
    const successfulTests = performanceTests.filter(t => t.success);
    const averageResponseTime = successfulTests.reduce((sum, t) => sum + t.responseTime, 0) / successfulTests.length;
    const maxResponseTime = Math.max(...successfulTests.map(t => t.responseTime));
    const minResponseTime = Math.min(...successfulTests.map(t => t.responseTime));
    
    return {
      totalTests: iterations,
      successfulTests: successfulTests.length,
      failedTests: performanceTests.length - successfulTests.length,
      averageResponseTime,
      maxResponseTime,
      minResponseTime,
      details: performanceTests
    };
  }

  /**
   * Test trace statistics
   */
  async testTraceStatistics() {
    // Simulate multiple requests to generate trace data
    const requests = 10;
    const traceResults = [];
    
    for (let i = 0; i < requests; i++) {
      const startTime = Date.now();
      
      try {
        await this.sendTestRequest('analyze/text', {
          text: `Test text ${i}`,
          guards: ['biasguard']
        });
        
        traceResults.push({
          request: i + 1,
          responseTime: Date.now() - startTime,
          success: true
        });
      } catch (error) {
        traceResults.push({
          request: i + 1,
          responseTime: Date.now() - startTime,
          success: false,
          error: error.message
        });
      }
    }
    
    const successfulRequests = traceResults.filter(r => r.success);
    const totalResponseTime = successfulRequests.reduce((sum, r) => sum + r.responseTime, 0);
    
    return {
      totalRequests: requests,
      successfulRequests: successfulRequests.length,
      failedRequests: requests - successfulRequests.length,
      averageResponseTime: totalResponseTime / successfulRequests.length,
      successRate: (successfulRequests.length / requests) * 100,
      details: traceResults
    };
  }

  /**
   * Test configuration management
   */
  async testConfiguration() {
    const configTests = [
      {
        name: 'Get Configuration',
        action: () => this.sendTestRequest('config/user', {})
      },
      {
        name: 'Update Configuration',
        action: () => this.sendTestRequest('config/user', {
          guards: { biasguard: { enabled: true, threshold: 0.6 } }
        })
      }
    ];
    
    const results = {};
    
    for (const test of configTests) {
      try {
        const response = await test.action();
        results[test.name] = {
          status: 'success',
          response: this.sanitizeResponse(response)
        };
      } catch (error) {
        results[test.name] = {
          status: 'error',
          error: error.message
        };
      }
    }
    
    return results;
  }

  /**
   * Send test request
   */
  async sendTestRequest(endpoint, payload, options = {}) {
    const url = `${this.testConfig.gatewayUrl}/${endpoint}`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Test-Request': 'true',
        'X-Test-ID': this.generateTestId()
      },
      body: JSON.stringify(payload),
      ...options
    };
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }

  /**
   * Validate guard response
   */
  validateGuardResponse(response, guardType) {
    const errors = [];
    
    if (!response.analysis_id) {
      errors.push('Missing analysis_id');
    }
    
    if (typeof response.overall_score !== 'number') {
      errors.push('Missing or invalid overall_score');
    }
    
    if (!response.guards || !response.guards[guardType]) {
      errors.push(`Missing guard results for ${guardType}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize response for logging
   */
  sanitizeResponse(response) {
    if (!response) return response;
    
    const sanitized = { ...response };
    
    // Remove sensitive data with bounds checking
    if (sanitized.text && typeof sanitized.text === 'string' && sanitized.text.length > 50) {
      sanitized.text = sanitized.text.substring(0, 50) + '...';
    }
    
    return sanitized;
  }

  /**
   * Generate test report
   */
  generateTestReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'PASSED').length;
    const failedTests = this.testResults.filter(t => t.status === 'FAILED').length;
    const successRate = (passedTests / totalTests) * 100;
    
    const report = {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: Math.round(successRate * 100) / 100,
        duration: Date.now() - this.startTime
      },
      results: this.testResults,
      traceData: this.traceData,
      timestamp: new Date().toISOString()
    };
    
    Logger.info('[TESTER] Test Report Generated:');
    Logger.info(`[TESTER] Total Tests: ${totalTests}`);
    Logger.info(`[TESTER] Passed: ${passedTests}`);
    Logger.info(`[TESTER] Failed: ${failedTests}`);
    Logger.info(`[TESTER] Success Rate: ${successRate.toFixed(2)}%`);
    Logger.info(`[TESTER] Duration: ${report.summary.duration}ms`);
    
    // Store report for external access
    window.AIGuardiansTestReport = report;
    
    return report;
  }

  /**
   * Generate test ID
   */
  generateTestId() {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Auto-initialize tester when script loads
if (typeof window !== 'undefined') {
  window.AIGuardiansTester = AIGuardiansTester;
  
  // Initialize tester if in testing mode
  if (window.location.search.includes('test=true')) {
    new AIGuardiansTester();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIGuardiansTester;
}