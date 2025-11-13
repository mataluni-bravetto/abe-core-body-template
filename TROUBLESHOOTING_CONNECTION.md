# Troubleshooting Backend Connection Issues

## Quick Diagnosis Steps

### Step 1: Verify Backend is Running

**If backend is deployed on AWS:**
```bash
# Test from command line
curl https://api.aiguardian.ai/health/live

# Or test in browser
# Open: https://api.aiguardian.ai/health/live
```

**If backend is running locally:**
```bash
# Test local backend
curl http://localhost:8000/health/live

# Or test in browser
# Open: http://localhost:8000/health/live
```

**Expected Response:**
```json
{
  "status": "alive",
  "service": "codeguardians-gateway",
  "version": "0.1.0",
  "timestamp": 1234567890.123
}
```

### Step 2: Check Extension Console Logs

1. Open Extension Options page
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Click "Test Connection" again
5. Look for error messages

**Common Error Messages:**
- `Failed to fetch` → Backend not reachable
- `NetworkError` → Network connectivity issue
- `TimeoutError` → Backend too slow or unreachable
- `CORS error` → CORS configuration issue (rare for extensions)

### Step 3: Verify Gateway URL

**Check stored Gateway URL:**
1. Open Extension Options
2. Check the Gateway URL field
3. Common URLs:
   - Production: `https://api.aiguardian.ai`
   - Local: `http://localhost:8000`
   - AWS: `https://your-alb-dns-name.us-east-1.elb.amazonaws.com`

**Test URL directly in browser:**
- Open the Gateway URL + `/health/live` in a new tab
- Example: `https://api.aiguardian.ai/health/live`
- Should return JSON response

### Step 4: Check Network Tab

1. Open Extension Options
2. Press **F12** → **Network** tab
3. Click "Test Connection"
4. Look for the request to `/health/live`
5. Check:
   - **Status Code**: Should be `200`
   - **Response**: Should show JSON
   - **Error**: Will show error details

## Common Issues & Solutions

### Issue 1: "Network error - check if backend is running"

**Possible Causes:**
- Backend server is not running
- Gateway URL is incorrect
- Network firewall blocking connection
- DNS resolution failure

**Solutions:**

1. **Verify backend is running:**
   ```bash
   # If deployed on AWS, check ECS/EC2 status
   # If local, check if process is running
   ps aux | grep uvicorn
   # Or check Docker
   docker ps | grep codeguardians
   ```

2. **Test URL accessibility:**
   ```bash
   # Test from command line
   curl -v https://api.aiguardian.ai/health/live
   
   # Check DNS resolution
   nslookup api.aiguardian.ai
   ```

3. **Check firewall/network:**
   - Ensure port 443 (HTTPS) or 8000 (HTTP) is accessible
   - Check corporate firewall/VPN settings
   - Try from different network

4. **Verify Gateway URL format:**
   - Should NOT end with `/`
   - Should include protocol: `https://` or `http://`
   - Example: `https://api.aiguardian.ai` ✅
   - Example: `api.aiguardian.ai` ❌ (missing protocol)
   - Example: `https://api.aiguardian.ai/` ⚠️ (trailing slash OK but not ideal)

### Issue 2: "Connection timeout"

**Possible Causes:**
- Backend is slow to respond
- Network latency
- Backend is overloaded

**Solutions:**
- Increase timeout (currently 10 seconds)
- Check backend performance
- Verify backend health endpoint responds quickly

### Issue 3: CORS Error (rare for extensions)

**Note:** Chrome extensions typically don't need CORS, but if you see CORS errors:

**Backend CORS Configuration:**
The backend needs to allow Chrome extension origins. Update `ALLOWED_ORIGINS` in backend:

```python
# In app/core/config.py or environment variable
ALLOWED_ORIGINS = [
    "chrome-extension://*",  # Allow all extensions
    # Or specific extension ID:
    # "chrome-extension://your-extension-id-here",
    "http://localhost:3000",
    "http://localhost:8080"
]
```

**However**, Chrome extensions usually bypass CORS, so this is rarely the issue.

### Issue 4: Backend Returns 404

**Possible Causes:**
- Health endpoint path is wrong
- Backend routes not configured correctly

**Solutions:**
- Verify backend has `/health/live` endpoint
- Check backend logs for route registration
- Test endpoint directly in browser

### Issue 5: SSL/TLS Certificate Error

**Possible Causes:**
- Self-signed certificate
- Certificate expired
- Certificate mismatch

**Solutions:**
- For development: Use `http://localhost:8000` instead of HTTPS
- For production: Ensure valid SSL certificate
- Check certificate validity: `openssl s_client -connect api.aiguardian.ai:443`

## Testing from Browser Console

You can test the connection directly from the browser console:

```javascript
// Test health endpoint
fetch('https://api.aiguardian.ai/health/live')
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err));

// Test with extension headers
fetch('https://api.aiguardian.ai/health/live', {
  headers: {
    'X-Extension-Version': '1.0.0'
  }
})
  .then(r => r.json())
  .then(data => console.log('✅ Success:', data))
  .catch(err => console.error('❌ Error:', err));
```

## Backend Health Endpoints

The extension tests these endpoints:

| Endpoint | Purpose | Expected Response |
|----------|---------|-------------------|
| `GET /health/live` | Basic connectivity | `{"status": "alive", ...}` |
| `GET /health/ready` | Full readiness check | `{"status": "ready", ...}` |
| `GET /api/v1/config/public` | Public configuration | `{"clerk_publishable_key": "...", ...}` |

## Next Steps

1. **If connection works:** Proceed to test authentication
2. **If connection fails:** 
   - Check backend deployment status
   - Verify network connectivity
   - Review backend logs for errors
   - Check AWS/cloud service health

## Getting More Help

If connection still fails:

1. **Check Extension Console:**
   - Open Options → F12 → Console
   - Look for detailed error messages

2. **Check Backend Logs:**
   - If AWS: Check CloudWatch logs
   - If local: Check terminal/Docker logs

3. **Test from Different Location:**
   - Try from different network
   - Test from mobile hotspot
   - Verify it's not network-specific

4. **Verify Backend Deployment:**
   - Check AWS ECS/EC2 status
   - Verify load balancer health checks
   - Check security group rules

