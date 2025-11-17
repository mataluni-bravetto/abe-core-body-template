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

    // Apply dev UI flag: in production, hide Clerk + backend config panels
    try {
      const isDevUI = typeof SHOW_DEV_UI !== 'undefined' && (SHOW_DEV_UI || window.__AIG_SHOW_DEV_UI === true);
      if (!isDevUI) {
        const authSections = document.querySelectorAll('.section[data-dev-ui="auth"], .section[data-dev-ui="backend"]');
        authSections.forEach((el) => {
          el.style.display = 'none';
        });
      }
    } catch (e) {
      Logger.warn('[Options] Failed to apply dev UI flag', e);
    }
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
      { id: 'test_connection', event: 'click', handler: testBackendConnection },
      { id: 'test_oauth_config', event: 'click', handler: testOAuthConfiguration }
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
      // Clean up any whitespace in stored key
      if (data.clerk_publishable_key && typeof data.clerk_publishable_key === 'string') {
        const trimmedKey = data.clerk_publishable_key.trim();
        if (trimmedKey !== data.clerk_publishable_key) {
          // Key has whitespace, save trimmed version
          chrome.storage.sync.set({ clerk_publishable_key: trimmedKey });
          data.clerk_publishable_key = trimmedKey;
        }
      }
      
      // Update Clerk key status display
      updateClerkKeyStatus(data);
      
      // Load gateway URL for connection test
      const gatewayInput = document.getElementById('connection_gateway_url');
      if (gatewayInput && data.gateway_url) {
        gatewayInput.value = data.gateway_url;
      } else if (gatewayInput) {
        gatewayInput.value = 'https://api.aiguardian.ai';
      }
      
      // Load Clerk key into input field (trimmed)
      const clerkKeyInput = document.getElementById('clerk_publishable_key');
      if (clerkKeyInput && data.clerk_publishable_key) {
        clerkKeyInput.value = data.clerk_publishable_key.trim();
      }
    });
  }

  /**
   * Update Clerk key status display based on source
   */
  function updateClerkKeyStatus(data) {
    const statusElement = document.getElementById('clerk_key_status');
    const sourceTextElement = document.getElementById('clerk_key_source_text');
    const sourceTextElementAdvanced = document.getElementById('clerk_key_source_text_advanced');
    
    if (!statusElement || !sourceTextElement) return;
    
    const keySource = data.clerk_key_source || 'manual_config';
    const cachedAt = data.clerk_key_cached_at;
    
    let statusText, statusClass, sourceText;
    
    if (keySource === 'backend_api') {
      statusText = 'Auto';
      statusClass = 'status connected';
      
      if (cachedAt) {
        const cacheAge = Math.floor((Date.now() - cachedAt) / 1000 / 60); // minutes
        let ageText = '';
        if (cacheAge < 1) ageText = 'just now';
        else if (cacheAge < 60) ageText = `${cacheAge} minute${cacheAge > 1 ? 's' : ''} ago`;
        else {
          const hours = Math.floor(cacheAge / 60);
          ageText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
        sourceText = `Auto-configured from backend API (${ageText})`;
      } else {
        sourceText = 'Auto-configured from backend API';
      }
    } else {
      statusText = 'Manual';
      statusClass = 'status disconnected';
      sourceText = 'Manually configured';
    }
    
    // Update main status display
    statusElement.textContent = statusText;
    statusElement.className = statusClass;
    sourceTextElement.textContent = sourceText;
    
    // Update advanced section if it exists
    if (sourceTextElementAdvanced) {
      sourceTextElementAdvanced.textContent = sourceText;
    }
  }

  /**
   * Update Clerk publishable key
   */
  function updateClerkPublishableKey() {
    const clerkKey = document.getElementById('clerk_publishable_key').value.trim();
    if (!clerkKey) {
      Logger.warn('Empty Clerk key provided');
      return;
    }
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
      const manageUrl = `${baseUrl}/subscription` || 'https://www.aiguardian.ai/subscription';
      
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
      const upgradeUrl = `${baseUrl}/subscribe` || 'https://www.aiguardian.ai/subscribe';
      
      chrome.tabs.create({ url: upgradeUrl });
    } catch (err) {
      Logger.error('Failed to open upgrade page', err);
    }
  }

  /**
   * Test OAuth configuration
   */
  async function testOAuthConfiguration() {
    const resultElement = document.getElementById('oauth_config_result');
    const testButton = document.getElementById('test_oauth_config');
    
    if (!resultElement || !testButton) return;
    
    // Update UI to show testing state
    testButton.disabled = true;
    testButton.textContent = '🔄 Verifying...';
    resultElement.style.display = 'block';
    resultElement.innerHTML = '<div style="color: rgba(249, 249, 249, 0.7);">Verifying OAuth configuration...</div>';
    
    try {
      // Get Clerk publishable key
      const syncData = await new Promise((resolve) => {
        chrome.storage.sync.get(['clerk_publishable_key'], resolve);
      });
      
      let publishableKey = syncData.clerk_publishable_key;
      
      // If no key in storage, try fetching from backend
      if (!publishableKey) {
        try {
          const auth = new AiGuardianAuth();
          const settings = await auth.getSettings();
          publishableKey = settings.clerk_publishable_key;
        } catch (e) {
          Logger.warn('[OAuth Test] Failed to fetch key from backend:', e);
        }
      }
      
      if (!publishableKey) {
        resultElement.innerHTML = `
          <div style="color: #FF5757; margin-bottom: 8px;">
            <strong>❌ Clerk Publishable Key Not Configured</strong>
          </div>
          <div style="color: rgba(249, 249, 249, 0.7); font-size: 11px; margin-bottom: 8px;">
            Clerk publishable key is required for OAuth to work. Configure it in the Authentication section above.
          </div>
        `;
        return;
      }
      
      // Extract instance ID from publishable key to determine Clerk instance URL
      let instanceDomain = null;
      let redirectUri = null;
      
      try {
        const keyParts = publishableKey.split('_');
        if (keyParts.length >= 3) {
          const keyType = keyParts[1]; // 'test' or 'live'
          const encodedInstance = keyParts.slice(2).join('_');
          
          // Decode base64 to get instance identifier
          let decodedInstance;
          if (typeof atob !== 'undefined') {
            decodedInstance = atob(encodedInstance);
          } else if (typeof Buffer !== 'undefined') {
            decodedInstance = Buffer.from(encodedInstance, 'base64').toString('utf-8');
          }
          
          if (decodedInstance) {
            const instanceMatch = decodedInstance.match(/^([^.]+)/);
            if (instanceMatch) {
              const instanceId = instanceMatch[1];
              instanceDomain = keyType === 'test' 
                ? `${instanceId}.accounts.dev`
                : `${instanceId}.clerk.accounts.dev`;
              
              // Determine redirect URI based on instance
              if (keyType === 'test') {
                redirectUri = `https://${instanceDomain}/v1/oauth_callback`;
              } else {
                // Production uses clerk.aiguardian.ai
                redirectUri = 'https://clerk.aiguardian.ai/v1/oauth_callback';
              }
            }
          }
        }
      } catch (e) {
        Logger.warn('[OAuth Test] Failed to extract instance info:', e);
      }
      
      // Build diagnostic results
      const results = [];
      
      // Check 1: Clerk key configured
      results.push({
        name: 'Clerk Publishable Key',
        status: 'ok',
        message: 'Clerk publishable key is configured'
      });
      
      // Check 2: Instance domain detected
      if (instanceDomain) {
        results.push({
          name: 'Clerk Instance',
          status: 'ok',
          message: `Detected instance: ${instanceDomain}`
        });
      } else {
        results.push({
          name: 'Clerk Instance',
          status: 'warning',
          message: 'Could not determine Clerk instance from publishable key'
        });
      }
      
      // Check 3: Redirect URI
      if (redirectUri) {
        results.push({
          name: 'Required Redirect URI',
          status: 'info',
          message: redirectUri,
          isUri: true
        });
      } else {
        results.push({
          name: 'Required Redirect URI',
          status: 'warning',
          message: 'Could not determine redirect URI (check documentation)'
        });
      }
      
      // Build result HTML
      let resultHTML = '<div style="line-height: 1.6;">';
      
      results.forEach((result, index) => {
        const statusIcon = result.status === 'ok' ? '✅' : 
                          result.status === 'warning' ? '⚠️' : 
                          result.status === 'info' ? 'ℹ️' : '❌';
        const statusColor = result.status === 'ok' ? '#33B8FF' : 
                           result.status === 'warning' ? '#FFB800' : 
                           result.status === 'info' ? '#33B8FF' : '#FF5757';
        
        resultHTML += `
          <div style="margin-bottom: ${index < results.length - 1 ? '12px' : '0'}; padding-bottom: ${index < results.length - 1 ? '12px' : '0'}; border-bottom: ${index < results.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};">
            <div style="display: flex; align-items: flex-start; gap: 8px;">
              <span style="font-size: 14px;">${statusIcon}</span>
              <div style="flex: 1;">
                <div style="font-weight: 600; color: ${statusColor}; margin-bottom: 4px;">${result.name}</div>
                ${result.isUri ? 
                  `<div style="font-family: monospace; font-size: 11px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; margin-top: 4px; word-break: break-all;">${result.message}</div>` :
                  `<div style="font-size: 12px; color: rgba(249, 249, 249, 0.8);">${result.message}</div>`
                }
              </div>
            </div>
          </div>
        `;
      });
      
      // Add instructions
      resultHTML += `
        <div style="margin-top: 16px; padding: 12px; background: rgba(51, 184, 255, 0.1); border-radius: 8px; border: 1px solid rgba(51, 184, 255, 0.3);">
          <div style="font-weight: 600; color: #33B8FF; margin-bottom: 8px; font-size: 12px;">📋 Next Steps</div>
          <div style="font-size: 11px; color: rgba(249, 249, 249, 0.8); line-height: 1.6;">
            ${redirectUri ? `
              1. Go to <a href="https://console.cloud.google.com/" target="_blank" style="color: #33B8FF;">Google Cloud Console</a><br>
              2. Navigate to APIs & Services → Credentials<br>
              3. Find your OAuth 2.0 Client ID (matches Clerk Dashboard)<br>
              4. Add authorized redirect URI: <code style="background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 2px;">${redirectUri}</code><br>
              5. Save and wait 1-2 minutes for changes to propagate<br>
              <br>
              See <a href="https://github.com/aiguardian/chrome-extension/blob/main/docs/guides/OAUTH_CONFIGURATION.md" target="_blank" style="color: #33B8FF;">full documentation</a> for detailed steps.
            ` : `
              See <a href="https://github.com/aiguardian/chrome-extension/blob/main/docs/guides/OAUTH_CONFIGURATION.md" target="_blank" style="color: #33B8FF;">OAuth Configuration Guide</a> for setup instructions.
            `}
          </div>
        </div>
      `;
      
      resultHTML += '</div>';
      resultElement.innerHTML = resultHTML;
      
      Logger.info('[OAuth Test] Configuration verification completed');
    } catch (error) {
      resultElement.innerHTML = `
        <div style="color: #FF5757;">
          <strong>❌ Verification Failed</strong>
        </div>
        <div style="color: rgba(249, 249, 249, 0.7); font-size: 11px; margin-top: 8px;">
          Error: ${error.message || 'Unknown error'}
        </div>
      `;
      Logger.error('[OAuth Test] Verification failed:', error);
    } finally {
      testButton.disabled = false;
      testButton.textContent = '🔍 Verify OAuth Configuration';
    }
  }

  /**
   * Safely parse HTML string and create DOM elements
   * Parses simple HTML (br, code, a tags) and creates proper DOM elements
   * @param {string} htmlString - HTML string to parse
   * @param {HTMLElement} container - Container element to append parsed content to
   */
  function parseHtmlToElements(htmlString, container) {
    if (!htmlString || typeof htmlString !== 'string') {
      return;
    }

    // Split by HTML tags while preserving them
    const parts = htmlString.split(/(<[^>]+>)/);
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // Skip empty strings
      if (!part) continue;
      
      // Handle HTML tags
      if (part.startsWith('<')) {
        // Handle <br> tags
        if (part.match(/^<br\s*\/?>$/i)) {
          container.appendChild(document.createElement('br'));
        }
        // Handle <code> tags
        else if (part.match(/^<code>/i)) {
          const codeEl = document.createElement('code');
          codeEl.style.fontFamily = 'monospace';
          codeEl.style.background = 'rgba(0,0,0,0.3)';
          codeEl.style.padding = '2px 4px';
          codeEl.style.borderRadius = '2px';
          
          // Get content until closing tag
          let codeContent = '';
          i++;
          while (i < parts.length && !parts[i].match(/^<\/code>$/i)) {
            codeContent += parts[i];
            i++;
          }
          codeEl.textContent = codeContent;
          container.appendChild(codeEl);
        }
        // Handle <a> tags
        else if (part.match(/^<a\s+/i)) {
          const linkMatch = part.match(/href=["']([^"']+)["']/i);
          const targetMatch = part.match(/target=["']([^"']+)["']/i);
          
          if (linkMatch) {
            const linkEl = document.createElement('a');
            linkEl.href = linkMatch[1];
            linkEl.target = targetMatch ? targetMatch[1] : '_blank';
            linkEl.style.color = '#33B8FF';
            linkEl.style.textDecoration = 'underline';
            linkEl.style.cursor = 'pointer';
            
            // Get link text until closing tag
            let linkText = '';
            i++;
            while (i < parts.length && !parts[i].match(/^<\/a>$/i)) {
              linkText += parts[i];
              i++;
            }
            linkEl.textContent = linkText || linkMatch[1];
            container.appendChild(linkEl);
          }
        }
        // Handle closing tags (skip them, already handled)
        else if (part.match(/^<\//)) {
          continue;
        }
      }
      // Handle text content
      else {
        // Handle newlines in plain text (for cases without <br>)
        const textParts = part.split(/\n/);
        for (let j = 0; j < textParts.length; j++) {
          if (textParts[j]) {
            container.appendChild(document.createTextNode(textParts[j]));
          }
          if (j < textParts.length - 1) {
            container.appendChild(document.createElement('br'));
          }
        }
      }
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
      let timeoutId = null;
      if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
        timeoutSignal = AbortSignal.timeout(10000);
      } else {
        // Fallback for older browsers using AbortController
        const controller = new AbortController();
        timeoutId = setTimeout(() => {
          controller.abort();
        }, 10000);
        
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
      
      const startTime = Date.now();
      let response;
      try {
        response = await fetch(healthUrl, {
          method: 'GET',
          headers: {
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
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const responseData = await response.json().catch(() => ({}));
        
        // Update status to connected
        statusElement.textContent = 'Connected';
        statusElement.className = 'status connected';
        resultElement.style.color = '#33B8FF';

        // Build a safe, structured success message without using innerHTML
        while (resultElement.firstChild) {
          resultElement.removeChild(resultElement.firstChild);
        }

        const title = document.createElement('div');
        title.innerText = '✅ Connection Successful!';
        title.style.fontWeight = '600';

        const timeInfo = document.createElement('div');
        timeInfo.innerText = `Response Time: ${responseTime}ms`;

        const statusInfo = document.createElement('div');
        statusInfo.innerText = `Status: ${response.status} ${response.statusText}`;

        resultElement.appendChild(title);
        resultElement.appendChild(timeInfo);
        resultElement.appendChild(statusInfo);

        if (responseData.status) {
          const backendStatus = document.createElement('div');
          backendStatus.innerText = `Backend Status: ${responseData.status}`;
          resultElement.appendChild(backendStatus);
        }
        
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
        troubleshootingTips = '• Check browser console (F12) for details\n• Verify backend logs\n• Test endpoint directly: ' + healthUrl;
      }
      
      // Build a safe, structured error message without using innerHTML
      while (resultElement.firstChild) {
        resultElement.removeChild(resultElement.firstChild);
      }

      const title = document.createElement('div');
      title.innerText = '❌ Connection Failed';
      title.style.fontWeight = '600';

      const messageEl = document.createElement('div');
      messageEl.innerText = errorMessage;

      const tipsLabel = document.createElement('div');
      tipsLabel.style.marginTop = '8px';
      tipsLabel.style.fontWeight = '600';
      tipsLabel.innerText = 'Troubleshooting:';

      const tipsBox = document.createElement('div');
      tipsBox.style.fontSize = '11px';
      tipsBox.style.marginTop = '8px';
      tipsBox.style.padding = '8px';
      tipsBox.style.background = 'rgba(0,0,0,0.2)';
      tipsBox.style.borderRadius = '4px';
      // Parse HTML and create proper DOM elements (preserves links, code formatting, and line breaks)
      parseHtmlToElements(troubleshootingTips, tipsBox);

      resultElement.appendChild(title);
      resultElement.appendChild(messageEl);
      resultElement.appendChild(tipsLabel);
      resultElement.appendChild(tipsBox);

      Logger.error('Backend connection test failed', { gatewayUrl, healthUrl, error: error.message, errorName: error.name });
    } finally {
      testButton.disabled = false;
      testButton.textContent = '🔍 Test Connection';
    }
  }

  /**
   * Check auth state for debugging
   */
  async function checkAuthState() {
    const output = document.getElementById('auth_debug_output');
    if (!output) return;
    
    output.style.display = 'block';
    output.textContent = 'Checking auth state...\n';
    
    try {
      // Check storage
      const syncData = await new Promise(resolve => {
        chrome.storage.sync.get(['clerk_publishable_key', 'gateway_url', 'clerk_key_source'], resolve);
      });
      
      const localData = await new Promise(resolve => {
        chrome.storage.local.get(['clerk_user', 'clerk_token'], resolve);
      });
      
      let debug = '=== AUTH STATE DEBUG ===\n\n';
      debug += 'SYNC STORAGE:\n';
      debug += `  Clerk Key: ${syncData.clerk_publishable_key ? syncData.clerk_publishable_key.substring(0, 20) + '...' : 'NOT SET'}\n`;
      debug += `  Gateway URL: ${syncData.gateway_url || 'NOT SET'}\n`;
      debug += `  Key Source: ${syncData.clerk_key_source || 'unknown'}\n\n`;
      
      debug += 'LOCAL STORAGE:\n';
      debug += `  Clerk User: ${localData.clerk_user ? JSON.stringify(localData.clerk_user, null, 2) : 'NOT SET'}\n`;
      debug += `  Clerk Token: ${localData.clerk_token ? localData.clerk_token.substring(0, 20) + '...' : 'NOT SET'}\n\n`;
      
      // Test getSettings() directly
      debug += '=== TESTING getSettings() ===\n';
      try {
        const auth = new AiGuardianAuth();
        const settings = await auth.getSettings();
        debug += `getSettings() returned:\n`;
        debug += `  Key: ${settings.clerk_publishable_key ? settings.clerk_publishable_key.substring(0, 20) + '...' : 'null'}\n`;
        debug += `  Source: ${settings.source || 'unknown'}\n\n`;
      } catch (e) {
        debug += `getSettings() ERROR: ${e.message}\n`;
      }

      // Try to initialize auth
      debug += '=== INITIALIZING AUTH ===\n';
      try {
        const auth = new AiGuardianAuth();
        
        // Capture console errors during initialization
        const consoleErrors = [];
        const originalError = console.error;
        console.error = (...args) => {
          consoleErrors.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
          originalError.apply(console, args);
        };
        
        const initialized = await auth.initialize();
        
        // Restore console.error
        console.error = originalError;
        
        debug += `Initialized: ${initialized}\n`;
        debug += `isInitialized: ${auth.isInitialized}\n`;
        debug += `hasClerk: ${!!auth.clerk}\n`;
        debug += `publishableKey: ${auth.publishableKey ? auth.publishableKey.substring(0, 20) + '...' : 'null'}\n`;
        debug += `user: ${auth.user ? JSON.stringify({id: auth.user.id, email: auth.user.emailAddresses?.[0]?.emailAddress}, null, 2) : 'null'}\n`;
        
        if (!initialized) {
          debug += `\n⚠️ Auth failed to initialize - checking why...\n`;
          debug += `  publishableKey from getSettings: ${auth.publishableKey ? 'present' : 'missing'}\n`;
          debug += `  Clerk SDK loaded: ${typeof window.Clerk !== 'undefined' ? 'yes' : 'no'}\n`;
          debug += `  Clerk instance type: ${typeof window.Clerk}\n`;
          debug += `  Clerk has load method: ${typeof window.Clerk?.load === 'function' ? 'yes' : 'no'}\n`;
          
          if (consoleErrors.length > 0) {
            debug += `\n❌ Console Errors During Initialization:\n`;
            consoleErrors.forEach((err, idx) => {
              debug += `  [${idx + 1}] ${err}\n`;
            });
          } else {
            debug += `\n⚠️ No console errors captured - check browser console (F12) for details\n`;
          }
        }
        
        // Test sign-up URL generation
        if (initialized && auth.publishableKey) {
          const redirectUrl = chrome.runtime.getURL('/src/clerk-callback.html');
          // Use the auth helper method to build the correct instance-specific URL
          const signUpUrl = auth.buildClerkInstanceUrl(auth.publishableKey, 'sign-up', redirectUrl);
          if (signUpUrl) {
            debug += `\nSign-Up URL:\n${signUpUrl}\n`;
          } else {
            // Fallback if extraction fails
            const keyParts = auth.publishableKey.split('_');
            const keyType = keyParts.length >= 2 ? keyParts[1] : 'test';
            const baseDomain = keyType === 'test' ? 'accounts.dev' : 'clerk.accounts.dev';
            const fallbackUrl = `https://${baseDomain}/sign-up?__clerk_publishable_key=${encodeURIComponent(auth.publishableKey)}&redirect_url=${encodeURIComponent(redirectUrl)}`;
            debug += `\nSign-Up URL (fallback):\n${fallbackUrl}\n`;
          }
        } else if (!auth.publishableKey) {
          debug += `\n❌ Cannot generate sign-up URL - publishableKey is missing\n`;
        } else if (!initialized) {
          debug += `\n⚠️ Cannot generate sign-up URL - initialization failed (but sign-up should still work with on-demand init)\n`;
        }
      } catch (e) {
        debug += `ERROR: ${e.message}\n`;
        debug += `Stack: ${e.stack}\n`;
      }
      
      output.textContent = debug;
    } catch (error) {
      output.textContent = `ERROR: ${error.message}\n${error.stack}`;
    }
  }

  /**
   * Test sign-up flow
   */
  async function testSignUpFlow() {
    const output = document.getElementById('auth_debug_output');
    if (!output) return;
    
    output.style.display = 'block';
    output.textContent = 'Testing sign-up flow...\n';
    
    try {
      const auth = new AiGuardianAuth();
      const initialized = await auth.initialize();
      
      if (!initialized) {
        output.textContent = 'ERROR: Auth failed to initialize';
        return;
      }
      
      output.textContent += `Auth initialized: ${initialized}\n`;
      output.textContent += `Calling auth.signUp()...\n`;
      
      await auth.signUp();
      output.textContent += 'SUCCESS: auth.signUp() completed\n';
      output.textContent += 'Check if new tab opened with Clerk sign-up page\n';
    } catch (error) {
      output.textContent += `ERROR: ${error.message}\n`;
      output.textContent += `Stack: ${error.stack}\n`;
      console.error('Sign-up test error:', error);
    }
  }

  /**
   * Clear debug output
   */
  function clearDebugOutput() {
    const output = document.getElementById('auth_debug_output');
    if (output) {
      output.textContent = '';
      output.style.display = 'none';
    }
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanupEventListeners);

})();
