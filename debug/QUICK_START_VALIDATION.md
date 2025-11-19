# ⚡ Quick Start: Local Validation Script

**Purpose:** Validate fixes locally before debugging

---

## 🚀 3-Step Process

### Step 1: Load Scripts

In Chrome extension service worker console:

```javascript
importScripts('debug/chrome-extension-debugger.js');
importScripts('debug/epistemic-reliability-debugger.js');
importScripts('debug/local-validation-script.js');
```

### Step 2: Run Validation

```javascript
// Full validation (recommended)
await runLocalValidation();

// OR quick check (fast)
await quickValidationCheck();
```

### Step 3: Review Results

- ✅ Check diagnostic results
- ✅ Review epistemic score
- ✅ Apply fixes if needed
- ✅ Re-run until all pass

---

## 📊 What Gets Validated

1. **Diagnostic Checks** - Storage, network, auth, gateway, etc.
2. **Epistemic Reliability** - 9 critical patterns
3. **Integration** - MutexHelper, CircuitBreaker, Gateway, etc.

---

## ✅ Success Indicators

**Ready for Debugging:**
- ✅ All diagnostic checks pass
- ✅ All integration checks pass
- ✅ No high priority fixes needed
- ✅ Epistemic reliability ≥ 70%

---

## 🔧 If Fixes Needed

1. Review high priority fixes
2. Apply fixes to code
3. Reload extension
4. Re-run validation
5. Repeat until all pass

---

**Status:** ✅ Ready  
**Next:** Run validation before debugging

