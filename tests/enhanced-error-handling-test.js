/**
 * AI Guardians Chrome Extension - Enhanced Error Handling Test
 * 
 * This script tests comprehensive error handling scenarios that might not be
 * covered by the existing test suite, including runtime errors, edge cases,
 * and user experience issues.
 */

const fs = require('fs');
const path = require('path');

class EnhancedErrorHandlingTest {
  constructor() {
    this.testResults = [];
    this.errorScenarios = [];
    this.startTime = Date.now();
  }

  /**
   * Run enhanced error handling tests
   */
  async runEnhancedErrorTests() {
    console.log('🔍 Starting Enhanced Error Handling Test Suite');
    console.log('=' .repeat(60));
    
    const tests = [
      { name: 'Runtime Error Scenarios', fn: this.testRuntimeErrors },
      { name: 'Edge Case Handling', fn: this.testEdgeCases },
      { name: 'User Experience Errors', fn: this.testUserExperienceErrors },
      { name: 'Memory and Performance Errors', fn: this.testMemoryAndPerformanceErrors },
      { name: 'Chrome API Error Handling', fn: this.testChromeAPIErrors },
      { name: 'Network Error Scenarios', fn: this.testNetworkErrorScenarios },
      { name: 'Data Validation Errors', fn: this.testDataValidationErrors },
      { name: 'Concurrent Operation Errors', fn: this.testConcurrentOperationErrors }
    ];

    for (const test of tests) {
      try {
        console.log(`\n📋 Testing: ${test.name}`);
        const result = await test.fn.call(this);
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
          timestamp: new Date().toISOString()
        });
        console.error(`❌ ${test.name}: FAILED - ${error.message}`);
      }
    }

    this.generateEnhancedErrorReport();
  }

  /**
   * Test runtime error scenarios
   */
  async testRuntimeErrors() {
    const runtimeErrors = [];

    // Test for potential runtime errors in source files
    const sourceFiles = [
      'src/service_worker.js',
      'src/content.js',
      'src/popup/popup.js',
      'src/options.js',
      'src/gateway.js'
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for potential runtime errors
      const runtimeErrorPatterns = [
        { pattern: /chrome\.runtime\.lastError/, message: 'Chrome runtime error handling' },
        { pattern: /try\s*{[\s\S]*?}\s*catch\s*\(/, message: 'Try-catch error handling' },
        { pattern: /\.catch\s*\(/, message: 'Promise error handling' },
        { pattern: /if\s*\(\s*error\s*\)/, message: 'Error condition checking' },
        { pattern: /throw\s+new\s+Error/, message: 'Error throwing' }
      ];

      for (const { pattern, message } of runtimeErrorPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          runtimeErrors.push({
            file,
            errorHandling: message,
            count: matches.length,
            status: 'HANDLED'
          });
        }
      }

      // Check for potential runtime error sources
      const errorSourcePatterns = [
        { pattern: /JSON\.parse\s*\(/, message: 'JSON parsing without error handling' },
        { pattern: /fetch\s*\(/, message: 'Fetch without error handling' },
        { pattern: /chrome\.storage\./, message: 'Chrome storage without error handling' },
        { pattern: /chrome\.tabs\./, message: 'Chrome tabs API without error handling' }
      ];

      for (const { pattern, message } of errorSourcePatterns) {
        const matches = content.match(pattern);
        if (matches) {
          // Check if these are wrapped in try-catch
          const hasErrorHandling = content.includes('try') && content.includes('catch');
          if (!hasErrorHandling) {
            runtimeErrors.push({
              file,
              errorSource: message,
              count: matches.length,
              status: 'UNHANDLED',
              severity: 'HIGH'
            });
          }
        }
      }
    }

    const unhandledErrors = runtimeErrors.filter(e => e.status === 'UNHANDLED');
    if (unhandledErrors.length > 0) {
      throw new Error(`Found ${unhandledErrors.length} unhandled runtime error sources`);
    }

    return {
      totalErrors: runtimeErrors.length,
      handledErrors: runtimeErrors.filter(e => e.status === 'HANDLED').length,
      unhandledErrors: unhandledErrors.length,
      errors: runtimeErrors
    };
  }

  /**
   * Test edge case handling
   */
  async testEdgeCases() {
    const edgeCases = [];

    // Test for edge case handling in source files
    const sourceFiles = [
      'src/service_worker.js',
      'src/content.js',
      'src/popup/popup.js',
      'src/options.js',
      'src/gateway.js'
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for edge case handling
      const edgeCasePatterns = [
        { pattern: /if\s*\(\s*!.*\s*\)/, message: 'Null/undefined checking' },
        { pattern: /typeof\s+.*\s*===/, message: 'Type checking' },
        { pattern: /\.length\s*>\s*0/, message: 'Array/string length checking' },
        { pattern: /\.trim\s*\(\s*\)/, message: 'String trimming' },
        { pattern: /parseInt\s*\(/, message: 'Number parsing' },
        { pattern: /isNaN\s*\(/, message: 'NaN checking' }
      ];

      for (const { pattern, message } of edgeCasePatterns) {
        const matches = content.match(pattern);
        if (matches) {
          edgeCases.push({
            file,
            edgeCaseHandling: message,
            count: matches.length,
            status: 'HANDLED'
          });
        }
      }

      // Check for potential edge case issues
      const edgeCaseIssues = [
        { pattern: /\.split\s*\(\s*\)/, message: 'String splitting without error handling' },
        { pattern: /\.substring\s*\(/, message: 'String manipulation without bounds checking' },
        { pattern: /\.indexOf\s*\(/, message: 'String searching without error handling' },
        { pattern: /\.replace\s*\(/, message: 'String replacement without error handling' }
      ];

      for (const { pattern, message } of edgeCaseIssues) {
        const matches = content.match(pattern);
        if (matches) {
          edgeCases.push({
            file,
            edgeCaseIssue: message,
            count: matches.length,
            status: 'POTENTIAL_ISSUE',
            severity: 'MEDIUM'
          });
        }
      }
    }

    const potentialIssues = edgeCases.filter(e => e.status === 'POTENTIAL_ISSUE');
    if (potentialIssues.length > 5) {
      throw new Error(`Found ${potentialIssues.length} potential edge case issues`);
    }

    return {
      totalEdgeCases: edgeCases.length,
      handledEdgeCases: edgeCases.filter(e => e.status === 'HANDLED').length,
      potentialIssues: potentialIssues.length,
      edgeCases: edgeCases
    };
  }

  /**
   * Test user experience errors
   */
  async testUserExperienceErrors() {
    const uxErrors = [];

    // Test HTML files for UX error handling
    const htmlFiles = [
      'src/popup/popup.html',
      'src/options.html'
    ];

    for (const file of htmlFiles) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for UX error handling
      const uxPatterns = [
        { pattern: /error-message|error-message/, message: 'Error message display' },
        { pattern: /loading|spinner/, message: 'Loading state handling' },
        { pattern: /disabled.*button/, message: 'Button state management' },
        { pattern: /placeholder/, message: 'Input placeholder handling' },
        { pattern: /required/, message: 'Required field validation' }
      ];

      for (const { pattern, message } of uxPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          uxErrors.push({
            file,
            uxFeature: message,
            count: matches.length,
            status: 'IMPLEMENTED'
          });
        }
      }
    }

    // Test JavaScript files for UX error handling
    const jsFiles = [
      'src/popup/popup.js',
      'src/options.js'
    ];

    for (const file of jsFiles) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for UX error handling in JavaScript
      const uxJsPatterns = [
        { pattern: /\.innerHTML\s*=.*error/, message: 'Error message display' },
        { pattern: /\.style\.display\s*=/, message: 'Element visibility control' },
        { pattern: /\.disabled\s*=/, message: 'Element state control' },
        { pattern: /alert\s*\(/, message: 'User notification' },
        { pattern: /console\.log/, message: 'Debug logging' }
      ];

      for (const { pattern, message } of uxJsPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          uxErrors.push({
            file,
            uxFeature: message,
            count: matches.length,
            status: 'IMPLEMENTED'
          });
        }
      }
    }

    return {
      totalUxFeatures: uxErrors.length,
      implementedFeatures: uxErrors.filter(e => e.status === 'IMPLEMENTED').length,
      uxErrors: uxErrors
    };
  }

  /**
   * Test memory and performance errors
   */
  async testMemoryAndPerformanceErrors() {
    const performanceIssues = [];

    // Test for potential memory leaks and performance issues
    const sourceFiles = [
      'src/service_worker.js',
      'src/content.js',
      'src/popup/popup.js',
      'src/options.js',
      'src/gateway.js'
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for potential performance issues
      const performancePatterns = [
        { pattern: /setInterval\s*\(/, message: 'setInterval usage - potential memory leak' },
        { pattern: /setTimeout\s*\(/, message: 'setTimeout usage - potential memory leak' },
        { pattern: /addEventListener/, message: 'Event listener - potential memory leak' },
        { pattern: /removeEventListener/, message: 'Event listener cleanup' },
        { pattern: /clearInterval/, message: 'Interval cleanup' },
        { pattern: /clearTimeout/, message: 'Timeout cleanup' }
      ];

      for (const { pattern, message } of performancePatterns) {
        const matches = content.match(pattern);
        if (matches) {
          performanceIssues.push({
            file,
            performanceIssue: message,
            count: matches.length,
            status: 'DETECTED'
          });
        }
      }

      // Check for proper cleanup patterns
      const cleanupPatterns = [
        { pattern: /removeEventListener/, message: 'Event listener cleanup' },
        { pattern: /clearInterval/, message: 'Interval cleanup' },
        { pattern: /clearTimeout/, message: 'Timeout cleanup' },
        { pattern: /chrome\.runtime\.onSuspend/, message: 'Extension suspend handling' }
      ];

      for (const { pattern, message } of cleanupPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          performanceIssues.push({
            file,
            cleanupFeature: message,
            count: matches.length,
            status: 'IMPLEMENTED'
          });
        }
      }
    }

    const potentialLeaks = performanceIssues.filter(e => 
      e.performanceIssue && e.performanceIssue.includes('potential memory leak')
    );
    const cleanupFeatures = performanceIssues.filter(e => e.cleanupFeature);

    if (potentialLeaks.length > cleanupFeatures.length) {
      throw new Error(`Potential memory leaks detected: ${potentialLeaks.length} issues with ${cleanupFeatures.length} cleanup features`);
    }

    return {
      totalPerformanceIssues: performanceIssues.length,
      potentialLeaks: potentialLeaks.length,
      cleanupFeatures: cleanupFeatures.length,
      performanceIssues: performanceIssues
    };
  }

  /**
   * Test Chrome API error handling
   */
  async testChromeAPIErrors() {
    const chromeApiErrors = [];

    // Test for Chrome API error handling
    const sourceFiles = [
      'src/service_worker.js',
      'src/content.js',
      'src/popup/popup.js',
      'src/options.js'
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for Chrome API usage
      const chromeApiPatterns = [
        { pattern: /chrome\.runtime\./, message: 'Chrome runtime API' },
        { pattern: /chrome\.storage\./, message: 'Chrome storage API' },
        { pattern: /chrome\.tabs\./, message: 'Chrome tabs API' },
        { pattern: /chrome\.alarms\./, message: 'Chrome alarms API' },
        { pattern: /chrome\.contextMenus\./, message: 'Chrome context menus API' }
      ];

      for (const { pattern, message } of chromeApiPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          chromeApiErrors.push({
            file,
            chromeApi: message,
            count: matches.length,
            status: 'USED'
          });
        }
      }

      // Check for Chrome API error handling
      const chromeErrorPatterns = [
        { pattern: /chrome\.runtime\.lastError/, message: 'Chrome runtime error handling' },
        { pattern: /if\s*\(\s*chrome\.runtime\.lastError/, message: 'Chrome error checking' },
        { pattern: /chrome\.runtime\.onError/, message: 'Chrome error event handling' }
      ];

      for (const { pattern, message } of chromeErrorPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          chromeApiErrors.push({
            file,
            errorHandling: message,
            count: matches.length,
            status: 'HANDLED'
          });
        }
      }
    }

    const chromeApiUsage = chromeApiErrors.filter(e => e.status === 'USED');
    const chromeErrorHandling = chromeApiErrors.filter(e => e.status === 'HANDLED');

    if (chromeApiUsage.length > chromeErrorHandling.length * 2) {
      throw new Error(`Chrome API usage (${chromeApiUsage.length}) exceeds error handling (${chromeErrorHandling.length})`);
    }

    return {
      totalChromeApiUsage: chromeApiUsage.length,
      chromeErrorHandling: chromeErrorHandling.length,
      chromeApiErrors: chromeApiErrors
    };
  }

  /**
   * Test network error scenarios
   */
  async testNetworkErrorScenarios() {
    const networkErrors = [];

    // Test for network error handling
    const sourceFiles = [
      'src/gateway.js',
      'src/service_worker.js'
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for network error handling
      const networkPatterns = [
        { pattern: /fetch\s*\(/, message: 'Fetch API usage' },
        { pattern: /XMLHttpRequest/, message: 'XMLHttpRequest usage' },
        { pattern: /\.catch\s*\(/, message: 'Promise error handling' },
        { pattern: /timeout/, message: 'Timeout handling' },
        { pattern: /retry/, message: 'Retry logic' },
        { pattern: /offline/, message: 'Offline handling' }
      ];

      for (const { pattern, message } of networkPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          networkErrors.push({
            file,
            networkFeature: message,
            count: matches.length,
            status: 'IMPLEMENTED'
          });
        }
      }

      // Check for specific network error handling
      const networkErrorPatterns = [
        { pattern: /network.*error/i, message: 'Network error handling' },
        { pattern: /connection.*error/i, message: 'Connection error handling' },
        { pattern: /timeout.*error/i, message: 'Timeout error handling' },
        { pattern: /cors.*error/i, message: 'CORS error handling' }
      ];

      for (const { pattern, message } of networkErrorPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          networkErrors.push({
            file,
            networkErrorHandling: message,
            count: matches.length,
            status: 'HANDLED'
          });
        }
      }
    }

    return {
      totalNetworkFeatures: networkErrors.length,
      networkErrorHandling: networkErrors.filter(e => e.status === 'HANDLED').length,
      networkErrors: networkErrors
    };
  }

  /**
   * Test data validation errors
   */
  async testDataValidationErrors() {
    const validationErrors = [];

    // Test for data validation
    const sourceFiles = [
      'src/input-validator.js',
      'src/gateway.js',
      'src/service_worker.js',
      'src/options.js'
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for data validation
      const validationPatterns = [
        { pattern: /validate/, message: 'Data validation' },
        { pattern: /sanitize/, message: 'Data sanitization' },
        { pattern: /trim\s*\(/, message: 'String trimming' },
        { pattern: /typeof\s+.*\s*===/, message: 'Type checking' },
        { pattern: /\.length\s*[><=]/, message: 'Length validation' },
        { pattern: /isNaN\s*\(/, message: 'NaN validation' },
        { pattern: /JSON\.parse/, message: 'JSON parsing' },
        { pattern: /JSON\.stringify/, message: 'JSON serialization' }
      ];

      for (const { pattern, message } of validationPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          validationErrors.push({
            file,
            validationFeature: message,
            count: matches.length,
            status: 'IMPLEMENTED'
          });
        }
      }

      // Check for validation error handling
      const validationErrorPatterns = [
        { pattern: /throw.*Error/, message: 'Validation error throwing' },
        { pattern: /catch.*Error/, message: 'Validation error catching' },
        { pattern: /invalid.*input/i, message: 'Invalid input handling' },
        { pattern: /malformed.*data/i, message: 'Malformed data handling' }
      ];

      for (const { pattern, message } of validationErrorPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          validationErrors.push({
            file,
            validationErrorHandling: message,
            count: matches.length,
            status: 'HANDLED'
          });
        }
      }
    }

    return {
      totalValidationFeatures: validationErrors.length,
      validationErrorHandling: validationErrors.filter(e => e.status === 'HANDLED').length,
      validationErrors: validationErrors
    };
  }

  /**
   * Test concurrent operation errors
   */
  async testConcurrentOperationErrors() {
    const concurrentErrors = [];

    // Test for concurrent operation handling
    const sourceFiles = [
      'src/service_worker.js',
      'src/gateway.js',
      'src/content.js'
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for concurrent operation patterns
      const concurrentPatterns = [
        { pattern: /Promise\.all/, message: 'Promise.all usage' },
        { pattern: /Promise\.race/, message: 'Promise.race usage' },
        { pattern: /async.*await/, message: 'Async/await usage' },
        { pattern: /\.then\s*\(/, message: 'Promise chaining' },
        { pattern: /lock|mutex|semaphore/i, message: 'Concurrency control' },
        { pattern: /queue/i, message: 'Queue management' }
      ];

      for (const { pattern, message } of concurrentPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          concurrentErrors.push({
            file,
            concurrentFeature: message,
            count: matches.length,
            status: 'IMPLEMENTED'
          });
        }
      }

      // Check for race condition prevention
      const raceConditionPatterns = [
        { pattern: /debounce/, message: 'Debouncing' },
        { pattern: /throttle/, message: 'Throttling' },
        { pattern: /once/, message: 'One-time execution' },
        { pattern: /cancel/, message: 'Operation cancellation' }
      ];

      for (const { pattern, message } of raceConditionPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          concurrentErrors.push({
            file,
            raceConditionPrevention: message,
            count: matches.length,
            status: 'IMPLEMENTED'
          });
        }
      }
    }

    return {
      totalConcurrentFeatures: concurrentErrors.length,
      raceConditionPrevention: concurrentErrors.filter(e => e.raceConditionPrevention).length,
      concurrentErrors: concurrentErrors
    };
  }

  /**
   * Generate enhanced error report
   */
  generateEnhancedErrorReport() {
    const report = {
      testSuite: 'Enhanced Error Handling Test',
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      results: this.testResults,
      summary: {
        totalTests: this.testResults.length,
        passedTests: this.testResults.filter(t => t.status === 'PASSED').length,
        failedTests: this.testResults.filter(t => t.status === 'FAILED').length,
        passRate: (this.testResults.filter(t => t.status === 'PASSED').length / this.testResults.length) * 100
      }
    };

    const reportPath = path.join(__dirname, '..', 'reports', 'enhanced-error-handling-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n📊 Enhanced Error Handling Test Results:');
    console.log(`✅ Passed: ${report.summary.passedTests}/${report.summary.totalTests}`);
    console.log(`❌ Failed: ${report.summary.failedTests}/${report.summary.totalTests}`);
    console.log(`📈 Pass Rate: ${report.summary.passRate.toFixed(1)}%`);
    console.log(`📄 Report saved: ${reportPath}`);

    return report;
  }
}

// Run enhanced error handling tests if called directly
if (require.main === module) {
  const tester = new EnhancedErrorHandlingTest();
  tester.runEnhancedErrorTests().catch(console.error);
}

module.exports = EnhancedErrorHandlingTest;

