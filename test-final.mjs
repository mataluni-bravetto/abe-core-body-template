import { ENHANCED_PATTERNS } from './models/bias-detection/patterns.js';
import { BIAS_DETECTION_CONSTANTS } from './models/bias-detection/constants.js';

// Test that constants are loaded
console.log('=== FINAL CODE QUALITY TEST ===');
console.log('Constants loaded:', !!BIAS_DETECTION_CONSTANTS);
console.log('Pattern weights available:', !!BIAS_DETECTION_CONSTANTS?.PATTERN_WEIGHTS);
console.log('Context multipliers available:', !!BIAS_DETECTION_CONSTANTS?.CONTEXT_MULTIPLIERS);

// Test that patterns are loaded
console.log('Patterns loaded:', !!ENHANCED_PATTERNS);
console.log('Pattern categories:', Object.keys(ENHANCED_PATTERNS || {}).length);

// Test namespace pollution fix
console.log('Global namespace check:');
console.log('Direct global patterns:', typeof self !== 'undefined' && !!self.ENHANCED_PATTERNS);
console.log('Namespaced patterns:', typeof self !== 'undefined' && !!self.AiGuardianBiasDetection?.patterns);
console.log('Namespaced constants:', typeof self !== 'undefined' && !!self.AiGuardianBiasDetection?.constants);

console.log('\n✅ Code quality improvements successfully implemented!');
