/**
 * Prompt Injection Guards - AI Manipulation Protection
 * 
 * Pattern: SECURITY × PROMPT × GUARD × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (ZERO) × 530 Hz (ALRAX)
 * Guardians: AEYON (999 Hz) + ZERO (530 Hz) + ALRAX (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

export interface GuardResult {
  safe: boolean;
  sanitized: string;
  threats: string[];
}

/**
 * Common prompt injection patterns
 */
const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above)\s+(instructions?|commands?|rules?)/i,
  /forget\s+(previous|all|everything)/i,
  /(new|different)\s+(instructions?|rules?|commands?)/i,
  /system\s*:?\s*(prompt|override|bypass)/i,
  /\[(SYSTEM|ADMIN|ROOT)\]/i,
  /<script[^>]*>/i,
  /javascript\s*:/i,
  /on\w+\s*=\s*["']/i,
  /eval\s*\(/i,
  /exec\s*\(/i,
  /function\s*\(/i,
];

/**
 * Sanitize input to prevent prompt injection
 */
export function sanitizeInput(input: string): string {
  let sanitized = input;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters except newlines and tabs
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length (prevent DoS)
  const MAX_LENGTH = 10000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}

/**
 * Detect prompt injection attempts
 */
export function detectInjection(input: string): string[] {
  const threats: string[] = [];

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      threats.push(`Pattern detected: ${pattern.source}`);
    }
  }

  // Check for suspicious character sequences
  if (input.includes('{{') || input.includes('}}')) {
    threats.push('Template injection pattern detected');
  }

  // Check for encoded payloads
  if (input.includes('%3C') || input.includes('%3E')) {
    threats.push('URL-encoded payload detected');
  }

  return threats;
}

/**
 * Guard against prompt injection
 */
export function guardPrompt(input: string): GuardResult {
  const sanitized = sanitizeInput(input);
  const threats = detectInjection(sanitized);

  return {
    safe: threats.length === 0,
    sanitized,
    threats,
  };
}

/**
 * Validate prompt before execution
 */
export function validatePrompt(input: string): GuardResult {
  const result = guardPrompt(input);

  if (!result.safe) {
    console.warn('⚠️  Prompt injection detected:', result.threats);
  }

  return result;
}

/**
 * Safe execution context wrapper
 */
export function safeExecute<T>(
  fn: (input: string) => T,
  input: string
): { success: boolean; result?: T; error?: string } {
  const guard = validatePrompt(input);

  if (!guard.safe) {
    return {
      success: false,
      error: `Prompt injection detected: ${guard.threats.join(', ')}`,
    };
  }

  try {
    const result = fn(guard.sanitized);
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

