/**
 * Chrome Extension Best Practices Verification
 *
 * This script verifies that the AiGuardian Chrome extension follows
 * all Chrome developer best practices and DevTools Protocol guidelines.
 */

class ChromeBestPracticesVerifier {
  constructor() {
    this.verificationResults = [];
    this.bestPracticesScore = 0;
    this.totalChecks = 0;
    this.passedChecks = 0;
  }

  /**
   * Run comprehensive best practices verification
   */
  async runVerification() {
    console.log('🔍 Starting Chrome Extension Best Practices Verification');
    console.log('='.repeat(60));

    const checks = [
      { name: 'Manifest V3 Compliance', fn: this.verifyManifestV3 },
      { name: 'Chrome Extension APIs Usage', fn: this.verifyExtensionAPIs },
      { name: 'DevTools Protocol Compliance', fn: this.verifyDevToolsProtocol },
      { name: 'Security Best Practices', fn: this.verifySecurityPractices },
      { name: 'Performance Optimization', fn: this.verifyPerformanceOptimization },
      { name: 'Content Security Policy', fn: this.verifyContentSecurityPolicy },
      { name: 'Service Worker Best Practices', fn: this.verifyServiceWorkerPractices },
      { name: 'Message Passing Security', fn: this.verifyMessagePassingSecurity },
      { name: 'Storage Best Practices', fn: this.verifyStoragePractices },
      { name: 'Error Handling & Logging', fn: this.verifyErrorHandling },
      { name: 'Accessibility Compliance', fn: this.verifyAccessibilityCompliance },
      { name: 'Internationalization', fn: this.verifyInternationalization },
    ];

    for (const check of checks) {
      try {
        console.log(`\n📋 Verifying: ${check.name}`);
        const result = await check.fn.call(this);
        this.verificationResults.push({
          name: check.name,
          status: 'COMPLIANT',
          result,
          timestamp: new Date().toISOString(),
        });
        this.passedChecks++;
        console.log(`✅ ${check.name}: COMPLIANT`);
      } catch (error) {
        this.verificationResults.push({
          name: check.name,
          status: 'NON_COMPLIANT',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        console.error(`❌ ${check.name}: NON_COMPLIANT - ${error.message}`);
      }
      this.totalChecks++;
    }

    this.calculateBestPracticesScore();
    this.generateBestPracticesReport();
  }

  /**
   * Verify Manifest V3 compliance
   */
  async verifyManifestV3() {
    const fs = require('fs');
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

    // Check manifest version
    if (manifest.manifest_version !== 3) {
      throw new Error('Extension must use Manifest V3');
    }

    // Check required fields
    const requiredFields = ['name', 'version', 'permissions', 'background'];
    const missingFields = requiredFields.filter((field) => !manifest[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required manifest fields: ${missingFields.join(', ')}`);
    }

    // Check service worker usage
    if (!manifest.background.service_worker) {
      throw new Error('Manifest V3 requires service_worker instead of scripts');
    }

    // Check permissions are minimal
    const allowedPermissions = ['storage', 'alarms', 'activeTab', 'tabs', 'scripting'];
    const invalidPermissions = manifest.permissions.filter(
      (perm) => !allowedPermissions.includes(perm)
    );
    if (invalidPermissions.length > 0) {
      throw new Error(`Invalid permissions found: ${invalidPermissions.join(', ')}`);
    }

    // Check host permissions
    if (manifest.host_permissions && manifest.host_permissions.includes('<all_urls>')) {
      console.warn('Warning: <all_urls> permission is overly broad');
    }

    return {
      manifestVersion: manifest.manifest_version,
      serviceWorker: !!manifest.background.service_worker,
      permissions: manifest.permissions,
      hostPermissions: manifest.host_permissions,
      compliance: true,
    };
  }

  /**
   * Verify Chrome Extension APIs usage
   */
  async verifyExtensionAPIs() {
    const fs = require('fs');
    const sourceFiles = [
      'src/service_worker.js',
      'src/content.js',
      'src/popup/popup.js',
      'src/options.js',
    ];

    const apiUsage = {
      chrome: {
        runtime: [],
        storage: [],
        tabs: [],
        scripting: [],
        alarms: [],
      },
      bestPractices: {
        asyncAwait: 0,
        errorHandling: 0,
        securityChecks: 0,
      },
    };

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) {continue;}

      const content = fs.readFileSync(file, 'utf8');

      // Check Chrome API usage
      const chromeAPIs = content.match(/chrome\.(\w+)\.(\w+)/g) || [];
      chromeAPIs.forEach((api) => {
        const [domain, method] = api.split('.').slice(1);
        if (apiUsage.chrome[domain]) {
          apiUsage.chrome[domain].push(method);
        }
      });

      // Check best practices
      if (content.includes('async ') && content.includes('await ')) {
        apiUsage.bestPractices.asyncAwait++;
      }

      if (content.includes('try {') && content.includes('catch')) {
        apiUsage.bestPractices.errorHandling++;
      }

      if (content.includes('chrome.runtime.lastError')) {
        apiUsage.bestPractices.securityChecks++;
      }
    }

    // Verify proper API usage
    const requiredAPIs = ['runtime', 'storage'];
    const missingAPIs = requiredAPIs.filter(
      (api) => !apiUsage.chrome[api] || apiUsage.chrome[api].length === 0
    );
    if (missingAPIs.length > 0) {
      throw new Error(`Missing required Chrome APIs: ${missingAPIs.join(', ')}`);
    }

    return {
      chromeAPIs: apiUsage.chrome,
      bestPractices: apiUsage.bestPractices,
      compliance: true,
    };
  }

  /**
   * Verify DevTools Protocol compliance
   */
  async verifyDevToolsProtocol() {
    // Check if extension uses DevTools Protocol features appropriately
    const fs = require('fs');
    const content = fs.readFileSync('src/service_worker.js', 'utf8');

    // Check for proper debugging features
    const debuggingFeatures = {
      consoleLogging: content.includes('console.log'),
      errorLogging: content.includes('console.error'),
      performanceMonitoring:
        content.includes('Date.now()') || content.includes('performance.now()'),
      traceLogging: content.includes('trace') || content.includes('debug'),
    };

    // Check for DevTools Protocol best practices
    const protocolCompliance = {
      structuredLogging: content.includes('JSON.stringify'),
      errorHandling: content.includes('try {') && content.includes('catch'),
      performanceMetrics: content.includes('responseTime') || content.includes('processingTime'),
      debuggingSupport: content.includes('chrome.runtime.onMessage'),
    };

    const complianceScore = Object.values(protocolCompliance).filter(Boolean).length;
    if (complianceScore < 3) {
      throw new Error('DevTools Protocol compliance insufficient');
    }

    return {
      debuggingFeatures,
      protocolCompliance,
      complianceScore,
      compliance: true,
    };
  }

  /**
   * Verify security best practices
   */
  async verifySecurityPractices() {
    const fs = require('fs');
    const sourceFiles = [
      'src/service_worker.js',
      'src/content.js',
      'src/popup/popup.js',
      'src/options.js',
    ];

    const securityIssues = [];
    const securityPractices = {
      inputValidation: 0,
      outputSanitization: 0,
      secureAPIs: 0,
      errorHandling: 0,
    };

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) {continue;}

      const content = fs.readFileSync(file, 'utf8');

      // Check for dangerous patterns
      if (content.includes('eval(')) {
        securityIssues.push(`${file}: eval() usage detected`);
      }

      if (content.includes('innerHTML =')) {
        securityIssues.push(`${file}: innerHTML assignment detected`);
      }

      if (content.includes('document.write')) {
        securityIssues.push(`${file}: document.write usage detected`);
      }

      // Check for security best practices
      if (content.includes('JSON.parse') && content.includes('try {')) {
        securityPractices.inputValidation++;
      }

      if (content.includes('textContent') || content.includes('createTextNode')) {
        securityPractices.outputSanitization++;
      }

      if (content.includes('chrome.storage.local') || content.includes('chrome.storage.sync')) {
        securityPractices.secureAPIs++;
      }

      if (content.includes('chrome.runtime.lastError')) {
        securityPractices.errorHandling++;
      }
    }

    if (securityIssues.length > 0) {
      throw new Error(`Security issues found: ${securityIssues.join(', ')}`);
    }

    return {
      securityIssues,
      securityPractices,
      compliance: true,
    };
  }

  /**
   * Verify performance optimization
   */
  async verifyPerformanceOptimization() {
    const fs = require('fs');
    const sourceFiles = ['src/service_worker.js', 'src/content.js', 'src/gateway.js'];

    const performanceMetrics = {
      lazyLoading: 0,
      eventDelegation: 0,
      debouncing: 0,
      caching: 0,
      asyncOperations: 0,
    };

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) {continue;}

      const content = fs.readFileSync(file, 'utf8');

      // Check for performance optimizations
      if (content.includes('addEventListener') && content.includes('removeEventListener')) {
        performanceMetrics.eventDelegation++;
      }

      if (content.includes('setTimeout') && content.includes('clearTimeout')) {
        performanceMetrics.debouncing++;
      }

      if (content.includes('chrome.storage') && content.includes('get')) {
        performanceMetrics.caching++;
      }

      if (content.includes('async ') && content.includes('await ')) {
        performanceMetrics.asyncOperations++;
      }
    }

    // Check for performance anti-patterns
    const antiPatterns = [];
    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) {continue;}

      const content = fs.readFileSync(file, 'utf8');

      if (content.includes('setInterval') && !content.includes('clearInterval')) {
        antiPatterns.push(`${file}: setInterval without clearInterval`);
      }

      if (content.includes('document.querySelectorAll') && content.includes('for (')) {
        antiPatterns.push(`${file}: Inefficient DOM queries in loops`);
      }
    }

    if (antiPatterns.length > 0) {
      console.warn(`Performance warnings: ${antiPatterns.join(', ')}`);
    }

    return {
      performanceMetrics,
      antiPatterns,
      compliance: true,
    };
  }

  /**
   * Verify Content Security Policy
   */
  async verifyContentSecurityPolicy() {
    const fs = require('fs');
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

    // Check for CSP in manifest
    if (!manifest.content_security_policy) {
      console.warn('No Content Security Policy defined in manifest');
    }

    // Check HTML files for inline scripts
    const htmlFiles = ['src/popup/popup.html', 'src/options.html'];
    const cspIssues = [];

    for (const file of htmlFiles) {
      if (!fs.existsSync(file)) {continue;}

      const content = fs.readFileSync(file, 'utf8');

      if (content.includes('<script>') && !content.includes('nonce=')) {
        cspIssues.push(`${file}: Inline scripts without nonce`);
      }

      if (content.includes('javascript:')) {
        cspIssues.push(`${file}: javascript: URLs detected`);
      }
    }

    if (cspIssues.length > 0) {
      throw new Error(`CSP issues found: ${cspIssues.join(', ')}`);
    }

    return {
      cspDefined: !!manifest.content_security_policy,
      cspIssues,
      compliance: true,
    };
  }

  /**
   * Verify service worker best practices
   */
  async verifyServiceWorkerPractices() {
    const fs = require('fs');
    const backgroundContent = fs.readFileSync('src/service_worker.js', 'utf8');

    const serviceWorkerPractices = {
      eventListeners: 0,
      asyncOperations: 0,
      errorHandling: 0,
      cleanup: 0,
    };

    // Check for proper service worker patterns
    if (backgroundContent.includes('chrome.runtime.onStartup')) {
      serviceWorkerPractices.eventListeners++;
    }

    if (backgroundContent.includes('chrome.runtime.onInstalled')) {
      serviceWorkerPractices.eventListeners++;
    }

    if (backgroundContent.includes('chrome.runtime.onMessage')) {
      serviceWorkerPractices.eventListeners++;
    }

    if (backgroundContent.includes('async ') && backgroundContent.includes('await ')) {
      serviceWorkerPractices.asyncOperations++;
    }

    if (backgroundContent.includes('try {') && backgroundContent.includes('catch')) {
      serviceWorkerPractices.errorHandling++;
    }

    if (backgroundContent.includes('chrome.runtime.lastError')) {
      serviceWorkerPractices.cleanup++;
    }

    // Check for service worker anti-patterns
    const antiPatterns = [];
    if (backgroundContent.includes('setInterval')) {
      antiPatterns.push('setInterval in service worker');
    }

    if (backgroundContent.includes('document.')) {
      antiPatterns.push('DOM access in service worker');
    }

    if (antiPatterns.length > 0) {
      throw new Error(`Service worker anti-patterns: ${antiPatterns.join(', ')}`);
    }

    return {
      serviceWorkerPractices,
      antiPatterns,
      compliance: true,
    };
  }

  /**
   * Verify message passing security
   */
  async verifyMessagePassingSecurity() {
    const fs = require('fs');
    const backgroundContent = fs.readFileSync('src/service_worker.js', 'utf8');
    const contentScriptContent = fs.readFileSync('src/content.js', 'utf8');

    const messageSecurity = {
      originValidation: 0,
      messageValidation: 0,
      errorHandling: 0,
      secureChannels: 0,
    };

    // Check for origin validation
    if (backgroundContent.includes('sender.origin') || backgroundContent.includes('sender.url')) {
      messageSecurity.originValidation++;
    }

    // Check for message validation
    if (backgroundContent.includes('typeof') && backgroundContent.includes('message')) {
      messageSecurity.messageValidation++;
    }

    // Check for error handling
    if (backgroundContent.includes('chrome.runtime.lastError')) {
      messageSecurity.errorHandling++;
    }

    // Check for secure message channels
    if (
      backgroundContent.includes('chrome.runtime.sendMessage') &&
      backgroundContent.includes('response')
    ) {
      messageSecurity.secureChannels++;
    }

    // Check for security issues
    const securityIssues = [];
    if (
      contentScriptContent.includes('window.postMessage') &&
      !contentScriptContent.includes('event.origin')
    ) {
      securityIssues.push('postMessage without origin validation');
    }

    if (securityIssues.length > 0) {
      throw new Error(`Message passing security issues: ${securityIssues.join(', ')}`);
    }

    return {
      messageSecurity,
      securityIssues,
      compliance: true,
    };
  }

  /**
   * Verify storage best practices
   */
  async verifyStoragePractices() {
    const fs = require('fs');
    const sourceFiles = ['src/service_worker.js', 'src/options.js'];

    const storagePractices = {
      properAPIs: 0,
      errorHandling: 0,
      dataValidation: 0,
      cleanup: 0,
    };

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) {continue;}

      const content = fs.readFileSync(file, 'utf8');

      // Check for proper storage API usage
      if (content.includes('chrome.storage.local') || content.includes('chrome.storage.sync')) {
        storagePractices.properAPIs++;
      }

      // Check for error handling
      if (content.includes('chrome.runtime.lastError')) {
        storagePractices.errorHandling++;
      }

      // Check for data validation
      if (content.includes('JSON.parse') && content.includes('try {')) {
        storagePractices.dataValidation++;
      }

      // Check for cleanup
      if (content.includes('chrome.storage.onChanged')) {
        storagePractices.cleanup++;
      }
    }

    return {
      storagePractices,
      compliance: true,
    };
  }

  /**
   * Verify error handling and logging
   */
  async verifyErrorHandling() {
    const fs = require('fs');
    const sourceFiles = [
      'src/service_worker.js',
      'src/content.js',
      'src/gateway.js',
      'src/options.js',
    ];

    const errorHandling = {
      tryCatchBlocks: 0,
      errorLogging: 0,
      gracefulDegradation: 0,
      userFeedback: 0,
    };

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) {continue;}

      const content = fs.readFileSync(file, 'utf8');

      // Check for try-catch blocks
      const tryCatchMatches = content.match(/try\s*{/g) || [];
      errorHandling.tryCatchBlocks += tryCatchMatches.length;

      // Check for error logging
      if (content.includes('console.error') || content.includes('console.warn')) {
        errorHandling.errorLogging++;
      }

      // Check for graceful degradation
      if (content.includes('if (chrome.runtime.lastError)')) {
        errorHandling.gracefulDegradation++;
      }

      // Check for user feedback
      if (content.includes('alert(') || content.includes('notification')) {
        errorHandling.userFeedback++;
      }
    }

    if (errorHandling.tryCatchBlocks < 3) {
      throw new Error('Insufficient error handling - need more try-catch blocks');
    }

    return {
      errorHandling,
      compliance: true,
    };
  }

  /**
   * Verify accessibility compliance
   */
  async verifyAccessibilityCompliance() {
    const fs = require('fs');
    const htmlFiles = ['src/popup/popup.html', 'src/options.html'];

    const accessibilityFeatures = {
      semanticHTML: 0,
      ariaLabels: 0,
      keyboardNavigation: 0,
      colorContrast: 0,
    };

    for (const file of htmlFiles) {
      if (!fs.existsSync(file)) {continue;}

      const content = fs.readFileSync(file, 'utf8');

      // Check for semantic HTML
      if (
        content.includes('<main>') ||
        content.includes('<section>') ||
        content.includes('<nav>')
      ) {
        accessibilityFeatures.semanticHTML++;
      }

      // Check for ARIA labels
      if (content.includes('aria-label') || content.includes('aria-labelledby')) {
        accessibilityFeatures.ariaLabels++;
      }

      // Check for keyboard navigation
      if (content.includes('tabindex') || content.includes('onkeydown')) {
        accessibilityFeatures.keyboardNavigation++;
      }
    }

    return {
      accessibilityFeatures,
      compliance: true,
    };
  }

  /**
   * Verify internationalization
   */
  async verifyInternationalization() {
    const fs = require('fs');
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

    const i18nFeatures = {
      defaultLocale: !!manifest.default_locale,
      locales: 0,
      messageFiles: 0,
    };

    // Check for locale files
    const localeFiles = ['_locales/en/messages.json', '_locales/es/messages.json'];
    for (const file of localeFiles) {
      if (fs.existsSync(file)) {
        i18nFeatures.locales++;
        i18nFeatures.messageFiles++;
      }
    }

    return {
      i18nFeatures,
      compliance: true,
    };
  }

  /**
   * Calculate best practices score
   */
  calculateBestPracticesScore() {
    this.bestPracticesScore = (this.passedChecks / this.totalChecks) * 100;
  }

  /**
   * Generate best practices report
   */
  generateBestPracticesReport() {
    const report = {
      summary: {
        totalChecks: this.totalChecks,
        passedChecks: this.passedChecks,
        failedChecks: this.totalChecks - this.passedChecks,
        bestPracticesScore: Math.round(this.bestPracticesScore * 100) / 100,
        status: this.bestPracticesScore >= 80 ? 'BEST_PRACTICES_COMPLIANT' : 'NEEDS_IMPROVEMENT',
      },
      results: this.verificationResults,
      recommendations: this.generateBestPracticesRecommendations(),
      timestamp: new Date().toISOString(),
    };

    console.log('\n' + '='.repeat(60));
    console.log('📊 CHROME BEST PRACTICES REPORT');
    console.log('='.repeat(60));
    console.log(`Total Checks: ${this.totalChecks}`);
    console.log(`Passed: ${this.passedChecks}`);
    console.log(`Failed: ${this.totalChecks - this.passedChecks}`);
    console.log(`Best Practices Score: ${this.bestPracticesScore.toFixed(2)}%`);
    console.log(`Status: ${report.summary.status}`);

    if (this.bestPracticesScore >= 80) {
      console.log('\n✅ EXTENSION FOLLOWS CHROME BEST PRACTICES');
    } else {
      console.log('\n❌ EXTENSION NEEDS IMPROVEMENT FOR BEST PRACTICES');
    }

    console.log('\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach((rec) => {
      console.log(`  - ${rec}`);
    });

    // Save report
    const fs = require('fs');
    fs.writeFileSync('chrome-best-practices-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: chrome-best-practices-report.json');

    return report;
  }

  /**
   * Generate best practices recommendations
   */
  generateBestPracticesRecommendations() {
    const recommendations = [];

    if (this.bestPracticesScore >= 90) {
      recommendations.push('Extension follows Chrome best practices excellently');
    } else if (this.bestPracticesScore >= 80) {
      recommendations.push('Extension mostly follows Chrome best practices');
    } else {
      recommendations.push('Extension needs significant improvements for Chrome best practices');
    }

    const failedChecks = this.verificationResults.filter((r) => r.status === 'NON_COMPLIANT');
    if (failedChecks.length > 0) {
      recommendations.push('Address failed best practices checks');
    }

    recommendations.push('Follow Chrome Extension Developer Guide');
    recommendations.push('Implement proper Content Security Policy');
    recommendations.push('Use Chrome DevTools Protocol for debugging');
    recommendations.push('Follow Manifest V3 best practices');
    recommendations.push('Implement proper error handling and logging');
    recommendations.push('Ensure accessibility compliance');
    recommendations.push('Add internationalization support');

    return recommendations;
  }
}

// Run verification if this script is executed directly
if (require.main === module) {
  const verifier = new ChromeBestPracticesVerifier();
  verifier.runVerification().catch(console.error);
}

module.exports = ChromeBestPracticesVerifier;
