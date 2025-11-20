# User Testing Guide - End-to-End Analysis Flow

## Prerequisites

1. **Extension Loaded**: The extension must be installed and loaded in Chrome
2. **Signed In**: User must be authenticated via Clerk (sign in through extension popup)
3. **Backend Connected**: Backend must be running at `https://api.aiguardian.ai`

## Step-by-Step User Flow Test

### Step 1: Load Extension
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the extension directory: `/Users/jimmy/Documents/Bravetto_repos/AI-Guardians-chrome-ext`
6. Verify extension appears in extensions list

### Step 2: Sign In
1. Click the extension icon in Chrome toolbar
2. Click "🔐 Sign in or sign up"
3. Complete Clerk authentication flow
4. Verify you see "Signed in" status in popup

### Step 3: Test Analysis Flow
1. Navigate to any webpage with text content (e.g., `https://www.bbc.com/news`)
2. **Select text** (at least 10 characters):
   - Click and drag to select a paragraph or sentence
   - Or double-click a word and extend selection
3. **Release mouse** - The extension should automatically:
   - Show "Analyzing..." badge
   - Send request to backend
   - Display results

### Step 4: Verify Results
The extension should:
- ✅ Show analysis badge with score
- ✅ Display score in popup (click extension icon)
- ✅ Show detailed analysis modal (if configured)
- ✅ Highlight selected text (if score is high)

### Step 5: Check Popup Display
1. Click extension icon
2. Verify you see:
   - Connection status (Backend: Connected)
   - Current score (if text was analyzed)
   - "Show Me the Proof" button works
   - Analysis history (if available)

## Expected Behavior

### Successful Analysis
- **Badge appears**: "Analyzing..." → Score badge (e.g., "Bias Score: 0.75")
- **Popup shows**: Score, bias type, confidence level
- **Network request**: POST to `https://api.aiguardian.ai/api/v1/guards/process`
- **Response**: Valid JSON with `data.bias_score` or `data.popup_data.bias_score`

### Error Cases
- **No token**: "Auth Required" badge
- **Network error**: "Connection failed" badge
- **Selection too short**: No action (silent)
- **Selection too long**: "Text too long" warning badge

## Manual Verification Checklist

- [ ] Extension loads without errors
- [ ] Can sign in via Clerk
- [ ] Token stored in `chrome.storage.local.clerk_token`
- [ ] Text selection triggers analysis
- [ ] Badge appears after selection
- [ ] API request sent to backend
- [ ] Response received successfully
- [ ] Score extracted and displayed
- [ ] Popup shows correct score
- [ ] Modal dialog works (if triggered)
- [ ] History saved correctly

## Debugging

### Check Extension Console
1. Right-click extension icon → "Inspect popup"
2. Or: `chrome://extensions/` → Extension → "Service worker" → Console

### Check Content Script
1. Open DevTools on webpage (F12)
2. Console tab
3. Look for `[CS]` prefixed logs

### Check Network Requests
1. Open DevTools → Network tab
2. Filter for `aiguardian.ai`
3. Verify POST request to `/api/v1/guards/process`
4. Check request headers (Authorization: Bearer token)
5. Check response (should have score)

### Verify Token
```javascript
// In browser console:
chrome.storage.local.get(['clerk_token'], d => console.log(d.clerk_token))
```

### Test API Directly
```bash
# Get token from console, then:
curl -X POST https://api.aiguardian.ai/api/v1/guards/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "service_type": "biasguard",
    "payload": {
      "text": "Test text for bias detection",
      "contentType": "text"
    }
  }'
```

## Common Issues

### Extension Not Loading
- Check manifest.json syntax
- Verify all files exist
- Check console for import errors

### No Analysis Triggered
- Verify content script is injected (check page source)
- Check if text selection is valid (10-5000 chars)
- Verify mouseup event is firing

### Authentication Errors
- Token expired: Sign in again
- No token: Complete Clerk flow
- 401 errors: Refresh token

### No Score Displayed
- Check response structure matches expected format
- Verify score extraction paths in gateway.js
- Check console for extraction logs

## Test Scenarios

### Scenario 1: Basic Text Selection
1. Go to news website
2. Select a news article paragraph
3. Verify analysis triggers automatically
4. Check score appears in badge

### Scenario 2: Popup Analysis
1. Select text on page
2. Click extension icon
3. Click "Show Me the Proof"
4. Verify detailed analysis modal appears

### Scenario 3: Multiple Selections
1. Select text → analyze
2. Select different text → analyze
3. Verify each gets analyzed
4. Check history shows multiple entries

### Scenario 4: Error Handling
1. Disconnect internet
2. Select text
3. Verify error message appears
4. Reconnect internet
5. Select text again
6. Verify analysis works

## Success Criteria

✅ Extension loads without errors  
✅ User can sign in successfully  
✅ Text selection triggers analysis  
✅ Backend receives authenticated request  
✅ Response contains valid score  
✅ Score displays in UI (badge/popup)  
✅ Error cases handled gracefully  
✅ No console errors during normal flow  

