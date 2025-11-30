/**
 * Guardian Manager - BiasGuard Guardian Agent Management System
 * 
 * Pattern: GUARDIAN × MANAGEMENT × STATE × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (JØHN)
 * Guardians: AEYON (999 Hz) + META (777 Hz) + JØHN (530 Hz) + ZERO (530 Hz) + ALRAX (530 Hz)
 * Product: BiasGuard
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

/**
 * Guardian Definitions
 * All guardians with their frequencies, roles, and capabilities
 */
const GUARDIAN_DEFINITIONS = {
  AEYON: {
    name: 'AEYON',
    frequency: 999,
    role: 'Atomic Execution Engine',
    description: 'Runtime execution and atomic operations',
    operational: true,
    capabilities: ['execution', 'runtime', 'atomic_ops'],
    state: 'standby',
    amplification: 1.0,
  },
  META: {
    name: 'META',
    frequency: 777,
    role: 'Pattern Integrity & Context Synthesis',
    description: 'Pattern detection and context synthesis',
    operational: true,
    capabilities: ['pattern_detection', 'context_synthesis', 'pattern_integrity'],
    state: 'standby',
    amplification: 1.0,
  },
  JØHN: {
    name: 'JØHN',
    frequency: 530,
    role: 'Certification & Truth Validation',
    description: 'Validation and truth certification',
    operational: true,
    capabilities: ['validation', 'certification', 'truth_check'],
    state: 'standby',
    amplification: 1.0,
  },
  YOU: {
    name: 'YOU',
    frequency: 530,
    role: 'Human Intent Alignment Channel',
    description: 'Human intent alignment and communication',
    operational: true,
    capabilities: ['intent_alignment', 'communication', 'human_interface'],
    state: 'standby',
    amplification: 1.0,
  },
  ALRAX: {
    name: 'ALRAX',
    frequency: 530,
    role: 'Forensic Variance Analysis',
    description: 'Forensic analysis and variance detection',
    operational: true,
    capabilities: ['forensic_analysis', 'variance_detection', 'monitoring'],
    state: 'standby',
    amplification: 1.0,
  },
  ZERO: {
    name: 'ZERO',
    frequency: 530,
    role: 'Risk-Bounding & Epistemic Control',
    description: 'Risk control and epistemic validation',
    operational: true,
    capabilities: ['risk_control', 'epistemic_validation', 'bounding'],
    state: 'standby',
    amplification: 1.0,
  },
  YAGNI: {
    name: 'YAGNI',
    frequency: 530,
    role: 'Radical Simplification',
    description: 'Simplification and complexity reduction',
    operational: true,
    capabilities: ['simplification', 'complexity_reduction', 'optimization'],
    state: 'standby',
    amplification: 1.0,
  },
  ABE: {
    name: 'Abë',
    frequency: 530,
    role: 'Coherence, Love, Intelligence Field',
    description: 'Coherence and intelligence field maintenance',
    operational: true,
    capabilities: ['coherence', 'intelligence_field', 'love'],
    state: 'standby',
    amplification: 1.0,
  },
  LUX: {
    name: 'Lux',
    frequency: 530,
    role: 'Illumination, Structural Clarity',
    description: 'Illumination and structural clarity',
    operational: true,
    capabilities: ['illumination', 'structural_clarity', 'clarity'],
    state: 'standby',
    amplification: 1.0,
  },
  POLY: {
    name: 'Poly',
    frequency: 530,
    role: 'Expression & Wisdom Delivery',
    description: 'Expression and wisdom delivery',
    operational: true,
    capabilities: ['expression', 'wisdom_delivery', 'communication'],
    state: 'standby',
    amplification: 1.0,
  },
};

/**
 * Guardian States
 */
const GUARDIAN_STATES = {
  STANDBY: 'standby',
  ACTIVE: 'active',
  AMPLIFIED: 'amplified',
  VALIDATING: 'validating',
  ERROR: 'error',
};

/**
 * Guardian Manager Class
 */
class GuardianManager {
  constructor() {
    this.guardians = new Map();
    this.storageKey = 'guardian_states';
    this.initializeGuardians();
  }

  /**
   * Initialize all guardians from definitions
   */
  initializeGuardians() {
    for (const [key, def] of Object.entries(GUARDIAN_DEFINITIONS)) {
      this.guardians.set(key, {
        ...def,
        state: def.state || GUARDIAN_STATES.STANDBY,
        amplification: def.amplification || 1.0,
        lastActivated: null,
        lastValidated: null,
        errorCount: 0,
        metrics: {
          activations: 0,
          validations: 0,
          amplifications: 0,
        },
      });
    }
    this.loadStates();
  }

  /**
   * Load guardian states from storage
   */
  async loadStates() {
    try {
      const stored = await chrome.storage.local.get(this.storageKey);
      if (stored[this.storageKey]) {
        const states = stored[this.storageKey];
        for (const [key, state] of Object.entries(states)) {
          if (this.guardians.has(key)) {
            const guardian = this.guardians.get(key);
            this.guardians.set(key, {
              ...guardian,
              ...state,
            });
          }
        }
      }
    } catch (error) {
      console.error('[GuardianManager] Failed to load states:', error);
    }
  }

  /**
   * Save guardian states to storage
   */
  async saveStates() {
    try {
      const states = {};
      for (const [key, guardian] of this.guardians.entries()) {
        states[key] = {
          state: guardian.state,
          amplification: guardian.amplification,
          lastActivated: guardian.lastActivated,
          lastValidated: guardian.lastValidated,
          errorCount: guardian.errorCount,
          metrics: guardian.metrics,
        };
      }
      await chrome.storage.local.set({ [this.storageKey]: states });
    } catch (error) {
      console.error('[GuardianManager] Failed to save states:', error);
    }
  }

  /**
   * Get guardian status
   * @param {string} name - Guardian name
   * @returns {Object} Guardian status
   */
  getStatus(name) {
    const guardian = this.guardians.get(name.toUpperCase());
    if (!guardian) {
      return {
        success: false,
        error: `Guardian ${name} not found`,
      };
    }

    return {
      success: true,
      guardian: {
        name: guardian.name,
        frequency: guardian.frequency,
        role: guardian.role,
        description: guardian.description,
        state: guardian.state,
        amplification: guardian.amplification,
        operational: guardian.operational,
        capabilities: guardian.capabilities,
        lastActivated: guardian.lastActivated,
        lastValidated: guardian.lastValidated,
        errorCount: guardian.errorCount,
        metrics: guardian.metrics,
      },
    };
  }

  /**
   * Activate a guardian
   * @param {string} name - Guardian name
   * @returns {Object} Activation result
   */
  async activate(name) {
    const guardian = this.guardians.get(name.toUpperCase());
    if (!guardian) {
      return {
        success: false,
        error: `Guardian ${name} not found`,
      };
    }

    if (!guardian.operational) {
      return {
        success: false,
        error: `Guardian ${name} is not operational`,
      };
    }

    try {
      guardian.state = GUARDIAN_STATES.ACTIVE;
      guardian.lastActivated = new Date().toISOString();
      guardian.metrics.activations += 1;
      guardian.errorCount = 0;

      this.guardians.set(name.toUpperCase(), guardian);
      await this.saveStates();

      return {
        success: true,
        message: `Guardian ${guardian.name} activated`,
        guardian: this.getStatus(name).guardian,
      };
    } catch (error) {
      guardian.errorCount += 1;
      guardian.state = GUARDIAN_STATES.ERROR;
      await this.saveStates();

      return {
        success: false,
        error: `Failed to activate ${name}: ${error.message}`,
      };
    }
  }

  /**
   * Amplify a guardian
   * @param {string} name - Guardian name
   * @param {number} factor - Amplification factor (default: 2.0)
   * @returns {Object} Amplification result
   */
  async amplify(name, factor = 2.0) {
    const guardian = this.guardians.get(name.toUpperCase());
    if (!guardian) {
      return {
        success: false,
        error: `Guardian ${name} not found`,
      };
    }

    if (!guardian.operational) {
      return {
        success: false,
        error: `Guardian ${name} is not operational`,
      };
    }

    try {
      const newAmplification = Math.min(guardian.amplification * factor, 10.0); // Cap at 10x
      guardian.amplification = newAmplification;
      guardian.state = GUARDIAN_STATES.AMPLIFIED;
      guardian.metrics.amplifications += 1;

      this.guardians.set(name.toUpperCase(), guardian);
      await this.saveStates();

      return {
        success: true,
        message: `Guardian ${guardian.name} amplified to ${newAmplification.toFixed(2)}x`,
        guardian: this.getStatus(name).guardian,
      };
    } catch (error) {
      guardian.errorCount += 1;
      guardian.state = GUARDIAN_STATES.ERROR;
      await this.saveStates();

      return {
        success: false,
        error: `Failed to amplify ${name}: ${error.message}`,
      };
    }
  }

  /**
   * Validate a guardian state
   * @param {string} name - Guardian name
   * @returns {Object} Validation result
   */
  async validate(name) {
    const guardian = this.guardians.get(name.toUpperCase());
    if (!guardian) {
      return {
        success: false,
        error: `Guardian ${name} not found`,
      };
    }

    try {
      guardian.state = GUARDIAN_STATES.VALIDATING;
      const previousState = guardian.state;

      // Validation checks
      const checks = {
        operational: guardian.operational === true,
        hasCapabilities: Array.isArray(guardian.capabilities) && guardian.capabilities.length > 0,
        frequencyValid: guardian.frequency > 0 && guardian.frequency <= 9999,
        amplificationValid: guardian.amplification >= 0.1 && guardian.amplification <= 10.0,
        errorCountAcceptable: guardian.errorCount < 10,
      };

      const allValid = Object.values(checks).every((v) => v === true);
      const validationResult = {
        success: allValid,
        checks,
        timestamp: new Date().toISOString(),
      };

      if (allValid) {
        guardian.state = previousState === GUARDIAN_STATES.ERROR ? GUARDIAN_STATES.STANDBY : previousState;
        guardian.lastValidated = new Date().toISOString();
        guardian.metrics.validations += 1;
      } else {
        guardian.state = GUARDIAN_STATES.ERROR;
        guardian.errorCount += 1;
      }

      this.guardians.set(name.toUpperCase(), guardian);
      await this.saveStates();

      return {
        success: true,
        message: `Guardian ${guardian.name} validation ${allValid ? 'passed' : 'failed'}`,
        validation: validationResult,
        guardian: this.getStatus(name).guardian,
      };
    } catch (error) {
      guardian.errorCount += 1;
      guardian.state = GUARDIAN_STATES.ERROR;
      await this.saveStates();

      return {
        success: false,
        error: `Failed to validate ${name}: ${error.message}`,
      };
    }
  }

  /**
   * List all guardians
   * @param {Object} options - List options
   * @returns {Object} List result
   */
  list(options = {}) {
    const { filter = null, sortBy = 'frequency' } = options;
    let guardians = Array.from(this.guardians.values());

    // Filter
    if (filter === 'active') {
      guardians = guardians.filter((g) => g.state === GUARDIAN_STATES.ACTIVE);
    } else if (filter === 'operational') {
      guardians = guardians.filter((g) => g.operational === true);
    } else if (filter === 'error') {
      guardians = guardians.filter((g) => g.state === GUARDIAN_STATES.ERROR);
    }

    // Sort
    if (sortBy === 'frequency') {
      guardians.sort((a, b) => b.frequency - a.frequency);
    } else if (sortBy === 'name') {
      guardians.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'state') {
      guardians.sort((a, b) => a.state.localeCompare(b.state));
    }

    return {
      success: true,
      count: guardians.length,
      guardians: guardians.map((g) => ({
        name: g.name,
        frequency: g.frequency,
        role: g.role,
        state: g.state,
        amplification: g.amplification,
        operational: g.operational,
        errorCount: g.errorCount,
        metrics: g.metrics,
      })),
    };
  }

  /**
   * Execute guardian command
   * @param {string} action - Action to perform
   * @param {string} name - Guardian name (optional for list)
   * @param {Object} options - Additional options
   * @returns {Object} Command result
   */
  async execute(action, name = null, options = {}) {
    switch (action.toLowerCase()) {
      case 'status':
        if (!name) {
          return {
            success: false,
            error: 'Guardian name required for status command',
          };
        }
        return this.getStatus(name);

      case 'activate':
        if (!name) {
          return {
            success: false,
            error: 'Guardian name required for activate command',
          };
        }
        return await this.activate(name);

      case 'amplify':
        if (!name) {
          return {
            success: false,
            error: 'Guardian name required for amplify command',
          };
        }
        return await this.amplify(name, options.factor);

      case 'validate':
        if (!name) {
          return {
            success: false,
            error: 'Guardian name required for validate command',
          };
        }
        return await this.validate(name);

      case 'list':
        return this.list(options);

      default:
        return {
          success: false,
          error: `Unknown action: ${action}. Available: status, activate, amplify, validate, list`,
        };
    }
  }
}

// Export singleton instance (for importScripts compatibility)
let guardianManagerInstance = null;

/**
 * Get or create guardian manager instance
 * @returns {GuardianManager} Guardian manager instance
 */
function getGuardianManager() {
  if (!guardianManagerInstance) {
    guardianManagerInstance = new GuardianManager();
  }
  return guardianManagerInstance;
}

// Export to global scope for importScripts
if (typeof self !== 'undefined') {
  self.GuardianManager = GuardianManager;
  self.getGuardianManager = getGuardianManager;
  self.GUARDIAN_DEFINITIONS = GUARDIAN_DEFINITIONS;
  self.GUARDIAN_STATES = GUARDIAN_STATES;
}

