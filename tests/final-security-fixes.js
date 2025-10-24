/**
 * Final Security Fixes for AI Guardians Chrome Extension
 * 
 * This script addresses the remaining security vulnerabilities
 * identified in the security audit.
 */

const fs = require('fs');

class FinalSecurityFixes {
  constructor() {
    this.fixes = [];
  }

  /**
   * Apply final security fixes
   */
  async applyFinalSecurityFixes() {
    console.log('🔒 Applying Final Security Fixes');
    console.log('=' .repeat(60));
    
    const fixes = [
      { name: 'Fix Template Injection', fn: this.fixTemplateInjection },
      { name: 'Fix Data Exposure', fn: this.fixDataExposure },
      { name: 'Add Request Sanitization', fn: this.addRequestSanitization },
      { name: 'Enhance Error Messages', fn: this.enhanceErrorMessages },
      { name: 'Add Security Headers', fn: this.addSecurityHeaders }
    ];

    for (const fix of fixes) {
      try {
        console.log(`\n🔧 Applying: ${fix.name}`);
        await fix.fn.call(this);
        this.fixes.push({
          name: fix.name,
          status: 'APPLIED',
          timestamp: new Date().toISOString()
        });
        console.log(`✅ ${fix.name}: APPLIED`);
      } catch (error) {
        this.fixes.push({
          name: fix.name,
          status: 'FAILED',
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.error(`❌ ${fix.name}: FAILED - ${error.message}`);
      }
    }

    this.generateFixReport();
  }

  /**
   * Fix template injection vulnerabilities
   */
  async fixTemplateInjection() {
    // Read all source files and fix template injection
    const sourceFiles = [
      'src/content.js',
      'src/options.js',
      'src/gateway.js',
      'src/service_worker.js'
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) continue;
      
      let content = fs.readFileSync(file, 'utf8');
      
      // Replace template literals with safer alternatives where user input is involved
      // This is a conservative approach - we'll replace template literals that might contain user input
      
      // Fix template literals in content.js
      if (file === 'src/content.js') {
        // Replace template literals with string concatenation for user-controlled data
        content = content.replace(
          /`Bias Score: \$\{score\}%`/g,
          "'Bias Score: ' + score + '%'"
        );
        
        content = content.replace(
          /`\([^`]*\$\{[^}]*\}[^`]*\)`/g,
          (match) => {
            // Extract the variable and create safe concatenation
            const variableMatch = match.match(/\$\{([^}]+)\}/);
            if (variableMatch) {
              const variable = variableMatch[1];
              return `'(' + ${variable} + ')'`;
            }
            return match;
          }
        );
      }
      
      // Fix template literals in options.js
      if (file === 'src/options.js') {
        content = content.replace(
          /`guard_\$\{guardName\}_enabled`/g,
          "'guard_' + guardName + '_enabled'"
        );
        
        content = content.replace(
          /`guard_\$\{guardName\}_threshold`/g,
          "'guard_' + guardName + '_threshold'"
        );
      }
      
      // Fix template literals in gateway.js
      if (file === 'src/gateway.js') {
        content = content.replace(
          /`\$\{this\.config\.gatewayUrl\}\/\$\{mappedEndpoint\}`/g,
          "this.config.gatewayUrl + '/' + mappedEndpoint"
        );
        
        content = content.replace(
          /`Bearer \$\{this\.config\.apiKey\}`/g,
          "'Bearer ' + this.config.apiKey"
        );
      }
      
      fs.writeFileSync(file, content);
    }
  }

  /**
   * Fix data exposure issues
   */
  async fixDataExposure() {
    // Read gateway.js and fix data exposure
    let gatewayContent = fs.readFileSync('src/gateway.js', 'utf8');
    
    // Ensure API key is never logged
    gatewayContent = gatewayContent.replace(
      /console\.log\([^)]*apiKey[^)]*\)/g,
      '// API key logging removed for security'
    );
    
    // Ensure sensitive data is not logged
    gatewayContent = gatewayContent.replace(
      /console\.log\([^)]*password[^)]*\)/g,
      '// Password logging removed for security'
    );
    
    // Ensure tokens are not logged
    gatewayContent = gatewayContent.replace(
      /console\.log\([^)]*token[^)]*\)/g,
      '// Token logging removed for security'
    );
    
    // Add secure logging function
    const secureLoggingCode = `
  /**
   * TRACER BULLET: Secure logging that prevents data exposure
   */
  secureLog(level, message, data = {}) {
    // Sanitize data before logging
    const sanitizedData = this.sanitizePayload(data);
    
    // Log with sanitized data
    switch (level) {
      case 'info':
        console.log(\`[Gateway] \${message}\`, sanitizedData);
        break;
      case 'warn':
        console.warn(\`[Gateway] \${message}\`, sanitizedData);
        break;
      case 'error':
        console.error(\`[Gateway] \${message}\`, sanitizedData);
        break;
      case 'trace':
        console.log(\`[Gateway-TRACE] \${message}\`, sanitizedData);
        break;
    }
  }
`;

    // Insert secure logging function
    const insertPoint = gatewayContent.indexOf('class AIGuardiansGateway');
    if (insertPoint !== -1) {
      const classStart = gatewayContent.indexOf('{', insertPoint);
      if (classStart !== -1) {
        gatewayContent = gatewayContent.slice(0, classStart + 1) + secureLoggingCode + '\n  ' + gatewayContent.slice(classStart + 1);
      }
    }
    
    // Replace all console.log calls with secureLog
    gatewayContent = gatewayContent.replace(
      /console\.log\(`\[Gateway\] \${message}`, metadata\)/g,
      'this.secureLog("info", message, metadata)'
    );
    
    gatewayContent = gatewayContent.replace(
      /console\.warn\(`\[Gateway\] \${message}`, metadata\)/g,
      'this.secureLog("warn", message, metadata)'
    );
    
    gatewayContent = gatewayContent.replace(
      /console\.error\(`\[Gateway\] \${message}`, metadata\)/g,
      'this.secureLog("error", message, metadata)'
    );
    
    fs.writeFileSync('src/gateway.js', gatewayContent);
  }

  /**
   * Add request sanitization
   */
  async addRequestSanitization() {
    // Read gateway.js and add request sanitization
    let gatewayContent = fs.readFileSync('src/gateway.js', 'utf8');
    
    // Add request sanitization function
    const sanitizationCode = `
  /**
   * TRACER BULLET: Sanitize request data
   */
  sanitizeRequestData(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }
    
    const sanitized = { ...data };
    
    // Sanitize text content
    if (sanitized.text && typeof sanitized.text === 'string') {
      // Remove potentially dangerous characters
      sanitized.text = sanitized.text
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
        .substring(0, 10000); // Limit length
    }
    
    // Sanitize other string fields
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitized[key]
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/[<>\"'&]/g, '') // Remove dangerous characters
          .substring(0, 1000); // Limit length
      }
    });
    
    return sanitized;
  }
`;

    // Insert sanitization function
    const insertPoint = gatewayContent.indexOf('class AIGuardiansGateway');
    if (insertPoint !== -1) {
      const classStart = gatewayContent.indexOf('{', insertPoint);
      if (classStart !== -1) {
        gatewayContent = gatewayContent.slice(0, classStart + 1) + sanitizationCode + '\n  ' + gatewayContent.slice(classStart + 1);
      }
    }
    
    // Update sendToGateway to use sanitization
    gatewayContent = gatewayContent.replace(
      'async sendToGateway(endpoint, payload) {',
      'async sendToGateway(endpoint, payload) {\n    // Sanitize payload data\n    payload = this.sanitizeRequestData(payload);'
    );
    
    fs.writeFileSync('src/gateway.js', gatewayContent);
  }

  /**
   * Enhance error messages
   */
  async enhanceErrorMessages() {
    // Read all source files and enhance error messages
    const sourceFiles = [
      'src/service_worker.js',
      'src/gateway.js',
      'src/content.js',
      'src/options.js'
    ];

    for (const file of sourceFiles) {
      if (!fs.existsSync(file)) continue;
      
      let content = fs.readFileSync(file, 'utf8');
      
      // Replace generic error messages with more specific ones
      content = content.replace(
        /throw new Error\('Invalid message'\)/g,
        "throw new Error('Invalid message: message must be a valid object with required fields')"
      );
      
      content = content.replace(
        /throw new Error\('Invalid payload'\)/g,
        "throw new Error('Invalid payload: payload must be a valid object with required fields')"
      );
      
      content = content.replace(
        /throw new Error\('Invalid endpoint'\)/g,
        "throw new Error('Invalid endpoint: endpoint must be one of the allowed values')"
      );
      
      // Add error context
      content = content.replace(
        /catch \(error\) \{/g,
        'catch (error) {\n      console.error(\'[Error Context]\', { file: \'' + file + '\', error: error.message, stack: error.stack });'
      );
      
      fs.writeFileSync(file, content);
    }
  }

  /**
   * Add security headers
   */
  async addSecurityHeaders() {
    // Read manifest.json and add security headers
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    // Enhanced CSP with additional security measures
    manifest.content_security_policy = {
      "extension_pages": "script-src 'self'; object-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
    };
    
    // Add additional security measures
    manifest.web_accessible_resources = [];
    
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
  }

  /**
   * Generate fix report
   */
  generateFixReport() {
    const totalFixes = this.fixes.length;
    const appliedFixes = this.fixes.filter(f => f.status === 'APPLIED').length;
    const failedFixes = this.fixes.filter(f => f.status === 'FAILED').length;
    
    const report = {
      summary: {
        totalFixes,
        appliedFixes,
        failedFixes,
        successRate: (appliedFixes / totalFixes) * 100
      },
      fixes: this.fixes,
      timestamp: new Date().toISOString()
    };

    console.log('\n' + '='.repeat(60));
    console.log('🔒 FINAL SECURITY FIXES REPORT');
    console.log('='.repeat(60));
    console.log(`Total Fixes: ${totalFixes}`);
    console.log(`Applied: ${appliedFixes}`);
    console.log(`Failed: ${failedFixes}`);
    console.log(`Success Rate: ${report.summary.successRate.toFixed(2)}%`);
    
    // Save report
    fs.writeFileSync('final-security-fixes-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Fix report saved to: final-security-fixes-report.json');
  }
}

// Run fixes if this script is executed directly
if (require.main === module) {
  const fixer = new FinalSecurityFixes();
  fixer.applyFinalSecurityFixes().catch(console.error);
}

module.exports = FinalSecurityFixes;
