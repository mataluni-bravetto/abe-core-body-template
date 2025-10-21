/**
 * AI Guardians Chrome Extension - Test Runner
 * 
 * This script runs comprehensive tests on the Chrome extension
 * with tracing, logging, and data validation.
 */

const fs = require('fs');
const path = require('path');

class ExtensionTestRunner {
  constructor() {
    this.testResults = [];
    this.traceData = [];
    this.startTime = Date.now();
  }

  /**
   * Run all extension tests
   */
  async runTests() {
    console.log('🚀 Starting AI Guardians Extension Test Suite');
    console.log('=' .repeat(60));
    
    const tests = [
      { name: 'File Structure Validation', fn: this.testFileStructure },
      { name: 'Manifest Validation', fn: this.testManifest },
      { name: 'Code Quality Check', fn: this.testCodeQuality },
      { name: 'API Schema Compatibility', fn: this.testApiCompatibility },
      { name: 'Security Analysis', fn: this.testSecurity },
      { name: 'Performance Analysis', fn: this.testPerformance }
    ];

    for (const test of tests) {
      try {
        console.log(`\n📋 Running: ${test.name}`);
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

    this.generateReport();
  }

  /**
   * Test file structure
   */
  async testFileStructure() {
    const requiredFiles = [
      'manifest.json',
      'src/background.js',
      'src/content.js',
      'src/gateway.js',
      'src/popup.html',
      'src/popup.js',
      'src/options.html',
      'src/options.js',
      'src/testing.js'
    ];

    const missingFiles = [];
    const existingFiles = [];

    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        existingFiles.push(file);
      } else {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing required files: ${missingFiles.join(', ')}`);
    }

    return {
      totalFiles: requiredFiles.length,
      existingFiles: existingFiles.length,
      missingFiles: missingFiles.length,
      files: existingFiles
    };
  }

  /**
   * Test manifest.json
   */
  async testManifest() {
    const manifestPath = 'manifest.json';
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error('manifest.json not found');
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Validate required fields
    const requiredFields = ['manifest_version', 'name', 'version', 'permissions', 'background'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required manifest fields: ${missingFields.join(', ')}`);
    }

    // Validate manifest version
    if (manifest.manifest_version !== 3) {
      throw new Error('Manifest version must be 3 for Chrome MV3');
    }

    // Validate permissions
    const requiredPermissions = ['storage', 'alarms'];
    const missingPermissions = requiredPermissions.filter(perm => !manifest.permissions.includes(perm));
    
    if (missingPermissions.length > 0) {
      throw new Error(`Missing required permissions: ${missingPermissions.join(', ')}`);
    }

    return {
      manifestVersion: manifest.manifest_version,
      name: manifest.name,
      version: manifest.version,
      permissions: manifest.permissions,
      hasBackground: !!manifest.background,
      hasContentScripts: !!manifest.content_scripts,
      hasAction: !!manifest.action
    };
  }

  /**
   * Test code quality
   */
  async testCodeQuality() {
    const sourceFiles = [
      'src/background.js',
      'src/content.js',
      'src/gateway.js',
      'src/popup.js',
      'src/options.js',
      'src/testing.js'
    ];

    const qualityResults = {};

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) {
        qualityResults[file] = { status: 'missing', error: 'File not found' };
        continue;
      }

      const content = fs.readFileSync(file, 'utf8');
      const analysis = this.analyzeCodeQuality(content, file);
      qualityResults[file] = analysis;
    }

    return qualityResults;
  }

  /**
   * Analyze code quality for a file
   */
  analyzeCodeQuality(content, filename) {
    const lines = content.split('\n');
    const totalLines = lines.length;
    const emptyLines = lines.filter(line => line.trim() === '').length;
    const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*')).length;
    const codeLines = totalLines - emptyLines - commentLines;
    
    // Check for common issues
    const issues = [];
    
    // Check for console.log statements (should use proper logging)
    const consoleLogs = content.match(/console\.log/g) || [];
    if (consoleLogs.length > 0) {
      issues.push(`${consoleLogs.length} console.log statements found`);
    }
    
    // Check for TODO comments
    const todos = content.match(/TODO|FIXME|HACK/g) || [];
    if (todos.length > 0) {
      issues.push(`${todos.length} TODO/FIXME/HACK comments found`);
    }
    
    // Check for error handling
    const tryCatchBlocks = content.match(/try\s*{/g) || [];
    const catchBlocks = content.match(/catch\s*\(/g) || [];
    
    // Check for async/await usage
    const asyncFunctions = content.match(/async\s+function/g) || [];
    const awaitStatements = content.match(/await\s+/g) || [];
    
    return {
      totalLines,
      codeLines,
      commentLines,
      emptyLines,
      commentRatio: Math.round((commentLines / totalLines) * 100),
      issues,
      errorHandling: {
        tryCatchBlocks: tryCatchBlocks.length,
        catchBlocks: catchBlocks.length,
        hasErrorHandling: tryCatchBlocks.length > 0
      },
      asyncUsage: {
        asyncFunctions: asyncFunctions.length,
        awaitStatements: awaitStatements.length
      }
    };
  }

  /**
   * Test API compatibility
   */
  async testApiCompatibility() {
    const gatewayFile = 'src/gateway.js';
    
    if (!fs.existsSync(gatewayFile)) {
      throw new Error('gateway.js not found');
    }

    const content = fs.readFileSync(gatewayFile, 'utf8');
    
    // Check for required API endpoints
    const requiredEndpoints = [
      'analyze/text',
      'health/live',
      'logging',
      'guards',
      'config/user'
    ];
    
    const endpointMapping = content.match(/endpointMapping\s*=\s*{[\s\S]*?}/);
    if (!endpointMapping) {
      throw new Error('Endpoint mapping not found in gateway.js');
    }
    
    // Check for guard service mappings
    const guardServices = ['biasguard', 'trustguard', 'contextguard', 'securityguard', 'tokenguard', 'healthguard'];
    const foundGuards = guardServices.filter(guard => content.includes(guard));
    
    if (foundGuards.length !== guardServices.length) {
      throw new Error(`Missing guard services: ${guardServices.filter(g => !foundGuards.includes(g)).join(', ')}`);
    }
    
    // Check for tracing and logging
    const hasTracing = content.includes('traceStats') && content.includes('updateTraceStats');
    const hasLogging = content.includes('initializeLogger') && content.includes('logger');
    const hasValidation = content.includes('validateApiResponse') && content.includes('sanitizePayload');
    
    return {
      endpointMapping: !!endpointMapping,
      guardServices: {
        expected: guardServices.length,
        found: foundGuards.length,
        services: foundGuards
      },
      tracing: hasTracing,
      logging: hasLogging,
      validation: hasValidation,
      hasAllFeatures: hasTracing && hasLogging && hasValidation
    };
  }

  /**
   * Test security
   */
  async testSecurity() {
    const sourceFiles = [
      'src/background.js',
      'src/content.js',
      'src/gateway.js',
      'src/popup.js',
      'src/options.js'
    ];

    const securityIssues = [];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) {
        continue;
      }

      const content = fs.readFileSync(file, 'utf8');
      const issues = this.analyzeSecurity(content, file);
      securityIssues.push(...issues);
    }

    return {
      totalIssues: securityIssues.length,
      issues: securityIssues,
      securityScore: Math.max(0, 100 - (securityIssues.length * 10))
    };
  }

  /**
   * Analyze security issues in code
   */
  analyzeSecurity(content, filename) {
    const issues = [];
    
    // Check for dangerous patterns
    const dangerousPatterns = [
      { pattern: /eval\s*\(/, message: 'eval() usage detected' },
      { pattern: /innerHTML\s*=/, message: 'innerHTML assignment detected' },
      { pattern: /document\.write/, message: 'document.write usage detected' },
      { pattern: /setTimeout\s*\(\s*["']/, message: 'String-based setTimeout detected' },
      { pattern: /setInterval\s*\(\s*["']/, message: 'String-based setInterval detected' }
    ];
    
    for (const { pattern, message } of dangerousPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          file: filename,
          type: 'security',
          message,
          count: matches.length
        });
      }
    }
    
    // Check for proper error handling
    const hasTryCatch = content.includes('try') && content.includes('catch');
    if (!hasTryCatch && content.includes('fetch')) {
      issues.push({
        file: filename,
        type: 'security',
        message: 'fetch() calls without proper error handling'
      });
    }
    
    return issues;
  }

  /**
   * Test performance
   */
  async testPerformance() {
    const sourceFiles = [
      'src/background.js',
      'src/content.js',
      'src/gateway.js'
    ];

    const performanceMetrics = {};

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) {
        continue;
      }
      
      const content = fs.readFileSync(file, 'utf8');
      const stats = fs.statSync(file);
      
      performanceMetrics[file] = {
        fileSize: stats.size,
        lineCount: content.split('\n').length,
        characterCount: content.length,
        complexity: this.calculateComplexity(content)
      };
    }

    return performanceMetrics;
  }

  /**
   * Calculate code complexity
   */
  calculateComplexity(content) {
    const complexityIndicators = [
      content.match(/if\s*\(/g) || [],
      content.match(/for\s*\(/g) || [],
      content.match(/while\s*\(/g) || [],
      content.match(/switch\s*\(/g) || [],
      content.match(/catch\s*\(/g) || [],
      content.match(/function\s+/g) || [],
      content.match(/class\s+/g) || []
    ];
    
    const totalComplexity = complexityIndicators.reduce((sum, indicator) => sum + indicator.length, 0);
    
    return {
      total: totalComplexity,
      level: totalComplexity < 10 ? 'low' : totalComplexity < 25 ? 'medium' : 'high'
    };
  }

  /**
   * Generate comprehensive test report
   */
  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.status === 'PASSED').length;
    const failedTests = this.testResults.filter(t => t.status === 'FAILED').length;
    const successRate = (passedTests / totalTests) * 100;
    
    const report = {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: Math.round(successRate * 100) / 100,
        duration: Date.now() - this.startTime
      },
      results: this.testResults,
      timestamp: new Date().toISOString(),
      recommendations: this.generateRecommendations()
    };
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST REPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${successRate.toFixed(2)}%`);
    console.log(`Duration: ${report.summary.duration}ms`);
    
    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(t => t.status === 'FAILED')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
    }
    
    console.log('\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach(rec => {
      console.log(`  - ${rec}`);
    });
    
    // Save report to file
    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Detailed report saved to: test-report.json');
    
    return report;
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];
    
    const failedTests = this.testResults.filter(t => t.status === 'FAILED');
    
    if (failedTests.length > 0) {
      recommendations.push('Fix failed tests before deployment');
    }
    
    const codeQualityTests = this.testResults.find(t => t.name === 'Code Quality Check');
    if (codeQualityTests && codeQualityTests.result) {
      const hasIssues = Object.values(codeQualityTests.result).some(result => 
        result.issues && result.issues.length > 0
      );
      
      if (hasIssues) {
        recommendations.push('Address code quality issues found in source files');
      }
    }
    
    const securityTests = this.testResults.find(t => t.name === 'Security Analysis');
    if (securityTests && securityTests.result && securityTests.result.totalIssues > 0) {
      recommendations.push('Address security issues before production deployment');
    }
    
    recommendations.push('Run extension in Chrome developer mode for manual testing');
    recommendations.push('Test with real backend API endpoints');
    recommendations.push('Validate all guard services are working correctly');
    
    return recommendations;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const runner = new ExtensionTestRunner();
  runner.runTests().catch(console.error);
}

module.exports = ExtensionTestRunner;
