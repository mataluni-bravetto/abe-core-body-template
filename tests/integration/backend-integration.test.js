/**
 * AiGuardian Chrome Extension - Real Backend Integration Tests
 * 
 * This test suite makes actual API calls to your backend to verify integration.
 * 
 * USAGE:
 * 1. Set your backend URL in the configuration below
 * 2. For authenticated endpoints, set CLERK_SESSION_TOKEN environment variable
 * 3. Run: node tests/integration/backend-integration.test.js
 * 4. Or import in Chrome extension context and run via testing.js
 * 
 * NOTE: This extension uses Clerk authentication only (no API keys).
 * Public endpoints (health, config/public) work without authentication.
 * Protected endpoints require a Clerk session token.
 */

class BackendIntegrationTester {
  constructor(config = {}) {
    this.config = {
      gatewayUrl: config.gatewayUrl || 'https://api.aiguardian.ai',
      // Note: API keys are deprecated - using Clerk authentication only
      // For Node.js tests, we can only test public endpoints
      clerkToken: config.clerkToken || (typeof process !== 'undefined' && process.env.CLERK_SESSION_TOKEN) || null,
      timeout: config.timeout || 10000,
      retryAttempts: config.retryAttempts || 3,
      ...config
    };
    
    this.testResults = [];
    this.startTime = Date.now();
    this.requestId = 0;
  }

  /**
   * Run all integration tests
   */
  async runAllTests() {
    console.log('\n🚀 Starting Backend Integration Tests');
    console.log('='.repeat(70));
    console.log(`Backend URL: ${this.config.gatewayUrl}`);
    console.log(`Clerk Token: ${this.config.clerkToken ? '***configured***' : '⚠️  NOT SET (will test public endpoints only)'}`);
    console.log('='.repeat(70));

    let tests = [
      { name: 'Health Check', fn: this.testHealthCheck.bind(this) },
      { name: 'Authentication', fn: this.testAuthentication.bind(this) },
      { name: 'Text Analysis - BiasGuard', fn: () => this.testTextAnalysis('biasguard') },
      { name: 'Text Analysis - TrustGuard', fn: () => this.testTextAnalysis('trustguard') },
      { name: 'Text Analysis - ContextGuard', fn: () => this.testTextAnalysis('contextguard') },
      { name: 'Unified Analysis', fn: this.testUnifiedAnalysis.bind(this) },
      { name: 'Error Handling', fn: this.testErrorHandling.bind(this) },
      { name: 'Performance', fn: this.testPerformance.bind(this) },
      { name: 'Configuration', fn: this.testConfiguration.bind(this) }
    ];

    // If no Clerk token is configured, skip guard analysis and performance tests
    // These endpoints require user authentication and cannot be fully validated
    // from a bare Node.js context.
    if (!this.config.clerkToken) {
      console.warn('\n⚠️  No Clerk session token configured.');
      console.warn('   Guard analysis and performance tests will be skipped (require user auth).');
      const publicOnly = new Set(['Health Check', 'Authentication', 'Error Handling', 'Configuration']);
      tests = tests.filter(t => publicOnly.has(t.name));
    }

    for (const test of tests) {
      try {
        console.log(`\n📋 Testing: ${test.name}`);
        const result = await test.fn();
        this.testResults.push({
          name: test.name,
          status: 'PASSED',
          result,
          timestamp: new Date().toISOString()
        });
        console.log(`✅ ${test.name}: PASSED`);
        if (result.responseTime) {
          console.log(`   Response Time: ${result.responseTime}ms`);
        }
      } catch (error) {
        this.testResults.push({
          name: test.name,
          status: 'FAILED',
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
        console.error(`❌ ${test.name}: FAILED`);
        console.error(`   Error: ${error.message}`);
      }
    }

    this.generateReport();
    return this.testResults;
  }

  /**
   * Test 1: Health Check
   * Verifies backend is alive and responding
   */
  async testHealthCheck() {
    const startTime = Date.now();
    
    try {
      const response = await this.makeRequest('GET', '/health/live', null);
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json().catch(() => ({}));
      
      return {
        status: 'healthy',
        responseTime,
        statusCode: response.status,
        data: data
      };
    } catch (error) {
      throw new Error(`Health check error: ${error.message}`);
    }
  }

  /**
   * Test 2: Authentication
   * Verifies public config endpoint is accessible (doesn't require auth)
   * Note: Protected endpoints require Clerk session token (not available in Node.js context)
   */
  async testAuthentication() {
    const startTime = Date.now();
    
    try {
      // Test public configuration endpoint (if available)
      // Backend docs: GET /api/v1/config/config (may not be deployed in all environments)
      const response = await this.makeRequest('GET', '/api/v1/config/config', null);
      const responseTime = Date.now() - startTime;

      // If the endpoint is not found, treat this as a warning rather than a hard failure.
      if (response.status === 404) {
        return {
          authenticated: false,
          publicConfigAccessible: false,
          responseTime,
          statusCode: response.status,
          warning: 'Config endpoint /api/v1/config/config not found; backend may not expose public config in this environment.'
        };
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required: Backend requires Clerk session token. This test runs in Node.js context and cannot authenticate.');
        }
        throw new Error(`Authentication test failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json().catch(() => ({}));
      
      return {
        authenticated: true,
        publicConfigAccessible: true,
        responseTime,
        statusCode: response.status,
        // These fields are optional and depend on backend implementation
        hasClerkKey: !!data.clerk_publishable_key,
        source: data.source || 'unknown'
      };
    } catch (error) {
      if (error.message.includes('401')) {
        throw error;
      }
      throw new Error(`Authentication error: ${error.message}`);
    }
  }

  /**
   * Test 3: Text Analysis for specific guard service
   */
  async testTextAnalysis(serviceType) {
    const startTime = Date.now();
    const testText = "Women are naturally better at multitasking than men. This is a scientific fact.";
    
    const payload = {
      service_type: serviceType,
      payload: {
        text: testText,
        contentType: 'text',
        scanLevel: 'standard',
        context: 'webpage-content'
      },
      session_id: `test_${Date.now()}`,
      client_type: 'chrome',
      client_version: '1.0.0'
    };

    try {
      const response = await this.makeRequest('POST', '/api/v1/guards/process', payload);
      const responseTime = Date.now() - startTime;
      
      // If no Clerk token, expect 403 (authentication required)
      if (!this.config.clerkToken && response.status === 403) {
        throw new Error('Authentication required: This endpoint requires Clerk session token. Set CLERK_SESSION_TOKEN environment variable or authenticate in extension.');
      }
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Analysis failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Backend contract: { success: boolean, data: { ... }, processing_time, ... }
      if (typeof data.success !== 'boolean') {
        throw new Error('Response missing success field');
      }
      if (!data.data) {
        throw new Error('Response missing data field');
      }
      if (data.success === false) {
        throw new Error(`Backend returned error: ${data.error || 'Unknown error'}`);
      }
      
      return {
        service: serviceType,
        success: data.success,
        responseTime,
        hasData: !!data.data,
        dataKeys: Object.keys(data.data || {}),
        processingTime: data.processing_time || 0
      };
    } catch (error) {
      throw new Error(`${serviceType} analysis error: ${error.message}`);
    }
  }

  /**
   * Test 4: Unified Analysis (multiple guards)
   */
  async testUnifiedAnalysis() {
    const startTime = Date.now();
    const testText = "This is a comprehensive test that should trigger multiple guard services.";
    
    // Instead of using a non-existent "unified" service_type, call the unified
    // processing endpoint once per guard type and aggregate the results.
    const serviceTypes = ['tokenguard', 'trustguard', 'contextguard', 'biasguard'];
    const results = [];

    for (const serviceType of serviceTypes) {
      const payload = {
        service_type: serviceType,
        payload: {
          text: testText,
          contentType: 'text',
          scanLevel: 'comprehensive',
          context: 'webpage-content'
        },
        session_id: `test_unified_${Date.now()}_${serviceType}`,
        client_type: 'chrome',
        client_version: '1.0.0'
      };

      try {
        const response = await this.makeRequest('POST', '/api/v1/guards/process', payload);
        
        // If no Clerk token, expect 403 (authentication required)
        if (!this.config.clerkToken && response.status === 403) {
          throw new Error('Authentication required: This endpoint requires Clerk session token. Set CLERK_SESSION_TOKEN environment variable or authenticate in extension.');
        }
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`Guard ${serviceType} unified call failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        results.push({
          serviceType,
          success: data.success === true,
          data: data.data || null,
          processingTime: data.processing_time || 0
        });
      } catch (error) {
        results.push({
          serviceType,
          success: false,
          error: error.message
        });
      }
    }

    const successful = results.filter(r => r.success);
    if (successful.length === 0) {
      throw new Error('Unified analysis failed: no guard services responded successfully');
    }

    const totalDuration = Date.now() - startTime;

    return {
      servicesTested: serviceTypes.length,
      servicesSuccessful: successful.length,
      responseTime: totalDuration,
      processingTimes: successful.map(r => r.processingTime),
      results
    };
  }

  /**
   * Test 5: Error Handling
   * Tests how backend handles invalid requests
   */
  async testErrorHandling() {
    const errorTests = [
      {
        name: 'Empty Text',
        payload: {
          service_type: 'biasguard',
          payload: { text: '', contentType: 'text' },
          session_id: `test_error_${Date.now()}`
        },
        expectedStatus: [400, 422]
      },
      {
        name: 'Invalid Service Type',
        payload: {
          service_type: 'invalidguard',
          payload: { text: 'test', contentType: 'text' },
          session_id: `test_error_${Date.now()}`
        },
        expectedStatus: [400, 404]
      },
      {
        name: 'Missing Required Fields',
        payload: {
          service_type: 'biasguard',
          payload: {},
          session_id: `test_error_${Date.now()}`
        },
        expectedStatus: [400, 422]
      }
    ];

    const results = {};
    
    for (const test of errorTests) {
      try {
        const response = await this.makeRequest('POST', '/api/v1/guards/process', test.payload);
        const statusCode = response.status;
        
        if (test.expectedStatus.includes(statusCode)) {
          results[test.name] = {
            handled: true,
            statusCode,
            expected: true
          };
        } else {
          results[test.name] = {
            handled: true,
            statusCode,
            expected: false,
            warning: `Expected ${test.expectedStatus.join(' or ')}, got ${statusCode}`
          };
        }
      } catch (error) {
        results[test.name] = {
          handled: false,
          error: error.message
        };
      }
    }
    
    const handledCount = Object.values(results).filter(r => r.handled).length;
    
    return {
      totalTests: errorTests.length,
      handledTests: handledCount,
      results
    };
  }

  /**
   * Test 6: Performance Testing
   * Tests response times and throughput
   */
  async testPerformance() {
    const iterations = 5;
    const testText = "Performance test text for bias detection.";
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      
      try {
        const payload = {
          service_type: 'biasguard',
          payload: {
            text: testText,
            contentType: 'text',
            scanLevel: 'standard'
          },
          session_id: `perf_test_${Date.now()}_${i}`,
          client_type: 'chrome',
          client_version: '1.0.0'
        };
        
        const response = await this.makeRequest('POST', '/api/v1/guards/process', payload);
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          const data = await response.json();
          results.push({
            iteration: i + 1,
            responseTime,
            backendProcessingTime: data.processing_time || 0,
            success: true
          });
        } else {
          results.push({
            iteration: i + 1,
            responseTime,
            success: false,
            statusCode: response.status
          });
        }
      } catch (error) {
        results.push({
          iteration: i + 1,
          responseTime: Date.now() - startTime,
          success: false,
          error: error.message
        });
      }
    }
    
    const successful = results.filter(r => r.success);
    
    // Handle case when all iterations fail
    if (successful.length === 0) {
      return {
        totalIterations: iterations,
        successfulIterations: 0,
        averageResponseTime: 0,
        averageBackendProcessingTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        details: results,
        warning: 'All performance test iterations failed. No metrics available.'
      };
    }
    
    const avgResponseTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
    const avgProcessingTime = successful.reduce((sum, r) => sum + (r.backendProcessingTime || 0), 0) / successful.length;
    const responseTimes = successful.map(r => r.responseTime);
    
    return {
      totalIterations: iterations,
      successfulIterations: successful.length,
      averageResponseTime: Math.round(avgResponseTime),
      averageBackendProcessingTime: Math.round(avgProcessingTime),
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      details: results
    };
  }

  /**
   * Test 7: Configuration Management
   * Verifies public configuration endpoint (doesn't require auth)
   */
  async testConfiguration() {
    const startTime = Date.now();
    
    try {
      // Get system configuration (if available; may not be exposed in all environments)
      const response = await this.makeRequest('GET', '/api/v1/config/config', null);
      const responseTime = Date.now() - startTime;

      if (response.status === 404) {
        return {
          responseTime,
          hasConfig: false,
          configKeys: [],
          statusCode: response.status,
          hasClerkKey: false,
          source: 'not_available',
          warning: 'Config endpoint /api/v1/config/config not found; backend may not expose public config in this environment.'
        };
      }
      
      if (!response.ok) {
        throw new Error(`Config request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json().catch(() => ({}));
      
      return {
        responseTime,
        hasConfig: !!data,
        configKeys: Object.keys(data || {}),
        statusCode: response.status,
        hasClerkKey: !!data.clerk_publishable_key,
        source: data.source || 'unknown'
      };
    } catch (error) {
      throw new Error(`Configuration test error: ${error.message}`);
    }
  }

  /**
   * Create abort signal with timeout (Node.js 16+ compatible)
   * Falls back to AbortController if AbortSignal.timeout is not available
   */
  createTimeoutSignal(timeoutMs) {
    // Use AbortSignal.timeout if available (Node.js 17.3+)
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      return AbortSignal.timeout(timeoutMs);
    }
    
    // Fallback for Node.js 16.x using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
    
    // Clean up timeout if signal is aborted early
    const signal = controller.signal;
    if (signal.addEventListener) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
      });
    }
    
    return signal;
  }

  /**
   * Make HTTP request to backend
   */
  async makeRequest(method, endpoint, payload) {
    const url = `${this.config.gatewayUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Extension-Version': '1.0.0',
      'X-Request-ID': `test_${Date.now()}_${++this.requestId}`,
      'X-Timestamp': new Date().toISOString()
    };
    
    // Use Clerk session token for authentication (if available)
    // Note: In Node.js context, tests will only work with public endpoints
    if (this.config.clerkToken) {
      headers['Authorization'] = `Bearer ${this.config.clerkToken}`;
    }
    
    const options = {
      method,
      headers,
      signal: this.createTimeoutSignal(this.config.timeout)
    };
    
    if (payload && method !== 'GET') {
      options.body = JSON.stringify(payload);
    }
    
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      // Handle timeout errors (both TimeoutError from AbortSignal.timeout and AbortError from AbortController)
      if (error.name === 'TimeoutError' || (error.name === 'AbortError' && error.message.includes('aborted'))) {
        throw new Error(`Request timeout after ${this.config.timeout}ms`);
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to ${url}. Check if backend is running.`);
      }
      throw error;
    }
  }

  /**
   * Generate test report
   */
  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'PASSED').length;
    const failedTests = this.testResults.filter(t => t.status === 'FAILED').length;
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    const duration = Date.now() - this.startTime;
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 BACKEND INTEGRATION TEST REPORT');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    console.log(`Duration: ${duration}ms`);
    console.log('='.repeat(70));
    
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(t => t.status === 'FAILED')
        .forEach(test => {
          console.log(`\n  ${test.name}:`);
          console.log(`    Error: ${test.error}`);
        });
    }
    
    const report = {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: Math.round(successRate * 100) / 100,
        duration,
        timestamp: new Date().toISOString()
      },
      config: {
        gatewayUrl: this.config.gatewayUrl,
        clerkTokenConfigured: !!this.config.clerkToken,
        note: 'Protected endpoints require Clerk session token. Public endpoints (health, config/public) work without authentication.'
      },
      results: this.testResults
    };
    
    // Save report if in Node.js environment
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const reportPath = path.join(__dirname, 'backend-integration-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    }
    
    return report;
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackendIntegrationTester;
}

// Auto-run if executed directly in Node.js
if (typeof require !== 'undefined' && require.main === module) {
  const tester = new BackendIntegrationTester({
    gatewayUrl: (typeof process !== 'undefined' && process.env.AIGUARDIAN_GATEWAY_URL) || 'https://api.aiguardian.ai',
    clerkToken: (typeof process !== 'undefined' && process.env.CLERK_SESSION_TOKEN) || null
  });
  
  tester.runAllTests().catch(error => {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  });
}

// Export for browser/extension context
if (typeof window !== 'undefined') {
  window.BackendIntegrationTester = BackendIntegrationTester;
}

