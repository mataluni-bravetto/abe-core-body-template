# Production Deployment Guide (v2.0.0)

## Overview

AI Guardian v2.0.0 implements an **enhanced hybrid dual-mode architecture** with comprehensive testing and edge case robustness:

### Primary Mode: Enhanced Embedded ML Analysis (v2.0.0)
- **Enhanced TensorFlow.js model** with edge case robustness and quality filtering
- **No backend dependency** for core functionality with comprehensive fallback
- **0.7-0.8ms inference time** on modern hardware with stable memory usage
- **3.2MB model size** with advanced preprocessing and post-processing pipelines

### Fallback Mode: Backend API Analysis
- **AWS-hosted advanced analysis** when embedded model unavailable/fails
- **Clerk authentication** for premium features
- **Stripe subscription** validation
- **Comprehensive guard services** (BiasGuard, TrustGuard, ContextGuard)

### Enhanced Intelligent Fallback Strategy (v2.0.0)
```
User selects text → Try Enhanced ML Model (Edge case robust)
                     ↓ (if fails)
         Try Advanced Pattern Detection (100+ patterns)
                     ↓ (if fails)
           Try Backend API (Comprehensive)
                     ↓ (if fails)
        Show User-Friendly Error with Quality Validation
```

## Feature Flag Configuration

### Production Configuration (Recommended)
```javascript
// src/constants.js - FEATURE_FLAGS
const FEATURE_FLAGS = {
  USE_EMBEDDED_MODEL: true,      // ✅ PRIMARY: Local ML analysis
  BACKEND_AUTH_ENABLED: true,    // ✅ FALLBACK: Enable backend when needed
  SUBSCRIPTION_REQUIRED: true,   // ✅ MONETIZATION: Require active subscription
  DEBUG_MODE: false              // ❌ PRODUCTION: Must be false
};
```

### Alternative Configurations

#### Offline-Only Mode (Cost Saving)
```javascript
const FEATURE_FLAGS = {
  USE_EMBEDDED_MODEL: true,      // ✅ Local analysis only
  BACKEND_AUTH_ENABLED: false,   // ❌ Disable backend completely
  SUBSCRIPTION_REQUIRED: false,  // ❌ No subscription required
  DEBUG_MODE: false
};
```

#### Backend-Only Mode (Advanced Features)
```javascript
const FEATURE_FLAGS = {
  USE_EMBEDDED_MODEL: false,     // ❌ Disable local model
  BACKEND_AUTH_ENABLED: true,    // ✅ Require backend access
  SUBSCRIPTION_REQUIRED: true,   // ✅ Premium features only
  DEBUG_MODE: false
};
```

## Decision Matrix: Mode Selection

| Criteria | Embedded Primary | Offline-Only | Backend-Only | Recommendation |
|----------|------------------|--------------|--------------|----------------|
| **Cost** | Low (no API calls) | Lowest (no backend) | High (API calls) | Embedded Primary |
| **Speed** | Fastest (0.7-0.8ms) | Fastest (0.7-0.8ms) | Slower (200-500ms) | Embedded Primary |
| **Reliability** | High (fallback chain) | High (no network) | Medium (network dependent) | Embedded Primary |
| **Features** | Core analysis | Core analysis | All features | Embedded Primary |
| **Offline Support** | ✅ Full | ✅ Full | ❌ None | Embedded Primary |
| **Accuracy** | Good (ML model) | Good (ML model) | Best (advanced) | Backend-Only for premium |
| **Setup Complexity** | Medium (model sync) | Medium (model sync) | High (auth + backend) | Embedded Primary |

## Build Process

### Enhanced Production Build (v2.0.0)
```bash
# 1. Install dependencies for main repo and models
npm ci
cd models/
npm ci
cd ..

# 2. Run comprehensive testing framework
cd models/
node run-all-tests.js all
cd ..

# 3. Sync enhanced ML model to extension
npm run sync:model

# 4. Build and package with production verification
npm run build
npm run package

# 5. Final production readiness check
node scripts/verify-production-readiness.js
```

### Output Artifacts
- **Extension ZIP**: `dist/aiguardian-v2.0.0.zip`
- **Enhanced ML Model**: Embedded in extension with edge case robustness
- **Configuration**: Production feature flags with comprehensive testing validation

## Authentication & Subscription Setup

### Clerk Authentication (Backend Mode)
1. **Environment Variables**:
   ```bash
   export CLERK_PUBLISHABLE_KEY="pk_test_..."
   export CLERK_SECRET_KEY="sk_test_..."
   ```

2. **Configuration in Extension**:
   - Update `DEFAULT_CONFIG.CLERK_KEY` in `src/constants.js`
   - Verify Clerk domains in manifest permissions

### Stripe Subscription (Monetization)
1. **Webhook Configuration**:
   - Set up Stripe webhooks for subscription events
   - Configure endpoint: `https://api.aiguardian.ai/webhooks/stripe`

2. **Price IDs**:
   - Configure subscription plans in `src/constants.js`
   - Set up Stripe customer portal integration

## Verification Steps

### Pre-Deployment Checklist

#### 1. Feature Flag Verification
```bash
# Check production configuration
grep "FEATURE_FLAGS" src/constants.js
# Verify: USE_EMBEDDED_MODEL: true, DEBUG_MODE: false
```

#### 2. Enhanced ML Model Integration (v2.0.0)
```bash
# Run comprehensive model testing
cd models/
node run-all-tests.js all

# Verify enhanced model files exist
ls -la src/models/
# Should contain: enhanced bias detection files with edge case handling

# Verify model loading with quality validation
# Look for: "[EnhancedBiasDetection] Model loaded successfully with edge case robustness"
```

#### 3. Offline Functionality Test
- **Disconnect internet**
- **Load extension in Chrome**
- **Select text and analyze**
- **Verify analysis completes without network calls**

#### 4. Backend Fallback Test
- **Reconnect internet**
- **Sign in with Clerk account**
- **Verify backend analysis works**
- **Test subscription validation**

#### 5. Security Audit
```bash
npm run test:security
# Should show: Security Score: 100.00%
```

#### 6. Enhanced Performance Verification (v2.0.0)
```bash
# Run comprehensive testing suite
cd models/
node run-all-tests.js all

# Verify enhanced performance metrics
# ML inference: 0.7-0.8ms average
# Edge cases: 23 scenarios validated
# Memory usage: Stable across 100+ iterations
# Regression tests: 30/30 passing (100% success rate)
```

## Performance Monitoring

### Enhanced Key Metrics to Monitor (v2.0.0)
- **Enhanced ML Inference Time**: Target 0.7-0.8ms average
- **Edge Case Success Rate**: 23/23 scenarios validated
- **Fallback Usage**: Track enhanced embedded vs backend usage
- **Error Rates**: Monitor analysis failure rates with quality filtering
- **Memory Usage**: Stable usage with no leaks (<50MB peak)
- **Network Latency**: Backend response times (fallback mode)
- **Test Success Rate**: 100% regression test coverage maintained

### Logging Configuration
```javascript
// Production logging (src/constants.js)
LOGGING_CONFIG: {
  level: 'warn',                    // Reduced logging in production
  enable_central_logging: true,     // Send logs to backend
  enable_local_logging: false       // Disable verbose local logs
}
```

## Deployment Checklist

### Enhanced Pre-Launch Checklist (v2.0.0)
- [ ] Feature flags configured for enhanced embedded mode
- [ ] Enhanced ML model synced with edge case robustness verified
- [ ] Comprehensive testing framework executed (100% pass rate)
- [ ] Authentication credentials configured
- [ ] Subscription system tested
- [ ] Security audit passed with enhanced edge case handling
- [ ] All regression tests passing (30/30 tests)
- [ ] Edge case validation completed (23 scenarios)
- [ ] Integration tests passing with quality filtering
- [ ] Offline functionality verified with enhanced processing
- [ ] Backend fallback tested with improved error handling

### Chrome Web Store Submission (v2.0.0)
- [ ] Enhanced ZIP file created with comprehensive testing validation
- [ ] Manifest v3 compliance verified with updated permissions
- [ ] Privacy policy updated for enhanced offline processing
- [ ] Screenshots and descriptions updated for v2.0.0 features
- [ ] Support contact information configured
- [ ] Production readiness verification completed

### Post-Launch Monitoring
- [ ] User adoption metrics set up
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Customer support channels ready

## Artifacts

### Core Components
- **Source Code**: `src/` (Chrome extension)
- **Enhanced ML Model**: `models/` (TensorFlow.js model with edge case handling)
- **SDK**: `sdk/` (Standalone client library)
- **Build Output**: `dist/aiguardian-v2.0.0.zip`

### File Structure (v2.0.0)
```
aiguardian-v2.0.0.zip/
├── manifest.json              # Extension manifest (v3)
├── src/
│   ├── service-worker.js     # Enhanced background processing
│   ├── content.js            # Page interaction with edge case handling
│   ├── popup.html/js         # User interface
│   ├── gateway.js            # Backend communication
│   └── models/               # Enhanced ML model with comprehensive testing
│       ├── bias-detection/   # Core detection engine
│       ├── enhanced-bias-detection.js
│       ├── model.json        # ML topology (3.2MB)
│       └── model.weights.bin # Trained weights
├── assets/                   # Icons, logos, branding
└── docs/                     # Comprehensive documentation
```

## Troubleshooting

### Common Deployment Issues

#### ML Model Not Loading
```
Symptoms: Extension shows "Analysis failed"
Solution:
1. Verify model files exist in src/models/
2. Check console for TensorFlow.js errors
3. Ensure model files are not corrupted
4. Test with npm run sync:model
```

#### Authentication Failures
```
Symptoms: Backend requests failing with 401
Solution:
1. Verify Clerk keys are configured
2. Check manifest permissions for Clerk domains
3. Test token refresh functionality
4. Verify backend API connectivity
```

#### Performance Issues
```
Symptoms: Slow analysis or high memory usage
Solution:
1. Verify WebGL acceleration available
2. Check browser compatibility (Chrome 88+)
3. Monitor memory usage in DevTools
4. Consider fallback to regex-only mode
```

## Future Roadmap

### v2.0.0 ✅ (Completed)
- **Enhanced ML Models**: Advanced bias detection with edge case robustness
- **Comprehensive Testing**: 100% regression test coverage (30/30 tests)
- **Edge Case Handling**: 23 validated scenarios with robust processing
- **Performance Optimization**: 0.7-0.8ms inference with stable memory usage
- **Quality Assurance**: Automated validation with production readiness checks

### v2.1.0+ Enhancements
- **Multi-language Support**: Expand beyond English content
- **Advanced Backend Features**: Additional guard services
- **Real-time Analysis**: Streaming content evaluation
- **Team Collaboration**: Shared analysis workspaces

### v3.0.0 Vision
- **Federated Learning**: Privacy-preserving model improvements
- **Custom Models**: User-specific fine-tuning
- **API Marketplace**: Third-party analysis integrations
- **Advanced UI**: Enhanced user experience and visualizations

### Technical Debt & Improvements
- **Model Optimization**: Quantization for smaller footprint
- **Backend Reliability**: Enhanced error handling and retries
- **Performance Monitoring**: Real-time metrics and alerting
- **Security Hardening**: Additional vulnerability assessments

