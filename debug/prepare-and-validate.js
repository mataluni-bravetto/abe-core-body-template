/**
 * Prepare and Validate Debugger Environment
 * 
 * This script validates that the extension is ready to run the debugger
 * and provides instructions for running it in Chrome.
 */

const fs = require('fs');
const path = require('path');

class DebuggerValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      validation: {},
      ready: false,
      issues: [],
      instructions: []
    };
  }

  async validateAndPrepare() {
    console.log('🔍 Validating debugger environment...\n');
    
    await this.checkDebuggerFile();
    await this.checkManifest();
    await this.checkServiceWorker();
    await this.checkRequiredFiles();
    await this.generateInstructions();
    
    this.generateReport();
    return this.results;
  }

  async checkDebuggerFile() {
    console.log('📄 Checking debugger file...');
    const check = {
      name: 'Debugger File',
      status: 'unknown',
      issues: []
    };

    try {
      const debuggerPath = path.join(__dirname, 'chrome-extension-debugger.js');
      if (fs.existsSync(debuggerPath)) {
        const code = fs.readFileSync(debuggerPath, 'utf8');
        check.status = 'ok';
        check.details = {
          exists: true,
          size: fs.statSync(debuggerPath).size,
          hasClass: code.includes('class ChromeExtensionDebugger'),
          hasRunAllDiagnostics: code.includes('runAllDiagnostics')
        };
        console.log('  ✅ Debugger file ready');
      } else {
        check.status = 'error';
        check.issues.push('Debugger file not found');
        console.error('  ❌ Debugger file missing');
      }
    } catch (error) {
      check.status = 'error';
      check.issues.push(error.message);
      console.error('  ❌ Check failed:', error.message);
    }

    this.results.validation.debuggerFile = check;
  }

  async checkManifest() {
    console.log('📋 Checking manifest.json...');
    const check = {
      name: 'Manifest',
      status: 'unknown',
      issues: []
    };

    try {
      const manifestPath = path.join(__dirname, '../manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        if (manifest.background && manifest.background.service_worker) {
          check.status = 'ok';
          check.details = {
            hasServiceWorker: true,
            serviceWorkerPath: manifest.background.service_worker,
            version: manifest.version
          };
          console.log('  ✅ Manifest configured correctly');
        } else {
          check.status = 'error';
          check.issues.push('No service worker configured in manifest');
          console.error('  ❌ Service worker not configured');
        }
      } else {
        check.status = 'error';
        check.issues.push('manifest.json not found');
        console.error('  ❌ Manifest file missing');
      }
    } catch (error) {
      check.status = 'error';
      check.issues.push(error.message);
      console.error('  ❌ Check failed:', error.message);
    }

    this.results.validation.manifest = check;
  }

  async checkServiceWorker() {
    console.log('⚙️  Checking service worker...');
    const check = {
      name: 'Service Worker',
      status: 'unknown',
      issues: []
    };

    try {
      const swPath = path.join(__dirname, '../src/service-worker.js');
      if (fs.existsSync(swPath)) {
        const code = fs.readFileSync(swPath, 'utf8');
        check.status = 'ok';
        check.details = {
          exists: true,
          hasGateway: code.includes('gateway'),
          hasMessageHandler: code.includes('onMessage.addListener')
        };
        console.log('  ✅ Service worker ready');
      } else {
        check.status = 'error';
        check.issues.push('service-worker.js not found');
        console.error('  ❌ Service worker missing');
      }
    } catch (error) {
      check.status = 'error';
      check.issues.push(error.message);
      console.error('  ❌ Check failed:', error.message);
    }

    this.results.validation.serviceWorker = check;
  }

  async checkRequiredFiles() {
    console.log('📁 Checking required files...');
    const check = {
      name: 'Required Files',
      status: 'unknown',
      issues: [],
      missing: []
    };

    const requiredFiles = [
      { path: '../src/gateway.js', name: 'Gateway' },
      { path: '../src/auth.js', name: 'Auth' },
      { path: '../src/constants.js', name: 'Constants' },
      { path: '../src/logging.js', name: 'Logging' }
    ];

    requiredFiles.forEach(file => {
      const fullPath = path.join(__dirname, file.path);
      if (!fs.existsSync(fullPath)) {
        check.missing.push(file.name);
        check.issues.push(`${file.name} (${file.path}) not found`);
      }
    });

    if (check.missing.length === 0) {
      check.status = 'ok';
      console.log('  ✅ All required files present');
    } else {
      check.status = 'warning';
      console.log(`  ⚠️  Missing files: ${check.missing.join(', ')}`);
    }

    this.results.validation.requiredFiles = check;
  }

  async generateInstructions() {
    console.log('📖 Generating instructions...');
    
    const instructions = [
      {
        step: 1,
        title: 'Load Extension in Chrome',
        commands: [
          '1. Open Chrome browser',
          '2. Navigate to: chrome://extensions/',
          '3. Enable "Developer mode" (toggle in top-right)',
          '4. Click "Load unpacked"',
          '5. Select the directory: AiGuardian-Chrome-Ext-dev'
        ]
      },
      {
        step: 2,
        title: 'Open Service Worker Console',
        commands: [
          '1. In chrome://extensions/, find "AiGuardian" extension',
          '2. Click "Inspect views: service worker" (or "service worker" link)',
          '3. Chrome DevTools will open for the service worker'
        ]
      },
      {
        step: 3,
        title: 'Load and Run Debugger',
        commands: [
          'In the DevTools console, type:',
          '',
          'importScripts(\'debug/chrome-extension-debugger.js\');',
          '',
          'Then run:',
          '',
          'runDiagnostics();',
          '',
          'Or get results object:',
          '',
          'const results = await runDiagnostics();',
          'console.log(JSON.stringify(results, null, 2));'
        ]
      }
    ];

    this.results.instructions = instructions;
    console.log('  ✅ Instructions generated');
  }

  generateReport() {
    const validations = Object.values(this.results.validation);
    const errorCount = validations.filter(v => v.status === 'error').length;
    const warningCount = validations.filter(v => v.status === 'warning').length;
    const okCount = validations.filter(v => v.status === 'ok').length;

    this.results.ready = errorCount === 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 DEBUGGER VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');

    console.log('VALIDATION SUMMARY:');
    console.log(`  ✅ Passed: ${okCount}`);
    console.log(`  ⚠️  Warnings: ${warningCount}`);
    console.log(`  ❌ Failed: ${errorCount}`);
    console.log('');

    if (this.results.ready) {
      console.log('✅ Extension is ready to run debugger!\n');
    } else {
      console.log('❌ Extension has issues. Fix errors before running debugger.\n');
    }

    console.log('📋 DETAILED VALIDATION:');
    for (const [key, validation] of Object.entries(this.results.validation)) {
      const icon = validation.status === 'ok' ? '✅' : 
                   validation.status === 'warning' ? '⚠️' : '❌';
      console.log(`\n${icon} ${validation.name}: ${validation.status.toUpperCase()}`);
      
      if (validation.issues && validation.issues.length > 0) {
        validation.issues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🚀 HOW TO RUN DEBUGGER');
    console.log('='.repeat(60));
    console.log('');

    this.results.instructions.forEach(instruction => {
      console.log(`\n📌 Step ${instruction.step}: ${instruction.title}`);
      instruction.commands.forEach(cmd => {
        console.log(`   ${cmd}`);
      });
    });

    console.log('\n' + '='.repeat(60));
    console.log('💡 TIP: Copy the commands above into Chrome DevTools console');
    console.log('='.repeat(60) + '\n');

    // Save instructions to file
    const instructionsPath = path.join(__dirname, 'RUN_DEBUGGER_NOW.md');
    const instructionsContent = this.generateInstructionsMarkdown();
    fs.writeFileSync(instructionsPath, instructionsContent);
    console.log(`📄 Instructions saved to: ${instructionsPath}\n`);
  }

  generateInstructionsMarkdown() {
    let content = '# 🚀 Run Debugger - Quick Start Guide\n\n';
    content += `**Generated:** ${this.results.timestamp}\n\n`;
    
    if (this.results.ready) {
      content += '✅ **Extension is ready!** Follow the steps below.\n\n';
    } else {
      content += '⚠️ **Fix validation errors first**, then follow the steps below.\n\n';
    }

    content += '---\n\n';

    this.results.instructions.forEach(instruction => {
      content += `## Step ${instruction.step}: ${instruction.title}\n\n`;
      instruction.commands.forEach(cmd => {
        if (cmd.trim() === '') {
          content += '\n';
        } else if (cmd.startsWith('importScripts') || cmd.startsWith('const') || cmd.startsWith('runDiagnostics')) {
          content += '```javascript\n';
          content += `${cmd}\n`;
          content += '```\n\n';
        } else {
          content += `${cmd}\n\n`;
        }
      });
    });

    content += '---\n\n';
    content += '## Expected Output\n\n';
    content += 'When run successfully, you should see:\n\n';
    content += '```\n';
    content += '🔍 Chrome Extension Debugger - Running diagnostics...\n';
    content += '📦 Checking storage quota...\n';
    content += '  ✅ Storage check complete: OK\n';
    content += '🌐 Checking network connectivity...\n';
    content += '  ✅ Network check complete: OK\n';
    content += '...\n';
    content += '============================================================\n';
    content += '📊 DIAGNOSTIC REPORT\n';
    content += '============================================================\n';
    content += '```\n\n';

    return content;
  }
}

// Run if executed directly
if (require.main === module) {
  const validator = new DebuggerValidator();
  validator.validateAndPrepare().then(() => {
    process.exit(validator.results.ready ? 0 : 1);
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = DebuggerValidator;

