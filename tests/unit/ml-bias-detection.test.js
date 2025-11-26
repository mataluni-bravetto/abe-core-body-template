/**
 * Unit Tests for ML Bias Detection
 * 
 * Tests the MLBiasDetection class functionality including:
 * - Model loading
 * - Text preprocessing
 * - Inference
 * - Result formatting
 * - Error handling and fallbacks
 */

// Mock TensorFlow.js for testing
global.tf = {
  tensor2d: (data, shape) => ({
    data: () => Promise.resolve(new Float32Array(data.flat())),
    dispose: () => {},
    shape: shape
  }),
  loadLayersModel: async (url) => {
    // Mock model
    return {
      predict: (input) => {
        // Mock prediction - return random scores
        return {
          data: async () => {
            return new Float32Array([0.35, 0.4, 0.3, 0.2, 0.15, 0.25]);
          },
          dispose: () => {}
        };
      }
    };
  }
};

// Mock chrome.runtime for service worker context
global.chrome = {
  runtime: {
    getURL: (path) => `chrome-extension://test/${path}`
  },
  storage: {
    local: {
      get: (keys, callback) => callback({}),
      set: (data, callback) => callback(),
      remove: (keys, callback) => callback()
    }
  }
};

// Mock TextPreprocessor and ModelLoader
global.TextPreprocessor = require('../../src/models/text-preprocessor.js');
global.ModelLoader = require('../../src/models/model-loader.js');
global.OnboardBiasDetection = require('../../src/onboard/bias-detection.js');

const MLBiasDetection = require('../../src/onboard/ml-bias-detection.js');

describe('MLBiasDetection', () => {
  let detector;

  beforeEach(() => {
    detector = new MLBiasDetection({
      modelPath: 'models/bias-detection-model.json',
      fallbackToRegex: true
    });
  });

  describe('Initialization', () => {
    test('should create instance with default options', () => {
      expect(detector).toBeDefined();
      expect(detector.options.fallbackToRegex).toBe(true);
      expect(detector.preprocessor).toBeDefined();
    });

    test('should initialize model on first use', async () => {
      const model = await detector.initialize();
      expect(model).toBeDefined();
      expect(detector.isReady()).toBe(true);
    });

    test('should return cached model on subsequent calls', async () => {
      const model1 = await detector.initialize();
      const model2 = await detector.initialize();
      expect(model1).toBe(model2);
    });
  });

  describe('Text Preprocessing', () => {
    test('should preprocess text correctly', () => {
      const text = 'This is a test text with some content.';
      const preprocessed = detector.preprocessor.preprocess(text);
      
      expect(preprocessed).toBeDefined();
      expect(preprocessed.tokens).toBeDefined();
      expect(Array.isArray(preprocessed.tokens)).toBe(true);
      expect(preprocessed.tokens.length).toBe(512); // Padded to maxLength
      expect(preprocessed.features).toBeDefined();
      expect(preprocessed.features.wordCount).toBeGreaterThan(0);
    });

    test('should handle empty text', () => {
      expect(() => {
        detector.preprocessor.preprocess('');
      }).toThrow();
    });

    test('should extract demographic features', () => {
      const text = 'Men are better than women at technical tasks.';
      const preprocessed = detector.preprocessor.preprocess(text);
      
      expect(preprocessed.features.demographicMentions.gender).toBeGreaterThan(0);
      expect(preprocessed.features.biasPatternMatches).toBeGreaterThan(0);
    });
  });

  describe('Bias Detection', () => {
    test('should detect bias in text', async () => {
      const text = 'Men are better than women at programming.';
      const result = await detector.detectBias(text);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.bias_score).toBeGreaterThanOrEqual(0);
      expect(result.bias_score).toBeLessThanOrEqual(1);
      expect(Array.isArray(result.bias_types)).toBe(true);
      expect(result.source).toBe('onboard-ml');
    });

    test('should return empty result for empty text', async () => {
      const result = await detector.detectBias('');
      
      expect(result.success).toBe(true);
      expect(result.bias_score).toBe(0);
      expect(result.bias_types).toEqual([]);
    });

    test('should handle null/undefined text', async () => {
      const result1 = await detector.detectBias(null);
      const result2 = await detector.detectBias(undefined);
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    test('should return result in expected format', async () => {
      const text = 'Test text for bias detection.';
      const result = await detector.detectBias(text);
      
      // Check required fields
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('bias_score');
      expect(result).toHaveProperty('bias_types');
      expect(result).toHaveProperty('bias_details');
      expect(result).toHaveProperty('mitigation_suggestions');
      expect(result).toHaveProperty('fairness_score');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('processing_time');
      expect(result).toHaveProperty('source');
      
      // Check types
      expect(typeof result.bias_score).toBe('number');
      expect(Array.isArray(result.bias_types)).toBe(true);
      expect(Array.isArray(result.mitigation_suggestions)).toBe(true);
      expect(typeof result.processing_time).toBe('number');
    });
  });

  describe('Fallback Behavior', () => {
    test('should fallback to regex if ML model fails', async () => {
      // Create detector with ML disabled
      const detectorWithFallback = new MLBiasDetection({
        fallbackToRegex: true
      });
      
      // Mock model loading failure
      detectorWithFallback.initialize = async () => {
        throw new Error('Model load failed');
      };
      
      const text = 'Men are better than women.';
      const result = await detectorWithFallback.detectBias(text);
      
      // Should still return a result (from regex fallback)
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    test('should handle inference errors gracefully', async () => {
      // Mock model that throws on predict
      const mockModel = {
        predict: () => {
          throw new Error('Inference failed');
        }
      };
      
      detector.model = mockModel;
      detector.initialized = true;
      
      const text = 'Test text';
      const result = await detector.detectBias(text);
      
      // Should fallback or return error result
      expect(result).toBeDefined();
    });
  });

  describe('Performance', () => {
    test('should complete inference in reasonable time', async () => {
      const text = 'This is a test text for performance measurement.';
      const startTime = performance.now();
      
      await detector.detectBias(text);
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in under 1 second (500ms target)
      expect(duration).toBeLessThan(1000);
    });

    test('should handle long text efficiently', async () => {
      const longText = 'This is a very long text. '.repeat(100);
      const result = await detector.detectBias(longText);
      
      expect(result.success).toBe(true);
      expect(result.processing_time).toBeLessThan(2000);
    });
  });

  describe('Result Postprocessing', () => {
    test('should format predictions correctly', () => {
      const mockPredictions = {
        bias_score: 0.35,
        category_scores: {
          gender_bias: 0.4,
          racial_bias: 0.3,
          age_bias: 0.2,
          socioeconomic_bias: 0.15,
          ability_bias: 0.25
        }
      };
      
      const text = 'Test text';
      const preprocessed = detector.preprocessor.preprocess(text);
      const result = detector._postprocessResults(
        mockPredictions,
        text,
        preprocessed,
        performance.now()
      );
      
      expect(result.bias_score).toBe(0.35);
      expect(result.bias_types).toContain('gender_bias');
      expect(result.bias_types).toContain('racial_bias');
      expect(result.mitigation_suggestions.length).toBeGreaterThan(0);
    });

    test('should calculate fairness score correctly', () => {
      const mockPredictions = {
        bias_score: 0.5,
        category_scores: null
      };
      
      const text = 'Test';
      const preprocessed = detector.preprocessor.preprocess(text);
      const result = detector._postprocessResults(
        mockPredictions,
        text,
        preprocessed,
        performance.now()
      );
      
      // Fairness should be inverse of bias (approximately)
      expect(result.fairness_score).toBeLessThan(1.0);
      expect(result.fairness_score).toBeGreaterThan(0.0);
    });
  });

  describe('Status and Health Checks', () => {
    test('should report correct status', () => {
      const status = detector.getStatus();
      
      expect(status).toHaveProperty('initialized');
      expect(status).toHaveProperty('modelLoaded');
      expect(status).toHaveProperty('preprocessorReady');
      expect(status).toHaveProperty('modelLoaderReady');
    });

    test('should check if ready', () => {
      expect(detector.isReady()).toBe(false); // Not initialized yet
      
      // After initialization
      detector.initialized = true;
      detector.model = {};
      expect(detector.isReady()).toBe(true);
    });
  });
});

// Run tests if called directly
if (require.main === module) {
  console.log('Running MLBiasDetection unit tests...');
  // In a real test environment, this would use Jest or similar
  console.log('Tests should be run with: npm test');
}

