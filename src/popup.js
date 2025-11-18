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
  let authCheckInterval = null; // For periodic auth checking when not authenticated
  let errorHandler = null;

  // Ensure DOM is ready before initializing
  async function initialize() {
    try {
      initializePopup();
      
      // CRITICAL: Set up event listeners FIRST, before anything else that might fail
      // This ensures buttons work even if other initialization fails
      setupEventListeners();
      
      // Initialize error handler (defensive - won't fail if class not available)
      try {
        initializeErrorHandler();
      } catch (err) {
        Logger.error('Error handler initialization failed (non-critical)', err);
        // Continue without error handler - buttons will still work
      }
      
      // Initialize auth (defensive - won't fail initialization)
      try {
        await initializeAuth();
      } catch (err) {
        Logger.error('Auth initialization failed (non-critical)', err);
        // Continue - user can still use buttons
      }
      
      // Initialize onboarding (defensive)
      try {
        await initializeOnboarding();
      } catch (err) {
        Logger.error('Onboarding initialization failed (non-critical)', err);
      }
      
      // Load status (defensive)
      try {
        await loadSystemStatus();
        await loadGuardServices();
        await loadSubscriptionStatus();
      } catch (err) {
        Logger.error('Status loading failed (non-critical)', err);
      }
      
      // Check for issues and show diagnostic panel if needed
      setTimeout(async () => {
        try {
          await checkForIssues();
        } catch (err) {
          Logger.error('Issue check failed (non-critical)', err);
        }
      }, 1000);
    } catch (err) {
      Logger.error('Popup initialization error', err);
      // Even if initialization fails, try to show error
      try {
        Logger.error('Popup init error', err);
        showFallbackError('Extension failed to load properly. Please refresh and try again.');
        setTimeout(() => showDiagnosticPanel(), 500);
      } catch (fallbackErr) {
        // Last resort - just log to console
        Logger.error('Even fallback error display failed', fallbackErr);
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM already ready, initialize immediately
    initialize();
  }

  /**
   * Initialize popup with enhanced features
   */
  function initializePopup() {
    Logger.info('Initializing AiGuardian popup');

    // Hide developer-only auth UI in production unless SHOW_DEV_UI is enabled
    try {
      const isDevUI = typeof SHOW_DEV_UI !== 'undefined' && (SHOW_DEV_UI || window.__AIG_SHOW_DEV_UI === true);
      if (!isDevUI) {
        const authSection = document.getElementById('authSection');
        if (authSection) {
          authSection.style.display = 'none';
        }
      }
    } catch (e) {
      Logger.warn('[Popup] Failed to apply dev UI flag', e);
    }

    // Always show main content container so public users still see status/analysis UI
    try {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.display = 'block';
      }
    } catch (e) {
      Logger.warn('[Popup] Failed to show main content', e);
    }
  }

  /**
   * Initialize error handler (defensive - checks if class exists)
   */
  function initializeErrorHandler() {
    if (typeof AiGuardianErrorHandler === 'undefined') {
      Logger.warn('AiGuardianErrorHandler class not available - error handler not initialized');
      // Create a minimal fallback error handler
      errorHandler = {
        showError: function(type) {
          Logger.error('Error', type);
          showFallbackError('An error occurred: ' + type);
        },
        showErrorFromException: function(err) {
          Logger.error('Exception', err);
          showFallbackError('An error occurred: ' + (err.message || 'Unknown error'));
        },
        showLegacyError: function(message) {
          Logger.error('Legacy error', message);
          showFallbackError(message);
        }
      };
      return;
    }
    
    try {
      errorHandler = new AiGuardianErrorHandler();
      Logger.info('Error handler initialized');
    } catch (err) {
      Logger.error('Failed to instantiate error handler', err);
      // Create fallback
      errorHandler = {
        showError: function(type) {
          Logger.error('Error', type);
          showFallbackError('An error occurred: ' + type);
        },
        showErrorFromException: function(err) {
          Logger.error('Exception', err);
          showFallbackError('An error occurred: ' + (err.message || 'Unknown error'));
        },
        showLegacyError: function(message) {
          Logger.error('Legacy error', message);
          showFallbackError(message);
        }
      };
    }
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
   * Check for OAuth errors in storage and display them
   */
  async function checkAndDisplayOAuthErrors() {
    try {
      const storageData = await new Promise((resolve) => {
        chrome.storage.local.get(['oauth_error'], (data) => {
          resolve(data.oauth_error || null);
        });
      });

      if (storageData && storageData.type === 'AUTH_OAUTH_REDIRECT_URI_MISMATCH') {
        Logger.info('[Popup] OAuth error found in storage, displaying banner');
        showOAuthErrorBanner(storageData);
        return true;
      }
      return false;
    } catch (error) {
      Logger.warn('[Popup] Error checking for OAuth errors:', error);
      return false;
    }
  }

  /**
   * Show OAuth error banner
   */
  function showOAuthErrorBanner(errorData) {
    const banner = document.getElementById('oauthErrorBanner');
    const title = document.getElementById('oauthErrorTitle');
    const message = document.getElementById('oauthErrorMessage');
    const uri = document.getElementById('oauthErrorUri');

    if (!banner) {
      Logger.warn('[Popup] OAuth error banner element not found');
      return;
    }

    if (title) {
      title.textContent = 'OAuth Configuration Error';
    }
    if (message) {
      message.textContent = errorData.errorDescription || 'Google OAuth redirect URI is not configured.';
    }
    if (uri) {
      uri.textContent = 'Required: https://clerk.aiguardian.ai/v1/oauth_callback';
    }

    banner.style.display = 'block';
  }

  /**
   * Hide OAuth error banner
   */
  function hideOAuthErrorBanner() {
    const banner = document.getElementById('oauthErrorBanner');
    if (banner) {
      banner.style.display = 'none';
    }
  }

  /**
   * Clear OAuth error from storage
   */
  async function clearOAuthError() {
    try {
      await chrome.storage.local.remove(['oauth_error']);
      Logger.info('[Popup] OAuth error cleared from storage');
      hideOAuthErrorBanner();
    } catch (error) {
      Logger.warn('[Popup] Error clearing OAuth error:', error);
    }
  }

  /**
   * Initialize authentication
   */
  async function initializeAuth() {
    try {
      // FIRST: Check storage directly for any existing auth (bypasses Clerk initialization)
      Logger.info('[Popup] Checking storage for existing auth before initializing...');
      const storageCheck = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_user', 'clerk_token'], (data) => {
          if (chrome.runtime.lastError) {
            Logger.error('[Popup] Storage read error:', chrome.runtime.lastError);
            resolve(null);
          } else {
            Logger.info('[Popup] Storage check result:', {
              hasUser: !!data.clerk_user,
              hasToken: !!data.clerk_token,
              userId: data.clerk_user?.id,
              email: data.clerk_user?.email
            });
            resolve(data.clerk_user || null);
          }
        });
      });
      
      // Check for OAuth errors in storage
      await checkAndDisplayOAuthErrors();
      
      if (storageCheck) {
        Logger.info('[Popup] ✅ Found stored user:', storageCheck.id);
        // Clear OAuth error if user is authenticated
        await clearOAuthError();
        // Update UI immediately if we have stored user
        await updateAuthUI();
      } else {
        Logger.info('[Popup] No stored user found in initial check');
      }
      
      auth = new AiGuardianAuth();
      const initialized = await auth.initialize();

      if (initialized) {
        // Force check user session again after initialization
        Logger.info('[Popup] Clerk initialized, checking user session...');
        await auth.checkUserSession();
        await updateAuthUI();
      } else {
        Logger.warn('[Popup] Authentication not configured');
        if (errorHandler) {
          errorHandler.showError('AUTH_NOT_CONFIGURED');
        } else {
          showFallbackError('Authentication not configured. Please check settings.');
        }
        // Show diagnostic panel if auth fails
        showDiagnosticPanel();
      }
      
      // Even if Clerk init failed, check storage directly as fallback
      if (!initialized || !auth.isAuthenticated()) {
        Logger.info('[Popup] Clerk not initialized or not authenticated, checking storage directly...');
        const directStorageCheck = await new Promise((resolve) => {
          chrome.storage.local.get(['clerk_user'], (data) => {
            resolve(data.clerk_user || null);
          });
        });
        
        if (directStorageCheck) {
          Logger.info('[Popup] Found user in storage but Clerk not initialized - user may have signed in');
          // Try to initialize auth again with stored user
          if (!auth || !auth.isInitialized) {
            Logger.info('[Popup] Re-initializing auth to use stored user...');
            try {
              auth = new AiGuardianAuth();
              await auth.initialize();
              await auth.checkUserSession();
              await updateAuthUI();
            } catch (reinitErr) {
              Logger.error('[Popup] Failed to re-initialize auth:', reinitErr);
            }
          } else {
            // Force check session
            await auth.checkUserSession();
            await updateAuthUI();
          }
        }
      }

      // Listen for auth callback success and errors
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
          Logger.info('[Popup] Message received:', request.type);
          
          if (request.type === 'AUTH_CALLBACK_SUCCESS' || request.type === 'CLERK_AUTH_DETECTED') {
            Logger.info('[Popup] 🔔 Auth callback success detected! Reloading auth state...', {
              messageType: request.type,
              hasUserInMessage: !!request.user,
              userId: request.user?.id
            });
            
            // Wait a moment for storage to be written (callback page writes first, then sends message)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Immediately check storage first (fastest)
            chrome.storage.local.get(['clerk_user', 'clerk_token'], async (data) => {
              if (chrome.runtime.lastError) {
                Logger.error('[Popup] Storage read error in callback handler:', chrome.runtime.lastError);
              } else {
                Logger.info('[Popup] Storage check in callback handler:', {
                  hasUser: !!data.clerk_user,
                  hasToken: !!data.clerk_token,
                  userId: data.clerk_user?.id,
                  email: data.clerk_user?.email
                });
              }
              
              if (data.clerk_user) {
                Logger.info('[Popup] ✅ User found in storage:', data.clerk_user.id);
                // Update UI immediately from storage
                await updateAuthUI();
                
                // Then sync with Clerk if auth object exists
                if (auth) {
                  try {
                    await auth.checkUserSession();
                    await updateAuthUI();
                  } catch (e) {
                    Logger.warn('[Popup] Error syncing with Clerk, but UI updated from storage:', e);
                  }
                }
                
                // Stop periodic checking if we're now authenticated
                if (authCheckInterval) {
                  clearInterval(authCheckInterval);
                  authCheckInterval = null;
                }
                
                // Clear OAuth error if authentication succeeded
                await clearOAuthError();
              } else {
                // No storage yet, try to reload auth state
                Logger.warn('[Popup] ⚠️ No storage found after callback - checking auth state...');
                if (auth) {
                  auth.checkUserSession().then(async () => {
                    // Clear OAuth error if authentication succeeded
                    await clearOAuthError();
                    updateAuthUI();
                    // Stop periodic checking if we're now authenticated
                    if (authCheckInterval) {
                      clearInterval(authCheckInterval);
                      authCheckInterval = null;
                    }
                  });
                }
              }
            });
            
            // Return true to indicate we'll respond asynchronously
            return true;
          } else if (request.type === 'AUTH_ERROR') {
            // Handle auth errors from background/service worker
            Logger.error('[Popup] Auth error received:', request.error);
            if (errorHandler) {
              // Check if it's an OAuth redirect URI mismatch error
              if (request.errorType === 'AUTH_OAUTH_REDIRECT_URI_MISMATCH' || 
                  request.error === 'redirect_uri_mismatch' ||
                  (request.errorDescription && request.errorDescription.includes('redirect_uri_mismatch'))) {
                errorHandler.showError('AUTH_OAUTH_REDIRECT_URI_MISMATCH', {
                  errorDescription: request.errorDescription,
                  docsUrl: 'docs/guides/OAUTH_CONFIGURATION.md'
                });
              } else {
                errorHandler.showError('AUTH_SIGN_UP_FAILED');
              }
            } else {
              showFallbackError('Authentication error occurred.');
            }
          }
        });
      } else {
        Logger.warn('[Popup] Chrome runtime API not available - message listener not registered');
      }

      // Listen for storage changes (e.g., when auth is detected by content script)
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes, areaName) => {
          if (areaName === 'local' && changes.clerk_user) {
            Logger.info('[Popup] 🔔 Clerk user storage changed!', {
              oldValue: changes.clerk_user.oldValue ? 'had user' : 'no user',
              newValue: changes.clerk_user.newValue ? 'has user' : 'no user',
              userId: changes.clerk_user.newValue?.id
            });
            Logger.info('[Popup] Storage changed', { clerk_user: changes.clerk_user });
            
            if (auth) {
              auth.checkUserSession().then(() => {
                updateAuthUI();
                // Stop periodic checking if we're now authenticated
                if (authCheckInterval) {
                  clearInterval(authCheckInterval);
                  authCheckInterval = null;
                }
              });
            } else {
              // If auth not initialized, update UI directly from storage
              Logger.info('[Popup] Auth not initialized, updating UI directly from storage');
              updateAuthUI();
            }
          }
        });
      }
    } catch (err) {
      Logger.error('Auth initialization error', err);
      if (errorHandler) {
        errorHandler.showError('AUTH_NOT_CONFIGURED');
      } else {
        showFallbackError('Authentication initialization failed.');
      }
      // Show diagnostic panel on error
      showDiagnosticPanel();
    }
    
    // Set up periodic auth check AFTER auth is initialized
    // This handles cases where user signs in in another tab
    setupPeriodicAuthCheck();
  }

  /**
   * Set up periodic authentication check
   * This runs after auth is initialized to detect when users sign in via another tab
   */
  function setupPeriodicAuthCheck() {
    // Clear any existing interval first
    if (authCheckInterval) {
      clearInterval(authCheckInterval);
      authCheckInterval = null;
    }
    
    // Only set up interval if auth is initialized and user is not authenticated
    if (auth && !auth.isAuthenticated()) {
      Logger.info('[Popup] Setting up periodic auth check interval');
      authCheckInterval = setInterval(async () => {
        if (auth) {
          try {
            await auth.checkUserSession();
            if (auth.isAuthenticated()) {
              Logger.info('[Popup] Authentication detected via periodic check - updating UI');
              await updateAuthUI();
              // Clear interval once authenticated
              if (authCheckInterval) {
                clearInterval(authCheckInterval);
                authCheckInterval = null;
                Logger.info('[Popup] Periodic auth check interval cleared - user is authenticated');
              }
            }
          } catch (err) {
            Logger.warn('[Popup] Error during periodic auth check:', err);
          }
        } else {
          // Auth object no longer exists, clear interval
          if (authCheckInterval) {
            clearInterval(authCheckInterval);
            authCheckInterval = null;
          }
        }
      }, 2000); // Check every 2 seconds
    } else {
      Logger.info('[Popup] Skipping periodic auth check setup:', {
        hasAuth: !!auth,
        isAuthenticated: auth ? auth.isAuthenticated() : false
      });
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
    Logger.info('[Popup] updateAuthUI() called');
    
    // ALWAYS check storage first, regardless of auth object state
    Logger.info('[Popup] Checking storage for user...');
    const storedUser = await new Promise((resolve) => {
      chrome.storage.local.get(['clerk_user'], (data) => {
        resolve(data.clerk_user || null);
      });
    });
    
    const hasStoredUser = !!storedUser;
    Logger.info('[Popup] Storage check result:', { 
      hasStoredUser, 
      userId: storedUser?.id,
      email: storedUser?.email,
      authExists: !!auth,
      authInitialized: auth?.isInitialized,
      authUser: auth?.user ? auth.user.id : null
    });
    
    // If we have stored user but auth object doesn't have it, update auth object
    if (hasStoredUser && auth && (!auth.user || auth.user.id !== storedUser.id)) {
      Logger.info('[Popup] Stored user found but auth object missing it - updating auth object');
      try {
        if (!auth.isInitialized) {
          await auth.initialize();
        }
        await auth.checkUserSession();
      } catch (e) {
        Logger.warn('[Popup] Failed to sync stored user to auth object:', e);
      }
    }
    
    if (!auth && !hasStoredUser) {
      Logger.warn('[Popup] No auth object and no stored user');
      return;
    }

    // If dev UI is disabled, do not show any auth controls at all
    const isDevUI = typeof SHOW_DEV_UI !== 'undefined' && (SHOW_DEV_UI || window.__AIG_SHOW_DEV_UI === true);
    const userProfile = document.getElementById('userProfile');
    const authButtons = document.getElementById('authButtons');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const mainContent = document.querySelector('.main-content');
    const analysisSection = document.getElementById('analysisSection');

    // Check if authenticated (either via auth object or storage)
    const isAuth = auth ? auth.isAuthenticated() : hasStoredUser;

    // Check for OAuth errors and display them if not authenticated
    if (!isAuth) {
      await checkAndDisplayOAuthErrors();
    } else {
      // Clear OAuth error if user is authenticated
      await clearOAuthError();
    }

    // In non-dev mode, hide all auth UI regardless of auth state, but still allow
    // backend + Clerk auto-config to function behind the scenes.
    if (!isDevUI) {
      if (userProfile) userProfile.style.display = 'none';
      if (authButtons) authButtons.style.display = 'none';
      // Main content visibility is handled elsewhere; nothing to do here.
      return;
    }
    
    if (isAuth) {
      // Get user data - from auth object if available, otherwise from storage
      let user = null;
      let avatarUrl = null;
      let displayName = null;
      
      if (auth && auth.isAuthenticated()) {
        user = auth.getCurrentUser();
        avatarUrl = auth.getUserAvatar();
        displayName = auth.getUserDisplayName();
      } else if (hasStoredUser) {
        // Get user from storage directly
        const storedUser = await new Promise((resolve) => {
          chrome.storage.local.get(['clerk_user'], (data) => {
            resolve(data.clerk_user || null);
          });
        });
        if (storedUser) {
          user = storedUser;
          avatarUrl = storedUser.imageUrl || null;
          const firstName = storedUser.firstName || '';
          const lastName = storedUser.lastName || '';
          const email = storedUser.email || '';
          displayName = (firstName && lastName) ? `${firstName} ${lastName}` : (firstName || lastName || email || 'User');
        }
      }

      if (userAvatar) {
        // Clear any existing content
        while (userAvatar.firstChild) {
          userAvatar.removeChild(userAvatar.firstChild);
        }

        if (avatarUrl) {
          // Create avatar image element safely without using innerHTML
          const img = document.createElement('img');
          img.src = avatarUrl;
          img.alt = 'User Avatar';
          userAvatar.appendChild(img);
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
      
      // Show main content (contains status section and guard services - should be visible to all)
      // Only hide analysis section when not authenticated
      if (mainContent) {
        mainContent.style.display = 'block';
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
      // Clear any existing content
      while (authSection.firstChild) {
        authSection.removeChild(authSection.firstChild);
      }

      // Build message safely without using innerHTML
      const wrapper = document.createElement('div');
      wrapper.style.textAlign = 'center';
      wrapper.style.color = 'rgba(249, 249, 249, 0.7)';
      wrapper.style.fontSize = '12px';

      wrapper.appendChild(document.createTextNode('Authentication not configured.'));
      wrapper.appendChild(document.createElement('br'));
      wrapper.appendChild(document.createTextNode('Add Clerk publishable key in settings.'));

      authSection.appendChild(wrapper);
    }
  }

  /**
   * Set up event listeners with proper cleanup tracking
   * CRITICAL: This must be called early and must not fail
   */
  function setupEventListeners() {
    Logger.info('[Popup] Setting up event listeners');
    
    // Analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
      Logger.info('[Popup] Found analyzeBtn, attaching listener');
      const clickHandler = async () => {
        try {
          await triggerAnalysis();
        } catch (err) {
          Logger.error('Failed to trigger analysis', err);
          if (errorHandler) {
            errorHandler.showError('ANALYSIS_FAILED');
          } else {
            showFallbackError('Analysis failed. Please try again.');
          }
        }
      };
      
      analyzeBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: analyzeBtn, event: 'click', handler: clickHandler });
      console.log('[Popup] Analyze button listener attached');
    } else {
      console.error('[Popup] ERROR: analyzeBtn not found in DOM!');
    }

    // Settings link in footer
    const settingsLink = document.getElementById('settingsLink');
    if (settingsLink) {
      console.log('[Popup] Found settingsLink, attaching listener');
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
      console.log('[Popup] Settings link listener attached');
    } else {
      console.warn('[Popup] settingsLink not found in DOM');
    }


    // Refresh subscription button
    const refreshSubscriptionBtn = document.getElementById('refreshSubscriptionBtn');
    if (refreshSubscriptionBtn) {
      console.log('[Popup] Found refreshSubscriptionBtn, attaching listener');
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
          if (errorHandler) {
            errorHandler.showError('CONNECTION_FAILED');
          } else {
            showFallbackError('Failed to refresh subscription. Please try again.');
          }
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
          const upgradeUrl = baseUrl ? `${baseUrl}/subscribe` : 'https://www.aiguardian.ai/subscribe';

          chrome.tabs.create({ url: upgradeUrl });
          window.close();
        } catch (err) {
          Logger.error('Failed to open upgrade page', err);
          if (errorHandler) {
            errorHandler.showError('NETWORK_ERROR');
          } else {
            showFallbackError('Failed to open upgrade page. Please check your connection.');
          }
        }
      };

      upgradeBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: upgradeBtn, event: 'click', handler: clickHandler });
    }

    // Unified auth CTA button (sign in / sign up)
    const authCtaBtn = document.getElementById('authCtaBtn');
    // Hide auth CTA entirely when dev UI is disabled
    const isDevUI = typeof SHOW_DEV_UI !== 'undefined' && (SHOW_DEV_UI || window.__AIG_SHOW_DEV_UI === true);
    if (!isDevUI && authCtaBtn) {
      authCtaBtn.style.display = 'none';
    }
    if (authCtaBtn && isDevUI) {
      console.log('[Popup] Found authCtaBtn, attaching listener');
      const clickHandler = async () => {
        try {
          // Instead of driving Clerk directly from the extension, open the
          // AiGuardian landing page, which already hosts the Clerk login.
          // The content script running on that page will detect the Clerk
          // session (via CLERK_AUTH_DETECTED) and sync auth state back to
          // the extension.
          const landingUrl = 'https://www.aiguardian.ai';

          if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
            chrome.tabs.create({ url: landingUrl });
            Logger.info('[Popup] Opened landing page for sign-in:', landingUrl);
          } else {
            // Fallback for non-extension contexts
            window.open(landingUrl, '_blank');
          }

          // Close popup after opening landing page
          window.close();
        } catch (err) {
          Logger.error('[Popup] Auth CTA (landing link) failed', err);
          if (errorHandler) {
            errorHandler.showError('AUTH_SIGN_IN_FAILED');
          } else {
            showFallbackError('Failed to open AiGuardian site. Please try again.');
          }
        }
      };

      authCtaBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: authCtaBtn, event: 'click', handler: clickHandler });
      console.log('[Popup] Auth CTA button listener attached');
    } else {
      console.warn('[Popup] authCtaBtn not found in DOM');
    }
    
    // Clean up interval when popup closes
    const beforeUnloadHandler = () => {
      if (authCheckInterval) {
        clearInterval(authCheckInterval);
      }
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    eventListeners.push({ element: window, event: 'beforeunload', handler: beforeUnloadHandler });

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
            if (errorHandler) {
              errorHandler.showError('AUTH_NOT_CONFIGURED');
            } else {
              showFallbackError('Authentication not configured.');
            }
          }
        } catch (err) {
          console.error('Failed to sign out', err);
          if (errorHandler) {
            errorHandler.showError('AUTH_SIGN_IN_FAILED'); // Using same error type since it's auth-related
          } else {
            showFallbackError('Sign out failed. Please try again.');
          }
        }
      };

      signOutBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: signOutBtn, event: 'click', handler: clickHandler });
      console.log('[Popup] Sign Out button listener attached');
    } else {
      console.warn('[Popup] signOutBtn not found in DOM (may be hidden)');
    }

    // Status button - show diagnostic panel
    const toggleStatusBtn = document.getElementById('toggleStatusBtn');
    if (toggleStatusBtn) {
      const clickHandler = () => {
        try {
          showDiagnosticPanel();
          Logger.info('[Popup] Diagnostic panel opened via Status button');
        } catch (err) {
          Logger.error('[Popup] Failed to show diagnostic panel', err);
          showFallbackError('Failed to open diagnostic panel. Please try again.');
        }
      };
      
      toggleStatusBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: toggleStatusBtn, event: 'click', handler: clickHandler });
      Logger.info('[Popup] Status button listener attached (shows diagnostic panel)');
    } else {
      Logger.warn('[Popup] toggleStatusBtn not found in DOM');
    }

    // OAuth error banner handlers
    const closeOAuthErrorBtn = document.getElementById('closeOAuthError');
    if (closeOAuthErrorBtn) {
      Logger.info('[Popup] Found closeOAuthErrorBtn, attaching listener');
      const clickHandler = async () => {
        try {
          await clearOAuthError();
        } catch (err) {
          Logger.error('Failed to clear OAuth error', err);
        }
      };
      closeOAuthErrorBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: closeOAuthErrorBtn, event: 'click', handler: clickHandler });
    }

    const viewOAuthDocsBtn = document.getElementById('viewOAuthDocs');
    if (viewOAuthDocsBtn) {
      Logger.info('[Popup] Found viewOAuthDocsBtn, attaching listener');
      const clickHandler = () => {
        try {
          chrome.tabs.create({ 
            url: 'https://github.com/aiguardian/chrome-extension/blob/main/docs/guides/OAUTH_CONFIGURATION.md' 
          });
        } catch (err) {
          Logger.error('Failed to open OAuth docs', err);
        }
      };
      viewOAuthDocsBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: viewOAuthDocsBtn, event: 'click', handler: clickHandler });
    }

    const openOAuthSettingsBtn = document.getElementById('openOAuthSettings');
    if (openOAuthSettingsBtn) {
      Logger.info('[Popup] Found openOAuthSettingsBtn, attaching listener');
      const clickHandler = async () => {
        try {
          await chrome.runtime.openOptionsPage();
          Logger.info('Opened options page from OAuth error banner');
          window.close();
        } catch (err) {
          Logger.error('Failed to open options from OAuth error banner', err);
        }
      };
      openOAuthSettingsBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: openOAuthSettingsBtn, event: 'click', handler: clickHandler });
    }

    const closeDiagnosticBtn = document.getElementById('closeDiagnostic');
    if (closeDiagnosticBtn) {
      const clickHandler = () => {
        hideDiagnosticPanel();
      };
      closeDiagnosticBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: closeDiagnosticBtn, event: 'click', handler: clickHandler });
    }

    const refreshDiagnosticBtn = document.getElementById('refreshDiagnostic');
    if (refreshDiagnosticBtn) {
      const clickHandler = async () => {
        console.log('[Popup] Refresh diagnostic button clicked');
        try {
          await runDiagnostics();
          console.log('[Popup] Diagnostics refresh completed');
        } catch (err) {
          console.error('[Popup] Error refreshing diagnostics:', err);
        }
      };
      refreshDiagnosticBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: refreshDiagnosticBtn, event: 'click', handler: clickHandler });
    }

    const openSettingsFromDiagnosticBtn = document.getElementById('openSettingsFromDiagnostic');
    if (openSettingsFromDiagnosticBtn) {
      const clickHandler = async () => {
        try {
          await chrome.runtime.openOptionsPage();
          window.close();
        } catch (err) {
          Logger.error('Failed to open options from diagnostic', err);
        }
      };
      openSettingsFromDiagnosticBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: openSettingsFromDiagnosticBtn, event: 'click', handler: clickHandler });
      console.log('[Popup] Open Settings From Diagnostic button listener attached');
    } else {
      console.warn('[Popup] openSettingsFromDiagnosticBtn not found in DOM');
    }
    
    console.log(`[Popup] Event listeners setup complete. Total listeners: ${eventListeners.length}`);
  }

  /**
   * Load system status from background script
   */
  async function loadSystemStatus() {
    try {
      const response = await sendMessageToBackground('GET_GUARD_STATUS');
      if (response.success) {
        await updateSystemStatus(response.status);
      } else {
        // Include error information if available
        await updateSystemStatus({ 
          gateway_connected: false,
          error: response.error || 'Unknown error'
        });
      }
    } catch (err) {
      Logger.error('Failed to load system status', err);
      // Include error message for better diagnostics
      await updateSystemStatus({ 
        gateway_connected: false,
        error: err.message || 'Failed to load status'
      });
    }
  }

  /**
   * Update system status display
   */
  async function updateSystemStatus(status) {
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
      
      // Check if gateway URL is configured
      const configData = await new Promise((resolve) => {
        chrome.storage.sync.get(['gateway_url'], (data) => {
          resolve(data.gateway_url || null);
        });
      });
      
      if (!configData) {
        details.textContent = 'Gateway not configured - open settings to configure';
      } else {
        // Check if it's a network error or configuration issue
        const errorMsg = status.error || '';
        if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('network') || errorMsg.includes('ERR_')) {
          details.textContent = 'Network error - check internet connection';
        } else if (errorMsg.includes('timeout') || errorMsg.includes('Timeout') || errorMsg.includes('aborted')) {
          details.textContent = 'Connection timeout - backend may be slow or unreachable';
        } else if (errorMsg.includes('Gateway URL not configured') || errorMsg.includes('not configured')) {
          details.textContent = 'Gateway not configured - open settings to configure';
        } else if (errorMsg.includes('CORS') || errorMsg.includes('cors')) {
          details.textContent = 'CORS error - check backend configuration';
        } else if (errorMsg) {
          // Show specific error message if available
          details.textContent = `Connection failed: ${errorMsg.substring(0, 50)}`;
        } else {
          details.textContent = 'Connection failed - click Status to diagnose';
        }
      }
      
      if (serviceStatus) {
        serviceStatus.className = 'guard-status disabled';
      }
      
      // Make status section clickable to open diagnostics when there's an error
      const statusSection = document.querySelector('.status-section');
      if (statusSection && !statusSection.hasAttribute('data-error-click-handler')) {
        statusSection.setAttribute('data-error-click-handler', 'true');
        statusSection.style.cursor = 'pointer';
        statusSection.addEventListener('click', () => {
          if (currentStatus === 'error') {
            showDiagnosticPanel();
          }
        });
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

    // For free tier, hide the subscription card unless the user is close to limits
    const isFreeTier = !subscription.tier || subscription.tier === 'free' || subscription.tier.toUpperCase() === 'FREE';
    const usagePct = usage && typeof usage.usage_percentage === 'number' ? usage.usage_percentage : null;
    if (isFreeTier && (usagePct === null || usagePct < 80)) {
      section.style.display = 'none';
      return;
    }

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
    const statusLine = document.getElementById('analysisStatusLine');

    // Check authentication first
    if (!auth || !auth.isAuthenticated()) {
      const message = 'Please sign in on aiguardian.ai before running analysis.';
      if (statusLine) {
        statusLine.textContent = `Last analysis: failed – ${message}`;
      }
      if (errorHandler) {
        errorHandler.showErrorFromException(new Error(message));
      } else {
        showFallbackError(message);
      }

      // Open landing page for sign-in; content script will detect Clerk auth
      const landingUrl = 'https://www.aiguardian.ai';
      try {
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
          chrome.tabs.create({ url: landingUrl });
        } else {
          window.open(landingUrl, '_blank');
        }
      } catch (e) {
        Logger.warn('[Popup] Failed to open landing page for sign-in', e);
      }

      // Delay closing the popup to allow users to read the error message
      setTimeout(() => {
        window.close();
      }, 2000); // 2 second delay
      return;
    }

    const analyzeBtn = document.getElementById('analyzeBtn');
    const originalText = analyzeBtn ? analyzeBtn.textContent : '';
    
    if (analyzeBtn) {
      analyzeBtn.textContent = '⏳ Analyzing...';
      analyzeBtn.disabled = true;
    }
    if (statusLine) {
      statusLine.textContent = 'Analyzing selected text…';
    }
    
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if tab URL is valid (not chrome:// or extension pages)
      if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://'))) {
        const errorMsg = 'Cannot analyze text on this page. Please navigate to a regular webpage.';
        if (statusLine) {
          statusLine.textContent = `Last analysis: failed – ${errorMsg}`;
        }
        if (errorHandler) {
          errorHandler.showError('ANALYSIS_NO_SELECTION', { customMessage: errorMsg });
        } else {
          showFallbackError(errorMsg);
        }
        return;
      }
      
      // Send message to content script to analyze selected text
      let response;
      try {
        response = await chrome.tabs.sendMessage(tab.id, {
          type: 'ANALYZE_SELECTION'
        });
      } catch (sendMessageErr) {
        // Check if content script is not loaded
        const errorMsg = sendMessageErr.message || '';
        if (errorMsg.includes('Receiving end does not exist') || 
            errorMsg.includes('Could not establish connection')) {
          Logger.warn('[Popup] Content script not loaded on page:', tab.url);
          const contentScriptError = 'Extension not loaded on this page. Please refresh the page and try again.';
          if (statusLine) {
            statusLine.textContent = `Last analysis: failed – ${contentScriptError}`;
          }
          if (errorHandler) {
            errorHandler.showError('CONTENT_SCRIPT_NOT_LOADED');
          } else {
            showFallbackError(contentScriptError);
          }
          return;
        }
        // Re-throw other errors
        throw sendMessageErr;
      }
      
      if (response && response.success) {
        updateAnalysisResult(response);
        showSuccess('✅ Analysis complete!');
        if (statusLine) {
          const scoreText = typeof response.score === 'number' ? ` (score: ${response.score.toFixed(2)})` : '';
          statusLine.textContent = `Last analysis: success${scoreText}`;
        }
        Logger.info('Analysis completed successfully');
      } else {
        const errorMessage = response && response.error
          ? response.error
          : 'Please select some text on the page to analyze.';

        if (statusLine) {
          statusLine.textContent = `Last analysis: failed – ${errorMessage}`;
        }

        if (errorHandler) {
          // Surface the actual error when we have one (e.g. auth required)
          if (response && response.error) {
            errorHandler.showErrorFromException(new Error(errorMessage));
          } else {
            errorHandler.showError('ANALYSIS_NO_SELECTION');
          }
        } else {
          showFallbackError(errorMessage);
        }
      }
    } catch (err) {
      console.error('Failed to trigger analysis', err);
      // Check if it's a content script error
      const errorMsg = err.message || '';
      if (errorMsg.includes('Receiving end does not exist') || 
          errorMsg.includes('Could not establish connection')) {
        if (errorHandler) {
          errorHandler.showError('CONTENT_SCRIPT_NOT_LOADED');
        } else {
          showFallbackError('Extension not loaded on this page. Please refresh the page and try again.');
        }
      } else {
        if (errorHandler) {
          errorHandler.showErrorFromException(err);
        } else {
          showFallbackError('Analysis failed: ' + (err.message || 'Unknown error'));
        }
      }
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
   * Send message to background script with timeout
   */
  function sendMessageToBackground(type, payload = null, timeout = 10000) {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({ success: false, error: 'Timeout - background script not responding' });
      }, timeout);

      try {
        chrome.runtime.sendMessage({ type, payload }, (response) => {
          clearTimeout(timeoutId);
          if (chrome.runtime.lastError) {
            Logger.error('Message to background failed:', chrome.runtime.lastError.message);
            resolve({ success: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(response || { success: false, error: 'No response' });
          }
        });
      } catch (err) {
        clearTimeout(timeoutId);
        Logger.error('Failed to send message to background:', err);
        resolve({ success: false, error: err.message });
      }
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

  /**
   * Show diagnostic panel
   */
  function showDiagnosticPanel() {
    const panel = document.getElementById('diagnosticPanel');
    if (panel) {
      panel.style.display = 'block';
      runDiagnostics();
    }
  }

  /**
   * Hide diagnostic panel
   */
  function hideDiagnosticPanel() {
    const panel = document.getElementById('diagnosticPanel');
    if (panel) {
      panel.style.display = 'none';
    }
  }

  /**
   * Check for issues and auto-show diagnostic panel if problems found
   */
  async function checkForIssues() {
    try {
      // Check backend connection
      const backendResponse = await sendMessageToBackground('TEST_GATEWAY_CONNECTION');
      const backendOk = backendResponse && backendResponse.success;

      // Check Clerk key
      const syncData = await new Promise(resolve => {
        chrome.storage.sync.get(['clerk_publishable_key'], resolve);
      });
      let clerkKeyOk = !!syncData.clerk_publishable_key;
      
      if (!clerkKeyOk) {
        // Try fetching from backend
        try {
          const auth = new AiGuardianAuth();
          const settings = await auth.getSettings();
          clerkKeyOk = !!settings.clerk_publishable_key;
        } catch (e) {
          // Ignore errors
        }
      }

      // Check auth state
      const localData = await new Promise(resolve => {
        chrome.storage.local.get(['clerk_user'], resolve);
      });
      const authOk = !!localData.clerk_user || (auth && auth.isAuthenticated());

      // Show diagnostic panel if any issues found
      if (!backendOk || !clerkKeyOk || !authOk) {
        showDiagnosticPanel();
      }
    } catch (err) {
      Logger.error('Issue check failed', err);
      // Show diagnostic panel on error
      showDiagnosticPanel();
    }
  }

  /**
   * Run comprehensive diagnostics
   */
  async function runDiagnostics() {
    console.log('[Diagnostics] runDiagnostics() called');
    const backendStatusEl = document.getElementById('backendStatus');
    const clerkKeyStatusEl = document.getElementById('clerkKeyStatus');
    const authStateStatusEl = document.getElementById('authStateStatus');

    if (!backendStatusEl || !clerkKeyStatusEl || !authStateStatusEl) {
      console.error('[Diagnostics] Diagnostic elements not found:', {
        backendStatusEl: !!backendStatusEl,
        clerkKeyStatusEl: !!clerkKeyStatusEl,
        authStateStatusEl: !!authStateStatusEl
      });
      Logger.error('Diagnostic elements not found');
      return;
    }

    Logger.info('[Diagnostics] Starting diagnostic checks...');
    console.log('[Diagnostics] All elements found, starting checks...');

    // Check backend connection (with timeout and direct fallback)
    backendStatusEl.textContent = 'Checking...';
    backendStatusEl.className = 'diagnostic-value';
    try {
      Logger.info('[Diagnostics] Checking backend connection...');
      
      // First try via background script
      let response = null;
      try {
        response = await Promise.race([
          sendMessageToBackground('TEST_GATEWAY_CONNECTION', null, 3000),
          new Promise((resolve) => setTimeout(() => resolve({ success: false, error: 'Timeout' }), 3000))
        ]);
      } catch (bgErr) {
        Logger.warn('[Diagnostics] Background script check failed, trying direct:', bgErr);
      }
      
      // If background script didn't work, try direct connection test
      if (!response || !response.success) {
        Logger.info('[Diagnostics] Trying direct backend connection test...');
        try {
          const gatewayUrl = await new Promise(resolve => {
            chrome.storage.sync.get(['gateway_url'], (data) => {
              resolve(data.gateway_url || 'https://api.aiguardian.ai');
            });
          });
          
          const healthUrl = gatewayUrl.replace(/\/$/, '') + '/health/live';
          const directResponse = await Promise.race([
            fetch(healthUrl, {
              method: 'GET',
              headers: { 'X-Extension-Version': chrome.runtime.getManifest().version }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
          ]);
          
          if (directResponse && directResponse.ok) {
            response = { success: true };
          } else {
            response = { success: false, error: `HTTP ${directResponse.status}` };
          }
        } catch (directErr) {
          Logger.error('[Diagnostics] Direct connection test failed:', directErr);
          response = { success: false, error: directErr.message || 'Connection failed' };
        }
      }
      
      Logger.info('[Diagnostics] Backend response:', response);
      
      if (response && response.success) {
        backendStatusEl.textContent = '✅ Connected';
        backendStatusEl.className = 'diagnostic-value status-ok';
      } else {
        const errorMsg = response?.error || 'Unknown error';
        const displayMsg = errorMsg.includes('Timeout') ? 'Timeout' : 
                          errorMsg.includes('Failed to fetch') ? 'Network error' :
                          errorMsg.includes('not responding') ? 'Background error' :
                          'Disconnected';
        backendStatusEl.textContent = `❌ ${displayMsg}`;
        backendStatusEl.className = 'diagnostic-value status-error';
      }
    } catch (err) {
      backendStatusEl.textContent = '❌ Error';
      backendStatusEl.className = 'diagnostic-value status-error';
      Logger.error('[Diagnostics] Backend check failed', err);
    }

    // Check Clerk key - automatically fetch from backend
    clerkKeyStatusEl.textContent = 'Checking...';
    clerkKeyStatusEl.className = 'diagnostic-value';
    
    // Use setTimeout to ensure UI updates immediately
    setTimeout(async () => {
      try {
        Logger.info('[Diagnostics] Checking Clerk key...');
        
        // First check if we already have it in storage
        const syncData = await new Promise((resolve) => {
          chrome.storage.sync.get(['clerk_publishable_key', 'clerk_key_source'], (data) => {
            resolve(data || {});
          });
        });
        
        Logger.info('[Diagnostics] Clerk key data from storage:', { 
          hasKey: !!syncData.clerk_publishable_key,
          source: syncData.clerk_key_source 
        });
        
        if (syncData.clerk_publishable_key) {
          const source = syncData.clerk_key_source === 'backend_api' ? 'Auto' : 'Manual';
          clerkKeyStatusEl.textContent = `✅ Configured (${source})`;
          clerkKeyStatusEl.className = 'diagnostic-value status-ok';
        } else {
          // Automatically fetch from backend
          Logger.info('[Diagnostics] Automatically fetching Clerk key from backend...');
          try {
            const auth = new AiGuardianAuth();
            const settings = await auth.getSettings();
            
            Logger.info('[Diagnostics] getSettings() returned:', {
              hasKey: !!settings.clerk_publishable_key,
              source: settings.source,
              error: settings.error,
              fullSettings: settings
            });
            
            if (settings && settings.clerk_publishable_key) {
              clerkKeyStatusEl.textContent = '✅ Auto-configured';
              clerkKeyStatusEl.className = 'diagnostic-value status-ok';
            } else if (settings && settings.error) {
              // Show specific error message
              const errorMsg = typeof settings.error === 'string' 
                ? settings.error 
                : (settings.error.error || settings.error.message || 'Unknown error');
              clerkKeyStatusEl.textContent = `❌ ${errorMsg}`;
              clerkKeyStatusEl.className = 'diagnostic-value status-error';
              Logger.warn('[Diagnostics] Backend fetch failed:', settings.error);
            } else {
              // No error object, but also no key - show generic message with debug info
              const debugInfo = settings ? ` (source: ${settings.source || 'unknown'})` : '';
              clerkKeyStatusEl.textContent = `❌ Not configured${debugInfo}`;
              clerkKeyStatusEl.className = 'diagnostic-value status-error';
              Logger.warn('[Diagnostics] No key and no error object:', settings);
            }
          } catch (e) {
            Logger.error('[Diagnostics] Failed to fetch from backend:', e);
            const errorMsg = e.message || 'Failed to fetch';
            clerkKeyStatusEl.textContent = `❌ ${errorMsg}`;
            clerkKeyStatusEl.className = 'diagnostic-value status-error';
          }
        }
      } catch (err) {
        clerkKeyStatusEl.textContent = '❌ Error';
        clerkKeyStatusEl.className = 'diagnostic-value status-error';
        Logger.error('[Diagnostics] Clerk key check failed', err);
      }
    }, 0);

    // Check auth state (synchronous - should be fast)
    authStateStatusEl.textContent = 'Checking...';
    authStateStatusEl.className = 'diagnostic-value';
    console.log('[Diagnostics] Starting auth state check...');
    
    // Remove setTimeout and run directly
    try {
      Logger.info('[Diagnostics] Checking auth state...');
      const localData = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_user', 'clerk_token'], (data) => {
          resolve(data || {});
        });
      });

      Logger.info('[Diagnostics] Auth data:', { 
        hasUser: !!localData.clerk_user,
        hasToken: !!localData.clerk_token 
      });
      console.log('[Diagnostics] Auth data from storage:', {
        hasUser: !!localData.clerk_user,
        hasToken: !!localData.clerk_token,
        userId: localData.clerk_user?.id,
        email: localData.clerk_user?.email,
        authObjectExists: !!auth,
        authIsAuthenticated: auth?.isAuthenticated?.()
      });

      if (localData.clerk_user) {
        const email = localData.clerk_user.email || 'User';
        authStateStatusEl.textContent = `✅ Signed in (${email.substring(0, 20)}...)`;
        authStateStatusEl.className = 'diagnostic-value status-ok';
        console.log('[Diagnostics] ✅ Auth state updated: Signed in');
      } else if (auth && auth.isAuthenticated()) {
        const user = auth.getCurrentUser();
        const email = user?.email || user?.primaryEmailAddress?.emailAddress || 'User';
        authStateStatusEl.textContent = `✅ Signed in (${email.substring(0, 20)}...)`;
        authStateStatusEl.className = 'diagnostic-value status-ok';
        console.log('[Diagnostics] ✅ Auth state updated: Signed in (from auth object)');
      } else {
        authStateStatusEl.textContent = '⚠️ Not signed in';
        authStateStatusEl.className = 'diagnostic-value status-warning';
        console.log('[Diagnostics] ⚠️ Auth state updated: Not signed in');
      }
    } catch (err) {
      authStateStatusEl.textContent = '❌ Error';
      authStateStatusEl.className = 'diagnostic-value status-error';
      Logger.error('[Diagnostics] Auth state check failed', err);
      console.error('[Diagnostics] ❌ Auth state check error:', err);
    }

    Logger.info('[Diagnostics] Diagnostic checks completed');
  }

  // Cleanup on popup close
  window.addEventListener('beforeunload', cleanupEventListeners);

})();

