#!/usr/bin/env node

/**
 * AiGuardian Chrome Extension - Packaging Script
 *
 * Automates Chrome Web Store package creation:
 * - Validates manifest and structure
 * - Excludes development files
 * - Creates versioned zip file
 * - Generates package manifest
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

class ExtensionPackager {
  constructor() {
    this.projectRoot = process.cwd();
    this.packageDir = path.join(this.projectRoot, 'dist');
    this.version = null;
  }

  /**
   * Package extension for Chrome Web Store
   */
  async package() {
    console.log('📦 Packaging AiGuardian Chrome Extension');
    console.log('='.repeat(60));

    try {
      // Read version from manifest
      const manifest = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, 'manifest.json'), 'utf8')
      );
      this.version = manifest.version;

      // Validate before packaging
      await this.validate();

      // Create dist directory
      if (!fs.existsSync(this.packageDir)) {
        fs.mkdirSync(this.packageDir, { recursive: true });
      }

      // Create zip file
      const zipPath = path.join(this.packageDir, `aiguardian-v${this.version}.zip`);
      await this.createZip(zipPath);

      // Generate package manifest
      await this.generateManifest();

      console.log('\n✅ Packaging complete!');
      console.log(`📦 Package: ${zipPath}`);
      console.log(`📋 Manifest: ${path.join(this.packageDir, 'package-manifest.json')}`);

      return { zipPath, version: this.version };
    } catch (error) {
      console.error('\n❌ Packaging failed:', error.message);
      throw error;
    }
  }

  /**
   * Validate extension before packaging
   */
  async validate() {
    console.log('\n🔍 Validating extension...');

    // Check manifest
    const manifestPath = path.join(this.projectRoot, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('manifest.json not found');
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    if (manifest.manifest_version !== 3) {
      throw new Error('Must be Manifest V3');
    }

    if (!manifest.name || !manifest.version) {
      throw new Error('Missing required manifest fields');
    }

    // Check required files
    const requiredFiles = [
      'src/service-worker.js',
      'src/content.js',
      'src/popup.html',
      'src/popup.js',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }

    // Check for sensitive data
    const srcDir = path.join(this.projectRoot, 'src');
    const files = this.getAllFiles(srcDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (
        content.match(/api_key\s*[:=]\s*['"][^'"]+['"]/i) &&
        !file.includes('example') &&
        !file.includes('test')
      ) {
        console.warn(`⚠️  Potential API key found in: ${file}`);
      }
    }

    console.log('✅ Validation passed');
  }

  /**
   * Create zip file
   */
  async createZip(zipPath) {
    console.log('\n📦 Creating zip file...');

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log(`✅ Zip created: ${sizeMB} MB`);
        resolve();
      });

      archive.on('error', reject);
      archive.pipe(output);

      // Include files
      archive.file('manifest.json', { name: 'manifest.json' });
      archive.directory('src/', 'src/');
      archive.directory('assets/', 'assets/');

      // Include specific files from root
      const rootFiles = ['README.md', 'LICENSE'];
      rootFiles.forEach((file) => {
        const filePath = path.join(this.projectRoot, file);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: file });
        }
      });

      // Exclude development files
      archive.glob('**/*', {
        ignore: [
          '**/node_modules/**',
          '**/.git/**',
          '**/tests/**',
          '**/scripts/**',
          '**/docs/**',
          '**/*.test.js',
          '**/*.spec.js',
          '**/.env*',
          '**/.DS_Store',
          '**/package-lock.json',
          '**/npm-debug.log*',
          '**/yarn-error.log*',
        ],
        cwd: this.projectRoot,
      });

      archive.finalize();
    });
  }

  /**
   * Generate package manifest
   */
  async generateManifest() {
    const manifest = {
      name: 'AiGuardian Chrome Extension',
      version: this.version,
      packaged: new Date().toISOString(),
      files: this.getIncludedFiles(),
      size: this.getPackageSize(),
    };

    const manifestPath = path.join(this.packageDir, 'package-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Package manifest generated');
  }

  /**
   * Get all files in directory recursively
   */
  getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.getAllFiles(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    });

    return fileList;
  }

  /**
   * Get included files list
   */
  getIncludedFiles() {
    const files = [];

    ['manifest.json', 'src', 'assets'].forEach((item) => {
      const itemPath = path.join(this.projectRoot, item);
      if (fs.existsSync(itemPath)) {
        if (fs.statSync(itemPath).isDirectory()) {
          files.push(...this.getAllFiles(itemPath).map((f) => path.relative(this.projectRoot, f)));
        } else {
          files.push(item);
        }
      }
    });

    return files;
  }

  /**
   * Get package size
   */
  getPackageSize() {
    const zipPath = path.join(this.packageDir, `aiguardian-v${this.version}.zip`);
    if (fs.existsSync(zipPath)) {
      return fs.statSync(zipPath).size;
    }
    return 0;
  }
}

// Run if called directly
if (require.main === module) {
  const packager = new ExtensionPackager();
  packager.package().catch(console.error);
}

module.exports = ExtensionPackager;
