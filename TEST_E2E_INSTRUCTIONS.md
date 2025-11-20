# End-to-End Analysis Test Instructions

## Quick Test (Browser Console)

1. **Load the extension** in Chrome
2. **Sign in** via the extension popup (if not already signed in)
3. **Open any webpage** (e.g., google.com)
4. **Open DevTools Console** (F12)
5. **Copy and paste** the entire contents of `scripts/test-full-analysis-e2e.js`
6. **Press Enter** - the test will run automatically

## What the Test Does

1. ✅ Checks Chrome runtime availability
2. ✅ Retrieves Clerk authentication token from storage
3. ✅ Gets gateway URL configuration
4. ✅ Makes authenticated POST request to `/api/v1/guards/process`
5. ✅ Validates response structure
6. ✅ Checks score extraction from multiple paths
7. ✅ Displays full response for inspection

## Expected Results

- **Success**: All steps pass, score is extracted, response structure is valid
- **Auth Error (401)**: Token expired - sign in again
- **Network Error**: Check internet connection and backend availability
- **No Token**: Sign in via extension popup first

## Test Output

The test will show:
- ✅ Passed tests (green)
- ⚠️ Warnings (yellow)
- ❌ Failed tests (red)
- Full response data for inspection
- Score extraction details

## Manual Testing via Extension

You can also test manually:
1. Select text on any webpage
2. Click the extension icon
3. Click "Analyze" or "Show Me the Proof"
4. Check the popup for results

## Troubleshooting

- **"No Clerk token found"**: Sign in via extension popup
- **"401 Unauthorized"**: Token expired - refresh page and sign in again
- **"Network error"**: Check backend is running at https://api.aiguardian.ai
- **"No score found"**: Backend may not be returning score in expected format
