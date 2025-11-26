/**
 * Validate ML Model Implementation
 * 
 * Quick validation script to ensure ML model components are working correctly.
 */

const fs = require('fs');
const path = require('path');
const DatadogLogger = require('./datadog-logger');

// Initialize Datadog Logger
const dd = new DatadogLogger(process.env.DD_API_KEY, {
  service: 'aiguardian-ml-validation',
  tags: ['component:validation', `env:${process.env.NODE_ENV || 'dev'}`]
});

console.log('🔍 Validating ML Model Implementation...\n');
dd.info('Starting ML model validation');

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, message) {
  checks.push({ name, condition, message });
  if (condition) {
    console.log(`✅ ${name}: ${message}`);
    dd.info(`Check passed: ${name}`, { message });
    passed++;
  } else {
    console.log(`❌ ${name}: ${message}`);
    dd.warn(`Check failed: ${name}`, { message });
    failed++;
  }
}

// Check 1: TensorFlow.js bundle exists
const tfjsPath = path.join(__dirname, '../src/vendor/tfjs.min.js');
check(
  'TensorFlow.js Bundle',
  fs.existsSync(tfjsPath),
  fs.existsSync(tfjsPath) 
    ? `Found at ${tfjsPath} (${(fs.statSync(tfjsPath).size / 1024 / 1024).toFixed(2)} MB)`
    : 'Not found - run: npm run build:tfjs'
);

// Check 2: Model files exist
const modelJsonPath = path.join(__dirname, '../src/models/bias-detection-model.json');
const modelWeightsPath = path.join(__dirname, '../src/models/bias-detection-model.weights.bin');
check(
  'Model JSON',
  fs.existsSync(modelJsonPath),
  fs.existsSync(modelJsonPath) ? 'Found' : 'Not found'
);
check(
  'Model Weights',
  fs.existsSync(modelWeightsPath),
  fs.existsSync(modelWeightsPath) ? 'Found (placeholder)' : 'Not found'
);

// Check 3: Support modules exist
const modules = [
  { name: 'TextPreprocessor', path: '../src/models/text-preprocessor.js' },
  { name: 'ModelLoader', path: '../src/models/model-loader.js' },
  { name: 'MLBiasDetection', path: '../src/onboard/ml-bias-detection.js' }
];

modules.forEach(module => {
  const modulePath = path.join(__dirname, module.path);
  check(
    module.name,
    fs.existsSync(modulePath),
    fs.existsSync(modulePath) ? 'Found' : 'Not found'
  );
});

// Check 4: Service worker imports
const serviceWorkerPath = path.join(__dirname, '../src/service-worker.js');
if (fs.existsSync(serviceWorkerPath)) {
  const swContent = fs.readFileSync(serviceWorkerPath, 'utf8');
  check(
    'Service Worker - TensorFlow.js Import',
    swContent.includes('vendor/tfjs.min.js'),
    'TensorFlow.js import found'
  );
  check(
    'Service Worker - ML Model Support',
    swContent.includes('models/text-preprocessor.js') && swContent.includes('models/model-loader.js'),
    'ML model support modules imported'
  );
  check(
    'Service Worker - MLBiasDetection',
    swContent.includes('MLBiasDetection'),
    'MLBiasDetection class used'
  );
}

// Check 5: Manifest includes model files
const manifestPath = path.join(__dirname, '../manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const resources = manifest.web_accessible_resources?.[0]?.resources || [];
  check(
    'Manifest - TensorFlow.js',
    resources.some(r => r.includes('tfjs.min.js')),
    'TensorFlow.js in web_accessible_resources'
  );
  check(
    'Manifest - Model Files',
    resources.some(r => r.includes('bias-detection-model')),
    'Model files in web_accessible_resources'
  );
}

// Check 6: Package.json dependencies
const packageJsonPath = path.join(__dirname, '../package.json');
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  check(
    'Package.json - TensorFlow.js',
    pkg.dependencies && pkg.dependencies['@tensorflow/tfjs'],
    pkg.dependencies && pkg.dependencies['@tensorflow/tfjs']
      ? `Version: ${pkg.dependencies['@tensorflow/tfjs']}`
      : 'Not found in dependencies'
  );
  check(
    'Package.json - Build Script',
    pkg.scripts && (pkg.scripts['build:tfjs'] || pkg.scripts.build?.includes('bundle-tfjs')),
    'Build script for TensorFlow.js found'
  );
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`📊 Validation Summary: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

dd.metric('ml.validation.checks_passed', passed);
dd.metric('ml.validation.checks_failed', failed);
dd.metric('ml.validation.success', failed === 0 ? 1 : 0);

if (failed === 0) {
  console.log('\n✅ All checks passed! ML model implementation is ready.');
  dd.info('Validation complete: Success');
  console.log('\n📝 Next Steps:');
  console.log('   1. Train the model on bias detection data');
  console.log('   2. Replace placeholder weights file with trained model');
  console.log('   3. Test the extension with real model');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review and fix the issues above.');
  dd.error('Validation complete: Failed', { passed, failed });
  process.exit(1);
}

