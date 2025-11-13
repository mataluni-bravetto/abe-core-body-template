/**
 * AiGuardian Authentication Module
 *
 * Handles Clerk authentication for Chrome extension
 * Provides sign in, sign up, and user session management
 *
 * IMPORTANT: Payment and subscription management is handled through Stripe
 * on the landing page (https://aiguardian.ai). Users who sign up through
 * the landing page will have their accounts automatically recognized here.
 * The extension does NOT handle payments - it only displays subscription
 * status fetched from the backend API.
 */

class AiGuardianAuth {
  constructor() {
    this.clerk = null;
    this.isInitialized = false;
    this.publishableKey = null;
    this.user = null;
  }

  /**
   * Initialize Clerk authentication
   * Automatically fetches Clerk key from backend - no user configuration needed
   */
  async initialize() {
    try {
      Logger.info('[Auth] Starting initialization...');
      
      // Get Clerk publishable key from settings (tries backend first, then fallback)
      const settings = await this.getSettings();
      this.publishableKey = settings.clerk_publishable_key;
      Logger.info('[Auth] Got settings, key present:', !!this.publishableKey, 'source:', settings.source);

      // If still no key, use hardcoded fallback (public key, safe to include)
      if (!this.publishableKey) {
        Logger.warn('[Auth] Clerk publishable key not found, using hardcoded fallback');
        this.publishableKey = "pk_test_ZmFjdHVhbC1oYXJlLTMuY2xlcmsuYWNjb3VudHMuZGV2JA";
      }

      // Import Clerk SDK dynamically
      Logger.info('[Auth] Checking Clerk SDK...', {
        'typeof Clerk': typeof Clerk,
        'window.Clerk': typeof window.Clerk
      });
      
      if (typeof Clerk === 'undefined' && typeof window.Clerk === 'undefined') {
        Logger.info('[Auth] Clerk SDK not found, loading...');
        await this.loadClerkSDK();
        Logger.info('[Auth] Clerk SDK loaded');
      } else {
        Logger.info('[Auth] Clerk SDK already available');
      }

      // Initialize Clerk for Chrome extension
      // The bundled Clerk SDK auto-instantiates window.Clerk with publishable key from window.__clerk_publishable_key
      // We set this in loadClerkSDK() before loading the script
      const clerkInstance = window.Clerk;
      Logger.info('[Auth] Clerk instance:', {
        exists: !!clerkInstance,
        type: typeof clerkInstance,
        hasLoad: typeof clerkInstance?.load === 'function'
      });
      
      if (!clerkInstance) {
        throw new Error('Clerk SDK not loaded - window.Clerk not found');
      }
      
      // Use the auto-instantiated Clerk instance
      this.clerk = clerkInstance;
      Logger.info('[Auth] Clerk instance assigned');
      
      // Ensure Clerk is loaded
      Logger.info('[Auth] Checking if Clerk is loaded...', {
        loaded: this.clerk.loaded,
        hasLoad: typeof this.clerk.load === 'function'
      });
      
      if (!this.clerk.loaded) {
        Logger.info('[Auth] Calling clerk.load()...');
        await this.clerk.load();
        Logger.info('[Auth] clerk.load() completed');
      } else {
        Logger.info('[Auth] Clerk already loaded');
      }

      this.isInitialized = true;
      Logger.info('[Auth] Clerk authentication initialized successfully');

      // Check if user is already signed in
      Logger.info('[Auth] Checking user session...');
      await this.checkUserSession();
      Logger.info('[Auth] User session check completed');

      return true;
    } catch (error) {
      Logger.error('[Auth] Failed to initialize Clerk:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        error: error
      });
      console.error('[Auth] Full error details:', error);
      return false;
    }
  }

  /**
   * Load Clerk SDK from bundled file
   * Uses bundled version to avoid CSP issues with external scripts in Manifest V3
   * Sets publishable key before loading so Clerk SDK can use it
   */
  async loadClerkSDK() {
    // Check if Clerk is already loaded
    if (typeof Clerk !== 'undefined' || window.Clerk) {
      return Promise.resolve();
    }

    // Set publishable key before loading Clerk SDK
    // Clerk SDK browser build reads this from window.__clerk_publishable_key
    if (this.publishableKey) {
      window.__clerk_publishable_key = this.publishableKey;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('src/vendor/clerk.js');
      script.onload = () => {
        // Clerk should be available as window.Clerk after script loads
        if (typeof Clerk !== 'undefined' || window.Clerk) {
          resolve();
        } else {
          reject(new Error('Clerk SDK loaded but Clerk object not found'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Clerk SDK bundle'));
      document.head.appendChild(script);
    });
  }

  /**
   * Fetch public configuration from backend API
   * Gets Clerk publishable key from AWS Secrets Manager via backend
   */
  async fetchPublicConfig() {
    try {
      // Get gateway URL from settings (will use default if not configured)
      const gatewayUrl = await this.getGatewayUrl();
      if (!gatewayUrl) {
        Logger.debug('[Auth] No gateway URL available, skipping public config fetch');
        return null;
      }

      const configUrl = `${gatewayUrl.replace(/\/$/, '')}/api/v1/config/public`;
      
      Logger.info('[Auth] Fetching public config from backend:', configUrl);
      
      // Create timeout signal with fallback for browsers without AbortSignal.timeout
      let timeoutSignal;
      let timeoutId = null;
      if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
        timeoutSignal = AbortSignal.timeout(5000);
      } else {
        // Fallback for older browsers using AbortController
        const controller = new AbortController();
        timeoutId = setTimeout(() => {
          controller.abort();
        }, 5000);
        
        // Clean up timeout if signal is aborted early
        const signal = controller.signal;
        if (signal.addEventListener) {
          signal.addEventListener('abort', () => {
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
          });
        }
        timeoutSignal = signal;
      }
      
      let response;
      try {
        response = await fetch(configUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Extension-Version': chrome.runtime.getManifest().version
          },
          signal: timeoutSignal
        });
      } finally {
        // Clean up timeout after fetch completes (success or failure)
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        Logger.warn(`[Auth] Backend returned ${response.status}: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const config = await response.json();
      
      if (config.clerk_publishable_key) {
        Logger.info(`[Auth] Successfully fetched Clerk publishable key from backend (source: ${config.source || 'unknown'})`);
        // Cache the key in storage for offline use
        await this.cacheClerkKey(config.clerk_publishable_key);
        return config;
      }
      
      Logger.warn('[Auth] Backend config response missing clerk_publishable_key');
      return null;
    } catch (error) {
      // Don't log as error if it's just a network issue - backend might not be available yet
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        Logger.debug('[Auth] Backend config fetch timed out or was aborted');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        Logger.debug('[Auth] Backend not reachable, will try manual config or retry later');
      } else {
        Logger.warn('[Auth] Failed to fetch public config from backend:', error.message);
      }
      return null;
    }
  }

  /**
   * Get gateway URL from storage or use default
   */
  async getGatewayUrl() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['gateway_url'], (data) => {
        // Use configured URL or fall back to default production URL
        resolve(data.gateway_url || DEFAULT_CONFIG.GATEWAY_URL || 'https://api.aiguardian.ai');
      });
    });
  }

  /**
   * Cache Clerk publishable key in storage
   */
  async cacheClerkKey(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ 
        clerk_publishable_key: key,
        clerk_key_source: 'backend_api',
        clerk_key_cached_at: Date.now()
      }, resolve);
    });
  }

  /**
   * Get authentication settings from storage or backend API
   * Tries backend API first, falls back to manual configuration, then hardcoded default
   * Users never need to configure anything - it just works
   */
  async getSettings() {
    // First, try to fetch from backend API (if gateway URL is configured)
    const publicConfig = await this.fetchPublicConfig();
    if (publicConfig && publicConfig.clerk_publishable_key) {
      return {
        clerk_publishable_key: publicConfig.clerk_publishable_key,
        source: 'backend_api'
      };
    }

    // Fallback to manual configuration from storage
    return new Promise((resolve) => {
      chrome.storage.sync.get(['clerk_publishable_key'], (data) => {
        const manualKey = data.clerk_publishable_key || null;
        
        // If no manual config, use hardcoded fallback (public key, safe to include)
        if (!manualKey) {
          resolve({
            clerk_publishable_key: "pk_test_ZmFjdHVhbC1oYXJlLTMuY2xlcmsuYWNjb3VudHMuZGV2JA",
            source: 'hardcoded_default'
          });
        } else {
          resolve({
            clerk_publishable_key: manualKey,
            source: 'manual_config'
          });
        }
      });
    });
  }

  /**
   * Check current user session
   */
  async checkUserSession() {
    if (!this.isInitialized || !this.clerk) return;

    try {
      // Wait for Clerk to be ready
      await this.clerk.load();
      
      // Try to get user from Clerk instance
      let user = null;
      try {
        user = this.clerk.user;
      } catch (e) {
        // If Clerk.user throws, try getting from storage
        const stored = await this.getStoredUser();
        if (stored) {
          // Create a user-like object from stored data
          user = stored;
        }
      }
      
      if (user) {
        this.user = user;
        Logger.info('[Auth] User session found:', user.id || 'stored');
      } else {
        this.user = null;
        Logger.info('[Auth] No active user session');
      }
    } catch (error) {
      Logger.error('[Auth] Error checking user session:', error);
      // Fallback: check stored user
      const stored = await this.getStoredUser();
      if (stored) {
        this.user = stored;
      } else {
        this.user = null;
      }
    }
  }

  /**
   * Get stored user from extension storage
   */
  async getStoredUser() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['clerk_user'], (data) => {
        resolve(data.clerk_user || null);
      });
    });
  }

  /**
   * Sign in user - redirect to Clerk auth page
   */
  async signIn() {
    if (!this.isInitialized || !this.clerk) {
      throw new Error('Clerk authentication not initialized');
    }

    try {
      // Generate Clerk sign-in URL with redirect
      const redirectUrl = chrome.runtime.getURL('/src/clerk-callback.html');
      
      // Build sign-in URL using Clerk's instance configuration
      // Include publishable key so Clerk knows which application instance to use
      let signInUrl;
      
      if (this.publishableKey) {
        // Use Clerk's instance-specific sign-in URL with publishable key
        const instanceDomain = this.publishableKey.includes('pk_test_') 
          ? 'accounts.clerk.dev' 
          : 'accounts.clerk.com';
        
        signInUrl = `https://${instanceDomain}/sign-in?__clerk_publishable_key=${encodeURIComponent(this.publishableKey)}&redirect_url=${encodeURIComponent(redirectUrl)}`;
      } else {
        // Fallback to standard URL (shouldn't happen if initialized properly)
        signInUrl = `https://accounts.clerk.com/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`;
        Logger.warn('[Auth] Sign-in without publishable key - may not work correctly');
      }
      
      Logger.info('[Auth] Opening sign-in URL:', signInUrl);
      
      // Open sign-in page in new tab
      chrome.tabs.create({ url: signInUrl });
    } catch (error) {
      Logger.error('[Auth] Error during sign in:', error);
      throw error;
    }
  }

  /**
   * Sign up user - redirect to Clerk auth page
   */
  async signUp() {
    Logger.info('[Auth] signUp() called');
    Logger.info('[Auth] isInitialized:', this.isInitialized);
    Logger.info('[Auth] clerk exists:', !!this.clerk);
    Logger.info('[Auth] publishableKey:', this.publishableKey ? `${this.publishableKey.substring(0, 20)}...` : 'null');

    if (!this.isInitialized || !this.clerk) {
      const error = new Error('Clerk authentication not initialized');
      Logger.error('[Auth] Sign-up failed - not initialized:', {
        isInitialized: this.isInitialized,
        hasClerk: !!this.clerk,
        publishableKey: this.publishableKey ? 'present' : 'missing'
      });
      throw error;
    }

    try {
      // Generate Clerk sign-up URL with redirect
      const redirectUrl = chrome.runtime.getURL('/src/clerk-callback.html');
      Logger.info('[Auth] Redirect URL:', redirectUrl);
      
      // Build sign-up URL using Clerk's instance configuration
      // Include publishable key so Clerk knows which application instance to use
      let signUpUrl;
      
      if (this.publishableKey) {
        // Use Clerk's instance-specific sign-up URL with publishable key
        // Format: https://<instance>.clerk.accounts.dev/sign-up?redirect_url=...
        const instanceDomain = this.publishableKey.includes('pk_test_') 
          ? 'accounts.clerk.dev' 
          : 'accounts.clerk.com';
        
        Logger.info('[Auth] Using Clerk domain:', instanceDomain);
        
        // Extract instance identifier from publishable key if possible
        // Or use the standard Clerk URL with publishable key parameter
        signUpUrl = `https://${instanceDomain}/sign-up?__clerk_publishable_key=${encodeURIComponent(this.publishableKey)}&redirect_url=${encodeURIComponent(redirectUrl)}`;
      } else {
        // Fallback to standard URL (shouldn't happen if initialized properly)
        signUpUrl = `https://accounts.clerk.com/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`;
        Logger.warn('[Auth] Sign-up without publishable key - may not work correctly');
      }
      
      Logger.info('[Auth] Opening sign-up URL:', signUpUrl);
      
      // Open sign-up page in new tab
      // Note: chrome.tabs.create callback errors don't propagate to outer try-catch
      // So we handle errors in the callback and don't throw
      chrome.tabs.create({ url: signUpUrl }, (tab) => {
        if (chrome.runtime.lastError) {
          const errorMsg = chrome.runtime.lastError.message;
          Logger.error('[Auth] Failed to create tab:', errorMsg);
          // Can't throw here - callback errors don't propagate
          // Instead, show error via message to popup
          chrome.runtime.sendMessage({
            type: 'AUTH_ERROR',
            error: `Failed to open sign-up page: ${errorMsg}`
          }).catch(() => {
            // Ignore if no listener
          });
        } else {
          Logger.info('[Auth] Tab created successfully:', tab ? tab.id : 'unknown');
        }
      });
    } catch (error) {
      Logger.error('[Auth] Error during sign up:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  /**
   * Sign out user
   */
  async signOut() {
    if (!this.isInitialized || !this.clerk) {
      // Even if Clerk not initialized, clear stored user
      await this.clearStoredUser();
      this.user = null;
      return;
    }

    try {
      await this.clerk.signOut();
      await this.clearStoredUser();
      this.user = null;
      Logger.info('[Auth] User signed out');
    } catch (error) {
      Logger.error('[Auth] Error during sign out:', error);
      // Clear stored user even if Clerk signOut fails
      await this.clearStoredUser();
      this.user = null;
      throw error;
    }
  }

  /**
   * Clear stored user from extension storage
   */
  async clearStoredUser() {
    return new Promise((resolve) => {
      chrome.storage.local.remove(['clerk_user', 'clerk_token'], resolve);
    });
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.user !== null;
  }

  /**
   * Get user avatar URL
   */
  getUserAvatar() {
    if (!this.user) return null;

    // Return profile image URL or fallback to initials
    // Handle both Clerk user object and stored user object
    return this.user.imageUrl || this.user.profileImageUrl || null;
  }

  /**
   * Get user display name
   */
  getUserDisplayName() {
    if (!this.user) return null;

    // Handle both Clerk user object and stored user object
    const firstName = this.user.firstName;
    const lastName = this.user.lastName;
    const username = this.user.username;
    const email = this.user.email || (this.user.primaryEmailAddress?.emailAddress);

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return username || email || 'User';
  }

  /**
   * Get authentication token for API calls
   * Stores token in chrome.storage.local for service worker access
   */
  async getToken() {
    if (!this.isInitialized || !this.clerk) {
      // Try to get stored token as fallback
      return await this.getStoredToken();
    }

    try {
      // Get token from Clerk session
      const session = await this.clerk.session;
      if (!session) {
        return await this.getStoredToken();
      }

      const token = await session.getToken();
      
      // Store token for service worker access
      if (token) {
        await this.storeToken(token);
      }
      
      return token;
    } catch (error) {
      Logger.error('[Auth] Error getting token:', error);
      // Fallback to stored token
      return await this.getStoredToken();
    }
  }

  /**
   * Store Clerk token in extension storage
   */
  async storeToken(token) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ clerk_token: token }, resolve);
    });
  }

  /**
   * Get stored Clerk token from extension storage
   */
  async getStoredToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['clerk_token'], (data) => {
        resolve(data.clerk_token || null);
      });
    });
  }

  /**
   * Clear stored Clerk token
   */
  async clearStoredToken() {
    return new Promise((resolve) => {
      chrome.storage.local.remove(['clerk_token'], resolve);
    });
  }

  /**
   * Handle authentication callback
   */
  async handleCallback() {
    if (!this.isInitialized || !this.clerk) return;

    try {
      // Handle the authentication callback
      await this.clerk.handleRedirectCallback();
      await this.checkUserSession();
      Logger.info('[Auth] Authentication callback handled');
    } catch (error) {
      Logger.error('[Auth] Error handling callback:', error);
    }
  }
}

// Export for use in other modules
window.AiGuardianAuth = AiGuardianAuth;
