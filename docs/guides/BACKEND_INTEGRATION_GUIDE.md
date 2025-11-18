# Backend Integration Guide - Chrome Extension

**Last Updated**: 2025-01-27  
**Version**: 1.0.0  
**Status**: Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Backend Architecture](#backend-architecture)
3. [API Endpoints](#api-endpoints)
4. [Authentication](#authentication)
5. [Request/Response Formats](#requestresponse-formats)
6. [Guard Services](#guard-services)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [Configuration](#configuration)
10. [Examples](#examples)

---

## 🎯 Overview

This document provides comprehensive integration details for connecting the AiGuardian Chrome Extension to the CodeGuardians Backend Gateway.

### Base URLs

- **Production**: `https://api.aiguardian.ai`
- **Development**: `http://localhost:8000`
- **Gateway Path**: `/api/v1`

### Gateway Endpoint Mapping

The Chrome Extension gateway.js maps extension endpoints to backend API endpoints:

| Extension Endpoint | Backend Endpoint | Method | Notes |
|-------------------|------------------|--------|-------|
| `analyze` | `/api/v1/guards/process` | POST | Unified guard processing |
| `health` | `/health/live` | GET | Used by `testGatewayConnection()` |
| `logging` | `/api/v1/logging` | POST | Central logging (may not exist) |
| `guards` | `/api/v1/guards/services` or `/api/v1/guards/status` | GET | List/status guard services |
| `config` | `/api/v1/config/config` | GET/PUT | Configuration management |

---

## 🏗️ Backend Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│              CodeGuardians Gateway (FastAPI)             │
│                     Port: 8000                          │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │TokenGuard│   │TrustGuard│   │ContextGuard│
   │  :8001   │   │  :8002   │   │   :8003    │
   └─────────┘   └─────────┘   └─────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
                 ┌────▼────┐
                 │BiasGuard │
                 │  :8004   │
                 └─────────┘
```

### Guard Services

1. **TokenGuard** (Port 8001)
   - Text compression and token optimization
   - Confidence-based truncation

2. **TrustGuard** (Port 8002)
   - AI failure pattern detection
   - Safety and compliance checking
   - 7 failure patterns (hallucination, drift, bias, etc.)

3. **ContextGuard** (Port 8003)
   - Context drift detection
   - Memory management
   - 96% accuracy

4. **BiasGuard** (Port 8004)
   - Bias detection and mitigation
   - Payment integration
   - User management

5. **HealthGuard** (Internal)
   - System monitoring
   - Health checks

---

## 🔌 API Endpoints

### Core Guard Processing

#### `POST /api/v1/guards/process`

Unified endpoint for processing content through guard services.

**Request Body:**
```json
{
  "service_type": "tokenguard" | "trustguard" | "contextguard" | "biasguard" | "healthguard",
  "payload": {
    "text": "Content to analyze",
    "contentType": "text",
    "scanLevel": "standard" | "enhanced" | "comprehensive",
    "context": "user-generated-content"
  },
  "user_id": "user-123",
  "session_id": "session-456",
  "priority": 1,
  "timeout": 30,
  "fallback_enabled": true,
  "client_type": "chrome",
  "client_version": "1.0.0",
  "request_metadata": {}
}
```

**Response:**
```json
{
  "request_id": "req_123456",
  "service_type": "tokenguard",
  "success": true,
  "data": {
    "original_text": "...",
    "compressed_text": "...",
    "tokens_saved": 150,
    "compression_ratio": 0.3,
    "cost_savings_usd": 0.0003,
    "confidence": 0.85
  },
  "processing_time": 0.234,
  "service_used": "tokenguard-service",
  "fallback_used": false,
  "client_type": "chrome",
  "confidence_score": 0.85,
  "warnings": [],
  "recommendations": [],
  "metadata": {}
}
```

**Alternative Endpoints (Aliases):**
- `POST /api/v1/scan` - Alias for `/api/v1/guards/process`
- `POST /api/v1/analyze` - Alias for `/api/v1/guards/process`

---

### Direct Guard Service Endpoints

#### `POST /api/v1/guards/tokenguard`
Direct TokenGuard processing

#### `POST /api/v1/guards/trustguard`
Direct TrustGuard processing

#### `POST /api/v1/guards/contextguard`
Direct ContextGuard processing

#### `POST /api/v1/guards/biasguard`
Direct BiasGuard processing

#### `POST /api/v1/guards/healthguard`
Direct HealthGuard processing

**Request Format:**
```json
{
  "text": "Content to analyze",
  "session_id": "optional-session-id",
  "additional_params": {}
}
```

---

### Health Endpoints

#### `GET /health`
Basic health check

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T12:00:00Z"
}
```

#### `GET /health/live`
Liveness probe - used by extension for connection testing

**Response:**
```json
{
  "status": "alive"
}
```

#### `GET /health/ready`
Readiness probe

#### `GET /health/comprehensive`
Comprehensive health check including all services

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "tokenguard": { "status": "healthy", "response_time": 0.023 },
    "trustguard": { "status": "healthy", "response_time": 0.045 },
    "contextguard": { "status": "healthy", "response_time": 0.012 },
    "biasguard": { "status": "healthy", "response_time": 0.034 }
  },
  "system": {
    "cpu": 45.2,
    "memory": 67.8,
    "disk": 23.4
  }
}
```

#### `GET /api/v1/guards/health`
Guard services health status

**Response:**
```json
{
  "tokenguard": {
    "service_name": "tokenguard",
    "status": "healthy",
    "last_check": "2025-01-27T12:00:00Z",
    "response_time": 0.023
  },
  "trustguard": {
    "service_name": "trustguard",
    "status": "healthy",
    "last_check": "2025-01-27T12:00:00Z",
    "response_time": 0.045
  }
}
```

#### `GET /api/v1/guards/health/{service_name}`
Health check for specific service

---

### Guard Service Status

#### `GET /api/v1/guards/status`
Get status of all guard services

#### `GET /api/v1/guards/services`
List available guard services

**Response:**
```json
{
  "services": [
    {
      "name": "tokenguard",
      "type": "token_optimization",
      "status": "healthy",
      "version": "1.0.0"
    },
    {
      "name": "trustguard",
      "type": "safety_compliance",
      "status": "healthy",
      "version": "1.0.0"
    }
  ]
}
```

#### `GET /api/v1/guards/discovery/services`
Discover available guard services

---

### Configuration Endpoints

#### `GET /api/v1/config/config`
Get system configuration

**Response:**
```json
{
  "gateway_url": "https://api.aiguardian.ai",
  "timeout": 30000,
  "retry_attempts": 3,
  "rate_limits": {
    "requests_per_minute": 60,
    "requests_per_hour": 1000
  },
  "feature_flags": {
    "cache_enabled": true,
    "fallback_enabled": true
  }
}
```

#### `GET /api/v1/config/rate-limits`
Get rate limit configuration

#### `PUT /api/v1/config/rate-limits`
Update rate limit configuration

#### `GET /api/v1/config/feature-flags`
Get feature flags

#### `PUT /api/v1/config/feature-flags`
Update feature flags

#### `GET /api/v1/config/status`
Get configuration status

---

### Authentication Endpoints

#### `POST /api/v1/auth/login`
Login with Clerk JWT token

**Request:**
```json
{
  "clerk_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### `POST /api/v1/auth/register`
User registration

#### `POST /api/v1/auth/refresh`
Refresh access token

#### `POST /api/v1/auth/logout`
Logout

#### `GET /api/v1/auth/me`
Get current user info

---

### Analytics Endpoints

#### `GET /api/v1/analytics/benefits/overview`
Get business benefits overview

#### `GET /api/v1/analytics/benefits/detailed`
Get detailed business benefits breakdown

#### `GET /api/v1/analytics/performance/dashboard`
Get performance dashboard data

#### `GET /api/v1/analytics/guards/{guard_name}/metrics`
Get specific guard metrics

---

### File Upload Endpoints

#### `POST /api/v1/upload/direct`
Direct file upload

#### `POST /api/v1/upload/presigned`
Get presigned URL for S3 upload

#### `GET /api/v1/upload/download/{file_id}`
Download file

#### `GET /api/v1/upload/list`
List uploaded files

---

### Webhook Endpoints

#### `POST /webhooks/stripe`
Stripe webhook endpoint

#### `POST /webhooks/clerk`
Clerk webhook endpoint

#### `GET /webhooks/health`
Webhook health check

---

## 🔐 Authentication

### API Key Authentication

The Chrome Extension uses Bearer token authentication:

```javascript
headers: {
  'Authorization': 'Bearer ' + apiKey,
  'Content-Type': 'application/json',
  'X-Extension-Version': chrome.runtime.getManifest().version,
  'X-Request-ID': requestId,
  'X-Timestamp': new Date().toISOString()
}
```

### Clerk Authentication (Optional)

For authenticated requests, you can use Clerk JWT tokens:

```javascript
// Get Clerk token from extension
const clerkToken = await getClerkToken();

headers: {
  'Authorization': 'Bearer ' + clerkToken,
  'X-Client-Type': 'chrome'
}
```

### Authentication Flow

1. Extension sends request with API key or Clerk token
2. Backend validates token
3. Backend processes request
4. Response includes authentication status

---

## 📦 Request/Response Formats

### Standard Request Headers

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <api-key>',
  'X-Extension-Version': '1.0.0',
  'X-Request-ID': 'req_123456',
  'X-Timestamp': '2025-01-27T12:00:00Z',
  'X-Client-Type': 'chrome'
}
```

### Standard Response Format

**Success Response (200):**
```json
{
  "request_id": "req_123456",
  "success": true,
  "data": {},
  "processing_time": 0.234,
  "metadata": {}
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error message",
  "error_code": "ERROR_CODE",
  "request_id": "req_123456",
  "timestamp": "2025-01-27T12:00:00Z"
}
```

---

## 🛡️ Guard Services

### TokenGuard

**Purpose**: Text compression and token optimization

**Endpoint**: `POST /api/v1/guards/tokenguard` or `POST /api/v1/guards/process` (with `service_type: "tokenguard"`)

**Request:**
```json
{
  "text": "Your content here",
  "additional_params": {
    "compression_level": "standard" | "aggressive"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "original_text": "...",
    "compressed_text": "...",
    "tokens_saved": 150,
    "compression_ratio": 0.3,
    "cost_savings_usd": 0.0003,
    "confidence": 0.85
  },
  "processing_time_ms": 234.5,
  "service_used": "tokenguard"
}
```

---

### TrustGuard

**Purpose**: Safety and compliance checking

**Endpoint**: `POST /api/v1/guards/trustguard` or `POST /api/v1/guards/process` (with `service_type: "trustguard"`)

**Request:**
```json
{
  "text": "Content to validate",
  "additional_params": {
    "validation_level": "standard" | "enhanced" | "comprehensive"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trust_score": 0.85,
    "reliability_indicators": ["source_verified", "factual"],
    "risk_factors": [],
    "confidence_level": 0.9,
    "violations": []
  },
  "processing_time_ms": 456.2,
  "service_used": "trustguard"
}
```

---

### ContextGuard

**Purpose**: Context drift detection and memory management

**Endpoint**: `POST /api/v1/guards/contextguard` or `POST /api/v1/guards/process` (with `service_type: "contextguard"`)

**Request:**
```json
{
  "text": "Content to analyze",
  "additional_params": {
    "operation": "set" | "get" | "analyze",
    "context_data": {}
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "context_drift_detected": false,
    "memory_usage": 0.45,
    "context_stability": 0.92,
    "recommendations": []
  },
  "processing_time_ms": 123.4,
  "service_used": "contextguard"
}
```

---

### BiasGuard

**Purpose**: Bias detection and mitigation

**Endpoint**: `POST /api/v1/guards/biasguard` or `POST /api/v1/guards/process` (with `service_type: "biasguard"`)

**Request:**
```json
{
  "text": "Content to analyze",
  "additional_params": {
    "operation": "detect_bias",
    "context": "user-generated"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bias_detected": false,
    "bias_score": 0.15,
    "bias_types": [],
    "mitigation_suggestions": []
  },
  "processing_time_ms": 345.6,
  "service_used": "biasguard"
}
```

---

### HealthGuard

**Purpose**: System monitoring

**Endpoint**: `POST /api/v1/guards/healthguard` or `POST /api/v1/guards/process` (with `service_type: "healthguard"`)

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "tokenguard": "healthy",
      "trustguard": "healthy"
    },
    "metrics": {}
  },
  "processing_time_ms": 45.2,
  "service_used": "healthguard"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "error_code": "ERROR_CODE",
  "request_id": "req_123456",
  "timestamp": "2025-01-27T12:00:00Z",
  "details": {
    "field": "error details"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_ERROR` - Authentication failed
- `SERVICE_UNAVAILABLE` - Guard service unavailable
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `TIMEOUT_ERROR` - Request timeout
- `INVALID_SERVICE_TYPE` - Invalid guard service type

### Error Handling in Extension

The extension gateway.js handles errors with retry logic:

```javascript
// Automatic retry on failure
retryAttempts: 3,
retryDelay: 1000ms (exponential backoff)
```

---

## 🚦 Rate Limiting

### Rate Limits

Default rate limits (configurable via `/api/v1/config/rate-limits`):

- **Requests per minute**: 60
- **Requests per hour**: 1000
- **Requests per day**: 10000

### Rate Limit Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1643302800
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 15
}
```

---

## ⚙️ Configuration

### Extension Configuration

The extension stores configuration in Chrome storage:

```javascript
{
  gateway_url: "https://api.aiguardian.ai",
  api_key: "your-api-key",
  timeout: 10000,
  retry_attempts: 3
}
```

### Backend Configuration

Backend configuration can be retrieved via `/api/v1/config/config`:

```json
{
  "gateway_url": "https://api.aiguardian.ai",
  "timeout": 30000,
  "retry_attempts": 3,
  "rate_limits": {
    "requests_per_minute": 60,
    "requests_per_hour": 1000
  },
  "feature_flags": {
    "cache_enabled": true,
    "fallback_enabled": true
  }
}
```

---

## 💡 Examples

### Example 1: Text Analysis via Unified Endpoint

```javascript
// Using gateway.js
const gateway = new AiGuardianGateway();

const result = await gateway.analyzeText("Your text here", {
  service_type: "tokenguard",
  scan_level: "standard"
});
```

**Backend Request:**
```json
POST /api/v1/guards/process
{
  "service_type": "tokenguard",
  "payload": {
    "text": "Your text here",
    "contentType": "text",
    "scanLevel": "standard"
  },
  "client_type": "chrome",
  "client_version": "1.0.0"
}
```

---

### Example 2: Direct Guard Service Call

```javascript
// Direct TokenGuard call
const response = await fetch('https://api.aiguardian.ai/api/v1/guards/tokenguard', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey
  },
  body: JSON.stringify({
    text: "Your text here",
    session_id: "session-123"
  })
});
```

---

### Example 3: Health Check

```javascript
// Health check from gateway.js
const status = await gateway.testGatewayConnection();
// Calls: GET /health/live

// Comprehensive health check
const health = await fetch('https://api.aiguardian.ai/health/comprehensive');
```

---

### Example 4: Batch Processing

```javascript
// Process multiple guard services
const services = ['tokenguard', 'trustguard', 'biasguard'];
const results = await Promise.all(
  services.map(service => 
    gateway.sendToGateway('analyze', {
      service_type: service,
      text: "Your text here"
    })
  )
);
```

---

## 🔄 Gateway Mapping Reference

### Extension Gateway Methods → Backend Endpoints

| Gateway Method | Backend Endpoint | Notes |
|----------------|------------------|-------|
| `analyzeText()` | `POST /api/v1/guards/process` | Unified processing |
| `testGatewayConnection()` | `GET /health/live` | Liveness check (direct call, not mapped) |
| `getGatewayStatus()` | `GET /health/live` | Health status (uses testGatewayConnection) |
| `sendToGateway('health')` | `GET /health` or `/health/live` | Health endpoint (maps to 'api/v1/health' which may need adjustment) |
| `sendToGateway('analyze')` | `POST /api/v1/guards/process` | Analysis |
| `sendToGateway('guards')` | `GET /api/v1/guards/services` | List services (maps to 'api/v1/guards/list') |
| `sendToGateway('config')` | `GET /api/v1/config/config` | Get config |

---

## ⚠️ Endpoint Mapping Notes

### Current Gateway Mapping

The extension's `gateway.js` maps endpoints as follows:

```javascript
const endpointMapping = {
  'analyze': 'api/v1/guards/process',  // ✅ Correct
  'health': 'api/v1/health',            // ⚠️ Note: Actual endpoint is /health or /health/live
  'logging': 'api/v1/logging',         // ⚠️ May not exist - verify
  'guards': 'api/v1/guards/list',      // ⚠️ Should be /api/v1/guards/services
  'config': 'api/v1/config'           // ⚠️ Should be /api/v1/config/config
};
```

### Recommendations

1. **Health Endpoint**: The `testGatewayConnection()` method correctly uses `/health/live` directly. Consider updating the mapping to use `/health/live` instead of `api/v1/health`.

2. **Guards Endpoint**: Update mapping from `api/v1/guards/list` to `api/v1/guards/services` or `/api/v1/guards/status`.

3. **Config Endpoint**: Update mapping from `api/v1/config` to `api/v1/config/config` for consistency.

4. **Logging Endpoint**: Verify if `/api/v1/logging` exists in the backend. If not, consider using the central logging mechanism through the gateway.

---

## 📝 Implementation Checklist

- [x] Review backend API structure
- [x] Map extension endpoints to backend endpoints
- [x] Document authentication methods
- [x] Document request/response formats
- [x] Document guard services
- [x] Document error handling
- [x] Document rate limiting
- [x] Provide code examples
- [x] Document endpoint mapping discrepancies
- [ ] Update extension gateway.js with correct endpoint mappings
- [ ] Test all endpoints
- [ ] Update extension configuration

---

## 🔗 Additional Resources

- **Backend Integration Guide**: `../AIGuards-Backend-1/docs/architecture/INTEGRATION_GUIDE.md`
- **Frontend Integration Guide**: `../AIGuards-Backend-1/docs/architecture/FRONTEND_INTEGRATION_GUIDE.md`
- **API Documentation**: `http://localhost:8000/docs` (Swagger UI in development)
- **OpenAPI Spec**: `../AIGuards-Backend-1/openapi-complete.yaml`

---

## 📞 Support

For integration issues or questions:

1. Check error logs in extension console
2. Verify backend health: `GET /health/comprehensive`
3. Check authentication: Verify API key format
4. Review rate limits: Check `X-RateLimit-*` headers

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-01-27  
**Maintained By**: AI Guardians Team

