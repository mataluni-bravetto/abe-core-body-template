# Backend Connection & Text Analysis Test Instructions

## Quick Test Steps

### Step 1: Open Service Worker Console

1. Open Chrome and go to: `chrome://extensions/`
2. Find **"AiGuardian"** extension
3. Click the **"Service Worker"** link (opens DevTools)
4. Click the **"Console"** tab

### Step 2: Run the Test Script

1. Open the file `test-backend-text-analysis.js` in this directory
2. Copy the entire contents
3. Paste into the Service Worker Console
4. Press **Enter**

### Step 3: Review Results

The script will test:
- ✅ Gateway initialization
- ✅ Backend connection (`/health/live`)
- ✅ Authentication status
- ✅ Text analysis flow (simulates highlighting text)
- ✅ Network request verification

---

## Expected Output

### Success Case:
```
✅ Gateway is initialized
✅ Backend connection: SUCCESS
✅ User is authenticated
✅ Analysis request: SUCCESS
   Response time: 234ms
   Bias Score: 45%
```

### Failure Cases:

#### Authentication Required:
```
⚠️  User is NOT authenticated
❌ Analysis request: FAILED
   Error: 401 Unauthorized
💡 Solution: Sign in at www.aiguardian.ai
```

#### Backend Unreachable:
```
❌ Backend connection: FAILED
❌ Analysis request: FAILED
   Error: Network error
```

---

## Manual Testing Alternative

If you prefer to test manually:

### Test 1: Backend Connection
```javascript
chrome.runtime.sendMessage({ type: 'TEST_GATEWAY_CONNECTION' }, (response) => {
  console.log('Backend Connection:', response);
});
```

### Test 2: Text Analysis
```javascript
chrome.runtime.sendMessage({ 
  type: 'ANALYZE_TEXT', 
  payload: 'This is a test text to analyze for bias.' 
}, (response) => {
  console.log('Analysis Result:', response);
});
```

---

## Troubleshooting

### Issue: Gateway not initialized
**Solution**: Reload extension at `chrome://extensions/`

### Issue: Backend connection fails
**Solution**: 
- Check internet connection
- Verify backend is online: `curl https://api.aiguardian.ai/health/live`
- Check firewall/proxy settings

### Issue: Authentication required
**Solution**: 
- Sign in at www.aiguardian.ai
- Extension will detect auth automatically
- Check content script logs for auth detection

### Issue: Analysis fails with CORS error
**Solution**: 
- Backend needs to allow `chrome-extension://` origin
- Check backend CORS configuration

---

## What to Check in Network Tab

1. Open DevTools → **Network** tab
2. Filter by: `api.aiguardian.ai`
3. Look for:
   - `GET /health/live` (connection test)
   - `POST /api/v1/guards/process` (text analysis)
4. Check:
   - Request headers (Authorization, X-Extension-Version)
   - Request payload (text, user_id, session_id)
   - Response status (200 = success)
   - Response body (analysis results)

---

## Next Steps After Testing

1. **If all tests pass**: Extension is working correctly! ✅
2. **If backend fails**: Check backend status and network connectivity
3. **If auth fails**: Sign in at www.aiguardian.ai
4. **If analysis fails**: Check error message for specific issue

---

**Note**: The test script simulates what happens when you highlight text on a webpage. If the test passes, your text highlighting should work correctly!

