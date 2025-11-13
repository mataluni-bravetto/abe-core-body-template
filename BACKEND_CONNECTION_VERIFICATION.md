# Backend Connection Verification Guide

## Quick Test in Extension Options

1. **Open Extension Options**
   - Right-click the extension icon → "Options"
   - Or go to `chrome://extensions` → Find "AiGuardian" → Click "Options"

2. **Test Backend Connection**
   - Scroll to the "🔌 Backend Connection" section
   - Enter your backend Gateway URL (default: `https://api.aiguardian.ai`)
   - Click "🔍 Test Connection"
   - The status will show:
     - ✅ **Connected** (green) - Backend is reachable
     - ❌ **Disconnected** (red) - Backend is unreachable

3. **Check Results**
   - Response time is displayed
   - Error messages explain connection issues:
     - **Timeout**: Backend may be unreachable or slow
     - **Network Error**: Backend may not be running or URL is incorrect
     - **CORS Error**: Backend may not allow extension origin

## Manual Verification Methods

### Method 1: Browser Console Test

Open browser console (F12) and run:

```javascript
// Test health endpoint
fetch('https://api.aiguardian.ai/health/live')
  .then(r => r.json())
  .then(data => console.log('✅ Connected:', data))
  .catch(err => console.error('❌ Failed:', err));
```

### Method 2: Command Line (curl)

```bash
# Test health endpoint
curl https://api.aiguardian.ai/health/live

# With verbose output
curl -v https://api.aiguardian.ai/health/live
```

### Method 3: Extension Console Logs

1. Open Extension Options
2. Press F12 to open DevTools
3. Check Console tab for connection logs
4. Look for:
   - `[Gateway]` - Connection attempts
   - `[Auth]` - Authentication status
   - `Backend connection test` - Test results

## Common Issues

### Issue: "Connection timeout"
**Possible Causes:**
- Backend server is down
- Network firewall blocking connection
- Incorrect Gateway URL

**Solutions:**
- Verify backend is running: `curl https://api.aiguardian.ai/health/live`
- Check Gateway URL in extension options
- Verify network connectivity

### Issue: "Network error"
**Possible Causes:**
- Backend URL is incorrect
- Backend is not accessible from your network
- DNS resolution failure

**Solutions:**
- Verify the Gateway URL is correct
- Try accessing the URL in a browser
- Check if backend is deployed and running

### Issue: "CORS error"
**Possible Causes:**
- Backend CORS configuration doesn't allow extension origin
- Extension origin not whitelisted

**Solutions:**
- Check backend CORS configuration
- Ensure extension origin (`chrome-extension://...`) is allowed
- Verify `ALLOWED_ORIGINS` in backend config includes extension origin

## Backend Health Endpoints

The extension tests these endpoints:

- **Health Check**: `GET /health/live`
  - Returns: `{ "status": "healthy" }`
  - Used for: Basic connectivity test

- **Public Config**: `GET /api/v1/config/public`
  - Returns: Clerk publishable key and configuration
  - Used for: Authentication setup

## Extension Storage

The Gateway URL is stored in Chrome sync storage:
- Key: `gateway_url`
- Default: `https://api.aiguardian.ai`
- Updated: When connection test succeeds

To check stored value:
```javascript
chrome.storage.sync.get(['gateway_url'], (data) => {
  console.log('Gateway URL:', data.gateway_url);
});
```

## Next Steps After Connection Verified

1. **Test Authentication**
   - Sign in through the extension popup
   - Verify Clerk session token is retrieved

2. **Test API Calls**
   - Use "Backend Integration Testing" section
   - Run "🚀 Run All Tests" to verify full integration

3. **Check Logs**
   - Monitor extension console for errors
   - Check backend logs for incoming requests

