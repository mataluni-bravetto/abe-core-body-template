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
      { id: 'upgrade_subscription', event: 'click', handler: upgradeSubscription },
      { id: 'test_connection', event: 'click', handler: testBackendConnection }
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
      'clerk_key_cached_at',
      'gateway_url'
    ], (data) => {
      // Update Clerk key status display
      updateClerkKeyStatus(data);
      
      // Load gateway URL for connection test
      const gatewayInput = document.getElementById('connection_gateway_url');
      if (gatewayInput && data.gateway_url) {
        gatewayInput.value = data.gateway_url;
      } else if (gatewayInput) {
        gatewayInput.value = 'https://api.aiguardian.ai';
      }
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

  /**
   * Test backend connection
   */
  async function testBackendConnection() {
    const statusElement = document.getElementById('connection_status');
    const resultElement = document.getElementById('connection_result');
    const testButton = document.getElementById('test_connection');
    const gatewayInput = document.getElementById('connection_gateway_url');
    
    if (!statusElement || !resultElement || !testButton || !gatewayInput) return;
    
    const gatewayUrl = gatewayInput.value.trim() || 'https://api.aiguardian.ai';
    
    // Update UI to show testing state
    testButton.disabled = true;
    testButton.textContent = '🔄 Testing...';
    statusElement.textContent = 'Testing...';
    statusElement.className = 'status disconnected';
    resultElement.style.display = 'block';
    resultElement.textContent = 'Testing connection...';
    resultElement.style.color = 'rgba(249, 249, 249, 0.7)';
    
    // Test health endpoint
    const healthUrl = gatewayUrl.replace(/\/$/, '') + '/health/live';
    Logger.info('Testing backend connection:', healthUrl);
    
    try {
      
      // Create timeout signal with fallback for older browsers
      let timeoutSignal;
      if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
        timeoutSignal = AbortSignal.timeout(10000);
      } else {
        // Fallback for older browsers
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 10000);
        timeoutSignal = controller.signal;
      }
      
      const startTime = Date.now();
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'X-Extension-Version': chrome.runtime.getManifest().version
        },
        signal: timeoutSignal
      });
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const responseData = await response.json().catch(() => ({}));
        
        // Update status to connected
        statusElement.textContent = 'Connected';
        statusElement.className = 'status connected';
        resultElement.style.color = '#33B8FF';
        resultElement.innerHTML = `
          ✅ <strong>Connection Successful!</strong><br>
          Response Time: ${responseTime}ms<br>
          Status: ${response.status} ${response.statusText}<br>
          ${responseData.status ? `Backend Status: ${responseData.status}` : ''}
        `;
        
        // Save the gateway URL if test succeeds
        chrome.storage.sync.set({ gateway_url: gatewayUrl }, () => {
          Logger.info('Gateway URL saved:', gatewayUrl);
        });
        
        Logger.info('Backend connection test successful', { gatewayUrl, responseTime });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // Update status to disconnected
      statusElement.textContent = 'Disconnected';
      statusElement.className = 'status disconnected';
      resultElement.style.color = '#FF5757';
      
      let errorMessage = 'Connection failed';
      let troubleshootingTips = '';
      
      if (error.name === 'TimeoutError' || error.name === 'AbortError' || error.message.includes('timeout') || error.message.includes('aborted')) {
        errorMessage = 'Connection timeout - backend may be unreachable or slow';
        troubleshootingTips = '• Check if backend is running<br>• Verify network connectivity<br>• Check firewall settings';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network error - backend may not be reachable';
        troubleshootingTips = '• Verify backend is running: <code>curl ' + healthUrl + '</code><br>• Check Gateway URL is correct<br>• Test URL in browser: <a href="' + healthUrl + '" target="_blank">' + healthUrl + '</a><br>• Check network/firewall settings';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error - backend may not allow extension origin';
        troubleshootingTips = '• Update backend ALLOWED_ORIGINS to include chrome-extension://*<br>• Check backend CORS configuration';
      } else {
        errorMessage = error.message || 'Unknown error';
        troubleshootingTips = '• Check browser console (F12) for details<br>• Verify backend logs<br>• Test endpoint directly: <a href="' + healthUrl + '" target="_blank">' + healthUrl + '</a>';
      }
      
      resultElement.innerHTML = `
        ❌ <strong>Connection Failed</strong><br>
        ${errorMessage}<br><br>
        <strong>Troubleshooting:</strong><br>
        <div style="font-size: 11px; margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px;">
          ${troubleshootingTips}
        </div>
      `;
      Logger.error('Backend connection test failed', { gatewayUrl, healthUrl, error: error.message, errorName: error.name });
    } finally {
      testButton.disabled = false;
      testButton.textContent = '🔍 Test Connection';
    }
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanupEventListeners);

})();
