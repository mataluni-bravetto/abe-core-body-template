/**
 * Popup Script for AiGuardian Chrome Extension
 * 
 * Enhanced popup with real-time status, unified service, and analysis results
 */

(function(){
  let eventListeners = [];
  let currentStatus = 'loading';
  
  try {
    initializePopup();
    setupEventListeners();
    loadSystemStatus();
    loadGuardServices();
    loadSubscriptionStatus();
  } catch (err) {
    Logger.error('Popup init error', err);
  }

  /**
   * Initialize popup with enhanced features
   */
  function initializePopup() {
    Logger.info('Initializing AiGuardian popup');
    
    // Load current settings
    chrome.storage.sync.get(['gateway_url', 'api_key'], (data) => {
      Logger.info('Current settings loaded:', {
        gateway_configured: !!data.gateway_url,
        api_key_configured: !!data.api_key
      });
    });
  }

  /**
   * Set up event listeners with proper cleanup tracking
   */
  function setupEventListeners() {
    // Options button
    const optionsBtn = document.getElementById('optionsBtn');
    if (optionsBtn) {
      const clickHandler = async () => {
        try {
          await chrome.runtime.openOptionsPage();
          Logger.info('Opened options page');
          window.close();
        } catch (err) {
          Logger.error('Failed to open options', err);
        }
      };
      
      optionsBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: optionsBtn, event: 'click', handler: clickHandler });
    }

    // Analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
      const clickHandler = async () => {
        try {
          await triggerAnalysis();
        } catch (err) {
          Logger.error('Failed to trigger analysis', err);
        }
      };
      
      analyzeBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: analyzeBtn, event: 'click', handler: clickHandler });
    }

    // Test connection button
    const testBtn = document.getElementById('testConnectionBtn');
    if (testBtn) {
      const clickHandler = async () => {
        try {
          await testConnection();
        } catch (err) {
          Logger.error('Failed to test connection', err);
        }
      };
      
      testBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: testBtn, event: 'click', handler: clickHandler });
    }

    // Settings link in footer
    const settingsLink = document.getElementById('settingsLink');
    if (settingsLink) {
      const clickHandler = async () => {
        try {
          await chrome.runtime.openOptionsPage();
          Logger.info('Opened options page from footer');
          window.close();
        } catch (err) {
          Logger.error('Failed to open options from footer', err);
        }
      };

      settingsLink.addEventListener('click', clickHandler);
      eventListeners.push({ element: settingsLink, event: 'click', handler: clickHandler });
    }

    // Clear highlights button
    const clearHighlightsBtn = document.getElementById('clearHighlightsBtn');
    if (clearHighlightsBtn) {
      const clickHandler = async () => {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          await chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_HIGHLIGHTS' });
          showSuccess('✅ Highlights cleared');
        } catch (err) {
          Logger.error('Failed to clear highlights', err);
          showError('❌ Failed to clear highlights');
        }
      };

      clearHighlightsBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: clearHighlightsBtn, event: 'click', handler: clickHandler });
    }

    // Show history button
    const showHistoryBtn = document.getElementById('showHistoryBtn');
    if (showHistoryBtn) {
      const clickHandler = async () => {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          await chrome.tabs.sendMessage(tab.id, { type: 'SHOW_HISTORY' });
          window.close();
        } catch (err) {
          Logger.error('Failed to show history', err);
          showError('❌ Failed to show history');
        }
      };

      showHistoryBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: showHistoryBtn, event: 'click', handler: clickHandler });
    }

    // Copy analysis button
    const copyAnalysisBtn = document.getElementById('copyAnalysisBtn');
    if (copyAnalysisBtn) {
      const clickHandler = async () => {
        try {
          const data = await chrome.storage.local.get(['last_analysis']);
          if (data.last_analysis) {
            const analysisText = JSON.stringify(data.last_analysis, null, 2);
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.tabs.sendMessage(tab.id, {
              type: 'COPY_TO_CLIPBOARD',
              payload: analysisText
            });
            showSuccess('✅ Analysis copied to clipboard');
          } else {
            showError('⚠️ No analysis to copy. Analyze some text first!');
          }
        } catch (err) {
          Logger.error('Failed to copy analysis', err);
          showError('❌ Failed to copy analysis');
        }
      };

      copyAnalysisBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: copyAnalysisBtn, event: 'click', handler: clickHandler });
    }

    // Test context menu button
    const testContextMenuBtn = document.getElementById('testContextMenuBtn');
    if (testContextMenuBtn) {
      const clickHandler = async () => {
        try {
          // Send message to background to recreate context menus
          const response = await sendMessageToBackground('RECREATE_CONTEXT_MENUS');
          if (response.success) {
            showSuccess('✅ Context menus recreated! Try right-clicking on selected text.');
          } else {
            showError('❌ Failed to recreate context menus');
          }
        } catch (err) {
          Logger.error('Failed to recreate context menus', err);
          showError('❌ Error recreating context menus');
        }
      };

      testContextMenuBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: testContextMenuBtn, event: 'click', handler: clickHandler });
    }

    // Refresh subscription button
    const refreshSubscriptionBtn = document.getElementById('refreshSubscriptionBtn');
    if (refreshSubscriptionBtn) {
      const clickHandler = async () => {
        try {
          refreshSubscriptionBtn.textContent = '⏳ Refreshing...';
          refreshSubscriptionBtn.disabled = true;
          
          // Clear subscription cache in background
          await sendMessageToBackground('CLEAR_SUBSCRIPTION_CACHE');
          
          // Reload subscription status
          await loadSubscriptionStatus();
          
          showSuccess('✅ Subscription status refreshed');
        } catch (err) {
          Logger.error('Failed to refresh subscription', err);
          showError('❌ Failed to refresh subscription');
        } finally {
          refreshSubscriptionBtn.textContent = '🔄 Refresh Status';
          refreshSubscriptionBtn.disabled = false;
        }
      };

      refreshSubscriptionBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: refreshSubscriptionBtn, event: 'click', handler: clickHandler });
    }

    // Upgrade button
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
      const clickHandler = async () => {
        try {
          // Open upgrade page in new tab
          const data = await new Promise((resolve) => {
            chrome.storage.sync.get(['gateway_url'], resolve);
          });
          
          const gatewayUrl = data.gateway_url || 'https://api.aiguardian.ai';
          const baseUrl = gatewayUrl.replace('/api/v1', '').replace('/api', '');
          const upgradeUrl = `${baseUrl}/subscribe` || 'https://dashboard.aiguardian.ai/subscribe';
          
          chrome.tabs.create({ url: upgradeUrl });
          window.close();
        } catch (err) {
          Logger.error('Failed to open upgrade page', err);
          showError('❌ Failed to open upgrade page');
        }
      };

      upgradeBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: upgradeBtn, event: 'click', handler: clickHandler });
    }
  }

  /**
   * Load system status from background script
   */
  async function loadSystemStatus() {
    try {
      const response = await sendMessageToBackground('GET_GUARD_STATUS');
      if (response.success) {
        updateSystemStatus(response.status);
      } else {
        updateSystemStatus({ gateway_connected: false });
      }
    } catch (err) {
      Logger.error('Failed to load system status', err);
      updateSystemStatus({ gateway_connected: false });
    }
  }

  /**
   * Update system status display
   */
  function updateSystemStatus(status) {
    const indicator = document.getElementById('statusIndicator');
    const details = document.getElementById('statusDetails');
    const serviceStatus = document.getElementById('serviceStatus');
    
    if (status.gateway_connected) {
      indicator.className = 'status-indicator';
      details.textContent = 'AiGuardian service operational';
      if (serviceStatus) {
        serviceStatus.className = 'guard-status';
      }
      currentStatus = 'connected';
    } else {
      indicator.className = 'status-indicator error';
      details.textContent = 'Connection failed - check settings';
      if (serviceStatus) {
        serviceStatus.className = 'guard-status disabled';
      }
      currentStatus = 'error';
    }
  }

  /**
   * Load guard services status
   */
  async function loadGuardServices() {
    try {
      const response = await sendMessageToBackground('GET_GUARD_STATUS');
      if (response.success) {
        updateGuardServices(response.status);
      }
    } catch (err) {
      Logger.error('Failed to load guard services', err);
    }
  }

  /**
   * Update guard services display (unified service)
   */
  function updateGuardServices(status) {
    const serviceStatus = document.getElementById('serviceStatus');
    if (!serviceStatus) return;

    // Update unified service status
    if (status.gateway_connected) {
      serviceStatus.className = 'guard-status';
    } else {
      serviceStatus.className = 'guard-status disabled';
    }
  }

  /**
   * Load subscription status
   */
  async function loadSubscriptionStatus() {
    try {
      // Check if API key is configured
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get(['gateway_url', 'api_key'], resolve);
      });

      if (!data.api_key || !data.gateway_url) {
        // Hide subscription section if no API key
        const section = document.getElementById('subscriptionSection');
        if (section) section.style.display = 'none';
        return;
      }

      // Send message to background to get subscription
      const response = await sendMessageToBackground('GET_SUBSCRIPTION_STATUS');
      
      if (response && response.success && response.subscription) {
        updateSubscriptionStatus(response.subscription, response.usage);
      } else {
        // Hide subscription section if unable to load
        const section = document.getElementById('subscriptionSection');
        if (section) section.style.display = 'none';
      }
    } catch (err) {
      Logger.error('Failed to load subscription status', err);
      // Hide subscription section on error
      const section = document.getElementById('subscriptionSection');
      if (section) section.style.display = 'none';
    }
  }

  /**
   * Update subscription status display
   */
  function updateSubscriptionStatus(subscription, usage) {
    const section = document.getElementById('subscriptionSection');
    const tierEl = document.getElementById('subscriptionTier');
    const usageEl = document.getElementById('subscriptionUsage');
    const statusBadge = document.getElementById('subscriptionStatusBadge');
    const upgradeBtn = document.getElementById('upgradeBtn');
    const refreshBtn = document.getElementById('refreshSubscriptionBtn');

    if (!section) return;

    // Show subscription section
    section.style.display = 'block';

    // Update tier
    if (tierEl) {
      const tierName = subscription.tier ? subscription.tier.toUpperCase() : 'FREE';
      tierEl.textContent = tierName;
    }

    // Update status badge
    if (statusBadge) {
      const status = subscription.status || 'active';
      statusBadge.textContent = status === 'active' ? '✓ Active' : status;
      statusBadge.className = `subscription-status-badge ${status === 'active' ? 'active' : 'inactive'}`;
    }

    // Update usage
    if (usageEl && usage) {
      if (usage.requests_limit !== null && usage.requests_limit !== undefined) {
        const percentage = usage.usage_percentage || 0;
        const remaining = usage.remaining_requests !== null ? usage.remaining_requests : 'unlimited';
        usageEl.textContent = `${percentage.toFixed(1)}% used (${remaining} remaining)`;
        
        // Add warning class if > 80%
        if (percentage >= 80) {
          usageEl.className = 'subscription-usage warning';
        } else {
          usageEl.className = 'subscription-usage';
        }
      } else {
        usageEl.textContent = 'Unlimited';
        usageEl.className = 'subscription-usage';
      }
    } else if (usageEl) {
      usageEl.textContent = 'Usage data unavailable';
      usageEl.className = 'subscription-usage';
    }

    // Show upgrade button for free tier
    if (upgradeBtn) {
      if (subscription.tier === 'free') {
        upgradeBtn.style.display = 'inline-block';
      } else {
        upgradeBtn.style.display = 'none';
      }
    }

    // Show refresh button
    if (refreshBtn) {
      refreshBtn.style.display = 'inline-block';
    }
  }

  /**
   * Trigger analysis of selected text
   */
  async function triggerAnalysis() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const originalText = analyzeBtn ? analyzeBtn.textContent : '';
    
    if (analyzeBtn) {
      analyzeBtn.textContent = '⏳ Analyzing...';
      analyzeBtn.disabled = true;
    }
    
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script to analyze selected text
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'ANALYZE_SELECTION'
      });
      
      if (response && response.success) {
        updateAnalysisResult(response);
        showSuccess('✅ Analysis complete!');
        Logger.info('Analysis completed successfully');
      } else {
        showError('⚠️ No text selected. Please select text on the page first.');
      }
    } catch (err) {
      Logger.error('Failed to trigger analysis', err);
      showError('❌ Failed to analyze text. Make sure text is selected on the page.');
    } finally {
      if (analyzeBtn) {
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
      }
    }
  }

  /**
   * Update analysis result display
   */
  function updateAnalysisResult(result) {
    const biasScore = document.getElementById('biasScore');
    const biasType = document.getElementById('biasType');
    const confidence = document.getElementById('confidence');
    
    if (biasScore && result.score !== undefined) {
      biasScore.textContent = result.score.toFixed(2);
      
      // Update score color based on value
      biasScore.className = 'score-value';
      if (result.score < 0.3) {
        biasScore.classList.add('low');
      } else if (result.score < 0.7) {
        biasScore.classList.add('medium');
      } else {
        biasScore.classList.add('high');
      }
    }
    
    if (biasType && result.analysis) {
      biasType.textContent = result.analysis.bias_type || 'Unknown';
    }
    
    if (confidence && result.analysis) {
      const confValue = Math.round((result.analysis.confidence || 0.85) * 100);
      confidence.textContent = `${confValue}%`;
    }
  }

  /**
   * Test gateway connection
   */
  async function testConnection() {
    const testBtn = document.getElementById('testConnectionBtn');
    const originalText = testBtn ? testBtn.textContent : '';
    
    if (testBtn) {
      testBtn.textContent = '⏳ Testing...';
      testBtn.disabled = true;
    }
    
    try {
      const response = await sendMessageToBackground('TEST_GATEWAY_CONNECTION');
      if (response.success) {
        showSuccess(`✅ Connection successful (${response.responseTime}ms)`);
        loadSystemStatus(); // Refresh status
      } else {
        showError('❌ Connection failed - check your settings');
      }
    } catch (err) {
      Logger.error('Connection test failed', err);
      showError('❌ Connection test failed');
    } finally {
      if (testBtn) {
        testBtn.textContent = originalText;
        testBtn.disabled = false;
      }
    }
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
   * Show error message
   */
  function showError(message) {
    // Create temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.insertBefore(errorDiv, mainContent.firstChild);
      
      // Remove after 3 seconds
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 3000);
    }
  }

  /**
   * Show success message
   */
  function showSuccess(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.insertBefore(successDiv, mainContent.firstChild);
      
      // Remove after 3 seconds
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv);
        }
      }, 3000);
    }
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

  // Cleanup on popup close
  window.addEventListener('beforeunload', cleanupEventListeners);

})();

