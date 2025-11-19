# Chrome Extension Debugging Toolkit

A comprehensive debugging framework for production-grade Chrome extensions.

## Overview

This toolkit provides automated diagnostics, storage management, error tracking, and production readiness checks for Chrome extensions.

## Components

### 1. Chrome Extension Debugger (`chrome-extension-debugger.js`)

Comprehensive diagnostic tool that checks:
- Storage quota and usage
- Network connectivity
- Authentication state
- Gateway status
- Error handling
- Performance metrics
- Production readiness

**Usage:**

```javascript
// In Service Worker console or Popup console
runDiagnostics();

// Or create custom instance
const debugger = new ChromeExtensionDebugger('service-worker');
await debugger.runAllDiagnostics();
const results = debugger.getResults();
```

### 2. Storage Quota Manager (`storage-quota-manager.js`)

Prevents storage quota exceeded errors by:
- Monitoring storage usage
- Enforcing item size limits
- Automatically cleaning up old data
- Compressing large data before storage

**Usage:**

```javascript
// Store data with quota management
await StorageQuotaManager.store('last_analysis', analysisResult, 'local', {
  essentialFields: ['score', 'bias_type', 'timestamp'],
  compress: true,
  cleanupOld: true
});

// Get usage statistics
const stats = await StorageQuotaManager.getUsageStats('local');
console.log(`Storage usage: ${stats.usagePercent}%`);
```

## Quick Start

### Service Worker Context

1. Open Chrome Extensions page (`chrome://extensions/`)
2. Find your extension → Click "Service Worker"
3. In console, run:
   ```javascript
   importScripts('debug/chrome-extension-debugger.js');
   importScripts('debug/storage-quota-manager.js');
   runDiagnostics();
   ```

### Popup Context

1. Right-click extension icon → Inspect popup
2. In console, run:
   ```javascript
   // Load scripts (if not already loaded)
   const script1 = document.createElement('script');
   script1.src = chrome.runtime.getURL('debug/chrome-extension-debugger.js');
   document.head.appendChild(script1);
   
   const script2 = document.createElement('script');
   script2.src = chrome.runtime.getURL('debug/storage-quota-manager.js');
   document.head.appendChild(script2);
   
   // Wait for scripts to load, then:
   runDiagnostics();
   ```

## Diagnostic Checks

### Storage Quota Check
- Monitors local and sync storage usage
- Identifies items exceeding 8KB limit
- Warns when usage exceeds 90% of quota

### Network Connectivity Check
- Tests gateway connection
- Checks health endpoint
- Measures response times

### Authentication Check
- Verifies stored user and token
- Checks token expiration
- Identifies authentication issues

### Gateway Status Check
- Verifies gateway initialization
- Tests gateway connectivity
- Checks configuration

### Error Handling Check
- Verifies error handler availability
- Checks for common error patterns

### Performance Check
- Measures gateway response time
- Tests storage read/write performance
- Identifies performance bottlenecks

### Production Readiness Check
- Aggregates all diagnostic results
- Generates recommendations
- Provides overall status

## Integration

### Integrate Storage Quota Manager

Replace direct storage calls with quota-managed storage:

**Before:**
```javascript
chrome.storage.local.set({ last_analysis: analysisResult });
```

**After:**
```javascript
importScripts('debug/storage-quota-manager.js');

await StorageQuotaManager.store('last_analysis', analysisResult, 'local', {
  essentialFields: ['score', 'bias_type', 'timestamp', 'success'],
  compress: true,
  cleanupOld: true
});
```

### Integrate Debugger

Add diagnostic endpoint to service worker:

```javascript
case "RUN_DIAGNOSTICS":
  importScripts('debug/chrome-extension-debugger.js');
  const debugger = new ChromeExtensionDebugger('service-worker');
  const results = await debugger.runAllDiagnostics();
  sendResponse({ success: true, diagnostics: results });
  return true;
```

## Production Fixes

### Fix 1: Storage Quota Management

**File:** `src/service-worker.js`

Replace:
```javascript
chrome.storage.local.set({ last_analysis: analysisResult });
```

With:
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

### Fix 2: Central Logger Error Handling

**File:** `src/gateway.js`

Update error handling to suppress 404 errors for optional logging endpoint.

### Fix 3: Text Analysis Validation

**File:** `src/service-worker.js`

Add validation before analysis:
- Check authentication
- Validate text input
- Detect error messages in text

## Testing

### Run All Diagnostics

```javascript
runDiagnostics();
```

### Check Storage Usage

```javascript
const stats = await StorageQuotaManager.getUsageStats('local');
console.log(stats);
```

### Test Storage Quota Manager

```javascript
// Test with large data
const largeData = { /* ... */ };
await StorageQuotaManager.store('test', largeData, 'local');
```

## Output

Diagnostics generate a comprehensive report with:
- Summary of all checks
- Detailed results for each diagnostic
- Issues and warnings
- Recommendations for fixes
- Production readiness status

## Best Practices

1. **Run diagnostics regularly** during development
2. **Use Storage Quota Manager** for all storage operations
3. **Monitor storage usage** to prevent quota errors
4. **Check production readiness** before releases
5. **Review recommendations** and implement fixes

## Troubleshooting

### Storage Quota Exceeded

1. Run diagnostics to identify large items
2. Use Storage Quota Manager for all storage
3. Clean up old data
4. Compress large data before storage

### Gateway Connection Issues

1. Check gateway URL configuration
2. Verify network connectivity
3. Check authentication token
4. Review gateway status in diagnostics

### Performance Issues

1. Check response times in diagnostics
2. Optimize storage operations
3. Review network requests
4. Check for memory leaks

## License

Part of AiGuardian Chrome Extension project.

