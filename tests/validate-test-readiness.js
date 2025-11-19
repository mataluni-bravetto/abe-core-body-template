/**
 * Validate Test Readiness
 * 
 * Checks that all test files and dependencies are in place
 * Run this before executing production tests
 */

const fs = require('fs');
const path = require('path');

class TestReadinessValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      checks: {},
      ready: false
    };
  }

  async validate() {
    console.log('🔍 Validating Test Readiness...\n');
    
    await this.checkTestFiles();
    await this.checkSourceFiles();
    await this.checkIntegration();
    
    this.generateReport();
    return this.results;
  }

  async checkTestFiles() {
    console.log('📋 Checking test files...');
    const check = {
      name: 'Test Files',
      status: 'unknown',
      issues: []
    };

    const requiredFiles = [
      'tests/production-test-suite.js',
      'tests/PRODUCTION_TESTING_GUIDE.md',
      'tests/TEST_EXECUTION_CHECKLIST.md'
    ];

    const missing = [];
    requiredFiles.forEach(file => {
      const fullPath = path.join(__dirname, '..', file);
      if (!fs.existsSync(fullPath)) {
        missing.push(file);
      }
    });

    if (missing.length === 0) {
      check.status = 'ok';
      console.log('  ✅ All test files present');
    } else {
      check.status = 'error';
      check.issues.push(`Missing files: ${missing.join(', ')}`);
      console.error(`  ❌ Missing: ${missing.join(', ')}`);
    }

    this.results.checks.testFiles = check;
  }

  async checkSourceFiles() {
    console.log('📦 Checking source files...');
    const check = {
      name: 'Source Files',
      status: 'unknown',
      issues: []
    };

    const requiredFiles = [
      'src/mutex-helper.js',
      'src/circuit-breaker.js',
      'src/gateway.js',
      'src/service-worker.js'
    ];

    const missing = [];
    requiredFiles.forEach(file => {
      const fullPath = path.join(__dirname, '..', file);
      if (!fs.existsSync(fullPath)) {
        missing.push(file);
      }
    });

    if (missing.length === 0) {
      check.status = 'ok';
      console.log('  ✅ All source files present');
    } else {
      check.status = 'error';
      check.issues.push(`Missing files: ${missing.join(', ')}`);
      console.error(`  ❌ Missing: ${missing.join(', ')}`);
    }

    this.results.checks.sourceFiles = check;
  }

  async checkIntegration() {
    console.log('🔗 Checking integration...');
    const check = {
      name: 'Integration',
      status: 'unknown',
      issues: []
    };

    try {
      // Check service-worker.js has imports
      const swPath = path.join(__dirname, '..', 'src/service-worker.js');
      const swCode = fs.readFileSync(swPath, 'utf8');
      
      const hasMutexImport = swCode.includes("importScripts('mutex-helper.js')");
      const hasCircuitImport = swCode.includes("importScripts('circuit-breaker.js')");
      
      // Check gateway.js has circuit breaker
      const gatewayPath = path.join(__dirname, '..', 'src/gateway.js');
      const gatewayCode = fs.readFileSync(gatewayPath, 'utf8');
      
      const hasCircuitBreaker = gatewayCode.includes('this.circuitBreaker') || 
                                 gatewayCode.includes('new CircuitBreaker');
      const hasTokenRefresh = gatewayCode.includes('refreshClerkToken');
      const has403Handling = gatewayCode.includes('403') && gatewayCode.includes('Forbidden');
      const hasQuotaCheck = gatewayCode.includes('checkStorageQuota');

      const allChecks = {
        mutexImport: hasMutexImport,
        circuitImport: hasCircuitImport,
        circuitBreaker: hasCircuitBreaker,
        tokenRefresh: hasTokenRefresh,
        error403: has403Handling,
        quotaCheck: hasQuotaCheck
      };

      const missing = Object.entries(allChecks)
        .filter(([_, value]) => !value)
        .map(([key, _]) => key);

      if (missing.length === 0) {
        check.status = 'ok';
        console.log('  ✅ All integrations present');
      } else {
        check.status = 'warning';
        check.issues.push(`Missing integrations: ${missing.join(', ')}`);
        console.log(`  ⚠️  Missing: ${missing.join(', ')}`);
      }

      check.details = allChecks;
    } catch (error) {
      check.status = 'error';
      check.issues.push(`Check failed: ${error.message}`);
      console.error('  ❌ Check failed:', error);
    }

    this.results.checks.integration = check;
  }

  generateReport() {
    const checks = Object.values(this.results.checks);
    const errorCount = checks.filter(c => c.status === 'error').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    
    this.results.ready = errorCount === 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST READINESS REPORT');
    console.log('='.repeat(60));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');

    checks.forEach(check => {
      const icon = check.status === 'ok' ? '✅' : 
                   check.status === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${check.name}: ${check.status.toUpperCase()}`);
      if (check.issues && check.issues.length > 0) {
        check.issues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      }
    });

    console.log('\n' + '='.repeat(60));
    if (this.results.ready) {
      console.log('✅ Ready for production testing!');
    } else {
      console.log('❌ Not ready - fix issues above');
    }
    console.log('='.repeat(60) + '\n');
  }
}

// Run if executed directly
if (require.main === module) {
  const validator = new TestReadinessValidator();
  validator.validate().then(() => {
    process.exit(validator.results.ready ? 0 : 1);
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = TestReadinessValidator;

