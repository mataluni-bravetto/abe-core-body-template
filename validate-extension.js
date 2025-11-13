/**
 * Extension Validation Script
 * Checks for common issues that prevent Chrome extensions from loading
 */

const fs = require('fs');
const path = require('path');

const EXTENSION_ROOT = __dirname;
const errors = [];
const warnings = [];

console.log('🔍 Validating AiGuardian Chrome Extension...\n');

// Check manifest.json
function validateManifest() {
  console.log('📋 Checking manifest.json...');
  const manifestPath = path.join(EXTENSION_ROOT, 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    errors.push('manifest.json not found');
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Check required fields
    if (!manifest.name) errors.push('manifest.json: missing "name"');
    if (!manifest.version) errors.push('manifest.json: missing "version"');
    if (!manifest.manifest_version) errors.push('manifest.json: missing "manifest_version"');
    
    // Check service worker
    if (manifest.background?.service_worker) {
      const swPath = path.join(EXTENSION_ROOT, manifest.background.service_worker);
      if (!fs.existsSync(swPath)) {
        errors.push(`Service worker not found: ${manifest.background.service_worker}`);
      } else {
        console.log(`  ✅ Service worker found: ${manifest.background.service_worker}`);
      }
    }
    
    // Check popup
    if (manifest.action?.default_popup) {
      const popupPath = path.join(EXTENSION_ROOT, manifest.action.default_popup);
      if (!fs.existsSync(popupPath)) {
        errors.push(`Popup HTML not found: ${manifest.action.default_popup}`);
      } else {
        console.log(`  ✅ Popup HTML found: ${manifest.action.default_popup}`);
      }
    }
    
    // Check content scripts
    if (manifest.content_scripts) {
      manifest.content_scripts.forEach((cs, idx) => {
        if (cs.js) {
          cs.js.forEach(jsFile => {
            const jsPath = path.join(EXTENSION_ROOT, jsFile);
            if (!fs.existsSync(jsPath)) {
              errors.push(`Content script not found: ${jsFile}`);
            }
          });
        }
      });
    }
    
    // Check icons
    if (manifest.icons) {
      Object.values(manifest.icons).forEach(iconPath => {
        const fullPath = path.join(EXTENSION_ROOT, iconPath);
        if (!fs.existsSync(fullPath)) {
          warnings.push(`Icon not found: ${iconPath}`);
        }
      });
    }
    
    console.log('  ✅ manifest.json is valid');
  } catch (err) {
    errors.push(`manifest.json parse error: ${err.message}`);
  }
}

// Check service worker imports
function validateServiceWorker() {
  console.log('\n🔧 Checking service worker...');
  const swPath = path.join(EXTENSION_ROOT, 'src', 'service-worker.js');
  
  if (!fs.existsSync(swPath)) {
    errors.push('Service worker file not found');
    return;
  }
  
  const swContent = fs.readFileSync(swPath, 'utf8');
  const importMatches = swContent.matchAll(/importScripts\(['"]([^'"]+)['"]\)/g);
  
  for (const match of importMatches) {
    const importPath = match[1];
    const fullPath = path.join(EXTENSION_ROOT, importPath);
    
    if (!fs.existsSync(fullPath)) {
      errors.push(`Service worker import not found: ${importPath}`);
    } else {
      console.log(`  ✅ Import found: ${importPath}`);
    }
  }
}

// Check popup dependencies
function validatePopup() {
  console.log('\n🪟 Checking popup...');
  const popupPath = path.join(EXTENSION_ROOT, 'src', 'popup.html');
  
  if (!fs.existsSync(popupPath)) {
    errors.push('Popup HTML not found');
    return;
  }
  
  const popupContent = fs.readFileSync(popupPath, 'utf8');
  
  // Check CSS
  const cssMatches = popupContent.matchAll(/<link[^>]+href=['"]([^'"]+)['"]/g);
  for (const match of cssMatches) {
    const cssPath = match[1];
    const fullPath = path.join(EXTENSION_ROOT, 'src', cssPath);
    if (!fs.existsSync(fullPath) && !cssPath.startsWith('http')) {
      warnings.push(`Popup CSS not found: ${cssPath}`);
    }
  }
  
  // Check scripts
  const scriptMatches = popupContent.matchAll(/<script[^>]+src=['"]([^'"]+)['"]/g);
  for (const match of scriptMatches) {
    const scriptPath = match[1];
    const fullPath = path.join(EXTENSION_ROOT, 'src', scriptPath);
    if (!fs.existsSync(fullPath) && !scriptPath.startsWith('http')) {
      errors.push(`Popup script not found: ${scriptPath}`);
    } else {
      console.log(`  ✅ Script found: ${scriptPath}`);
    }
  }
}

// Check for common issues
function checkCommonIssues() {
  console.log('\n⚠️  Checking for common issues...');
  
  // Check if vendor/clerk.js exists (needed for auth)
  const clerkPath = path.join(EXTENSION_ROOT, 'src', 'vendor', 'clerk.js');
  if (!fs.existsSync(clerkPath)) {
    warnings.push('Clerk SDK not found. Run: npm run build:clerk');
  } else {
    console.log('  ✅ Clerk SDK found');
  }
  
  // Check for node_modules (should exist if dependencies installed)
  const nodeModulesPath = path.join(EXTENSION_ROOT, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    warnings.push('node_modules not found. Run: npm install');
  }
}

// Run all validations
validateManifest();
validateServiceWorker();
validatePopup();
checkCommonIssues();

// Print results
console.log('\n' + '='.repeat(50));
console.log('📊 Validation Results\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Extension structure is valid!');
  console.log('\n🚀 Ready to load in Chrome:');
  console.log('   1. Open chrome://extensions/');
  console.log('   2. Enable Developer mode');
  console.log('   3. Click "Load unpacked"');
  console.log('   4. Select this folder');
} else {
  if (errors.length > 0) {
    console.log('❌ ERRORS (must fix):');
    errors.forEach(err => console.log(`   • ${err}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (should fix):');
    warnings.forEach(warn => console.log(`   • ${warn}`));
  }
  
  console.log('\n💡 Fix issues above before loading extension');
}

console.log('\n' + '='.repeat(50));

process.exit(errors.length > 0 ? 1 : 0);

