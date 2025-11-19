# Google OAuth Configuration Guide

## Problem

When users try to sign in with Google, they see this error:

```
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
If you're the app developer, register the redirect URI in the Google Cloud Console.
Request details: redirect_uri=https://clerk.aiguardian.ai/v1/oauth_callback
```

## Solution

The redirect URI `https://clerk.aiguardian.ai/v1/oauth_callback` must be registered in Google Cloud Console.

## Steps to Fix

### 1. Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if needed)
3. Navigate to **APIs & Services** → **Credentials**

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Fill in required information:
   - **App name**: AiGuardian (or your app name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
3. Click **Save and Continue**
4. Add scopes if needed (usually `email`, `profile`, `openid`)
5. Click **Save and Continue**
6. Add test users (if in testing mode) or publish the app

### 3. Create OAuth 2.0 Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Web application** as the application type
4. Fill in:
   - **Name**: Clerk OAuth Client (or any name)
   - **Authorized redirect URIs**: Add the following:
     ```
     https://clerk.aiguardian.ai/v1/oauth_callback
     ```
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 4. Configure Clerk with Google OAuth

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your Clerk application
3. Navigate to **User & Authentication** → **Social Connections**
4. Find **Google** and click **Configure**
5. Enter:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
6. Click **Save**

### 5. Verify Redirect URI in Clerk

The redirect URI should be automatically set to:
```
https://clerk.aiguardian.ai/v1/oauth_callback
```

If your Clerk instance uses a different domain, use:
```
https://<your-instance-id>.clerk.accounts.dev/v1/oauth_callback
```

For test instances:
```
https://<your-instance-id>.accounts.dev/v1/oauth_callback
```

## Testing

After configuration:

1. Try signing in with Google again
2. The OAuth flow should complete successfully
3. Users should be redirected back to the extension

## Troubleshooting

### Error: "redirect_uri_mismatch"

- **Cause**: Redirect URI not registered in Google Cloud Console
- **Fix**: Add the exact redirect URI to Google Cloud Console (see Step 3)

### Error: "invalid_client"

- **Cause**: Client ID or Client Secret incorrect in Clerk
- **Fix**: Verify credentials in Clerk dashboard match Google Cloud Console

### Error: "access_denied"

- **Cause**: OAuth consent screen not configured or app not published
- **Fix**: Complete OAuth consent screen setup (see Step 2)

## Important Notes

1. **Exact Match Required**: The redirect URI in Google Cloud Console must match exactly (including `https://` and trailing `/v1/oauth_callback`)

2. **Multiple URIs**: You can add multiple redirect URIs if you have:
   - Production: `https://clerk.aiguardian.ai/v1/oauth_callback`
   - Test: `https://<instance-id>.accounts.dev/v1/oauth_callback`

3. **Domain Verification**: Ensure `clerk.aiguardian.ai` (or your Clerk domain) is properly configured and accessible

4. **Clerk Configuration**: The redirect URI is managed by Clerk - you just need to ensure Google Cloud Console knows about it

## Quick Reference

**Required Redirect URI:**
```
https://clerk.aiguardian.ai/v1/oauth_callback
```

**Google Cloud Console:**
- [Credentials](https://console.cloud.google.com/apis/credentials)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)

**Clerk Dashboard:**
- [Social Connections](https://dashboard.clerk.com/apps/<your-app>/user-and-authentication/social-connections)

