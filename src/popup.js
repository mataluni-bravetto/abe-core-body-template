/**
 * Popup Script for AiGuardian Chrome Extension
 * 
 * Enhanced popup with real-time status, unified service, and analysis results
 */

(function(){
  // Only run in popup context, not in options page
  const isOptionsPage = window.location.pathname.includes('options.html');
  if (isOptionsPage) {
    // Don't initialize popup code in options page
    return;
  }

  let eventListeners = [];
  let currentStatus = 'loading';
  let auth = null;
  let errorHandler = null;

  try {
    initializePopup();
    initializeErrorHandler();
    setupEventListeners();
    initializeAuth();
    initializeOnboarding();
    loadSystemStatus();
    loadGuardServices();
    loadSubscriptionStatus();
  } catch (err) {
    Logger.error('Popup init error', err);
    // Fallback error display if error handler not initialized
    showFallbackError('Extension failed to load properly. Please refresh and try again.');
  }

  /**
   * Initialize popup with enhanced features
   */
  function initializePopup() {
    Logger.info('Initializing AiGuardian popup');
  }

  /**
   * Initialize error handler
   */
  function initializeErrorHandler() {
    errorHandler = new AiGuardianErrorHandler();
    Logger.info('Error handler initialized');
  }

  /**
   * Fallback error display when error handler is not available
   */
  function showFallbackError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.insertBefore(errorDiv, mainContent.firstChild);
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv);
        }
      }, 5000);
    }
  }

  /**
   * Initialize onboarding for first-time users
   */
  async function initializeOnboarding() {
    try {
      const onboarding = new AiGuardianOnboarding();
      await onboarding.initialize();
    } catch (err) {
      Logger.error('Onboarding init error', err);
    }
  }

  /**
   * Initialize authentication
   */
  async function initializeAuth() {
    try {
      auth = new AiGuardianAuth();
      const initialized = await auth.initialize();

      if (initialized) {
        await updateAuthUI();
      } else {
        Logger.warn('[Popup] Authentication not configured');
        errorHandler.showError('AUTH_NOT_CONFIGURED');
      }

      // Listen for auth callback success and errors
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'AUTH_CALLBACK_SUCCESS') {
          // Reload auth state when callback succeeds
          if (auth) {
            auth.checkUserSession().then(() => {
              updateAuthUI();
            });
          }
        } else if (request.type === 'AUTH_ERROR') {
          // Handle auth errors from background/service worker
          Logger.error('[Popup] Auth error received:', request.error);
          errorHandler.showError('AUTH_SIGN_UP_FAILED');
        }
      });
        } catch (err) {
          Logger.error('Auth initialization error', err);
          errorHandler.showError('AUTH_NOT_CONFIGURED');
        }
  }

  /**
   * Generate user initials from display name
   * Handles edge cases: null, empty string, whitespace-only, single character
   * @param {string|null} displayName - User display name
   * @returns {string} User initials (max 2 characters) or fallback 'U'
   */
  function generateUserInitials(displayName) {
    // Handle null, undefined, or empty string
    if (!displayName || typeof displayName !== 'string') {
      return 'U';
    }

    // Trim whitespace and validate non-empty
    const trimmed = displayName.trim();
    if (trimmed.length === 0) {
      return 'U';
    }

    // Split by spaces and filter out empty parts
    const nameParts = trimmed.split(' ').filter(part => part.length > 0);
    
    // If no valid parts, return first character of trimmed string
    if (nameParts.length === 0) {
      return trimmed[0].toUpperCase();
    }

    // Generate initials from valid name parts (max 2 characters)
    const initials = nameParts
      .slice(0, 2) // Take first two parts only
      .map(part => part[0]) // Get first character of each part
      .filter(char => char) // Filter out any undefined/null characters
      .join('')
      .toUpperCase();

    // Fallback if initials are empty (shouldn't happen, but defensive)
    return initials.length > 0 ? initials : 'U';
  }

  /**
   * Update authentication UI based on user state
   */
  async function updateAuthUI() {
    if (!auth) return;

    const userProfile = document.getElementById('userProfile');
    const authButtons = document.getElementById('authButtons');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const mainContent = document.querySelector('.main-content');
    const analysisSection = document.getElementById('analysisSection');

    if (auth.isAuthenticated()) {
      // Show user profile
      const user = auth.getCurrentUser();
      const avatarUrl = auth.getUserAvatar();
      const displayName = auth.getUserDisplayName();

      if (userAvatar) {
        if (avatarUrl) {
          userAvatar.innerHTML = `<img src="${avatarUrl}" alt="User Avatar">`;
        } else {
          // Show initials as fallback
          const initials = generateUserInitials(displayName);
          userAvatar.textContent = initials;
        }
      }

      if (userName) {
        userName.textContent = displayName;
      }

      userProfile.style.display = 'flex';
      authButtons.style.display = 'none';
      
      // Show main content and analysis section when authenticated
      if (mainContent) {
        mainContent.style.display = 'block';
      }
      if (analysisSection) {
        analysisSection.style.display = 'block';
      }
    } else {
      // Show auth buttons
      userProfile.style.display = 'none';
      authButtons.style.display = 'flex';
      
      // Hide main content and analysis section when not authenticated
      if (mainContent) {
        mainContent.style.display = 'none';
      }
      if (analysisSection) {
        analysisSection.style.display = 'none';
      }
    }
  }

  /**
   * Show authentication not configured message
   */
  function showAuthNotConfigured() {
    const authSection = document.getElementById('authSection');
    if (authSection) {
      authSection.innerHTML = `
        <div style="text-align: center; color: rgba(249, 249, 249, 0.7); font-size: 12px;">
          Authentication not configured.<br>
          Add Clerk publishable key in settings.
        </div>
      `;
    }
  }

  /**
   * Set up event listeners with proper cleanup tracking
   */
  function setupEventListeners() {
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
          errorHandler.showError('CONNECTION_FAILED');
        } finally {
          refreshSubscriptionBtn.textContent = '🔄 Refresh Status';
          refreshSubscriptionBtn.disabled = false;
        }
      };

      refreshSubscriptionBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: refreshSubscriptionBtn, event: 'click', handler: clickHandler });
    }

    // Upgrade button - redirects to landing page where Stripe payment is handled
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
      const clickHandler = async () => {
        try {
          // Open upgrade page in new tab (Stripe payment handled on landing page)
          const data = await new Promise((resolve) => {
            chrome.storage.sync.get(['gateway_url'], resolve);
          });

          const gatewayUrl = data.gateway_url || 'https://api.aiguardian.ai';
          const baseUrl = gatewayUrl.replace('/api/v1', '').replace('/api', '');
          // Redirect to landing page where Stripe payment processing occurs
          const upgradeUrl = `${baseUrl}/subscribe` || 'https://aiguardian.ai/subscribe';

          chrome.tabs.create({ url: upgradeUrl });
          window.close();
        } catch (err) {
          Logger.error('Failed to open upgrade page', err);
          errorHandler.showError('NETWORK_ERROR');
        }
      };

      upgradeBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: upgradeBtn, event: 'click', handler: clickHandler });
    }

    // Sign In button
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
      const clickHandler = async () => {
        try {
          if (auth) {
            await auth.signIn();
            // Close popup after redirecting to auth
            window.close();
          } else {
            errorHandler.showError('AUTH_NOT_CONFIGURED');
          }
        } catch (err) {
          Logger.error('Failed to sign in', err);
          errorHandler.showError('AUTH_SIGN_IN_FAILED');
        }
      };

      signInBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: signInBtn, event: 'click', handler: clickHandler });
    }

    // Sign Up button
    const signUpBtn = document.getElementById('signUpBtn');
    if (signUpBtn) {
      const clickHandler = async () => {
        Logger.info('[Popup] Sign Up button clicked');
        try {
          if (!auth) {
            Logger.error('[Popup] Auth object is null');
            errorHandler.showError('AUTH_NOT_CONFIGURED');
            return;
          }
          
          Logger.info('[Popup] Calling auth.signUp()');
          await auth.signUp();
          Logger.info('[Popup] auth.signUp() completed, closing popup');
          // Close popup after redirecting to auth
          window.close();
        } catch (err) {
          Logger.error('[Popup] Sign-up failed with error:', {
            message: err.message,
            stack: err.stack,
            name: err.name,
            error: err
          });
          console.error('[Popup] Full error object:', err);
          errorHandler.showError('AUTH_SIGN_UP_FAILED');
        }
      };

      signUpBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: signUpBtn, event: 'click', handler: clickHandler });
    }

    // Sign Out button
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
      const clickHandler = async () => {
        try {
          if (auth) {
            await auth.signOut();
            await updateAuthUI();
            showSuccess('✅ Signed out successfully');
          } else {
            errorHandler.showError('AUTH_NOT_CONFIGURED');
          }
        } catch (err) {
          Logger.error('Failed to sign out', err);
          errorHandler.showError('AUTH_SIGN_IN_FAILED'); // Using same error type since it's auth-related
        }
      };

      signOutBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: signOutBtn, event: 'click', handler: clickHandler });
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
      // Check if user is authenticated via Clerk and gateway is configured
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get(['gateway_url'], (syncData) => {
          chrome.storage.local.get(['clerk_user', 'clerk_token'], (localData) => {
            resolve({
              gateway_url: syncData.gateway_url,
              clerk_user: localData.clerk_user,
              clerk_token: localData.clerk_token
            });
          });
        });
      });

      if (!data.clerk_user || !data.gateway_url) {
        // Hide subscription section if user is not authenticated or gateway not configured
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
   * Requires authentication
   */
  async function triggerAnalysis() {
    // Check authentication first
    if (!auth || !auth.isAuthenticated()) {
      errorHandler.showError('AUTH_REQUIRED');
      // Prompt sign in
      try {
        if (auth) {
          await auth.signIn();
          window.close();
        } else {
          errorHandler.showError('AUTH_NOT_CONFIGURED');
        }
      } catch (err) {
        Logger.error('Failed to sign in', err);
        errorHandler.showError('AUTH_SIGN_IN_FAILED');
      }
      return;
    }

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
        errorHandler.showError('ANALYSIS_NO_SELECTION');
      }
    } catch (err) {
      Logger.error('Failed to trigger analysis', err);
      errorHandler.showErrorFromException(err);
    } finally {
      if (analyzeBtn) {
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
      }
    }
  }

  /**
   * Update analysis result display
   * All values come from backend - no fallbacks or mocks
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
      biasType.textContent = result.analysis.bias_type || result.analysis.type || 'Unknown';
    }
    
    if (confidence && result.analysis && result.analysis.confidence !== undefined) {
      const confValue = Math.round(result.analysis.confidence * 100);
      confidence.textContent = `${confValue}%`;
    } else if (confidence) {
      confidence.textContent = '—';
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
   * Legacy showError function - redirects to new error handler
   * @deprecated Use errorHandler.showError() instead
   */
  function showError(message) {
    // For backward compatibility, map to new error handler
    if (errorHandler) {
      return errorHandler.showLegacyError(message);
    } else {
      // Fallback if error handler not initialized
      showFallbackError(message);
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

