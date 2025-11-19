#!/usr/bin/env node

/**
 * Console Log Replacement Script
 * 
 * Replaces console.log/error/warn/debug with Logger calls
 * 
 * USAGE:
 *   node scripts/replace-console-logs.js [--dry-run] [--backup]
 * 
 * OPTIONS:
 *   --dry-run    Show what would be changed without making changes
 *   --backup     Create backup files before modifying
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');
const DRY_RUN = process.argv.includes('--dry-run');
const CREATE_BACKUP = process.argv.includes('--backup') || !DRY_RUN;

// Mapping of console methods to Logger methods
const CONSOLE_TO_LOGGER = {
  'console.log': 'Logger.info',    // Default to info
  'console.error': 'Logger.error',
  'console.warn': 'Logger.warn',
  'console.debug': 'Logger.debug',
  'console.info': 'Logger.info'
};

// Patterns to detect debug vs info logs
const DEBUG_PATTERNS = [
  /\[DEBUG\]/i,
  /debug/i,
  /tracing/i,
  /trace/i,
  /verbose/i
];

const INFO_PATTERNS = [
  /\[INFO\]/i,
  /starting/i,
  /completed/i,
  /initialized/i,
  /attached/i,
  /found/i
];

/**
 * Determine if a console.log should be Logger.info or Logger.debug
 */
function determineLogLevel(message) {
  const msgStr = message.toLowerCase();
  
  // Check for debug patterns first
  if (DEBUG_PATTERNS.some(pattern => pattern.test(msgStr))) {
    return 'Logger.debug';
  }
  
  // Check for info patterns
  if (INFO_PATTERNS.some(pattern => pattern.test(msgStr))) {
    return 'Logger.info';
  }
  
  // Default to info
  return 'Logger.info';
}

/**
 * Parse console statement and convert to Logger call
 */
function convertConsoleToLogger(line) {
  // Match console.method(...) patterns
  // Handle: console.log("msg"), console.error("msg", err), console.warn("msg", data)
  
  // Pattern to match console.method( with balanced parentheses
  const consolePattern = /console\.(log|error|warn|debug|info)\s*\(/;
  
  if (!consolePattern.test(line)) {
    return null;
  }
  
  // Find the method
  const methodMatch = line.match(/console\.(log|error|warn|debug|info)/);
  if (!methodMatch) {
    return null;
  }
  
  const method = methodMatch[1];
  
  // Find the full call by matching balanced parentheses
  let parenCount = 0;
  let startIdx = line.indexOf('console.' + method);
  let callStart = line.indexOf('(', startIdx);
  let callEnd = -1;
  
  for (let i = callStart; i < line.length; i++) {
    if (line[i] === '(') parenCount++;
    if (line[i] === ')') parenCount--;
    if (parenCount === 0) {
      callEnd = i;
      break;
    }
  }
  
  if (callEnd === -1) {
    return null; // Unbalanced parentheses
  }
  
  // Extract the full call
  const fullCall = line.substring(startIdx, callEnd + 1);
  const argsPart = line.substring(callStart + 1, callEnd);
  
  // Determine Logger method
  let loggerMethod;
  if (method === 'log') {
    // Try to determine if it's info or debug based on message content
    const firstArgMatch = argsPart.match(/^(["'`])((?:(?!\1)[^\\]|\\.)*)\1/);
    if (firstArgMatch) {
      const message = firstArgMatch[2];
      loggerMethod = determineLogLevel(message);
    } else {
      loggerMethod = 'Logger.info';
    }
  } else {
    loggerMethod = CONSOLE_TO_LOGGER[`console.${method}`];
  }
  
  // Build replacement - preserve all arguments
  const replacement = fullCall.replace(`console.${method}(`, `${loggerMethod}(`);
  
  // Replace in the line
  return line.substring(0, startIdx) + replacement + line.substring(callEnd + 1);
}

/**
 * Process a single file
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const changes = [];
  
  const newLines = lines.map((line, index) => {
    // Skip if already using Logger
    if (line.includes('Logger.') && !line.includes('console.')) {
      return line;
    }
    
    // Skip vendor files (like clerk.js) and logging.js (it defines Logger)
    if (filePath.includes('vendor/') || filePath.includes('logging.js')) {
      return line;
    }
    
    // Check for console methods
    if (line.includes('console.log') || line.includes('console.error') || 
        line.includes('console.warn') || line.includes('console.debug') || 
        line.includes('console.info')) {
      const converted = convertConsoleToLogger(line);
      if (converted && converted !== line) {
        changes.push({
          line: index + 1,
          original: line.trim(),
          replacement: converted.trim()
        });
        return converted;
      }
    }
    
    return line;
  });
  
  return {
    hasChanges: changes.length > 0,
    changes: changes,
    newContent: newLines.join('\n')
  };
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning for console statements...\n');
  
  // Find all JS files in src/
  const files = [];
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        // Skip logging.js (it defines Logger) and vendor files
        if (!entry.name.includes('logging.js') && !fullPath.includes('vendor/')) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walkDir(SRC_DIR);
  
  console.log(`Found ${files.length} JavaScript files\n`);
  
  const results = [];
  let totalChanges = 0;
  
  for (const file of files) {
    const result = processFile(file);
    if (result.hasChanges) {
      results.push({
        file: path.relative(SRC_DIR, file),
        changes: result.changes
      });
      totalChanges += result.changes.length;
      
      if (!DRY_RUN) {
        // Create backup if requested
        if (CREATE_BACKUP) {
          const backupPath = file + '.backup';
          fs.copyFileSync(file, backupPath);
          console.log(`📦 Backup created: ${backupPath}`);
        }
        
        // Write new content
        fs.writeFileSync(file, result.newContent, 'utf8');
        console.log(`✅ Updated: ${path.relative(SRC_DIR, file)} (${result.changes.length} changes)`);
      }
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Files processed: ${files.length}`);
  console.log(`Files with changes: ${results.length}`);
  console.log(`Total changes: ${totalChanges}`);
  
  if (DRY_RUN) {
    console.log('\n⚠️  DRY RUN MODE - No files were modified');
    console.log('Run without --dry-run to apply changes\n');
    
    // Show sample changes
    if (results.length > 0) {
      console.log('\nSample changes:');
      const sample = results[0];
      console.log(`\nFile: ${sample.file}`);
      sample.changes.slice(0, 3).forEach(change => {
        console.log(`  Line ${change.line}:`);
        console.log(`    - ${change.original}`);
        console.log(`    + ${change.replacement}`);
      });
      if (sample.changes.length > 3) {
        console.log(`  ... and ${sample.changes.length - 3} more changes`);
      }
    }
  } else {
    console.log('\n✅ Changes applied successfully!');
    if (CREATE_BACKUP) {
      console.log('📦 Backup files created with .backup extension');
      console.log('   You can delete them after verifying changes\n');
    }
  }
  
  // List all files with changes
  if (results.length > 0) {
    console.log('\nFiles modified:');
    results.forEach(result => {
      console.log(`  - ${result.file}: ${result.changes.length} changes`);
    });
  }
}

// Run if executed directly
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { processFile, convertConsoleToLogger };

