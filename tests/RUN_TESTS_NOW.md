# 🚀 Run Production Tests NOW

**Quick Reference for Chrome Extension Testing**

---

## ⚡ Execute in Chrome Extension

### Step 1: Load Extension
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select: `AiGuardian-Chrome-Ext-dev`

### Step 2: Open Service Worker Console
1. Find "AiGuardian" extension
2. Click "Inspect views: service worker"
3. DevTools console opens

### Step 3: Copy & Paste These Commands

```javascript
// Load test suite
importScripts('tests/production-test-suite.js');
importScripts('debug/epistemic-reliability-debugger.js');

// Run production tests
await runProductionTests();

// Run epistemic reliability checks  
const results = await runEpistemicChecks();
console.log('\n🎯 FINAL SCORE:', results.percentage + '%');
console.log('Target Met:', results.targetMet ? '✅ YES' : '❌ NO');
```

---

## ✅ Expected Output

```
🧪 Production Test Suite - Epistemic Reliability

============================================================
📋 Test 1: Mutex Helper Availability
  ✅ OK

📋 Test 2: Circuit Breaker Availability
  ✅ OK

📋 Test 3: Token Storage Mutex Protection
  ✅ OK

📋 Test 4: Storage Quota Monitoring
  ✅ OK

📋 Test 5: State Rehydration Pattern
  ✅ OK

📋 Test 6: Gateway Integration
  ✅ OK

============================================================
📊 PRODUCTION TEST REPORT
============================================================
SUMMARY:
  ✅ Passed: 6
  ⚠️  Warnings: 0
  ❌ Failed: 0

Pass Rate: 100%

============================================================
✅ All critical tests passed!

🔬 EPISTEMIC RELIABILITY REPORT
============================================================
Overall Score: 92/130 (70.8%)
Target (97.8%): ⚠️ NOT MET

🎯 FINAL SCORE: 70.8%
Target Met: ❌ NO
```

---

## 📊 Success Criteria

**Tests Pass When:**
- ✅ All 6 tests show ✅ OK
- ✅ Pass Rate: 100%
- ✅ Reliability Score: 70%+

**Ready for Production When:**
- ✅ All tests pass
- ✅ Score ≥ 70%
- ✅ No critical errors

---

## 🔍 Quick Checks

### Verify Mutex Helper
```javascript
typeof MutexHelper !== 'undefined' // Should be true
```

### Verify Circuit Breaker
```javascript
gateway.circuitBreaker.getState() // Should return state
```

### Verify Storage Quota
```javascript
await gateway.checkStorageQuota() // Should return quota info
```

---

## 📝 Document Results

After testing, note:
- **Pass Rate:** ___%
- **Reliability Score:** ___%
- **Status:** Ready / Needs Fixes

---

**Ready to Execute** ✅  
**Location:** Chrome Extension Service Worker Console

