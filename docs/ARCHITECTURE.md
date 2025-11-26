# AI Guardian Chrome Extension - System Architecture

## Overview

The AI Guardian Chrome extension implements a **hybrid dual-mode architecture** that provides flexible content analysis with both offline and cloud-based processing capabilities. This design enables cost-effective operation while maintaining high-quality analysis through intelligent fallback strategies.

## Core Architecture Principles

### 🔄 Hybrid Processing Model
The extension operates in two primary modes:

1. **Embedded Mode** (Primary): Local ML model + regex fallbacks
2. **Backend Mode** (Fallback): AWS-powered full analysis suite

### 🧠 Intelligence Hierarchy
Analysis follows a cascading fallback strategy:
```
ML Model (Fastest, Offline) → Regex Detection (Reliable) → Backend API (Comprehensive)
```

### 🔐 Authentication Strategy
- **Embedded Mode**: No authentication required (fully offline)
- **Backend Mode**: Clerk-based authentication with JWT tokens
- **Subscription**: Required for backend features (Stripe integration)

---

## System Components

### Frontend (Chrome Extension)

#### Content Scripts
- **Purpose**: Interact with web pages, capture user selections
- **Location**: `src/content.js`
- **Responsibilities**:
  - Text selection detection
  - UI rendering (badges, highlights, modals)
  - Message passing to service worker
  - Results display and user interaction

#### Service Worker
- **Purpose**: Background processing and API coordination
- **Location**: `src/service-worker.js`
- **Responsibilities**:
  - Extension lifecycle management
  - Text analysis orchestration
  - Authentication handling
  - Context menu management
  - Message routing between components

#### Popup Interface
- **Purpose**: User settings and status display
- **Location**: `src/popup.js`, `src/popup.html`
- **Responsibilities**:
  - Authentication status
  - Subscription management
  - Configuration settings
  - Analysis history display

### Backend Infrastructure

#### AWS Backend API
- **Endpoint**: `https://api.aiguardian.ai`
- **Purpose**: Full-featured content analysis suite
- **Current Status**: Operational with some validation gaps

#### Guard Services Architecture
```
┌─────────────────┐    ┌─────────────────┐
│   BiasGuard     │    │   TrustGuard    │
│   (Port 8004)   │    │   (Port 8002)   │
│                 │    │                 │
│ • ML Analysis   │    │ • Reliability   │
│ • Bias Types    │    │ • Trust Scores  │
│ • Mitigation    │    │ • Context Eval  │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                 │
        ┌─────────────────┐
        │  ContextGuard   │
        │   (Port 8003)   │
        │                 │
        │ • Drift Detect  │
        │ • Context Aware │
        │ • Temporal      │
        └─────────────────┘
```

#### Additional Guards (Planned/In Development)
- **SecurityGuard**: Content security analysis
- **TokenGuard**: Token optimization and efficiency
- **HealthGuard**: System health monitoring

### Embedded ML Model

#### Model Architecture
- **Framework**: TensorFlow.js v4.x
- **Location**: `/models/` (Git submodule)
- **Size**: ~3.2MB (model + weights)
- **Input**: 256 token sequences
- **Output**: Bias score + 5 category probabilities

#### Training Infrastructure
- **Location**: `/models/training/`
- **Data**: Synthetic + real-world bias examples
- **Validation**: 13-point comprehensive testing
- **Deployment**: Automated syncing to extension

---

## Data Flow Architecture

### User Interaction Flow

```
User selects text on webpage
        ↓
Content Script detects selection
        ↓
Service Worker receives ANALYZE_TEXT message
        ↓
Check Feature Flags & Authentication
        ↓
Execute Analysis Strategy:
├── Embedded Mode (Default)
│   ├── Try ML Model Inference
│   │   └── Fallback: Regex Detection
│   └── Results: Local processing complete
│
└── Backend Mode (If embedded disabled/fails)
    ├── Validate Authentication
    ├── Send to AWS API
    └── Results: Cloud processing complete
        ↓
Results displayed in UI
        ↓
Analysis saved to history
```

### Authentication Flow

```
User clicks extension popup
        ↓
Check Clerk authentication status
        ↓
├── Not authenticated → Redirect to login
│   └── After login → Store JWT token
└── Authenticated → Enable backend features
        ↓
Token automatically included in API requests
        ↓
Subscription status validated
```

### Configuration Management

```
Extension startup
        ↓
Load default settings from constants.js
        ↓
Merge with user preferences (chrome.storage.sync)
        ↓
Apply feature flags for runtime behavior
        ↓
Initialize gateway with current configuration
```

---

## Feature Flag System

### Production Configuration
```javascript
const FEATURE_FLAGS = {
  USE_EMBEDDED_MODEL: true,      // Primary analysis engine
  BACKEND_AUTH_ENABLED: true,    // Require Clerk auth for backend
  SUBSCRIPTION_REQUIRED: true,   // Require Stripe subscription
  DEBUG_MODE: false              // Production: disabled
};
```

### Runtime Behavior Matrix

| Mode | Embedded | Backend | Auth Required | Offline Capable |
|------|----------|---------|---------------|-----------------|
| Production | ✅ Primary | ✅ Fallback | ✅ | ✅ |
| Development | ✅ | ✅ | ❌ | ✅ |
| Offline-only | ✅ | ❌ | ❌ | ✅ |
| Backend-only | ❌ | ✅ | ✅ | ❌ |

---

## Security Architecture

### Chrome Extension Security
- **Manifest V3**: Modern security model
- **Isolated Worlds**: Content scripts cannot access page context
- **Permission Model**: Minimal required permissions
- **CSP Headers**: Content Security Policy enforcement

### Authentication Security
- **Clerk Integration**: Secure token management
- **JWT Tokens**: Bearer authentication for API
- **Token Storage**: Secure chrome.storage.local
- **Auto-refresh**: Automatic token renewal

### Data Protection
- **No Data Retention**: Text analysis without server storage
- **Local Processing**: ML inference happens client-side
- **Encrypted Storage**: Sensitive data encrypted at rest
- **Privacy First**: User data never leaves device (embedded mode)

---

## Performance Optimization

### Caching Strategy
- **Circuit Breaker**: API failure protection
- **Rate Limiting**: Request throttling
- **Storage Quota**: 8KB sync, 10MB local limits
- **Memory Management**: Tensor cleanup, efficient data structures

### Analysis Performance
- **ML Inference**: <5ms on modern hardware
- **Regex Fallback**: <1ms processing
- **API Response**: ~200-500ms average
- **UI Responsiveness**: Immediate feedback with async processing

### Resource Management
- **Lazy Loading**: ML model loaded on first use
- **Background Processing**: Non-blocking analysis
- **Memory Cleanup**: Automatic tensor disposal
- **Storage Optimization**: Minimal history retention

---

## Error Handling & Recovery

### Graceful Degradation
```
Analysis Request
        ↓
Try ML Model
        ↓
├── Success → Return results
└── Failure → Try regex detection
        ↓
    ├── Success → Return results
    └── Failure → Try backend API (if available)
        ↓
        ├── Success → Return results
        └── Failure → Show user-friendly error
```

### Error Classification
- **Recoverable**: Network timeouts, rate limits
- **Non-recoverable**: Invalid authentication, model corruption
- **Backend Issues**: API validation problems (external)
- **Extension Issues**: Code bugs, configuration problems

### User Experience
- **Immediate Feedback**: UI shows processing status
- **Clear Errors**: User-friendly error messages
- **Actionable**: Errors include suggested next steps
- **Offline Support**: Full functionality without internet

---

## Deployment & Scaling

### Development Workflow
1. **Model Training**: Independent in `/models/` directory
2. **Extension Build**: `npm run build` syncs model files
3. **Testing**: Unit, integration, E2E test suites
4. **Packaging**: Automated extension packaging

### Production Deployment
1. **Feature Flags**: Configure for production mode
2. **Model Sync**: Latest trained model included
3. **Backend Config**: AWS endpoints configured
4. **Security Review**: Final security audit

### Monitoring & Analytics
- **Performance Metrics**: Response times, error rates
- **Usage Analytics**: Feature adoption, user patterns
- **Error Tracking**: Automated error reporting
- **Health Checks**: Periodic system validation

---

## Future Evolution

### Planned Enhancements
- **Multi-language Support**: Expand beyond English
- **Advanced ML Models**: Larger, more accurate models
- **Real-time Analysis**: Streaming content analysis
- **Collaborative Features**: Team analysis sharing

### Scalability Considerations
- **Model Optimization**: Smaller, faster models for mobile
- **Edge Computing**: On-device processing optimization
- **Progressive Enhancement**: Core features work offline
- **Modular Architecture**: Easy feature addition/removal

---

## Development Guidelines

### Code Organization
- **Separation of Concerns**: UI, business logic, data access
- **Feature Flags**: Easy mode switching
- **Modular Design**: Independent component development
- **Testing Strategy**: Unit → Integration → E2E

### Performance Standards
- **Cold Start**: <2 seconds for first analysis
- **Hot Analysis**: <500ms response time
- **Memory Usage**: <50MB peak usage
- **Storage**: <1MB for user data

### Quality Assurance
- **Test Coverage**: >90% code coverage
- **Security Audit**: Regular security reviews
- **Performance Testing**: Continuous performance monitoring
- **User Testing**: Real-world usage validation
