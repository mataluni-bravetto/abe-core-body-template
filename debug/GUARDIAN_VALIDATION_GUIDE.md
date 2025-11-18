# 🛡️ Guardian, Agent & Swarm Validation Guide

**Date:** 2025-11-18  
**Purpose:** Validate proper use of guardians, agents, and swarms in Chrome extension

---

## 🎯 Overview

This validation ensures the Chrome extension properly uses:

1. **Guard Services** - Backend guard services (BiasGuard, TrustGuard, ContextGuard, etc.)
2. **Gateway Routing** - Unified endpoint routing to `/api/v1/guards/process`
3. **Guard Configuration** - Proper guard service configuration and thresholds
4. **Error Handling** - Appropriate error handling and fallbacks

---

## 🚀 Quick Start

### Load Validation Script

```javascript
// In Chrome extension service worker console
importScripts('debug/guardian-agent-swarm-validation.js');
```

### Run Validation

```javascript
await validateGuardiansAgentsSwarms();
```

---

## 📊 What Gets Validated

### 1. Guard Services
- ✅ Guard service configuration in constants
- ✅ Expected guards present (biasguard, trustguard, contextguard, etc.)
- ✅ Guard service enable/disable status
- ✅ Threshold values (0.0-1.0 range)

### 2. Gateway Routing
- ✅ Unified endpoint usage (`/api/v1/guards/process`)
- ✅ Analyze endpoint mapping
- ✅ Health endpoints (live/ready)
- ✅ Service discovery endpoint

### 3. Guard Configuration
- ✅ Enabled guards count
- ✅ Threshold validation
- ✅ Response handling
- ✅ Fallback configuration

### 4. Error Handling
- ✅ Authentication error handling (401/403)
- ✅ Circuit breaker presence
- ✅ Retry logic
- ✅ Guard service fallbacks

---

## ✅ Expected Results

### Guard Services
```
📋 Validating Guard Services...

  Found 5 guard services configured:
    ✅ biasguard: enabled (threshold: 0.5)
    ✅ trustguard: enabled (threshold: 0.7)
    ✅ contextguard: enabled (threshold: 0.6)
    ⚠️ tokenguard: disabled (threshold: 0.5)
    ⚠️ healthguard: disabled (threshold: 0.8)
  ✅ Gateway uses unified guard endpoint
```

### Gateway Routing
```
🔗 Validating Gateway Routing...

  ✅ Unified guard endpoint configured
  ✅ Health endpoints configured
  ✅ Guard service discovery endpoint configured
```

### Configuration
```
⚙️  Validating Guard Configuration...

  Enabled guards: 3
    ✅ biasguard
    ✅ trustguard
    ✅ contextguard
  ✅ Gateway has guard response handling
```

### Error Handling
```
🛡️  Validating Error Handling...

  ✅ Authentication error handling present
  ✅ Circuit breaker present
  ✅ Retry logic present
  ✅ Guard service fallbacks configured
```

---

## 🎯 Success Criteria

**Properly Configured When:**
- ✅ All expected guard services configured
- ✅ Unified endpoint (`/api/v1/guards/process`) used
- ✅ Authentication error handling present
- ✅ Circuit breaker implemented
- ✅ Guard thresholds in valid range (0.0-1.0)

---

## 🔍 Guard Services Reference

### Expected Guard Services

| Guard Service | Port | Purpose | Default Threshold |
|---------------|------|---------|-------------------|
| BiasGuard | 8004 | Bias detection | 0.5 |
| TrustGuard | 8002 | Trust validation | 0.7 |
| ContextGuard | 8003 | Context drift detection | 0.6 |
| TokenGuard | 8001 | Token optimization | 0.5 |
| HealthGuard | 8006 | Health monitoring | 0.8 |

### Unified Endpoint

All guard services route through:
```
POST /api/v1/guards/process
```

The gateway handles routing to appropriate guards based on configuration.

---

## 🐛 Common Issues

### Issue: Guard services not configured
**Symptom:** "Guard services configuration not found"  
**Fix:** Ensure `DEFAULT_CONFIG.GUARD_SERVICES` is defined in `constants.js`

### Issue: Unified endpoint not used
**Symptom:** "Gateway does not use unified endpoint"  
**Fix:** Update gateway endpoint mapping to use `api/v1/guards/process`

### Issue: Missing authentication error handling
**Symptom:** "Authentication error handling missing"  
**Fix:** Add 401/403 error handling in `gateway.sendToGateway()`

### Issue: Invalid threshold values
**Symptom:** "Threshold out of range"  
**Fix:** Ensure thresholds are between 0.0 and 1.0

---

## 📋 Validation Checklist

After running validation, verify:

- [ ] All expected guard services configured
- [ ] Unified endpoint used for guard processing
- [ ] Health endpoints configured
- [ ] Service discovery endpoint present
- [ ] Authentication error handling (401/403)
- [ ] Circuit breaker implemented
- [ ] Retry logic present
- [ ] Guard thresholds in valid range
- [ ] Fallbacks configured for disabled guards

---

## 🎯 Integration with Backend

The Chrome extension integrates with backend guard services through:

1. **Unified Gateway** - Routes to `/api/v1/guards/process`
2. **Guard Configuration** - Defines which guards are enabled
3. **Threshold Management** - Sets guard-specific thresholds
4. **Error Handling** - Handles guard service failures gracefully

---

## 📊 Report Structure

The validation report includes:

1. **Guard Services Summary** - Configuration status
2. **Gateway Summary** - Routing and endpoint status
3. **Configuration Summary** - Enabled guards and settings
4. **Issues Found** - Prioritized by severity
5. **Recommendations** - Actionable fixes

---

## ✅ Status Indicators

- ✅ **Properly Configured** - All checks pass
- ⚠️ **Mostly Configured** - Minor issues found
- ❌ **Issues Found** - High priority fixes needed

---

**Status:** ✅ Ready for Use  
**Next:** Run validation to ensure proper guard/agent/swarm usage

