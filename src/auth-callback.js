/**
 * AiGuardian Authentication Callback Handler
 *
 * Handles Clerk authentication callbacks and redirects back to extension
 */

class AuthCallbackHandler {
  constructor() {
    this.extensionId = chrome.runtime.id;
    this.isProcessing = false;
  }

  /**
   * Initialize callback handling
   */
  async initialize() {
    try {
      Logger.info('[AuthCallback] Initializing callback handler');
      Logger.info('[AuthCallback] Current URL:', window.location.href);
      Logger.info('[AuthCallback] URL search:', window.location.search);
      Logger.info('[AuthCallback] URL hash:', window.location.hash);

      // Check if we're in a callback flow
      // Clerk redirects back with various parameters in URL or hash
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      // Check for OAuth errors first (before checking for successful callback)
      const hasOAuthError =
        urlParams.has('error') ||
        hashParams.has('error') ||
        urlParams.has('error_description') ||
        hashParams.has('error_description');

      if (hasOAuthError) {
        const error = urlParams.get('error') || hashParams.get('error') || 'unknown_error';
        const errorDescription =
          urlParams.get('error_description') || hashParams.get('error_description') || '';
        Logger.error('[AuthCallback] OAuth error detected:', { error, errorDescription });

        // Check if it's a redirect URI mismatch error
        if (
          error === 'redirect_uri_mismatch' ||
          errorDescription.includes('redirect_uri_mismatch') ||
          errorDescription.includes('redirect URI') ||
          errorDescription.includes('OAuth 2.0 policy') ||
          errorDescription.includes('register the redirect URI')
        ) {
          await this.handleOAuthRedirectUriError(errorDescription);
          return;
        }

        // Handle other OAuth errors
        this.showError(`OAuth error: ${error}. ${errorDescription}`);
        return;
      }

      const isCallback =
        urlParams.has('code') ||
        urlParams.has('token') ||
        urlParams.has('__clerk_redirect_url') ||
        hashParams.has('access_token') ||
        hashParams.has('__clerk_redirect_url') ||
        window.location.hash.includes('access_token') ||
        window.location.hash.includes('__clerk');

      Logger.info('[AuthCallback] Is callback:', isCallback);
      Logger.info('[AuthCallback] URL params:', Object.fromEntries(urlParams));
      Logger.info('[AuthCallback] Hash params:', Object.fromEntries(hashParams));

      if (isCallback) {
        await this.handleCallback();
      } else {
        // If no callback params, might be direct navigation - try to handle anyway
        Logger.warn('[AuthCallback] No callback parameters found, attempting to handle anyway');
        await this.handleCallback();
      }
    } catch (error) {
      Logger.error('[AuthCallback] Initialization error:', error);
      this.showError('Authentication failed: ' + error.message);
    }
  }

  /**
   * Handle Clerk authentication callback
   */
  async handleCallback() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      this.updateStatus('Processing authentication...');

      // Get publishable key from extension first
      const publishableKey = await this.getClerkPublishableKey();

      if (!publishableKey) {
        throw new Error('Clerk publishable key not configured');
      }

      // Set publishable key before loading Clerk SDK
      // Clerk SDK browser build reads this from window.__clerk_publishable_key
      window.__clerk_publishable_key = publishableKey;

      // Load Clerk SDK dynamically
      await this.loadClerkSDK();

      // Initialize Clerk
      // The bundled Clerk SDK auto-instantiates window.Clerk with publishable key
      const clerk = window.Clerk;
      if (!clerk) {
        throw new Error('Clerk SDK not loaded - window.Clerk not found');
      }

      // Ensure Clerk is loaded (only if load() method exists)
      if (typeof clerk.load === 'function' && !clerk.loaded) {
        await clerk.load();
      } else if (typeof clerk.load !== 'function') {
        Logger.info('[AuthCallback] Clerk SDK does not have load() method - assuming ready');
      }

      // Handle Clerk redirect callback
      // This processes the OAuth callback and sets up the session
      try {
        await clerk.handleRedirectCallback();
        Logger.info('[AuthCallback] Clerk redirect callback handled successfully');
      } catch (e) {
        Logger.warn(
          '[AuthCallback] Clerk handleRedirectCallback error (may be normal if already handled):',
          e.message
        );
        // Continue anyway - Clerk might have already processed it
      }

      // Wait for Clerk to finish processing and user to be available
      // In development mode or OAuth flows, this can take longer
      let user = null;
      const maxRetries = 10;
      const retryDelay = 500; // 500ms between retries

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Ensure Clerk is loaded
          if (typeof clerk.load === 'function' && !clerk.loaded) {
            await clerk.load();
          }

          // Check for user
          user = clerk.user;

          if (user) {
            Logger.info(`[AuthCallback] User found on attempt ${attempt + 1}:`, user.id);
            break;
          }

          // If no user yet, wait before retrying
          if (attempt < maxRetries - 1) {
            Logger.info(
              `[AuthCallback] No user yet, waiting ${retryDelay}ms before retry ${attempt + 2}/${maxRetries}...`
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        } catch (e) {
          Logger.warn(`[AuthCallback] Error getting user on attempt ${attempt + 1}:`, e.message);
          if (attempt < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
      }

      // If still no user after retries, try checking session directly
      if (!user) {
        Logger.warn('[AuthCallback] No user found after retries, checking session directly...');
        try {
          const session = await clerk.session;
          if (session) {
            Logger.info('[AuthCallback] Session found, attempting to get user from session...');
            // Try to reload Clerk to sync session
            if (typeof clerk.load === 'function') {
              await clerk.load();
            }
            user = clerk.user;
          }
        } catch (sessionError) {
          Logger.warn('[AuthCallback] Error checking session:', sessionError.message);
        }
      }

      if (user) {
        // Get session token before storing
        let token = null;
        try {
          const session = await clerk.session;
          if (session) {
            token = await session.getToken();
            Logger.info('[AuthCallback] Session token retrieved');
          }
        } catch (e) {
          Logger.warn('[AuthCallback] Could not get token:', e);
        }

        // Store authentication state in extension storage
        Logger.info('[AuthCallback] Storing authentication state...');
        Logger.info('[AuthCallback] User object:', {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
          hasToken: !!token,
          userKeys: Object.keys(user).slice(0, 10),
        });

        try {
          await this.storeAuthState(user, token);
          Logger.info('[AuthCallback] storeAuthState() completed');
        } catch (storeError) {
          Logger.error('[AuthCallback] storeAuthState() failed:', {
            error: storeError.message,
            stack: storeError.stack,
          });
          throw storeError;
        }

        // Verify storage was written successfully - with multiple attempts
        Logger.info('[AuthCallback] Starting storage verification...');
        let stored = false;
        const maxVerifyAttempts = 3;
        const verifyDelay = 300;

        for (let attempt = 0; attempt < maxVerifyAttempts; attempt++) {
          stored = await this.verifyStorage(user.id);
          if (stored) {
            Logger.info(
              `[AuthCallback] ✅ Storage verification successful on attempt ${attempt + 1}`
            );
            break;
          } else {
            Logger.warn(
              `[AuthCallback] Storage verification failed on attempt ${attempt + 1}/${maxVerifyAttempts}`
            );
            if (attempt < maxVerifyAttempts - 1) {
              Logger.info(`[AuthCallback] Waiting ${verifyDelay}ms before retry...`);
              await new Promise((resolve) => setTimeout(resolve, verifyDelay));
            }
          }
        }

        if (!stored) {
          Logger.error(
            '[AuthCallback] Storage verification failed after all attempts - retrying storage write...'
          );
          // Retry storage write
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            await this.storeAuthState(user, token);
            Logger.info('[AuthCallback] Retry storage write completed');

            // Verify retry
            stored = await this.verifyStorage(user.id);
            if (!stored) {
              Logger.error('[AuthCallback] Storage verification still failed after retry');
              throw new Error('Failed to store authentication state after retry');
            }
          } catch (retryError) {
            Logger.error('[AuthCallback] Retry storage write failed:', retryError);
            throw new Error('Failed to store authentication state: ' + retryError.message);
          }
        }

        Logger.info('[AuthCallback] ✅ Authentication state stored and verified successfully');
        this.updateStatus('Authentication successful! Redirecting...');

        // Wait longer to ensure storage is fully persisted before closing
        Logger.info(
          '[AuthCallback] Waiting 2 seconds before redirecting to ensure storage persistence...'
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Final verification before redirecting
        const finalVerify = await this.verifyStorage(user.id);
        if (!finalVerify) {
          Logger.error('[AuthCallback] ⚠️ Final verification failed - storage may not persist');
        } else {
          Logger.info('[AuthCallback] ✅ Final verification passed - storage confirmed');
        }

        // Send message to service worker before closing (include token)
        this.redirectToExtension(user, token);
      } else {
        throw new Error(
          'Authentication failed - no user session found after ' + maxRetries + ' attempts'
        );
      }
    } catch (error) {
      Logger.error('[AuthCallback] Callback handling error:', error);
      this.showError('Authentication failed: ' + error.message);
    } finally {
      // Always reset processing flag, even on error
      this.isProcessing = false;
    }
  }

  /**
   * Load Clerk SDK from bundled file
   * Uses bundled version to avoid CSP issues with external scripts in Manifest V3
   * Note: Publishable key should be set in window.__clerk_publishable_key before calling this
   */
  async loadClerkSDK() {
    // Check if Clerk is already loaded
    if (window.Clerk) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('src/vendor/clerk.js');
      script.onload = () => {
        // Clerk should be available as window.Clerk after script loads
        if (window.Clerk) {
          resolve();
        } else {
          reject(new Error('Clerk SDK loaded but window.Clerk not found'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Clerk SDK bundle'));
      document.head.appendChild(script);
    });
  }

  /**
   * Get Clerk publishable key from extension storage
   */
  async getClerkPublishableKey() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_CLERK_KEY' }, (response) => {
        if (chrome.runtime.lastError) {
          Logger.error('[AuthCallback] Failed to get Clerk publishable key:', {
            error: chrome.runtime.lastError.message,
            fullError: chrome.runtime.lastError,
          });
          resolve(null);
          return;
        }
        resolve(response?.key || null);
      });
    });
  }

  /**
   * Store authentication state in extension storage
   */
  async storeAuthState(user, token = null) {
    return new Promise((resolve, reject) => {
      const dataToStore = {
        clerk_user: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          imageUrl: user.imageUrl || user.profileImageUrl,
        },
      };

      // Store token if available
      if (token) {
        dataToStore.clerk_token = token;
      }

      Logger.info('[AuthCallback] Writing to storage:', {
        userId: dataToStore.clerk_user.id,
        email: dataToStore.clerk_user.email,
        hasToken: !!token,
        dataKeys: Object.keys(dataToStore),
        fullData: JSON.stringify(dataToStore, null, 2),
      });

      // Check if chrome.storage is available
      if (!chrome.storage || !chrome.storage.local) {
        const error = new Error('chrome.storage.local API not available');
        Logger.error('[AuthCallback] Storage API not available:', error);
        reject(error);
        return;
      }

      chrome.storage.local.set(dataToStore, () => {
        if (chrome.runtime.lastError) {
          Logger.error('[AuthCallback] Storage error:', {
            error: chrome.runtime.lastError.message,
            code: chrome.runtime.lastError.message,
            fullError: chrome.runtime.lastError,
          });
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          Logger.info('[AuthCallback] Storage write completed successfully');
          // Immediately verify the write worked
          chrome.storage.local.get(['clerk_user', 'clerk_token'], (verifyData) => {
            if (chrome.runtime.lastError) {
              Logger.error(
                '[AuthCallback] Immediate verification read error:',
                chrome.runtime.lastError
              );
            } else {
              Logger.info('[AuthCallback] Immediate verification:', {
                hasUser: !!verifyData.clerk_user,
                userId: verifyData.clerk_user?.id,
                hasToken: !!verifyData.clerk_token,
                matches: verifyData.clerk_user?.id === dataToStore.clerk_user.id,
              });
            }
          });
          resolve();
        }
      });
    });
  }

  /**
   * Verify that user was stored in extension storage
   */
  async verifyStorage(userId) {
    return new Promise((resolve) => {
      Logger.info('[AuthCallback] Starting storage verification for userId:', userId);

      // Check if chrome.storage is available
      if (!chrome.storage || !chrome.storage.local) {
        Logger.error('[AuthCallback] Storage API not available for verification');
        resolve(false);
        return;
      }

      chrome.storage.local.get(['clerk_user', 'clerk_token'], (data) => {
        if (chrome.runtime.lastError) {
          Logger.error('[AuthCallback] Storage read error during verification:', {
            error: chrome.runtime.lastError.message,
            fullError: chrome.runtime.lastError,
          });
          resolve(false);
        } else {
          Logger.info('[AuthCallback] Verification read result:', {
            hasUser: !!data.clerk_user,
            hasToken: !!data.clerk_token,
            userId: data.clerk_user?.id,
            expectedUserId: userId,
            matches: data.clerk_user?.id === userId,
            fullData: JSON.stringify(data, null, 2),
          });

          if (data.clerk_user && data.clerk_user.id === userId) {
            Logger.info(
              '[AuthCallback] ✅ Storage verification successful - user found and ID matches'
            );
            resolve(true);
          } else {
            Logger.warn(
              '[AuthCallback] ❌ Storage verification failed - user not found or ID mismatch',
              {
                expected: userId,
                found: data.clerk_user?.id,
                hasUser: !!data.clerk_user,
                hasToken: !!data.clerk_token,
              }
            );
            resolve(false);
          }
        }
      });
    });
  }

  /**
   * Redirect back to Chrome extension
   */
  redirectToExtension(user, token = null) {
    try {
      Logger.info('[AuthCallback] Sending AUTH_CALLBACK_SUCCESS message...', {
        userId: user.id,
        hasToken: !!token,
      });

      // Send message to service worker with user data and token
      chrome.runtime.sendMessage(
        {
          type: 'AUTH_CALLBACK_SUCCESS',
          user: {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            imageUrl: user.imageUrl || user.profileImageUrl,
          },
          token: token,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            Logger.warn(
              '[AuthCallback] Message send error (may be normal if popup closed):',
              chrome.runtime.lastError.message
            );
          } else {
            Logger.info('[AuthCallback] Message sent successfully');
          }

          // Wait a moment before closing to ensure message is processed
          setTimeout(() => {
            Logger.info('[AuthCallback] Closing callback tab...');
            // Try to close the tab
            window.close();

            // If window.close() doesn't work (some browsers block it), show success message
            setTimeout(() => {
              this.updateStatus('✅ Authentication successful! You can close this tab.');
              Logger.info('[AuthCallback] Tab close blocked - showing success message');
            }, 500);
          }, 500);
        }
      );
    } catch (error) {
      Logger.error('[AuthCallback] Failed to redirect to extension:', error);
      // Show success message even if message send fails
      this.updateStatus('✅ Authentication successful! You can close this tab.');
      // Fallback: try to navigate to extension URL after delay
      setTimeout(() => {
        try {
          window.location.href = chrome.runtime.getURL('/src/popup.html');
        } catch (navError) {
          Logger.error('[AuthCallback] Navigation fallback failed:', navError);
        }
      }, 2000);
    }
  }

  /**
   * Update status message
   */
  updateStatus(message) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  /**
   * Handle OAuth redirect URI mismatch error
   */
  async handleOAuthRedirectUriError(errorDescription) {
    Logger.error('[AuthCallback] Handling OAuth redirect URI mismatch error');

    this.updateStatus('OAuth Configuration Error');

    // Store OAuth error in chrome.storage.local for persistence
    // This allows popup to check for errors even if it wasn't open when error occurred
    try {
      await chrome.storage.local.set({
        oauth_error: {
          type: 'AUTH_OAUTH_REDIRECT_URI_MISMATCH',
          error: 'redirect_uri_mismatch',
          errorDescription: errorDescription,
          timestamp: Date.now(),
        },
      });
      Logger.info('[AuthCallback] OAuth error stored in chrome.storage.local');
    } catch (storageError) {
      Logger.warn('[AuthCallback] Failed to store OAuth error:', storageError);
    }

    // Send error message to extension (for immediate display if popup is open)
    try {
      chrome.runtime.sendMessage(
        {
          type: 'AUTH_ERROR',
          error: 'redirect_uri_mismatch',
          errorDescription: errorDescription,
          errorType: 'AUTH_OAUTH_REDIRECT_URI_MISMATCH',
        },
        (response) => {
          // Handle errors in callback - chrome.runtime.sendMessage uses callbacks, not Promises
          if (chrome.runtime.lastError) {
            // Ignore if no listener (this is expected if popup is closed)
            Logger.debug(
              '[AuthCallback] sendMessage error (may be normal if no listener):',
              chrome.runtime.lastError.message
            );
          }
        }
      );
    } catch (e) {
      Logger.warn('[AuthCallback] Failed to send error message:', e);
    }

    // Show detailed error message to user
    const errorEl = document.getElementById('error');
    const statusEl = document.getElementById('status');

    if (errorEl) {
      // Build detailed error message
      const errorMessage = document.createElement('div');
      errorMessage.style.cssText = 'color: #FF5757; margin: 16px 0; line-height: 1.6;';

      const title = document.createElement('div');
      title.style.cssText = 'font-weight: 600; margin-bottom: 8px; font-size: 14px;';
      title.textContent = 'OAuth Configuration Error';

      const description = document.createElement('div');
      description.style.cssText = 'font-size: 12px; margin-bottom: 12px;';
      description.textContent =
        'Google OAuth redirect URI is not configured. The redirect URI must be registered in Google Cloud Console.';

      const redirectUri = document.createElement('div');
      redirectUri.style.cssText =
        'font-size: 11px; font-family: monospace; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; margin: 8px 0; word-break: break-all;';
      redirectUri.textContent =
        'Required redirect URI: https://clerk.aiguardian.ai/v1/oauth_callback';

      const instructions = document.createElement('div');
      instructions.style.cssText = 'font-size: 12px; margin-top: 12px;';

      // Create link element programmatically to avoid XSS risks
      const docLink = document.createElement('a');
      docLink.href =
        'https://github.com/aiguardian/chrome-extension/blob/main/docs/guides/OAUTH_CONFIGURATION.md';
      docLink.target = '_blank';
      docLink.style.color = '#33B8FF';
      docLink.textContent = 'documentation';

      instructions.textContent = 'See ';
      instructions.appendChild(docLink);
      instructions.append(' for configuration steps.');

      errorMessage.appendChild(title);
      errorMessage.appendChild(description);
      errorMessage.appendChild(redirectUri);
      errorMessage.appendChild(instructions);

      // Clear existing content
      while (errorEl.firstChild) {
        errorEl.removeChild(errorEl.firstChild);
      }
      errorEl.appendChild(errorMessage);
      errorEl.style.display = 'block';
    }

    if (statusEl) {
      statusEl.textContent = 'Configuration required';
    }

    // Hide spinner
    const spinner = document.querySelector('.spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    const errorEl = document.getElementById('error');
    const statusEl = document.getElementById('status');

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }

    if (statusEl) {
      statusEl.textContent = 'Authentication failed';
    }

    // Hide spinner
    const spinner = document.querySelector('.spinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }
}

// Initialize callback handler when page loads
document.addEventListener('DOMContentLoaded', () => {
  const handler = new AuthCallbackHandler();
  handler.initialize();
});
