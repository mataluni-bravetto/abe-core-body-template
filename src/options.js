/**
 * Options Script for AI Guardians Chrome Extension
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Configure your AI Guardians gateway endpoint
 * - Implement guard services management
 * - Add testing and validation capabilities
 * - Integrate with central logging and monitoring
 */

(function(){
  let testingFramework = null;
  
  try {
    // TRACER BULLET: Initialize options page with AI Guardians integration
    initializeOptions();
    setupEventListeners();
    loadCurrentConfiguration();
  } catch (err) {
    Logger.error('Options init error', err);
  }

  /**
   * TRACER BULLET: Initialize options page with AI Guardians features
   */
  function initializeOptions() {
    // Initialize testing framework
    testingFramework = new AIGuardiansTesting();
    
    // Populate guard services
    populateGuardServices();
    
    Logger.info('Options page initialized');
  }

  /**
   * TRACER BULLET: Set up event listeners for all controls
   */
  function setupEventListeners() {
    // Gateway configuration
    document.getElementById('test_connection').addEventListener('click', testGatewayConnection);
    document.getElementById('gateway_url').addEventListener('change', updateGatewayUrl);
    document.getElementById('api_key').addEventListener('change', updateApiKey);

    // Guard services
    document.getElementById('guard_services').addEventListener('change', handleGuardServiceChange);

    // Analysis pipeline
    document.getElementById('analysis_pipeline').addEventListener('change', updateAnalysisPipeline);
    document.getElementById('analysis_timeout').addEventListener('change', updateAnalysisTimeout);

    // Logging configuration
    document.getElementById('enable_central_logging').addEventListener('change', updateLoggingConfig);
    document.getElementById('enable_local_logging').addEventListener('change', updateLoggingConfig);
    document.getElementById('log_level').addEventListener('change', updateLoggingConfig);

    // Testing
    document.getElementById('run_tests').addEventListener('click', runGuardServiceTests);
    document.getElementById('run_performance_tests').addEventListener('click', runPerformanceTests);
    document.getElementById('run_integration_tests').addEventListener('click', runIntegrationTests);

    // Actions
    document.getElementById('save_config').addEventListener('click', saveConfiguration);
    document.getElementById('reset_config').addEventListener('click', resetConfiguration);
    document.getElementById('export_config').addEventListener('click', exportConfiguration);
    document.getElementById('import_config').addEventListener('click', importConfiguration);
  }

  /**
   * TRACER BULLET: Load current configuration from storage
   */
  function loadCurrentConfiguration() {
    chrome.storage.sync.get([
      'gateway_url',
      'api_key',
      'guard_services',
      'analysis_pipeline',
      'analysis_timeout',
      'logging_config'
    ], (data) => {
      // Load gateway configuration
      document.getElementById('gateway_url').value = data.gateway_url || '';
      document.getElementById('api_key').value = data.api_key || '';

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
      guardDiv.innerHTML = `
        <h4>${config.name}</h4>
        <div class="guard-controls">
          <label>
            <input type="checkbox" id="guard_${guardName}_enabled" ${config.enabled ? 'checked' : ''} />
            Enabled
          </label>
          <label>
            Threshold: 
            <input type="number" id="guard_${guardName}_threshold" min="0" max="1" step="0.05" value="${config.threshold}" />
          </label>
        </div>
      `;
      guardServicesContainer.appendChild(guardDiv);
    }
  }

  /**
   * TRACER BULLET: Update guard services UI
   */
  function updateGuardServicesUI(guardServices) {
    for (const [guardName, config] of Object.entries(guardServices)) {
      const enabledCheckbox = document.getElementById(`guard_${guardName}_enabled`);
      const thresholdInput = document.getElementById(`guard_${guardName}_threshold`);
      
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
   * TRACER BULLET: Handle guard service changes
   */
  function handleGuardServiceChange(event) {
    const guardName = event.target.id.replace('guard_', '').replace('_enabled', '').replace('_threshold', '');
    const isEnabled = event.target.type === 'checkbox' ? event.target.checked : 
      document.getElementById(`guard_${guardName}_enabled`).checked;
    const threshold = parseFloat(document.getElementById(`guard_${guardName}_threshold`).value);

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
      const guardName = guardElement.querySelector('input[type="checkbox"]').id.replace('guard_', '').replace('_enabled', '');
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

})();

