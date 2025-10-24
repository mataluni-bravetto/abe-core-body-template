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
   * Trigger analysis of selected text
   */
  async function triggerAnalysis() {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script to analyze selected text
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'ANALYZE_SELECTION'
      });
      
      if (response && response.success) {
        updateAnalysisResult(response);
        Logger.info('Analysis completed successfully');
      } else {
        showError('No text selected or analysis failed');
      }
    } catch (err) {
      Logger.error('Failed to trigger analysis', err);
      showError('Failed to analyze text');
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
    if (testBtn) {
      testBtn.textContent = 'Testing...';
      testBtn.disabled = true;
    }
    
    try {
      const response = await sendMessageToBackground('TEST_GATEWAY_CONNECTION');
      if (response.success) {
        showSuccess(`Connection successful (${response.responseTime}ms)`);
        loadSystemStatus(); // Refresh status
      } else {
        showError('Connection failed - check your settings');
      }
    } catch (err) {
      Logger.error('Connection test failed', err);
      showError('Connection test failed');
    } finally {
      if (testBtn) {
        testBtn.textContent = 'Test Connection';
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

