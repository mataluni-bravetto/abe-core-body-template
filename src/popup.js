/**
 * Popup Script for AiGuardian Chrome Extension
 *
 * Enhanced popup with real-time status, unified service, and analysis results
 */

(function () {
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
        // Load last analysis score on initialization
        await loadLastAnalysis();
      } catch (err) {
        Logger.error('Status loading failed (non-critical)', err);
      }

      // Set up unified storage listener for auth state and analysis updates
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
          // Handle auth state changes
          if (changes.clerk_user || changes.clerk_token) {
            Logger.info('[Popup] Auth state changed in storage, refreshing UI...');
            updateAuthUI().catch((err) => {
              Logger.error('[Popup] Failed to update auth UI after storage change:', err);
            });
          }
          
          // Handle last_analysis changes to update popup automatically
          if (changes.last_analysis) {
            Logger.info('[Popup] Last analysis changed in storage, updating UI...', {
              hasNewValue: !!changes.last_analysis.newValue,
              hasOldValue: !!changes.last_analysis.oldValue,
              newScore: changes.last_analysis.newValue?.score,
              newSuccess: changes.last_analysis.newValue?.success,
            });
            
            const newAnalysis = changes.last_analysis.newValue;
            // Check if analysis is valid: has score and success !== false (handles undefined as success)
            if (newAnalysis && 
                newAnalysis.score !== undefined && 
                newAnalysis.score !== null &&
                newAnalysis.success !== false) {
              // Convert minimalAnalysis format to full result format for updateAnalysisResult
              const result = {
                success: true, // Always true if we got here (success !== false)
                score: newAnalysis.score,
                analysis: newAnalysis.summary ? { summary: newAnalysis.summary } : {},
                timestamp: newAnalysis.timestamp,
              };
              Logger.info('[Popup] Updating analysis result from storage:', {
                score: result.score,
                hasSummary: !!result.analysis.summary,
                timestamp: result.timestamp,
              });
              updateAnalysisResult(result);
            } else {
              Logger.debug('[Popup] Skipping invalid or failed analysis update:', {
                hasAnalysis: !!newAnalysis,
                score: newAnalysis?.score,
                success: newAnalysis?.success,
              });
            }
          }
        }
      });

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

    // Auth section should ALWAYS be visible - users need to sign in
    // Don't hide auth UI - it's required for production functionality
    try {
      const authSection = document.getElementById('authSection');
      if (authSection) {
        // Ensure auth section is visible
        authSection.style.display = '';
        Logger.info('[Popup] Auth section visible');
      }
    } catch (e) {
      Logger.warn('[Popup] Failed to ensure auth section visibility', e);
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
        showError: function (type) {
          Logger.error('Error', type);
          showFallbackError('An error occurred: ' + type);
        },
        showErrorFromException: function (err) {
          Logger.error('Exception', err);
          showFallbackError('An error occurred: ' + (err.message || 'Unknown error'));
        },
        showLegacyError: function (message) {
          Logger.error('Legacy error', message);
          showFallbackError(message);
        },
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
        showError: function (type) {
          Logger.error('Error', type);
          showFallbackError('An error occurred: ' + type);
        },
        showErrorFromException: function (err) {
          Logger.error('Exception', err);
          showFallbackError('An error occurred: ' + (err.message || 'Unknown error'));
        },
        showLegacyError: function (message) {
          Logger.error('Legacy error', message);
          showFallbackError(message);
        },
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
      message.textContent =
        errorData.errorDescription || 'Google OAuth redirect URI is not configured.';
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
              email: data.clerk_user?.email,
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
        
        // CRITICAL: Ensure token is retrieved and stored for service worker access
        if (auth.isAuthenticated()) {
          try {
            const token = await auth.getToken();
            if (token) {
              Logger.info('[Popup] Token refreshed and stored for service worker');
            } else {
              Logger.warn('[Popup] No token available after authentication check');
            }
          } catch (tokenError) {
            Logger.warn('[Popup] Error refreshing token (non-critical):', tokenError.message);
          }
        }
        
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
        Logger.info(
          '[Popup] Clerk not initialized or not authenticated, checking storage directly...'
        );
        const directStorageCheck = await new Promise((resolve) => {
          chrome.storage.local.get(['clerk_user'], (data) => {
            resolve(data.clerk_user || null);
          });
        });

        if (directStorageCheck) {
          Logger.info(
            '[Popup] Found user in storage but Clerk not initialized - user may have signed in'
          );
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
        } else {
          // No auth found - automatically trigger auth detection on all tabs
          Logger.info('[Popup] No auth found - auto-triggering auth detection on all tabs');
          try {
            const tabs = await chrome.tabs.query({});
            let checkedTabs = 0;
            
            for (const tab of tabs) {
              try {
                await chrome.tabs.sendMessage(tab.id, { type: 'FORCE_CHECK_AUTH' });
                checkedTabs++;
              } catch (e) {
                // Tab might not have content script (expected for chrome:// pages)
              }
            }
            
            Logger.info(`[Popup] Auto-triggered auth detection on ${checkedTabs} tabs`);
            
            // Wait a moment for content scripts to respond, then check storage again
            setTimeout(async () => {
              try {
                const recheck = await new Promise((resolve) => {
                  chrome.storage.local.get(['clerk_user', 'clerk_token'], (data) => {
                    resolve(data);
                  });
                });
                
                if (recheck.clerk_user) {
                  Logger.info('[Popup] ✅ Auth detected after auto-trigger!');
                  await updateAuthUI();
                }
              } catch (err) {
                Logger.error('[Popup] Failed to update auth UI after auto-trigger:', err);
              }
            }, 2000);
          } catch (autoTriggerErr) {
            Logger.warn('[Popup] Auto-trigger auth detection failed (non-critical):', autoTriggerErr);
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
              userId: request.user?.id,
            });

            // Wait a moment for storage to be written (callback page writes first, then sends message)
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Immediately check storage first (fastest)
            chrome.storage.local.get(['clerk_user', 'clerk_token'], async (data) => {
              if (chrome.runtime.lastError) {
                Logger.error(
                  '[Popup] Storage read error in callback handler:',
                  chrome.runtime.lastError
                );
              } else {
                Logger.info('[Popup] Storage check in callback handler:', {
                  hasUser: !!data.clerk_user,
                  hasToken: !!data.clerk_token,
                  userId: data.clerk_user?.id,
                  email: data.clerk_user?.email,
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
                    Logger.warn(
                      '[Popup] Error syncing with Clerk, but UI updated from storage:',
                      e
                    );
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
              if (
                request.errorType === 'AUTH_OAUTH_REDIRECT_URI_MISMATCH' ||
                request.error === 'redirect_uri_mismatch' ||
                (request.errorDescription &&
                  request.errorDescription.includes('redirect_uri_mismatch'))
              ) {
                errorHandler.showError('AUTH_OAUTH_REDIRECT_URI_MISMATCH', {
                  errorDescription: request.errorDescription,
                  docsUrl: 'docs/guides/OAUTH_CONFIGURATION.md',
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

      // NOTE: Storage listener for auth changes is now handled in main initialization (line 65)
      // to avoid duplicate listeners. This ensures single unified listener for all storage changes.
      // The listener at line 65 handles both auth changes and last_analysis updates.
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
        isAuthenticated: auth ? auth.isAuthenticated() : false,
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
    const nameParts = trimmed.split(' ').filter((part) => part.length > 0);

    // If no valid parts, return first character of trimmed string
    if (nameParts.length === 0) {
      return trimmed[0].toUpperCase();
    }

    // Generate initials from valid name parts (max 2 characters)
    const initials = nameParts
      .slice(0, 2) // Take first two parts only
      .map((part) => part[0]) // Get first character of each part
      .filter((char) => char) // Filter out any undefined/null characters
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
      authUser: auth?.user ? auth.user.id : null,
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

    // Auth UI should ALWAYS be visible - users need to sign in
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

    if (isAuth) {
      // CRITICAL: Refresh and store token when user is authenticated
      // This ensures service worker can access the token
      if (auth && auth.isAuthenticated()) {
        try {
          const token = await auth.getToken();
          if (token) {
            Logger.info('[Popup] Token refreshed in updateAuthUI for service worker access');
          } else {
            Logger.warn('[Popup] No token available in updateAuthUI - service worker may fail to authenticate');
          }
        } catch (tokenError) {
          Logger.warn('[Popup] Error refreshing token in updateAuthUI (non-critical):', tokenError.message);
        }
      } else if (hasStoredUser && auth) {
        // User is in storage but auth object might not be initialized - try to get token
        try {
          if (!auth.isInitialized) {
            await auth.initialize();
          }
          const token = await auth.getToken();
          if (token) {
            Logger.info('[Popup] Token retrieved from auth object for stored user');
          }
        } catch (tokenError) {
          Logger.warn('[Popup] Could not get token for stored user:', tokenError.message);
        }
      }
      
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
          displayName =
            firstName && lastName
              ? `${firstName} ${lastName}`
              : firstName || lastName || email || 'User';
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
      
      // Show refresh auth button when not authenticated
      const refreshAuthBtn = document.getElementById('refreshAuthBtn');
      if (refreshAuthBtn) {
        refreshAuthBtn.style.display = 'inline-block';
      }

      // Show main content (contains status section and guard services - should be visible to all)
      // Only hide analysis section when not authenticated
      if (mainContent) {
        mainContent.style.display = 'block';
      }
      if (analysisSection) {
        analysisSection.style.display = 'none';
      }
    }
    
    // Hide refresh auth button when authenticated
    if (isAuth) {
      const refreshAuthBtn = document.getElementById('refreshAuthBtn');
      if (refreshAuthBtn) {
        refreshAuthBtn.style.display = 'none';
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
      Logger.info('[Popup] Analyze button listener attached');
    } else {
      Logger.error('[Popup] ERROR: analyzeBtn not found in DOM!');
    }

    // Settings link in footer
    const settingsLink = document.getElementById('settingsLink');
    if (settingsLink) {
      Logger.info('[Popup] Found settingsLink, attaching listener');
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
      Logger.info('[Popup] Settings link listener attached');
    } else {
      Logger.warn('[Popup] settingsLink not found in DOM');
    }

    // Refresh subscription button
    const refreshSubscriptionBtn = document.getElementById('refreshSubscriptionBtn');
    if (refreshSubscriptionBtn) {
      Logger.info('[Popup] Found refreshSubscriptionBtn, attaching listener');
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
      eventListeners.push({
        element: refreshSubscriptionBtn,
        event: 'click',
        handler: clickHandler,
      });
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
          const upgradeUrl = baseUrl
            ? `${baseUrl}/subscribe`
            : 'https://www.aiguardian.ai/subscribe';

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
    // Sign in/Sign up button - ALWAYS visible and functional
    if (authCtaBtn) {
      Logger.info('[Popup] Found authCtaBtn, attaching listener');
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
      Logger.info('[Popup] Auth CTA button listener attached');

      // Ensure button is visible (show it even if dev UI is disabled)
      authCtaBtn.style.display = '';
    } else {
      Logger.warn('[Popup] authCtaBtn not found in DOM');
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
          Logger.error('Failed to sign out', err);
          if (errorHandler) {
            errorHandler.showError('AUTH_SIGN_IN_FAILED'); // Using same error type since it's auth-related
          } else {
            showFallbackError('Sign out failed. Please try again.');
          }
        }
      };

      signOutBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: signOutBtn, event: 'click', handler: clickHandler });
      Logger.info('[Popup] Sign Out button listener attached');
    } else {
      Logger.warn('[Popup] signOutBtn not found in DOM (may be hidden)');
    }

    // Refresh Auth button - trigger auth detection on all tabs
    const refreshAuthBtn = document.getElementById('refreshAuthBtn');
    if (refreshAuthBtn) {
      const clickHandler = async () => {
        try {
          Logger.info('[Popup] Refresh Auth button clicked - triggering auth detection on all tabs');
          refreshAuthBtn.disabled = true;
          refreshAuthBtn.textContent = '🔄 Checking...';
          
          // Send FORCE_CHECK_AUTH message to all tabs
          const tabs = await chrome.tabs.query({});
          let checkedTabs = 0;
          
          for (const tab of tabs) {
            try {
              await chrome.tabs.sendMessage(tab.id, { type: 'FORCE_CHECK_AUTH' });
              checkedTabs++;
            } catch (e) {
              // Tab might not have content script (e.g., chrome:// pages)
              // This is expected and not an error
            }
          }
          
          Logger.info(`[Popup] Sent FORCE_CHECK_AUTH to ${checkedTabs} tabs`);
          
          // Wait a moment for content scripts to respond
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Refresh auth state
          await initializeAuth();
          await updateAuthUI();
          
          refreshAuthBtn.textContent = '🔄 Refresh Auth';
          refreshAuthBtn.disabled = false;
          
          showSuccess('✅ Auth state refreshed. Please check again.');
        } catch (err) {
          Logger.error('[Popup] Failed to refresh auth', err);
          refreshAuthBtn.textContent = '🔄 Refresh Auth';
          refreshAuthBtn.disabled = false;
          showFallbackError('Failed to refresh auth. Please try again.');
        }
      };

      refreshAuthBtn.addEventListener('click', clickHandler);
      eventListeners.push({ element: refreshAuthBtn, event: 'click', handler: clickHandler });
      Logger.info('[Popup] Refresh Auth button listener attached');
    } else {
      Logger.warn('[Popup] refreshAuthBtn not found in DOM');
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
            url: 'https://github.com/aiguardian/chrome-extension/blob/main/docs/guides/OAUTH_CONFIGURATION.md',
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
        Logger.info('[Popup] Refresh diagnostic button clicked');
        
        // Also trigger auth detection when refreshing diagnostics
        try {
          const tabs = await chrome.tabs.query({});
          for (const tab of tabs) {
            try {
              await chrome.tabs.sendMessage(tab.id, { type: 'FORCE_CHECK_AUTH' });
            } catch (e) {
              // Tab might not have content script (expected)
            }
          }
          Logger.info('[Popup] Triggered auth detection on all tabs during diagnostic refresh');
          
          // Wait a moment for responses
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (authTriggerErr) {
          Logger.warn('[Popup] Failed to trigger auth detection during diagnostic refresh:', authTriggerErr);
        }
        try {
          await runDiagnostics();
          Logger.info('[Popup] Diagnostics refresh completed');
        } catch (err) {
          Logger.error('[Popup] Error refreshing diagnostics:', err);
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
      eventListeners.push({
        element: openSettingsFromDiagnosticBtn,
        event: 'click',
        handler: clickHandler,
      });
      Logger.info('[Popup] Open Settings From Diagnostic button listener attached');
    } else {
      Logger.warn('[Popup] openSettingsFromDiagnosticBtn not found in DOM');
    }

    Logger.info(
      `[Popup] Event listeners setup complete. Total listeners: ${eventListeners.length}`
    );
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
        Logger.warn('[Popup] System status request failed:', response.error);
        await updateSystemStatus({
          gateway_connected: false,
          error: response.error || 'Unknown error',
        });
      }
    } catch (err) {
      Logger.error('Failed to load system status', err);
      // Include error message for better diagnostics
      await updateSystemStatus({
        gateway_connected: false,
        error: err.message || 'Failed to load status',
      });
    }
  }

  /**
   * Load last analysis from storage and display it in popup
   */
  async function loadLastAnalysis() {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(['last_analysis'], (data) => {
          if (chrome.runtime.lastError) {
            Logger.warn('[Popup] Failed to load last analysis:', chrome.runtime.lastError);
            resolve(); // Resolve instead of return to allow await to complete
            return;
          }

          const lastAnalysis = data.last_analysis;
          if (lastAnalysis && lastAnalysis.success !== false && lastAnalysis.score !== undefined) {
            Logger.info('[Popup] ✅ Loading last analysis from storage - score update:', {
              score: lastAnalysis.score,
              success: lastAnalysis.success,
              timestamp: lastAnalysis.timestamp,
              hasSummary: !!lastAnalysis.summary,
              note: 'This score will be displayed in popup UI',
            });

            // Convert minimalAnalysis format to full result format for updateAnalysisResult
            const result = {
              success: true,
              score: lastAnalysis.score,
              analysis: lastAnalysis.summary ? { summary: lastAnalysis.summary } : {},
              timestamp: lastAnalysis.timestamp,
            };

            // Show analysis section if it's hidden
            const analysisSection = document.getElementById('analysisSection');
            if (analysisSection) {
              analysisSection.style.display = 'block';
            }

            updateAnalysisResult(result);
          } else {
            Logger.debug('[Popup] No valid last analysis found in storage');
          }
          resolve(); // Resolve the promise after callback completes
        });
      } catch (err) {
        Logger.error('[Popup] Error loading last analysis:', err);
        reject(err); // Reject on synchronous errors
      }
    });
  }

  /**
   * Update system status display
   */
  async function updateSystemStatus(status) {
    const indicator = document.getElementById('statusIndicator');
    const details = document.getElementById('statusDetails');
    const serviceStatus = document.getElementById('serviceStatus');

    // Handle both 'connected' and 'gateway_connected' field names for compatibility
    const isConnected =
      status.gateway_connected !== undefined
        ? status.gateway_connected
        : status.connected !== undefined
          ? status.connected
          : false;

    if (isConnected) {
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
        if (
          errorMsg.includes('Failed to fetch') ||
          errorMsg.includes('NetworkError') ||
          errorMsg.includes('network') ||
          errorMsg.includes('ERR_')
        ) {
          details.textContent = 'Network error - check internet connection';
        } else if (
          errorMsg.includes('timeout') ||
          errorMsg.includes('Timeout') ||
          errorMsg.includes('aborted')
        ) {
          details.textContent = 'Connection timeout - backend may be slow or unreachable';
        } else if (
          errorMsg.includes('Gateway URL not configured') ||
          errorMsg.includes('not configured')
        ) {
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
      if (response.success && response.status) {
        updateGuardServices(response.status);
      } else {
        // Handle error case
        Logger.warn('Guard status request failed:', response.error);
        updateGuardServices({
          gateway_connected: false,
          error: response.error || 'Failed to get guard status',
        });
      }
    } catch (err) {
      Logger.error('Failed to load guard services', err);
      updateGuardServices({
        gateway_connected: false,
        error: err.message || 'Unknown error',
      });
    }
  }

  /**
   * Update guard services display (unified service)
   */
  function updateGuardServices(status) {
    const serviceStatus = document.getElementById('serviceStatus');
    if (!serviceStatus) {return;}

    // Handle both 'connected' and 'gateway_connected' field names for compatibility
    const isConnected =
      status.gateway_connected !== undefined
        ? status.gateway_connected
        : status.connected !== undefined
          ? status.connected
          : false;

    // Update unified service status
    if (isConnected) {
      serviceStatus.className = 'guard-status';
      serviceStatus.title = 'Guards connected';
    } else {
      serviceStatus.className = 'guard-status disabled';
      const errorMsg = status.error || 'Guards disconnected';
      serviceStatus.title = errorMsg;
      Logger.warn('[Popup] Guard services disconnected:', errorMsg);
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
              clerk_token: localData.clerk_token,
            });
          });
        });
      });

      if (!data.clerk_user || !data.gateway_url) {
        // Hide subscription section if user is not authenticated or gateway not configured
        const section = document.getElementById('subscriptionSection');
        if (section) {section.style.display = 'none';}
        return;
      }

      // Send message to background to get subscription
      const response = await sendMessageToBackground('GET_SUBSCRIPTION_STATUS');

      if (response && response.success && response.subscription) {
        updateSubscriptionStatus(response.subscription, response.usage);
      } else {
        // Hide subscription section if unable to load
        const section = document.getElementById('subscriptionSection');
        if (section) {section.style.display = 'none';}
      }
    } catch (err) {
      Logger.error('Failed to load subscription status', err);
      // Hide subscription section on error
      const section = document.getElementById('subscriptionSection');
      if (section) {section.style.display = 'none';}
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

    if (!section) {return;}

    // For free tier, hide the subscription card unless the user is close to limits
    const isFreeTier =
      !subscription.tier ||
      subscription.tier === 'free' ||
      subscription.tier.toUpperCase() === 'FREE';
    const usagePct =
      usage && typeof usage.usage_percentage === 'number' ? usage.usage_percentage : null;
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
        const remaining =
          usage.remaining_requests !== null ? usage.remaining_requests : 'unlimited';
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
        statusLine.textContent = `❌ ${message}`;
        statusLine.style.color = '#F44336';
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
      analyzeBtn.style.opacity = '0.7';
      analyzeBtn.style.cursor = 'wait';
    }
    if (statusLine) {
      statusLine.textContent = '⏳ Analyzing selected text…';
      statusLine.style.color = '#2196F3';
    }

    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Check if tab URL is valid (not chrome:// or extension pages)
      if (
        tab.url &&
        (tab.url.startsWith('chrome://') ||
          tab.url.startsWith('chrome-extension://') ||
          tab.url.startsWith('edge://'))
      ) {
        const errorMsg = 'Cannot analyze text on this page. Please navigate to a regular webpage.';
        if (statusLine) {
          statusLine.textContent = `❌ ${errorMsg}`;
          statusLine.style.color = '#F44336';
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
          type: 'ANALYZE_SELECTION',
        });
      } catch (sendMessageErr) {
        // Check if content script is not loaded
        const errorMsg = sendMessageErr.message || '';
        if (
          errorMsg.includes('Receiving end does not exist') ||
          errorMsg.includes('Could not establish connection')
        ) {
          Logger.warn('[Popup] Content script not loaded on page:', tab.url);
          const contentScriptError =
            'Extension not loaded on this page. Please refresh the page and try again.';
          if (statusLine) {
            statusLine.textContent = `❌ ${contentScriptError}`;
            statusLine.style.color = '#F44336';
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
        // LOG BACKEND RESPONSE IN POPUP FOR VERIFICATION
        Logger.info('[Popup] ✅ BACKEND RESPONSE IN POPUP', {
          hasResponse: !!response,
          responseKeys: response ? Object.keys(response) : [],
          responseSuccess: response?.success,
          responseScore: response?.score,
          responseAnalysis: response?.analysis,
          fullResponse: response,
        });

        updateAnalysisResult(response);
        showSuccess('✅ Analysis complete!');
        if (statusLine) {
          const scoreText =
            typeof response.score === 'number' ? ` (score: ${response.score.toFixed(2)})` : '';
          statusLine.textContent = `✅ Success${scoreText}`;
          statusLine.style.color = '#4CAF50';
        }
      } else {
        const errorMessage =
          response && response.error
            ? response.error
            : 'Please select some text on the page to analyze.';

        if (statusLine) {
          statusLine.textContent = `❌ Failed: ${errorMessage}`;
          statusLine.style.color = '#F44336';
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
      Logger.error('Failed to trigger analysis', err);
      // Check if it's a content script error
      const errorMsg = err.message || '';
      if (
        errorMsg.includes('Receiving end does not exist') ||
        errorMsg.includes('Could not establish connection')
      ) {
        if (errorHandler) {
          errorHandler.showError('CONTENT_SCRIPT_NOT_LOADED');
        } else {
          showFallbackError(
            'Extension not loaded on this page. Please refresh the page and try again.'
          );
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
        analyzeBtn.style.opacity = '1';
        analyzeBtn.style.cursor = 'pointer';
      }
      // Reset status line color if not already set
      if (
        statusLine &&
        !statusLine.textContent.includes('✅') &&
        !statusLine.textContent.includes('❌')
      ) {
        statusLine.style.color = '';
      }
    }
  }

  /**
   * Update connection status indicators
   */
  function updateConnectionStatus(result) {
    const connectionStatus = document.getElementById('connectionStatus');
    const backendStatus = document.getElementById('backendConnectionStatus');
    const authStatus = document.getElementById('authConnectionStatus');
    
    if (!connectionStatus) {
      return;
    }
    
    // Show connection status section
    connectionStatus.style.display = 'block';
    
    // Determine backend connection status
    if (result && result.success !== false && !result.error) {
      if (backendStatus) {
        backendStatus.textContent = '✅ Connected';
        backendStatus.className = 'connection-value connected';
      }
    } else {
      if (backendStatus) {
        const errorMsg = result?.error || '';
        if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('Unauthorized')) {
          backendStatus.textContent = '⚠️ Auth Required';
          backendStatus.className = 'connection-value auth-required';
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('timeout')) {
          backendStatus.textContent = '⚠️ Disconnected';
          backendStatus.className = 'connection-value disconnected';
        } else {
          backendStatus.textContent = '⚠️ Error';
          backendStatus.className = 'connection-value disconnected';
        }
      }
    }
    
    // Determine auth status and verify token is stored
    chrome.storage.local.get(['clerk_user', 'clerk_token'], (data) => {
      if (authStatus) {
        if (data.clerk_user && data.clerk_token) {
          authStatus.textContent = '✅ Signed In';
          authStatus.className = 'connection-value connected';
          
          // Verify token format
          const tokenParts = data.clerk_token.split('.');
          if (tokenParts.length !== 3) {
            Logger.warn('[Popup] Token format invalid - refreshing token');
            // Try to refresh token if format is invalid (async, don't await)
            if (auth && auth.isAuthenticated()) {
              auth.getToken().then((refreshedToken) => {
                if (refreshedToken) {
                  Logger.info('[Popup] Token refreshed successfully');
                }
              }).catch((e) => {
                Logger.error('[Popup] Failed to refresh invalid token:', e);
              });
            }
          }
        } else if (data.clerk_user && !data.clerk_token) {
          // User exists but token is missing - try to get it
          Logger.warn('[Popup] User found but token missing - attempting to retrieve token');
          authStatus.textContent = '⚠️ Token Missing';
          authStatus.className = 'connection-value auth-required';
          
          // Try to get token - check if auth object needs to be synced first
          const tryGetToken = async () => {
            try {
              Logger.info('[Popup] Starting token retrieval process...');
              
              // If auth doesn't exist, create and initialize it
              if (!auth) {
                Logger.info('[Popup] Auth object missing - initializing to retrieve token');
                auth = new AiGuardianAuth();
                await auth.initialize();
              }
              
              // Ensure auth is initialized
              if (!auth.isInitialized) {
                Logger.info('[Popup] Auth not initialized - initializing now');
                await auth.initialize();
              }
              
              // Sync user session to ensure auth object has the user
              Logger.info('[Popup] Checking user session to sync auth state...');
              await auth.checkUserSession();
              
              // Now try to get the token - with retry logic if needed
              // This handles cases where Clerk SDK session isn't ready immediately
              Logger.info('[Popup] Attempting to retrieve token from Clerk...');
              let token = await auth.getToken();
              
              // If token retrieval failed, try again with retries
              if (!token && auth.clerk) {
                Logger.warn('[Popup] Initial token retrieval failed, attempting retries...');
                const maxRetries = 3;
                const retryDelay = 300;
                
                for (let retry = 0; retry < maxRetries && !token; retry++) {
                  Logger.info(`[Popup] Token retrieval retry ${retry + 1}/${maxRetries}...`);
                  await new Promise((resolve) => setTimeout(resolve, retryDelay));
                  
                  // Try reloading Clerk SDK to refresh session state
                  if (typeof auth.clerk.load === 'function' && !auth.clerk.loaded) {
                    await auth.clerk.load();
                  }
                  
                  // Try getting token again
                  token = await auth.getToken();
                  
                  if (token) {
                    Logger.info(`[Popup] ✅ Token retrieved successfully on retry ${retry + 1}`);
                    break;
                  }
                }
              }
              
              if (token) {
                Logger.info('[Popup] ✅ Token retrieved and stored successfully');
                // Update UI immediately
                authStatus.textContent = '✅ Signed In';
                authStatus.className = 'connection-value connected';
                
                // Also trigger a storage update check to refresh any other UI elements
                chrome.storage.local.get(['clerk_token'], (updatedData) => {
                  if (updatedData.clerk_token) {
                    Logger.info('[Popup] Token confirmed in storage after retrieval');
                  }
                });
              } else {
                Logger.warn('[Popup] ⚠️ Token retrieval returned null - checking why...');
                
                // Check if Clerk is available
                const hasClerk = auth.clerk && typeof window !== 'undefined' && window.Clerk;
                Logger.warn('[Popup] Clerk availability:', {
                  hasAuthClerk: !!auth.clerk,
                  hasWindowClerk: typeof window !== 'undefined' && !!window.Clerk,
                  authInitialized: auth.isInitialized,
                  hasUser: !!auth.user,
                  hasStoredUser: !!data.clerk_user
                });
                
                // If Clerk isn't available, user might need to sign in again
                if (!hasClerk) {
                  Logger.warn('[Popup] Clerk SDK not available - user may need to sign in again');
                  authStatus.textContent = '⚠️ Token Missing';
                  authStatus.className = 'connection-value auth-required';
                }
              }
            } catch (e) {
              Logger.error('[Popup] ❌ Failed to retrieve missing token:', e);
              Logger.error('[Popup] Error details:', {
                message: e.message,
                stack: e.stack,
                name: e.name
              });
              // Keep showing "Token Missing" on error
              authStatus.textContent = '⚠️ Token Missing';
              authStatus.className = 'connection-value auth-required';
            }
          };
          
          // Call async function without blocking UI
          tryGetToken();
        } else {
          authStatus.textContent = '🔒 Not Signed In';
          authStatus.className = 'connection-value auth-required';
        }
      }
    });
  }

  /**
   * Update analysis result display
   * All values come from backend - no fallbacks or mocks
   * CRITICAL: Check for errors before displaying results
   */
  function updateAnalysisResult(result) {
    // Update connection status indicators
    updateConnectionStatus(result);

    // SAFETY: Check for error responses FIRST - don't display 0% for errors
    if (!result || result.success === false || result.error) {
      const errorMessage = result?.error || result?.detail || 'Analysis failed';
      Logger.error('[Popup] Analysis result indicates error:', errorMessage);

      // Determine specific error type for better UX
      let specificMessage = errorMessage;
      let statusBadge = 'disconnected';
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || 
          errorMessage.includes('authenticated') || errorMessage.includes('sign in')) {
        specificMessage = 'Score unavailable - Please sign in';
        statusBadge = 'auth-required';
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        specificMessage = 'Score unavailable - Access denied';
        statusBadge = 'auth-required';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || 
                 errorMessage.includes('connection') || errorMessage.includes('timeout')) {
        specificMessage = 'Score unavailable - Backend connection required';
        statusBadge = 'disconnected';
      } else if (errorMessage.includes('404')) {
        specificMessage = 'Score unavailable - Backend endpoint not found';
        statusBadge = 'disconnected';
      }

      // Display error in UI
      const biasScore = document.getElementById('biasScore');
      const biasType = document.getElementById('biasType');
      const confidence = document.getElementById('confidence');
      const scoreStatusBadge = document.getElementById('scoreStatusBadge');
      const analysisStatusLine = document.getElementById('analysisStatusLine');

      if (biasScore) {
        biasScore.textContent = 'N/A';
        biasScore.className = 'score-value error';
      }

      if (scoreStatusBadge) {
        scoreStatusBadge.textContent = statusBadge === 'auth-required' ? '🔒 Sign In Required' : 
                                      statusBadge === 'disconnected' ? '⚠️ No Connection' : '❌ Error';
        scoreStatusBadge.className = `score-status-badge ${statusBadge}`;
        scoreStatusBadge.style.display = 'inline-block';
      }

      if (biasType) {
        biasType.textContent = specificMessage;
        biasType.className = 'error-text';
      }

      if (confidence) {
        confidence.textContent = '—';
      }

      if (analysisStatusLine) {
        analysisStatusLine.textContent = `Error: ${errorMessage.substring(0, 50)}${errorMessage.length > 50 ? '...' : ''}`;
        analysisStatusLine.style.color = 'rgba(255, 87, 87, 0.9)';
      }

      // Show error to user
      if (errorHandler) {
        errorHandler.showErrorFromException(new Error(specificMessage));
      } else {
        showFallbackError(`Analysis failed: ${specificMessage}`);
      }

      return; // Don't process further
    }

    // Validate that we have a valid result before displaying
    if (
      (result.score === undefined || result.score === null) &&
      (!result.analysis || Object.keys(result.analysis).length === 0)
    ) {
      Logger.warn('[Popup] Analysis result missing score and analysis data:', result);
      const biasScore = document.getElementById('biasScore');
      const biasType = document.getElementById('biasType');
      const scoreStatusBadge = document.getElementById('scoreStatusBadge');
      const analysisStatusLine = document.getElementById('analysisStatusLine');

      if (biasScore) {
        biasScore.textContent = 'N/A';
        biasScore.className = 'score-value';
      }

      if (scoreStatusBadge) {
        scoreStatusBadge.textContent = '⚠️ Incomplete';
        scoreStatusBadge.className = 'score-status-badge disconnected';
        scoreStatusBadge.style.display = 'inline-block';
      }

      if (biasType) {
        biasType.textContent = 'Score unavailable - Analysis incomplete';
        biasType.className = 'warning-text';
      }

      if (analysisStatusLine) {
        analysisStatusLine.textContent = 'Backend returned no score data';
        analysisStatusLine.style.color = 'rgba(255, 193, 7, 0.9)';
      }

      return;
    }

    const biasScore = document.getElementById('biasScore');
    const biasType = document.getElementById('biasType');
    const confidence = document.getElementById('confidence');

    // Handle score display: distinguish between null (missing), 0 (valid zero), and valid scores
    const scoreStatusBadge = document.getElementById('scoreStatusBadge');
    const analysisStatusLine = document.getElementById('analysisStatusLine');
    
    if (biasScore) {
      // Case 1: Score is null or undefined (missing from backend)
      if (result.score === null || result.score === undefined) {
        Logger.warn('[Popup] Score is null/undefined (missing from backend response)', {
          resultKeys: Object.keys(result || {}),
          hasAnalysis: !!result.analysis,
          analysisKeys: result.analysis ? Object.keys(result.analysis) : [],
          serviceType: result.service_type,
        });
        
        biasScore.textContent = 'N/A';
        biasScore.className = 'score-value';
        
        if (scoreStatusBadge) {
          scoreStatusBadge.textContent = '⚠️ Missing';
          scoreStatusBadge.className = 'score-status-badge disconnected';
          scoreStatusBadge.style.display = 'inline-block';
          // Add tooltip with more info
          scoreStatusBadge.title = 'Score not available. Backend may not have returned bias_score field.';
        }
        
        if (analysisStatusLine) {
          // More specific message based on what we have
          if (result.analysis && Object.keys(result.analysis).length > 0) {
            analysisStatusLine.textContent = 'Score unavailable - Analysis completed but score field missing';
          } else {
            analysisStatusLine.textContent = 'Score unavailable - Analysis incomplete or failed';
          }
          analysisStatusLine.style.color = 'rgba(255, 193, 7, 0.9)';
        }
      }
      // Case 2: Score is a valid number (including 0)
      else if (typeof result.score === 'number' && !Number.isNaN(result.score)) {
        // Score of 0 is valid if we have analysis data (backend explicitly returned 0)
        // Score of 0 without analysis data might indicate an error, but we'll trust the backend
        const scorePercent = Math.round(result.score * 100);
        biasScore.textContent = `${result.score.toFixed(2)} (${scorePercent}%)`;

        // Update score color based on value
        biasScore.className = 'score-value';
        if (result.score < 0.3) {
          biasScore.classList.add('low');
        } else if (result.score < 0.7) {
          biasScore.classList.add('medium');
        } else {
          biasScore.classList.add('high');
        }
        
        // Show success status badge
        if (scoreStatusBadge) {
          scoreStatusBadge.textContent = '✅ Connected';
          scoreStatusBadge.className = 'score-status-badge connected';
          scoreStatusBadge.style.display = 'inline-block';
        }
        
        if (analysisStatusLine) {
          // Use stored timestamp if available, otherwise use current time
          let timestampText;
          if (result.timestamp) {
            try {
              const storedDate = new Date(result.timestamp);
              if (!isNaN(storedDate.getTime())) {
                timestampText = storedDate.toLocaleTimeString();
              } else {
                timestampText = new Date().toLocaleTimeString();
              }
            } catch (e) {
              timestampText = new Date().toLocaleTimeString();
            }
          } else {
            timestampText = new Date().toLocaleTimeString();
          }
          analysisStatusLine.textContent = `Last analysis: ${timestampText}`;
          analysisStatusLine.style.color = 'rgba(249, 249, 249, 0.75)';
        }
      }
      // Case 3: Score is invalid (not a number)
      else {
        Logger.warn('[Popup] Score is not a valid number:', {
          score: result.score,
          scoreType: typeof result.score,
        });
        biasScore.textContent = 'N/A';
        biasScore.className = 'score-value';
        
        if (scoreStatusBadge) {
          scoreStatusBadge.textContent = '⚠️ Invalid';
          scoreStatusBadge.className = 'score-status-badge disconnected';
          scoreStatusBadge.style.display = 'inline-block';
        }
        
        if (analysisStatusLine) {
          analysisStatusLine.textContent = 'Score unavailable - Invalid score format';
          analysisStatusLine.style.color = 'rgba(255, 87, 87, 0.9)';
        }
      }
    }

    if (biasType && result.analysis) {
      // Extract type from various possible fields
      const analysisType =
        result.analysis.bias_type ||
        result.analysis.type ||
        result.analysis.service_type ||
        (result.analysis.detected_type ? result.analysis.detected_type : null);

      if (analysisType && analysisType !== 'Unknown' && analysisType !== 'unknown') {
        biasType.textContent = analysisType;
        biasType.className = '';
      } else if (result.analysis && Object.keys(result.analysis).length > 0) {
        // If we have analysis data but no type, show "Analyzed" instead of "Unknown"
        biasType.textContent = 'Analyzed';
        biasType.className = '';
      } else {
        biasType.textContent = 'Unknown';
        biasType.className = 'warning-text';
      }
    } else if (biasType) {
      biasType.textContent = 'No analysis';
      biasType.className = 'warning-text';
    }

    if (confidence && result.analysis && result.analysis.confidence !== undefined) {
      const confValue = Math.round(result.analysis.confidence * 100);
      confidence.textContent = `${confValue}%`;
    } else if (confidence) {
      confidence.textContent = '—';
    }

    // Show score explanation section when we have a valid score
    const scoreExplanation = document.getElementById('scoreExplanation');
    const explanationToggle = document.getElementById('explanationToggle');
    const explanationContent = document.getElementById('explanationContent');
    
    if (scoreExplanation && result.score !== null && result.score !== undefined && 
        typeof result.score === 'number' && !Number.isNaN(result.score)) {
      // Show explanation section
      scoreExplanation.style.display = 'block';
      
      // Set up toggle functionality
      if (explanationToggle && explanationContent) {
        // Remove existing listeners to prevent duplicates
        const newToggle = explanationToggle.cloneNode(true);
        explanationToggle.parentNode.replaceChild(newToggle, explanationToggle);
        
        newToggle.addEventListener('click', () => {
          const isExpanded = explanationContent.style.display !== 'none';
          explanationContent.style.display = isExpanded ? 'none' : 'block';
          newToggle.textContent = isExpanded 
            ? '📚 How is this score calculated? (Click to learn more)'
            : '📚 Hide explanation';
        });
      }
      
      // Update explanation with actual score details if available
      if (result.analysis && result.analysis.bias_types && result.analysis.bias_types.length > 0) {
        const categoriesList = explanationContent?.querySelector('.explanation-section:last-of-type ul');
        if (categoriesList) {
          // Add detected categories to the explanation
          const detectedCategories = result.analysis.bias_types.map(type => {
            const typeMap = {
              'racial_bias': 'Racial',
              'gender_bias': 'Gender',
              'age_bias': 'Age',
              'socioeconomic_bias': 'Economic',
              'ability_bias': 'Ability'
            };
            return typeMap[type] || type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          });
          
          if (detectedCategories.length > 0) {
            const detectedText = document.createElement('p');
            detectedText.style.margin = '4px 0';
            detectedText.style.color = '#ffc107';
            detectedText.innerHTML = `<strong>Detected in this text:</strong> ${detectedCategories.join(', ')}`;
            categoriesList.parentNode.insertBefore(detectedText, categoriesList);
          }
        }
      }
    } else if (scoreExplanation) {
      // Hide explanation if no valid score
      scoreExplanation.style.display = 'none';
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
   * Update transcendent UI with consciousness levels
   */
  function updateTranscendentUI(transcendence) {
    const transcendentSection = document.getElementById('transcendentSection');
    const transcendenceLevel = document.getElementById('transcendenceLevel');
    const transcendentStatusBadge = document.getElementById('transcendentStatusBadge');
    const transcendenceBreakdown = document.getElementById('transcendenceBreakdown');
    const logicScore = document.getElementById('logicScore');
    const physicsScore = document.getElementById('physicsScore');
    const intuitionScore = document.getElementById('intuitionScore');
    const transcendenceGuidance = document.getElementById('transcendenceGuidance');

    if (!transcendentSection || !transcendenceLevel) {
      return; // UI elements not available
    }

    // Show transcendent section
    transcendentSection.style.display = 'block';

    // Update level
    if (transcendenceLevel) {
      transcendenceLevel.textContent = transcendence.level || '—';
      transcendenceLevel.className = `transcendence-level ${transcendence.level?.toLowerCase() || ''}`;
    }

    // Update status badge
    if (transcendentStatusBadge) {
      if (transcendence.isTranscendent) {
        transcendentStatusBadge.textContent = '✨ TRANSCENDENT';
        transcendentStatusBadge.className = 'transcendent-status-badge transcendent';
      } else {
        transcendentStatusBadge.textContent = '🌱 ' + transcendence.level;
        transcendentStatusBadge.className = 'transcendent-status-badge emerging';
      }
    }

    // Update breakdown
    if (transcendenceBreakdown && logicScore && physicsScore && intuitionScore) {
      transcendenceBreakdown.style.display = 'block';
      logicScore.textContent = `${(transcendence.logic * 100).toFixed(0)}%`;
      physicsScore.textContent = `${(transcendence.physics * 100).toFixed(0)}%`;
      intuitionScore.textContent = `${(transcendence.intuition * 100).toFixed(0)}%`;
    }

    // Update guidance
    if (transcendenceGuidance && transcendence.guidance) {
      transcendenceGuidance.style.display = 'block';
      transcendenceGuidance.innerHTML = transcendence.guidance
        .map(g => `<div class="guidance-item">${g}</div>`)
        .join('');
    }
  }

  /**
   * Update transcendent UI with consciousness levels
   */
  function updateTranscendentUI(transcendence) {
    const transcendentSection = document.getElementById('transcendentSection');
    const transcendenceLevel = document.getElementById('transcendenceLevel');
    const transcendentStatusBadge = document.getElementById('transcendentStatusBadge');
    const transcendenceBreakdown = document.getElementById('transcendenceBreakdown');
    const logicScore = document.getElementById('logicScore');
    const physicsScore = document.getElementById('physicsScore');
    const intuitionScore = document.getElementById('intuitionScore');
    const transcendenceGuidance = document.getElementById('transcendenceGuidance');

    if (!transcendentSection || !transcendenceLevel) {
      return; // UI elements not available
    }

    // Show transcendent section
    transcendentSection.style.display = 'block';

    // Update level
    if (transcendenceLevel) {
      transcendenceLevel.textContent = transcendence.level || '—';
      transcendenceLevel.className = `transcendence-level ${transcendence.level?.toLowerCase() || ''}`;
    }

    // Update status badge
    if (transcendentStatusBadge) {
      if (transcendence.isTranscendent) {
        transcendentStatusBadge.textContent = '✨ TRANSCENDENT';
        transcendentStatusBadge.className = 'transcendent-status-badge transcendent';
      } else {
        transcendentStatusBadge.textContent = '🌱 ' + transcendence.level;
        transcendentStatusBadge.className = 'transcendent-status-badge emerging';
      }
    }

    // Update breakdown
    if (transcendenceBreakdown && logicScore && physicsScore && intuitionScore) {
      transcendenceBreakdown.style.display = 'block';
      logicScore.textContent = `${(transcendence.logic * 100).toFixed(0)}%`;
      physicsScore.textContent = `${(transcendence.physics * 100).toFixed(0)}%`;
      intuitionScore.textContent = `${(transcendence.intuition * 100).toFixed(0)}%`;
    }

    // Update guidance
    if (transcendenceGuidance && transcendence.guidance) {
      transcendenceGuidance.style.display = 'block';
      transcendenceGuidance.innerHTML = transcendence.guidance
        .map(g => `<div class="guidance-item">${g}</div>`)
        .join('');
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
      const syncData = await new Promise((resolve) => {
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
      const localData = await new Promise((resolve) => {
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
    Logger.info('[Diagnostics] runDiagnostics() called');
    const backendStatusEl = document.getElementById('backendStatus');
    const clerkKeyStatusEl = document.getElementById('clerkKeyStatus');
    const authStateStatusEl = document.getElementById('authStateStatus');
    const tokenStatusEl = document.getElementById('tokenStatus');

    if (!backendStatusEl || !clerkKeyStatusEl || !authStateStatusEl || !tokenStatusEl) {
      Logger.error('[Diagnostics] Diagnostic elements not found:', {
        backendStatusEl: !!backendStatusEl,
        clerkKeyStatusEl: !!clerkKeyStatusEl,
        authStateStatusEl: !!authStateStatusEl,
        tokenStatusEl: !!tokenStatusEl,
      });
      Logger.error('Diagnostic elements not found');
      return;
    }

    Logger.info('[Diagnostics] Starting diagnostic checks...');
    Logger.info('[Diagnostics] All elements found, starting checks...');

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
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: false, error: 'Timeout' }), 3000)
          ),
        ]);
      } catch (bgErr) {
        Logger.warn('[Diagnostics] Background script check failed, trying direct:', bgErr);
      }

      // If background script didn't work, try direct connection test
      if (!response || !response.success) {
        Logger.info('[Diagnostics] Trying direct backend connection test...');
        try {
          const gatewayUrl = await new Promise((resolve) => {
            chrome.storage.sync.get(['gateway_url'], (data) => {
              resolve(data.gateway_url || 'https://api.aiguardian.ai');
            });
          });

          const healthUrl = gatewayUrl.replace(/\/$/, '') + '/health/live';
          const directResponse = await Promise.race([
            fetch(healthUrl, {
              method: 'GET',
              headers: { 'X-Extension-Version': chrome.runtime.getManifest().version },
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
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
        const displayMsg = errorMsg.includes('Timeout')
          ? 'Timeout'
          : errorMsg.includes('Failed to fetch')
            ? 'Network error'
            : errorMsg.includes('not responding')
              ? 'Background error'
              : 'Disconnected';
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
          source: syncData.clerk_key_source,
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
              fullSettings: settings,
            });

            if (settings && settings.clerk_publishable_key) {
              clerkKeyStatusEl.textContent = '✅ Auto-configured';
              clerkKeyStatusEl.className = 'diagnostic-value status-ok';
            } else if (settings && settings.error) {
              // Show specific error message
              const errorMsg =
                typeof settings.error === 'string'
                  ? settings.error
                  : settings.error.error || settings.error.message || 'Unknown error';
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
    Logger.info('[Diagnostics] Starting auth state check...');

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
        hasToken: !!localData.clerk_token,
      });

      if (localData.clerk_user) {
        const email = localData.clerk_user.email || 'User';
        authStateStatusEl.textContent = `✅ Signed in (${email.substring(0, 20)}...)`;
        authStateStatusEl.className = 'diagnostic-value status-ok';
        Logger.info('[Diagnostics] ✅ Auth state updated: Signed in');
      } else if (auth && auth.isAuthenticated()) {
        const user = auth.getCurrentUser();
        const email = user?.email || user?.primaryEmailAddress?.emailAddress || 'User';
        authStateStatusEl.textContent = `✅ Signed in (${email.substring(0, 20)}...)`;
        authStateStatusEl.className = 'diagnostic-value status-ok';
        Logger.info('[Diagnostics] ✅ Auth state updated: Signed in (from auth object)');
      } else {
        authStateStatusEl.textContent = '⚠️ Not signed in';
        authStateStatusEl.className = 'diagnostic-value status-warning';
        Logger.info('[Diagnostics] ⚠️ Auth state updated: Not signed in');
      }
    } catch (err) {
      authStateStatusEl.textContent = '❌ Error';
      authStateStatusEl.className = 'diagnostic-value status-error';
      Logger.error('[Diagnostics] Auth state check failed', err);
      Logger.error('[Diagnostics] ❌ Auth state check error:', err);
    }

    // Check token status and validation
    tokenStatusEl.textContent = 'Checking...';
    tokenStatusEl.className = 'diagnostic-value';
    try {
      const localData = await new Promise((resolve) => {
        chrome.storage.local.get(['clerk_token'], (data) => {
          resolve(data || {});
        });
      });

      const token = localData.clerk_token;
      if (token) {
        // Validate token format (JWT tokens have 3 parts separated by dots)
        const parts = token.split('.');
        const isValidFormat = parts.length === 3;

        if (isValidFormat) {
          try {
            // Try to decode header to verify it's valid base64
            const header = atob(parts[0]);
            if (header.startsWith('{')) {
              tokenStatusEl.textContent = `✅ Valid format (${token.length} chars)`;
              tokenStatusEl.className = 'diagnostic-value status-ok';
              Logger.info('[Diagnostics] Token format is valid');
            } else {
              tokenStatusEl.textContent = '⚠️ Invalid format';
              tokenStatusEl.className = 'diagnostic-value status-warning';
              Logger.warn('[Diagnostics] Token format invalid - header not JSON');
            }
          } catch (e) {
            tokenStatusEl.textContent = '⚠️ Invalid format';
            tokenStatusEl.className = 'diagnostic-value status-warning';
            Logger.warn('[Diagnostics] Token format invalid - cannot decode:', e.message);
          }
        } else {
          tokenStatusEl.textContent = '⚠️ Invalid format';
          tokenStatusEl.className = 'diagnostic-value status-warning';
          Logger.warn('[Diagnostics] Token format invalid - wrong number of parts');
        }
      } else {
        tokenStatusEl.textContent = '⚠️ No token';
        tokenStatusEl.className = 'diagnostic-value status-warning';
        Logger.info('[Diagnostics] No token found');
      }
    } catch (err) {
      tokenStatusEl.textContent = '❌ Error';
      tokenStatusEl.className = 'diagnostic-value status-error';
      Logger.error('[Diagnostics] Token check failed', err);
    }

    Logger.info('[Diagnostics] Diagnostic checks completed');
  }

  // Cleanup on popup close
  window.addEventListener('beforeunload', cleanupEventListeners);
})();
