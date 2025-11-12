# Backend Clerk Token Integration Verification

## Verification Summary

This document verifies that the Chrome extension correctly integrates with the backend using Clerk authentication tokens.

---

## ✅ Frontend Implementation (Chrome Extension)

### Current Implementation Status: **VERIFIED**

#### 1. Token Retrieval (`src/gateway.js`)
```javascript
async getClerkSessionToken() {
  // Gets Clerk JWT token from window.Clerk.session
  // Returns null if not available (graceful fallback)
}
```

**Status**: ✅ Correctly implemented
- Retrieves Clerk session token when available
- Gracefully handles cases where Clerk is not initialized
- Returns null for unauthenticated requests (allows API key fallback)

#### 2. Request Headers (`src/gateway.js` - `sendToGateway()`)
```javascript
// Build headers with Clerk token if available, otherwise use API key
const headers = {
  'Content-Type': 'application/json',
  'X-Extension-Version': chrome.runtime.getManifest().version,
  'X-Request-ID': requestId,
  'X-Timestamp': new Date().toISOString()
};

// Use Clerk token for authentication if available, otherwise fall back to API key
if (clerkToken) {
  headers['Authorization'] = 'Bearer ' + clerkToken;
} else if (this.config.apiKey) {
  headers['Authorization'] = 'Bearer ' + this.config.apiKey;
}
```

**Status**: ✅ Correctly implemented
- Sends Clerk token in `Authorization: Bearer <token>` header format
- Falls back to API key authentication when Clerk token unavailable
- Includes required extension metadata headers

#### 3. User ID Inclusion (`src/gateway.js` - `analyzeText()`)
```javascript
// Get Clerk user ID if available (from stored user data)
let userId = options.user_id || null;
if (!userId) {
  const storedUser = await chrome.storage.local.get(['clerk_user']);
  if (storedUser && storedUser.clerk_user && storedUser.clerk_user.id) {
    userId = storedUser.clerk_user.id;
  }
}

// Include in request payload
const result = await this.sendToGateway('analyze', {
  // ...
  user_id: userId,  // Clerk user ID for authenticated requests
  // ...
});
```

**Status**: ✅ Correctly implemented
- Automatically retrieves Clerk user ID from stored user data
- Includes user_id in analysis requests when authenticated
- Allows backend to track user-specific usage and history

---

## 📋 Backend Requirements (To Be Verified)

Based on `docs/guides/BACKEND_INTEGRATION_GUIDE.md`, the backend should:

### 1. Accept Clerk JWT Tokens

**Expected Format:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Backend Should:**
- ✅ Validate Clerk JWT tokens using Clerk's verification API or SDK
- ✅ Extract user information from token claims
- ✅ Handle token expiration gracefully
- ✅ Return appropriate error codes for invalid tokens (401 Unauthorized)

### 2. Support Dual Authentication

**Priority Order:**
1. **Clerk Token** (if present) - Primary authentication method
2. **API Key** (if Clerk token not present) - Fallback for unauthenticated requests

**Backend Should:**
- ✅ Check for Clerk token first
- ✅ Fall back to API key validation if no Clerk token
- ✅ Support both authentication methods simultaneously

### 3. Handle User ID in Requests

**Request Payload:**
```json
{
  "service_type": "biasguard",
  "payload": { "text": "..." },
  "user_id": "user_abc123",  // Clerk user ID (when authenticated)
  "session_id": "ext_...",
  "client_type": "chrome",
  "client_version": "1.0.0"
}
```

**Backend Should:**
- ✅ Use `user_id` for user-specific features (history, usage tracking)
- ✅ Handle null/undefined `user_id` gracefully (for API key auth)
- ✅ Validate `user_id` format matches Clerk user ID format

### 4. Clerk Token Validation

**Backend Implementation Should:**
```python
# Example Python/FastAPI implementation
from clerk_backend_sdk import Clerk

clerk = Clerk(secret_key=CLERK_SECRET_KEY)

async def verify_clerk_token(token: str):
    try:
        # Verify token with Clerk
        user = await clerk.verify_token(token)
        return user
    except Exception as e:
        # Token invalid or expired
        raise HTTPException(status_code=401, detail="Invalid token")
```

**Or using Clerk's verification endpoint:**
```python
import httpx

async def verify_clerk_token(token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.clerk.com/v1/tokens/{token}/verify",
            headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"}
        )
        if response.status_code == 200:
            return response.json()
        raise HTTPException(status_code=401, detail="Invalid token")
```

---

## 🔍 Integration Points Verification

### Request Flow

```
Chrome Extension                    Backend Gateway
─────────────────                   ────────────────
1. User authenticates via Clerk
   ↓
2. Extension gets Clerk token
   ↓
3. Extension sends request:
   Authorization: Bearer <clerk_token>
   ↓
4. Backend validates Clerk token
   ↓
5. Backend extracts user info
   ↓
6. Backend processes request
   ↓
7. Backend returns response
```

### Headers Sent by Extension

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <clerk_jwt_token>',  // Clerk token
  'X-Extension-Version': '1.0.0',
  'X-Request-ID': 'ext_1234567890_abc123',
  'X-Timestamp': '2025-01-27T12:00:00.000Z'
}
```

### Payload Sent by Extension

```json
{
  "service_type": "biasguard",
  "payload": {
    "text": "Content to analyze",
    "contentType": "text",
    "scanLevel": "standard",
    "context": "webpage-content"
  },
  "user_id": "user_abc123",  // Clerk user ID
  "session_id": "ext_1234567890_abc123",
  "client_type": "chrome",
  "client_version": "1.0.0"
}
```

---

## ✅ Verification Checklist

### Frontend (Chrome Extension)
- [x] Clerk token retrieved correctly
- [x] Token sent in Authorization header
- [x] Fallback to API key when no Clerk token
- [x] User ID included in requests when authenticated
- [x] Headers formatted correctly
- [x] Error handling for missing tokens

### Backend (To Be Verified)
- [ ] Clerk token validation implemented
- [ ] Clerk SDK/API integration configured
- [ ] Token verification endpoint working
- [ ] User ID extraction from token working
- [ ] API key fallback working
- [ ] Error responses for invalid tokens (401)
- [ ] User-specific features using user_id

---

## 🚨 Backend Action Items

### Required Backend Implementation

1. **Install Clerk Backend SDK**
   ```bash
   # Python
   pip install clerk-backend-sdk
   
   # Node.js
   npm install @clerk/clerk-sdk-node
   ```

2. **Configure Clerk Secret Key**
   ```python
   # Environment variable
   CLERK_SECRET_KEY=sk_test_...
   ```

3. **Implement Token Validation Middleware**
   ```python
   async def verify_auth(request: Request):
       auth_header = request.headers.get("Authorization")
       if not auth_header or not auth_header.startswith("Bearer "):
           # Try API key fallback
           return verify_api_key(request)
       
       token = auth_header.replace("Bearer ", "")
       try:
           user = await clerk.verify_token(token)
           request.state.user = user
           return user
       except:
           raise HTTPException(status_code=401)
   ```

4. **Update Request Handlers**
   - Extract user_id from authenticated user
   - Use user_id for user-specific features
   - Handle both Clerk and API key authentication

---

## 📝 Testing Recommendations

### Test Cases

1. **Clerk Token Authentication**
   - ✅ Send request with valid Clerk token
   - ✅ Verify backend accepts and validates token
   - ✅ Verify user_id is extracted correctly
   - ✅ Verify user-specific features work

2. **API Key Fallback**
   - ✅ Send request without Clerk token but with API key
   - ✅ Verify backend accepts API key
   - ✅ Verify request processes correctly

3. **Invalid Token Handling**
   - ✅ Send request with invalid Clerk token
   - ✅ Verify backend returns 401 Unauthorized
   - ✅ Verify error message is clear

4. **Token Expiration**
   - ✅ Send request with expired Clerk token
   - ✅ Verify backend handles gracefully
   - ✅ Verify appropriate error response

---

## 📚 Documentation References

- **Frontend Implementation**: `src/gateway.js`
- **Backend Integration Guide**: `docs/guides/BACKEND_INTEGRATION_GUIDE.md`
- **Clerk Documentation**: https://clerk.com/docs
- **Clerk Backend SDK**: https://clerk.com/docs/backend-requests/overview

---

## ✅ Conclusion

**Frontend Status**: ✅ **VERIFIED** - Chrome extension correctly implements Clerk token authentication

**Backend Status**: ⚠️ **NEEDS VERIFICATION** - Backend implementation needs to be verified/tested

### Next Steps:
1. Backend team should implement Clerk token validation
2. Test end-to-end authentication flow
3. Verify user-specific features work with Clerk user IDs
4. Update backend documentation with Clerk integration details

---

**Last Updated**: 2025-01-27  
**Verified By**: Code Review  
**Status**: Frontend Ready, Backend Verification Pending

