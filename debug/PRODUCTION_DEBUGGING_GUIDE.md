# Production Debugging Guide - Chrome Extensions

**Version:** 1.0.0  
**Status:** Production Ready  
**Pattern:** AEYON × DEBUGGING × ATOMIC × ONE

---

## 🎯 Overview

This guide provides a systematic, programmatic approach to debugging production-grade Chrome extensions. It covers:

1. **Automated Diagnostics** - Comprehensive health checks
2. **Storage Management** - Quota prevention and optimization
3. **Error Tracking** - Systematic error detection and reporting
4. **Performance Monitoring** - Response time and resource usage
5. **Production Readiness** - Pre-release validation

---

## 🚀 Quick Start

### Step 1: Load Debugging Tools

**Service Worker:**
```javascript
// Open: chrome://extensions/ → Extension → Service Worker
importScripts('debug/chrome-extension-debugger.js');
importScripts('debug/storage-quota-manager.js');
```

**Popup:**
```javascript
// Right-click extension → Inspect popup
// Load scripts via console or inject into popup.html
```

### Step 2: Run Diagnostics

```javascript
// Run all diagnostics
const results = await runDiagnostics();

// Or create custom instance
const debugger = new ChromeExtensionDebugger('service-worker');
await debugger.runAllDiagnostics();
const report = debugger.getResults();
```

### Step 3: Review Results

```javascript
// View report in console
debugger.generateReport();

// Export for analysis
const json = debugger.exportResults();
console.log(json);
```

---

## 🔍 Diagnostic Checks

### 1. Storage Quota Check

**What it checks:**
- Local storage usage (10MB limit)
- Sync storage usage (1MB limit)
- Individual item sizes (8KB limit)
- Quota warnings (>90% usage)

**Example Output:**
```javascript
{
  name: 'Storage Quota',
  status: 'warning',
  details: {
    localUsage: 5242880,
    localUsageMB: '5.00',
    localUsagePercent: '50.00',
    itemQuotaKB: '8.00'
  },
  issues: ['Item "last_analysis" exceeds 8KB limit: 9.2KB']
}
```

**Fix:**
```javascript
// Use Storage Quota Manager
await StorageQuotaManager.store('last_analysis', data, 'local', {
  essentialFields: ['score', 'bias_type', 'timestamp'],
  compress: true
});
```

### 2. Network Connectivity Check

**What it checks:**
- Gateway connection status
- Health endpoint response
- Response times
- Network errors

**Example Output:**
```javascript
{
  name: 'Network Connectivity',
  status: 'ok',
  details: {
    gatewayConnection: {
      connected: true,
      responseTime: 78
    },
    healthEndpoint: {
      status: 200,
      ok: true,
      responseTime: 82
    }
  }
}
```

**Fix:**
- Check gateway URL configuration
- Verify network connectivity
- Check firewall/proxy settings

### 3. Authentication Check

**What it checks:**
- Stored user data
- Token availability
- Token expiration
- Authentication state

**Example Output:**
```javascript
{
  name: 'Authentication',
  status: 'warning',
  details: {
    hasStoredUser: true,
    hasStoredToken: true,
    tokenExpiration: {
      expiresIn: 1800000,
      expiresInMinutes: 30,
      isExpired: false
    }
  },
  issues: ['Token expires soon (< 1 hour)']
}
```

**Fix:**
- Implement token refresh logic
- Check authentication flow
- Verify token storage

### 4. Gateway Status Check

**What it checks:**
- Gateway initialization
- Connection status
- Configuration
- Message passing

**Example Output:**
```javascript
{
  name: 'Gateway Status',
  status: 'ok',
  details: {
    gatewayInitialized: true,
    status: {
      connected: true,
      gateway_url: 'https://api.aiguardian.ai'
    }
  }
}
```

**Fix:**
- Ensure gateway initializes before use
- Check gateway URL configuration
- Verify message passing

### 5. Error Handling Check

**What it checks:**
- Error handler availability
- Common error patterns
- Error handling coverage

**Example Output:**
```javascript
{
  name: 'Error Handling',
  status: 'ok',
  details: {
    errorHandlerAvailable: true,
    commonErrorPatterns: ['quota', '401', '404', 'timeout']
  }
}
```

**Fix:**
- Ensure error handler is loaded
- Check error handling coverage
- Review error messages

### 6. Performance Check

**What it checks:**
- Gateway response time
- Storage read/write performance
- Overall performance metrics

**Example Output:**
```javascript
{
  name: 'Performance',
  status: 'ok',
  details: {
    metrics: {
      gatewayResponseTime: 78,
      storageReadTime: 12,
      storageWriteTime: 15
    }
  }
}
```

**Fix:**
- Optimize slow operations
- Cache frequently accessed data
- Review network requests

### 7. Production Readiness Check

**What it checks:**
- Aggregates all diagnostic results
- Identifies critical issues
- Generates recommendations

**Example Output:**
```javascript
{
  name: 'Production Readiness',
  status: 'warning',
  details: {
    checks: [
      { name: 'Storage Quota', status: 'pass' },
      { name: 'Gateway Connectivity', status: 'pass' },
      { name: 'Authentication', status: 'warning' },
      { name: 'Error Handling', status: 'pass' },
      { name: 'Performance', status: 'pass' }
    ]
  },
  recommendations: [
    {
      category: 'Authentication',
      priority: 'MEDIUM',
      message: 'Implement token refresh logic',
      action: 'Add automatic token refresh on 401 errors'
    }
  ]
}
```

---

## 🛠️ Storage Quota Manager

### Usage

```javascript
// Store with quota management
await StorageQuotaManager.store('key', data, 'local', {
  essentialFields: ['field1', 'field2'],
  compress: true,
  cleanupOld: true,
  maxSize: 7000 // bytes
});

// Get usage statistics
const stats = await StorageQuotaManager.getUsageStats('local');
console.log(`Usage: ${stats.usagePercent}%`);
console.log(`Largest item: ${stats.largestItem[0]} (${stats.largestItem[1]} bytes)`);
```

### Features

- **Automatic Compression** - Removes unnecessary fields
- **Size Validation** - Checks before storing
- **Quota Management** - Cleans up old data automatically
- **Error Recovery** - Handles quota exceeded errors gracefully

### Integration Example

**Before:**
```javascript
chrome.storage.local.set({ last_analysis: analysisResult });
```

**After:**
```javascript
importScripts('debug/storage-quota-manager.js');

const essentialData = {
  score: analysisResult.score,
  bias_type: analysisResult.analysis?.bias_type,
  timestamp: Date.now(),
  success: analysisResult.success !== false
};

await StorageQuotaManager.store('last_analysis', essentialData, 'local', {
  essentialFields: ['score', 'bias_type', 'timestamp', 'success'],
  compress: true,
  cleanupOld: true
});
```

---

## 📊 Production Fixes

### Fix 1: Storage Quota Management (CRITICAL)

**Problem:** `Resource::kQuotaBytesPerItem quota exceeded`

**Solution:**
1. Use Storage Quota Manager for all storage operations
2. Store only essential data
3. Compress large data before storage
4. Clean up old data automatically

**Implementation:**
```javascript
// In service-worker.js
importScripts('debug/storage-quota-manager.js');

// Replace direct storage calls
await StorageQuotaManager.store('last_analysis', analysisResult, 'local', {
  essentialFields: ['score', 'bias_type', 'timestamp', 'success'],
  compress: true,
  cleanupOld: true
});
```

### Fix 2: Central Logger 404 Errors

**Problem:** `HTTP 404` from `/logging` endpoint

**Solution:**
- Suppress 404 errors for optional logging endpoint
- Make logging failures non-blocking

**Implementation:**
```javascript
// In gateway.js
const logMethod = async (level, message, metadata = {}) => {
  try {
    await this.sendToGateway('logging', { level, message, metadata });
  } catch (err) {
    if (err.message && err.message.includes('404')) {
      Logger.debug('[Central Logger] Logging endpoint not available (404)');
    } else {
      Logger.error('[Central Logger] Failed to send log:', err);
    }
  }
};
```

### Fix 3: Text Analysis Validation

**Problem:** Analyzing error messages or invalid text

**Solution:**
- Validate text before analysis
- Check authentication
- Detect error messages

**Implementation:**
```javascript
// In service-worker.js
async function handleTextAnalysis(text, sendResponse) {
  // Validate text
  if (!text || text.trim().length === 0) {
    sendResponse({ success: false, error: 'No text provided' });
    return;
  }

  // Check for error messages
  if (text.includes('Error ') && text.includes('redirect_uri_mismatch')) {
    sendResponse({ 
      success: false, 
      error: 'This appears to be an error message. Please configure OAuth settings first.' 
    });
    return;
  }

  // Check authentication
  const clerkToken = await gateway.getStoredClerkToken();
  if (!clerkToken) {
    sendResponse({ 
      success: false, 
      error: 'Authentication required. Please sign in first.' 
    });
    return;
  }

  // Proceed with analysis
  // ...
}
```

### Fix 4: Fail Fast for Unauthenticated Requests

**Problem:** Unnecessary retry loops for unauthenticated requests

**Solution:**
- Check authentication before retrying
- Don't retry if auth is required and missing

**Implementation:**
```javascript
// In gateway.js
const requiresAuth = ['analyze', 'subscriptions'].some(endpoint => 
  mappedEndpoint.includes(endpoint)
);

if (requiresAuth && !clerkToken) {
  throw new Error('Authentication required. Please sign in first.');
}
```

---

## 🧪 Testing Workflow

### 1. Pre-Development Testing

```javascript
// Run diagnostics before starting work
await runDiagnostics();
// Review results and fix any critical issues
```

### 2. During Development

```javascript
// Check storage usage regularly
const stats = await StorageQuotaManager.getUsageStats('local');
if (parseFloat(stats.usagePercent) > 80) {
  console.warn('Storage usage high, consider cleanup');
}

// Test storage operations
await StorageQuotaManager.store('test', data, 'local');
```

### 3. Pre-Release Testing

```javascript
// Run full diagnostics
const results = await runDiagnostics();

// Check production readiness
const prodCheck = results.diagnostics.productionReadiness;
if (prodCheck.status !== 'ok') {
  console.error('Not production ready:', prodCheck.issues);
  // Fix issues before release
}
```

### 4. Post-Release Monitoring

```javascript
// Monitor storage usage
const stats = await StorageQuotaManager.getUsageStats('local');
// Alert if usage > 90%

// Check for errors
// Review error logs
// Monitor performance metrics
```

---

## 📋 Production Readiness Checklist

- [ ] All diagnostics pass
- [ ] Storage quota managed
- [ ] No console errors
- [ ] Error handling comprehensive
- [ ] Performance acceptable
- [ ] Authentication working
- [ ] Gateway connectivity verified
- [ ] User experience clear
- [ ] Error messages helpful
- [ ] Production ready

---

## 🎯 Success Criteria

- ✅ All critical diagnostics pass
- ✅ Storage quota managed
- ✅ No 404 spam
- ✅ Clear error messages
- ✅ Performance acceptable
- ✅ Production ready

---

## 🔗 Related Files

- `debug/chrome-extension-debugger.js` - Main diagnostic tool
- `debug/storage-quota-manager.js` - Storage quota management
- `debug/README.md` - Usage documentation
- `PRODUCTION_DEBUGGING_GUIDE.md` - This guide

---

**Pattern:** AEYON × DEBUGGING × ATOMIC × ONE  
**Status:** Production Ready  
**Frequency:** 999 Hz (AEYON)

