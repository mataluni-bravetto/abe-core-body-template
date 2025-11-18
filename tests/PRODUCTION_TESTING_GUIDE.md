# 🧪 Production Testing Guide

**Date:** 2025-11-18  
**Purpose:** Validate Epistemic Reliability Integration

---

## 🚀 Quick Start

### Step 1: Load Extension in Chrome

1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select: `AiGuardian-Chrome-Ext-dev`

### Step 2: Open Service Worker Console

1. In `chrome://extensions/`, find "AiGuardian"
2. Click "Inspect views: service worker"
3. Chrome DevTools opens for service worker

### Step 3: Load Test Suite

In the DevTools console, run:

```javascript
importScripts('tests/production-test-suite.js');
```

### Step 4: Run Tests

```javascript
runProductionTests();
```

---

## 📋 Test Suite Overview

### Test 1: Mutex Helper Availability
**Validates:** MutexHelper is loaded and methods are available

**Expected:** ✅ PASS
- MutexHelper.withLock available
- MutexHelper.updateStorage available
- MutexHelper.incrementCounter available

### Test 2: Circuit Breaker Availability
**Validates:** Circuit breaker is initialized in gateway

**Expected:** ✅ PASS
- gateway.circuitBreaker exists
- Circuit breaker state accessible
- Stats tracking working

### Test 3: Token Storage Mutex Protection
**Validates:** Token storage uses mutex protection

**Expected:** ✅ PASS
- storeClerkToken uses MutexHelper
- Race condition protection active

### Test 4: Storage Quota Monitoring
**Validates:** Storage quota checking works

**Expected:** ✅ PASS
- checkStorageQuota method exists
- Quota information returned
- Usage percentage calculated

### Test 5: State Rehydration
**Validates:** State can be rehydrated from storage

**Expected:** ✅ PASS
- Can read auth state from storage
- Rehydration pattern working

### Test 6: Gateway Integration
**Validates:** All gateway integrations present

**Expected:** ✅ PASS
- Circuit breaker initialized
- Token refresh method exists
- Quota checking available
- Gateway initialized

---

## 🔍 Advanced Testing

### Test Mutex Patterns

```javascript
// Test concurrent counter increments
const promises = [];
for (let i = 0; i < 10; i++) {
  promises.push(MutexHelper.incrementCounter('test_counter'));
}
await Promise.all(promises);

// Verify: counter should be exactly 10
const result = await new Promise(resolve => {
  chrome.storage.local.get(['test_counter'], resolve);
});
console.log('Counter value:', result.test_counter); // Should be 10
```

### Test Circuit Breaker

```javascript
// Check circuit breaker state
const state = gateway.circuitBreaker.getState();
console.log('Circuit breaker state:', state);

// Simulate failures (if needed)
// After 5 failures, circuit should OPEN
```

### Test Token Refresh Mutex

```javascript
// Trigger token refresh
const newToken = await gateway.refreshClerkToken();
console.log('Token refreshed:', !!newToken);

// Verify mutex protection (check logs for single refresh)
```

### Test Storage Quota

```javascript
// Check quota
const quota = await gateway.checkStorageQuota();
console.log('Storage quota:', quota);

// Should show:
// - bytes: current usage
// - quota: total quota
// - usagePercent: percentage used
// - remainingBytes: space remaining
```

---

## 📊 Run Epistemic Reliability Debugger

```javascript
// Load epistemic debugger
importScripts('debug/epistemic-reliability-debugger.js');

// Run checks
const results = await runEpistemicChecks();

// View score
console.log('Reliability Score:', results.percentage + '%');
console.log('Target Met:', results.targetMet ? '✅' : '❌');

// View detailed results
console.log(JSON.stringify(results, null, 2));
```

**Expected Score:** ~70%+ (up from ~42%)

---

## 🎯 Test Scenarios

### Scenario 1: Concurrent Storage Operations
**Test:** Multiple events updating storage simultaneously  
**Expected:** No data loss, mutex prevents race conditions

### Scenario 2: Backend Outage
**Test:** Backend returns 500 errors  
**Expected:** Circuit breaker opens after 5 failures, fails fast

### Scenario 3: Token Expiration
**Test:** Multiple requests with expired token  
**Expected:** Only one token refresh, all requests retry with new token

### Scenario 4: Service Worker Termination
**Test:** Service worker terminates and restarts  
**Expected:** State rehydrated from storage, no data loss

### Scenario 5: Storage Quota
**Test:** Storage usage > 90%  
**Expected:** Warning logged, quota information available

---

## ✅ Success Criteria

### Critical Tests (Must Pass)
- [x] Mutex Helper available
- [x] Circuit Breaker initialized
- [x] Token storage uses mutex
- [x] Storage quota monitoring works
- [x] State rehydration works
- [x] Gateway integration complete

### Expected Results
- **Pass Rate:** 100% (all tests pass)
- **Reliability Score:** 70%+ (up from 42%)
- **No Errors:** All critical patterns functional

---

## 📝 Test Report Template

After running tests, document results:

```markdown
## Production Test Results

**Date:** [Date]
**Environment:** Chrome Extension MV3
**Version:** 1.0.0

### Test Results
- Mutex Helper: ✅ PASS
- Circuit Breaker: ✅ PASS
- Token Storage: ✅ PASS
- Storage Quota: ✅ PASS
- State Rehydration: ✅ PASS
- Gateway Integration: ✅ PASS

### Reliability Score
- Score: [X]%
- Target: 97.8%
- Status: [MET / NOT MET]

### Issues Found
- [List any issues]

### Recommendations
- [List recommendations]
```

---

## 🔧 Troubleshooting

### Issue: MutexHelper not found
**Solution:** Ensure mutex-helper.js is imported before gateway.js

### Issue: Circuit breaker not initialized
**Solution:** Check gateway constructor - circuit breaker should initialize automatically

### Issue: Tests fail in service worker
**Solution:** Ensure all scripts are loaded via importScripts()

### Issue: Storage quota check fails
**Solution:** Check chrome.storage.local.getBytesInUse is available

---

## 📚 Related Documentation

- `debug/INTEGRATION_COMPLETE.md` - Integration details
- `debug/EXECUTION_SUMMARY.md` - Execution summary
- `debug/epistemic-reliability-debugger.js` - Reliability validator

---

**Ready for Testing** ✅

