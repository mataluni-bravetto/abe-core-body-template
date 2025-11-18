/**
 * Full Extension E2E Test
 * 
 * Tests the complete end-to-end flow:
 * User selects text → Content script → Service worker → Gateway → Backend API → Response → UI display
 * 
 * This test uses Puppeteer to load the extension in a real Chrome browser and
 * verifies the complete user experience.
 * 
 * USAGE:
 *   node tests/e2e/full-text-analysis-flow.test.js
 * 
 * REQUIREMENTS:
 *   - Puppeteer installed
 *   - Extension built and ready to load
 *   - Backend API accessible (or mocked)
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

class FullTextAnalysisFlowTester {
  constructor(config = {}) {
    this.config = {
      extensionPath: config.extensionPath || path.resolve(__dirname, '../../'),
      gatewayUrl: config.gatewayUrl || 
                  (typeof process !== 'undefined' && process.env.AIGUARDIAN_GATEWAY_URL) || 
                  'https://api.aiguardian.ai',
      headless: config.headless !== undefined ? config.headless : false,
      slowMo: config.slowMo || 100,
      timeout: config.timeout || 30000,
      ...config
    };
    
    this.browser = null;
    this.page = null;
    this.extensionId = null;
    this.testResults = [];
    this.startTime = Date.now();
    this.networkRequests = [];
  }

  /**
   * Helper function to wait/delay (replaces deprecated waitForTimeout)
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create test HTML page with sample text
   */
  createTestHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AiGuardian E2E Test Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.6;
        }
        .test-section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .test-text {
            background: #f5f5f5;
            padding: 15px;
            margin: 10px 0;
            border-radius: 3px;
        }
        h1 { color: #333; }
        h2 { color: #666; }
    </style>
</head>
<body>
    <h1>AiGuardian Extension E2E Test Page</h1>
    
    <div class="test-section">
        <h2>Test Text 1: Bias Detection</h2>
        <div class="test-text" id="test-text-1">
            Women are naturally better at multitasking than men. This is a scientific fact that has been proven by numerous studies.
        </div>
    </div>
    
    <div class="test-section">
        <h2>Test Text 2: Trust Analysis</h2>
        <div class="test-text" id="test-text-2">
            This amazing product will revolutionize everything and make you rich overnight! Guaranteed results or your money back!
        </div>
    </div>
    
    <div class="test-section">
        <h2>Test Text 3: Standard Content</h2>
        <div class="test-text" id="test-text-3">
            The quick brown fox jumps over the lazy dog. This is a standard sentence used for testing purposes.
        </div>
    </div>
    
    <div id="test-results" style="margin-top: 30px; padding: 20px; background: #e8f5e9; border-radius: 5px; display: none;">
        <h2>Test Results</h2>
        <div id="results-content"></div>
    </div>
</body>
</html>`;
  }

  /**
   * Launch browser with extension loaded
   */
  async launchBrowser() {
    console.log('\n🚀 Launching browser with extension...');
    console.log(`   Extension path: ${this.config.extensionPath}`);
    
    this.browser = await puppeteer.launch({
      headless: this.config.headless,
      slowMo: this.config.slowMo,
      args: [
        `--disable-extensions-except=${this.config.extensionPath}`,
        `--load-extension=${this.config.extensionPath}`,
        '--disable-web-security', // Allow extension to access all URLs
        '--disable-features=IsolateOrigins,site-per-process' // Allow extension to work on all pages
      ]
    });

    // Wait for extension service worker to load
    const extensionTarget = await this.browser.waitForTarget(
      (target) => target.type() === 'service_worker',
      { timeout: 10000 }
    );
    
    const partialExtensionUrl = extensionTarget.url() || '';
    this.extensionId = partialExtensionUrl.split('/')[2];
    
    console.log(`✅ Extension loaded: ${this.extensionId}`);
    
    // Create new page
    this.page = await this.browser.newPage();
    
    // Set up network request monitoring
    this.page.on('request', (request) => {
      const url = request.url();
      if (url.includes(this.config.gatewayUrl) || url.includes('api.aiguardian.ai')) {
        this.networkRequests.push({
          url: url,
          method: request.method(),
          timestamp: Date.now(),
          type: 'backend_request'
        });
      }
    });
    
    this.page.on('response', (response) => {
      const url = response.url();
      if (url.includes(this.config.gatewayUrl) || url.includes('api.aiguardian.ai')) {
        const request = this.networkRequests.find(r => r.url === url);
        if (request) {
          request.status = response.status();
          request.responseTime = Date.now() - request.timestamp;
        }
      }
    });
  }

  /**
   * Create test page and navigate to it
   */
  async setupTestPage() {
    console.log('\n📄 Setting up test page...');
    
    // Create temporary HTML file
    const testHTML = this.createTestHTML();
    const testFilePath = path.join(__dirname, 'test-page.html');
    fs.writeFileSync(testFilePath, testHTML);
    
    // Navigate to test page
    await this.page.goto(`file://${testFilePath}`, { waitUntil: 'networkidle0' });
    
    console.log('✅ Test page loaded');
    
    // Wait for content script to inject
    await this.delay(1000);
  }

  /**
   * Simulate text selection
   */
  async selectText(selector) {
    console.log(`\n📝 Selecting text: ${selector}`);
    
    const element = await this.page.$(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    
    // Get bounding box
    const box = await element.boundingBox();
    if (!box) {
      throw new Error(`Element has no bounding box: ${selector}`);
    }
    
    // Simulate mouse selection
    await this.page.mouse.move(box.x + 10, box.y + 10);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + box.width - 10, box.y + box.height - 10);
    await this.page.mouse.up();
    
    // Wait a bit for selection to register
    await this.delay(500);
    
    console.log('✅ Text selected');
  }

  /**
   * Check if badge is displayed
   */
  async checkBadgeDisplayed() {
    console.log('\n🔍 Checking for badge display...');
    
    // Badge is created by content script, check if it exists
    const badgeExists = await this.page.evaluate(() => {
      const badges = document.querySelectorAll('[id^="aiguardian-badge"]');
      return badges.length > 0;
    });
    
    if (badgeExists) {
      console.log('✅ Badge displayed');
      return true;
    } else {
      console.log('⚠️  Badge not found (may be timing issue)');
      return false;
    }
  }

  /**
   * Check if text is highlighted
   */
  async checkHighlightDisplayed() {
    console.log('\n🔍 Checking for text highlight...');
    
    const highlightExists = await this.page.evaluate(() => {
      const highlights = document.querySelectorAll('[class*="aiguardian-highlight"]');
      return highlights.length > 0;
    });
    
    if (highlightExists) {
      console.log('✅ Text highlighted');
      return true;
    } else {
      console.log('⚠️  Highlight not found (may be timing issue)');
      return false;
    }
  }

  /**
   * Test complete text analysis flow
   */
  async testTextAnalysisFlow(testTextSelector, testName) {
    console.log(`\n📋 Testing: ${testName}`);
    
    try {
      // Clear previous network requests
      this.networkRequests = [];
      
      // Select text
      await this.selectText(testTextSelector);
      
      // Wait for analysis to complete (check for network request)
      let requestFound = false;
      const maxWait = 10000; // 10 seconds
      const startWait = Date.now();
      
      while (!requestFound && (Date.now() - startWait) < maxWait) {
        await this.delay(500);
        requestFound = this.networkRequests.length > 0;
      }
      
      if (!requestFound) {
        throw new Error('Backend request not detected - extension may not be sending requests');
      }
      
      const request = this.networkRequests[0];
      console.log(`✅ Backend request detected`);
      console.log(`   URL: ${request.url}`);
      console.log(`   Method: ${request.method}`);
      console.log(`   Status: ${request.status || 'pending'}`);
      
      // Wait for response
      if (request.status) {
        console.log(`   Response Time: ${request.responseTime}ms`);
        
        if (request.status >= 200 && request.status < 300) {
          console.log(`✅ Backend responded successfully`);
        } else {
          console.warn(`⚠️  Backend returned status: ${request.status}`);
        }
      }
      
      // Check for UI updates
      await this.delay(1000); // Wait for UI to update
      
      const badgeDisplayed = await this.checkBadgeDisplayed();
      const highlightDisplayed = await this.checkHighlightDisplayed();
      
      return {
        success: true,
        requestSent: true,
        requestUrl: request.url,
        requestMethod: request.method,
        requestStatus: request.status,
        responseTime: request.responseTime,
        badgeDisplayed: badgeDisplayed,
        highlightDisplayed: highlightDisplayed
      };
    } catch (error) {
      console.error(`❌ ${testName}: FAILED`);
      console.error(`   Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run all E2E tests
   */
  async runAllTests() {
    console.log('\n🚀 Starting Full Extension E2E Tests');
    console.log('='.repeat(70));
    console.log(`Extension Path: ${this.config.extensionPath}`);
    console.log(`Backend URL: ${this.config.gatewayUrl}`);
    console.log('='.repeat(70));

    try {
      // Launch browser
      await this.launchBrowser();
      
      // Setup test page
      await this.setupTestPage();
      
      // Run tests
      const tests = [
        {
          name: 'Bias Detection Flow',
          selector: '#test-text-1',
          description: 'Test complete flow with bias detection text'
        },
        {
          name: 'Trust Analysis Flow',
          selector: '#test-text-2',
          description: 'Test complete flow with trust analysis text'
        }
      ];
      
      for (const test of tests) {
        try {
          const result = await this.testTextAnalysisFlow(test.selector, test.name);
          this.testResults.push({
            name: test.name,
            status: 'PASSED',
            result,
            timestamp: new Date().toISOString()
          });
          console.log(`✅ ${test.name}: PASSED`);
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
        
        // Wait between tests
        await this.delay(2000);
      }
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('\n💥 Test execution failed:', error);
      throw error;
    } finally {
      // Cleanup
      if (this.page) {
        await this.page.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
      
      // Clean up test HTML file
      const testFilePath = path.join(__dirname, 'test-page.html');
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    }
    
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
    console.log('📊 FULL EXTENSION E2E TEST REPORT');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${successRate.toFixed(1)}%`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Network Requests: ${this.networkRequests.length}`);
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
        networkRequests: this.networkRequests.length,
        timestamp: new Date().toISOString()
      },
      config: {
        extensionPath: this.config.extensionPath,
        gatewayUrl: this.config.gatewayUrl
      },
      networkRequests: this.networkRequests,
      results: this.testResults
    };
    
    // Save report
    const reportPath = path.join(__dirname, 'full-text-analysis-flow-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    return report;
  }
}

// Auto-run if executed directly
if (require.main === module) {
  const tester = new FullTextAnalysisFlowTester({
    extensionPath: path.resolve(__dirname, '../../'),
    gatewayUrl: (typeof process !== 'undefined' && process.env.AIGUARDIAN_GATEWAY_URL) || 'https://api.aiguardian.ai',
    headless: process.env.HEADLESS === 'true',
    slowMo: parseInt(process.env.SLOW_MO) || 100
  });
  
  tester.runAllTests().then(results => {
    const failed = results.filter(r => r.status === 'FAILED');
    process.exit(failed.length > 0 ? 1 : 0);
  }).catch(error => {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = FullTextAnalysisFlowTester;

