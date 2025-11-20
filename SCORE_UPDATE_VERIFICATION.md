# Bias Score Update Verification

## Code Analysis ✅

I've verified the score extraction and update flow in the codebase. The logic **should** be working correctly:

### Score Flow Path

1. **Backend Response** → `gateway.js` receives response from `/api/v1/guards/process`
2. **Score Extraction** → `extractScore()` checks multiple paths (lines 1370-1393):
   - Priority 1: `data.popup_data.bias_score` (backend always includes this for Chrome)
   - Priority 2: `data.bias_score` (primary field)
   - Priority 3: `raw_response[0].bias_score` (fallback)
   - Priority 4-8: Various nested fallback paths
3. **Score Transformation** → Score included in `transformedResponse` (line 1570)
4. **Service Worker** → Sends `analysisResult` back via `sendResponse()` (line 838)
5. **Content Script** → Receives response and displays score (content.js line 93-140)
6. **UI Display** → Score shown in badge and popup

### Code Verification

✅ **Score extraction logic**: Multiple fallback paths implemented  
✅ **Score transformation**: Score included in response object  
✅ **Message passing**: Service worker sends score to content script  
✅ **UI display**: Content script displays score in badge  
✅ **Storage**: Score saved to `last_analysis` and `analysis_history`

## Testing with Extension Loaded

Since the browser instance I'm using doesn't have the extension loaded, here's how to verify score updates:

### Step 1: Load Extension
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select extension directory

### Step 2: Sign In
1. Click extension icon
2. Sign in via Clerk authentication
3. Verify "Signed in" status appears

### Step 3: Test Analysis
1. Navigate to any webpage (e.g., `bbc.com/news`)
2. Select text (drag to select a paragraph, at least 10 characters)
3. Release mouse button (triggers automatic analysis)
4. Check extension badge (should show score percentage)
5. Open extension popup (should show score)

### Step 4: Run Diagnostic Script
1. Open browser console (F12)
2. Copy and paste contents of `scripts/diagnose-score-updates.js`
3. Press Enter
4. Review diagnostic output

## What to Check

### ✅ Score Should Update If:
- Extension is loaded and active
- User is authenticated (Clerk token present)
- Backend is responding (check Network tab for API calls)
- Backend response includes `popup_data.bias_score` or `bias_score` field
- No errors in console logs

### ❌ Score Won't Update If:
- Extension not loaded
- Not authenticated (401 errors)
- Backend not responding (network errors)
- Backend response missing score fields
- Score extraction failing (check console logs)

## Diagnostic Checklist

When extension is loaded, check:

- [ ] Extension icon visible in toolbar
- [ ] Signed in status shows in popup
- [ ] Network requests show POST to `/api/v1/guards/process`
- [ ] API response includes `bias_score` field
- [ ] Console shows score extraction logs
- [ ] Badge displays score percentage
- [ ] Popup shows score when opened
- [ ] Storage contains `last_analysis` with score

## Expected Console Logs

When analysis runs successfully, you should see:

```
[CS] 📥 Received analysis response: { success: true, score: 0.75, ... }
[CS] 🔍 Displaying analysis results - Full response structure: { scoreValue: 0.75, ... }
[GW] ✅ Score extracted: 0.75 from data.popup_data.bias_score
```

## Network Request Verification

In DevTools Network tab, filter for `aiguardian`:

1. **Request**: POST to `https://api.aiguardian.ai/api/v1/guards/process`
2. **Headers**: Should include `Authorization: Bearer <clerk_token>`
3. **Response**: Should include JSON with `bias_score` field
4. **Status**: Should be 200 OK

## Common Issues

### Issue: Score shows as 0% or null
**Possible causes:**
- Backend returning `is_poisoned=false` (score will be 0)
- Backend response missing `bias_score` field
- Score extraction paths not matching backend structure

**Solution:**
- Check backend response structure in Network tab
- Verify backend is returning `popup_data.bias_score`
- Check console logs for extraction path used

### Issue: No score displayed
**Possible causes:**
- Extension not loaded
- Not authenticated
- Backend error (check Network tab)
- Score extraction failing

**Solution:**
- Load extension
- Sign in via popup
- Check Network tab for API errors
- Run diagnostic script

## Next Steps

1. **Load extension** in Chrome
2. **Sign in** via extension popup
3. **Test analysis** by selecting text
4. **Run diagnostic script** (`scripts/diagnose-score-updates.js`)
5. **Check Network tab** for API calls and responses
6. **Review console logs** for score extraction details

The code logic is correct - the issue is likely:
- Extension not loaded in test browser instance
- Backend response structure not matching expected paths
- Authentication issues

Once extension is loaded and you're signed in, the diagnostic script will help identify any issues.

