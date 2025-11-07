# Clerk User Authentication - Remaining Work

**Branch**: `clerk-user-auth`  
**Date**: 2025-01-27  
**Status**: ⚠️ **PARTIALLY IMPLEMENTED** - Core structure in place, needs completion

---

## 📊 Current Implementation Status

### ✅ **What's Already Done**

1. **Authentication Module** (`src/auth.js`)
   - ✅ Basic Clerk SDK integration structure
   - ✅ Sign in/sign up methods (redirect-based)
   - ✅ Sign out functionality
   - ✅ User session persistence in `chrome.storage.local`
   - ✅ User data retrieval (avatar, display name)
   - ⚠️ **Issue**: Uses incorrect Clerk API methods (see issues below)

2. **Callback Handler** (`src/auth-callback.js`)
   - ✅ Callback page handler structure
   - ✅ User data storage after authentication
   - ✅ Redirect back to extension
   - ⚠️ **Issue**: May not work correctly with Clerk's actual callback flow

3. **Gateway Integration** (`src/gateway.js`)
   - ✅ Clerk token retrieval (`getClerkSessionToken()`)
   - ✅ Token sent in Authorization header
   - ✅ User ID included in analysis requests
   - ✅ API key fallback when no Clerk token
   - ⚠️ **Issue**: Token retrieval may not work in service worker context

4. **UI Integration** (`src/popup.js`)
   - ✅ Message listener for auth callbacks
   - ⚠️ **Issue**: Auth UI may not be fully integrated

5. **Configuration** (`src/options.js`)
   - ✅ Clerk publishable key input field
   - ✅ Key storage in `chrome.storage.sync`

---

## 🚨 **Critical Issues to Fix**

### Issue 1: Incorrect Clerk SDK Usage in `auth.js`

**Problem**: Code uses methods that don't exist in Clerk.js:
- `new Clerk(publishableKey)` - Wrong initialization
- `clerk.user` - May not be available immediately
- `clerk.session?.getToken()` - May not work in extension context
- `clerk.handleRedirectCallback()` - Wrong method for extension flow

**Current Code** (Lines 42-43, 95, 261, 276):
```javascript
this.clerk = new Clerk(this.publishableKey);
await this.clerk.load();
user = this.clerk.user;  // May not exist
return await this.clerk.session?.getToken();  // May not work
await this.clerk.handleRedirectCallback();  // Wrong method
```

**Fix Required**: 
- Use Clerk's proper initialization for Chrome extensions
- Use correct methods for token retrieval
- Handle Clerk's actual callback flow

**Files**: `src/auth.js`, `src/auth-callback.js`

---

### Issue 2: Token Retrieval in Service Worker Context

**Problem**: `getClerkSessionToken()` in `gateway.js` tries to access `window.Clerk`, but service workers don't have `window` object.

**Current Code** (Lines 825-838):
```javascript
async getClerkSessionToken() {
  try {
    // Check if Clerk is available in the current context
    if (typeof window !== 'undefined' && window.Clerk) {
      const token = await window.Clerk.session.getToken();
      return token;
    }
    // ...
  }
}
```

**Fix Required**:
- Store Clerk token in `chrome.storage.local` after authentication
- Retrieve token from storage in service worker context
- Handle token refresh/expiration

**Files**: `src/gateway.js`, `src/auth.js`, `src/auth-callback.js`

---

### Issue 3: Callback Flow May Not Work

**Problem**: The callback handler (`auth-callback.js`) may not correctly handle Clerk's OAuth callback flow.

**Current Flow**:
1. User clicks sign in → Opens Clerk URL
2. User authenticates → Redirects to `clerk-callback.html`
3. Callback handler tries to get user from `clerk.user`
4. Stores user and redirects back

**Potential Issues**:
- Clerk may not initialize correctly in callback page
- OAuth callback parameters may not be handled correctly
- Token may not be available immediately

**Fix Required**:
- Verify Clerk callback URL configuration
- Handle OAuth callback parameters correctly
- Store token immediately after authentication
- Test end-to-end flow

**Files**: `src/auth-callback.js`, `src/clerk-callback.html`

---

### Issue 4: Clerk URL Configuration

**Problem**: Hardcoded Clerk URLs may not match your Clerk instance.

**Current Code** (Lines 146, 167):
```javascript
const signInUrl = `https://accounts.clerk.com/sign-in?redirect_url=...`;
const signUpUrl = `https://accounts.clerk.com/sign-up?redirect_url=...`;
```

**Fix Required**:
- Use Clerk's proper URL format for your instance
- May need to use Clerk's hosted pages or custom domain
- Configure redirect URLs in Clerk dashboard

**Files**: `src/auth.js`

---

## 📋 **Remaining Tasks**

### High Priority (Must Fix)

1. **Fix Clerk SDK Initialization**
   - [ ] Research correct Clerk.js initialization for Chrome extensions
   - [ ] Update `auth.js` to use correct Clerk API
   - [ ] Test initialization in popup context
   - [ ] Test initialization in callback context

2. **Fix Token Storage & Retrieval**
   - [ ] Store Clerk token in `chrome.storage.local` after authentication
   - [ ] Update `getClerkSessionToken()` to read from storage
   - [ ] Handle token refresh/expiration
   - [ ] Test token retrieval in service worker context

3. **Fix Callback Flow**
   - [ ] Verify Clerk callback URL configuration
   - [ ] Handle OAuth callback parameters correctly
   - [ ] Test complete sign-in flow end-to-end
   - [ ] Test complete sign-up flow end-to-end

4. **Configure Clerk Dashboard**
   - [ ] Set up redirect URLs in Clerk dashboard
   - [ ] Configure allowed origins for extension
   - [ ] Test with actual Clerk publishable key

### Medium Priority (Should Fix)

5. **UI Integration**
   - [ ] Verify auth UI displays correctly in popup
   - [ ] Test user avatar/name display
   - [ ] Test sign out functionality
   - [ ] Add loading states during authentication

6. **Error Handling**
   - [ ] Add better error messages for auth failures
   - [ ] Handle network errors during authentication
   - [ ] Handle token expiration gracefully
   - [ ] Add retry logic for failed auth attempts

7. **Testing**
   - [ ] Test sign in flow with real Clerk account
   - [ ] Test sign up flow with real Clerk account
   - [ ] Test session persistence across extension restarts
   - [ ] Test token usage in API requests
   - [ ] Test fallback to API key when no Clerk token

### Low Priority (Nice to Have)

8. **Token Refresh**
   - [ ] Implement automatic token refresh
   - [ ] Handle token expiration gracefully
   - [ ] Refresh token before API requests

9. **User Profile Sync**
   - [ ] Sync user profile data from Clerk
   - [ ] Update stored user data periodically
   - [ ] Handle profile updates

10. **Analytics & Monitoring**
    - [ ] Track authentication success/failure rates
    - [ ] Log authentication events
    - [ ] Monitor token usage

---

## 🔍 **Testing Checklist**

### Authentication Flow
- [ ] Sign in with existing Clerk account
- [ ] Sign up new user through extension
- [ ] Verify user data stored correctly
- [ ] Verify token stored correctly
- [ ] Test sign out functionality
- [ ] Test session persistence after extension restart

### Token Usage
- [ ] Verify token sent in API requests
- [ ] Verify backend accepts Clerk token
- [ ] Test API requests with Clerk token
- [ ] Test fallback to API key when no token
- [ ] Test token expiration handling

### Error Scenarios
- [ ] Test with invalid Clerk publishable key
- [ ] Test with expired token
- [ ] Test network errors during auth
- [ ] Test callback failures
- [ ] Test sign out when not authenticated

---

## 📚 **Resources & Documentation**

### Clerk Documentation
- [Clerk Chrome Extension Guide](https://clerk.com/docs/integrations/chrome-extensions)
- [Clerk JavaScript SDK](https://clerk.com/docs/references/javascript/overview)
- [Clerk Backend Integration](https://clerk.com/docs/backend-requests/overview)

### Related Files
- `src/auth.js` - Main authentication module
- `src/auth-callback.js` - Callback handler
- `src/gateway.js` - Token usage in API requests
- `src/popup.js` - UI integration
- `src/clerk-callback.html` - Callback page
- `AUTHENTICATION_ISSUES_FIXED.md` - Previous fixes
- `BACKEND_CLERK_VERIFICATION.md` - Backend integration guide

---

## 🎯 **Recommended Next Steps**

1. **Research Clerk Chrome Extension Integration**
   - Review Clerk's official Chrome extension documentation
   - Understand correct initialization pattern
   - Understand token retrieval pattern

2. **Fix Token Storage**
   - Implement token storage in `chrome.storage.local`
   - Update `getClerkSessionToken()` to read from storage
   - Test in service worker context

3. **Fix Callback Flow**
   - Verify Clerk callback configuration
   - Test complete authentication flow
   - Fix any callback handling issues

4. **Test End-to-End**
   - Test with real Clerk account
   - Verify token works with backend
   - Test all error scenarios

---

## 📝 **Notes**

- The current implementation has the right structure but uses incorrect Clerk API methods
- Token retrieval needs to work in service worker context (no `window` object)
- Callback flow needs verification with actual Clerk instance
- Backend integration is ready (per `BACKEND_CLERK_VERIFICATION.md`)

---

**Last Updated**: 2025-01-27  
**Status**: ⚠️ **NEEDS COMPLETION** - Core structure ready, API usage needs fixing

