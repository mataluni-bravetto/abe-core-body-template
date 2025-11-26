# Backend Integration Guide

## Overview

The AI Guardian Chrome extension integrates with AWS-hosted backend services for comprehensive content analysis. This guide documents the backend API architecture, authentication requirements, and current integration status.

## Backend Architecture

### AWS Infrastructure

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │ -> │  Guard Router   │ -> │  Guard Services │
│                 │    │                 │    │                 │
│ https://api.    │    │ /api/v1/guards/ │    │ BiasGuard:8004  │
│ aiguardian.ai   │    │ process         │    │ TrustGuard:8002 │
└─────────────────┘    └─────────────────┘    │ ContextGuard:8003│
                                              │ SecurityGuard:8005│
                                              │ TokenGuard:8001  │
                                              │ HealthGuard:8006 │
                                              └─────────────────┘
```

### Service Endpoints

#### Primary API Endpoint
- **URL**: `https://api.aiguardian.ai/api/v1/guards/process`
- **Method**: POST
- **Purpose**: Unified content analysis processing

#### Health Check Endpoint
- **URL**: `https://api.aiguardian.ai/health/live`
- **Method**: GET
- **Purpose**: Service availability monitoring

### Guard Services

#### BiasGuard (Port 8004)
**Purpose**: Advanced bias detection and content analysis
**Capabilities**:
- Machine learning bias detection
- Multi-category bias classification
- Mitigation suggestions
- Fairness scoring

#### TrustGuard (Port 8002)
**Purpose**: Trust validation and reliability assessment
**Capabilities**:
- Source credibility analysis
- Content reliability scoring
- Trust indicators evaluation
- Misinformation detection

#### ContextGuard (Port 8003)
**Purpose**: Context drift detection and temporal analysis
**Capabilities**:
- Context consistency checking
- Temporal bias detection
- Semantic drift analysis
- Contextual relevance scoring

#### Additional Guards (Planned/Partial)

##### SecurityGuard (Port 8005)
**Status**: Planned
**Purpose**: Content security and safety analysis

##### TokenGuard (Port 8001)
**Status**: Planned
**Purpose**: Token optimization and efficiency analysis

##### HealthGuard (Port 8006)
**Status**: Planned
**Purpose**: System health and performance monitoring

## Authentication & Authorization

### Clerk Authentication

#### Authentication Flow
```
User Login (Clerk)
        ↓
JWT Token Issued
        ↓
Token Stored (chrome.storage.local)
        ↓
Token Included in API Requests
        ↓
Backend Validates Token
        ↓
Analysis Processing
```

#### Token Management
- **Storage**: `chrome.storage.local.clerk_token`
- **Format**: JWT Bearer token
- **Expiration**: 1 hour (auto-refresh enabled)
- **Refresh**: Automatic via Clerk SDK

#### Headers Required
```javascript
{
  'Authorization': `Bearer ${clerk_token}`,
  'X-Extension-Version': '1.0.0',
  'X-Request-ID': generateUUID(),
  'Content-Type': 'application/json'
}
```

### Subscription Validation

#### Stripe Integration
- **Required**: Active subscription for backend features
- **Validation**: Pre-flight check before analysis
- **Caching**: Subscription status cached locally
- **Refresh**: Periodic validation (5-minute intervals)

## API Request/Response Format

### Request Format

#### Standard Analysis Request
```javascript
{
  "service_type": "biasguard",  // Primary service
  "payload": {
    "text": "Text content to analyze...",
    "contentType": "text",
    "scanLevel": "standard",     // standard | deep | quick
    "context": "webpage-content"
  },
  "user_id": "clerk_user_id",
  "session_id": "session_uuid",
  "client_type": "chrome",
  "client_version": "1.0.0"
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| service_type | string | ✅ | Primary guard service (biasguard, trustguard, etc.) |
| payload.text | string | ✅ | Content to analyze |
| payload.contentType | string | ✅ | Content type (text, html, etc.) |
| payload.scanLevel | string | ❌ | Analysis depth (standard, deep, quick) |
| payload.context | string | ❌ | Content context (webpage, document, etc.) |
| user_id | string | ✅ | Clerk user ID |
| session_id | string | ✅ | Session tracking ID |
| client_type | string | ✅ | Client type (chrome, sdk, etc.) |
| client_version | string | ✅ | Client version |

### Response Format

#### Successful Response
```javascript
{
  "success": true,
  "data": {
    "bias_score": 0.75,
    "analysis": {
      "bias_types": ["gender_bias", "political_bias"],
      "bias_details": {
        "gender_bias": 0.8,
        "political_bias": 0.6
      },
      "mitigation_suggestions": [
        "Use gender-neutral language",
        "Present balanced political viewpoints"
      ],
      "fairness_score": 0.3,
      "summary": "Detected gender and political bias"
    },
    "confidence": 0.85,
    "processing_time": 245,
    "source": "backend-biasguard"
  },
  "service_type": "biasguard",
  "processing_id": "proc_1234567890"
}
```

#### Error Response
```javascript
{
  "success": false,
  "error": "Authentication required",
  "error_code": "AUTH_REQUIRED",
  "status_code": 401,
  "details": {
    "reason": "missing_token",
    "action_required": "user_login"
  }
}
```

## Current Backend Status

### ✅ Operational Services

#### BiasGuard
- **Status**: ✅ Fully Operational
- **Response Time**: ~200-300ms
- **Capabilities**: All features working
- **Integration**: Complete

#### TrustGuard
- **Status**: ✅ Fully Operational
- **Response Time**: ~150-250ms
- **Capabilities**: All features working
- **Integration**: Complete

#### ContextGuard
- **Status**: ✅ Fully Operational
- **Response Time**: ~180-280ms
- **Capabilities**: All features working
- **Integration**: Complete

### ⚠️ Known Issues

#### Input Validation Gaps
**Issue**: Backend accepts some invalid requests that should be rejected
**Impact**: Extension handles gracefully with fallbacks
**Severity**: Low (extension-side error handling prevents issues)
**Status**: Backend-side issue, documented for future fixes

#### Missing Guard Services
**Issue**: SecurityGuard, TokenGuard, HealthGuard not yet implemented
**Impact**: Extension gracefully degrades without these features
**Severity**: Low (core functionality available)
**Status**: Planned features, not blocking deployment

### 🔧 Extension Handling

#### Graceful Degradation
```javascript
// Extension automatically handles backend issues
if (backendFails) {
  if (embeddedModeEnabled) {
    return useEmbeddedModel();
  } else {
    return showUserFriendlyError();
  }
}
```

#### Error Classification
- **Network Issues**: Automatic retry with exponential backoff
- **Auth Issues**: Clear user messaging with login prompts
- **Rate Limits**: Intelligent throttling and queue management
- **Service Issues**: Fallback to embedded mode if available

## Testing & Validation

### Backend Integration Tests

#### Direct API Testing
```bash
# Test with valid token
CLERK_TOKEN=your_token node scripts/test-e2e-direct-api.js

# Test health check
curl https://api.aiguardian.ai/health/live
```

#### Integration Test Suite
```bash
# Run full backend integration tests
npm run test:backend-integration

# Test specific guard services
npm run test:guard-service -- --service=biasguard
```

### Current Test Results

#### Integration Tests: ✅ 10/10 PASSED
- Gateway Connection: ✅
- Authentication Flow: ✅
- Subscription Verification: ✅
- Text Analysis Pipeline: ✅
- Guard Service Integration: ✅
- Error Handling & Recovery: ✅
- Configuration Management: ✅
- Logging & Monitoring: ✅
- Performance & Scalability: ✅

#### API Schema Tests: ⚠️ 1/6 FAILED
- **Failed**: API Schema Compatibility (missing guards)
- **Status**: Expected - backend has planned features not yet implemented
- **Impact**: Extension handles gracefully

## Development Workflow

### Local Development
1. **Backend Setup**: Configure local backend endpoints
2. **Authentication**: Use test tokens for development
3. **Feature Flags**: Enable backend mode for testing
4. **Logging**: Enable verbose logging for debugging

### Production Deployment
1. **Endpoint Configuration**: Update to production URLs
2. **Authentication**: Enable full Clerk integration
3. **Subscription**: Enable Stripe validation
4. **Monitoring**: Configure production logging

### Rollback Strategy
1. **Embedded Mode**: Always available as fallback
2. **Feature Flags**: Can disable backend features instantly
3. **Graceful Degradation**: Users experience no service interruption

## Troubleshooting

### Common Issues

#### Authentication Failures
```
Symptoms: 401/403 errors
Solutions:
1. Check token validity
2. Verify Clerk integration
3. Clear extension storage
4. Re-authenticate user
```

#### Network Timeouts
```
Symptoms: Request timeouts
Solutions:
1. Check internet connectivity
2. Verify backend status
3. Use embedded mode fallback
4. Implement retry logic
```

#### Service Unavailable
```
Symptoms: 5xx errors
Solutions:
1. Check backend health endpoint
2. Monitor service status
3. Use embedded mode
4. Implement circuit breaker
```

### Debug Tools

#### Request Logging
```javascript
// Enable in service worker
Logger.setLevel('debug');

// Check chrome.storage.local for tokens
chrome.storage.local.get(['clerk_token'], console.log);
```

#### Network Inspection
```javascript
// Monitor API requests
chrome.devtools.network.onRequestFinished.addListener(request => {
  if (request.request.url.includes('aiguardian.ai')) {
    console.log('API Request:', request);
  }
});
```

## Future Improvements

### Backend Enhancements
- **Input Validation**: Strengthen request validation
- **Rate Limiting**: Implement per-user limits
- **Caching**: Add response caching for repeated requests
- **Analytics**: Enhanced usage analytics

### Integration Improvements
- **Real-time Updates**: WebSocket support for live analysis
- **Batch Processing**: Multi-request batching for efficiency
- **Advanced Filtering**: Content-type specific processing
- **Custom Models**: User-specific model training

### Monitoring & Observability
- **Performance Metrics**: Detailed timing and throughput
- **Error Tracking**: Comprehensive error categorization
- **Usage Analytics**: Feature adoption and usage patterns
- **Health Monitoring**: Proactive issue detection
