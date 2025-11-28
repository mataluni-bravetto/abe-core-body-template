/**
 * Validation Utilities Tests
 * 
 * Pattern: TEST × UNIT × VALIDATION × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 * Guardians: AEYON (999 Hz) + JØHN (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import { isValidEmail, isNonEmptyString, validateUserInput } from '../../../shared/utils/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('should validate non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('  hello  ')).toBe(true);
    });

    it('should reject empty strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
    });
  });

  describe('validateUserInput', () => {
    it('should validate correct user input', () => {
      const result = validateUserInput('John Doe', 'john@example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid name', () => {
      const result = validateUserInput('', 'john@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Name is required');
    });

    it('should reject invalid email', () => {
      const result = validateUserInput('John Doe', 'invalid-email');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });
  });
});

