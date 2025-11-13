# 🧪 Manual Clerk Authentication Testing Guide

**For AiGuardian Chrome Extension**

## 🎯 Test Overview

This guide walks through testing the complete Clerk authentication flow to ensure it works correctly for end users.

## 📋 Prerequisites

1. **Extension Loaded**: Load the unpacked extension in Chrome
2. **Clerk Account**: Have a Clerk account ready for testing
3. **Backend Access**: Ensure your backend API is running (if testing with real API)
4. **DevTools Ready**: Open Chrome DevTools (F12) for logging

## 🧪 Test Steps

### **Test 1: Extension Initialization**
1. Click the AiGuardian extension icon
2. Verify popup opens without errors
3. Check console for any Clerk initialization errors
4. Verify "Sign In" and "Sign Up" buttons are visible

**Expected**: No console errors, buttons visible

### **Test 2: Sign Up Flow**
1. Click the "Sign Up" button
2. Verify a new tab opens with Clerk sign-up page
3. Complete the registration form
4. Submit the form
5. Verify redirect back to extension callback page

**Expected**:
- New tab opens to `https://accounts.clerk.com/sign-up?...`
- After signup, redirects to `chrome-extension://[id]/src/clerk-callback.html`
- Callback page shows "Processing authentication..."
- Extension popup updates to show user profile

### **Test 3: Sign In Flow**
1. If already signed up, click "Sign In" button
2. Complete sign-in form
3. Verify redirect back to extension

**Expected**: Same as sign-up flow

### **Test 4: User Profile Display**
After successful authentication:
1. Verify user avatar/initials appear
2. Verify user display name appears
3. Verify "Sign Out" button replaces "Sign In/Sign Up"
4. Verify main content becomes visible

**Expected**:
- User profile section shows avatar/name
- Auth buttons hidden
- Main content (analysis section) visible

### **Test 5: Authenticated Analysis**
1. Go to any webpage (not chrome:// pages)
2. Select text (10+ characters)
3. Verify analysis works
4. Check network tab for authenticated API calls

**Expected**:
- Analysis completes successfully
- API requests include Authorization header with Bearer token
- Results display correctly

### **Test 6: Token Persistence**
1. Close and reopen extension popup
2. Verify user remains signed in
3. Verify analysis still works without re-authentication

**Expected**:
- User session persists across popup opens
- No need to sign in again

### **Test 7: Sign Out Flow**
1. Click "Sign Out" button
2. Verify user profile disappears
3. Verify sign in/up buttons reappear
4. Verify main content becomes hidden

**Expected**:
- Clean sign out
- Return to unauthenticated state

## 🐛 Common Issues & Fixes

### **Issue: "Authentication not configured"**
- **Cause**: Clerk publishable key not set
- **Fix**: Go to extension options, set Clerk key
- **Test**: Options page should show "Auto" or allow manual entry

### **Issue: Callback page shows error**
- **Cause**: Callback handling failed
- **Fix**: Check console for Clerk SDK errors
- **Test**: Verify Clerk key is valid

### **Issue: API calls fail after auth**
- **Cause**: Token not retrieved or invalid
- **Fix**: Check chrome.storage.local for clerk_token
- **Test**: Network tab should show Bearer token in Authorization header

### **Issue: User profile doesn't show**
- **Cause**: User data not retrieved after auth
- **Fix**: Check Clerk SDK user object availability
- **Test**: Console should show user data in auth callback

## 📊 Test Results Logging

Use this template to record test results:

```
🧪 Clerk Auth Test Results
Date: YYYY-MM-DD
Tester: [Name]

Test 1 - Initialization: ✅ PASS / ❌ FAIL
Details: [Any issues or observations]

Test 2 - Sign Up Flow: ✅ PASS / ❌ FAIL
Details: [Any issues or observations]

Test 3 - Sign In Flow: ✅ PASS / ❌ FAIL
Details: [Any issues or observations]

Test 4 - User Profile: ✅ PASS / ❌ FAIL
Details: [Any issues or observations]

Test 5 - Auth Analysis: ✅ PASS / ❌ FAIL
Details: [Any issues or observations]

Test 6 - Persistence: ✅ PASS / ❌ FAIL
Details: [Any issues or observations]

Test 7 - Sign Out: ✅ PASS / ❌ FAIL
Details: [Any issues or observations]

Overall: ✅ ALL PASS / ⚠️ ISSUES FOUND / ❌ CRITICAL FAIL
Issues Found: [List any issues]
```

## 🔧 Debug Commands

Open Chrome DevTools Console and run:

```javascript
// Check if Clerk is loaded
typeof Clerk

// Check auth instance
// (In popup context)
auth.isAuthenticated()
auth.getCurrentUser()

// Check stored token
chrome.storage.local.get(['clerk_token'], console.log)

// Check Clerk key configuration
chrome.storage.sync.get(['clerk_publishable_key'], console.log)
```

## 📞 If Tests Fail

1. **Check Console Errors**: Look for Clerk SDK errors
2. **Verify Clerk Key**: Ensure publishable key is correct
3. **Check Network**: Verify API calls to Clerk work
4. **Test Callback URL**: Ensure callback page loads
5. **Check Permissions**: Verify extension has identity permission

## 🎯 Success Criteria

- ✅ All 7 tests pass without console errors
- ✅ Authentication persists across sessions
- ✅ API calls include proper Authorization headers
- ✅ User experience is smooth and intuitive
- ✅ Error messages are helpful when failures occur

## 📝 Notes for Developers

- Clerk SDK may not be immediately available after `clerk.load()`
- Token retrieval might require waiting for Clerk session
- Extension context limitations may affect some Clerk features
- Callback handling is custom (not using `handleRedirectCallback`)

---

**Ready to test? Start with Test 1 and work through each step systematically.**
