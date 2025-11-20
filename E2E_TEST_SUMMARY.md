# End-to-End Analysis Test Summary

## Test Setup Complete ✅

I've created comprehensive test scripts and infrastructure to verify the full analysis flow with authentication. Here's what's available:

## Test Scripts Created

### 1. **Browser Console Test** (`scripts/test-full-analysis-e2e.js`)
   - Full-featured test that runs in browser console
   - Accesses Chrome storage directly
   - Tests complete flow with authentication
   - **Usage**: Copy script into browser console on any webpage

### 2. **Extension Popup Test** (`tests/test-e2e-popup.html`)
   - Visual test interface with results display
   - Runs in extension popup context (has Chrome API access)
   - **Usage**: Load as extension page or inject into popup.html

### 3. **Direct API Test** (`scripts/test-e2e-direct-api.js`)
   - Node.js script for command-line testing
   - Requires Clerk token as environment variable
   - **Usage**: `CLERK_TOKEN=your_token node scripts/test-e2e-direct-api.js`

### 4. **Messaging Test** (`scripts/test-e2e-via-messaging.js`)
   - Test via extension messaging API
   - Works from content script context
   - **Usage**: Inject into content script or run from extension page

## Quick Test Instructions

### Option 1: Browser Console (Easiest)
1. Load extension in Chrome
2. Sign in via extension popup
3. Open any webpage (e.g., google.com)
4. Open DevTools Console (F12)
5. Copy entire contents of `scripts/test-full-analysis-e2e.js`
6. Paste and press Enter
7. Review test results in console

### Option 2: Extension Popup
1. Load extension in Chrome
2. Sign in via extension popup
3. Open extension popup
4. Open DevTools Console (right-click popup → Inspect)
5. Copy and run test script from `scripts/test-full-analysis-e2e.js`

### Option 3: Command Line (Requires Token)
1. Extract Clerk token:
   ```javascript
   // In browser console:
   chrome.storage.local.get(['clerk_token'], d => console.log(d.clerk_token))
   ```
2. Run test:
   ```bash
   CLERK_TOKEN=your_token node scripts/test-e2e-direct-api.js
   ```

## What the Tests Verify

✅ **Step 1**: Chrome runtime and storage availability  
✅ **Step 2**: Clerk token retrieval from storage  
✅ **Step 3**: Gateway URL configuration  
✅ **Step 4**: Authenticated API request to `/api/v1/guards/process`  
✅ **Step 5**: Response structure validation  
✅ **Step 6**: Score extraction from multiple paths:
   - `data.bias_score`
   - `data.popup_data.bias_score`
   - `data.raw_response[0].bias_score`
   - `score`

## Backend Status

- **Health Endpoint**: `https://api.aiguardian.ai/health/live` ✅ Responding
- **API Endpoint**: `https://api.aiguardian.ai/api/v1/guards/process` ✅ Available
- **Authentication**: Bearer token required ✅

## Expected Test Results

### Success Case
- All steps pass ✅
- Score extracted from response
- HTTP 200 status
- Valid response structure

### Common Issues
- **401 Unauthorized**: Token expired - sign in again
- **No Token**: Sign in via extension popup first
- **Network Error**: Check internet connection
- **No Score**: Backend may not return score in expected format

## Next Steps

To run the test using MCP tools:
1. Load extension in Chrome
2. Sign in via extension popup
3. Use browser console test script (Option 1 above)
4. Or use the extension popup test page

The test scripts are ready and comprehensive. They will verify:
- Authentication flow
- API connectivity
- Response structure
- Score extraction
- End-to-end functionality

