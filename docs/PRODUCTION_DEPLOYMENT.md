# Production Deployment Guide (v1.0.0)

## Overview

AI Guardian v1.0.0 implements a **hybrid dual-mode architecture** for maximum reliability and performance:

### Primary Mode: Embedded ML Analysis
- **Local TensorFlow.js model** for instant, offline bias detection
- **No backend dependency** for core functionality
- **<5ms inference time** on modern hardware
- **3.2MB model size** (~1.8MB model + ~1.4MB weights)

### Fallback Mode: Backend API Analysis
- **AWS-hosted advanced analysis** when embedded model unavailable/fails
- **Clerk authentication** for premium features
- **Stripe subscription** validation
- **Comprehensive guard services** (BiasGuard, TrustGuard, ContextGuard)

### Intelligent Fallback Strategy
```
User selects text → Try Embedded ML (Fastest)
                     ↓ (if fails)
              Try Regex Fallback (Reliable)
                     ↓ (if fails)
           Try Backend API (Comprehensive)
                     ↓ (if fails)
        Show User-Friendly Error (Graceful)
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
| **Speed** | Fastest (<5ms) | Fastest (<5ms) | Slower (200-500ms) | Embedded Primary |
| **Reliability** | High (fallback chain) | High (no network) | Medium (network dependent) | Embedded Primary |
| **Features** | Core analysis | Core analysis | All features | Embedded Primary |
| **Offline Support** | ✅ Full | ✅ Full | ❌ None | Embedded Primary |
| **Accuracy** | Good (ML model) | Good (ML model) | Best (advanced) | Backend-Only for premium |
| **Setup Complexity** | Medium (model sync) | Medium (model sync) | High (auth + backend) | Embedded Primary |

## Build Process

### Standard Production Build
```bash
# 1. Initialize ML model submodule
git submodule update --init --recursive

# 2. Install dependencies
npm ci

# 3. Sync ML model to extension
npm run sync:model

# 4. Build and package
npm run build
npm run package
```

### Output Artifacts
- **Extension ZIP**: `dist/aiguardian-v1.0.0.zip`
- **ML Model**: Embedded in extension (`src/models/`)
- **Configuration**: Production feature flags applied

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

#### 2. ML Model Integration
```bash
# Verify model files exist
ls -la src/models/
# Should contain: bias-detection-model.json, bias-detection-model.weights.bin

# Verify model loading in console
# Look for: "[MLBiasDetection] Model loaded successfully"
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

#### 6. Performance Verification
```bash
npm run test:unit
# All unit tests should pass
# ML inference: <5ms average
```

## Performance Monitoring

### Key Metrics to Monitor
- **ML Inference Time**: Target <5ms
- **Fallback Usage**: Track embedded vs backend usage
- **Error Rates**: Monitor analysis failure rates
- **Memory Usage**: Peak usage <50MB
- **Network Latency**: Backend response times

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

### Pre-Launch
- [ ] Feature flags configured for production mode
- [ ] ML model synced and verified
- [ ] Authentication credentials configured
- [ ] Subscription system tested
- [ ] Security audit passed (100% score)
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Offline functionality verified
- [ ] Backend fallback tested

### Chrome Web Store Submission
- [ ] ZIP file created (`npm run package`)
- [ ] Manifest v3 compliance verified
- [ ] Privacy policy updated for data collection
- [ ] Screenshots and descriptions ready
- [ ] Support contact information configured

### Post-Launch Monitoring
- [ ] User adoption metrics set up
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Customer support channels ready

## Artifacts

### Core Components
- **Source Code**: `src/` (Chrome extension)
- **ML Model**: `models/models/` (TensorFlow.js model)
- **SDK**: `sdk/` (Standalone client library)
- **Build Output**: `dist/aiguardian-v1.0.0.zip`

### File Structure
```
aiguardian-v1.0.0.zip/
├── manifest.json              # Extension manifest (v3)
├── src/
│   ├── service-worker.js     # Background processing
│   ├── content.js            # Page interaction
│   ├── popup.html/js         # User interface
│   ├── gateway.js            # Backend communication
│   └── models/               # Embedded ML model
│       ├── bias-detection-model.json
│       └── bias-detection-model.weights.bin
├── assets/                   # Icons, logos, branding
└── docs/                     # Documentation
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

### v1.1.0+ Enhancements
- **Enhanced ML Models**: Larger, more accurate bias detection
- **Multi-language Support**: Expand beyond English content
- **Advanced Backend Features**: Additional guard services
- **Real-time Analysis**: Streaming content evaluation
- **Team Collaboration**: Shared analysis workspaces

### v2.0.0 Vision
- **Federated Learning**: Privacy-preserving model improvements
- **Custom Models**: User-specific fine-tuning
- **API Marketplace**: Third-party analysis integrations
- **Advanced UI**: Enhanced user experience and visualizations

### Technical Debt & Improvements
- **Model Optimization**: Quantization for smaller footprint
- **Backend Reliability**: Enhanced error handling and retries
- **Performance Monitoring**: Real-time metrics and alerting
- **Security Hardening**: Additional vulnerability assessments

