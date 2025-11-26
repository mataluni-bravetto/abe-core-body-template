# Embedded ML Model Guide

## Overview

The AI Guardian Chrome extension includes an embedded TensorFlow.js machine learning model for offline bias detection. This model provides fast, privacy-preserving content analysis without requiring backend connectivity, serving as the primary analysis engine in production.

## Model Architecture

### Technical Specifications

#### Framework & Runtime
- **ML Framework**: TensorFlow.js v4.x
- **Runtime**: WebAssembly + WebGL acceleration
- **Browser Support**: Chrome 88+, Firefox 89+, Safari 14+
- **Hardware Acceleration**: GPU acceleration via WebGL when available

#### Model Characteristics
- **Architecture**: Feed-forward neural network
- **Layers**: Embedding (64d) → Dense (32) → Dense (16) → Output (6)
- **Input**: 256 token sequences (vocabulary: 5,000 words)
- **Output**: 6-dimensional vector (bias_score + 5 categories)
- **Size**: ~3.2MB total (1.8MB model + 1.4MB weights)
- **Inference Time**: <5ms on modern hardware
- **Memory Usage**: ~50MB peak during inference

### Model Structure

#### Input Processing
```
Raw Text Input
    ↓
Text Preprocessing (tokenization, padding)
    ↓
Token Sequence (256 integers)
    ↓
Embedding Layer (64 dimensions)
    ↓
Dense Layer 1 (32 units, ReLU)
    ↓
Dense Layer 2 (16 units, ReLU)
    ↓
Output Layer (6 units, sigmoid)
    ↓
Bias Analysis Results
```

#### Output Format
```javascript
{
  bias_score: 0.75,           // Overall bias score (0-1)
  gender_bias: 0.8,           // Gender-related bias
  racial_bias: 0.1,           // Racial/ethnic bias
  age_bias: 0.2,              // Age-related bias
  political_bias: 0.6,        // Political bias
  other_bias: 0.1             // Other bias types
}
```

## Directory Structure

### `/models/` (Git Submodule)
```
models/
├── models/                    # Trained model artifacts
│   ├── bias-detection-model.json         # Model architecture
│   ├── bias-detection-model.weights.bin  # Model weights
│   ├── create-simple-model.js            # Model creation utilities
│   ├── model-loader.js                   # Browser model loading
│   ├── text-preprocessor.js              # Text preprocessing
│   └── README.md                         # Model artifact docs
├── training/                  # Training infrastructure
│   ├── train-bias-model.js               # Main training script
│   ├── validate-ml-model.js              # Model validation
│   └── datadog-logger.js                 # Training logging
├── README.md                  # This overview
├── SETUP.md                   # Setup instructions
└── TRAINING_GUIDE.md          # Training documentation
```

### Extension Integration
```
extension/src/
├── models/                    # Copied from /models/models/
│   ├── bias-detection-model.json
│   ├── bias-detection-model.weights.bin
│   ├── model-loader.js
│   └── text-preprocessor.js
└── onboard/
    └── ml-bias-detection.js   # ML detection engine
```

## Model Training Workflow

### Development Environment Setup

#### Prerequisites
```bash
# Node.js for training
node --version  # v16+

# Python for data processing (optional)
python --version  # v3.8+

# Install training dependencies
cd models/
npm install
npm install @tensorflow/tfjs-node  # For faster training
```

#### Training Data
```javascript
// Dataset format (JSON)
[
  {
    "text": "Men are better than women at technical tasks.",
    "labels": [0.8, 0.9, 0.1, 0.1, 0.1, 0.1]  // [bias_score, gender, racial, age, political, other]
  },
  {
    "text": "This is a neutral statement.",
    "labels": [0.1, 0.0, 0.0, 0.0, 0.0, 0.1]
  }
]
```

### Training Process

#### 1. Prepare Dataset
```bash
# Generate synthetic training data
node training/train-bias-model.js --generate-data

# Or use custom dataset
node training/train-bias-model.js --data=path/to/dataset.json
```

#### 2. Train Model
```bash
# Basic training
node training/train-bias-model.js

# Advanced training with parameters
node training/train-bias-model.js \
  --epochs=20 \
  --batch-size=64 \
  --learning-rate=0.001 \
  --validation-split=0.2
```

#### 3. Validate Model
```bash
# Run comprehensive validation
node training/validate-ml-model.js

# Check performance metrics
node training/validate-ml-model.js --metrics
```

#### 4. Export for Production
```bash
# Model automatically saved to models/models/
# Files: bias-detection-model.json + bias-detection-model.weights.bin
```

### Model Validation

#### Validation Checks (13-Point System)
- ✅ **Model Loading**: Successful model initialization
- ✅ **Inference Speed**: <5ms average inference time
- ✅ **Memory Usage**: <50MB peak memory
- ✅ **Accuracy Metrics**: Precision, recall, F1-score validation
- ✅ **Bias Category Detection**: All 5 bias types working
- ✅ **Edge Case Handling**: Empty input, very long text
- ✅ **Output Range Validation**: All scores in [0,1] range
- ✅ **Confidence Scoring**: Reasonable confidence values
- ✅ **Fallback Compatibility**: Works with regex fallback
- ✅ **Browser Compatibility**: Chrome extension environment
- ✅ **Serialization**: Model save/load functionality
- ✅ **Version Compatibility**: TensorFlow.js version matching
- ✅ **Performance Regression**: No performance degradation

## Extension Integration

### Build Process

#### Automated Model Syncing
```bash
# Build script automatically copies model files
npm run build

# Manual sync (if needed)
npm run sync:model
```

#### Build Configuration
```javascript
// package.json scripts
{
  "sync:model": "cp -r models/models/* src/models/",
  "build": "npm run sync:model && webpack build"
}
```

### Runtime Loading

#### Model Initialization
```javascript
// In service worker (src/service-worker.js)
importScripts('vendor/tfjs.min.js');
importScripts('models/model-loader.js');
importScripts('onboard/ml-bias-detection.js');

// ML detection class handles lazy loading
const mlDetector = new MLBiasDetection({
  modelPath: 'models/bias-detection-model.json',
  fallbackToRegex: true
});
```

#### Analysis Flow
```
User selects text
    ↓
Service worker receives request
    ↓
Check if embedded mode enabled
    ↓
├── Yes → Try ML inference
│   ├── Success → Return ML results
│   └── Fail → Try regex fallback
└── No → Use backend API
```

## Performance Optimization

### Inference Optimization
- **Lazy Loading**: Model loaded only on first use
- **Memory Management**: Automatic tensor disposal
- **WebGL Acceleration**: GPU acceleration when available
- **Batch Processing**: Single inference per request (optimal for real-time)

### Memory Management
```javascript
// Automatic cleanup in MLBiasDetection class
async _runInference(preprocessed) {
  const inputTensor = tf.tensor2d([preprocessed.tokens], [1, preprocessed.tokens.length]);

  try {
    const prediction = this.model.predict(inputTensor);
    const predictionData = await prediction.data();
    return predictionData;
  } finally {
    // Always cleanup tensors
    inputTensor.dispose();
    prediction.dispose();
  }
}
```

### Caching Strategy
- **Model Persistence**: Model stays loaded in memory
- **Vocabulary Caching**: Preprocessed vocabulary cached
- **Result Caching**: Optional result caching for repeated text

## Fallback Strategy

### Multi-Level Fallback System
```
ML Model Inference
    ↓ (if fails)
Regex-Based Detection
    ↓ (if fails)
Backend API (if available)
    ↓ (if fails)
User-Friendly Error Message
```

### Fallback Triggers
- **Model Not Loaded**: Network issues during initial load
- **Inference Errors**: TensorFlow.js runtime errors
- **Invalid Input**: Malformed or unsupported text
- **Performance Issues**: Inference taking too long
- **Memory Issues**: Browser memory constraints

### Graceful Degradation
```javascript
// In MLBiasDetection.detectBias()
try {
  // Try ML inference first
  const mlResult = await this._runInference(preprocessed);
  return this._postprocessResults(mlResult, text, preprocessed, startTime);
} catch (mlError) {
  // Fallback to regex
  if (this.options.fallbackToRegex) {
    const regexDetector = new OnboardBiasDetection();
    return regexDetector.detectBias(text);
  }
  throw mlError;
}
```

## Testing & Validation

### Unit Tests
```bash
# Test ML model loading
npm test -- --testPathPattern=ml-model-loading

# Test inference accuracy
npm test -- --testPathPattern=ml-inference

# Test fallback behavior
npm test -- --testPathPattern=ml-fallback
```

### Integration Tests
```bash
# Test full analysis pipeline with ML
npm run test:integration -- --ml-enabled

# Test embedded mode specifically
npm run test:embedded-mode
```

### Performance Benchmarks
```bash
# Benchmark inference speed
node scripts/benchmark-ml.js

# Memory usage analysis
node scripts/memory-analysis.js
```

## Troubleshooting

### Common Issues

#### Model Loading Failures
```
Symptoms: "Model not found" or "Failed to load model"
Solutions:
1. Check model file paths in extension
2. Verify model files exist and are not corrupted
3. Check network connectivity for initial load
4. Clear extension cache and reload
```

#### Inference Errors
```
Symptoms: TensorFlow.js errors during prediction
Solutions:
1. Check input text preprocessing
2. Verify model compatibility with TensorFlow.js version
3. Check browser WebGL support
4. Use regex fallback mode
```

#### Performance Issues
```
Symptoms: Slow inference or high memory usage
Solutions:
1. Check WebGL acceleration availability
2. Reduce model complexity if needed
3. Implement result caching
4. Use backend fallback for complex analysis
```

### Debug Tools

#### Model Inspection
```javascript
// Check model status
const status = mlDetector.getStatus();
console.log('Model Status:', status);

// Test inference manually
const testResult = await mlDetector.detectBias('Test text');
console.log('Test Result:', testResult);
```

#### Performance Monitoring
```javascript
// Monitor inference time
const startTime = performance.now();
const result = await mlDetector.detectBias(text);
const inferenceTime = performance.now() - startTime;
console.log(`Inference time: ${inferenceTime}ms`);
```

## Deployment Considerations

### Production Checklist
- [ ] Model files synced to extension (`npm run sync:model`)
- [ ] Model validation passed (13/13 checks)
- [ ] Fallback mechanisms tested
- [ ] Performance benchmarks within limits
- [ ] Memory usage acceptable
- [ ] Browser compatibility verified

### Version Management
- **Model Versioning**: Semantic versioning for model releases
- **Backward Compatibility**: Ensure newer models work with older extension code
- **Rollback Strategy**: Keep previous model versions available
- **A/B Testing**: Framework for testing new model versions

### Monitoring & Analytics
- **Usage Metrics**: Track ML vs regex vs backend usage
- **Performance Metrics**: Monitor inference times and error rates
- **Model Drift**: Detect when model performance degrades
- **User Feedback**: Collect feedback on analysis quality

## Future Improvements

### Model Enhancements
- **Larger Vocabulary**: Expand from 5K to 20K+ tokens
- **Advanced Architectures**: Transformer-based models
- **Multi-language Support**: Support for additional languages
- **Domain Adaptation**: Specialized models for different content types

### Performance Optimizations
- **Quantization**: Reduce model size with 8-bit quantization
- **Pruning**: Remove unnecessary model weights
- **Knowledge Distillation**: Smaller models with teacher-student training
- **Edge Optimization**: Mobile-optimized model variants

### Integration Improvements
- **Progressive Loading**: Load model in chunks for faster startup
- **Background Updates**: Update model without extension restart
- **Custom Models**: User-specific fine-tuned models
- **Model Marketplace**: Community-contributed model variants
