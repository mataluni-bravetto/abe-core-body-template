/**
 * Shared Validation Utilities
 * 
 * Pattern: SHARED × UTILS × VALIDATION × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 * Guardians: AEYON (999 Hz) + JØHN (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate non-empty string
 */
export function isNonEmptyString(value: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate user input
 */
export function validateUserInput(name: string, email: string): { valid: boolean; error?: string } {
  if (!isNonEmptyString(name)) {
    return { valid: false, error: 'Name is required' };
  }
  
  if (!isValidEmail(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
}

