/**
 * Static Analysis Script for AiGuardian Chrome Extension
 * 
 * This script performs static code analysis based on the ChromeExtensionDebugger
 * framework to identify potential issues before runtime testing.
 * 
 * Usage: node debug/run-diagnostics-analysis.js
 */

const fs = require('fs');
const path = require('path');

class StaticExtensionAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      analysis: {},
      issues: [],
      warnings: [],
      recommendations: []
    };
  }

  /**
   * Run all static analyses
   */
  async runAllAnalyses() {
    console.log('🔍 Running static analysis on AiGuardian Chrome Extension...\n');
    
    await this.analyzeTokenRefresh();
    await this.analyze401Handling();
    await this.analyzeGuardServicesAuth();
    await this.analyzeErrorHandling();
    await this.analyzeStorageUsage();
    await this.analyzeManifest();
    await this.analyzeTestFiles();
    
    this.generateReport();
    return this.results;
  }

  /**
   * Analyze token refresh logic (CRITICAL FOR PUBLICATION)
   */
  async analyzeTokenRefresh() {
    console.log('🔄 Analyzing token refresh logic...');
    const analysis = {
      name: 'Token Refresh Logic',
      status: 'unknown',
      issues: [],
      findings: {}
    };

    try {
      const gatewayPath = path.join(__dirname, '../src/gateway.js');
      const gatewayCode = fs.readFileSync(gatewayPath, 'utf8');
      
      const checks = {
        hasRefreshMethod: false,
        has401Handler: false,
        hasRetryLogic: false,
        checksExpiration: false
      };

      // Check for refresh methods
      if (gatewayCode.includes('refreshToken') || 
          gatewayCode.includes('refreshClerkToken') ||
          gatewayCode.includes('handleTokenRefresh')) {
        checks.hasRefreshMethod = true;
      }

      // Check for 401 error handling
      if (gatewayCode.includes('401') || 
          gatewayCode.includes('handle401Error') ||
          gatewayCode.includes('retryWithRefresh')) {
        checks.has401Handler = true;
      }

      // Check for retry logic
      if (gatewayCode.includes('retryAttempts') && 
          gatewayCode.includes('RETRY')) {
        checks.hasRetryLogic = true;
      }

      // Check for token expiration checking
      const authPath = path.join(__dirname, '../src/auth.js');
      if (fs.existsSync(authPath)) {
        const authCode = fs.readFileSync(authPath, 'utf8');
        if (authCode.includes('exp') || authCode.includes('expiration')) {
          checks.checksExpiration = true;
        }
      }

      analysis.findings = checks;
      const passedChecks = Object.values(checks).filter(c => c === true).length;

      if (passedChecks === 0) {
        analysis.status = 'error';
        analysis.issues.push('CRITICAL: No token refresh logic detected');
        analysis.issues.push('CRITICAL: No 401 error handler detected');
      } else if (passedChecks < 2) {
        analysis.status = 'warning';
        analysis.issues.push('Token refresh logic incomplete');
      } else {
        analysis.status = 'ok';
      }

      // Specific findings
      if (!checks.hasRefreshMethod) {
        analysis.issues.push('Missing: Token refresh method (should refresh on expiration)');
      }
      if (!checks.has401Handler) {
        analysis.issues.push('Missing: 401 error handler (should retry with refreshed token)');
      }

      console.log(`  ✅ Token refresh analysis: ${analysis.status.toUpperCase()}`);
    } catch (error) {
      analysis.status = 'error';
      analysis.issues.push(`Analysis failed: ${error.message}`);
      console.error('  ❌ Token refresh analysis failed:', error);
    }

    this.results.analysis.tokenRefresh = analysis;
  }

  /**
   * Analyze 401 error handling
   */
  async analyze401Handling() {
    console.log('🔐 Analyzing 401 error handling...');
    const analysis = {
      name: '401 Error Handling',
      status: 'unknown',
      issues: [],
      findings: {}
    };

    try {
      const gatewayPath = path.join(__dirname, '../src/gateway.js');
      const gatewayCode = fs.readFileSync(gatewayPath, 'utf8');

      const checks = {
        handles401: false,
        retriesOn401: false,
        refreshesTokenOn401: false
      };

      // Check for 401 handling
      if (gatewayCode.includes('401')) {
        checks.handles401 = true;
      }

      // Check for retry logic on 401
      if (gatewayCode.includes('401') && gatewayCode.includes('retry')) {
        checks.retriesOn401 = true;
      }

      // Check for token refresh on 401
      if (gatewayCode.includes('401') && 
          (gatewayCode.includes('refresh') || gatewayCode.includes('token'))) {
        checks.refreshesTokenOn401 = true;
      }

      analysis.findings = checks;
      
      if (!checks.handles401) {
        analysis.status = 'error';
        analysis.issues.push('CRITICAL: No 401 error handling detected');
      } else if (!checks.refreshesTokenOn401) {
        analysis.status = 'warning';
        analysis.issues.push('401 errors detected but no token refresh on 401');
      } else {
        analysis.status = 'ok';
      }

      console.log(`  ✅ 401 handling analysis: ${analysis.status.toUpperCase()}`);
    } catch (error) {
      analysis.status = 'error';
      analysis.issues.push(`Analysis failed: ${error.message}`);
      console.error('  ❌ 401 handling analysis failed:', error);
    }

    this.results.analysis.error401Handling = analysis;
  }

  /**
   * Analyze guard services authentication
   */
  async analyzeGuardServicesAuth() {
    console.log('🛡️  Analyzing guard services authentication...');
    const analysis = {
      name: 'Guard Services Authentication',
      status: 'unknown',
      issues: [],
      findings: {}
    };

    try {
      const gatewayPath = path.join(__dirname, '../src/gateway.js');
      const gatewayCode = fs.readFileSync(gatewayPath, 'utf8');

      const checks = {
        usesClerkToken: false,
        includesAuthHeader: false,
        handles403: false
      };

      // Check for Clerk token usage
      if (gatewayCode.includes('getClerkSessionToken') || 
          gatewayCode.includes('clerkToken') ||
          gatewayCode.includes('clerk_token')) {
        checks.usesClerkToken = true;
      }

      // Check for Authorization header
      if (gatewayCode.includes('Authorization') && 
          gatewayCode.includes('Bearer')) {
        checks.includesAuthHeader = true;
      }

      // Check for 403 handling
      if (gatewayCode.includes('403') || gatewayCode.includes('Forbidden')) {
        checks.handles403 = true;
      }

      analysis.findings = checks;

      if (!checks.usesClerkToken) {
        analysis.status = 'error';
        analysis.issues.push('CRITICAL: Guard services may not be authenticated');
      } else if (!checks.includesAuthHeader) {
        analysis.status = 'warning';
        analysis.issues.push('Clerk token retrieved but Authorization header may be missing');
      } else {
        analysis.status = 'ok';
      }

      console.log(`  ✅ Guard services auth analysis: ${analysis.status.toUpperCase()}`);
    } catch (error) {
      analysis.status = 'error';
      analysis.issues.push(`Analysis failed: ${error.message}`);
      console.error('  ❌ Guard services auth analysis failed:', error);
    }

    this.results.analysis.guardServicesAuth = analysis;
  }

  /**
   * Analyze error handling patterns
   */
  async analyzeErrorHandling() {
    console.log('⚠️  Analyzing error handling...');
    const analysis = {
      name: 'Error Handling',
      status: 'unknown',
      issues: [],
      findings: {}
    };

    try {
      const gatewayPath = path.join(__dirname, '../src/gateway.js');
      const gatewayCode = fs.readFileSync(gatewayPath, 'utf8');

      const checks = {
        hasErrorHandler: false,
        handlesNetworkErrors: false,
        handlesTimeoutErrors: false,
        handles403Errors: false,
        handles401Errors: false
      };

      // Check for error handler
      if (gatewayCode.includes('handleError') || 
          gatewayCode.includes('catch')) {
        checks.hasErrorHandler = true;
      }

      // Check for specific error handling
      if (gatewayCode.includes('network') || gatewayCode.includes('fetch')) {
        checks.handlesNetworkErrors = true;
      }
      if (gatewayCode.includes('timeout') || gatewayCode.includes('TIMEOUT')) {
        checks.handlesTimeoutErrors = true;
      }
      if (gatewayCode.includes('403') || gatewayCode.includes('Forbidden')) {
        checks.handles403Errors = true;
      }
      if (gatewayCode.includes('401') || gatewayCode.includes('Unauthorized')) {
        checks.handles401Errors = true;
      }

      analysis.findings = checks;

      const criticalMissing = [];
      if (!checks.handles403Errors) criticalMissing.push('403 Forbidden');
      if (!checks.handles401Errors) criticalMissing.push('401 Unauthorized');

      if (criticalMissing.length > 0) {
        analysis.status = 'error';
        analysis.issues.push(`CRITICAL: Missing error handling for: ${criticalMissing.join(', ')}`);
      } else if (!checks.hasErrorHandler) {
        analysis.status = 'warning';
        analysis.issues.push('No general error handler detected');
      } else {
        analysis.status = 'ok';
      }

      console.log(`  ✅ Error handling analysis: ${analysis.status.toUpperCase()}`);
    } catch (error) {
      analysis.status = 'error';
      analysis.issues.push(`Analysis failed: ${error.message}`);
      console.error('  ❌ Error handling analysis failed:', error);
    }

    this.results.analysis.errorHandling = analysis;
  }

  /**
   * Analyze storage usage patterns
   */
  async analyzeStorageUsage() {
    console.log('📦 Analyzing storage usage...');
    const analysis = {
      name: 'Storage Usage',
      status: 'unknown',
      issues: [],
      findings: {}
    };

    try {
      const serviceWorkerPath = path.join(__dirname, '../src/service-worker.js');
      const serviceWorkerCode = fs.readFileSync(serviceWorkerPath, 'utf8');

      const checks = {
        usesLocalStorage: false,
        usesSyncStorage: false,
        storesLargeData: false
      };

      // Check storage usage
      if (serviceWorkerCode.includes('chrome.storage.local')) {
        checks.usesLocalStorage = true;
      }
      if (serviceWorkerCode.includes('chrome.storage.sync')) {
        checks.usesSyncStorage = true;
      }

      // Check for potentially large data storage
      if (serviceWorkerCode.includes('analysis_history') ||
          serviceWorkerCode.includes('last_analysis')) {
        checks.storesLargeData = true;
        analysis.issues.push('Storing analysis history - monitor storage quota');
      }

      analysis.findings = checks;
      analysis.status = 'ok';

      console.log(`  ✅ Storage usage analysis: ${analysis.status.toUpperCase()}`);
    } catch (error) {
      analysis.status = 'error';
      analysis.issues.push(`Analysis failed: ${error.message}`);
      console.error('  ❌ Storage usage analysis failed:', error);
    }

    this.results.analysis.storageUsage = analysis;
  }

  /**
   * Analyze manifest.json
   */
  async analyzeManifest() {
    console.log('📋 Analyzing manifest.json...');
    const analysis = {
      name: 'Manifest Configuration',
      status: 'unknown',
      issues: [],
      findings: {}
    };

    try {
      const manifestPath = path.join(__dirname, '../manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      const checks = {
        hasServiceWorker: false,
        hasPermissions: false,
        hasHostPermissions: false,
        hasCSP: false
      };

      if (manifest.background && manifest.background.service_worker) {
        checks.hasServiceWorker = true;
      }
      if (manifest.permissions && manifest.permissions.length > 0) {
        checks.hasPermissions = true;
      }
      if (manifest.host_permissions && manifest.host_permissions.length > 0) {
        checks.hasHostPermissions = true;
      }
      if (manifest.content_security_policy) {
        checks.hasCSP = true;
      }

      analysis.findings = {
        version: manifest.version,
        manifestVersion: manifest.manifest_version,
        permissions: manifest.permissions,
        ...checks
      };

      // Check for required permissions
      const requiredPermissions = ['storage'];
      const missingPermissions = requiredPermissions.filter(
        p => !manifest.permissions.includes(p)
      );

      if (missingPermissions.length > 0) {
        analysis.status = 'error';
        analysis.issues.push(`Missing required permissions: ${missingPermissions.join(', ')}`);
      } else {
        analysis.status = 'ok';
      }

      console.log(`  ✅ Manifest analysis: ${analysis.status.toUpperCase()}`);
    } catch (error) {
      analysis.status = 'error';
      analysis.issues.push(`Analysis failed: ${error.message}`);
      console.error('  ❌ Manifest analysis failed:', error);
    }

    this.results.analysis.manifest = analysis;
  }

  /**
   * Check for test files
   */
  async analyzeTestFiles() {
    console.log('🧪 Analyzing test files...');
    const analysis = {
      name: 'Test Files',
      status: 'unknown',
      issues: [],
      findings: {}
    };

    try {
      const testsDir = path.join(__dirname, '../tests');
      const expectedFiles = [
        'smoke-test.js',
        'integration-test.js'
      ];

      const existingFiles = [];
      const missingFiles = [];

      if (fs.existsSync(testsDir)) {
        const files = fs.readdirSync(testsDir);
        expectedFiles.forEach(file => {
          if (files.includes(file)) {
            existingFiles.push(file);
          } else {
            missingFiles.push(file);
          }
        });
      } else {
        missingFiles.push(...expectedFiles);
        analysis.issues.push('Tests directory does not exist');
      }

      analysis.findings = {
        existingFiles,
        missingFiles,
        testsDirExists: fs.existsSync(testsDir)
      };

      if (missingFiles.length > 0) {
        analysis.status = 'warning';
        analysis.issues.push(`Missing test files: ${missingFiles.join(', ')}`);
      } else {
        analysis.status = 'ok';
      }

      console.log(`  ✅ Test files analysis: ${analysis.status.toUpperCase()}`);
    } catch (error) {
      analysis.status = 'error';
      analysis.issues.push(`Analysis failed: ${error.message}`);
      console.error('  ❌ Test files analysis failed:', error);
    }

    this.results.analysis.testFiles = analysis;
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 STATIC ANALYSIS REPORT');
    console.log('='.repeat(60));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');

    // Summary
    const analyses = Object.values(this.results.analysis);
    const errorCount = analyses.filter(a => a.status === 'error').length;
    const warningCount = analyses.filter(a => a.status === 'warning').length;
    const okCount = analyses.filter(a => a.status === 'ok').length;

    console.log('SUMMARY:');
    console.log(`  ✅ OK: ${okCount}`);
    console.log(`  ⚠️  Warnings: ${warningCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log('');

    // Detailed results
    console.log('DETAILED RESULTS:');
    for (const [key, analysis] of Object.entries(this.results.analysis)) {
      const icon = analysis.status === 'ok' ? '✅' : 
                   analysis.status === 'warning' ? '⚠️' : '❌';
      console.log(`\n${icon} ${analysis.name}: ${analysis.status.toUpperCase()}`);
      
      if (analysis.issues.length > 0) {
        console.log('  Issues:');
        analysis.issues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      }

      if (analysis.findings && Object.keys(analysis.findings).length > 0) {
        console.log('  Findings:');
        console.log(JSON.stringify(analysis.findings, null, 4));
      }
    }

    // Generate recommendations
    this.generateRecommendations();

    if (this.results.recommendations.length > 0) {
      console.log('\n📋 RECOMMENDATIONS:');
      this.results.recommendations.forEach(rec => {
        console.log(`\n[${rec.priority}] ${rec.category}: ${rec.message}`);
        console.log(`  Action: ${rec.action}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('Analysis complete. Review issues above before publication.');
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Token refresh recommendations
    const tokenRefresh = this.results.analysis.tokenRefresh;
    if (tokenRefresh && tokenRefresh.status === 'error') {
      recommendations.push({
        category: 'Token Refresh',
        priority: 'CRITICAL',
        message: 'Implement token refresh logic - tokens expire without automatic refresh',
        action: 'Add token refresh method, 401 error handler, and retry logic in gateway.js'
      });
    }

    // Guard services recommendations
    const guardServicesAuth = this.results.analysis.guardServicesAuth;
    if (guardServicesAuth && guardServicesAuth.status === 'error') {
      recommendations.push({
        category: 'Guard Services',
        priority: 'CRITICAL',
        message: 'Fix guard services authentication - may return 403 Forbidden',
        action: 'Ensure Clerk token is included in Authorization header for all guard service requests'
      });
    }

    // Error handling recommendations
    const errorHandling = this.results.analysis.errorHandling;
    if (errorHandling && errorHandling.status === 'error') {
      recommendations.push({
        category: 'Error Handling',
        priority: 'HIGH',
        message: 'Add error handling for 401/403 errors',
        action: 'Implement specific handlers for authentication errors with token refresh'
      });
    }

    // Test files recommendations
    const testFiles = this.results.analysis.testFiles;
    if (testFiles && testFiles.status === 'warning') {
      recommendations.push({
        category: 'Testing',
        priority: 'HIGH',
        message: 'Create missing test files',
        action: 'Create tests/smoke-test.js or remove smoke test from setup script'
      });
    }

    this.results.recommendations = recommendations;
  }
}

// Run analysis if executed directly
if (require.main === module) {
  const analyzer = new StaticExtensionAnalyzer();
  analyzer.runAllAnalyses().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Analysis failed:', error);
    process.exit(1);
  });
}

module.exports = StaticExtensionAnalyzer;

