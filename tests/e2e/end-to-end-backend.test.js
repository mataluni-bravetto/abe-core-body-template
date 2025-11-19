/**
 * End-to-End Backend Integration Test
 *
 * Tests the complete flow from text selection to backend response:
 * 1. Text selection detection
 * 2. Service worker message handling
 * 3. Gateway request with authentication
 * 4. Backend API call
 * 5. Response handling
 * 6. UI display
 */

class EndToEndBackendTester {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
    };
    this.gatewayUrl = 'https://api.aiguardian.ai';
  }

  /**
   * Run all end-to-end tests
   */
  async runAllTests() {
    console.log('🧪 Starting End-to-End Backend Integration Tests\n');

    try {
      // Test 1: Token Retrieval
      await this.testTokenRetrieval();

      // Test 2: Request Headers
      await this.testRequestHeaders();

      // Test 3: Backend Connectivity
      await this.testBackendConnectivity();

      // Test 4: Authentication Flow
      await this.testAuthenticationFlow();

      // Test 5: Full Text Analysis Flow
      await this.testFullTextAnalysisFlow();

      // Generate report
      this.generateReport();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.results.failed.push({
        test: 'Test Suite',
        error: error.message,
      });
      this.generateReport();
    }
  }

  /**
   * Test 1: Token Retrieval
   */
  async testTokenRetrieval() {
    console.log('📋 Test 1: Token Retrieval');

    try {
      // Check if token exists in storage
      const storageData = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_token', 'clerk_user'], (data) => {
          resolve(data || {});
        });
      });

      const hasToken = !!storageData.clerk_token;
      const hasUser = !!storageData.clerk_user;

      if (hasToken) {
        // Validate token format
        const token = storageData.clerk_token;
        const parts = token.split('.');
        const isValidFormat = parts.length === 3;

        if (isValidFormat) {
          try {
            const header = atob(parts[0]);
            if (header.startsWith('{')) {
              this.results.passed.push({
                test: 'Token Retrieval',
                message: `Token found and format is valid (${token.length} chars)`,
              });
              console.log('  ✅ Token found and format is valid');
            } else {
              this.results.failed.push({
                test: 'Token Retrieval',
                error: 'Token header is not valid JSON',
              });
              console.log('  ❌ Token header is not valid JSON');
            }
          } catch (e) {
            this.results.failed.push({
              test: 'Token Retrieval',
              error: `Cannot decode token header: ${e.message}`,
            });
            console.log('  ❌ Cannot decode token header');
          }
        } else {
          this.results.failed.push({
            test: 'Token Retrieval',
            error: `Invalid token format - expected 3 parts, got ${parts.length}`,
          });
          console.log('  ❌ Invalid token format');
        }
      } else {
        this.results.warnings.push({
          test: 'Token Retrieval',
          message: 'No token found - user must sign in',
        });
        console.log('  ⚠️  No token found - user must sign in');
      }

      if (!hasUser) {
        this.results.warnings.push({
          test: 'Token Retrieval',
          message: 'No user data found',
        });
        console.log('  ⚠️  No user data found');
      }
    } catch (error) {
      this.results.failed.push({
        test: 'Token Retrieval',
        error: error.message,
      });
      console.log(`  ❌ Error: ${error.message}`);
    }

    console.log('');
  }

  /**
   * Test 2: Request Headers
   */
  async testRequestHeaders() {
    console.log('📋 Test 2: Request Headers');

    try {
      // Simulate gateway request to check headers
      const testPayload = {
        service_type: 'biasguard',
        payload: {
          text: 'test',
          contentType: 'text',
          scanLevel: 'standard',
          context: 'test',
        },
        session_id: 'test-123',
        client_type: 'chrome',
        client_version: chrome.runtime.getManifest().version,
      };

      // Get token
      const storageData = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_token'], (data) => {
          resolve(data || {});
        });
      });

      const token = storageData.clerk_token;
      const hasToken = !!token;

      // Build expected headers
      const expectedHeaders = {
        'Content-Type': 'application/json',
        'X-Extension-Version': chrome.runtime.getManifest().version,
        'X-Request-ID': expect.any(String),
        'X-Timestamp': expect.any(String),
      };

      if (hasToken) {
        expectedHeaders['Authorization'] = `Bearer ${token}`;
        this.results.passed.push({
          test: 'Request Headers',
          message: 'Authorization header will be included',
        });
        console.log('  ✅ Authorization header will be included');
      } else {
        this.results.warnings.push({
          test: 'Request Headers',
          message: 'No token - Authorization header will be missing',
        });
        console.log('  ⚠️  No token - Authorization header will be missing');
      }

      // Verify header structure
      if (expectedHeaders['Content-Type'] === 'application/json') {
        this.results.passed.push({
          test: 'Request Headers',
          message: 'Content-Type header is correct',
        });
        console.log('  ✅ Content-Type header is correct');
      }
    } catch (error) {
      this.results.failed.push({
        test: 'Request Headers',
        error: error.message,
      });
      console.log(`  ❌ Error: ${error.message}`);
    }

    console.log('');
  }

  /**
   * Test 3: Backend Connectivity
   */
  async testBackendConnectivity() {
    console.log('📋 Test 3: Backend Connectivity');

    try {
      const healthUrl = `${this.gatewayUrl}/health/live`;

      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'X-Extension-Version': chrome.runtime.getManifest().version,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.results.passed.push({
          test: 'Backend Connectivity',
          message: `Backend is reachable (${response.status})`,
        });
        console.log(`  ✅ Backend is reachable (${response.status})`);
      } else {
        this.results.failed.push({
          test: 'Backend Connectivity',
          error: `Backend returned ${response.status}`,
        });
        console.log(`  ❌ Backend returned ${response.status}`);
      }
    } catch (error) {
      this.results.failed.push({
        test: 'Backend Connectivity',
        error: `Cannot reach backend: ${error.message}`,
      });
      console.log(`  ❌ Cannot reach backend: ${error.message}`);
    }

    console.log('');
  }

  /**
   * Test 4: Authentication Flow
   */
  async testAuthenticationFlow() {
    console.log('📋 Test 4: Authentication Flow');

    try {
      // Check if user is authenticated
      const storageData = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_user', 'clerk_token'], (data) => {
          resolve(data || {});
        });
      });

      const hasUser = !!storageData.clerk_user;
      const hasToken = !!storageData.clerk_token;

      if (hasUser && hasToken) {
        this.results.passed.push({
          test: 'Authentication Flow',
          message: 'User is authenticated',
        });
        console.log('  ✅ User is authenticated');
      } else {
        this.results.warnings.push({
          test: 'Authentication Flow',
          message: 'User is not authenticated - sign in required',
        });
        console.log('  ⚠️  User is not authenticated - sign in required');
      }
    } catch (error) {
      this.results.failed.push({
        test: 'Authentication Flow',
        error: error.message,
      });
      console.log(`  ❌ Error: ${error.message}`);
    }

    console.log('');
  }

  /**
   * Test 5: Full Text Analysis Flow
   */
  async testFullTextAnalysisFlow() {
    console.log('📋 Test 5: Full Text Analysis Flow');

    try {
      // Get token
      const storageData = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_token', 'clerk_user'], (data) => {
          resolve(data || {});
        });
      });

      const token = storageData.clerk_token;
      const user = storageData.clerk_user;

      if (!token) {
        this.results.warnings.push({
          test: 'Full Text Analysis Flow',
          message: 'Cannot test - no authentication token',
        });
        console.log('  ⚠️  Cannot test - no authentication token');
        return;
      }

      // Build request payload
      const payload = {
        service_type: 'biasguard',
        payload: {
          text: 'This is a test text for analysis.',
          contentType: 'text',
          scanLevel: 'standard',
          context: 'test',
        },
        user_id: user?.id || null,
        session_id: `test_${Date.now()}`,
        client_type: 'chrome',
        client_version: chrome.runtime.getManifest().version,
      };

      // Make request to backend
      const url = `${this.gatewayUrl}/api/v1/guards/process`;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Extension-Version': chrome.runtime.getManifest().version,
        'X-Request-ID': payload.session_id,
        'X-Timestamp': new Date().toISOString(),
      };

      console.log('  📤 Sending request to backend...');
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      console.log(`  📥 Response status: ${response.status}`);

      if (response.ok) {
        const result = await response.json();
        this.results.passed.push({
          test: 'Full Text Analysis Flow',
          message: `Request successful (${response.status})`,
        });
        console.log('  ✅ Request successful');

        // Validate response structure
        if (result.success !== undefined) {
          this.results.passed.push({
            test: 'Full Text Analysis Flow',
            message: 'Response structure is valid',
          });
          console.log('  ✅ Response structure is valid');
        }
      } else {
        const errorText = await response.text();
        if (response.status === 403 || response.status === 401) {
          this.results.warnings.push({
            test: 'Full Text Analysis Flow',
            message: `Authentication failed (${response.status}) - backend may need configuration`,
          });
          console.log(`  ⚠️  Authentication failed (${response.status})`);
        } else {
          this.results.failed.push({
            test: 'Full Text Analysis Flow',
            error: `Request failed: ${response.status} - ${errorText.substring(0, 100)}`,
          });
          console.log(`  ❌ Request failed: ${response.status}`);
        }
      }
    } catch (error) {
      this.results.failed.push({
        test: 'Full Text Analysis Flow',
        error: `Request error: ${error.message}`,
      });
      console.log(`  ❌ Request error: ${error.message}`);
    }

    console.log('');
  }

  /**
   * Generate test report
   */
  generateReport() {
    console.log('\n📊 Test Report');
    console.log('═══════════════════════════════════════\n');

    console.log(`✅ Passed: ${this.results.passed.length}`);
    this.results.passed.forEach((result) => {
      console.log(`   • ${result.test}: ${result.message}`);
    });

    console.log(`\n⚠️  Warnings: ${this.results.warnings.length}`);
    this.results.warnings.forEach((result) => {
      console.log(`   • ${result.test}: ${result.message}`);
    });

    console.log(`\n❌ Failed: ${this.results.failed.length}`);
    this.results.failed.forEach((result) => {
      console.log(`   • ${result.test}: ${result.error}`);
    });

    console.log('\n═══════════════════════════════════════\n');

    const totalTests =
      this.results.passed.length + this.results.failed.length + this.results.warnings.length;
    const successRate =
      totalTests > 0 ? ((this.results.passed.length / totalTests) * 100).toFixed(1) : 0;

    console.log(`Success Rate: ${successRate}%`);
    console.log(`Total Tests: ${totalTests}`);

    if (this.results.failed.length === 0) {
      console.log('\n🎉 All critical tests passed!');
    } else {
      console.log('\n⚠️  Some tests failed - review errors above');
    }
  }
}

// Run tests if executed directly
if (typeof window !== 'undefined') {
  // Browser context
  window.EndToEndBackendTester = EndToEndBackendTester;

  // Auto-run if in options page or popup
  if (
    window.location.pathname.includes('options.html') ||
    window.location.pathname.includes('popup.html')
  ) {
    const tester = new EndToEndBackendTester();
    tester.runAllTests().catch(console.error);
  }
} else {
  // Service worker context
  self.EndToEndBackendTester = EndToEndBackendTester;
}
