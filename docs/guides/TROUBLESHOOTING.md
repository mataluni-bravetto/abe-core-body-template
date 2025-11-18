# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Extension Buttons Not Working

**Symptoms:** Buttons in the extension popup don't respond to clicks.

**Solution:**
1. **Check Console for Errors:**
   - Right-click extension popup → Inspect
   - Check Console tab for syntax errors
   - Look for: `Uncaught SyntaxError: await is only valid in async functions`

2. **Reload Extension:**
   - Go to `chrome://extensions/`
   - Find AiGuardian extension
   - Click the refresh/reload button
   - Reopen popup and test buttons

3. **Verify Event Listeners:**
   - Open popup DevTools Console
   - Look for: `[Popup] Setting up event listeners...`
   - Should see: `[Popup] Found [buttonName], attaching listener`

**Recent Fix:** Added `async` keyword to `chrome.runtime.onMessage.addListener` callback to fix syntax error preventing script loading.

### Authentication Issues

**Symptoms:** User signs in but popup doesn't show authenticated state.

**Solution:**
1. **Check Storage:**
   ```javascript
   // In popup console
   chrome.storage.local.get(['clerk_user', 'clerk_token'], (data) => {
     console.log('Storage:', data);
   });
   ```

2. **Manual Refresh:**
   - Click "🔄 Refresh Auth" button in popup
   - Or close and reopen popup

3. **Check Diagnostic Panel:**
   - Click "🔍 Status" button
   - Verify "Auth State" shows correct status
   - Click "🔄 Refresh" to update

**Recent Fix:** Enhanced storage verification and message handling for auth callbacks.

### Diagnostic Panel Not Updating

**Symptoms:** Diagnostic panel shows stale information, refresh button doesn't update.

**Solution:**
1. **Check Console Logs:**
   - Should see: `[Diagnostics] runDiagnostics() called`
   - Should see: `[Diagnostics] Auth data from storage:`

2. **Manual Refresh:**
   - Click "🔄 Refresh" button in diagnostic panel
   - Check console for any errors

**Recent Fix:** Improved diagnostic refresh with better error handling and logging.

### Extension Not Loading

**Symptoms:** Extension doesn't appear in Chrome or shows errors.

**Solution:**
1. **Check Manifest:**
   - Verify `manifest.json` is valid JSON
   - Check for syntax errors

2. **Check Service Worker:**
   - Go to `chrome://extensions/`
   - Find extension → Click "Service Worker" link
   - Check console for errors

3. **Verify File Structure:**
   ```
   extension-root/
   ├── manifest.json
   ├── src/
   │   ├── popup.html
   │   ├── popup.js
   │   ├── service-worker.js
   │   └── ...
   └── assets/
   ```

### Connection Issues

**Symptoms:** "Connection failed" error in popup.

**Solution:**
1. **Check Gateway URL:**
   - Open extension options/settings
   - Verify gateway URL is correct
   - Default: `https://api.aiguardian.ai`

2. **Test Connection:**
   - Use diagnostic panel "🔄 Refresh" button
   - Check "Backend" status

3. **Check Network:**
   - Verify internet connection
   - Check firewall/proxy settings

## Debugging Steps

### 1. Check Console Logs

**Popup Console:**
- Right-click extension icon → Inspect popup
- Check Console tab for errors

**Service Worker Console:**
- Go to `chrome://extensions/`
- Find extension → Click "Service Worker"
- Check Console tab

**Content Script Console:**
- Open any webpage
- Open DevTools → Console
- Look for `[CS]` prefixed logs

### 2. Check Storage State

```javascript
// Check sync storage (settings)
chrome.storage.sync.get(null, (data) => {
  console.log('Sync storage:', data);
});

// Check local storage (auth, cache)
chrome.storage.local.get(null, (data) => {
  console.log('Local storage:', data);
});
```

### 3. Clear Storage (Reset)

```javascript
// Clear all storage
chrome.storage.local.clear();
chrome.storage.sync.clear();

// Then reload extension
```

### 4. Test Individual Components

**Test Auth:**
```javascript
// In popup console
const auth = new AiGuardianAuth();
await auth.initialize();
console.log('Auth initialized:', auth.isInitialized);
```

**Test Gateway:**
```javascript
// In popup console
const response = await sendMessageToBackground('TEST_GATEWAY_CONNECTION');
console.log('Gateway test:', response);
```

## Getting Help

If issues persist:

1. **Collect Debug Information:**
   - Console logs from popup, service worker, and content script
   - Screenshot of error messages
   - Steps to reproduce

2. **Check Documentation:**
   - `docs/guides/DEVELOPER_GUIDE.md` - Development setup
   - `docs/guides/SETUP_GUIDE.md` - Installation guide
   - `docs/technical/ERROR_HANDLING_OVERVIEW.md` - Error handling details

3. **Review Recent Changes:**
   - Check git commit history
   - Review recent fixes in `CLERK_AUTH_DEBUGGING_ENHANCEMENTS.md`

## Known Issues

### Button Click Not Working
- **Status:** ✅ Fixed
- **Fix:** Added `async` to message listener callback
- **Version:** v1.0.0

### Diagnostic Panel Not Updating
- **Status:** ✅ Fixed  
- **Fix:** Improved refresh handler with better error handling
- **Version:** v1.0.0

### Auth State Not Persisting
- **Status:** ✅ Fixed
- **Fix:** Enhanced storage verification and retry logic
- **Version:** v1.0.0
