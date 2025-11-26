/**
 * Bundle TensorFlow.js for Service Worker
 * 
 * Creates a minified bundle of TensorFlow.js optimized for service worker use.
 * Uses esbuild to create a single file bundle.
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../src/vendor');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'tfjs.min.js');

async function bundleTensorFlowJS() {
  console.log('📦 Bundling TensorFlow.js for service worker...');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Find TensorFlow.js entry point in node_modules
    const tfjsPath = require.resolve('@tensorflow/tfjs');
    const tfjsDir = path.dirname(tfjsPath);

    // Bundle TensorFlow.js
    await esbuild.build({
      entryPoints: [tfjsPath],
      bundle: true,
      minify: true,
      format: 'iife',
      globalName: 'tf',
      outfile: OUTPUT_FILE,
      platform: 'browser',
      target: ['es2020'],
      sourcemap: false,
      treeShaking: true,
      // Exclude Node.js-specific modules
      external: ['fs', 'path', 'crypto', 'util', 'stream', 'buffer'],
      // Optimize for size
      minifyWhitespace: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      // Keep only essential operations
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });

    // Check file size
    const stats = fs.statSync(OUTPUT_FILE);
    const sizeKB = (stats.size / 1024).toFixed(2);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`✅ TensorFlow.js bundled successfully!`);
    console.log(`   Output: ${OUTPUT_FILE}`);
    console.log(`   Size: ${sizeKB} KB (${sizeMB} MB)`);

    if (stats.size > 2 * 1024 * 1024) {
      console.warn(`⚠️  Warning: Bundle size (${sizeMB} MB) exceeds 2MB target.`);
      console.warn(`   Consider using a lighter version or tree-shaking more aggressively.`);
    }

    return {
      success: true,
      outputFile: OUTPUT_FILE,
      size: stats.size,
      sizeKB: parseFloat(sizeKB),
      sizeMB: parseFloat(sizeMB)
    };
  } catch (error) {
    console.error('❌ Failed to bundle TensorFlow.js:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  bundleTensorFlowJS()
    .then(() => {
      console.log('✅ Bundle complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Bundle failed:', error);
      process.exit(1);
    });
}

module.exports = { bundleTensorFlowJS };

