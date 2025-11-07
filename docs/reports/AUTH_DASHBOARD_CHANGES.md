# Authentication & Dashboard Removal - Summary of Changes

## Overview
This document summarizes the changes made to remove JWT/internal token authentication and replace it with Clerk-only authentication, and to remove dashboard references from the codebase.

---

## Changes Made

### 1. Authentication System Overhaul (`src/gateway.js`)

#### Removed:
- `getInternalAuthToken()` method - Removed webhook-based internal token generation
- `generateFallbackToken()` method - Removed fallback token generation logic
- `X-Internal-Auth` header - Removed internal auth header
- `X-Service-Token` header - Removed service token header

#### Updated:
- `sendToGateway()` method:
  - Now uses Clerk session token directly via `getClerkSessionToken()`
  - Falls back to API key if Clerk token is not available
  - Simplified header construction to use only `Authorization: Bearer <token>`
  - Removed all internal token generation logic

- `getClerkSessionToken()` method:
  - Simplified to only get Clerk token from window.Clerk (when available)
  - Added comments explaining this is the primary authentication method
  - Removed fallback token generation

- `analyzeText()` method:
  - Now automatically retrieves Clerk user ID from stored user data (`chrome.storage.local`)
  - Includes user_id in analysis requests when available
  - Falls back gracefully if user is not authenticated

#### Result:
- All authentication now flows through Clerk
- Backend receives Clerk JWT tokens directly in Authorization header
- No more internal token generation or fallback tokens
- Cleaner, simpler authentication flow

---

### 2. Dashboard References Removed

#### Files Modified:

**`src/popup.html`**
- Removed dashboard link from footer
- Footer now only shows Website and Settings links

**`src/popup.js`**
- Updated upgrade URL to point to landing page (`/subscribe`) instead of dashboard
- Removed dashboard URL references

**`src/options.html`**
- Removed "Open Dashboard" link from header
- Kept only "Main Website" link

**`src/options.js`**
- Updated `manageSubscription()` to use landing page URL instead of dashboard
- Updated `upgradeSubscription()` to use landing page URL instead of dashboard

**`src/service-worker.js`**
- Removed `https://dashboard.aiguardian.ai` from allowed origins list
- Kept only essential origins (api, main website, localhost)

#### Result:
- All dashboard references removed from extension code
- All subscription/upgrade links now point to landing page
- Cleaner codebase without dashboard dependencies

---

### 3. Landing Page Review (`assets/brand/ai-guardian-landing-page-stuff/components/Header.tsx`)

#### Added:
- TODO comments documenting need for Clerk integration
- Instructions for integrating Clerk React components
- Notes about required setup steps

#### Current State:
- Header has placeholder Sign In/Sign Up buttons
- Needs Clerk integration (documented in TODO comments)
- Ready for Clerk React component integration

---

### 4. Dashboard TODO Created (`DASHBOARD_TODO.md`)

Created comprehensive TODO document covering:
- Phase 1: Core Infrastructure (Auth, API, Database)
- Phase 2: Frontend Components (Layout, Pages, Features)
- Phase 3: Integration (Extension, Backend, Clerk)
- Phase 4: Testing & Polish
- Technical considerations and design guidelines

---

## Backend Integration Points

### Authentication Flow:
1. Extension gets Clerk session token via `getClerkSessionToken()`
2. Token is sent in `Authorization: Bearer <clerk_token>` header
3. Backend validates Clerk token (should use Clerk's verification)
4. If no Clerk token, falls back to API key authentication

### Request Headers:
```
Authorization: Bearer <clerk_jwt_token>  // Primary auth method
X-Extension-Version: <version>
X-Request-ID: <request_id>
X-Timestamp: <iso_timestamp>
```

### Analysis Requests:
- Include `user_id` field when Clerk user is authenticated
- User ID retrieved from `chrome.storage.local.clerk_user.id`
- Backend can use this for user-specific features (history, usage tracking, etc.)

---

## Verification Checklist

- [x] JWT/internal token logic removed from gateway.js
- [x] Clerk token used directly in Authorization header
- [x] Dashboard references removed from all extension files
- [x] Landing page reviewed and documented
- [x] Dashboard TODO created
- [ ] Backend verified to accept Clerk tokens (needs backend team verification)
- [ ] Landing page Clerk integration implemented (future work)

---

## Next Steps

1. **Backend Verification**: Verify backend accepts and validates Clerk JWT tokens correctly
2. **Landing Page Integration**: Implement Clerk React components in Header.tsx
3. **Testing**: Test authentication flow end-to-end with Clerk
4. **Dashboard Implementation**: Follow DASHBOARD_TODO.md when ready to build dashboard

---

## Notes

- API key authentication is still supported as fallback for unauthenticated requests
- Clerk user ID is automatically included in analysis requests when available
- All authentication now flows through Clerk - no custom JWT handling needed
- Dashboard removed temporarily to focus on core functionality

