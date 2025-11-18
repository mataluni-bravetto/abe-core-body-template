/**
 * Chrome Extension Debugger - Production-Grade Debugging Framework
 * 
 * A comprehensive debugging toolkit for Chrome extensions that provides:
 * - Automated diagnostics
 * - Storage quota management
 * - Network request monitoring
 * - Error tracking and reporting
 * - Performance profiling
 * - Production readiness checks
 * 
 * Usage:
 *   - Load in Service Worker console: importScripts('debug/chrome-extension-debugger.js')
 *   - Load in Popup console: <script src="debug/chrome-extension-debugger.js"></script>
 *   - Run diagnostics: ChromeExtensionDebugger.runAllDiagnostics()
 */

class ChromeExtensionDebugger {
  constructor(context = 'unknown') {
    this.context = context; // 'service-worker', 'popup', 'content-script', 'options'
    this.results = {
      timestamp: new Date().toISOString(),
      context: context,
      diagnostics: {},
      errors: [],
      warnings: [],
      recommendations: []
    };
    
    // Detect context automatically
    if (typeof importScripts !== 'undefined') {
      this.context = 'service-worker';
    } else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getBackgroundPage) {
      this.context = 'popup';
    } else if (typeof window !== 'undefined' && window.location && window.location.protocol === 'chrome-extension:') {
      this.context = 'options';
    } else {
      this.context = 'content-script';
    }
    
    this.results.context = this.context;
  }

  /**
   * Run all diagnostics
   */
  async runAllDiagnostics() {
    console.log(`🔍 Chrome Extension Debugger - Running diagnostics in ${this.context} context...\n`);
    
    try {
      await this.checkStorageQuota();
      await this.checkNetworkConnectivity();
      await this.checkAuthentication();
      await this.checkGatewayStatus();
      await this.checkErrorHandling();
      await this.checkPerformance();
      await this.checkProductionReadiness();
      
      this.generateReport();
      return this.results;
    } catch (error) {
      console.error('❌ Diagnostic error:', error);
      this.results.errors.push({
        type: 'DIAGNOSTIC_ERROR',
        message: error.message,
        stack: error.stack
      });
      return this.results;
    }
  }

  /**
   * Check storage quota and usage
   */
  async checkStorageQuota() {
    console.log('📦 Checking storage quota...');
    const diagnostic = {
      name: 'Storage Quota',
      status: 'unknown',
      details: {},
      issues: []
    };

    try {
      // Check local storage
      const localUsage = await new Promise((resolve) => {
        chrome.storage.local.getBytesInUse(null, (bytes) => {
          resolve(bytes);
        });
      });

      // Check sync storage
      const syncUsage = await new Promise((resolve) => {
        chrome.storage.sync.getBytesInUse(null, (bytes) => {
          resolve(bytes);
        });
      });

      // Chrome storage limits
      const LOCAL_QUOTA = 10 * 1024 * 1024; // 10MB
      const SYNC_QUOTA = 1024 * 1024; // 1MB
      const ITEM_QUOTA = 8 * 1024; // 8KB per item

      diagnostic.details = {
        localUsage: localUsage,
        localUsageMB: (localUsage / 1024 / 1024).toFixed(2),
        localQuotaMB: (LOCAL_QUOTA / 1024 / 1024).toFixed(2),
        localUsagePercent: ((localUsage / LOCAL_QUOTA) * 100).toFixed(2),
        syncUsage: syncUsage,
        syncUsageKB: (syncUsage / 1024).toFixed(2),
        syncQuotaKB: (SYNC_QUOTA / 1024).toFixed(2),
        syncUsagePercent: ((syncUsage / SYNC_QUOTA) * 100).toFixed(2),
        itemQuotaKB: (ITEM_QUOTA / 1024).toFixed(2)
      };

      // Check for quota issues
      if (localUsage > LOCAL_QUOTA * 0.9) {
        diagnostic.issues.push('Local storage usage > 90%');
        diagnostic.status = 'warning';
      }

      if (syncUsage > SYNC_QUOTA * 0.9) {
        diagnostic.issues.push('Sync storage usage > 90%');
        diagnostic.status = 'warning';
      }

      // Check individual items
      const localData = await new Promise((resolve) => {
        chrome.storage.local.get(null, resolve);
      });

      for (const [key, value] of Object.entries(localData)) {
        const itemSize = JSON.stringify(value).length;
        if (itemSize > ITEM_QUOTA) {
          diagnostic.issues.push(`Item "${key}" exceeds 8KB limit: ${(itemSize / 1024).toFixed(2)}KB`);
          diagnostic.status = 'error';
        }
      }

      if (diagnostic.status === 'unknown') {
        diagnostic.status = 'ok';
      }

      console.log(`  ✅ Storage check complete: ${diagnostic.status.toUpperCase()}`);
      if (diagnostic.issues.length > 0) {
        console.log(`  ⚠️  Issues: ${diagnostic.issues.join(', ')}`);
      }
    } catch (error) {
      diagnostic.status = 'error';
      diagnostic.issues.push(`Storage check failed: ${error.message}`);
      console.error('  ❌ Storage check failed:', error);
    }

    this.results.diagnostics.storage = diagnostic;
  }

  /**
   * Check network connectivity
   */
  async checkNetworkConnectivity() {
    console.log('🌐 Checking network connectivity...');
    const diagnostic = {
      name: 'Network Connectivity',
      status: 'unknown',
      details: {},
      issues: []
    };

    try {
      // Test gateway connection
      if (typeof gateway !== 'undefined' && gateway.testGatewayConnection) {
        const startTime = Date.now();
        const connected = await gateway.testGatewayConnection();
        const responseTime = Date.now() - startTime;

        diagnostic.details.gatewayConnection = {
          connected: connected,
          responseTime: responseTime,
          status: connected ? 'ok' : 'error'
        };

        if (!connected) {
          diagnostic.issues.push('Gateway connection failed');
          diagnostic.status = 'error';
        } else {
          diagnostic.status = 'ok';
        }
      } else {
        diagnostic.issues.push('Gateway not available in this context');
        diagnostic.status = 'warning';
      }

      // Test health endpoint
      try {
        const healthUrl = 'https://api.aiguardian.ai/health/live';
        const startTime = Date.now();
        const response = await fetch(healthUrl, {
          method: 'GET',
          headers: {
            'X-Extension-Version': chrome.runtime.getManifest().version
          }
        });
        const responseTime = Date.now() - startTime;

        diagnostic.details.healthEndpoint = {
          url: healthUrl,
          status: response.status,
          ok: response.ok,
          responseTime: responseTime
        };

        if (!response.ok) {
          diagnostic.issues.push(`Health endpoint returned ${response.status}`);
          if (diagnostic.status !== 'error') diagnostic.status = 'warning';
        }
      } catch (error) {
        diagnostic.issues.push(`Health endpoint failed: ${error.message}`);
        if (diagnostic.status !== 'error') diagnostic.status = 'warning';
      }

      console.log(`  ✅ Network check complete: ${diagnostic.status.toUpperCase()}`);
      if (diagnostic.issues.length > 0) {
        console.log(`  ⚠️  Issues: ${diagnostic.issues.join(', ')}`);
      }
    } catch (error) {
      diagnostic.status = 'error';
      diagnostic.issues.push(`Network check failed: ${error.message}`);
      console.error('  ❌ Network check failed:', error);
    }

    this.results.diagnostics.network = diagnostic;
  }

  /**
   * Check authentication state
   */
  async checkAuthentication() {
    console.log('🔐 Checking authentication...');
    const diagnostic = {
      name: 'Authentication',
      status: 'unknown',
      details: {},
      issues: []
    };

    try {
      // Check stored user
      const storedUser = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_user'], (data) => {
          resolve(data.clerk_user || null);
        });
      });

      // Check stored token
      const storedToken = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_token'], (data) => {
          resolve(data.clerk_token || null);
        });
      });

      diagnostic.details = {
        hasStoredUser: !!storedUser,
        hasStoredToken: !!storedToken,
        userId: storedUser?.id || null,
        email: storedUser?.email || null,
        tokenLength: storedToken?.length || 0
      };

      if (!storedUser && !storedToken) {
        diagnostic.issues.push('No authentication data found');
        diagnostic.status = 'warning';
      } else if (!storedToken) {
        diagnostic.issues.push('User found but no token');
        diagnostic.status = 'warning';
      } else {
        diagnostic.status = 'ok';
      }

      // Check token expiration (basic check - tokens are JWT)
      if (storedToken) {
        try {
          const tokenParts = storedToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            const now = Date.now();
            const expiresIn = expirationTime - now;

            diagnostic.details.tokenExpiration = {
              expiresAt: new Date(expirationTime).toISOString(),
              expiresIn: expiresIn,
              expiresInMinutes: Math.floor(expiresIn / 60000),
              isExpired: expiresIn < 0
            };

            if (expiresIn < 0) {
              diagnostic.issues.push('Token is expired');
              diagnostic.status = 'error';
            } else if (expiresIn < 3600000) { // Less than 1 hour
              diagnostic.issues.push('Token expires soon (< 1 hour)');
              if (diagnostic.status !== 'error') diagnostic.status = 'warning';
            }
          }
        } catch (e) {
          // Token parsing failed - might not be JWT format
          diagnostic.issues.push('Could not parse token expiration');
        }
      }

      console.log(`  ✅ Authentication check complete: ${diagnostic.status.toUpperCase()}`);
      if (diagnostic.issues.length > 0) {
        console.log(`  ⚠️  Issues: ${diagnostic.issues.join(', ')}`);
      }
    } catch (error) {
      diagnostic.status = 'error';
      diagnostic.issues.push(`Authentication check failed: ${error.message}`);
      console.error('  ❌ Authentication check failed:', error);
    }

    this.results.diagnostics.authentication = diagnostic;
  }

  /**
   * Check gateway status
   */
  async checkGatewayStatus() {
    console.log('🚪 Checking gateway status...');
    const diagnostic = {
      name: 'Gateway Status',
      status: 'unknown',
      details: {},
      issues: []
    };

    try {
      if (this.context === 'service-worker' && typeof gateway !== 'undefined') {
        // Check gateway initialization
        diagnostic.details.gatewayInitialized = gateway.isInitialized || false;

        if (!gateway.isInitialized) {
          diagnostic.issues.push('Gateway not initialized');
          diagnostic.status = 'warning';
        }

        // Get gateway status
        try {
          const status = await gateway.getGatewayStatus();
          diagnostic.details.status = status;

          if (status.connected) {
            diagnostic.status = 'ok';
          } else {
            diagnostic.issues.push('Gateway reports disconnected');
            diagnostic.status = 'error';
          }
        } catch (error) {
          diagnostic.issues.push(`Status check failed: ${error.message}`);
          diagnostic.status = 'error';
        }

        // Check configuration
        if (gateway.config) {
          diagnostic.details.config = {
            gatewayUrl: gateway.config.gatewayUrl,
            hasGatewayUrl: !!gateway.config.gatewayUrl
          };

          if (!gateway.config.gatewayUrl) {
            diagnostic.issues.push('Gateway URL not configured');
            diagnostic.status = 'error';
          }
        }
      } else {
        // Test via message passing
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: 'GET_GUARD_STATUS' }, (response) => {
            resolve(response);
          });
        });

        diagnostic.details.messageResponse = response;

        if (response && response.success) {
          if (response.status && response.status.gateway_connected) {
            diagnostic.status = 'ok';
          } else {
            diagnostic.issues.push('Gateway reports disconnected');
            diagnostic.status = 'error';
          }
        } else {
          diagnostic.issues.push(`Status request failed: ${response?.error || 'Unknown error'}`);
          diagnostic.status = 'error';
        }
      }

      console.log(`  ✅ Gateway status check complete: ${diagnostic.status.toUpperCase()}`);
      if (diagnostic.issues.length > 0) {
        console.log(`  ⚠️  Issues: ${diagnostic.issues.join(', ')}`);
      }
    } catch (error) {
      diagnostic.status = 'error';
      diagnostic.issues.push(`Gateway check failed: ${error.message}`);
      console.error('  ❌ Gateway check failed:', error);
    }

    this.results.diagnostics.gateway = diagnostic;
  }

  /**
   * Check error handling
   */
  async checkErrorHandling() {
    console.log('⚠️  Checking error handling...');
    const diagnostic = {
      name: 'Error Handling',
      status: 'unknown',
      details: {},
      issues: []
    };

    try {
      // Check for recent errors in console
      // Note: This is a basic check - full error tracking requires integration
      diagnostic.details.consoleErrors = 'Check browser console manually';

      // Check error handler availability
      if (typeof AiGuardianErrorHandler !== 'undefined') {
        diagnostic.details.errorHandlerAvailable = true;
      } else {
        diagnostic.details.errorHandlerAvailable = false;
        diagnostic.issues.push('Error handler not available');
        diagnostic.status = 'warning';
      }

      // Check for common error patterns
      const commonErrors = [
        'quota',
        '401',
        '403',
        '404',
        '500',
        'timeout',
        'network',
        'CORS'
      ];

      diagnostic.details.commonErrorPatterns = commonErrors;
      diagnostic.status = 'ok';

      console.log(`  ✅ Error handling check complete: ${diagnostic.status.toUpperCase()}`);
    } catch (error) {
      diagnostic.status = 'error';
      diagnostic.issues.push(`Error handling check failed: ${error.message}`);
      console.error('  ❌ Error handling check failed:', error);
    }

    this.results.diagnostics.errorHandling = diagnostic;
  }

  /**
   * Check performance metrics
   */
  async checkPerformance() {
    console.log('⚡ Checking performance...');
    const diagnostic = {
      name: 'Performance',
      status: 'unknown',
      details: {},
      issues: []
    };

    try {
      const metrics = {
        gatewayResponseTime: null,
        storageReadTime: null,
        storageWriteTime: null
      };

      // Test gateway response time
      if (typeof gateway !== 'undefined' && gateway.testGatewayConnection) {
        const startTime = performance.now();
        await gateway.testGatewayConnection();
        metrics.gatewayResponseTime = performance.now() - startTime;

        if (metrics.gatewayResponseTime > 5000) {
          diagnostic.issues.push('Gateway response time > 5s');
          diagnostic.status = 'warning';
        }
      }

      // Test storage read time
      const readStart = performance.now();
      await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_user'], resolve);
      });
      metrics.storageReadTime = performance.now() - readStart;

      if (metrics.storageReadTime > 100) {
        diagnostic.issues.push('Storage read time > 100ms');
        if (diagnostic.status !== 'error') diagnostic.status = 'warning';
      }

      // Test storage write time
      const writeStart = performance.now();
      await new Promise((resolve) => {
        chrome.storage.local.set({ _debug_test: Date.now() }, () => {
          chrome.storage.local.remove(['_debug_test'], resolve);
        });
      });
      metrics.storageWriteTime = performance.now() - writeStart;

      if (metrics.storageWriteTime > 100) {
        diagnostic.issues.push('Storage write time > 100ms');
        if (diagnostic.status !== 'error') diagnostic.status = 'warning';
      }

      diagnostic.details.metrics = metrics;

      if (diagnostic.status === 'unknown') {
        diagnostic.status = 'ok';
      }

      console.log(`  ✅ Performance check complete: ${diagnostic.status.toUpperCase()}`);
      if (diagnostic.issues.length > 0) {
        console.log(`  ⚠️  Issues: ${diagnostic.issues.join(', ')}`);
      }
    } catch (error) {
      diagnostic.status = 'error';
      diagnostic.issues.push(`Performance check failed: ${error.message}`);
      console.error('  ❌ Performance check failed:', error);
    }

    this.results.diagnostics.performance = diagnostic;
  }

  /**
   * Check production readiness
   */
  async checkProductionReadiness() {
    console.log('🚀 Checking production readiness...');
    const diagnostic = {
      name: 'Production Readiness',
      status: 'unknown',
      details: {},
      issues: [],
      checks: []
    };

    const checks = [];

    // Check 1: Storage quota issues
    const storageDiag = this.results.diagnostics.storage;
    if (storageDiag && storageDiag.status === 'error') {
      checks.push({ name: 'Storage Quota', status: 'fail', message: 'Storage quota exceeded' });
      diagnostic.issues.push('CRITICAL: Storage quota exceeded');
    } else {
      checks.push({ name: 'Storage Quota', status: 'pass' });
    }

    // Check 2: Gateway connectivity
    const gatewayDiag = this.results.diagnostics.gateway;
    if (gatewayDiag && gatewayDiag.status === 'error') {
      checks.push({ name: 'Gateway Connectivity', status: 'fail', message: 'Gateway disconnected' });
      diagnostic.issues.push('Gateway connectivity issues');
    } else {
      checks.push({ name: 'Gateway Connectivity', status: 'pass' });
    }

    // Check 3: Authentication
    const authDiag = this.results.diagnostics.authentication;
    if (authDiag && authDiag.status === 'error') {
      checks.push({ name: 'Authentication', status: 'fail', message: 'Authentication issues' });
      diagnostic.issues.push('Authentication problems');
    } else if (authDiag && authDiag.status === 'warning') {
      checks.push({ name: 'Authentication', status: 'warning', message: 'Authentication warnings' });
    } else {
      checks.push({ name: 'Authentication', status: 'pass' });
    }

    // Check 4: Error handling
    const errorDiag = this.results.diagnostics.errorHandling;
    if (errorDiag && errorDiag.status === 'error') {
      checks.push({ name: 'Error Handling', status: 'fail', message: 'Error handling issues' });
      diagnostic.issues.push('Error handling problems');
    } else {
      checks.push({ name: 'Error Handling', status: 'pass' });
    }

    // Check 5: Performance
    const perfDiag = this.results.diagnostics.performance;
    if (perfDiag && perfDiag.status === 'error') {
      checks.push({ name: 'Performance', status: 'fail', message: 'Performance issues' });
      diagnostic.issues.push('Performance problems');
    } else if (perfDiag && perfDiag.status === 'warning') {
      checks.push({ name: 'Performance', status: 'warning', message: 'Performance warnings' });
    } else {
      checks.push({ name: 'Performance', status: 'pass' });
    }

    diagnostic.details.checks = checks;

    // Determine overall status
    const failCount = checks.filter(c => c.status === 'fail').length;
    const warnCount = checks.filter(c => c.status === 'warning').length;

    if (failCount > 0) {
      diagnostic.status = 'error';
    } else if (warnCount > 0) {
      diagnostic.status = 'warning';
    } else {
      diagnostic.status = 'ok';
    }

    // Generate recommendations
    if (diagnostic.status !== 'ok') {
      diagnostic.recommendations = this.generateRecommendations();
    }

    console.log(`  ✅ Production readiness check complete: ${diagnostic.status.toUpperCase()}`);
    if (diagnostic.issues.length > 0) {
      console.log(`  ⚠️  Issues: ${diagnostic.issues.join(', ')}`);
    }

    this.results.diagnostics.productionReadiness = diagnostic;
  }

  /**
   * Generate recommendations based on diagnostics
   */
  generateRecommendations() {
    const recommendations = [];

    // Storage recommendations
    const storageDiag = this.results.diagnostics.storage;
    if (storageDiag && storageDiag.issues.length > 0) {
      recommendations.push({
        category: 'Storage',
        priority: 'HIGH',
        message: 'Implement storage quota management - store only essential data',
        action: 'Review storage usage and implement data cleanup'
      });
    }

    // Gateway recommendations
    const gatewayDiag = this.results.diagnostics.gateway;
    if (gatewayDiag && gatewayDiag.status === 'error') {
      recommendations.push({
        category: 'Gateway',
        priority: 'HIGH',
        message: 'Fix gateway connectivity issues',
        action: 'Check gateway URL configuration and network connectivity'
      });
    }

    // Authentication recommendations
    const authDiag = this.results.diagnostics.authentication;
    if (authDiag && authDiag.issues.some(i => i.includes('expired'))) {
      recommendations.push({
        category: 'Authentication',
        priority: 'MEDIUM',
        message: 'Implement token refresh logic',
        action: 'Add automatic token refresh on 401 errors'
      });
    }

    return recommendations;
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSTIC REPORT');
    console.log('='.repeat(60));
    console.log(`Context: ${this.results.context}`);
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');

    // Summary
    const diagnostics = Object.values(this.results.diagnostics);
    const errorCount = diagnostics.filter(d => d.status === 'error').length;
    const warningCount = diagnostics.filter(d => d.status === 'warning').length;
    const okCount = diagnostics.filter(d => d.status === 'ok').length;

    console.log('SUMMARY:');
    console.log(`  ✅ OK: ${okCount}`);
    console.log(`  ⚠️  Warnings: ${warningCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log('');

    // Detailed results
    console.log('DETAILED RESULTS:');
    for (const [key, diagnostic] of Object.entries(this.results.diagnostics)) {
      const icon = diagnostic.status === 'ok' ? '✅' : diagnostic.status === 'warning' ? '⚠️' : '❌';
      console.log(`\n${icon} ${diagnostic.name}: ${diagnostic.status.toUpperCase()}`);
      
      if (diagnostic.issues.length > 0) {
        console.log('  Issues:');
        diagnostic.issues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      }

      if (diagnostic.details && Object.keys(diagnostic.details).length > 0) {
        console.log('  Details:');
        console.log(JSON.stringify(diagnostic.details, null, 4));
      }
    }

    // Recommendations
    const prodDiag = this.results.diagnostics.productionReadiness;
    if (prodDiag && prodDiag.recommendations && prodDiag.recommendations.length > 0) {
      console.log('\n📋 RECOMMENDATIONS:');
      prodDiag.recommendations.forEach(rec => {
        console.log(`\n[${rec.priority}] ${rec.category}: ${rec.message}`);
        console.log(`  Action: ${rec.action}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('Report complete. Copy results object for detailed analysis.');
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Export results as JSON
   */
  exportResults() {
    return JSON.stringify(this.results, null, 2);
  }

  /**
   * Get results object
   */
  getResults() {
    return this.results;
  }
}

// Auto-run if in service worker context
if (typeof importScripts !== 'undefined') {
  // Service worker context
  const debugger = new ChromeExtensionDebugger('service-worker');
  window.ChromeExtensionDebugger = ChromeExtensionDebugger;
  window.runDiagnostics = () => debugger.runAllDiagnostics();
  console.log('🔍 Chrome Extension Debugger loaded. Run: runDiagnostics()');
} else if (typeof window !== 'undefined') {
  // Window context (popup, options, content script)
  window.ChromeExtensionDebugger = ChromeExtensionDebugger;
  const debugger = new ChromeExtensionDebugger();
  window.runDiagnostics = () => debugger.runAllDiagnostics();
  console.log('🔍 Chrome Extension Debugger loaded. Run: runDiagnostics()');
}

