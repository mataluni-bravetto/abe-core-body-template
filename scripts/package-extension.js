#!/usr/bin/env node

/**
 * Simple Extension Packaging Script
 *
 * Creates a zip file for Chrome Web Store deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ExtensionPackager {
  constructor() {
    this.projectRoot = process.cwd();
    this.version = this.getVersion();
  }

  getVersion() {
    try {
      const manifest = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, 'manifest.json'), 'utf8')
      );
      return manifest.version || '1.0.0';
    } catch (error) {
      return '1.0.0';
    }
  }

  package() {
    console.log('📦 Creating AiGuardian Chrome Extension Package');
    console.log('='.repeat(60));

    try {
      // Create dist directory
      const distDir = path.join(this.projectRoot, 'dist');
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      // Create zip file
      const zipPath = path.join(distDir, `aiguardian-v${this.version}.zip`);

      console.log('📦 Creating zip file...');

      // Simple zip command (requires zip utility)
      const zipCommand = `cd "${this.projectRoot}" && zip -r "${zipPath}" . -x "*.git*" "*node_modules*" "*dist*" "*temp*" "*.log" "*test*" "*coverage*" "*.DS_Store" "*Thumbs.db"`;

      execSync(zipCommand, { stdio: 'inherit' });

      // Get file size
      const stats = fs.statSync(zipPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log(`✅ Zip created: ${sizeMB} MB`);
      console.log(`📦 Package: ${zipPath}`);

      // Create package manifest
      this.createPackageManifest(zipPath);

      console.log('\n✅ Packaging complete!');
      console.log(`📦 Package: ${zipPath}`);

    } catch (error) {
      console.error('\n❌ Packaging failed:', error.message);
      throw error;
    }
  }

  createPackageManifest(zipPath) {
    const distDir = path.dirname(zipPath);
    const manifestPath = path.join(distDir, 'package-manifest.json');

    try {
      // Get list of files in zip
      const listCommand = `unzip -l "${zipPath}" | tail -n +4 | head -n -2 | awk '{print $4}'`;
      const fileList = execSync(listCommand, { encoding: 'utf8' })
        .split('\n')
        .filter(line => line.trim())
        .sort();

      const manifest = {
        name: 'AiGuardian Chrome Extension',
        version: this.version,
        packaged: new Date().toISOString(),
        files: fileList,
        size: fs.statSync(zipPath).size
      };

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(`📋 Manifest: ${manifestPath}`);

    } catch (error) {
      console.warn('⚠️  Could not create detailed manifest:', error.message);
    }
  }
}

// Run packaging
if (require.main === module) {
  const packager = new ExtensionPackager();
  packager.package();
}

module.exports = ExtensionPackager;