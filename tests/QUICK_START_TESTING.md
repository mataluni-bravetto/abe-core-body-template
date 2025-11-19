# 🚀 Quick Start: Production Testing

**Status:** ✅ Ready to Execute

---

## ⚡ 3-Step Testing Process

### Step 1: Load Extension
1. Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. "Load unpacked" → Select `AiGuardian-Chrome-Ext-dev`

### Step 2: Open Service Worker Console
1. Find "AiGuardian" extension
2. Click "Inspect views: service worker"

### Step 3: Run Tests

Copy and paste into console:

```javascript
// Load test suite
importScripts('tests/production-test-suite.js');
importScripts('debug/epistemic-reliability-debugger.js');

// Run production tests
await runProductionTests();

// Run epistemic reliability checks
const results = await runEpistemicChecks();
console.log('\n🎯 Reliability Score:', results.percentage + '%');
console.log('Target Met:', results.targetMet ? '✅' : '❌');
```

---

## ✅ Expected Results

### Production Tests
- ✅ Mutex Helper: PASS
- ✅ Circuit Breaker: PASS
- ✅ Token Storage: PASS
- ✅ Storage Quota: PASS
- ✅ State Rehydration: PASS
- ✅ Gateway Integration: PASS

### Reliability Score
- **Expected:** 70%+ (up from 42%)
- **Target:** 97.8%

---

## 📊 What to Look For

### ✅ Success Indicators
- All tests show ✅ PASS
- Reliability score ≥ 70%
- No critical errors in console
- Circuit breaker state: CLOSED
- Mutex patterns working

### ⚠️ Warning Signs
- Tests show ⚠️ WARNING (review but may be acceptable)
- Reliability score < 70% (investigate)
- Missing imports (check file paths)

### ❌ Failure Indicators
- Tests show ❌ ERROR (must fix)
- Reliability score < 50% (critical)
- Console errors (check integration)

---

## 🔍 Quick Validation

### Check Mutex Helper
```javascript
typeof MutexHelper !== 'undefined' // Should be true
```

### Check Circuit Breaker
```javascript
gateway.circuitBreaker.getState() // Should return state object
```

### Check Storage Quota
```javascript
await gateway.checkStorageQuota() // Should return quota info
```

---

## 📝 Report Results

After testing, note:
1. **Pass Rate:** ___%
2. **Reliability Score:** ___%
3. **Issues Found:** [List]
4. **Status:** Ready / Needs Fixes

---

**Ready to Test** ✅  
**Next:** Execute tests in Chrome extension

