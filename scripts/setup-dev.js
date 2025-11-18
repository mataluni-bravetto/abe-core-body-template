#!/usr/bin/env node

/**
 * AiGuardian Chrome Extension - Development Setup Script
 * 
 * This script automates the development environment setup:
 * - Installs dependencies
 * - Validates environment
 * - Configures git hooks
 * - Verifies Chrome extension structure
 * - Sets up development tools
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DevSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.setupResults = [];
    this.errors = [];
  }

  /**
   * Run complete setup
   */
  async run() {
    console.log('🚀 AiGuardian Chrome Extension - Development Setup');
    console.log('='.repeat(60));
    
    const steps = [
      { name: 'Validate Node.js version', fn: this.validateNodeVersion },
      { name: 'Install dependencies', fn: this.installDependencies },
      { name: 'Create environment file', fn: this.createEnvFile },
      { name: 'Validate project structure', fn: this.validateStructure },
      { name: 'Setup git hooks', fn: this.setupGitHooks },
      { name: 'Build Clerk bundle', fn: this.buildClerk },
      { name: 'Run validation tests', fn: this.runValidationTests }
    ];

    for (const step of steps) {
      try {
        console.log(`\n📋 ${step.name}...`);
        const result = await step.fn.call(this);
        this.setupResults.push({ step: step.name, status: 'SUCCESS', result });
        console.log(`✅ ${step.name}: SUCCESS`);
      } catch (error) {
        this.setupResults.push({ step: step.name, status: 'FAILED', error: error.message });
        this.errors.push({ step: step.name, error: error.message });
        console.error(`❌ ${step.name}: FAILED - ${error.message}`);
      }
    }

    this.printSummary();
  }

  /**
   * Validate Node.js version
   */
  validateNodeVersion() {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      throw new Error(`Node.js 16+ required. Current: ${nodeVersion}`);
    }
    
    return { version: nodeVersion, majorVersion };
  }

  /**
   * Install dependencies
   */
  installDependencies() {
    console.log('   Installing npm dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: this.projectRoot });
    return { installed: true };
  }

  /**
   * Create .env file from .env.example if it doesn't exist
   */
  createEnvFile() {
    const envExample = path.join(this.projectRoot, '.env.example');
    const envFile = path.join(this.projectRoot, '.env');
    
    if (!fs.existsSync(envFile)) {
      if (fs.existsSync(envExample)) {
        fs.copyFileSync(envExample, envFile);
        console.log('   Created .env from .env.example');
        console.log('   ⚠️  Please update .env with your configuration');
        return { created: true, fromExample: true };
      } else {
        console.log('   ⚠️  .env.example not found, skipping .env creation');
        return { created: false, reason: 'no_example' };
      }
    } else {
      console.log('   .env already exists, skipping');
      return { created: false, reason: 'exists' };
    }
  }

  /**
   * Validate project structure
   */
  validateStructure() {
    const requiredFiles = [
      'manifest.json',
      'package.json',
      'src/service-worker.js',
      'src/content.js',
      'src/popup.html',
      'src/popup.js'
    ];

    const missing = [];
    const present = [];

    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        present.push(file);
      } else {
        missing.push(file);
      }
    }

    if (missing.length > 0) {
      throw new Error(`Missing required files: ${missing.join(', ')}`);
    }

    return { required: requiredFiles.length, present: present.length, missing: missing.length };
  }

  /**
   * Setup git hooks
   */
  setupGitHooks() {
    const gitDir = path.join(this.projectRoot, '.git');
    if (!fs.existsSync(gitDir)) {
      console.log('   ⚠️  Not a git repository, skipping git hooks');
      return { setup: false, reason: 'not_git_repo' };
    }

    const hooksDir = path.join(gitDir, 'hooks');
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Create pre-commit hook
    const preCommitHook = path.join(hooksDir, 'pre-commit');
    const preCommitContent = `#!/bin/sh
# AiGuardian Pre-commit Hook
echo "Running pre-commit checks..."

# Validate manifest.json
node -e "const m = require('./manifest.json'); if (m.manifest_version !== 3) { console.error('❌ Must be Manifest V3'); process.exit(1); }"

# Check for sensitive data
if grep -r "api_key\\|secret\\|password" src/ --include="*.js" | grep -v "example\\|test\\|mock"; then
  echo "❌ Potential sensitive data found"
  exit 1
fi

echo "✅ Pre-commit checks passed"
`;

    fs.writeFileSync(preCommitHook, preCommitContent);
    fs.chmodSync(preCommitHook, '755');

    return { setup: true, hooks: ['pre-commit'] };
  }

  /**
   * Build Clerk bundle
   */
  buildClerk() {
    try {
      execSync('npm run build:clerk', { stdio: 'inherit', cwd: this.projectRoot });
      return { built: true };
    } catch (error) {
      console.log('   ⚠️  Clerk build failed, but continuing...');
      return { built: false, error: error.message };
    }
  }

  /**
   * Run validation tests
   */
  runValidationTests() {
    try {
      // Run smoke tests if available
      execSync('npm run test:smoke', { stdio: 'inherit', cwd: this.projectRoot });
      return { tests: 'passed' };
    } catch (error) {
      console.log('   ⚠️  Validation tests failed, but setup continues...');
      return { tests: 'failed', error: error.message };
    }
  }

  /**
   * Print setup summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Setup Summary');
    console.log('='.repeat(60));

    const successful = this.setupResults.filter(r => r.status === 'SUCCESS').length;
    const failed = this.setupResults.filter(r => r.status === 'FAILED').length;

    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);

    if (this.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      this.errors.forEach(({ step, error }) => {
        console.log(`   - ${step}: ${error}`);
      });
    }

    console.log('\n📋 Next Steps:');
    console.log('1. Update .env with your configuration');
    console.log('2. Load extension in Chrome: chrome://extensions/');
    console.log('3. Enable "Developer mode"');
    console.log('4. Click "Load unpacked" and select this directory');
    console.log('5. Start developing!');

    if (failed === 0) {
      console.log('\n🎉 Setup complete! Ready for development.');
    } else {
      console.log('\n⚠️  Setup completed with errors. Please review above.');
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new DevSetup();
  setup.run().catch(console.error);
}

module.exports = DevSetup;

