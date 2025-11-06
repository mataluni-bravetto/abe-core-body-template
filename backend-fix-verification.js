/**
 * Backend Fix Verification Script
 * Run this after fixing the gateway-to-guard internal routing
 */

const https = require('https');

class BackendFixVerification {
  constructor() {
    this.backendUrl = 'https://api.internal.aiguardian.ai';
    this.apiKey = process.env.AIGUARDIAN_API_KEY || 'test-api-key';
    this.testResults = [];
  }

  async makeRequest(endpoint, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.backendUrl);

      const requestOptions = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Request-ID': `verification_${Date.now()}`,
          'X-Timestamp': new Date().toISOString()
        }
      };

      if (body) {
        const data = JSON.stringify(body);
        requestOptions.headers['Content-Length'] = data.length;
      }

      const req = https.request(requestOptions, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const response = {
              status: res.statusCode,
              headers: res.headers,
              data: responseData ? JSON.parse(responseData) : null
            };
            resolve(response);
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: responseData,
              parseError: error.message
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  async testAnalysisFunctionality() {
    console.log('🔍 Testing analysis functionality after backend fix...');

    try {
      const response = await this.makeRequest('/api/v1/guards/process', 'POST', {
        service_type: 'biasguard',
        payload: {
          text: 'This is a test to verify the backend fix works correctly.',
          contentType: 'text',
          scanLevel: 'standard',
          context: 'webpage-content'
        },
        user_id: null,
        session_id: `fix_verification_${Date.now()}`,
        client_type: 'chrome',
        client_version: '1.0.0'
      });

      if (response.status === 200 && response.data && !response.data.error) {
        console.log('✅ SUCCESS: Analysis working correctly!');
        console.log(`   Score: ${response.data.overall_score || 'N/A'}`);
        console.log(`   Response time: ${response.data.processing_time || 'N/A'}s`);
        return true;
      } else {
        console.log('❌ FAILED: Analysis still not working');
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${response.data?.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.log('❌ ERROR: Request failed');
      console.log(`   Message: ${error.message}`);
      return false;
    }
  }

  async runVerification() {
    console.log('🚀 Backend Fix Verification');
    console.log('='.repeat(50));
    console.log(`Testing backend at: ${this.backendUrl}`);
    console.log('');

    const success = await this.testAnalysisFunctionality();

    console.log('');
    console.log('📋 VERIFICATION RESULT:');
    console.log('='.repeat(30));

    if (success) {
      console.log('🎉 BACKEND FIX SUCCESSFUL!');
      console.log('✅ Guard services are now accessible through gateway');
      console.log('✅ Extension analysis functionality restored');
      console.log('');
      console.log('🚀 The AiGuardian Chrome Extension is now FULLY OPERATIONAL!');
    } else {
      console.log('❌ BACKEND FIX INCOMPLETE');
      console.log('⚠️  Guard services still returning 404 errors');
      console.log('🔧 Additional backend configuration needed');
      console.log('');
      console.log('📞 Check the diagnosis steps above and try again');
    }

    return success;
  }
}

// Run verification if this file is executed directly
if (require.main === module) {
  const verification = new BackendFixVerification();

  verification.runVerification()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Verification failed:', error);
      process.exit(1);
    });
}

module.exports = BackendFixVerification;
