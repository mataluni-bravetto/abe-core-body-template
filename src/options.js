/**
 * Options Script for AiGuardian Chrome Extension
 * 
 * Simplified options page - authentication and subscription management only
 */

(function(){
  let eventListeners = [];
  
  try {
    initializeOptions();
    setupEventListeners();
    loadCurrentConfiguration();
    loadSubscriptionInfo();
  } catch (err) {
    Logger.error('Options init error', err);
  }

  /**
   * Initialize options page
   */
  function initializeOptions() {
    Logger.info('Options page initialized');
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    const elements = [
      { id: 'clerk_publishable_key', event: 'change', handler: updateClerkPublishableKey },
      { id: 'refresh_subscription', event: 'click', handler: refreshSubscriptionInfo },
      { id: 'manage_subscription', event: 'click', handler: manageSubscription },
      { id: 'upgrade_subscription', event: 'click', handler: upgradeSubscription }
    ];

    elements.forEach(({ id, event, handler }) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener(event, handler);
        eventListeners.push({ element, event, handler });
      }
    });
  }

  /**
   * Cleanup all event listeners
   */
  function cleanupEventListeners() {
    eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    eventListeners = [];
  }

  /**
   * Load current configuration from storage
   */
  function loadCurrentConfiguration() {
    chrome.storage.sync.get([
      'clerk_publishable_key',
      'clerk_key_source',
      'clerk_key_cached_at'
    ], (data) => {
      // Update Clerk key status display
      updateClerkKeyStatus(data);
    });
  }

  /**
   * Update Clerk key status display based on source
   */
  function updateClerkKeyStatus(data) {
    const statusElement = document.getElementById('clerk_key_status');
    const sourceTextElement = document.getElementById('clerk_key_source_text');
    
    if (!statusElement || !sourceTextElement) return;
    
    const keySource = data.clerk_key_source || 'manual_config';
    const cachedAt = data.clerk_key_cached_at;
    
    if (keySource === 'backend_api') {
      statusElement.textContent = 'Auto';
      statusElement.className = 'status connected';
      
      if (cachedAt) {
        const cacheAge = Math.floor((Date.now() - cachedAt) / 1000 / 60); // minutes
        let ageText = '';
        if (cacheAge < 1) ageText = 'just now';
        else if (cacheAge < 60) ageText = `${cacheAge} minute${cacheAge > 1 ? 's' : ''} ago`;
        else {
          const hours = Math.floor(cacheAge / 60);
          ageText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        sourceTextElement.textContent = `Auto-configured from backend API (${ageText})`;
      } else {
        sourceTextElement.textContent = 'Auto-configured from backend API';
      }
    } else {
      statusElement.textContent = 'Manual';
      statusElement.className = 'status disconnected';
      sourceTextElement.textContent = 'Manually configured';
    }
  }

  /**
   * Update Clerk publishable key
   */
  function updateClerkPublishableKey() {
    const clerkKey = document.getElementById('clerk_publishable_key').value;
    chrome.storage.sync.set({ 
      clerk_publishable_key: clerkKey,
      clerk_key_source: 'manual_config',
      clerk_key_cached_at: Date.now()
    });
    Logger.info('Clerk publishable key updated');
    // Update status display
    chrome.storage.sync.get(['clerk_key_source', 'clerk_key_cached_at'], (data) => {
      updateClerkKeyStatus({ clerk_key_source: 'manual_config', clerk_key_cached_at: Date.now() });
    });
  }

  /**
   * Send message to background script
   */
  function sendMessageToBackground(type, payload = null) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type, payload }, (response) => {
        resolve(response || { success: false, error: 'No response' });
      });
    });
  }

  /**
   * Load subscription information
   */
  async function loadSubscriptionInfo() {
    try {
      // Get subscription status from background
      const response = await sendMessageToBackground('GET_SUBSCRIPTION_STATUS');
      
      if (response && response.success && response.subscription) {
        updateSubscriptionInfo(response.subscription, response.usage);
      } else {
        // Hide subscription section if unable to load
        const section = document.getElementById('subscriptionSection');
        if (section) section.style.display = 'none';
      }
    } catch (err) {
      Logger.error('Failed to load subscription info', err);
      const section = document.getElementById('subscriptionSection');
      if (section) section.style.display = 'none';
    }
  }

  /**
   * Update subscription information display
   */
  function updateSubscriptionInfo(subscription, usage) {
    const section = document.getElementById('subscriptionSection');
    const tierEl = document.getElementById('subscriptionTier');
    const statusEl = document.getElementById('subscriptionStatus');
    const statusBadge = document.getElementById('subscriptionStatusBadge');
    const usageEl = document.getElementById('subscriptionUsage');
    const upgradeBtn = document.getElementById('upgrade_subscription');

    if (!section) return;

    // Show subscription section
    section.style.display = 'block';

    // Update tier
    if (tierEl) {
      const tierName = subscription.tier ? subscription.tier.toUpperCase() : 'FREE';
      tierEl.textContent = tierName;
    }

    // Update status
    const status = subscription.status || 'active';
    if (statusEl) {
      statusEl.textContent = `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    }

    // Update status badge
    if (statusBadge) {
      statusBadge.textContent = status === 'active' ? '✓ Active' : status;
      statusBadge.className = `status ${status === 'active' ? 'connected' : 'disconnected'}`;
    }

    // Update usage
    if (usageEl && usage) {
      if (usage.requests_limit !== null && usage.requests_limit !== undefined) {
        const percentage = usage.usage_percentage || 0;
        const remaining = usage.remaining_requests !== null ? usage.remaining_requests : 'unlimited';
        usageEl.textContent = `${usage.requests_made || 0} / ${usage.requests_limit} requests (${percentage.toFixed(1)}% used, ${remaining} remaining)`;
        
        if (percentage >= 80) {
          usageEl.style.color = '#FFB800';
          usageEl.style.fontWeight = '600';
        }
      } else {
        usageEl.textContent = 'Unlimited usage';
      }
    } else if (usageEl) {
      usageEl.textContent = 'Usage data unavailable';
    }

    // Show upgrade button for free tier
    if (upgradeBtn) {
      if (subscription.tier === 'free') {
        upgradeBtn.style.display = 'inline-block';
      } else {
        upgradeBtn.style.display = 'none';
      }
    }
  }

  /**
   * Refresh subscription information
   */
  async function refreshSubscriptionInfo() {
    try {
      const btn = document.getElementById('refresh_subscription');
      if (btn) {
        btn.textContent = '⏳ Refreshing...';
        btn.disabled = true;
      }

      // Clear cache
      await sendMessageToBackground('CLEAR_SUBSCRIPTION_CACHE');
      
      // Reload subscription info
      await loadSubscriptionInfo();

      if (btn) {
        btn.textContent = '🔄 Refresh';
        btn.disabled = false;
      }
    } catch (err) {
      Logger.error('Failed to refresh subscription', err);
      const btn = document.getElementById('refresh_subscription');
      if (btn) {
        btn.textContent = '🔄 Refresh';
        btn.disabled = false;
      }
    }
  }

  /**
   * Manage subscription
   */
  async function manageSubscription() {
    try {
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get(['gateway_url'], resolve);
      });
      
      const gatewayUrl = data.gateway_url || 'https://api.aiguardian.ai';
      const baseUrl = gatewayUrl.replace('/api/v1', '').replace('/api', '');
      const manageUrl = `${baseUrl}/subscription` || 'https://aiguardian.ai/subscription';
      
      chrome.tabs.create({ url: manageUrl });
    } catch (err) {
      Logger.error('Failed to open subscription management', err);
    }
  }

  /**
   * Upgrade subscription
   * Note: Payment is handled through Stripe on the landing page, not in the extension
   */
  async function upgradeSubscription() {
    try {
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get(['gateway_url'], resolve);
      });
      
      const gatewayUrl = data.gateway_url || 'https://api.aiguardian.ai';
      const baseUrl = gatewayUrl.replace('/api/v1', '').replace('/api', '');
      const upgradeUrl = `${baseUrl}/subscribe` || 'https://aiguardian.ai/subscribe';
      
      chrome.tabs.create({ url: upgradeUrl });
    } catch (err) {
      Logger.error('Failed to open upgrade page', err);
    }
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanupEventListeners);

})();
