/**
 * Options Script for AiGuardian Chrome Extension
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Configure your AiGuardian gateway endpoint
 * - Implement guard services management
 * - Add testing and validation capabilities
 * - Integrate with central logging and monitoring
 */

(function(){
  let testingFramework = null;
  let eventListeners = [];
  
  try {
    // TRACER BULLET: Initialize options page with AiGuardian integration
    initializeOptions();
    setupEventListeners();
    loadCurrentConfiguration();
    loadSubscriptionInfo();
  } catch (err) {
    Logger.error('Options init error', err);
  }

  /**
   * TRACER BULLET: Initialize options page with AiGuardian features
   */
  function initializeOptions() {
    // Initialize testing framework
    testingFramework = new AIGuardiansTesting();
    
    // Populate guard services
    populateGuardServices();
    
    Logger.info('Options page initialized');
  }

  /**
   * TRACER BULLET: Set up event listeners for all controls with proper cleanup tracking
   */
  function setupEventListeners() {
    const elements = [
      { id: 'test_connection', event: 'click', handler: testGatewayConnection },
      { id: 'gateway_url', event: 'change', handler: updateGatewayUrl },
      { id: 'api_key', event: 'change', handler: updateApiKey },
      { id: 'clerk_publishable_key', event: 'change', handler: updateClerkPublishableKey },
      { id: 'guard_services', event: 'change', handler: handleGuardServiceChange },
      { id: 'analysis_pipeline', event: 'change', handler: updateAnalysisPipeline },
      { id: 'analysis_timeout', event: 'change', handler: updateAnalysisTimeout },
      { id: 'enable_central_logging', event: 'change', handler: updateLoggingConfig },
      { id: 'enable_local_logging', event: 'change', handler: updateLoggingConfig },
      { id: 'log_level', event: 'change', handler: updateLoggingConfig },
      { id: 'run_tests', event: 'click', handler: runGuardServiceTests },
      { id: 'run_performance_tests', event: 'click', handler: runPerformanceTests },
      { id: 'run_integration_tests', event: 'click', handler: runIntegrationTests },
      { id: 'save_config', event: 'click', handler: saveConfiguration },
      { id: 'reset_config', event: 'click', handler: resetConfiguration },
      { id: 'export_config', event: 'click', handler: exportConfiguration },
      { id: 'import_config', event: 'click', handler: importConfiguration },
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
   * TRACER BULLET: Cleanup all event listeners
   */
  function cleanupEventListeners() {
    eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    eventListeners = [];
  }

  /**
   * TRACER BULLET: Load current configuration from storage
   */
  function loadCurrentConfiguration() {
    chrome.storage.sync.get([
      'gateway_url',
      'api_key',
      'clerk_publishable_key',
      'guard_services',
      'analysis_pipeline',
      'analysis_timeout',
      'logging_config'
    ], (data) => {
      // Load gateway configuration
      document.getElementById('gateway_url').value = data.gateway_url || '';
      document.getElementById('api_key').value = data.api_key || '';
      document.getElementById('clerk_publishable_key').value = data.clerk_publishable_key || '';

      // Load analysis pipeline
      document.getElementById('analysis_pipeline').value = data.analysis_pipeline || 'default';
      document.getElementById('analysis_timeout').value = data.analysis_timeout || 10;

      // Load logging configuration
      const loggingConfig = data.logging_config || {};
      document.getElementById('enable_central_logging').checked = loggingConfig.enable_central_logging || false;
      document.getElementById('enable_local_logging').checked = loggingConfig.enable_local_logging || false;
      document.getElementById('log_level').value = loggingConfig.level || 'info';

      // Load guard services
      if (data.guard_services) {
        updateGuardServicesUI(data.guard_services);
      }

      // Test initial connection
      testGatewayConnection();
    });
  }

  /**
   * TRACER BULLET: Populate guard services configuration
   */
  function populateGuardServices() {
    const guardServicesContainer = document.getElementById('guard_services');
    const defaultGuards = {
      bias_detection: { enabled: true, threshold: 0.5, name: 'Bias Detection' },
      toxicity_detection: { enabled: true, threshold: 0.7, name: 'Toxicity Detection' },
      sentiment_analysis: { enabled: false, threshold: 0.6, name: 'Sentiment Analysis' },
      fact_checking: { enabled: false, threshold: 0.8, name: 'Fact Checking' }
    };

    for (const [guardName, config] of Object.entries(defaultGuards)) {
      const guardDiv = document.createElement('div');
      guardDiv.className = 'guard-service';
      // Create elements safely without innerHTML
      const h4 = document.createElement('h4');
      h4.textContent = config.name;
      
      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'guard-controls';
      
      const enabledLabel = document.createElement('label');
      const enabledCheckbox = document.createElement('input');
      enabledCheckbox.type = 'checkbox';
      enabledCheckbox.id = 'guard_' + guardName + '_enabled';
      if (config.enabled) enabledCheckbox.checked = true;
      enabledLabel.appendChild(enabledCheckbox);
      enabledLabel.appendChild(document.createTextNode(' Enabled'));
      
      const thresholdLabel = document.createElement('label');
      thresholdLabel.appendChild(document.createTextNode('Threshold: '));
      const thresholdInput = document.createElement('input');
      thresholdInput.type = 'number';
      thresholdInput.id = 'guard_' + guardName + '_threshold';
      thresholdInput.min = '0';
      thresholdInput.max = '1';
      thresholdInput.step = '0.05';
      thresholdInput.value = config.threshold;
      thresholdLabel.appendChild(thresholdInput);
      
      controlsDiv.appendChild(enabledLabel);
      controlsDiv.appendChild(thresholdLabel);
      
      guardDiv.appendChild(h4);
      guardDiv.appendChild(controlsDiv);
      guardServicesContainer.appendChild(guardDiv);
    }
  }

  /**
   * TRACER BULLET: Update guard services UI
   */
  function updateGuardServicesUI(guardServices) {
    for (const [guardName, config] of Object.entries(guardServices)) {
      const enabledCheckbox = document.getElementById('guard_' + guardName + '_enabled');
      const thresholdInput = document.getElementById('guard_' + guardName + '_threshold');
      
      if (enabledCheckbox) {
        enabledCheckbox.checked = config.enabled || false;
      }
      if (thresholdInput) {
        thresholdInput.value = config.threshold || 0.5;
      }
    }
  }

  /**
   * TRACER BULLET: Test gateway connection
   */
  async function testGatewayConnection() {
    const statusElement = document.getElementById('connection_status');
    statusElement.textContent = 'Testing...';
    statusElement.className = 'status';

    try {
      const response = await sendMessageToBackground('TEST_GATEWAY_CONNECTION');
      
      if (response.success) {
        statusElement.textContent = 'Connected';
        statusElement.className = 'status connected';
      } else {
        statusElement.textContent = 'Disconnected';
        statusElement.className = 'status disconnected';
      }
    } catch (err) {
      statusElement.textContent = 'Error';
      statusElement.className = 'status disconnected';
      Logger.error('Gateway connection test failed', err);
    }
  }

  /**
   * TRACER BULLET: Update gateway URL
   */
  function updateGatewayUrl() {
    const gatewayUrl = document.getElementById('gateway_url').value;
    chrome.storage.sync.set({ gateway_url: gatewayUrl });
    Logger.info('Gateway URL updated', { gateway_url: gatewayUrl });
  }

  /**
   * TRACER BULLET: Update API key
   */
  function updateApiKey() {
    const apiKey = document.getElementById('api_key').value;
    chrome.storage.sync.set({ api_key: apiKey });
    Logger.info('API key updated');
  }

  /**
   * TRACER BULLET: Update Clerk publishable key
   */
  function updateClerkPublishableKey() {
    const clerkKey = document.getElementById('clerk_publishable_key').value;
    chrome.storage.sync.set({ clerk_publishable_key: clerkKey });
    Logger.info('Clerk publishable key updated');
  }

  /**
   * TRACER BULLET: Handle guard service changes
   */
  function handleGuardServiceChange(event) {
    // Safe string manipulation with bounds checking
    let guardName = event.target.id;
    if (typeof guardName === 'string' && guardName.length > 0) {
      guardName = guardName.replace('guard_', '').replace('_enabled', '').replace('_threshold', '');
    }
    const isEnabled = event.target.type === 'checkbox' ? event.target.checked : 
      document.getElementById('guard_' + guardName + '_enabled').checked;
    const threshold = parseFloat(document.getElementById('guard_' + guardName + '_threshold').value);

    const config = { enabled: isEnabled, threshold: threshold };
    
    // Update local storage
    chrome.storage.sync.get(['guard_services'], (data) => {
      const guardServices = data.guard_services || {};
      guardServices[guardName] = config;
      chrome.storage.sync.set({ guard_services: guardServices });
    });

    // Update background script
    sendMessageToBackground('UPDATE_GUARD_CONFIG', {
      guardName: guardName,
      config: config
    });

    Logger.info('Guard service updated', { guard_name: guardName, config });
  }

  /**
   * TRACER BULLET: Update analysis pipeline
   */
  function updateAnalysisPipeline() {
    const pipeline = document.getElementById('analysis_pipeline').value;
    chrome.storage.sync.set({ analysis_pipeline: pipeline });
    Logger.info('Analysis pipeline updated', { pipeline });
  }

  /**
   * TRACER BULLET: Update analysis timeout
   */
  function updateAnalysisTimeout() {
    const timeout = parseInt(document.getElementById('analysis_timeout').value);
    chrome.storage.sync.set({ analysis_timeout: timeout });
    Logger.info('Analysis timeout updated', { timeout });
  }

  /**
   * TRACER BULLET: Update logging configuration
   */
  function updateLoggingConfig() {
    const loggingConfig = {
      enable_central_logging: document.getElementById('enable_central_logging').checked,
      enable_local_logging: document.getElementById('enable_local_logging').checked,
      level: document.getElementById('log_level').value
    };

    chrome.storage.sync.set({ logging_config: loggingConfig });
    Logger.info('Logging configuration updated', loggingConfig);
  }

  /**
   * TRACER BULLET: Run guard service tests
   */
  async function runGuardServiceTests() {
    const resultsContainer = document.getElementById('test_results');
    resultsContainer.classList.remove('hidden');
    resultsContainer.textContent = 'Running guard service tests...';

    try {
      const results = await testingFramework.runGuardServiceTests();
      const report = testingFramework.generateTestReport(results);
      
      resultsContainer.textContent = JSON.stringify(report, null, 2);
      Logger.info('Guard service tests completed', { results });
    } catch (err) {
      resultsContainer.textContent = `Test failed: ${err.message}`;
      Logger.error('Guard service tests failed', err);
    }
  }

  /**
   * TRACER BULLET: Run performance tests
   */
  async function runPerformanceTests() {
    const resultsContainer = document.getElementById('test_results');
    resultsContainer.classList.remove('hidden');
    resultsContainer.textContent = 'Running performance tests...';

    try {
      const results = await testingFramework.runPerformanceTests();
      resultsContainer.textContent = JSON.stringify(results, null, 2);
      Logger.info('Performance tests completed', { results });
    } catch (err) {
      resultsContainer.textContent = `Performance test failed: ${err.message}`;
      Logger.error('Performance tests failed', err);
    }
  }

  /**
   * TRACER BULLET: Run integration tests
   */
  async function runIntegrationTests() {
    const resultsContainer = document.getElementById('test_results');
    resultsContainer.classList.remove('hidden');
    resultsContainer.textContent = 'Running integration tests...';

    try {
      const results = await testingFramework.runIntegrationTests();
      resultsContainer.textContent = JSON.stringify(results, null, 2);
      Logger.info('Integration tests completed', { results });
      } catch (err) {
      resultsContainer.textContent = `Integration test failed: ${err.message}`;
      Logger.error('Integration tests failed', err);
    }
  }

  /**
   * TRACER BULLET: Save configuration
   */
  function saveConfiguration() {
    // Collect all configuration
    const config = {
      gateway_url: document.getElementById('gateway_url').value,
      api_key: document.getElementById('api_key').value,
      clerk_publishable_key: document.getElementById('clerk_publishable_key').value,
      analysis_pipeline: document.getElementById('analysis_pipeline').value,
      analysis_timeout: parseInt(document.getElementById('analysis_timeout').value),
      logging_config: {
        enable_central_logging: document.getElementById('enable_central_logging').checked,
        enable_local_logging: document.getElementById('enable_local_logging').checked,
        level: document.getElementById('log_level').value
      }
    };

    // Collect guard services configuration
    const guardServices = {};
    const guardElements = document.querySelectorAll('.guard-service');
    guardElements.forEach(guardElement => {
      // Safe string manipulation with bounds checking
      let guardName = guardElement.querySelector('input[type="checkbox"]').id;
      if (typeof guardName === 'string' && guardName.length > 0) {
        guardName = guardName.replace('guard_', '').replace('_enabled', '');
      }
      const enabled = guardElement.querySelector('input[type="checkbox"]').checked;
      const threshold = parseFloat(guardElement.querySelector('input[type="number"]').value);
      
      guardServices[guardName] = { enabled, threshold };
    });

    config.guard_services = guardServices;

    // Save to storage
    chrome.storage.sync.set(config, () => {
      if (chrome.runtime.lastError) {
        Logger.error('Failed to save configuration', chrome.runtime.lastError);
        alert('Failed to save configuration');
      } else {
        Logger.info('Configuration saved successfully');
        alert('Configuration saved successfully');
      }
    });
  }

  /**
   * TRACER BULLET: Reset configuration to defaults
   */
  function resetConfiguration() {
    if (confirm('Are you sure you want to reset all configuration to defaults?')) {
      chrome.storage.sync.clear(() => {
        location.reload();
      });
    }
  }

  /**
   * TRACER BULLET: Export configuration
   */
  function exportConfiguration() {
    chrome.storage.sync.get(null, (data) => {
      const configJson = JSON.stringify(data, null, 2);
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-guardians-config.json';
      a.click();
      
      URL.revokeObjectURL(url);
    });
  }

  /**
   * TRACER BULLET: Import configuration
   */
  function importConfiguration() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target.result);
            chrome.storage.sync.set(config, () => {
          if (chrome.runtime.lastError) {
                Logger.error('Failed to import configuration', chrome.runtime.lastError);
                alert('Failed to import configuration');
          } else {
                Logger.info('Configuration imported successfully');
                location.reload();
          }
        });
      } catch (err) {
            Logger.error('Invalid configuration file', err);
            alert('Invalid configuration file');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  }

  /**
   * TRACER BULLET: Send message to background script
   */
  function sendMessageToBackground(type, payload = null) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type, payload }, (response) => {
        resolve(response || { success: false, error: 'No response' });
      });
    });
  }

  /**
   * TRACER BULLET: Load subscription information
   */
  async function loadSubscriptionInfo() {
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
   * TRACER BULLET: Update subscription information display
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
   * TRACER BULLET: Refresh subscription information
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
   * TRACER BULLET: Manage subscription
   */
  async function manageSubscription() {
    try {
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get(['gateway_url'], resolve);
      });
      
      const gatewayUrl = data.gateway_url || 'https://api.aiguardian.ai';
      const baseUrl = gatewayUrl.replace('/api/v1', '').replace('/api', '');
      const manageUrl = `${baseUrl}/dashboard/subscription` || 'https://dashboard.aiguardian.ai/subscription';
      
      chrome.tabs.create({ url: manageUrl });
    } catch (err) {
      Logger.error('Failed to open subscription management', err);
    }
  }

  /**
   * TRACER BULLET: Upgrade subscription
   * Note: Payment is handled through Stripe on the landing page, not in the extension
   */
  async function upgradeSubscription() {
    try {
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get(['gateway_url'], resolve);
      });
      
      const gatewayUrl = data.gateway_url || 'https://api.aiguardian.ai';
      const baseUrl = gatewayUrl.replace('/api/v1', '').replace('/api', '');
      const upgradeUrl = `${baseUrl}/subscribe` || 'https://dashboard.aiguardian.ai/subscribe';
      
      chrome.tabs.create({ url: upgradeUrl });
    } catch (err) {
      Logger.error('Failed to open upgrade page', err);
    }
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanupEventListeners);

})();

