# Setup Checklist: Clerk Keys & Configuration

## ✅ Clerk Keys Configuration

### Automatic Configuration (Recommended)
The extension **automatically fetches Clerk keys** from your backend API. No manual setup needed if:

1. ✅ **Backend API is configured** and returns Clerk publishable key at:
   ```
   GET {gateway_url}/api/v1/config/public
   ```
   Expected response:
   ```json
   {
     "clerk_publishable_key": "pk_test_...",
     "gateway_url": "..."
   }
   ```

2. ✅ **Backend has access to Clerk keys** (from AWS Secrets Manager or environment variables)

### Manual Configuration (Fallback)
If backend doesn't provide keys, you can configure manually:

1. **Via Extension Options Page:**
   - Open extension popup
   - Click "Options" or go to `chrome://extensions` → Your extension → Options
   - Enter Clerk publishable key in settings
   - Save

2. **Via Chrome Storage (Developer):**
   ```javascript
   chrome.storage.sync.set({
     clerk_publishable_key: 'pk_test_your_key_here'
   });
   ```

## 🔍 How to Verify Clerk Keys Are Configured

### Method 1: Check Extension Options Page
1. Open extension popup
2. Look for Clerk key status indicator
3. Should show: ✅ "Configured" or ❌ "Not configured"

### Method 2: Check Browser Console
1. Open extension popup
2. Press F12 to open DevTools
3. Check console logs for:
   ```
   [Auth] Got settings, key present: true
   [Auth] Clerk authentication initialized successfully
   ```

### Method 3: Use Debug Function
1. Go to Options page
2. Click "Check Auth State" button
3. Review debug output for Clerk key status

## 📋 Other Configuration Requirements

### 1. Gateway URL
- ✅ Automatically fetched from backend API
- ✅ Can be manually configured in options page
- ✅ Default: `https://api.aiguardian.ai`

### 2. Clerk SDK Bundle
- ✅ Already bundled: `src/vendor/clerk.js`
- ✅ Built via: `npm run build:clerk`
- ✅ No additional setup needed

### 3. OAuth Configuration (for Google Sign-In)
If using Google OAuth, verify:
- ✅ Google OAuth Client ID configured in Clerk Dashboard
- ✅ Redirect URI: `https://clerk.aiguardian.ai/v1/oauth_callback`
- ✅ Run: `node scripts/verify-oauth-config.js` to verify

## 🚀 Quick Setup Verification

Run this command to check your setup:

```bash
# Check if Clerk bundle exists
ls -la src/vendor/clerk.js

# Run setup script
npm run setup

# Verify OAuth config (if using Google)
node scripts/verify-oauth-config.js
```

## ❓ Troubleshooting

### Issue: "Clerk publishable key not configured"
**Solution:**
1. Check if backend API is accessible
2. Verify backend returns `clerk_publishable_key` in `/api/v1/config/public`
3. If not, configure manually via options page

### Issue: "Clerk SDK not loaded"
**Solution:**
1. Rebuild Clerk bundle: `npm run build:clerk`
2. Verify `src/vendor/clerk.js` exists
3. Reload extension in Chrome

### Issue: "Authentication fails"
**Solution:**
1. Check Clerk key is valid (starts with `pk_test_` or `pk_live_`)
2. Verify Clerk instance domain matches your Clerk app
3. Check browser console for detailed error messages

## ✅ Current Status

Based on code review:
- ✅ **Clerk keys are fetched automatically** from backend (no manual setup needed)
- ✅ **Fallback options exist** (manual config via options page)
- ✅ **Clerk SDK is bundled** (`src/vendor/clerk.js`)
- ✅ **No environment variables required** (keys come from backend or options)

## 🎯 Next Steps

1. **If backend is ready:**
   - ✅ No action needed - keys will be fetched automatically
   - ✅ Extension will work out of the box

2. **If backend is not ready:**
   - ⚠️ Configure Clerk key manually via options page
   - ⚠️ Or set up backend API to return Clerk keys

3. **For development:**
   - ✅ Run `npm run setup` to verify everything
   - ✅ Check options page for configuration status
   - ✅ Use debug function to troubleshoot

---

**Summary:** Clerk keys are **automatically fetched from backend**. No manual setup required unless backend is not configured yet. In that case, you can configure manually via the options page.

