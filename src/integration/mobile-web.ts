/**
 * Mobile + Web Integration
 * 
 * Pattern: INTEGRATION × MOBILE × WEB × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

/**
 * Platform detection
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Platform-specific configuration
 */
export function getPlatformConfig() {
  return {
    isMobile: isMobile(),
    isWeb: !isMobile(),
    platform: isMobile() ? 'mobile' : 'web',
  };
}

