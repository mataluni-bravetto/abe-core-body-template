/**
 * AiGuardian SDK Test Runner
 *
 * Runs all SDK tests using Jest CLI
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if Jest is available
try {
  require.resolve('jest');
} catch (error) {
  console.error('❌ Jest not found. Installing...');
  try {
    execSync('npm install --save-dev jest jest-environment-node', { stdio: 'inherit' });
    console.log('✅ Jest installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Jest:', installError.message);
    process.exit(1);
  }
}

console.log('🚀 Running AiGuardian SDK Tests...\n');

// Run Jest with config file
try {
  execSync('npx jest --config=jest.config.js --verbose --passWithNoTests', {
    stdio: 'inherit',
    cwd: path.dirname(__dirname) // Go up one level to sdk directory
  });
  console.log('\n✅ All SDK tests passed!');
  process.exit(0);
} catch (error) {
  console.log('\n❌ Some SDK tests failed.');
  process.exit(1);
}
