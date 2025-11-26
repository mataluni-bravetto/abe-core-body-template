/**
 * Enhanced ML-Based Bias Detection Engine
 *
 * Uses advanced pattern matching, contextual analysis, and graduated scoring
 * with optional ML model integration and comprehensive transparency
 *
 * Pattern: ENHANCED × BIAS × DETECTION × CONTEXTUAL × TRANSPARENT
 */

class MLBiasDetection {
  constructor(options = {}) {
    this.engine = null;
    this.regexDetector = null;
    this.initialized = false;
    this.initializationPromise = null;
    this.options = {
      modelPath: options.modelPath || 'models/bias-detection/enhanced-bias-detection.js',
      enableML: options.enableML !== false,
      fallbackToRegex: options.fallbackToRegex !== false,
      enableTransparency: options.enableTransparency !== false,
      maxLength: options.maxLength || 256
    };
  }

  /**
   * Initialize the enhanced bias detection system
   */
  async initialize() {
    if (this.initialized && this.engine) {
      return this.engine;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initializeInternal();

    try {
      this.engine = await this.initializationPromise;
      this.initialized = true;
      return this.engine;
    } catch (error) {
      this.initializationPromise = null;
      if (typeof Logger !== 'undefined') {
        Logger.error('[MLBiasDetection] Initialization failed:', error);
      }
      throw error;
    }
  }

  /**
   * Internal initialization logic
   */
  async _initializeInternal() {
    try {
      // Try to load enhanced bias detection engine
      if (this.options.enableML) {
        try {
          // Use globally available enhanced engine (loaded via importScripts in service worker)
          const globalDeps = typeof self !== 'undefined' ? self.AiGuardianBiasDetection : null;
          const EnhancedBiasDetectionEngine = globalDeps && globalDeps.EnhancedBiasDetectionEngine;

          if (EnhancedBiasDetectionEngine) {
            this.engine = new EnhancedBiasDetectionEngine(this.options);

            if (typeof Logger !== 'undefined') {
              Logger.info('[MLBiasDetection] Enhanced bias detection engine loaded successfully');
            }

            return this.engine;
          } else {
            if (typeof Logger !== 'undefined') {
              Logger.warn('[MLBiasDetection] EnhancedBiasDetectionEngine not available in global namespace');
            }
          }
        } catch (engineError) {
          if (typeof Logger !== 'undefined') {
            Logger.error('[MLBiasDetection] Enhanced engine failed to initialize:', engineError);
          }
        }
      }

      // Fallback: Try legacy ML model
      if (typeof tf !== 'undefined' && typeof ModelLoader !== 'undefined') {
        // Initialize legacy ML model as fallback
        this.modelLoader = new ModelLoader({
          modelPath: 'models/bias-detection-model.json',
          modelVersion: '1.0.0'
        });

        this.model = await this.modelLoader.loadModel();

        // Initialize preprocessor
        if (typeof TextPreprocessor !== 'undefined') {
          this.preprocessor = new TextPreprocessor({
            maxLength: this.options.maxLength
          });
        }

        if (typeof Logger !== 'undefined') {
          Logger.info('[MLBiasDetection] Legacy ML model loaded as fallback');
        }

        return this.model;
      }

      // Final fallback: regex-based detection
      if (this.options.fallbackToRegex && typeof OnboardBiasDetection !== 'undefined') {
        this.regexDetector = new OnboardBiasDetection();

        if (typeof Logger !== 'undefined') {
          Logger.info('[MLBiasDetection] Using regex-based detection as final fallback');
        }

        return this.regexDetector;
      }

      throw new Error('No bias detection system available');

    } catch (error) {
      if (typeof Logger !== 'undefined') {
        Logger.error('[MLBiasDetection] All initialization methods failed:', error);
      }
      throw error;
    }
  }

  /**
   * Validate input parameters
   * @private
   */
  _validateInput(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Invalid input: text must be a non-empty string');
    }
    if (text.length > 10000) {
      throw new Error('Input text too long: maximum 10000 characters allowed');
    }
  }

  /**
   * Try enhanced bias detection engine
   * @private
   */
  async _tryEnhancedEngine(text, metadata, startTime) {
    if (!this.engine || !this.engine.detectBias) {
      return null;
    }

    try {
      const result = await this.engine.detectBias(text, metadata);
      if (result.success && result.confidence >= 0.4) {
        return this._formatEnhancedResult(result, startTime);
      }
    } catch (error) {
      if (typeof Logger !== 'undefined') {
        Logger.warn('[MLBiasDetection] Enhanced engine failed:', error.message);
      }
    }
    return null;
  }

  /**
   * Try legacy ML model
   * @private
   */
  async _tryMLModel(text, metadata, startTime) {
    if (!this.model || !this.preprocessor) {
      return null;
    }

    try {
      const preprocessed = this.preprocessor.preprocess(text);
      const predictions = await this._runInference(preprocessed);
      return this._postprocessResults(predictions, text, preprocessed, startTime);
    } catch (error) {
      if (typeof Logger !== 'undefined') {
        Logger.warn('[MLBiasDetection] Legacy ML failed:', error.message);
      }
    }
    return null;
  }

  /**
   * Try regex-based fallback
   * @private
   */
  async _tryRegexFallback(text, metadata, startTime) {
    if (!this.options.fallbackToRegex || typeof OnboardBiasDetection === 'undefined') {
      return null;
    }

    try {
      if (typeof Logger !== 'undefined') {
        Logger.warn('[MLBiasDetection] Using regex-based detection as fallback');
      }
      const regexDetector = new OnboardBiasDetection();
      return regexDetector.detectBias(text, metadata);
    } catch (error) {
      if (typeof Logger !== 'undefined') {
        Logger.error('[MLBiasDetection] Regex fallback failed:', error);
      }
    }
    return null;
  }

  /**
   * Check if result is valid
   * @private
   */
  _isValidResult(result) {
    return result && typeof result === 'object' && result.success !== false;
  }

  /**
   * Log strategy failure
   * @private
   */
  _logStrategyFailure(error) {
    if (typeof Logger !== 'undefined') {
      Logger.debug('[MLBiasDetection] Strategy failed:', error.message);
    }
  }

  /**
   * Detect bias in text using enhanced engine
   * @param {string} text - Text to analyze
   * @param {Object} metadata - Analysis metadata (context, source, etc.)
   * @returns {Object} Bias detection result (matches OnboardBiasDetection format)
   */
  async detectBias(text, metadata = {}) {
    const startTime = performance.now();

    try {
      // Validate input
      this._validateInput(text);

      // Ensure system is initialized
      if (!this.initialized) {
        await this.initialize();
      }

      // Try detection strategies in order of preference
      const strategies = [
        () => this._tryEnhancedEngine(text, metadata, startTime),
        () => this._tryMLModel(text, metadata, startTime),
        () => this._tryRegexFallback(text, metadata, startTime)
      ];

      for (const strategy of strategies) {
        try {
          const result = await strategy();
          if (result && this._isValidResult(result)) {
            return result;
          }
        } catch (error) {
          this._logStrategyFailure(error);
        }
      }

      // Return empty result if all strategies fail
      return {
        success: false,
        bias_detected: false,
        bias_score: 0.0,
        bias_types: [],
        bias_details: {},
        mitigation_suggestions: ['Error in enhanced bias detection'],
        fairness_score: 0.5,
        confidence: 0.0,
        processing_time: performance.now() - startTime,
        error: 'All detection systems failed',
        source: 'enhanced-ml'
      };

    } catch (error) {
      return {
        success: false,
        bias_detected: false,
        bias_score: 0.0,
        bias_types: [],
        bias_details: {},
        mitigation_suggestions: ['Error in enhanced bias detection'],
        fairness_score: 0.5,
        confidence: 0.0,
        processing_time: performance.now() - startTime,
        error: error.message,
        source: 'enhanced-ml'
      };
    }
  }

  /**
   * Run model inference
   * @param {Object} preprocessed - Preprocessed text data
   * @returns {Promise<Object>} Model predictions
   */
  async _runInference(preprocessed) {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    // Convert tokens to tensor
    const inputTensor = tf.tensor2d([preprocessed.tokens], [1, preprocessed.tokens.length]);

    try {
      // Run prediction
      const prediction = this.model.predict(inputTensor);
      
      // Get prediction values
      const predictionData = await prediction.data();
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Model output format:
      // [bias_score, gender_bias, racial_bias, age_bias, socioeconomic_bias, ability_bias]
      // Or single bias_score if model is simpler
      return {
        bias_score: predictionData[0] || 0.0,
        category_scores: predictionData.length > 1 ? {
          gender_bias: predictionData[1] || 0.0,
          racial_bias: predictionData[2] || 0.0,
          age_bias: predictionData[3] || 0.0,
          socioeconomic_bias: predictionData[4] || 0.0,
          ability_bias: predictionData[5] || 0.0
        } : null
      };
    } catch (error) {
      inputTensor.dispose();
      throw error;
    }
  }

  /**
   * Postprocess model predictions to match expected format
   * @param {Object} predictions - Raw model predictions
   * @param {string} text - Original text
   * @param {Object} preprocessed - Preprocessed data
   * @param {number} startTime - Start time for processing
   * @returns {Object} Formatted result
   */
  _postprocessResults(predictions, text, preprocessed, startTime) {
    const biasScore = Math.max(0, Math.min(1, predictions.bias_score || 0.0));
    const biasDetected = biasScore > 0.05;

    // Determine bias types from category scores or overall score
    const biasTypes = [];
    const biasDetails = {};

    if (predictions.category_scores) {
      const threshold = 0.3;
      const categories = ['gender_bias', 'racial_bias', 'age_bias', 'socioeconomic_bias', 'ability_bias'];
      
      for (const category of categories) {
        const score = predictions.category_scores[category] || 0.0;
        if (score > threshold) {
          biasTypes.push(category);
          biasDetails[category] = score;
        }
      }
    } else {
      // If no category scores, use overall score to infer types
      if (biasScore > 0.3) {
        // Use feature extraction to determine likely bias types
        const features = preprocessed.features || {};
        if (features.demographicMentions) {
          const mentions = features.demographicMentions;
          if (mentions.gender > 0) biasTypes.push('gender_bias');
          if (mentions.race > 0) biasTypes.push('racial_bias');
          if (mentions.age > 0) biasTypes.push('age_bias');
          if (mentions.ability > 0) biasTypes.push('ability_bias');
          if (mentions.socioeconomic > 0) biasTypes.push('socioeconomic_bias');
        }
      }
    }

    // Calculate fairness score (inverse of bias score)
    const fairnessScore = Math.max(0, Math.min(1, 1.0 - biasScore * 0.8));

    // Generate mitigation suggestions
    const suggestions = this._generateMitigationSuggestions(biasTypes);

    // Calculate confidence based on model certainty
    const confidence = Math.min(0.99, Math.max(0.5, biasScore + 0.2));

    const processingTime = performance.now() - startTime;

    return {
      success: true,
      bias_detected: biasDetected,
      bias_score: biasScore,
      bias_types: biasTypes,
      bias_details: biasDetails,
      mitigation_suggestions: suggestions,
      fairness_score: fairnessScore,
      confidence: confidence,
      processing_time: processingTime,
      source: 'onboard-ml',
      transcendent: true,
      transparency: {
        model_version: '1.0.0',
        preprocessing_time: preprocessed.processingTime,
        inference_time: processingTime - preprocessed.processingTime,
        text_length: text.length,
        token_count: preprocessed.tokenCount,
        features: preprocessed.features
      }
    };
  }

  /**
   * Generate mitigation suggestions based on detected bias types
   */
  _generateMitigationSuggestions(biasTypes) {
    const suggestions = [];

    if (biasTypes.includes('gender_bias')) {
      suggestions.push('Use gender-neutral language (they/them instead of he/she)');
      suggestions.push('Include diverse gender examples');
    }

    if (biasTypes.includes('racial_bias')) {
      suggestions.push('Avoid racial stereotypes and generalizations');
      suggestions.push('Use inclusive language that respects all ethnicities');
    }

    if (biasTypes.includes('age_bias')) {
      suggestions.push('Avoid age-based assumptions or stereotypes');
      suggestions.push('Use inclusive language for all age groups');
    }

    if (biasTypes.includes('socioeconomic_bias')) {
      suggestions.push('Avoid assumptions about economic status');
      suggestions.push('Use inclusive language that doesn\'t assume privilege');
    }

    if (biasTypes.includes('ability_bias')) {
      suggestions.push('Use person-first language (person with disability)');
      suggestions.push('Avoid ableist language and assumptions');
    }

    if (suggestions.length === 0) {
      suggestions.push('Text appears to be relatively unbiased');
    }

    return suggestions;
  }

  /**
   * Create empty result for invalid input
   */
  _createEmptyResult(processingTime) {
    return {
      success: true,
      bias_detected: false,
      bias_score: 0.0,
      bias_types: [],
      bias_details: {},
      mitigation_suggestions: ['No text provided for analysis'],
      fairness_score: 1.0,
      confidence: 0.5,
      processing_time: processingTime,
      source: 'onboard-ml'
    };
  }

  /**
   * Format enhanced engine results to match expected API
   */
  _formatEnhancedResult(result, startTime) {
    const biasScore = result.bias_score;
    const biasDetected = biasScore > 0.05;

    // Create bias details from detected types
    const biasDetails = {};
    if (result.bias_types && result.bias_types.length > 0) {
      result.bias_types.forEach(type => {
        // Estimate category score based on overall score and type count
        biasDetails[type] = biasScore / result.bias_types.length;
      });
    }

    // Generate mitigation suggestions based on bias types
    const suggestions = this._generateMitigationSuggestions(result.bias_types);

    // Calculate fairness score (inverse of bias score)
    const fairnessScore = Math.max(0, Math.min(1, 1.0 - biasScore * 0.8));

    const processingTime = performance.now() - startTime;

    return {
      success: true,
      bias_detected: biasDetected,
      bias_score: biasScore,
      bias_types: result.bias_types || [],
      bias_details: biasDetails,
      mitigation_suggestions: suggestions,
      fairness_score: fairnessScore,
      confidence: result.confidence || 0.5,
      processing_time: processingTime,
      source: 'enhanced-ml',
      transcendent: true,
      context: result.context,
      evidence_type: result.evidence_type,
      pattern_matches: result.pattern_matches || 0,
      transparency: this.options.enableTransparency ? result.transparency : undefined
    };
  }

  /**
   * Generate mitigation suggestions based on detected bias types
   */
  _generateMitigationSuggestions(biasTypes) {
    const suggestions = [];

    if (!biasTypes || biasTypes.length === 0) {
      return ['Text appears to be relatively unbiased'];
    }

    if (biasTypes.includes('gender_bias')) {
      suggestions.push('Use gender-neutral language (they/them instead of he/she)');
      suggestions.push('Include diverse gender examples and perspectives');
    }

    if (biasTypes.includes('racial_bias')) {
      suggestions.push('Avoid racial stereotypes and generalizations');
      suggestions.push('Use inclusive language that respects all ethnicities');
      suggestions.push('Consider cultural context and avoid coded language');
    }

    if (biasTypes.includes('age_bias')) {
      suggestions.push('Avoid age-based assumptions or stereotypes');
      suggestions.push('Use inclusive language for all age groups and life stages');
    }

    if (biasTypes.includes('socioeconomic_bias')) {
      suggestions.push('Avoid assumptions about economic status or class');
      suggestions.push('Use inclusive language that doesn\'t assume privilege');
      suggestions.push('Consider diverse socioeconomic perspectives');
    }

    if (biasTypes.includes('ability_bias')) {
      suggestions.push('Use person-first language (person with disability)');
      suggestions.push('Avoid ableist language and assumptions');
      suggestions.push('Consider accessibility and diverse abilities');
    }

    if (biasTypes.includes('coded_bias')) {
      suggestions.push('Review language for potential coded or indirect bias');
      suggestions.push('Consider the broader context and implications');
    }

    return suggestions.length > 0 ? suggestions : ['Text appears to be relatively unbiased'];
  }

  /**
   * Check if system is ready
   */
  isReady() {
    return this.initialized && (this.engine !== null || this.model !== null || this.regexDetector !== null);
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      enhancedEngineReady: this.engine !== null,
      legacyModelReady: this.model !== null,
      regexFallbackReady: this.regexDetector !== null,
      transparencyEnabled: this.options.enableTransparency,
      mlEnabled: this.options.enableML
    };
  }
}

// Export for use in service worker
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MLBiasDetection;
}

