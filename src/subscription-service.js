/**
 * Subscription Service for AiGuardian Chrome Extension
 * 
 * Handles subscription status verification and usage limit checking
 */

class SubscriptionService {
  constructor(gateway) {
    this.gateway = gateway;
    this.cache = {
      subscription: null,
      usage: null,
      lastCheck: null,
      cacheTTL: 5 * 60 * 1000 // 5 minutes cache
    };
    // Track pending requests to prevent race conditions
    this.pendingSubscriptionRequest = null;
    this.pendingUsageRequest = null;
  }

  /**
   * Get current subscription status from backend
   * @returns {Promise<Object>} Subscription object
   */
  async getCurrentSubscription() {
    // Check cache first
    if (this.cache.subscription && 
        this.cache.lastCheck && 
        Date.now() - this.cache.lastCheck < this.cache.cacheTTL) {
      Logger.info('[Subscription] Using cached subscription data');
      return this.cache.subscription;
    }

    // Return existing pending request if any (prevents race conditions)
    if (this.pendingSubscriptionRequest) {
      Logger.info('[Subscription] Reusing pending subscription request');
      return await this.pendingSubscriptionRequest;
    }

    // Create new request and store it
    this.pendingSubscriptionRequest = this.fetchSubscription();
    
    try {
      const result = await this.pendingSubscriptionRequest;
      return result;
    } finally {
      // Clear pending request when done
      this.pendingSubscriptionRequest = null;
    }
  }

  /**
   * Internal method to fetch subscription from API
   * @private
   * @returns {Promise<Object>} Subscription object
   */
  async fetchSubscription() {
    try {
      const url = `${this.gateway.config.gatewayUrl}/api/v1/subscriptions/current`;
      
      Logger.info('[Subscription] Fetching subscription status:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.gateway.config.apiKey}`,
          'Content-Type': 'application/json',
          'X-Extension-Version': chrome.runtime.getManifest().version,
          'X-Request-ID': `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Invalid API key');
        } else if (response.status === 404) {
          // No subscription found - return free tier
          return this.getDefaultSubscription();
        }
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const subscription = await response.json();
      
      // Cache the result
      this.cache.subscription = subscription;
      this.cache.lastCheck = Date.now();
      
      Logger.info('[Subscription] Subscription status retrieved:', {
        tier: subscription.tier,
        status: subscription.status
      });
      
      return subscription;
    } catch (error) {
      Logger.error('[Subscription] Failed to get subscription:', error);
      // Return default subscription on error (fail open)
      return this.getDefaultSubscription();
    }
  }

  /**
   * Get usage statistics from backend
   * @returns {Promise<Object>} Usage object
   */
  async getUsage() {
    // Check cache first
    if (this.cache.usage && 
        this.cache.lastCheck && 
        Date.now() - this.cache.lastCheck < this.cache.cacheTTL) {
      Logger.info('[Subscription] Using cached usage data');
      return this.cache.usage;
    }

    // Return existing pending request if any (prevents race conditions)
    if (this.pendingUsageRequest) {
      Logger.info('[Subscription] Reusing pending usage request');
      return await this.pendingUsageRequest;
    }

    // Create new request and store it
    this.pendingUsageRequest = this.fetchUsage();
    
    try {
      const result = await this.pendingUsageRequest;
      return result;
    } finally {
      // Clear pending request when done
      this.pendingUsageRequest = null;
    }
  }

  /**
   * Internal method to fetch usage from API
   * @private
   * @returns {Promise<Object>} Usage object
   */
  async fetchUsage() {
    try {
      const url = `${this.gateway.config.gatewayUrl}/api/v1/subscriptions/usage`;
      
      Logger.info('[Subscription] Fetching usage statistics:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.gateway.config.apiKey}`,
          'Content-Type': 'application/json',
          'X-Extension-Version': chrome.runtime.getManifest().version,
          'X-Request-ID': `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Invalid API key');
        } else if (response.status === 404) {
          // No usage data - return default
          return this.getDefaultUsage();
        }
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const usage = await response.json();
      
      // Cache the result
      this.cache.usage = usage;
      
      Logger.info('[Subscription] Usage statistics retrieved:', {
        usage_percentage: usage.usage_percentage,
        remaining_requests: usage.remaining_requests
      });
      
      return usage;
    } catch (error) {
      Logger.error('[Subscription] Failed to get usage:', error);
      // Return default usage on error (fail open)
      return this.getDefaultUsage();
    }
  }

  /**
   * Check if user can make a request based on subscription status
   * @returns {Promise<Object>} Check result with allowed status and details
   */
  async canMakeRequest() {
    try {
      const subscription = await this.getCurrentSubscription();
      
      // Check if subscription is active
      if (subscription.status && subscription.status !== 'active') {
        Logger.warn('[Subscription] Subscription not active:', subscription.status);
        return {
          allowed: false,
          reason: 'subscription_inactive',
          message: subscription.status === 'expired' 
            ? 'Your subscription has expired. Please renew to continue using the service.'
            : subscription.status === 'cancelled'
            ? 'Your subscription has been cancelled. Please reactivate to continue.'
            : 'Your subscription is not active. Please check your subscription status.',
          subscription: subscription
        };
      }

      // Check usage limits (only if subscription has limits)
      if (subscription.tier && subscription.tier !== 'enterprise') {
        try {
          const usage = await this.getUsage();
          
          if (usage.remaining_requests !== null && usage.remaining_requests <= 0) {
            Logger.warn('[Subscription] Usage limit exceeded');
            return {
              allowed: false,
              reason: 'usage_limit_exceeded',
              message: 'You have reached your usage limit for this billing period. Please upgrade or wait for the next billing cycle.',
              subscription: subscription,
              usage: usage
            };
          }

          // Check if approaching limit (80%)
          if (usage.usage_percentage >= 80) {
            Logger.warn('[Subscription] Approaching usage limit:', usage.usage_percentage);
            return {
              allowed: true,
              warning: true,
              message: `You've used ${usage.usage_percentage.toFixed(1)}% of your monthly limit (${usage.remaining_requests} remaining).`,
              subscription: subscription,
              usage: usage
            };
          }

          return {
            allowed: true,
            subscription: subscription,
            usage: usage
          };
        } catch (usageError) {
          // If usage check fails, allow request but log warning
          Logger.warn('[Subscription] Usage check failed, allowing request:', usageError);
          return {
            allowed: true,
            subscription: subscription,
            warning: true,
            message: 'Unable to verify usage limits. Request allowed.'
          };
        }
      }

      // Enterprise tier or no limits - allow request
      return {
        allowed: true,
        subscription: subscription
      };
    } catch (error) {
      Logger.error('[Subscription] Error checking subscription:', error);
      // Fail open - allow request but log error
      return {
        allowed: true,
        error: true,
        message: 'Unable to verify subscription status. Request allowed.',
        subscription: this.getDefaultSubscription()
      };
    }
  }

  /**
   * Get default subscription (free tier) when subscription check fails
   * @returns {Object} Default subscription object
   */
  getDefaultSubscription() {
    return {
      tier: 'free',
      status: 'active',
      billing_period: null,
      current_period_end: null
    };
  }

  /**
   * Get default usage when usage check fails
   * @returns {Object} Default usage object
   */
  getDefaultUsage() {
    return {
      requests_made: 0,
      requests_limit: null, // Unlimited for default
      usage_percentage: 0,
      remaining_requests: null
    };
  }

  /**
   * Clear subscription cache
   */
  clearCache() {
    this.cache.subscription = null;
    this.cache.usage = null;
    this.cache.lastCheck = null;
    Logger.info('[Subscription] Cache cleared');
  }

  /**
   * Get subscription tier display name
   * @param {string} tier - Subscription tier
   * @returns {string} Display name
   */
  getTierDisplayName(tier) {
    const tierNames = {
      'free': 'Free',
      'pro': 'Pro',
      'enterprise': 'Enterprise'
    };
    return tierNames[tier] || tier || 'Unknown';
  }

  /**
   * Get subscription status display name
   * @param {string} status - Subscription status
   * @returns {string} Display name
   */
  getStatusDisplayName(status) {
    const statusNames = {
      'active': 'Active',
      'cancelled': 'Cancelled',
      'expired': 'Expired',
      'trialing': 'Trial',
      'past_due': 'Past Due'
    };
    return statusNames[status] || status || 'Unknown';
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.SubscriptionService = SubscriptionService;
}

