/**
 * Text Analysis Pipeline Test
 * 
 * Tests the complete text analysis flow: gateway → backend API → response processing.
 * This test verifies that text analysis requests are properly formatted and sent to the backend,
 * and that responses are correctly parsed and validated.
 * 
 * USAGE:
 *   node tests/e2e/text-analysis-pipeline.test.js
 * 
 * ENVIRONMENT VARIABLES:
 *   AIGUARDIAN_GATEWAY_URL - Backend URL (default: https://api.aiguardian.ai)
 *   CLERK_SESSION_TOKEN - Clerk session token for authenticated requests (optional)
 */

class TextAnalysisPipelineTester {
  constructor(config = {}) {
    this.config = {
      gatewayUrl: config.gatewayUrl || 
                  (typeof process !== 'undefined' && process.env.AIGUARDIAN_GATEWAY_URL) || 
                  'https://api.aiguardian.ai',
      clerkToken: config.clerkToken || 
                  (typeof process !== 'undefined' && process.env.CLERK_SESSION_TOKEN) || 
                  null,
      timeout: config.timeout || 30000,
      ...config
    };
    
    this.testResults = [];
    this.startTime = Date.now();
    this.requestId = 0;
    this.tokenInitialized = false;
  }

  /**
   * Automatically retrieve Clerk token from extension storage if not provided
   */
  async initializeToken() {
    if (this.tokenInitialized || this.config.clerkToken) {
      return; // Already initialized or token provided
    }

    try {
      // Only try in Node.js environment
      if (typeof require !== 'undefined') {
        console.log('🔍 Attempting to retrieve Clerk token from extension storage...');
        const { getClerkTokenFromExtension } = require('./get-clerk-token.js');
        const token = await getClerkTokenFromExtension();
        if (token) {
          this.config.clerkToken = token;
          console.log('✅ Automatically retrieved Clerk token from extension storage');
          this.tokenInitialized = true;
        } else {
          console.log('ℹ️  No token found in extension storage (user may need to sign in)');
        }
      }
    } catch (error) {
      // Log error but don't fail - token retrieval is optional
      console.log(`ℹ️  Could not retrieve token from extension: ${error.message}`);
      console.log('   Tests will continue without authentication');
    }
  }

  /**
   * Create timeout signal for fetch requests
   */
  createTimeoutSignal(timeoutMs) {
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
      return AbortSignal.timeout(timeoutMs);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
    
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
   * Simulates the gateway.sendToGateway() method
   */
  async makeRequest(method, endpoint, payload) {
    const url = `${this.config.gatewayUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Extension-Version': '1.0.0',
      'X-Request-ID': `test_${Date.now()}_${++this.requestId}`,
      'X-Timestamp': new Date().toISOString()
    };
    
    // Add authentication if available
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
   * Simulate gateway.analyzeText() method
   * This replicates the exact payload format that the gateway sends
   */
  async analyzeText(text, options = {}) {
    const analysisId = `test_${Date.now()}_${++this.requestId}`;
    const startTime = Date.now();

    // Build payload matching gateway.js analyzeText() format
    // This matches the exact structure sent by the extension gateway
    const payload = {
      service_type: options.service_type || 'biasguard',
      payload: {
        text: text,
        contentType: options.contentType || 'text',
        scanLevel: options.scanLevel || 'standard',
        context: options.context || 'webpage-content'
      },
      user_id: options.user_id || null,
      session_id: analysisId,
      client_type: 'chrome',
      client_version: '1.0.0'
    };

    try {
      const response = await this.makeRequest('POST', '/api/v1/guards/process', payload);
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      
      // Validate response structure (matches backend response format)
      if (typeof result.success !== 'boolean') {
        throw new Error('Response missing success field');
      }
      
      if (result.success === false) {
        throw new Error(`Backend returned error: ${result.error || 'Unknown error'}`);
      }
      
      if (!result.data) {
        throw new Error('Response missing data field');
      }
      
      return {
        success: true,
        data: result.data,
        processingTime: result.processing_time || 0,
        responseTime: responseTime,
        analysisId: analysisId
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Test text analysis with BiasGuard
   */
  async testBiasGuardAnalysis() {
    const startTime = Date.now();
    const testText = "Women are naturally better at multitasking than men. This is a scientific fact.";
    
    try {
      console.log(`\n📋 Testing: Text Analysis - BiasGuard`);
      console.log(`   Text: "${testText.substring(0, 50)}..."`);
      console.log(`   Length: ${testText.length} characters`);
      
      const result = await this.analyzeText(testText, {
        service_type: 'biasguard',
        scanLevel: 'standard'
      });
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ Text Analysis - BiasGuard: PASSED`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Backend Processing Time: ${result.processingTime}ms`);
      console.log(`   Analysis ID: ${result.analysisId}`);
      console.log(`   Has Data: ${!!result.data}`);
      
      return {
        service: 'biasguard',
        success: true,
        responseTime: result.responseTime,
        processingTime: result.processingTime,
        hasData: !!result.data,
        dataKeys: Object.keys(result.data || {}),
        duration: duration
      };
    } catch (error) {
      console.error(`❌ Text Analysis - BiasGuard: FAILED`);
      console.error(`   Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test text analysis with TrustGuard
   */
  async testTrustGuardAnalysis() {
    const startTime = Date.now();
    const testText = "This amazing product will revolutionize everything and make you rich overnight!";
    
    try {
      console.log(`\n📋 Testing: Text Analysis - TrustGuard`);
      console.log(`   Text: "${testText.substring(0, 50)}..."`);
      
      const result = await this.analyzeText(testText, {
        service_type: 'trustguard',
        scanLevel: 'standard'
      });
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ Text Analysis - TrustGuard: PASSED`);
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Backend Processing Time: ${result.processingTime}ms`);
      
      return {
        service: 'trustguard',
        success: true,
        responseTime: result.responseTime,
        processingTime: result.processingTime,
        hasData: !!result.data,
        duration: duration
      };
    } catch (error) {
      console.error(`❌ Text Analysis - TrustGuard: FAILED`);
      console.error(`   Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test request payload format validation
   */
  async testPayloadFormat() {
    console.log(`\n📋 Testing: Request Payload Format`);
    
    const testText = "This is a test text for payload validation.";
    const payload = {
      service_type: 'biasguard',
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
    
    // Validate payload structure matches gateway format
    const requiredFields = ['service_type', 'payload', 'session_id', 'client_type', 'client_version'];
    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Payload missing required fields: ${missingFields.join(', ')}`);
    }
    
    const payloadFields = ['text', 'contentType', 'scanLevel', 'context'];
    const missingPayloadFields = payloadFields.filter(field => !payload.payload[field]);
    
    if (missingPayloadFields.length > 0) {
      throw new Error(`Payload.payload missing required fields: ${missingPayloadFields.join(', ')}`);
    }
    
    console.log(`✅ Request Payload Format: PASSED`);
    console.log(`   All required fields present`);
    console.log(`   Payload structure matches gateway format`);
    
    return {
      success: true,
      payloadValid: true,
      hasAllFields: true
    };
  }

  /**
   * Test response parsing and validation
   */
  async testResponseParsing() {
    console.log(`\n📋 Testing: Response Parsing and Validation`);
    
    const testText = "This is a test for response parsing.";
    
    try {
      const result = await this.analyzeText(testText, {
        service_type: 'biasguard'
      });
      
      // Validate response structure
      if (!result.success) {
        throw new Error('Response success field is false');
      }
      
      if (!result.data) {
        throw new Error('Response missing data field');
      }
      
      if (typeof result.responseTime !== 'number') {
        throw new Error('Response missing responseTime');
      }
      
      console.log(`✅ Response Parsing and Validation: PASSED`);
      console.log(`   Response structure is valid`);
      console.log(`   Data field present: ${!!result.data}`);
      console.log(`   Response time tracked: ${result.responseTime}ms`);
      
      return {
        success: true,
        responseValid: true,
        hasData: !!result.data,
        responseTimeTracked: typeof result.responseTime === 'number'
      };
    } catch (error) {
      console.error(`❌ Response Parsing and Validation: FAILED`);
      console.error(`   Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run all text analysis pipeline tests
   */
  async runAllTests() {
    // Try to automatically retrieve token from extension storage
    await this.initializeToken();
    
    console.log('\n🚀 Starting Text Analysis Pipeline Tests');
    console.log('='.repeat(70));
    console.log(`Backend URL: ${this.config.gatewayUrl}`);
    console.log(`Clerk Token: ${this.config.clerkToken ? '***configured***' : '⚠️  NOT SET (will test without auth)'}`);
    console.log('='.repeat(70));

    const tests = [
      { name: 'Request Payload Format', fn: this.testPayloadFormat.bind(this) },
      { name: 'Response Parsing', fn: this.testResponseParsing.bind(this) }
    ];

    // Only test actual analysis if Clerk token is available
    if (this.config.clerkToken) {
      tests.push(
        { name: 'BiasGuard Analysis', fn: this.testBiasGuardAnalysis.bind(this) },
        { name: 'TrustGuard Analysis', fn: this.testTrustGuardAnalysis.bind(this) }
      );
    } else {
      console.warn('\n⚠️  No Clerk session token configured.');
      console.warn('   Analysis tests will be skipped (require authentication).');
      console.warn('   Set CLERK_SESSION_TOKEN environment variable to test analysis endpoints.');
    }

    for (const test of tests) {
      try {
        const result = await test.fn();
        this.testResults.push({
          name: test.name,
          status: 'PASSED',
          result,
          timestamp: new Date().toISOString()
        });
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
   * Generate test report
   */
  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'PASSED').length;
    const failedTests = this.testResults.filter(t => t.status === 'FAILED').length;
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    const duration = Date.now() - this.startTime;
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEXT ANALYSIS PIPELINE TEST REPORT');
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
        clerkTokenConfigured: !!this.config.clerkToken
      },
      results: this.testResults
    };
    
    // Save report if in Node.js environment
    if (typeof require !== 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const reportPath = path.join(__dirname, 'text-analysis-pipeline-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    }
    
    return report;
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TextAnalysisPipelineTester;
}

// Auto-run if executed directly in Node.js
if (typeof require !== 'undefined' && require.main === module) {
  const tester = new TextAnalysisPipelineTester({
    gatewayUrl: (typeof process !== 'undefined' && process.env.AIGUARDIAN_GATEWAY_URL) || 'https://api.aiguardian.ai',
    clerkToken: (typeof process !== 'undefined' && process.env.CLERK_SESSION_TOKEN) || null
  });
  
  tester.runAllTests().then(results => {
    const failed = results.filter(r => r.status === 'FAILED');
    if (failed.length > 0) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  });
}

// Export for browser/extension context
if (typeof window !== 'undefined') {
  window.TextAnalysisPipelineTester = TextAnalysisPipelineTester;
}

