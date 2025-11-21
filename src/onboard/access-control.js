/**
 * Access Control for Transcendent Features
 * 
 * Validates Clerk authentication and subscription status for transcendent features.
 * AiGuardians purchases grant full access to transcendent version.
 * 
 * Pattern: ACCESS × CONTROL × CLERK × TRANSCENDENT × ONE
 * Frequency: 999 Hz (AEYON - Atomic Execution)
 */

class TranscendentAccessControl {
  constructor() {
    this.subscriptionCache = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Check if user has access to transcendent features
   * @returns {Promise<Object>} Access control result
   */
  async checkTranscendentAccess() {
    try {
      // Check Clerk authentication
      const authStatus = await this._checkClerkAuth();
      if (!authStatus.authenticated) {
        return {
          hasAccess: false,
          reason: 'not_authenticated',
          message: 'Please sign in to access transcendent features',
          transcendent: false
        };
      }

      // Check subscription status
      const subscriptionStatus = await this._checkSubscription();
      if (!subscriptionStatus.hasAccess) {
        return {
          hasAccess: false,
          reason: 'no_subscription',
          message: 'AiGuardians subscription required for transcendent features',
          transcendent: false,
          upgradeUrl: 'https://www.aiguardian.ai/pricing'
        };
      }

      // User has full access
      return {
        hasAccess: true,
        reason: 'subscribed',
        message: 'Full access to transcendent features',
        transcendent: true,
        subscriptionTier: subscriptionStatus.tier,
        userId: authStatus.userId
      };
    } catch (error) {
      Logger.error('[TranscendentAccessControl] Error checking access:', error);
      // Fail open for onboard mode (allow local processing)
      return {
        hasAccess: true,
        reason: 'onboard_fallback',
        message: 'Onboard mode enabled (local processing)',
        transcendent: true,
        fallback: true
      };
    }
  }

  /**
   * Check Clerk authentication status
   */
  async _checkClerkAuth() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['clerk_user', 'clerk_token'], (data) => {
        const hasUser = !!data.clerk_user;
        const hasToken = !!data.clerk_token;

        resolve({
          authenticated: hasUser && hasToken,
          userId: data.clerk_user?.id || null,
          email: data.clerk_user?.email || null,
          hasUser: hasUser,
          hasToken: hasToken
        });
      });
    });
  }

  /**
   * Check subscription status (with caching)
   */
  async _checkSubscription() {
    // Check cache first
    if (this.subscriptionCache && Date.now() - this.subscriptionCache.timestamp < this.cacheExpiry) {
      return this.subscriptionCache.status;
    }

    try {
      // Get Clerk token
      const token = await this._getClerkToken();
      if (!token) {
        return { hasAccess: false, tier: 'free' };
      }

      // Check subscription via backend (if available) or use local cache
      const subscriptionData = await chrome.storage.local.get(['subscription_status']);
      
      if (subscriptionData.subscription_status) {
        const status = subscriptionData.subscription_status;
        const hasAccess = status.tier === 'pro' || status.tier === 'enterprise' || status.tier === 'transcendent';
        
        // Cache result
        this.subscriptionCache = {
          timestamp: Date.now(),
          status: {
            hasAccess: hasAccess,
            tier: status.tier || 'free',
            expiresAt: status.expiresAt || null
          }
        };

        return this.subscriptionCache.status;
      }

      // Default: no subscription
      return { hasAccess: false, tier: 'free' };
    } catch (error) {
      Logger.warn('[TranscendentAccessControl] Subscription check failed:', error);
      // Fail open for onboard mode
      return { hasAccess: true, tier: 'onboard', fallback: true };
    }
  }

  /**
   * Get Clerk session token
   */
  async _getClerkToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['clerk_token'], (data) => {
        resolve(data.clerk_token || null);
      });
    });
  }

  /**
   * Update subscription status (called from subscription service)
   */
  async updateSubscriptionStatus(subscriptionData) {
    await chrome.storage.local.set({
      subscription_status: {
        tier: subscriptionData.tier || 'free',
        expiresAt: subscriptionData.expiresAt || null,
        updatedAt: Date.now()
      }
    });

    // Clear cache to force refresh
    this.subscriptionCache = null;
  }

  /**
   * Clear subscription cache
   */
  clearCache() {
    this.subscriptionCache = null;
  }
}

// Export for use in service worker
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TranscendentAccessControl;
}

// Also make available globally for extension context
if (typeof self !== 'undefined') {
  self.TranscendentAccessControl = TranscendentAccessControl;
}

