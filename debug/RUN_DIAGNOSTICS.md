# 🚀 Run Critical Diagnostics NOW

**Quick Start Guide**

---

## ⚡ 3-Step Process

### Step 1: Load Extension
```
Chrome → chrome://extensions/ → Developer mode → Load unpacked → AiGuardian-Chrome-Ext-dev
```

### Step 2: Open Service Worker Console
```
Find "AiGuardian" → Click "Inspect views: service worker"
```

### Step 3: Run Diagnostics

**Copy and paste:**

```javascript
// Load diagnostic script
importScripts('debug/critical-diagnostics.js');

// Run critical diagnostics
await runCriticalDiagnostics();
```

---

## 📊 What Gets Checked

1. ✅ Service Worker - Gateway initialization, imports
2. ✅ Gateway - Circuit breaker, error handling, endpoints
3. ✅ Authentication - Token availability, storage
4. ✅ Storage - API access, quota, mutex
5. ✅ Error Handling - Circuit breaker, error handler
6. ✅ Integration - Mutex, circuit breaker, guards
7. ✅ Epistemic Patterns - All reliability patterns

---

## ✅ Expected Output

```
🔍 Critical Diagnostics - AiGuardian Chrome Extension

======================================================================
📋 Checking Service Worker...
  ✅ Service Worker: No issues found

🔗 Checking Gateway...
  ✅ Gateway: No issues found

🔐 Checking Authentication...
  ⚠️ Authentication: No token (user not signed in - expected)

💾 Checking Storage...
  ✅ Storage: No issues found

🛡️ Checking Error Handling...
  ✅ Error Handling: No issues found

🔗 Checking Integration...
  ✅ Integration: No issues found

🔬 Checking Epistemic Patterns...
  ✅ Epistemic Patterns: No issues found

======================================================================
📊 CRITICAL DIAGNOSTICS REPORT
======================================================================
✅ STATUS: NO CRITICAL OR HIGH PRIORITY ISSUES
   Extension is in good shape!
======================================================================
```

---

## 🔍 Additional Diagnostics

### Guardian/Agent/Swarm Validation
```javascript
importScripts('debug/guardian-agent-swarm-validation.js');
await validateGuardiansAgentsSwarms();
```

### Epistemic Reliability Check
```javascript
importScripts('debug/simplified-epistemic-debugger.js');
await runSimplifiedEpistemicChecks();
```

### Quick Validation
```javascript
importScripts('debug/simplified-validation.js');
await runSimplifiedValidation();
```

---

**Ready to Run** ✅
