/**
 * Static Critical Analysis
 * Analyzes codebase files directly to identify critical issues
 * Can be run outside Chrome extension context
 */

const fs = require('fs');
const path = require('path');

class StaticCriticalAnalysis {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      critical: [],
      high: [],
      medium: [],
      files: {}
    };
  }

  /**
   * Run static analysis
   */
  analyze() {
    console.log('🔍 Static Critical Analysis - AiGuardian Chrome Extension\n');
    console.log('='.repeat(70));

    const extPath = path.join(__dirname, '..', 'src');
    
    this.analyzeServiceWorker(extPath);
    this.analyzeGateway(extPath);
    this.analyzeManifest(extPath);
    this.analyzeConstants(extPath);

    this.generateReport();
    return this.results;
  }

  /**
   * Analyze service-worker.js
   */
  analyzeServiceWorker(extPath) {
    const swPath = path.join(extPath, 'service-worker.js');
    if (!fs.existsSync(swPath)) {
      this.results.critical.push({
        file: 'service-worker.js',
        issue: 'Service worker file not found',
        fix: 'Ensure service-worker.js exists in src/ directory'
      });
      return;
    }

    const code = fs.readFileSync(swPath, 'utf8');
    const issues = [];

    // Check imports
    const hasMutexImport = code.includes("importScripts('mutex-helper.js')");
    const hasCircuitImport = code.includes("importScripts('circuit-breaker.js')");
    const hasGatewayImport = code.includes("importScripts('gateway.js')");

    if (!hasMutexImport) {
      issues.push({
        severity: 'HIGH',
        issue: 'MutexHelper not imported',
        fix: "Add: importScripts('mutex-helper.js')"
      });
    }

    if (!hasCircuitImport) {
      issues.push({
        severity: 'HIGH',
        issue: 'CircuitBreaker not imported',
        fix: "Add: importScripts('circuit-breaker.js')"
      });
    }

    if (!hasGatewayImport) {
      issues.push({
        severity: 'CRITICAL',
        issue: 'Gateway not imported',
        fix: "Add: importScripts('gateway.js')"
      });
    }

    // Check gateway initialization
    const hasGatewayInit = code.includes('new AiGuardianGateway()');
    if (!hasGatewayInit) {
      issues.push({
        severity: 'CRITICAL',
        issue: 'Gateway not initialized',
        fix: 'Add: gateway = new AiGuardianGateway()'
      });
    }

    // Check state rehydration
    const hasRehydration = code.includes('rehydrateState') ||
                          code.includes('chrome.storage.local.get') ||
                          code.includes('chrome.storage.session.get');
    
    if (!hasRehydration) {
      issues.push({
        severity: 'MEDIUM',
        issue: 'State rehydration pattern not found',
        fix: 'Add state rehydration in message handlers'
      });
    }

    this.results.files['service-worker.js'] = {
      path: swPath,
      issues: issues,
      hasMutex: hasMutexImport,
      hasCircuit: hasCircuitImport,
      hasGateway: hasGatewayImport,
      hasInit: hasGatewayInit,
      hasRehydration: hasRehydration
    };

    this.categorizeIssues(issues, 'service-worker.js');
  }

  /**
   * Analyze gateway.js
   */
  analyzeGateway(extPath) {
    const gwPath = path.join(extPath, 'gateway.js');
    if (!fs.existsSync(gwPath)) {
      this.results.critical.push({
        file: 'gateway.js',
        issue: 'Gateway file not found',
        fix: 'Ensure gateway.js exists in src/ directory'
      });
      return;
    }

    const code = fs.readFileSync(gwPath, 'utf8');
    const issues = [];

    // Check circuit breaker initialization
    const hasCircuitBreaker = code.includes('this.circuitBreaker') ||
                             code.includes('new CircuitBreaker');
    
    if (!hasCircuitBreaker) {
      issues.push({
        severity: 'HIGH',
        issue: 'Circuit breaker not initialized in gateway',
        fix: 'Initialize circuit breaker in gateway constructor'
      });
    }

    // Check 401 handling
    const has401Handling = code.includes('401') || 
                          code.includes('Unauthorized');
    
    if (!has401Handling) {
      issues.push({
        severity: 'CRITICAL',
        issue: 'No 401 error handling - authentication failures not handled',
        fix: 'Add 401 error handling with token refresh in sendToGateway()'
      });
    }

    // Check 403 handling
    const has403Handling = code.includes('403') || 
                          code.includes('Forbidden');
    
    if (!has403Handling) {
      issues.push({
        severity: 'HIGH',
        issue: 'No 403 error handling - authorization failures not handled',
        fix: 'Add explicit 403 error handling in sendToGateway()'
      });
    }

    // Check token refresh method
    const hasTokenRefresh = code.includes('refreshClerkToken') ||
                           code.includes('refreshToken');
    
    if (!hasTokenRefresh) {
      issues.push({
        severity: 'HIGH',
        issue: 'Token refresh method missing',
        fix: 'Add refreshClerkToken() method to gateway'
      });
    }

    // Check storage quota method
    const hasQuotaCheck = code.includes('checkStorageQuota') ||
                         code.includes('getBytesInUse');
    
    if (!hasQuotaCheck) {
      issues.push({
        severity: 'MEDIUM',
        issue: 'Storage quota check missing',
        fix: 'Add checkStorageQuota() method to gateway'
      });
    }

    // Check unified endpoint
    const hasUnifiedEndpoint = code.includes('api/v1/guards/process') ||
                              code.includes('guards/process');
    
    if (!hasUnifiedEndpoint) {
      issues.push({
        severity: 'HIGH',
        issue: 'Unified guard endpoint not used',
        fix: 'Map analyze endpoint to api/v1/guards/process'
      });
    }

    // Check mutex usage in token storage
    const hasMutexInStorage = code.includes('MutexHelper') && 
                             (code.includes('storeClerkToken') || 
                              code.includes('clerk_token'));
    
    if (!hasMutexInStorage && hasTokenRefresh) {
      issues.push({
        severity: 'MEDIUM',
        issue: 'Token storage may not use mutex protection',
        fix: 'Use MutexHelper for token storage operations'
      });
    }

    this.results.files['gateway.js'] = {
      path: gwPath,
      issues: issues,
      hasCircuitBreaker: hasCircuitBreaker,
      has401Handling: has401Handling,
      has403Handling: has403Handling,
      hasTokenRefresh: hasTokenRefresh,
      hasQuotaCheck: hasQuotaCheck,
      hasUnifiedEndpoint: hasUnifiedEndpoint,
      hasMutexInStorage: hasMutexInStorage
    };

    this.categorizeIssues(issues, 'gateway.js');
  }

  /**
   * Analyze manifest.json
   */
  analyzeManifest(extPath) {
    const manifestPath = path.join(extPath, '..', 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      this.results.critical.push({
        file: 'manifest.json',
        issue: 'Manifest file not found',
        fix: 'Ensure manifest.json exists in extension root'
      });
      return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const issues = [];

    // Check permissions
    const permissions = manifest.permissions || [];
    const hasStoragePermission = permissions.includes('storage');
    
    if (!hasStoragePermission) {
      issues.push({
        severity: 'CRITICAL',
        issue: 'Storage permission missing',
        fix: 'Add "storage" to permissions array in manifest.json'
      });
    }

    // Check service worker
    const hasServiceWorker = manifest.background && 
                            manifest.background.service_worker;
    
    if (!hasServiceWorker) {
      issues.push({
        severity: 'CRITICAL',
        issue: 'Service worker not configured',
        fix: 'Add background.service_worker to manifest.json'
      });
    }

    this.results.files['manifest.json'] = {
      path: manifestPath,
      issues: issues,
      hasStorage: hasStoragePermission,
      hasServiceWorker: hasServiceWorker
    };

    this.categorizeIssues(issues, 'manifest.json');
  }

  /**
   * Analyze constants.js
   */
  analyzeConstants(extPath) {
    const constPath = path.join(extPath, 'constants.js');
    if (!fs.existsSync(constPath)) {
      this.results.critical.push({
        file: 'constants.js',
        issue: 'Constants file not found',
        fix: 'Ensure constants.js exists in src/ directory'
      });
      return;
    }

    const code = fs.readFileSync(constPath, 'utf8');
    const issues = [];

    // Check guard services configuration
    const hasGuardServices = code.includes('GUARD_SERVICES') ||
                            code.includes('guard_services');
    
    if (!hasGuardServices) {
      issues.push({
        severity: 'MEDIUM',
        issue: 'Guard services configuration not found',
        fix: 'Add GUARD_SERVICES to DEFAULT_CONFIG in constants.js'
      });
    }

    // Check gateway URL
    const hasGatewayUrl = code.includes('GATEWAY_URL') ||
                         code.includes('gateway_url');
    
    if (!hasGatewayUrl) {
      issues.push({
        severity: 'HIGH',
        issue: 'Gateway URL not configured',
        fix: 'Add GATEWAY_URL to DEFAULT_CONFIG in constants.js'
      });
    }

    this.results.files['constants.js'] = {
      path: constPath,
      issues: issues,
      hasGuardServices: hasGuardServices,
      hasGatewayUrl: hasGatewayUrl
    };

    this.categorizeIssues(issues, 'constants.js');
  }

  /**
   * Categorize issues
   */
  categorizeIssues(issues, file) {
    issues.forEach(issue => {
      const issueObj = {
        file: file,
        issue: issue.issue,
        fix: issue.fix,
        severity: issue.severity
      };

      if (issue.severity === 'CRITICAL') {
        this.results.critical.push(issueObj);
      } else if (issue.severity === 'HIGH') {
        this.results.high.push(issueObj);
      } else {
        this.results.medium.push(issueObj);
      }
    });
  }

  /**
   * Generate report
   */
  generateReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 STATIC CRITICAL ANALYSIS REPORT');
    console.log('='.repeat(70));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');

    // Summary
    console.log('SUMMARY:');
    console.log(`  🔴 Critical: ${this.results.critical.length}`);
    console.log(`  🟠 High: ${this.results.high.length}`);
    console.log(`  🟡 Medium: ${this.results.medium.length}`);
    console.log(`  Total Issues: ${this.results.critical.length + this.results.high.length + this.results.medium.length}`);
    console.log('');

    // Critical Issues
    if (this.results.critical.length > 0) {
      console.log('🔴 CRITICAL ISSUES (Must Fix Immediately):');
      this.results.critical.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.file}] ${issue.issue}`);
        console.log(`   Fix: ${issue.fix}`);
      });
      console.log('');
    }

    // High Priority Issues
    if (this.results.high.length > 0) {
      console.log('🟠 HIGH PRIORITY ISSUES:');
      this.results.high.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.file}] ${issue.issue}`);
        console.log(`   Fix: ${issue.fix}`);
      });
      console.log('');
    }

    // Medium Priority Issues
    if (this.results.medium.length > 0) {
      console.log('🟡 MEDIUM PRIORITY ISSUES:');
      this.results.medium.forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.file}] ${issue.issue}`);
        console.log(`   Fix: ${issue.fix}`);
      });
      console.log('');
    }

    // File Analysis Summary
    console.log('FILE ANALYSIS:');
    Object.entries(this.results.files).forEach(([file, data]) => {
      const issueCount = data.issues.length;
      const status = issueCount === 0 ? '✅' : issueCount <= 2 ? '⚠️' : '❌';
      console.log(`  ${status} ${file}: ${issueCount} issues`);
    });
    console.log('');

    // Overall Status
    console.log('='.repeat(70));
    if (this.results.critical.length === 0 && this.results.high.length === 0) {
      console.log('✅ STATUS: NO CRITICAL OR HIGH PRIORITY ISSUES');
      console.log('   Extension codebase is in good shape!');
    } else if (this.results.critical.length === 0) {
      console.log('⚠️  STATUS: HIGH PRIORITY ISSUES FOUND');
      console.log('   Review and fix high priority items');
    } else {
      console.log('❌ STATUS: CRITICAL ISSUES FOUND');
      console.log('   Fix critical issues immediately!');
    }
    console.log('='.repeat(70) + '\n');
  }
}

// Run if executed directly
if (require.main === module) {
  const analysis = new StaticCriticalAnalysis();
  analysis.analyze();
}

module.exports = StaticCriticalAnalysis;

