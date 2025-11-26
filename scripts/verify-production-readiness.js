/**
 * Production Readiness Verification Script
 * 
 * Checks if the extension is ready for production deployment (Embedded Mode v1.0.0).
 */

const fs = require('fs');
const path = require('path');

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log(`${YELLOW}🔍 Verifying Production Readiness (Embedded Mode)...${RESET}\n`);

let errors = [];
let warnings = [];

function check(name, condition, message) {
  if (condition) {
    console.log(`${GREEN}✅ ${name}${RESET}`);
  } else {
    console.log(`${RED}❌ ${name}: ${message}${RESET}`);
    errors.push(`${name}: ${message}`);
  }
}

function checkFile(filePath) {
  const exists = fs.existsSync(filePath);
  check(`File exists: ${filePath}`, exists, `Missing required file: ${filePath}`);
  return exists;
}

// 1. Check Feature Flags
try {
  const constantsPath = path.join(__dirname, '../src/constants.js');
  if (checkFile('src/constants.js')) {
    const content = fs.readFileSync(constantsPath, 'utf8');
    
    const embeddedFlag = content.includes('USE_EMBEDDED_MODEL: true');
    check('Feature Flag: USE_EMBEDDED_MODEL', embeddedFlag, 'Must be true for v1.0.0');
    
    const authFlag = content.includes('BACKEND_AUTH_ENABLED: true');
    check('Feature Flag: BACKEND_AUTH_ENABLED', authFlag, 'Must be true for production (Hybrid Mode)');
    
    const debugFlag = content.includes('DEBUG_MODE: false');
    check('Feature Flag: DEBUG_MODE', debugFlag, 'Must be false for production');
  }
} catch (err) {
  errors.push(`Error checking feature flags: ${err.message}`);
}

// 2. Check Submodule content
try {
  const modelPath = path.join(__dirname, '../models/models/bias-detection-model.json');
  checkFile('models/models/bias-detection-model.json');
  checkFile('models/models/bias-detection-model.weights.bin');
} catch (err) {
  errors.push(`Error checking model files: ${err.message}`);
}

// 3. Check Manifest
try {
  const manifestPath = path.join(__dirname, '../manifest.json');
  if (checkFile('manifest.json')) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    check('Manifest Version', manifest.version === '1.0.0', `Expected version 1.0.0, found ${manifest.version}`);
    
    // Check resources
    const resources = manifest.web_accessible_resources[0].resources;
    const hasModel = resources.includes('models/bias-detection-model.json');
    check('Manifest Resources', hasModel, 'Missing model path in web_accessible_resources');
  }
} catch (err) {
  errors.push(`Error checking manifest: ${err.message}`);
}

// 4. Check Clean Up
const oldFiles = [
  'src/models/bias-detection-model.json',
  'scripts/train-bias-model.js',
  'scripts/validate-ml-model.js'
];

oldFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '../', file));
  if (exists) {
    console.log(`${YELLOW}⚠️  Old file exists: ${file} (should be removed)${RESET}`);
    warnings.push(`Old file exists: ${file}`);
  } else {
    console.log(`${GREEN}✅ Cleaned up: ${file}${RESET}`);
  }
});

console.log('\n' + '='.repeat(50));
if (errors.length === 0) {
  console.log(`${GREEN}🎉 READY FOR PRODUCTION!${RESET}`);
  if (warnings.length > 0) {
    console.log(`${YELLOW}Warnings:${RESET}`);
    warnings.forEach(w => console.log(`  - ${w}`));
  }
  process.exit(0);
} else {
  console.log(`${RED}⛔ NOT READY. Found ${errors.length} errors:${RESET}`);
  errors.forEach(e => console.log(`  - ${e}`));
  process.exit(1);
}

