/**
 * Bundle Clerk SDK for Chrome Extension
 * 
 * Bundles @clerk/clerk-js into a single file that can be loaded in extension pages
 * This avoids CSP issues with external script loading in Manifest V3
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function bundleClerk() {
  console.log('📦 Bundling Clerk SDK...');

  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'src', 'vendor');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Check if Clerk SDK has a UMD build we can use directly
    const clerkDistPath = path.join(__dirname, '..', 'node_modules', '@clerk', 'clerk-js', 'dist');
    const umdPath = path.join(clerkDistPath, 'clerk.browser.js');
    const indexPath = path.join(clerkDistPath, 'index.js');
    
    // Try to use UMD build if available, otherwise bundle from index
    let entryPoint = indexPath;
    if (fs.existsSync(umdPath)) {
      entryPoint = umdPath;
      console.log('Using Clerk UMD build...');
    }

    // Bundle Clerk SDK
    await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      format: 'iife',
      globalName: 'Clerk',
      outfile: path.join(outputDir, 'clerk.js'),
      platform: 'browser',
      target: 'es2020',
      minify: false, // Keep readable for debugging
      sourcemap: false,
      external: [], // Bundle everything
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      // Ensure Clerk is exposed as window.Clerk
      banner: {
        js: '// Clerk SDK Bundle'
      },
      footer: {
        js: 'if (typeof Clerk !== "undefined" && typeof window !== "undefined") { window.Clerk = Clerk; }'
      }
    });

    console.log('✅ Clerk SDK bundled successfully to src/vendor/clerk.js');
    console.log(`📊 File size: ${(fs.statSync(path.join(outputDir, 'clerk.js')).size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('❌ Failed to bundle Clerk SDK:', error);
    process.exit(1);
  }
}

bundleClerk();

