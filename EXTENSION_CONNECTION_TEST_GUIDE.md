# Extension Backend Connection Test Guide

**Date**: 2025-01-27  
**Backend Status**: ✅ Online (`https://api.aiguardian.ai`)

---

## Quick Test Steps

### Method 1: Service Worker Console (Recommended)

1. **Open Service Worker Console**:
   - Go to `chrome://extensions/`
   - Find "AiGuardian" extension
   - Click "Service Worker" link (opens DevTools)

2. **Run Test Command**:
   ```javascript
   chrome.runtime.sendMessage({ type: 'TEST_GATEWAY_CONNECTION' }, (response) => {
     console.log('✅ Connection Result:', response);
   });
   ```

3. **Expected Output**:
   ```
   ✅ Connection Result: { success: true, responseTime: 123, timestamp: "..." }
   ```

4. **Check Logs**:
   - Look for: `[BG] Gateway connection test: SUCCESS (XXXms)`
   - If you see `FAILED`, check error message

---

### Method 2: Popup Console

1. **Open Popup Console**:
   - Right-click extension icon → "Inspect popup"
   - Go to Console tab

2. **Run Test**:
   ```javascript
   // Test via background script
   chrome.runtime.sendMessage({ type: 'TEST_GATEWAY_CONNECTION' }, (response) => {
     console.log('Backend connection:', response);
   });
   
   // Or test directly
   fetch('https://api.aiguardian.ai/health/live', {
     headers: { 'X-Extension-Version': '1.0.0' }
   })
   .then(r => r.json())
   .then(data => console.log('✅ Direct test:', data))
   .catch(err => console.error('❌ Direct test failed:', err));
   ```

---

### Method 3: Diagnostic Panel

1. **Open Extension Popup**
2. **Click "🔍 Diagnostics" button** (if available)
3. **Check "Backend Status"** - should show "✅ Connected"
4. **Check Console** for `[Diagnostics]` logs

---

### Method 4: Options Page

1. **Open Options**:
   - Right-click extension icon → "Options"
   - Or: `chrome://extensions/` → Extension → "Options"

2. **Test Connection**:
   - Scroll to "🔌 Backend Connection" section
   - Click "🔍 Test Connection" button
   - Check status indicator (should turn green)

---

## Comprehensive Test Script

Copy and paste this into **Service Worker Console** or **Popup Console**:

```javascript
(async function testExtensionBackendConnection() {
  console.log('🔍 Testing Extension Backend Connection...');
  console.log('==========================================');
  
  // Test 1: Check Gateway URL
  const gatewayUrl = await new Promise((resolve) => {
    chrome.storage.sync.get(['gateway_url'], (data) => {
      resolve(data.gateway_url || 'https://api.aiguardian.ai');
    });
  });
  console.log('✅ Gateway URL:', gatewayUrl);
  
  // Test 2: Direct Fetch (works in popup, not service worker)
  try {
    const healthUrl = gatewayUrl.replace(/\/$/, '') + '/health/live';
    const response = await fetch(healthUrl, {
      headers: { 'X-Extension-Version': chrome.runtime.getManifest().version }
    });
    const data = await response.json();
    console.log('✅ Direct fetch SUCCESS:', data);
  } catch (error) {
    console.warn('⚠️ Direct fetch:', error.message);
  }
  
  // Test 3: Via Background Script
  const result = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'TEST_GATEWAY_CONNECTION' }, (response) => {
      resolve(chrome.runtime.lastError ? { error: chrome.runtime.lastError.message } : response);
    });
  });
  console.log('✅ Background test:', result);
  
  // Test 4: Get Diagnostics
  const diagnostics = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_DIAGNOSTICS' }, (response) => {
      resolve(chrome.runtime.lastError ? { error: chrome.runtime.lastError.message } : response);
    });
  });
  if (diagnostics.success) {
    console.log('✅ Gateway Status:', diagnostics.diagnostics.gateway);
  }
  
  console.log('==========================================');
  console.log('✅ Test Complete!');
})();
```

---

## Expected Logs

### Service Worker Console (`[BG]` logs)
```
[BG] Gateway connection test: SUCCESS (123ms)
[BG] 📨 Message received: { type: 'TEST_GATEWAY_CONNECTION' }
[Gateway] Initialized unified gateway connection
```

### Popup Console (`[Diagnostics]` logs)
```
[Diagnostics] Checking backend connection...
[Diagnostics] Backend response: { success: true, responseTime: 123 }
```

### Network Tab
- Request to: `https://api.aiguardian.ai/health/live`
- Method: `GET`
- Status: `200 OK`
- Headers: `X-Extension-Version: 1.0.0`

---

## Troubleshooting

### Issue: "Gateway not initialized"

**Symptoms**: Error message `"AiGuardian Gateway not initialized"`

**Solution**:
1. Reload extension: `chrome://extensions/` → Click reload icon
2. Check Service Worker console for initialization errors
3. Verify `gateway.js` is loaded correctly

### Issue: No response from background script

**Symptoms**: `chrome.runtime.lastError` or no response

**Solution**:
1. Check Service Worker is running: `chrome://extensions/` → "Service Worker" link
2. Reload extension
3. Check for errors in Service Worker console

### Issue: CORS errors

**Symptoms**: `Failed to fetch` or CORS error in console

**Solution**:
1. Backend should allow `chrome-extension://` origin
2. Check backend CORS configuration
3. Test direct fetch: `curl https://api.aiguardian.ai/health/live`

### Issue: Timeout

**Symptoms**: `Timeout` error or no response after 5 seconds

**Solution**:
1. Check network connectivity
2. Verify firewall/proxy settings
3. Test backend directly: `curl https://api.aiguardian.ai/health/live`
4. Check if backend is slow to respond

---

## Verification Checklist

- [ ] Service Worker is running (no errors)
- [ ] Gateway URL is configured (`https://api.aiguardian.ai`)
- [ ] Direct fetch test works (in popup console)
- [ ] Background script test works (`TEST_GATEWAY_CONNECTION`)
- [ ] Network tab shows successful request
- [ ] Logs show `SUCCESS` not `FAILED`
- [ ] Response time is reasonable (< 1000ms)

---

## Next Steps After Successful Test

1. **Test Analysis Flow**: Try analyzing text to verify full pipeline
2. **Check Authentication**: Verify Clerk auth is working
3. **Monitor Logs**: Watch for any connection issues
4. **Test Different Endpoints**: Verify other endpoints work

---

## Quick Reference

### Test Commands

**Service Worker Console**:
```javascript
chrome.runtime.sendMessage({ type: 'TEST_GATEWAY_CONNECTION' }, console.log);
```

**Popup Console**:
```javascript
fetch('https://api.aiguardian.ai/health/live').then(r => r.json()).then(console.log);
```

**Options Page**:
- Click "🔍 Test Connection" button

---

**Backend Status**: ✅ **ONLINE**  
**Extension Status**: ⚠️ **NEEDS TESTING**

Run the tests above to verify extension connectivity!

