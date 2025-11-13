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

      // Check if we're in a callback flow
      // Clerk redirects back with various parameters in URL or hash
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const isCallback = urlParams.has('code') || 
                        urlParams.has('token') || 
                        urlParams.has('__clerk_redirect_url') ||
                        hashParams.has('access_token') ||
                        hashParams.has('__clerk_redirect_url') ||
                        window.location.hash.includes('access_token') ||
                        window.location.hash.includes('__clerk');

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
      
      // Ensure Clerk is loaded
      if (!clerk.loaded) {
        await clerk.load();
      }

      // Handle Clerk redirect callback
      // This processes the OAuth callback and sets up the session
      try {
        await clerk.handleRedirectCallback();
        Logger.info('[AuthCallback] Clerk redirect callback handled successfully');
      } catch (e) {
        Logger.warn('[AuthCallback] Clerk handleRedirectCallback error (may be normal if already handled):', e.message);
        // Continue anyway - Clerk might have already processed it
      }

      // Wait a moment for Clerk to finish processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user is authenticated after redirect
      let user = null;
      try {
        // Wait for Clerk to be ready
        await clerk.load();
        user = clerk.user;
      } catch (e) {
        Logger.warn('[AuthCallback] Error getting user, retrying:', e.message);
        // Try waiting a bit more for Clerk to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
        await clerk.load();
        user = clerk.user;
      }

      if (user) {
        // Get session token before storing
        let token = null;
        try {
          const session = await clerk.session;
          if (session) {
            token = await session.getToken();
          }
        } catch (e) {
          Logger.warn('[AuthCallback] Could not get token:', e);
        }

        // Store authentication state in extension storage
        await this.storeAuthState(user, token);
        
        this.updateStatus('Authentication successful! Redirecting...');

        // Wait a moment for UI update, then redirect
        setTimeout(() => {
          this.redirectToExtension(user);
        }, 1500);
      } else {
        throw new Error('Authentication failed - no user session');
      }

    } catch (error) {
      Logger.error('[AuthCallback] Callback handling error:', error);
      this.showError('Authentication failed: ' + error.message);
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
        resolve(response?.key || null);
      });
    });
  }

  /**
   * Store authentication state in extension storage
   */
  async storeAuthState(user, token = null) {
    return new Promise((resolve) => {
      const dataToStore = {
        clerk_user: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          imageUrl: user.imageUrl || user.profileImageUrl
        }
      };

      // Store token if available
      if (token) {
        dataToStore.clerk_token = token;
      }

      chrome.storage.local.set(dataToStore, resolve);
    });
  }

  /**
   * Redirect back to Chrome extension
   */
  redirectToExtension(user) {
    try {
      // Close this tab and notify extension
      chrome.runtime.sendMessage({ 
        type: 'AUTH_CALLBACK_SUCCESS',
        user: user || null
      }, () => {
        // Close the callback tab
        window.close();
      });
    } catch (error) {
      Logger.error('[AuthCallback] Failed to redirect to extension:', error);
      // Fallback: try to navigate to extension URL
      window.location.href = chrome.runtime.getURL('/src/popup.html');
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
