# Authentication & Sign-Up Verification Checklist

## ✅ What I've Verified

### 1. **Clerk Configuration**
- ✅ Clerk publishable key is fetched from backend API (`/api/v1/config/public`)
- ✅ Falls back to manual configuration if backend unavailable
- ✅ Key is cached in extension storage for offline use
- ✅ Key source is tracked (backend_api vs manual_config)

### 2. **Sign-Up Flow**
- ✅ Sign-Up button exists in popup (`signUpBtn`)
- ✅ Button is properly wired to `auth.signUp()` method
- ✅ Sign-up redirects to Clerk's hosted sign-up page
- ✅ Callback URL is properly configured (`/src/clerk-callback.html`)
- ✅ Callback handler processes authentication and stores session

### 3. **Backend Connection**
- ✅ CSP updated to allow backend API connections
- ✅ Gateway URL can be configured and tested
- ✅ Connection test feature added to options page
- ✅ Health endpoint (`/health/live`) is accessible

### 4. **Authentication Flow**
- ✅ Sign-In button properly wired
- ✅ Sign-Out button properly wired
- ✅ User session is checked on initialization
- ✅ Auth state is stored in extension storage
- ✅ UI updates based on authentication state

## 🔍 How to Test Sign-Up

### Step 1: Verify Backend Connection
1. Open Extension Options
2. Go to "🔌 Backend Connection" section
3. Click "🔍 Test Connection"
4. Should show ✅ Connected

### Step 2: Verify Clerk Key is Loaded
1. Open Extension Options
2. Check "🔐 Authentication" section
3. Clerk Key Status should show:
   - **"Auto"** (green) = Loaded from backend ✅
   - **"Manual"** (gray) = Manual configuration

### Step 3: Test Sign-Up
1. Open Extension Popup (click extension icon)
2. Click "📝 Sign Up" button
3. New tab should open with Clerk sign-up page
4. Complete sign-up form:
   - Enter email address
   - Create password
   - Complete email verification (if required)
5. After sign-up, you'll be redirected back to extension
6. Popup should show your user profile

### Step 4: Verify Authentication
After sign-up, check:
- ✅ User avatar/initials displayed
- ✅ User name displayed
- ✅ "Sign Out" button visible
- ✅ Main content sections visible
- ✅ Can make authenticated API requests

## 🐛 Troubleshooting

### Issue: "Sign Up" button doesn't work
**Check:**
1. Open popup → Press F12 → Console tab
2. Look for errors when clicking Sign Up
3. Verify Clerk key is configured:
   - Options → Authentication section
   - Should show "Auto" or have manual key entered

**Solution:**
- Ensure backend connection works
- Clerk key should auto-load from backend
- If not, manually enter Clerk publishable key in Options

### Issue: Sign-up redirects but callback fails
**Check:**
1. Check `clerk-callback.html` page
2. Look for error messages
3. Check browser console for errors

**Solution:**
- Verify callback URL is correct: `chrome-extension://<id>/src/clerk-callback.html`
- Check Clerk dashboard → Redirect URLs includes extension callback URL
- Verify Clerk SDK bundle is loaded (`src/vendor/clerk.js`)

### Issue: "Clerk publishable key not configured"
**Check:**
1. Options → Authentication section
2. Check if key is displayed
3. Test backend connection

**Solution:**
- Backend should provide key via `/api/v1/config/public`
- If backend unavailable, manually enter key from Clerk Dashboard
- Get key from: https://dashboard.clerk.com → Your Application → API Keys

### Issue: Backend connection fails
**Check:**
1. Options → Backend Connection section
2. Test connection
3. Check error message

**Solution:**
- Verify backend is running
- Check Gateway URL is correct
- Verify CSP allows backend domain (already fixed)
- Check network/firewall settings

## 📋 Pre-Sign-Up Checklist

Before testing sign-up, ensure:

- [ ] Backend is running and accessible
- [ ] Backend connection test passes
- [ ] Clerk publishable key is loaded (shows "Auto" or manual key)
- [ ] Extension is reloaded after any manifest changes
- [ ] Browser console shows no errors

## 🔗 Important URLs

- **Clerk Dashboard**: https://dashboard.clerk.com
- **Backend Health**: `https://api.aiguardian.ai/health/live`
- **Public Config**: `https://api.aiguardian.ai/api/v1/config/public`
- **Extension Options**: Right-click extension → Options

## 📝 Notes

- Sign-up uses Clerk's hosted authentication pages
- After sign-up, user is redirected back to extension callback page
- Session token is stored in extension storage
- User can sign out and sign back in
- Authentication state persists across browser sessions

