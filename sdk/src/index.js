/**
 * AiGuardian Client SDK
 *
 * A comprehensive client-side SDK for AI-powered content analysis.
 * Provides unified interface for text analysis, bias detection, and content evaluation.
 *
 * @version 1.0.0
 * @author AiGuardian Team
 * @license MIT
 */

import { AiGuardianClient } from './client.js';
import { Logger } from './logging.js';
import { Tracer } from './tracer.js';
import { ConfigManager } from './config.js';

// Export main client
export default AiGuardianClient;
export { AiGuardianClient };

// Export core modules
export { Logger, Tracer, ConfigManager };

// Export types and constants
export * from './constants.js';

// Export utilities
export * from './utils.js';
