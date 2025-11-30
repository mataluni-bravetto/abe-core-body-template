/**
 * Guardian CLI - BiasGuard Command Line Interface for Guardian Management
 * 
 * Pattern: GUARDIAN × CLI × INTERFACE × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (JØHN)
 * Guardians: AEYON (999 Hz) + META (777 Hz) + JØHN (530 Hz)
 * Product: BiasGuard
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 * 
 * Usage:
 *   guardian('status', 'AEYON')
 *   guardian('activate', 'JØHN')
 *   guardian('amplify', 'META', { factor: 2.5 })
 *   guardian('validate', 'ZERO')
 *   guardian('list', null, { filter: 'active', sortBy: 'frequency' })
 */

/**
 * Execute a guardian command
 * @param {string} action - Action: status, activate, amplify, validate, list
 * @param {string|null} name - Guardian name (required for all except list)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Command result
 */
async function guardian(action, name = null, options = {}) {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GUARDIAN_COMMAND',
      payload: {
        action,
        name,
        options,
      },
    });

    if (chrome.runtime.lastError) {
      throw new Error(chrome.runtime.lastError.message);
    }

    return response;
  } catch (error) {
    console.error('[GuardianCLI] Command failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Convenience methods for each action
 */
const GuardianCLI = {
  /**
   * Get guardian status
   */
  status: (name) => guardian('status', name),

  /**
   * Activate a guardian
   */
  activate: (name) => guardian('activate', name),

  /**
   * Amplify a guardian
   */
  amplify: (name, factor = 2.0) => guardian('amplify', name, { factor }),

  /**
   * Validate a guardian
   */
  validate: (name) => guardian('validate', name),

  /**
   * List all guardians
   */
  list: (options = {}) => guardian('list', null, options),

  /**
   * Execute raw command
   */
  execute: guardian,
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GuardianCLI;
}

// Export to global scope for browser use
if (typeof window !== 'undefined') {
  window.guardian = guardian;
  window.GuardianCLI = GuardianCLI;
}

// Also export for service worker context
if (typeof self !== 'undefined' && typeof chrome !== 'undefined') {
  self.guardian = guardian;
  self.GuardianCLI = GuardianCLI;
}

