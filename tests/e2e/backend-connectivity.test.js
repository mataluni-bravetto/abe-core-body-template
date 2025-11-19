/**
 * Backend Connectivity Test
 * 
 * Verifies that the backend API is reachable and responding correctly.
 * This is a prerequisite for all other E2E tests.
 * 
 * USAGE:
 *   node tests/e2e/backend-connectivity.test.js
 * 
 * ENVIRONMENT VARIABLES:
 *   AIGUARDIAN_GATEWAY_URL - Backend URL (default: https://api.aiguardian.ai)
 */

class BackendConnectivityTester {
  constructor(config = {}) {
    this.config = {
      gatewayUrl: config.gatewayUrl || 
                  (typeof process !== 'undefined' && process.env.AIGUARDIAN_GATEWAY_URL) || 
                  'https://api.aiguardian.ai',
      timeout: config.timeout || 10000,
      ...config
    };
    
    this.testResults = [];
    this.startTime = Date.now();
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
   */
  async makeRequest(method, endpoint) {
    const url = `${this.config.gatewayUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Extension-Version': '1.0.0',
      'X-Request-ID': `test_${Date.now()}`,
      'X-Timestamp': new Date().toISOString()
    };
    
    const options = {
      method,
      headers,
      signal: this.createTimeoutSignal(this.config.timeout)
    };
    
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
   * Test backend health check endpoint
   */
  async testHealthCheck() {
    const startTime = Date.now();
    
    try {
      console.log(`\n📋 Testing: Backend Health Check`);
      console.log(`   Endpoint: ${this.config.gatewayUrl}/health/live`);
      
      const response = await this.makeRequest('GET', '/health/live');
      const responseTime = Date.now() - startTime;
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json().catch(() => ({}));
      
      const result = {
        status: 'healthy',
        responseTime,
        statusCode: response.status,
        data: data,
        timestamp: new Date().toISOString()
      };
      
      console.log(`✅ Backend Health Check: PASSED`);
      console.log(`   Response Time: ${responseTime}ms`);
      console.log(`   Status Code: ${response.status}`);
      
      return result;
    } catch (error) {
      console.error(`❌ Backend Health Check: FAILED`);
      console.error(`   Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test backend connectivity with multiple attempts
   */
  async testConnectivity() {
    console.log('\n🚀 Starting Backend Connectivity Tests');
    console.log('='.repeat(70));
    console.log(`Backend URL: ${this.config.gatewayUrl}`);
    console.log('='.repeat(70));

    try {
      const result = await this.testHealthCheck();
      this.testResults.push({
        name: 'Backend Health Check',
        status: 'PASSED',
        result,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        results: this.testResults,
        summary: {
          totalTests: 1,
          passedTests: 1,
          failedTests: 0,
          duration: Date.now() - this.startTime
        }
      };
    } catch (error) {
      this.testResults.push({
        name: 'Backend Health Check',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      console.log('\n' + '='.repeat(70));
      console.log('📊 CONNECTIVITY TEST SUMMARY');
      console.log('='.repeat(70));
      console.log(`❌ Backend is NOT reachable`);
      console.log(`   Error: ${error.message}`);
      console.log(`   URL: ${this.config.gatewayUrl}`);
      console.log('='.repeat(70));
      
      return {
        success: false,
        results: this.testResults,
        summary: {
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          duration: Date.now() - this.startTime,
          error: error.message
        }
      };
    }
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackendConnectivityTester;
}

// Auto-run if executed directly in Node.js
if (typeof require !== 'undefined' && require.main === module) {
  const tester = new BackendConnectivityTester({
    gatewayUrl: (typeof process !== 'undefined' && process.env.AIGUARDIAN_GATEWAY_URL) || 'https://api.aiguardian.ai'
  });
  
  tester.testConnectivity().then(result => {
    if (!result.success) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  });
}

// Export for browser/extension context
if (typeof window !== 'undefined') {
  window.BackendConnectivityTester = BackendConnectivityTester;
}

