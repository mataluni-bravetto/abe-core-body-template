# Backend Configuration Checklist

## ✅ What's Already Configured

- ✅ AWS Secrets Manager has Clerk publishable key stored
- ✅ Extension code fetches from `/api/v1/config/public` endpoint

## 🔍 What to Check

### 1. Gateway URL Configuration

**Check if gateway URL is set in extension:**
- Open extension options page
- Look for "Gateway URL" field
- Should be set to your backend URL (e.g., `https://api.internal.aiguardian.ai`)

**Default value:** `https://api.internal.aiguardian.ai` (from `src/constants.js`)

**To verify:**
```javascript
// In browser console on extension options page:
chrome.storage.sync.get(['gateway_url'], (data) => {
  console.log('Gateway URL:', data.gateway_url);
});
```

### 2. Backend Endpoint Exists

**Required endpoint:** `GET /api/v1/config/public`

**Expected response:**
```json
{
  "clerk_publishable_key": "pk_live_... or pk_test_..."
}
```

**To test:**
```bash
curl https://api.internal.aiguardian.ai/api/v1/config/public
```

### 3. Backend Fetches from AWS Secrets Manager

**Backend should:**
1. Read Clerk publishable key from AWS Secrets Manager
2. Return it in the `/api/v1/config/public` response
3. No authentication required (public endpoint)

### 4. CORS Configuration

**Backend must allow CORS from Chrome extension:**
- Extension origin: `chrome-extension://<extension-id>`
- Headers: `Content-Type`, `X-Extension-Version`
- Methods: `GET`

### 5. Extension Storage

**Check if key was fetched:**
```javascript
// In browser console:
chrome.storage.sync.get(['clerk_publishable_key', 'clerk_key_source'], (data) => {
  console.log('Clerk Key:', data.clerk_publishable_key);
  console.log('Source:', data.clerk_key_source); // Should be 'backend_api' if fetched
});
```

## 🐛 Debugging Steps

1. **Check browser console** when extension initializes:
   - Look for: `[Auth] Fetching public config from backend: <url>`
   - Look for: `[Auth] Successfully fetched Clerk publishable key from backend`
   - Or: `[Auth] Failed to fetch public config from backend: <error>`

2. **Check Network tab:**
   - Filter: `config/public`
   - Verify request is made
   - Check response status and body

3. **Check extension options page:**
   - Clerk Key status should show "Auto" if fetched from backend
   - Shows "Manual" if using manual configuration

## 📝 Quick Fixes

### If Gateway URL Missing:
1. Go to extension options page
2. Set Gateway URL to your backend URL
3. Reload extension

### If Backend Endpoint Missing:
Create endpoint in your backend:
```python
# Example Flask endpoint
@app.route('/api/v1/config/public', methods=['GET'])
def get_public_config():
    clerk_key = get_secret_from_aws('clerk_publishable_key')
    return jsonify({
        'clerk_publishable_key': clerk_key
    })
```

### If CORS Issue:
Add CORS headers to backend:
```python
# Allow Chrome extension origins
response.headers['Access-Control-Allow-Origin'] = '*'
response.headers['Access-Control-Allow-Methods'] = 'GET'
response.headers['Access-Control-Allow-Headers'] = 'Content-Type, X-Extension-Version'
```

