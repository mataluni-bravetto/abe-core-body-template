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
   */
  async initialize() {
    try {
      // Get Clerk publishable key from settings
      const settings = await this.getSettings();
      this.publishableKey = settings.clerk_publishable_key;

      if (!this.publishableKey) {
        Logger.warn('[Auth] Clerk publishable key not configured');
        return false;
      }

      // Import Clerk SDK dynamically
      if (typeof Clerk === 'undefined') {
        await this.loadClerkSDK();
      }

      // Initialize Clerk for Chrome extension
      this.clerk = new Clerk(this.publishableKey);
      await this.clerk.load();

      this.isInitialized = true;
      Logger.info('[Auth] Clerk authentication initialized');

      // Check if user is already signed in
      await this.checkUserSession();

      return true;
    } catch (error) {
      Logger.error('[Auth] Failed to initialize Clerk:', error);
      return false;
    }
  }

  /**
   * Load Clerk SDK dynamically
   */
  async loadClerkSDK() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@4/dist/index.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Clerk SDK'));
      document.head.appendChild(script);
    });
  }

  /**
   * Get authentication settings from storage
   */
  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['clerk_publishable_key'], (data) => {
        resolve(data);
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
      const signInUrl = `https://accounts.clerk.com/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`;
      
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
    if (!this.isInitialized || !this.clerk) {
      throw new Error('Clerk authentication not initialized');
    }

    try {
      // Generate Clerk sign-up URL with redirect
      const redirectUrl = chrome.runtime.getURL('/src/clerk-callback.html');
      const signUpUrl = `https://accounts.clerk.com/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`;
      
      // Open sign-up page in new tab
      chrome.tabs.create({ url: signUpUrl });
    } catch (error) {
      Logger.error('[Auth] Error during sign up:', error);
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
