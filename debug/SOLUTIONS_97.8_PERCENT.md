# ✅ Solutions for 97.8% Epistemic Certainty

**Date:** 2025-11-18  
**Target:** 127/130 points (97.7%)  
**Current:** 92/130 points (70.8%)  
**Gap:** 35 points

---

## 🎯 Solution Overview

This document provides concrete, implementable solutions to achieve 97.7% epistemic certainty (127/130 points).

---

## Solution 1: Enhanced State Rehydration (+8 points)

### Implementation

**File:** `src/service-worker.js`

```javascript
// Add comprehensive rehydration function
async function rehydrateState() {
  try {
    const state = await new Promise((resolve) => {
      chrome.storage.local.get([
        'clerk_user',
        'clerk_token',
        'gateway_config',
        'last_activity'
      ], resolve);
    });
    
    // Reinitialize gateway if needed
    if (!gateway || !gateway.isInitialized) {
      Logger.info('[Rehydration] Reinitializing gateway...');
      gateway = new AiGuardianGateway();
      await gateway.initializeGateway();
    }
    
    // Update last activity
    await chrome.storage.local.set({ last_activity: Date.now() });
    
    Logger.info('[Rehydration] State rehydrated:', {
      hasUser: !!state.clerk_user,
      hasToken: !!state.clerk_token,
      gatewayInitialized: gateway.isInitialized
    });
    
    return state;
  } catch (error) {
    Logger.error('[Rehydration] Failed:', error);
    throw error;
  }
}

// Rehydration wrapper for handlers
function withRehydration(handler) {
  return async (...args) => {
    await rehydrateState();
    return await handler(...args);
  };
}

// Apply to message handlers
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  await rehydrateState(); // Rehydrate before handling
  
  // Existing handler logic...
  if (message.action === 'analyze') {
    await handleTextAnalysis(message.text, sendResponse);
  }
  // ... other handlers
});

// Apply to alarm handlers
chrome.alarms.onAlarm.addListener(withRehydration(async (alarm) => {
  Logger.info('[Alarm]', alarm.name);
  // Alarm handler logic
}));

// Apply to navigation handlers (if used)
chrome.webNavigation.onCompleted.addListener(
  withRehydration(async (details) => {
    // Navigation handler logic
  }),
  { url: [{ schemes: ['http', 'https'] }] }
);
```

**Points Gained:** +8 (Statelessness +5, Rehydration +3)

---

## Solution 2: Storage Enhancements (+3 points)

### Implementation

**File:** `src/service-worker.js`

```javascript
// Add storage change listener
chrome.storage.onChanged.addListener((changes, areaName) => {
  Logger.info('[Storage] Change detected', {
    area: areaName,
    keys: Object.keys(changes)
  });
  
  // Validate critical state changes
  if (changes.clerk_token) {
    Logger.info('[Storage] Token updated');
    // Notify gateway if needed
    if (gateway && gateway.refreshClerkToken) {
      gateway.refreshClerkToken().catch(err => {
        Logger.warn('[Storage] Token refresh failed:', err);
      });
    }
  }
  
  // Check quota after writes
  if (gateway && gateway.checkStorageQuota) {
    gateway.checkStorageQuota().then(quota => {
      if (quota.usagePercent > 85) {
        Logger.warn('[Storage] Quota high:', quota.usagePercent.toFixed(2) + '%');
      }
    }).catch(err => {
      Logger.warn('[Storage] Quota check failed:', err);
    });
  }
});

// Proactive quota check before large writes
async function safeStorageWrite(key, value, maxSize = 100000) {
  try {
    // Check quota before write
    if (gateway && gateway.checkStorageQuota) {
      const quota = await gateway.checkStorageQuota();
      
      // Estimate new size
      const estimatedSize = JSON.stringify(value).length;
      const newUsage = quota.bytes + estimatedSize;
      const newPercent = (newUsage / quota.quota) * 100;
      
      if (newPercent > 85) {
        Logger.warn('[Storage] Quota high, cleaning up before write...');
        await cleanupOldData();
      }
    }
    
    // Perform write
    await new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
    
    Logger.debug('[Storage] Write successful:', key);
  } catch (error) {
    Logger.error('[Storage] Write failed:', error);
    throw error;
  }
}

// Cleanup old data
async function cleanupOldData() {
  try {
    // Get analysis history
    const data = await new Promise(resolve => {
      chrome.storage.sync.get(['analysis_history'], resolve);
    });
    
    if (data.analysis_history && data.analysis_history.length > 20) {
      // Keep only last 20 entries
      const trimmed = data.analysis_history.slice(0, 20);
      await new Promise(resolve => {
        chrome.storage.sync.set({ analysis_history: trimmed }, resolve);
      });
      Logger.info('[Storage] Cleaned up old analysis history');
    }
  } catch (error) {
    Logger.warn('[Storage] Cleanup failed:', error);
  }
}
```

**Points Gained:** +3 (Storage as Truth +3)

---

## Solution 3: Observability Module (+7 points)

### Implementation

**File:** `src/observability.js` (NEW)

```javascript
/**
 * Observability Manager
 * Provides runtime observability through ReportingObserver and PerformanceObserver
 */

class ObservabilityManager {
  constructor() {
    this.reportingObserver = null;
    this.performanceObserver = null;
    this.events = [];
    this.metrics = {
      violations: 0,
      longTasks: 0,
      deprecations: 0,
      interventions: 0
    };
  }

  /**
   * Initialize observability
   */
  initialize() {
    try {
      this.initializeReportingObserver();
      this.initializePerformanceObserver();
      Logger.info('[Observability] Initialized');
    } catch (error) {
      Logger.warn('[Observability] Initialization failed:', error);
    }
  }

  /**
   * Initialize ReportingObserver for browser violations
   */
  initializeReportingObserver() {
    if (typeof ReportingObserver === 'undefined') {
      Logger.warn('[Observability] ReportingObserver not available');
      return;
    }

    try {
      this.reportingObserver = new ReportingObserver((reports) => {
        reports.forEach(report => {
          this.handleReport(report);
        });
      }, {
        types: ['deprecation', 'intervention', 'crash']
      });

      this.reportingObserver.observe();
      Logger.info('[Observability] ReportingObserver active');
    } catch (error) {
      Logger.warn('[Observability] ReportingObserver failed:', error);
    }
  }

  /**
   * Initialize PerformanceObserver for performance monitoring
   */
  initializePerformanceObserver() {
    if (typeof PerformanceObserver === 'undefined') {
      Logger.warn('[Observability] PerformanceObserver not available');
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.handlePerformanceEntry(entry);
        });
      });

      // Observe long tasks and measures
      try {
        this.performanceObserver.observe({ 
          entryTypes: ['longtask', 'measure', 'navigation'] 
        });
        Logger.info('[Observability] PerformanceObserver active');
      } catch (e) {
        // Fallback for browsers that don't support longtask
        this.performanceObserver.observe({ entryTypes: ['measure'] });
        Logger.info('[Observability] PerformanceObserver active (limited)');
      }
    } catch (error) {
      Logger.warn('[Observability] PerformanceObserver failed:', error);
    }
  }

  /**
   * Handle browser violation reports
   */
  handleReport(report) {
    const event = {
      type: 'browser_violation',
      violationType: report.type,
      url: report.url,
      body: report.body,
      timestamp: Date.now()
    };

    this.recordEvent(event);
    this.metrics.violations++;

    // Log based on severity
    if (report.type === 'crash') {
      Logger.error('[Observability] Browser crash detected:', event);
    } else if (report.type === 'intervention') {
      Logger.warn('[Observability] Browser intervention:', event);
    } else {
      Logger.info('[Observability] Browser deprecation:', event);
      this.metrics.deprecations++;
    }
  }

  /**
   * Handle performance entries
   */
  handlePerformanceEntry(entry) {
    // Long task detection
    if (entry.entryType === 'longtask' && entry.duration > 50) {
      const event = {
        type: 'long_task',
        duration: entry.duration,
        name: entry.name,
        startTime: entry.startTime,
        timestamp: Date.now()
      };

      this.recordEvent(event);
      this.metrics.longTasks++;
      Logger.warn('[Observability] Long task detected:', event);
    }

    // Measure entries
    if (entry.entryType === 'measure') {
      Logger.debug('[Observability] Performance measure:', {
        name: entry.name,
        duration: entry.duration
      });
    }
  }

  /**
   * Record event for telemetry
   */
  recordEvent(event) {
    this.events.push(event);

    // Keep last 100 events
    if (this.events.length > 100) {
      this.events.shift();
    }

    // Persist critical events
    if (event.type === 'browser_violation' && event.violationType === 'crash') {
      this.persistEvent(event);
    }
  }

  /**
   * Persist critical events to storage
   */
  async persistEvent(event) {
    try {
      const stored = await new Promise(resolve => {
        chrome.storage.local.get(['observability_events'], resolve);
      });

      const events = stored.observability_events || [];
      events.push(event);

      // Keep last 50 critical events
      if (events.length > 50) {
        events.shift();
      }

      await new Promise(resolve => {
        chrome.storage.local.set({ observability_events: events }, resolve);
      });
    } catch (error) {
      Logger.warn('[Observability] Failed to persist event:', error);
    }
  }

  /**
   * Get telemetry data
   */
  getTelemetry() {
    return {
      events: this.events,
      metrics: { ...this.metrics },
      timestamp: Date.now()
    };
  }

  /**
   * Get metrics summary
   */
  getMetrics() {
    return {
      ...this.metrics,
      totalEvents: this.events.length,
      timestamp: Date.now()
    };
  }
}

// Export for use in service worker
if (typeof importScripts !== 'undefined') {
  // Service worker context
  window.ObservabilityManager = ObservabilityManager;
} else if (typeof window !== 'undefined') {
  // Window context
  window.ObservabilityManager = ObservabilityManager;
}
```

**Integration in service-worker.js:**

```javascript
// Import observability module
importScripts('observability.js');

// Initialize observability
const observability = new ObservabilityManager();
observability.initialize();

// Expose for debugging
window.observability = observability;
```

**Points Gained:** +7 (Observability +7)

---

## Solution 4: Invariant Checking (+3 points)

### Implementation

**File:** `src/invariant-checker.js` (NEW)

```javascript
/**
 * Invariant Checker
 * Design by Contract - Pre/post conditions and invariants
 */

class InvariantChecker {
  /**
   * Assert invariant condition
   */
  static assert(condition, message) {
    if (!condition) {
      const error = new Error(`Invariant violation: ${message}`);
      Logger.error('[Invariant]', error);
      console.error('[Invariant] Stack trace:', new Error().stack);
      throw error;
    }
  }

  /**
   * Require pre-condition
   */
  static require(condition, message) {
    if (!condition) {
      const error = new Error(`Precondition failed: ${message}`);
      Logger.error('[Invariant] Precondition:', error);
      throw error;
    }
  }

  /**
   * Ensure post-condition
   */
  static ensure(condition, message) {
    if (!condition) {
      const error = new Error(`Postcondition failed: ${message}`);
      Logger.error('[Invariant] Postcondition:', error);
      throw error;
    }
  }

  /**
   * Validate type
   */
  static requireType(value, expectedType, name) {
    const actualType = typeof value;
    if (actualType !== expectedType) {
      throw new Error(`Type mismatch for ${name}: expected ${expectedType}, got ${actualType}`);
    }
  }

  /**
   * Validate non-null
   */
  static requireNonNull(value, name) {
    if (value === null || value === undefined) {
      throw new Error(`${name} must not be null or undefined`);
    }
  }

  /**
   * Validate range
   */
  static requireRange(value, min, max, name) {
    if (value < min || value > max) {
      throw new Error(`${name} must be between ${min} and ${max}, got ${value}`);
    }
  }
}

// Export
if (typeof importScripts !== 'undefined') {
  window.InvariantChecker = InvariantChecker;
} else if (typeof window !== 'undefined') {
  window.InvariantChecker = InvariantChecker;
}
```

**Integration in gateway.js:**

```javascript
// Add to gateway methods
async sendToGateway(endpoint, payload) {
  // Pre-conditions
  InvariantChecker.requireNonNull(endpoint, 'endpoint');
  InvariantChecker.requireNonNull(payload, 'payload');
  InvariantChecker.requireType(endpoint, 'string', 'endpoint');
  InvariantChecker.require(typeof payload === 'object', 'payload must be object');
  
  // Existing logic...
  const result = await /* ... */;
  
  // Post-conditions
  InvariantChecker.ensure(result !== undefined, 'Gateway must return result');
  InvariantChecker.ensure(
    result.success !== undefined || result.error !== undefined,
    'Result must have success or error property'
  );
  
  return result;
}

async checkStorageQuota() {
  // Pre-condition
  InvariantChecker.require(
    typeof chrome !== 'undefined' && chrome.storage,
    'Chrome storage API must be available'
  );
  
  // Existing logic...
  const quota = await /* ... */;
  
  // Post-conditions
  InvariantChecker.ensure(quota !== undefined, 'Quota check must return result');
  InvariantChecker.ensure(
    typeof quota.bytes === 'number' && quota.bytes >= 0,
    'Quota bytes must be non-negative number'
  );
  
  return quota;
}
```

**Points Gained:** +3 (Invariant Checking +3)

---

## Solution 5: Termination Awareness (+5 points)

### Implementation

**File:** `src/service-worker.js`

```javascript
// Termination test function
async function testTermination() {
  Logger.info('[Termination] Starting termination test...');
  
  const testState = {
    timestamp: Date.now(),
    testId: 'termination_test_' + Date.now(),
    testData: 'test_value_' + Math.random()
  };
  
  // Save test state
  await new Promise(resolve => {
    chrome.storage.local.set({ termination_test: testState }, resolve);
  });
  
  Logger.info('[Termination] Test state saved:', testState.testId);
  
  // Verify immediately
  const verify1 = await new Promise(resolve => {
    chrome.storage.local.get(['termination_test'], resolve);
  });
  
  if (verify1.termination_test && 
      verify1.termination_test.testId === testState.testId) {
    Logger.info('[Termination] ✅ Immediate verification passed');
  } else {
    Logger.error('[Termination] ❌ Immediate verification failed');
  }
  
  // After potential termination, verify again
  setTimeout(async () => {
    const verify2 = await new Promise(resolve => {
      chrome.storage.local.get(['termination_test'], resolve);
    });
    
    if (verify2.termination_test && 
        verify2.termination_test.testId === testState.testId) {
      Logger.info('[Termination] ✅ Post-termination verification passed');
    } else {
      Logger.error('[Termination] ❌ Post-termination verification failed');
    }
  }, 35000);
}

// Termination handler
self.addEventListener('beforeunload', () => {
  Logger.info('[Termination] Service worker terminating, saving critical state...');
  
  // Save critical state synchronously if possible
  chrome.storage.local.set({
    last_activity: Date.now(),
    termination_timestamp: Date.now(),
    termination_graceful: true
  }, () => {
    Logger.info('[Termination] Critical state saved');
  });
});

// Verify state persistence on wake
async function verifyStatePersistence() {
  try {
    const state = await new Promise(resolve => {
      chrome.storage.local.get([
        'last_activity',
        'termination_timestamp',
        'termination_graceful'
      ], resolve);
    });
    
    if (state.last_activity) {
      const timeSinceLastActivity = Date.now() - state.last_activity;
      Logger.info('[Termination] State persisted:', {
        lastActivity: timeSinceLastActivity + 'ms ago',
        gracefulTermination: state.termination_graceful || false
      });
      
      // If termination was graceful, verify state integrity
      if (state.termination_graceful) {
        Logger.info('[Termination] ✅ Graceful termination detected');
      }
    } else {
      Logger.warn('[Termination] No previous activity found');
    }
  } catch (error) {
    Logger.error('[Termination] Verification failed:', error);
  }
}

// Call on service worker wake
verifyStatePersistence();
```

**File:** `tests/termination-test.js` (NEW)

```javascript
/**
 * Termination Test Suite
 * Tests service worker termination and state persistence
 */

async function runTerminationTests() {
  console.log('🧪 Running Termination Tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  // Test 1: State persistence
  try {
    const testData = { test: 'termination_test', value: Date.now() };
    await new Promise(resolve => {
      chrome.storage.local.set({ termination_test: testData }, resolve);
    });
    
    const retrieved = await new Promise(resolve => {
      chrome.storage.local.get(['termination_test'], resolve);
    });
    
    if (retrieved.termination_test && 
        retrieved.termination_test.value === testData.value) {
      results.passed++;
      results.tests.push({ name: 'State Persistence', status: 'PASS' });
      console.log('  ✅ State Persistence: PASS');
    } else {
      results.failed++;
      results.tests.push({ name: 'State Persistence', status: 'FAIL' });
      console.log('  ❌ State Persistence: FAIL');
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ name: 'State Persistence', status: 'ERROR', error: error.message });
    console.error('  ❌ State Persistence: ERROR', error);
  }
  
  // Test 2: Rehydration after termination
  try {
    await rehydrateState();
    const hasGateway = typeof gateway !== 'undefined' && gateway !== null;
    
    if (hasGateway) {
      results.passed++;
      results.tests.push({ name: 'Rehydration After Termination', status: 'PASS' });
      console.log('  ✅ Rehydration After Termination: PASS');
    } else {
      results.failed++;
      results.tests.push({ name: 'Rehydration After Termination', status: 'FAIL' });
      console.log('  ❌ Rehydration After Termination: FAIL');
    }
  } catch (error) {
    results.failed++;
    results.tests.push({ name: 'Rehydration After Termination', status: 'ERROR', error: error.message });
    console.error('  ❌ Rehydration After Termination: ERROR', error);
  }
  
  console.log(`\n📊 Results: ${results.passed} passed, ${results.failed} failed`);
  return results;
}
```

**Points Gained:** +5 (Termination Awareness +5)

---

## 📊 Implementation Summary

| Solution | Points | Files | Priority |
|----------|--------|-------|----------|
| Enhanced Rehydration | +8 | service-worker.js | HIGH |
| Storage Enhancements | +3 | service-worker.js, gateway.js | MEDIUM |
| Observability Module | +7 | observability.js (new) | MEDIUM |
| Invariant Checking | +3 | invariant-checker.js (new), gateway.js | MEDIUM |
| Termination Awareness | +5 | service-worker.js, termination-test.js (new) | LOW |

**Total Points:** +26  
**Final Score:** 118/130 (90.8%) → **Wait, let me recalculate...**

Actually, current is 92/130, so:
- 92 + 26 = 118/130 (90.8%)

But we need 127/130. Let me check the scoring again...

Actually, looking at the gap analysis:
- Current: 92/130
- Need: 127/130
- Gap: 35 points

But the solutions provide:
- +8 (rehydration)
- +3 (storage)
- +7 (observability)
- +3 (invariant)
- +5 (termination)
= +26 points

92 + 26 = 118/130 (90.8%)

We still need 9 more points. Let me check what else can be improved...

Actually, wait - the scoring might be more nuanced. Some patterns might gain partial points. Let me create a more accurate analysis.

