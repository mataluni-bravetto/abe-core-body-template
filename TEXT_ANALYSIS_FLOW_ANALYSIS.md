# Text Analysis Flow Analysis

**Date**: 2025-01-27  
**User Action**: Highlighted text to analyze  
**Status**: Code flow verified | Testing needed

---

## What Happens When You Highlight Text

### Step-by-Step Flow

1. **User highlights text** on webpage
   - Content script (`src/content.js`) detects selection via `mouseup` event
   - Debounced handler waits 300ms before processing

2. **Content Script Validates Selection**
   ```javascript
   // src/content.js:89
   chrome.runtime.sendMessage({ 
     type: "ANALYZE_TEXT", 
     payload: selectionText 
   })
   ```
   - Checks: length >= 10 chars, length <= 5000 chars
   - Shows "Analyzing..." badge

3. **Service Worker Receives Message**
   ```javascript
   // src/service-worker.js:305
   case "ANALYZE_TEXT":
     handleTextAnalysis(request.payload, sendResponse);
   ```
   - Message handler processes request
   - Calls `gateway.analyzeText(text)`

4. **Gateway Processes Request**
   ```javascript
   // src/gateway.js:587
   async analyzeText(text, options = {})
   ```
   - Gets user ID from storage (Clerk auth)
   - Builds payload matching backend schema
   - Calls `sendToGateway('analyze', payload)`

5. **Backend Request Sent**
   ```javascript
   // src/gateway.js:454
   'analyze': 'api/v1/guards/process'
   // Full URL: https://api.aiguardian.ai/api/v1/guards/process
   ```
   - POST request with:
     - `service_type: 'biasguard'`
     - `payload: { text, contentType, scanLevel, context }`
     - `user_id: <clerk_user_id>`
     - `session_id: <unique_id>`
     - `Authorization: Bearer <clerk_token>` (if authenticated)

6. **Response Received**
   - Success: Returns analysis results (score, analysis details)
   - Error: Returns error message
   - Content script displays results in badge

---

## How to Verify Backend Requests Are Working

### Method 1: Check Service Worker Console

1. **Open Service Worker Console**:
   - `chrome://extensions/` → Find extension → Click "Service Worker"
   - Open Console tab

2. **Look for these logs**:
   ```
   [BG] 📨 Message received: { type: 'ANALYZE_TEXT', hasUser: true }
   [BG] Text analysis request received: <text preview>...
   [Gateway] Sending request to gateway: POST /api/v1/guards/process
   [BG] Analysis result received: { success: true, score: 0.45, ... }
   ```

3. **If you see errors**:
   ```
   [BG] Gateway analysis failed: <error message>
   [Gateway] Request failed: <error details>
   ```

### Method 2: Check Network Tab

1. **Open DevTools** → **Network** tab
2. **Filter by**: `api.aiguardian.ai`
3. **Highlight text** on a webpage
4. **Look for**:
   - `POST /api/v1/guards/process` request
   - Status: `200` (success) or error code
   - Request payload: Contains your text
   - Response: Contains analysis results

### Method 3: Check Content Script Console

1. **Open webpage** where you highlighted text
2. **Open DevTools** → Console tab
3. **Look for**:
   ```
   [CS] Selection detected: <length> characters
   [CS] Sending analysis request...
   [CS] Analysis result: { success: true, score: 0.45 }
   ```

---

## Common Issues & Solutions

### Issue 1: No Request Appears in Network Tab

**Possible Causes**:
- Content script not running
- Service worker not initialized
- Gateway not initialized
- Selection too short/long

**Solutions**:
1. Check if content script is loaded:
   ```javascript
   // In webpage console
   console.log('Content script loaded:', typeof analyzeSelection !== 'undefined');
   ```
2. Reload extension: `chrome://extensions/` → Reload
3. Check selection length: Must be 10-5000 characters

### Issue 2: Request Fails with 401 Unauthorized

**Cause**: User not authenticated

**Solution**:
1. Sign in at `www.aiguardian.ai`
2. Extension will detect auth automatically
3. Check storage: `chrome.storage.local.get(['clerk_user'])`

### Issue 3: Request Fails with CORS Error

**Cause**: Backend doesn't allow `chrome-extension://` origin

**Solution**:
- Backend needs CORS configuration
- Check backend `ALLOWED_ORIGINS` includes extension origin

### Issue 4: Request Times Out

**Cause**: Backend slow or unreachable

**Solution**:
1. Test backend directly: `curl https://api.aiguardian.ai/health/live`
2. Check network connectivity
3. Check firewall/proxy settings

### Issue 5: No Response/Error Message

**Possible Causes**:
- Service worker inactive
- Message handler error
- Gateway error

**Solutions**:
1. Check Service Worker console for errors
2. Reload extension
3. Check gateway initialization logs

---

## Code Verification

### ✅ Verified Components

1. **Content Script**: ✅ Correctly sends `ANALYZE_TEXT` message
2. **Service Worker**: ✅ Handles message and calls gateway
3. **Gateway**: ✅ Correctly maps to `/api/v1/guards/process`
4. **Payload Format**: ✅ Matches backend schema
5. **Endpoint URL**: ✅ `https://api.aiguardian.ai/api/v1/guards/process`

### ⚠️ Potential Issues

1. **Authentication**: May require Clerk token
2. **Service Worker**: May be inactive (Chrome MV3)
3. **Network**: May be blocked by firewall/proxy
4. **Backend**: May be down or slow

---

## Testing Checklist

- [ ] Content script is loaded (check webpage console)
- [ ] Service worker is running (check `chrome://extensions/`)
- [ ] Gateway is initialized (check Service Worker console)
- [ ] User is authenticated (check storage for `clerk_user`)
- [ ] Backend is reachable (test `/health/live`)
- [ ] Network request appears (check Network tab)
- [ ] Request succeeds (check response status)
- [ ] Results display (check badge on webpage)

---

## Quick Test Commands

### Test Backend Connection
```javascript
// In Service Worker console
chrome.runtime.sendMessage({ type: 'TEST_GATEWAY_CONNECTION' }, console.log);
```

### Test Text Analysis
```javascript
// In Service Worker console
chrome.runtime.sendMessage({ 
  type: 'ANALYZE_TEXT', 
  payload: 'This is a test text to analyze for bias and other issues.' 
}, console.log);
```

### Check Authentication
```javascript
// In Service Worker console
chrome.storage.local.get(['clerk_user'], (data) => {
  console.log('User:', data.clerk_user);
});
```

### Check Gateway Status
```javascript
// In Service Worker console
console.log('Gateway:', typeof gateway !== 'undefined' ? 'Initialized' : 'Not initialized');
console.log('Gateway URL:', gateway?.config?.gatewayUrl);
```

---

## Next Steps

1. **Run the test script**: Use `test-backend-text-analysis.js` in Service Worker console
2. **Check Network tab**: Verify requests are being made
3. **Check Service Worker logs**: Look for `[BG]` and `[Gateway]` logs
4. **Report results**: Share what you see in logs/network tab

---

**Summary**: The code flow is correct. When you highlight text, it should:
1. Send `ANALYZE_TEXT` message to service worker
2. Service worker calls `gateway.analyzeText()`
3. Gateway sends POST to `/api/v1/guards/process`
4. Backend processes and returns results
5. Content script displays results

**To verify**: Check Service Worker console and Network tab when highlighting text.

