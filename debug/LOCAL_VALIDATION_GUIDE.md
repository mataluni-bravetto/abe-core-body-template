# 🔍 Local Validation Script - Pre-Debugging Onboarding

**Purpose:** Validate fixes locally before debugging  
**Date:** 2025-11-18

---

## 🎯 Overview

The Local Validation Script provides a comprehensive pre-debugging validation tool that:

1. ✅ Runs diagnostic checks
2. ✅ Validates epistemic reliability patterns
3. ✅ Checks integration completeness
4. ✅ Provides actionable fix recommendations
5. ✅ Generates detailed reports

**Goal:** Ensure all fixes are validated locally before debugging begins.

---

## 🚀 Quick Start

### Step 1: Load Scripts

In Chrome extension service worker console:

```javascript
// Load debuggers first
importScripts('debug/chrome-extension-debugger.js');
importScripts('debug/epistemic-reliability-debugger.js');

// Load validation script
importScripts('debug/local-validation-script.js');
```

### Step 2: Run Validation

```javascript
// Full validation (comprehensive)
await runLocalValidation();

// Quick check (lightweight)
await quickValidationCheck();
```

---

## 📊 What Gets Validated

### 1. Diagnostic Checks
- Storage quota
- Network connectivity
- Authentication
- Gateway status
- Guard services
- Token refresh
- Error handling
- Performance
- Production readiness

### 2. Epistemic Reliability
- Statelessness pattern
- State rehydration
- Storage as truth
- Mutex patterns
- Token refresh mutex
- Circuit breaker
- Observability
- Invariant checking
- Termination awareness

### 3. Integration Validation
- MutexHelper availability
- CircuitBreaker availability
- Gateway initialization
- Token refresh method
- Storage quota method
- State rehydration pattern

---

## 📋 Expected Output

### Full Validation Report

```
🔍 Local Validation Script - Pre-Debugging Onboarding

======================================================================
📋 Step 1: Running Diagnostic Checks...

✅ Diagnostic checks completed
   Passed: 8
   Warnings: 1
   Failed: 0

🔬 Step 2: Running Epistemic Reliability Checks...

✅ Epistemic checks completed
   Score: 70.8%
   Points: 92/130
   Target Met: ⚠️ NO

🔗 Step 3: Validating Integration...

  ✅ MutexHelper available
  ✅ CircuitBreaker available
  ✅ Gateway initialized
  ✅ Circuit breaker integrated in gateway
  ✅ Token refresh method available
  ✅ Storage quota method available
  ✅ State rehydration pattern detected

🔧 Step 4: Generating Fix Recommendations...

✅ No fixes needed - all checks passed!

======================================================================
📊 LOCAL VALIDATION REPORT
======================================================================
Timestamp: 2025-11-18T...

DIAGNOSTIC CHECKS:
  ✅ Passed: 8
  ⚠️  Warnings: 1
  ❌ Failed: 0

EPISTEMIC RELIABILITY:
  Score: 70.8%
  Points: 92/130
  Target Met: ⚠️ NO

INTEGRATION STATUS:
  ✅ Mutex Helper
  ✅ Circuit Breaker
  ✅ Gateway
  ✅ Token Refresh
  ✅ Storage Quota
  ✅ State Rehydration

FIXES NEEDED:
  ✅ None - all checks passed!

======================================================================
⚠️  STATUS: MOSTLY READY
   Checks passed, but reliability score below target
======================================================================

NEXT STEPS:
1. ✅ All checks passed
2. ✅ Ready for debugging
3. Proceed with production testing
```

---

## 🔧 Fix Recommendations

If fixes are needed, the script will provide:

### High Priority Fixes
- Critical issues that must be fixed
- Blocks functionality
- Example: Missing MutexHelper import

### Medium Priority Fixes
- Important but not blocking
- Improves reliability
- Example: Missing storage quota method

### Low Priority Fixes
- Nice to have
- Optional enhancements
- Example: Additional observability

---

## ✅ Success Criteria

### Ready for Debugging When:
- ✅ All diagnostic checks pass
- ✅ All integration checks pass
- ✅ No high priority fixes needed
- ✅ Epistemic reliability ≥ 70%

### Production Ready When:
- ✅ All checks pass
- ✅ Epistemic reliability ≥ 97.8%
- ✅ No fixes needed

---

## 🎯 Use Cases

### Use Case 1: Pre-Debugging Validation
**Scenario:** Before starting debugging session  
**Action:** Run `await runLocalValidation()`  
**Goal:** Ensure all fixes are in place

### Use Case 2: Quick Status Check
**Scenario:** Quick check before testing  
**Action:** Run `await quickValidationCheck()`  
**Goal:** Fast validation of critical components

### Use Case 3: Fix Verification
**Scenario:** After applying fixes  
**Action:** Run `await runLocalValidation()`  
**Goal:** Verify fixes resolved issues

---

## 📝 Workflow

### Standard Workflow

1. **Apply Fixes**
   - Make code changes
   - Fix identified issues

2. **Reload Extension**
   - Reload extension in Chrome
   - Ensure changes are loaded

3. **Run Validation**
   ```javascript
   await runLocalValidation();
   ```

4. **Review Results**
   - Check diagnostic results
   - Review epistemic score
   - Review fix recommendations

5. **Iterate if Needed**
   - Apply additional fixes
   - Re-run validation
   - Repeat until all checks pass

6. **Proceed to Debugging**
   - Once all checks pass
   - Proceed with debugging
   - Run production tests

---

## 🔍 Quick Check Example

```javascript
// Quick validation (lightweight)
await quickValidationCheck();

// Output:
// ⚡ Quick Validation Check...
//
// Quick Status:
//   ✅ Mutex Helper
//   ✅ Circuit Breaker
//   ✅ Gateway
//   ✅ Diagnostic Debugger
//   ✅ Epistemic Debugger
//
// Status: ✅ READY
```

---

## 🐛 Troubleshooting

### Issue: "runAllDiagnostics is not defined"
**Solution:** Load chrome-extension-debugger.js first:
```javascript
importScripts('debug/chrome-extension-debugger.js');
```

### Issue: "runEpistemicChecks is not defined"
**Solution:** Load epistemic-reliability-debugger.js:
```javascript
importScripts('debug/epistemic-reliability-debugger.js');
```

### Issue: Validation shows errors
**Solution:** Review fix recommendations and apply fixes, then re-run validation.

---

## 📊 Report Structure

The validation report includes:

1. **Diagnostic Summary**
   - Passed/Warnings/Failed counts
   - Individual check results

2. **Epistemic Summary**
   - Reliability score
   - Points breakdown
   - Target status

3. **Integration Summary**
   - Component availability
   - Integration status
   - Missing components

4. **Fix Recommendations**
   - Prioritized fixes
   - Location and fix instructions
   - Priority levels

5. **Next Steps**
   - Action items
   - Workflow guidance

---

## ✅ Benefits

### For Developers
- ✅ Validate fixes before debugging
- ✅ Catch issues early
- ✅ Get actionable recommendations
- ✅ Save debugging time

### For QA
- ✅ Pre-validate before testing
- ✅ Ensure completeness
- ✅ Verify integration
- ✅ Document status

### For Onboarding
- ✅ Understand system status
- ✅ Learn about patterns
- ✅ See what's working
- ✅ Identify gaps

---

## 🎯 Integration with Workflow

### Before Debugging
```javascript
// Run validation
await runLocalValidation();

// Review results
// Apply fixes if needed
// Re-run until all pass
```

### After Fixes
```javascript
// Quick check
await quickValidationCheck();

// If ready, proceed
// If not, run full validation
```

### Before Production
```javascript
// Full validation
await runLocalValidation();

// Ensure all checks pass
// Verify reliability score
// Proceed to production testing
```

---

## 📚 Related Documentation

- `chrome-extension-debugger.js` - Diagnostic debugger
- `epistemic-reliability-debugger.js` - Reliability validator
- `PRODUCTION_TESTING_GUIDE.md` - Production testing guide

---

**Status:** ✅ Ready for Use  
**Purpose:** Pre-debugging validation  
**Next:** Run validation before debugging

