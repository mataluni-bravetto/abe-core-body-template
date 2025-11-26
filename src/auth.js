/**
 * AiGuardian Authentication Module
 *
 * Simplified auth - only checks storage for auth state
 * Auth is handled on landing page (www.aiguardian.ai)
 * Content script detects auth and stores it here
 */

class AiGuardianAuth {
  constructor() {
    this.user = null;
    this.isInitialized = false;
  }

  /**
   * Initialize - just check storage for existing auth
   */
  async initialize() {
    try {
      Logger.info('[Auth] Starting initialization...');
      await this.checkUserSession();
      this.isInitialized = true;
      Logger.info('[Auth] Authentication initialized');
      return true;
    } catch (error) {
      Logger.error('[Auth] Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Check current user session from storage
   */
  async checkUserSession() {
    Logger.info('[Auth] checkUserSession() called');
    
    try {
      const stored = await this.getStoredUser();
      if (stored) {
        this.user = stored;
        Logger.info('[Auth] User session found:', stored.id);
      } else {
        this.user = null;
        Logger.info('[Auth] No active user session');
      }
    } catch (error) {
      Logger.error('[Auth] Error checking user session:', error);
      this.user = null;
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
   * Get stored token from extension storage
   */
  async getStoredToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['clerk_token'], (data) => {
        resolve(data.clerk_token || null);
      });
    });
  }

  /**
   * Get authentication token for API calls
   */
  async getToken() {
    return await this.getStoredToken();
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
   * Sign out user - clear storage
   */
  async signOut() {
    await this.clearStoredUser();
    this.user = null;
    Logger.info('[Auth] User signed out');
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
    if (!this.user) {
      return null;
    }
    return this.user.imageUrl || this.user.profileImageUrl || null;
  }

  /**
   * Get user display name
   */
  getUserDisplayName() {
    if (!this.user) {
      return null;
    }

    const firstName = this.user.firstName || '';
    const lastName = this.user.lastName || '';
    const username = this.user.username || '';
    const email = this.user.email || this.user.primaryEmailAddress?.emailAddress || '';

    // Enhanced fallback chain: full name > first/last > username > email prefix > user ID suffix > 'User'
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName || lastName) {
      return firstName || lastName;
    } else if (username) {
      return username;
    } else if (email) {
      // Use email prefix (before @) as fallback
      return email.split('@')[0];
    } else if (this.user.id) {
      // Use last 8 characters of user ID as ultimate fallback
      return `User-${this.user.id.slice(-8)}`;
    } else {
      return 'User';
    }
  }
}

// Export for use in other modules
window.AiGuardianAuth = AiGuardianAuth;
