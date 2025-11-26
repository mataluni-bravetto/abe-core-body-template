/**
 * Sync Model Files Script
 *
 * Copies trained model files from models/ directory to src/models/
 * for extension integration. Run this after training a new model.
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'models', 'models');
const targetDir = path.join(__dirname, '..', 'src', 'models');

// Model files to sync
const modelFiles = [
  'bias-detection-model.json',
  'bias-detection-model.weights.bin',
  'text-preprocessor.js',
  'model-loader.js'
];

function syncModelFiles() {
  console.log('🔄 Syncing model files from models/ to src/models/...');

  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let syncedCount = 0;

  for (const file of modelFiles) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    try {
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✅ Copied ${file}`);
        syncedCount++;
      } else {
        console.log(`⚠️  Source file not found: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Failed to copy ${file}:`, error.message);
    }
  }

  console.log(`\n📊 Sync complete: ${syncedCount}/${modelFiles.length} files synced`);

  if (syncedCount === modelFiles.length) {
    console.log('🎉 Model files are ready for extension integration');
  } else {
    console.log('⚠️  Some files were not synced. Check for missing model files.');
  }
}

// Run if called directly
if (require.main === module) {
  syncModelFiles();
}

module.exports = { syncModelFiles };
