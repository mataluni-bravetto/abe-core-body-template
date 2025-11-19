# 🎯 Epistemic Reliability Implementation Plan

**Based on:** "Epistemic Reliability and Architectural Resilience in Modern Chrome Extension Development"  
**Target:** 97.8% Reliability Architecture  
**Status:** Implementation In Progress

---

## 📊 Current State Analysis

### ✅ What We Have
1. **State Rehydration** - Partial (gateway loads config, but not all handlers rehydrate)
2. **Storage Usage** - Good (uses chrome.storage.local and sync)
3. **Error Handling** - Good (has try/catch, validation)
4. **Retry Logic** - Good (has retryAttempts configuration)
5. **Telemetry** - Good (has traceStats and logging)

### ❌ Critical Missing Patterns

1. **Mutex/Locks** - ❌ No navigator.locks usage for storage mutations
2. **Token Refresh Mutex** - ❌ No serialization of token refresh on 401
3. **Circuit Breaker** - ❌ No circuit breaker for network failures
4. **Observability APIs** - ❌ No ReportingObserver or PerformanceObserver
5. **Invariant Checking** - ⚠️ Partial (has validation but no formal invariants)
6. **Termination Testing** - ❌ No explicit termination tests

---

## 🚀 Implementation Roadmap

### Phase 1: Critical Concurrency Fixes (HIGH PRIORITY)

#### 1.1 Implement Mutex for Storage Mutations
**File:** `src/gateway.js`  
**Pattern:** Wrap all storage.set operations in navigator.locks.request()

```javascript
// Before (race condition risk):
await chrome.storage.local.set({ count: newCount });

// After (mutex-protected):
await navigator.locks.request('storage_update', async (lock) => {
  const data = await chrome.storage.local.get(['count']);
  const newCount = (data.count || 0) + 1;
  await chrome.storage.local.set({ count: newCount });
});
```

**Impact:** Prevents data loss from concurrent events  
**Effort:** 2-3 hours  
**Priority:** CRITICAL

#### 1.2 Implement Token Refresh Mutex
**File:** `src/gateway.js`  
**Pattern:** Serialize token refresh on 401 errors

```javascript
// Add to sendToGateway() method
if (response.status === 401) {
  // Acquire lock for token refresh
  await navigator.locks.request('token_refresh', async (lock) => {
    // Check if another request already refreshed
    const currentToken = await this.getClerkSessionToken();
    if (currentToken === clerkToken) {
      // We're the first - refresh token
      const newToken = await this.refreshClerkToken();
      if (newToken) {
        headers['Authorization'] = 'Bearer ' + newToken;
        // Retry request with new token
        return await fetch(url, { ...requestOptions, headers });
      }
    } else {
      // Another request refreshed - use new token
      headers['Authorization'] = 'Bearer ' + currentToken;
      return await fetch(url, { ...requestOptions, headers });
    }
  });
}
```

**Impact:** Prevents thundering herd on token expiration  
**Effort:** 3-4 hours  
**Priority:** CRITICAL

---

### Phase 2: Resilience Patterns (HIGH PRIORITY)

#### 2.1 Implement Circuit Breaker
**File:** `src/circuit-breaker.js` (new file)  
**Pattern:** Fail-fast on persistent backend failures

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN - backend unavailable');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}
```

**Integration:** Wrap fetch calls in gateway.js  
**Impact:** Prevents infinite retries on backend outages  
**Effort:** 4-5 hours  
**Priority:** HIGH

#### 2.2 Add Token Refresh Method
**File:** `src/gateway.js`  
**Pattern:** Implement refreshClerkToken() method

```javascript
async refreshClerkToken() {
  try {
    // Try to get fresh token from Clerk SDK (if in window context)
    if (typeof window !== 'undefined' && window.Clerk) {
      const clerk = window.Clerk;
      const session = await clerk.session;
      if (session) {
        const newToken = await session.getToken();
        if (newToken) {
          await this.storeClerkToken(newToken);
          return newToken;
        }
      }
    }
    
    // Fallback: return null (user must re-authenticate)
    return null;
  } catch (error) {
    Logger.error('[Gateway] Token refresh failed:', error);
    return null;
  }
}
```

**Impact:** Enables automatic token refresh  
**Effort:** 1-2 hours  
**Priority:** HIGH

---

### Phase 3: Observability (MEDIUM PRIORITY)

#### 3.1 Add ReportingObserver
**File:** `src/observability.js` (new file)  
**Pattern:** Monitor browser violations and deprecations

```javascript
class ObservabilityManager {
  constructor() {
    this.setupReportingObserver();
    this.setupPerformanceObserver();
  }

  setupReportingObserver() {
    if (typeof ReportingObserver !== 'undefined') {
      const observer = new ReportingObserver((reports) => {
        reports.forEach(report => {
          Logger.warn('[Observability] Browser report:', {
            type: report.type,
            url: report.url,
            body: report.body
          });
        });
      });
      observer.observe();
    }
  }

  setupPerformanceObserver() {
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.duration > 50) { // Long task threshold
            Logger.warn('[Observability] Long task detected:', {
              name: entry.name,
              duration: entry.duration
            });
          }
        });
      });
      observer.observe({ entryTypes: ['longtask', 'measure'] });
    }
  }
}
```

**Integration:** Initialize in service-worker.js  
**Impact:** Early detection of browser violations  
**Effort:** 2-3 hours  
**Priority:** MEDIUM

#### 3.2 Add Invariant Checking
**File:** `src/invariants.js` (new file)  
**Pattern:** Design by contract

```javascript
function invariant(condition, message) {
  if (!condition) {
    const error = new Error(`Invariant violation: ${message}`);
    Logger.error('[Invariant]', error);
    throw error;
  }
}

// Usage:
invariant(tabId != null, 'Tab ID is required');
invariant(typeof text === 'string', 'Text must be a string');
```

**Integration:** Add to critical paths in gateway.js and service-worker.js  
**Impact:** Fail-fast on impossible states  
**Effort:** 2-3 hours  
**Priority:** MEDIUM

---

### Phase 4: Testing & Validation (HIGH PRIORITY)

#### 4.1 Add Termination Test
**File:** `tests/termination-test.js` (new file)  
**Pattern:** Explicitly test service worker termination

```javascript
// Using Puppeteer
test('survives service worker termination', async () => {
  // 1. Perform action that sets state
  await performLogin();
  
  // 2. Kill service worker
  await page.evaluate(() => {
    chrome.runtime.sendMessage({ type: 'KILL_SERVICE_WORKER' });
  });
  
  // 3. Wait for termination
  await page.waitForTimeout(5000);
  
  // 4. Trigger new event
  await triggerAnalysis();
  
  // 5. Assert: State should be rehydrated
  const state = await getState();
  expect(state.isAuthenticated).toBe(true);
});
```

**Impact:** Validates rehydration pattern  
**Effort:** 3-4 hours  
**Priority:** HIGH

#### 4.2 Add Storage Quota Monitoring
**File:** `src/gateway.js`  
**Pattern:** Check quota before writes

```javascript
async checkStorageQuota() {
  return new Promise((resolve) => {
    chrome.storage.local.getBytesInUse(null, (bytes) => {
      const quota = chrome.storage.local.QUOTA_BYTES || 5242880; // 5MB default
      const usagePercent = (bytes / quota) * 100;
      
      if (usagePercent > 90) {
        Logger.warn('[Storage] Quota nearly exceeded:', {
          bytes,
          quota,
          usagePercent: usagePercent.toFixed(2) + '%'
        });
      }
      
      resolve({ bytes, quota, usagePercent });
    });
  });
}
```

**Impact:** Prevents silent write failures  
**Effort:** 1 hour  
**Priority:** MEDIUM

---

## 📋 Implementation Checklist

### Critical (Must Have)
- [ ] **Mutex for storage mutations** - Prevent race conditions
- [ ] **Token refresh mutex** - Prevent thundering herd
- [ ] **Circuit breaker** - Fail-fast on backend outages
- [ ] **Token refresh method** - Enable automatic refresh

### High Priority
- [ ] **Termination test** - Validate rehydration
- [ ] **Storage quota monitoring** - Prevent silent failures
- [ ] **Enhanced state rehydration** - All handlers rehydrate

### Medium Priority
- [ ] **ReportingObserver** - Browser violation detection
- [ ] **PerformanceObserver** - Performance monitoring
- [ ] **Invariant checking** - Design by contract

---

## 🎯 Success Metrics

### Target: 97.8% Reliability Score

**Scoring Breakdown:**
- Statelessness: 20 points
- State Rehydration: 15 points
- Storage as Truth: 15 points
- Mutex Patterns: 20 points
- Token Refresh Mutex: 15 points
- Circuit Breaker: 10 points
- Observability: 10 points
- Invariant Checking: 10 points
- Termination Awareness: 15 points

**Total:** 130 points  
**Target:** 127+ points (97.8%)

---

## 🚀 Next Steps

1. **Immediate:** Implement mutex patterns (Phase 1)
2. **This Week:** Add circuit breaker and token refresh (Phase 2)
3. **Next Week:** Add observability and testing (Phases 3-4)
4. **Validation:** Run epistemic reliability debugger to verify improvements

---

**Last Updated:** 2025-11-18  
**Status:** Ready for Implementation

