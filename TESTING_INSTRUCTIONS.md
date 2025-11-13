# 🧪 AiGuardian Extension Testing Instructions

## Quick Start

1. **Start the test server:**
   ```bash
   node test-server.js
   ```

2. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder: `C:\Users\jimmy\.cursor\AI-Guardians-chrome-ext`

3. **Open the test page:**
   - Navigate to: `http://localhost:8000/test-extension-features.html`
   - Follow the test checklist on the page

## Validation

Before loading, validate the extension structure:
```bash
node validate-extension.js
```

This will check:
- ✅ manifest.json is valid
- ✅ All referenced files exist
- ✅ Service worker imports are correct
- ✅ Popup dependencies are present

## Test Checklist

### ✅ Test 1: Extension Loading
- [ ] Extension loads without errors
- [ ] Extension icon appears in toolbar
- [ ] No console errors in extension background

### ✅ Test 2: Popup Opening
- [ ] Popup opens when clicking icon
- [ ] All UI elements render correctly
- [ ] No JavaScript errors in popup console
- [ ] Logo and branding display correctly

### ✅ Test 3: Onboarding Tooltip
- [ ] Welcome tooltip appears on first open
- [ ] Tooltip design is correct
- [ ] "Got it!" button closes tooltip
- [ ] Tooltip doesn't reappear after dismissal

### ✅ Test 4: Authentication Flow
- [ ] Sign In button opens Clerk authentication
- [ ] Authentication completes successfully
- [ ] User profile displays after sign in
- [ ] Sign Out works correctly

### ✅ Test 5: Text Selection & Analysis
- [ ] Analysis badge appears on text selection
- [ ] Text gets highlighted with appropriate color
- [ ] Results appear in popup
- [ ] Confidence scores are displayed
- [ ] Bias type is identified correctly

### ✅ Test 6: Keyboard Shortcuts
- [ ] Ctrl+Shift+A triggers analysis
- [ ] Ctrl+Shift+C clears highlights
- [ ] Ctrl+Shift+H shows history

### ✅ Test 7: Context Menu
- [ ] Context menu option appears
- [ ] Context menu triggers analysis

## Common Issues & Fixes

### Issue: Extension doesn't load
**Fix:** 
- Check Developer mode is enabled
- Verify folder path is correct
- Check console for errors (`chrome://extensions/` → Extension details → Errors)
- Run `node validate-extension.js` to check structure

### Issue: Popup doesn't open
**Fix:**
- Check browser console for JavaScript errors
- Verify all scripts load in popup.html
- Check that `logging.js` loads before other scripts

### Issue: Onboarding tooltip doesn't appear
**Fix:**
- Clear extension storage: Open popup → Right-click → Inspect → Console → `chrome.storage.sync.clear()`
- Reload extension
- Check `onboarding.js` is loaded in popup

### Issue: Authentication doesn't work
**Fix:**
- Verify Clerk publishable key is set
- Check callback page exists: `src/clerk-callback.html`
- Verify callback URL matches Clerk dashboard settings

## Debugging Tips

1. **Check Extension Console:**
   - Right-click extension icon → Inspect popup
   - Check for JavaScript errors

2. **Check Background Service Worker:**
   - Go to `chrome://extensions/`
   - Click "service worker" link under extension
   - Check console for errors

3. **Check Content Script:**
   - Open any webpage
   - Open DevTools → Console
   - Look for content script errors

4. **Check Network Requests:**
   - Open DevTools → Network tab
   - Try using extension features
   - Verify API requests are being made

## Test Report

After testing, generate a report:
1. Complete all checkboxes on test page
2. Click "Generate Test Report"
3. Download the JSON report
4. Share with team for review

## Next Steps

After successful testing:
1. ✅ All tests pass
2. ✅ No console errors
3. ✅ User experience is smooth
4. ✅ Error messages are helpful
5. ✅ Visual feedback is clear

---

**Happy Testing! 🚀**

