# Service Worker Backend Test Instructions

## Quick Test Steps

### Step 1: Open Service Worker Console

1. Open Chrome and go to: `chrome://extensions/`
2. Find **"AiGuardian"** extension
3. Click the **"Service Worker"** link (opens DevTools)
4. Click the **"Console"** tab

### Step 2: Run the Test Script

1. Open the file `test-service-worker-backend.js` in this directory
2. Copy the entire contents
3. Paste into the Service Worker Console
4. Press **Enter**

### Step 3: Review Results

The script will test:
- ✅ Gateway initialization
- ✅ Backend connection (`/health/live`)
- ✅ Authentication status
- ✅ Text analysis flow (simulates highlighting text)
- ✅ Message handler verification

---

## Expected Output

### Success Case:
```
✅ Gateway is initialized
✅ Backend connection: SUCCESS
✅ User is authenticated
✅ Analysis request: SUCCESS
✅ Message handler: WORKING
```

### If Not Authenticated:
```
✅ Gateway is initialized
✅ Backend connection: SUCCESS
⚠️  User is NOT authenticated
   → Text analysis may fail without authentication
   → Sign in at www.aiguardian.ai to authenticate
```

---

## Troubleshooting

### Gateway Not Initialized
**Error**: `Gateway not initialized!`

**Solution**:
1. Reload the extension: `chrome://extensions/` → Click reload icon
2. Check if `gateway.js` is loaded in Service Worker
3. Check Service Worker console for errors

### Backend Connection Failed
**Error**: `Backend connection: FAILED`

**Solution**:
1. Check internet connection
2. Verify backend URL: `https://api.aiguardian.ai`
3. Check if backend is online: `curl https://api.aiguardian.ai/health/live`

### Analysis Request Failed
**Error**: `Analysis request: FAILED`

**Possible Causes**:
1. **Not authenticated**: Sign in at www.aiguardian.ai
2. **Backend error**: Check backend logs
3. **Network error**: Check Network tab in DevTools

---

## Manual Testing

### Test 1: Highlight Text on Webpage

1. Open any webpage (e.g., `test-backend-simple.html`)
2. Highlight some text (10+ characters)
3. Check Service Worker console for logs:
   - `[BG] Text analysis request received`
   - `[Gateway] Sending request to gateway...`
   - `[Gateway] Response received...`

### Test 2: Check Network Requests

1. Open DevTools → **Network** tab
2. Filter by: `api.aiguardian.ai`
3. Highlight text on webpage
4. Look for POST request to `/api/v1/guards/process`
5. Check:
   - **Status**: Should be 200 OK
   - **Request Payload**: Should contain `service_type`, `payload`, `user_id`
   - **Response**: Should contain `score` and `analysis`

### Test 3: Test Gateway Connection Message

In Service Worker Console, run:
```javascript
chrome.runtime.sendMessage({ type: 'TEST_GATEWAY_CONNECTION' }, (response) => {
  console.log('Connection test result:', response);
});
```

Expected response:
```javascript
{
  success: true,
  responseTime: 123,
  status: "alive",
  timestamp: "..."
}
```

---

## What to Look For

### ✅ Success Indicators

1. **Service Worker Console**:
   - `[BG] Gateway connection test: SUCCESS`
   - `[Gateway] Sending request to gateway...`
   - `[Gateway] Response received: 200 OK`

2. **Network Tab**:
   - POST request to `https://api.aiguardian.ai/api/v1/guards/process`
   - Status: 200 OK
   - Response contains `score` and `analysis`

3. **Page Badge**:
   - Shows "Analyzing..." while processing
   - Shows bias score (e.g., "Bias Score: 45%") when complete

### ❌ Failure Indicators

1. **Service Worker Console**:
   - `[BG] Gateway connection test: FAILED`
   - `[Gateway] Request failed: ...`
   - `[BG] Analysis failed: ...`

2. **Network Tab**:
   - No request to `api.aiguardian.ai`
   - Request fails with 401 (Unauthorized)
   - Request fails with 500 (Server Error)

3. **Page Badge**:
   - Shows "Analysis failed" error
   - No badge appears at all

---

## Common Issues

### Issue: No Backend Requests Appear

**Possible Causes**:
1. Service worker not receiving messages
2. Gateway not initialized
3. Content script not sending messages

**Solution**:
1. Check Service Worker console for errors
2. Reload extension
3. Check content script is loaded (Page DevTools → Console → Look for `[CS]` logs)

### Issue: 401 Unauthorized Errors

**Possible Causes**:
1. User not authenticated
2. Token expired
3. Token not sent with request

**Solution**:
1. Sign in at www.aiguardian.ai
2. Check `chrome.storage.local` for `clerk_user` and `clerk_token`
3. Verify token is included in Authorization header

### Issue: Analysis Returns Error

**Possible Causes**:
1. Backend validation failed
2. Payload format incorrect
3. Service type not supported

**Solution**:
1. Check request payload in Network tab
2. Verify payload matches backend schema
3. Check backend logs for validation errors

