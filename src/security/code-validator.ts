/**
 * Code Validator - Code Change Validation
 * 
 * Pattern: SECURITY × CODE × VALIDATOR × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (ZERO) × 530 Hz (ALRAX)
 * Guardians: AEYON (999 Hz) + ZERO (530 Hz) + ALRAX (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  hash?: string;
}

/**
 * Calculate file hash for integrity checking
 */
export function calculateFileHash(filePath: string): string | null {
  try {
    if (!existsSync(filePath)) {
      return null;
    }
    const content = readFileSync(filePath, 'utf-8');
    return createHash('sha256').update(content).digest('hex');
  } catch {
    return null;
  }
}

/**
 * Validate package-lock.json integrity
 */
export function validatePackageLock(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!existsSync('package-lock.json')) {
    errors.push('package-lock.json not found');
    return { valid: false, errors, warnings };
  }

  try {
    const lockContent = readFileSync('package-lock.json', 'utf-8');
    const lockData = JSON.parse(lockContent);

    // Check for required fields
    if (!lockData.lockfileVersion) {
      warnings.push('package-lock.json missing lockfileVersion');
    }

    // Check for integrity hashes
    let hasIntegrity = false;
    if (lockData.packages) {
      for (const pkg of Object.values(lockData.packages) as Array<{ integrity?: string }>) {
        if (pkg.integrity) {
          hasIntegrity = true;
          break;
        }
      }
    }

    if (!hasIntegrity) {
      warnings.push('package-lock.json missing integrity hashes');
    }

    const hash = calculateFileHash('package-lock.json');

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      hash: hash || undefined,
    };
  } catch (error) {
    errors.push(`Failed to parse package-lock.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { valid: false, errors, warnings };
  }
}

/**
 * Validate critical configuration files
 */
export function validateCriticalFiles(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const criticalFiles = [
    'package.json',
    'tsconfig.json',
    'docs/PROJECT_RULES.md',
    'PROJECT_MOTHER_PROMPT.md',
  ];

  for (const file of criticalFiles) {
    if (!existsSync(file)) {
      errors.push(`Critical file missing: ${file}`);
    } else {
      const hash = calculateFileHash(file);
      if (!hash) {
        warnings.push(`Could not calculate hash for: ${file}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate code changes (basic checks)
 */
export function validateCodeChanges(filePath: string, content: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for dangerous patterns
  const dangerousPatterns = [
    { pattern: /eval\s*\(/, message: 'eval() usage detected' },
    { pattern: /Function\s*\(/, message: 'Function() constructor detected' },
    { pattern: /require\s*\(['"]fs['"]/, message: 'Direct fs require detected' },
    { pattern: /process\.env/, message: 'process.env usage (use AbëKEYs instead)' },
  ];

  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(content)) {
      warnings.push(`${message} in ${filePath}`);
    }
  }

  // Check for pattern header
  if (!content.includes('Pattern:') || !content.includes('∞ AbëONE ∞')) {
    warnings.push(`Missing pattern header in ${filePath}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate dependency integrity
 */
export function validateDependencyIntegrity(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const lockValidation = validatePackageLock();
  errors.push(...lockValidation.errors);
  warnings.push(...lockValidation.warnings);

  // Check if node_modules exists and is consistent
  if (!existsSync('node_modules')) {
    warnings.push('node_modules not found. Run: make install');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

