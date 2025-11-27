/**
 * Background Service Worker for AiGuardian Chrome Extension
 *
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Configure your AiGuardian gateway endpoint
 * - Implement authentication with your guard services
 * - Add custom guard types and analysis pipelines
 * - Integrate with your central logging and monitoring
 */

// Import the AiGuardian Gateway and dependencies
// NOTE: Paths in importScripts are relative to this file's location (src/),
// so we reference sibling files directly without a leading src/ segment.
try {
  importScripts('constants.js');
  importScripts('logging.js');
  importScripts('string-optimizer.js');
  importScripts('cache-manager.js');
  importScripts('circuit-breaker.js');
  importScripts('subscription-service.js');
  importScripts('gateway.js');
  // Load TensorFlow.js first (required for ML model)
  try {
    importScripts('vendor/tfjs.min.js');
    Logger.info('[BG] TensorFlow.js loaded');
  } catch (e) {
    Logger.warn('[BG] TensorFlow.js not available:', e);
  }
  
  // Load ML model support modules
  try {
    importScripts('models/text-preprocessor.js');
    importScripts('models/model-loader.js');
    importScripts('models/bias-detection/enhanced-bias-detection.js');
    importScripts('models/bias-detection/contextual-scoring.js');
    importScripts('models/bias-detection/graduated-scoring.js');
    importScripts('models/bias-detection/patterns.js');
    Logger.info('[BG] ML model support modules loaded');
  } catch (e) {
    Logger.warn('[BG] ML model support modules not available:', e);
  }
  
  // Load onboard transcendent modules (including ML bias detection)
  try {
    importScripts('onboard/bias-detection.js'); // Keep for fallback
    importScripts('onboard/ml-bias-detection.js'); // ML-based detection
    importScripts('onboard/transcendence.js');
    importScripts('onboard/access-control.js');
    Logger.info('[BG] Onboard transcendent modules loaded');
  } catch (e) {
    Logger.warn('[BG] Onboard modules not available:', e);
  }
  // Load epistemic calibration system
  try {
    importScripts('../tests/BIASGUARD_EPISTEMIC_CALIBRATION.js');
  } catch (e) {
    Logger.warn('[BG] Epistemic calibration system not available:', e);
  }

  // Verify critical dependencies loaded
  if (typeof Logger === 'undefined') {
    throw new Error('Logger not loaded - logging.js failed');
  }
  if (typeof DEFAULT_CONFIG === 'undefined') {
    throw new Error('DEFAULT_CONFIG not loaded - constants.js failed');
  }
  if (typeof CircuitBreaker === 'undefined') {
    throw new Error('CircuitBreaker not loaded - circuit-breaker.js failed');
  }
  if (typeof AiGuardianGateway === 'undefined') {
    throw new Error('AiGuardianGateway not loaded - gateway.js failed');
  }

  Logger.info('[BG] All dependencies loaded successfully');
} catch (importError) {
  // Log error but don't crash - use console.error as fallback
  try {
    Logger.error('[BG] CRITICAL: Failed to load dependencies:', importError);
    console.error('[BG] Import error details:', {
      message: importError.message,
      stack: importError.stack,
      name: importError.name,
    });
  } catch (e) {
    // Last resort - can't even log
  }
  // Re-throw to prevent service worker from continuing with broken state
  throw importError;
}

let gateway = null;

/**
 * Initialize gateway with error handling
 */
function initializeGateway() {
  try {
    if (!gateway) {
      if (typeof AiGuardianGateway === 'undefined') {
        throw new Error('AiGuardianGateway class not available');
      }
      gateway = new AiGuardianGateway();
      Logger.info('[BG] Gateway initialized successfully');
    }
    return gateway;
  } catch (error) {
    Logger.error('[BG] Failed to initialize gateway:', error);
    // Don't throw - allow service worker to continue
    // Gateway will be null and requests will fail gracefully
    return null;
  }
}

try {
  // Extension installation handler
  chrome.runtime.onInstalled.addListener(async () => {
    Logger.info('[BG] Installed: AiGuardian Chrome Ext v1.0.0');

    // Initialize AiGuardian Gateway
    gateway = initializeGateway();
    // Initialize default settings
    await initializeDefaultSettings();

    // Create context menus
    createContextMenus();
  });

  // Extension startup handler (runs every time browser starts)
  chrome.runtime.onStartup.addListener(async () => {
    Logger.info('[BG] Startup: AiGuardian Chrome Ext v1.0.0');

    // Initialize AiGuardian Gateway
    if (!gateway) {
      gateway = initializeGateway();
    }

    // Recreate context menus on startup
    createContextMenus();
  });

  // Also create context menus immediately when service worker loads
  // This ensures menus are available even if extension was already installed
  (async function initializeOnLoad() {
    Logger.info('[BG] Service worker loaded');

    // Initialize gateway
    if (!gateway) {
      gateway = initializeGateway();
    }

    // CRITICAL: Initialize gateway connection
    try {
      await gateway.initializeGateway();
      Logger.info('[BG] Gateway initialized successfully');
    } catch (err) {
      Logger.error('[BG] Gateway initialization failed:', err);
      // Continue anyway - gateway will retry on first use
    }

    // Create context menus
    createContextMenus();
  })();

  /**
   * TRACER BULLET: Initialize default settings for AiGuardian
   */
  async function initializeDefaultSettings() {
    // Constants are now available via importScripts
    const defaultSettings = {
      gateway_url: DEFAULT_CONFIG.GATEWAY_URL,
      api_key: DEFAULT_CONFIG.API_KEY,
      guard_services: DEFAULT_CONFIG.GUARD_SERVICES,
      logging_config: DEFAULT_CONFIG.LOGGING_CONFIG,
      analysis_pipeline: DEFAULT_CONFIG.ANALYSIS_PIPELINE,
      analysis_history: [],
    };

    chrome.storage.sync.get(Object.keys(defaultSettings), (data) => {
      const settingsToSave = {};
      for (const [key, defaultValue] of Object.entries(defaultSettings)) {
        if (data[key] === undefined) {
          settingsToSave[key] = defaultValue;
        }
      }

      if (Object.keys(settingsToSave).length > 0) {
        chrome.storage.sync.set(settingsToSave, () => {
          if (chrome.runtime.lastError) {
            Logger.error('[BG] Failed to initialize default settings:', chrome.runtime.lastError.message);
          } else {
            Logger.info('[BG] Initialized default settings');
          }
        });
      }
    });
  }

  /**
   * TRACER BULLET: Create context menus for right-click analysis
   */
  function createContextMenus() {
    // Remove all existing menus first to avoid duplicates
    chrome.contextMenus.removeAll(() => {
      // Create analyze text menu
      chrome.contextMenus.create(
        {
          id: 'analyze-text',
          title: 'Analyze with AiGuardian',
          contexts: ['selection'],
        },
        () => {
          if (chrome.runtime.lastError) {
            Logger.error('[BG] Error creating analyze-text menu:', chrome.runtime.lastError);
          }
        }
      );

      // Create search web menu
      chrome.contextMenus.create(
        {
          id: 'search-web',
          title: 'Search Web for Context',
          contexts: ['selection'],
        },
        () => {
          if (chrome.runtime.lastError) {
            Logger.error('[BG] Error creating search-web menu:', chrome.runtime.lastError);
          }
        }
      );

      // Create copy analysis menu
      chrome.contextMenus.create(
        {
          id: 'copy-analysis',
          title: 'Copy Last Analysis',
          contexts: ['page'],
        },
        () => {
          if (chrome.runtime.lastError) {
            Logger.error('[BG] Error creating copy-analysis menu:', chrome.runtime.lastError);
          }
        }
      );

      // Create clear highlights menu
      chrome.contextMenus.create(
        {
          id: 'clear-highlights',
          title: 'Clear All Highlights',
          contexts: ['page'],
        },
        () => {
          if (chrome.runtime.lastError) {
            Logger.error('[BG] Error creating clear-highlights menu:', chrome.runtime.lastError);
          }
        }
      );

      Logger.info('[BG] Context menus created');
    });
  }

  /**
   * TRACER BULLET: Handle context menu clicks
   */
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case 'analyze-text':
        if (info.selectionText) {
          handleTextAnalysis(info.selectionText, (response) => {
            // Send result to content script to display
            chrome.tabs.sendMessage(tab.id, {
              type: 'SHOW_ANALYSIS_RESULT',
              payload: response,
            }, () => {
              if (chrome.runtime.lastError) {
                Logger.warn('[BG] Failed to send analysis result to content script:', chrome.runtime.lastError.message);
              }
            });
          });
        }
        break;

      case 'search-web':
        if (info.selectionText) {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(info.selectionText)}`;
          chrome.tabs.create({ url: searchUrl });
          Logger.info('[BG] Web search opened', { query: info.selectionText });
        }
        break;

      case 'copy-analysis':
        chrome.storage.local.get(['last_analysis'], (data) => {
          if (chrome.runtime.lastError) {
            Logger.error('[BG] Failed to read last_analysis:', chrome.runtime.lastError.message);
            return;
          }
          if (data.last_analysis) {
            const analysisText = JSON.stringify(data.last_analysis, null, 2);
            chrome.tabs.sendMessage(tab.id, {
              type: 'COPY_TO_CLIPBOARD',
              payload: analysisText,
            }, () => {
              if (chrome.runtime.lastError) {
                Logger.warn('[BG] Failed to send copy command to content script:', chrome.runtime.lastError.message);
              } else {
                Logger.info('[BG] Analysis copied to clipboard');
              }
            });
          }
        });
        break;

      case 'clear-highlights':
        chrome.tabs.sendMessage(tab.id, {
          type: 'CLEAR_HIGHLIGHTS',
        }, () => {
          if (chrome.runtime.lastError) {
            Logger.warn('[BG] Failed to send clear highlights command:', chrome.runtime.lastError.message);
          } else {
            Logger.info('[BG] Highlights cleared');
          }
        });
        break;
    }
  });

  /**
   * TRACER BULLET: Handle keyboard commands
   */
  chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        switch (command) {
          case 'analyze-selection':
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'ANALYZE_SELECTION_COMMAND',
            }, () => {
              if (chrome.runtime.lastError) {
                Logger.warn('[BG] Failed to send analyze command:', chrome.runtime.lastError.message);
              } else {
                Logger.info('[BG] Analyze selection command triggered');
              }
            });
            break;

          case 'clear-highlights':
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'CLEAR_HIGHLIGHTS',
            }, () => {
              if (chrome.runtime.lastError) {
                Logger.warn('[BG] Failed to send clear highlights command:', chrome.runtime.lastError.message);
              } else {
                Logger.info('[BG] Clear highlights command triggered');
              }
            });
            break;

          case 'show-history':
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'SHOW_HISTORY',
            }, () => {
              if (chrome.runtime.lastError) {
                Logger.warn('[BG] Failed to send show history command:', chrome.runtime.lastError.message);
              } else {
                Logger.info('[BG] Show history command triggered');
              }
            });
            break;
        }
      }
    });
  });

  /**
   * TRACER BULLET: Origin validation for security
   */
  function validateOrigin(sender) {
    // Validate sender origin
    if (!sender || !sender.origin) {
      throw new Error('Invalid sender: origin information required');
    }

    // Check for allowed origins
    const allowedOrigins = [
      'chrome-extension://',
      'https://api.aiguardian.ai',
      'https://www.aiguardian.ai',
      'https://localhost',
      'https://127.0.0.1',
    ];

    const isAllowedOrigin = allowedOrigins.some((origin) => sender.origin.startsWith(origin));

    if (!isAllowedOrigin) {
      throw new Error(`Unauthorized origin: ${sender.origin}`);
    }

    return true;
  }

  /**
   * TRACER BULLET: Enhanced message validation
   */
  function validateMessage(message, sender) {
    // Validate message structure
    if (!message || typeof message !== 'object') {
      throw new Error('Invalid message: must be an object');
    }

    // Validate required fields
    if (!message.type || typeof message.type !== 'string') {
      throw new Error('Invalid message: type field is required');
    }

    // Validate sender
    if (!sender || !sender.tab) {
      throw new Error('Invalid sender: tab information required');
    }

    // Validate message type
    const allowedTypes = [
      'ANALYZE_TEXT',
      'GET_DIAGNOSTICS',
      'GET_TRACE_STATS',
      'TEST_GATEWAY_CONNECTION',
      'GET_CENTRAL_CONFIG',
      'UPDATE_CENTRAL_CONFIG',
      'GET_GUARD_STATUS',
      'TEST_GUARD_SERVICE',
    ];

    if (!allowedTypes.includes(message.type)) {
      throw new Error(`Invalid message type: ${message.type}`);
    }

    // Validate payload if present
    if (message.payload && typeof message.payload !== 'object') {
      throw new Error('Invalid payload: must be an object');
    }

    return true;
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Log ALL incoming messages for debugging
    Logger.info('[BG] 📨 Message received:', { type: request.type, hasUser: !!request.user });
    Logger.info('[BG] 📨 Incoming message:', request.type, request);
    try {
      switch (request.type) {
        case 'ANALYZE_TEXT':
          // TRACER BULLET: Use AiGuardian Gateway for analysis
          handleTextAnalysis(request.payload, sendResponse);
          return true; // Keep message channel open for async response

        case 'GET_SETTINGS':
          // TRACER BULLET: Return current settings
          chrome.storage.sync.get(['bias_threshold'], (data) => {
            sendResponse({ success: true, settings: data });
          });
          return true;

        case 'GET_GUARD_STATUS':
          // TRACER BULLET: Get guard service status
          handleGuardStatusRequest(sendResponse);
          return true;

        case 'UPDATE_GUARD_CONFIG':
          // TRACER BULLET: Update guard service configuration
          handleGuardConfigUpdate(request.payload, sendResponse);
          return true;

        case 'GET_CENTRAL_CONFIG':
          // TRACER BULLET: Get central configuration
          handleCentralConfigRequest(sendResponse);
          return true;

        case 'UPDATE_CENTRAL_CONFIG':
          // TRACER BULLET: Update central configuration
          handleCentralConfigUpdate(request.payload, sendResponse);
          return true;

        case 'GET_DIAGNOSTICS':
          // TRACER BULLET: Get comprehensive diagnostics
          handleDiagnosticsRequest(sendResponse);
          return true;

        case 'GET_TRACE_STATS':
          // TRACER BULLET: Get trace statistics
          handleTraceStatsRequest(sendResponse);
          return true;

        case 'TEST_GATEWAY_CONNECTION':
          // TRACER BULLET: Test gateway connection with tracing
          handleGatewayConnectionTest(sendResponse);
          return true;

        case 'RUN_EPISTEMIC_CALIBRATION':
          // EPISTEMIC: Run BiasGuard epistemic calibration
          handleEpistemicCalibration(sendResponse);
          return true;

        case 'RECREATE_CONTEXT_MENUS':
          // TRACER BULLET: Manually recreate context menus
          try {
            createContextMenus();
            Logger.info('[BG] Context menus recreated manually');
            sendResponse({ success: true, message: 'Context menus recreated' });
          } catch (err) {
            Logger.error('[BG] Failed to recreate context menus:', err);
            sendResponse({ success: false, error: err.message });
          }
          return true;

        case 'GET_SUBSCRIPTION_STATUS':
          // TRACER BULLET: Get subscription status
          handleSubscriptionStatusRequest(sendResponse);
          return true;

        case 'CLEAR_SUBSCRIPTION_CACHE':
          // TRACER BULLET: Clear subscription cache
          handleClearSubscriptionCache(sendResponse);
          return true;

        case 'E2E_TEST_STORAGE_GET':
          // E2E TEST: Bridge for storage access from webpage console
          // Allows test script to access extension storage via message passing
          (async () => {
            try {
              const keys = request.keys || [];
              const area = request.area || 'local';
              const storageArea = area === 'sync' ? chrome.storage.sync : chrome.storage.local;

              storageArea.get(keys, (data) => {
                if (chrome.runtime.lastError) {
                  Logger.error('[BG] E2E test storage get error:', chrome.runtime.lastError);
                  sendResponse({ success: false, error: chrome.runtime.lastError.message });
                  return;
                }
                Logger.info('[BG] E2E test storage get success:', { keys, area, hasData: !!data });
                sendResponse({ success: true, data: data });
              });
            } catch (error) {
              Logger.error('[BG] E2E test storage get exception:', error);
              sendResponse({ success: false, error: error.message });
            }
          })();
          return true; // Keep message channel open for async response

        case 'INJECT_CLERK_BRIDGE':
          // CRITICAL FIX: Inject bridge script into MAIN world using chrome.scripting API
          // This is required in Manifest V3 to access page's window.Clerk
          (async () => {
            try {
              if (typeof chrome.scripting === 'undefined' || !chrome.scripting.executeScript) {
                Logger.error('[BG] chrome.scripting API not available');
                sendResponse({ success: false, error: 'scripting API not available' });
                return;
              }

              // Get the tab that sent the message
              const tabId = sender.tab?.id;
              if (!tabId) {
                Logger.error('[BG] No tab ID available for bridge injection');
                sendResponse({ success: false, error: 'No tab ID' });
                return;
              }

              // Check if bridge is already injected to prevent duplicates
              try {
                const checkResults = await chrome.scripting.executeScript({
                  target: { tabId: tabId },
                  func: () => window.__aiGuardianBridgeLoaded,
                  world: 'MAIN'
                });
                
                if (checkResults[0]?.result) {
                  Logger.info('[BG] Bridge already injected, skipping duplicate injection');
                  sendResponse({ success: true, alreadyInjected: true });
                  return;
                }
              } catch (checkError) {
                // Check failed - continue with injection anyway
                Logger.debug('[BG] Could not check bridge status, proceeding with injection:', checkError);
              }

              // Inject bridge script into MAIN world (page context)
              await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['src/clerk-bridge.js'],
                world: 'MAIN' // CRITICAL: Must be MAIN world to access window.Clerk
              });

              Logger.info('[BG] Successfully injected Clerk bridge into MAIN world');
              sendResponse({ success: true });
            } catch (error) {
              Logger.error('[BG] Failed to inject bridge script:', error);
              sendResponse({ success: false, error: error.message });
            }
          })();
          return true; // Keep channel open for async response


        case 'REFRESH_CLERK_TOKEN':
          // Handle token refresh request from gateway
          // Service worker can't access Clerk SDK directly, so forward to content script
          Logger.info('[BG] REFRESH_CLERK_TOKEN message received');

          // Try to get current token from storage first
          chrome.storage.local.get(['clerk_token'], async (data) => {
            const currentToken = data.clerk_token;

            // Try to forward refresh request to active tab's content script
            // Content script has access to Clerk SDK
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs && tabs.length > 0) {
                // Send message to content script to refresh token via Clerk SDK
                chrome.tabs.sendMessage(
                  tabs[0].id,
                  { type: 'REFRESH_CLERK_TOKEN_REQUEST' },
                  (response) => {
                    if (chrome.runtime.lastError) {
                      Logger.debug(
                        '[BG] Content script refresh failed:',
                        chrome.runtime.lastError.message
                      );
                      // Fallback: return current token if available
                      sendResponse({
                        success: !!currentToken,
                        token: currentToken || null,
                      });
                    } else if (response && response.success && response.token) {
                      // Store refreshed token
                      chrome.storage.local.set({ clerk_token: response.token }, () => {
                        Logger.info('[BG] Token refreshed and stored via content script');
                        sendResponse({ success: true, token: response.token });
                      });
                    } else {
                      // Content script couldn't refresh, return current token
                      sendResponse({
                        success: !!currentToken,
                        token: currentToken || null,
                      });
                    }
                  }
                );
              } else {
                // No active tab, return current token if available
                Logger.debug('[BG] No active tab for token refresh');
                sendResponse({
                  success: !!currentToken,
                  token: currentToken || null,
                });
              }
            });
          });
          return true; // Keep message channel open for async response

        case 'CLERK_AUTH_DETECTED':
          // Handle Clerk auth detected from content script on accounts.dev pages
          Logger.info('[BG] 🔔 CLERK_AUTH_DETECTED message received!', {
            hasUser: !!request.user,
            hasToken: !!request.token,
            userId: request.user?.id,
            email: request.user?.email,
            firstName: request.user?.firstName,
            lastName: request.user?.lastName,
          });
          Logger.info('[BG] Full request object:', request);
          if (request.user) {
            // Store user even if token is not available (token fetch might fail)
            const storageData = {
              clerk_user: request.user,
            };
            if (request.token) {
              storageData.clerk_token = request.token;
            }

            Logger.info('[BG] Storing user data:', storageData);

            chrome.storage.local.set(storageData, () => {
              if (chrome.runtime.lastError) {
                Logger.error('[BG] ❌ Storage error:', chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
              } else {
                Logger.info('[BG] ✅ Successfully stored Clerk auth from content script', {
                  hasUser: !!request.user,
                  hasToken: !!request.token,
                  userId: request.user?.id,
                  email: request.user?.email,
                });

                // Verify storage was successful
                chrome.storage.local.get(['clerk_user'], (verifyData) => {
                  if (chrome.runtime.lastError) {
                    Logger.error('[BG] ❌ Verification read error:', chrome.runtime.lastError);
                  } else if (verifyData.clerk_user) {
                    Logger.info(
                      '[BG] ✅ Storage verification successful - user stored:',
                      verifyData.clerk_user.id
                    );
                    Logger.info('[BG] ✅ Verified user in storage:', verifyData.clerk_user);
                  } else {
                    Logger.error('[BG] ❌ Storage verification FAILED - user not found after set!');
                    Logger.error('[BG] ❌ Verification failed - storage data:', verifyData);
                  }
                });

                sendResponse({ success: true, userId: request.user?.id });
              }
            });

            // Return true to keep message channel open for async response
            return true;
          } else {
            Logger.warn('[BG] ⚠️ CLERK_AUTH_DETECTED message missing user data');
            Logger.warn('[BG] Request object:', request);
          }
          sendResponse({ success: true });
          return true;

        default:
          Logger.warn('[BG] Unknown message type:', request.type);
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (err) {
      Logger.error('[BG] Message handler error:', err);
      sendResponse({ success: false, error: err.message });
    }
  });

  /**
   * TRACER BULLET: Text analysis through AiGuardian Gateway
   * Supports both backend and onboard transcendent modes
   */
  async function handleTextAnalysis(text, sendResponse) {
    try {
      Logger.info('[BG] Text analysis request received:', text?.substring(0, 50) + '...');

      // Check for transcendent access and onboard mode
      let useOnboard = false;
      let accessControl = null;
      
      // Feature Flag Check: Embedded Mode (v1.0.0)
      // If embedded mode is forced, we skip all backend checks and use local ML/Regex only
      // BUT if authentication is required, we must check it first
      const useEmbeddedModel = typeof FEATURE_FLAGS !== 'undefined' && FEATURE_FLAGS.USE_EMBEDDED_MODEL;
      const requireAuth = typeof FEATURE_FLAGS !== 'undefined' && FEATURE_FLAGS.BACKEND_AUTH_ENABLED;

      // Hybrid Cost-Saving Strategy with ML Model (Enhanced):
      // 1. Prioritize ML Model (Local, Most Accurate) - offline processing, cost-saving
      // 2. Fall back to Regex-based detection if ML model unavailable
      // 3. Fall back to Backend only if both local methods fail (AND embedded mode is NOT forced)
      const useMLModel = typeof MLBiasDetection !== 'undefined' && typeof tf !== 'undefined';
      useOnboard = typeof OnboardBiasDetection !== 'undefined';

      Logger.info('[BG] 🔄 Analysis Strategy:', {
        strategy: useEmbeddedModel ? 'Embedded First (Local ML)' : 'Hybrid Cost-Saving (ML First)',
        useEmbeddedModel: useEmbeddedModel,
        requireAuth: requireAuth,
        useMLModel: useMLModel,
        useOnboard: useOnboard,
        modulesAvailable: {
            MLBiasDetection: typeof MLBiasDetection !== 'undefined',
            TensorFlowJS: typeof tf !== 'undefined',
            OnboardBiasDetection: typeof OnboardBiasDetection !== 'undefined',
            TranscendentAccessControl: typeof TranscendentAccessControl !== 'undefined',
            TranscendenceCalculator: typeof TranscendenceCalculator !== 'undefined'
        }
      });

      // Check access control if required (even for embedded mode)
      if (requireAuth && typeof TranscendentAccessControl !== 'undefined') {
        Logger.info('[BG] 🔍 Checking access control (Auth Required)...');
        accessControl = new TranscendentAccessControl();
        const accessCheck = await accessControl.checkTranscendentAccess();

        Logger.info('[BG] 🔍 Access check result:', {
          hasAccess: accessCheck.hasAccess,
          reason: accessCheck.reason,
          message: accessCheck.message,
          transcendent: accessCheck.transcendent,
          embedded: accessCheck.embedded
        });

        if (!accessCheck.hasAccess) {
          Logger.warn('[BG] ⛔ Access denied:', accessCheck.message);
          sendResponse({
            success: false,
            error: accessCheck.message || 'Authentication required',
            errorCode: accessCheck.reason === 'not_authenticated' ? 'AUTH_REQUIRED' : 'ACCESS_DENIED',
            actionable: true
          });
          return;
        }

        Logger.info('[BG] ✅ Access granted');
      } else if (typeof TranscendentAccessControl !== 'undefined') {
        // If auth not required but class available, check anyway for logging
        Logger.info('[BG] 🔍 TranscendentAccessControl class is available (Auth Optional)');
        accessControl = new TranscendentAccessControl();
        await accessControl.checkTranscendentAccess();
      } else {
        Logger.warn('[BG] ⚠️ TranscendentAccessControl class not available');
      }

      // Try ML model first (most accurate, fully offline)
      if ((useEmbeddedModel || useMLModel) && typeof MLBiasDetection !== 'undefined') {
        Logger.info('[BG] 🤖 Starting ML-based detection...');
        try {
          Logger.info('[BG] 📝 Creating MLBiasDetection instance...');
          const mlDetector = new MLBiasDetection({
            modelPath: 'models/bias-detection-model.json',
            fallbackToRegex: true
          });
          Logger.info('[BG] ✅ MLBiasDetection instance created');
          
          Logger.info('[BG] 📊 Running ML bias detection on text...');
          const mlResult = await mlDetector.detectBias(text);
          
          // Check if ML detection succeeded
          if (mlResult && mlResult.success && mlResult.source === 'onboard-ml') {
            Logger.info('[BG] ✅ ML bias detection completed:', {
              success: mlResult.success,
              bias_score: mlResult.bias_score,
              bias_types: mlResult.bias_types,
              confidence: mlResult.confidence
            });
            
            // Calculate transcendence if available
            let transcendenceData = null;
            if (typeof TranscendenceCalculator !== 'undefined') {
              const transcendenceCalc = new TranscendenceCalculator();
              transcendenceData = transcendenceCalc.calculateTranscendence(mlResult);
            }
            
            // Format result to match backend format
            const analysisResult = {
              success: true,
              score: mlResult.bias_score,
              analysis: {
                bias_types: mlResult.bias_types,
                bias_details: mlResult.bias_details,
                mitigation_suggestions: mlResult.mitigation_suggestions,
                fairness_score: mlResult.fairness_score,
                summary: mlResult.bias_types.length > 0 
                  ? `Detected ${mlResult.bias_types.join(', ')} bias (ML)`
                  : 'No significant bias detected (ML)'
              },
              confidence: mlResult.confidence,
              processing_time: mlResult.processing_time,
              source: 'onboard-ml',
              transcendent: true,
              transcendence: transcendenceData
            };
            
            Logger.info('[BG] ✨ ML RESULT (Transcendent):', {
              bias_score: analysisResult.score,
              bias_types: analysisResult.analysis.bias_types,
              transcendence_level: transcendenceData?.level,
              processing_time: analysisResult.processing_time
            });
            
            // Save to history
            await saveToHistory(text, analysisResult);

            Logger.info('[BG] 📤 Sending ML result to content script...', {
              hasResult: !!analysisResult,
              resultKeys: Object.keys(analysisResult),
              success: analysisResult.success,
              score: analysisResult.score
            });

            try {
              sendResponse(analysisResult);
              Logger.info('[BG] ✅ Successfully sent ML result');
            } catch (sendError) {
              Logger.error('[BG] ❌ Failed to send ML result:', sendError);
            }

            // Store last analysis in background after response is sent
            chrome.storage.local.set({
              last_analysis: {
                score: analysisResult.score,
                timestamp: new Date().toISOString(),
                summary: analysisResult.analysis.summary,
                success: true,
                transcendent: true,
                transcendence_level: transcendenceData?.level,
                source: 'ml'
              }
            }, () => {
               if (chrome.runtime.lastError) {
                 Logger.warn('[BG] Error storing last_analysis (non-critical):', chrome.runtime.lastError);
               } else {
                 Logger.info('[BG] ✅ Stored last_analysis in local storage');
               }
            });
            
            return;
          } else {
            // ML detection returned but may have fallen back to regex
            Logger.info('[BG] ML detection completed but may have used fallback');
          }
        } catch (mlError) {
          Logger.warn('[BG] ML detection failed, falling back to regex:', mlError);
          // Fall through to regex-based detection
        }
      } else {
        Logger.warn('[BG] ⚠️ TranscendentAccessControl class not available');
      }

      // Use onboard detection as cost-saving fallback to ML
      Logger.info('[BG] 🔍 Checking onboard availability (cost-saving fallback):', {
        useOnboard: useOnboard,
        OnboardBiasDetectionAvailable: typeof OnboardBiasDetection !== 'undefined',
        textLength: text?.length || 0
      });

      if (useOnboard && typeof OnboardBiasDetection !== 'undefined') {
        Logger.info('[BG] 🚀 Starting onboard detection (cost-saving fallback)...');
        try {
          Logger.info('[BG] 📝 Creating OnboardBiasDetection instance...');
          const onboardDetector = new OnboardBiasDetection();
          Logger.info('[BG] ✅ OnboardBiasDetection instance created');
          
          Logger.info('[BG] 📊 Running bias detection on text (cost-saving mode)...');
          const onboardResult = onboardDetector.detectBias(text);
          Logger.info('[BG] ✅ Bias detection completed:', {
            success: onboardResult?.success,
            bias_score: onboardResult?.bias_score,
            bias_types: onboardResult?.bias_types,
            confidence: onboardResult?.confidence
          });
          
          // Calculate transcendence if available
          let transcendenceData = null;
          if (typeof TranscendenceCalculator !== 'undefined') {
            const transcendenceCalc = new TranscendenceCalculator();
            transcendenceData = transcendenceCalc.calculateTranscendence(onboardResult);
          }
          
          // Format result to match backend format
          const analysisResult = {
            success: true,
            score: onboardResult.bias_score,
            analysis: {
              bias_types: onboardResult.bias_types,
              bias_details: onboardResult.bias_details,
              mitigation_suggestions: onboardResult.mitigation_suggestions,
              fairness_score: onboardResult.fairness_score,
              summary: onboardResult.bias_types.length > 0 
                ? `Detected ${onboardResult.bias_types.join(', ')} bias`
                : 'No significant bias detected'
            },
            confidence: onboardResult.confidence,
            processing_time: onboardResult.processing_time,
            source: 'onboard',
            transcendent: true,
            transcendence: transcendenceData
          };
          
          Logger.info('[BG] ✨ ONBOARD RESULT (Transcendent):', {
            bias_score: analysisResult.score,
            bias_types: analysisResult.analysis.bias_types,
            transcendence_level: transcendenceData?.level,
            processing_time: analysisResult.processing_time
          });
          
          // Save to history
          await saveToHistory(text, analysisResult);

          Logger.info('[BG] 📤 Sending onboard result to content script...', {
            hasResult: !!analysisResult,
            resultKeys: Object.keys(analysisResult),
            success: analysisResult.success,
            score: analysisResult.score
          });

          try {
            sendResponse(analysisResult);
            Logger.info('[BG] ✅ Successfully sent onboard result');
          } catch (sendError) {
            Logger.error('[BG] ❌ Failed to send onboard result:', sendError);
          }

          // Store last analysis in background after response is sent
          chrome.storage.local.set({
            last_analysis: {
              score: analysisResult.score,
              timestamp: new Date().toISOString(),
              summary: analysisResult.analysis.summary,
              success: true,
              transcendent: true,
              transcendence_level: transcendenceData?.level
            }
          }, () => {
             if (chrome.runtime.lastError) {
               Logger.warn('[BG] Error storing last_analysis (non-critical):', chrome.runtime.lastError);
             } else {
               Logger.info('[BG] ✅ Stored last_analysis in local storage');
             }
          });
          
          return;
        } catch (onboardError) {
          Logger.warn('[BG] Onboard detection failed, falling back to backend:', onboardError);
          // Fall through to backend
        }

        // If onboard mode was attempted but failed, try again with forced onboard
        if (!useOnboard && typeof OnboardBiasDetection !== 'undefined') {
          Logger.info('[BG] 🔄 Forcing onboard mode as last resort...');
          try {
            const onboardDetector = new OnboardBiasDetection();
            const onboardResult = onboardDetector.detectBias(text);

            const analysisResult = {
              success: true,
              score: onboardResult.bias_score,
              analysis: {
                bias_types: onboardResult.bias_types,
                bias_details: onboardResult.bias_details,
                mitigation_suggestions: onboardResult.mitigation_suggestions,
                fairness_score: onboardResult.fairness_score,
                summary: onboardResult.bias_types.length > 0
                  ? `Detected ${onboardResult.bias_types.join(', ')} bias`
                  : 'No significant bias detected'
              },
              confidence: onboardResult.confidence,
              processing_time: onboardResult.processing_time,
              source: 'onboard-forced',
              transcendent: false
            };

            Logger.info('[BG] ✨ FORCED ONBOARD RESULT:', {
              bias_score: analysisResult.score,
              bias_types: analysisResult.analysis.bias_types,
              processing_time: analysisResult.processing_time
            });

          await saveToHistory(text, analysisResult);
          
          Logger.info('[BG] 📤 Sending onboard result to content script...');
          try {
            sendResponse(analysisResult);
            Logger.info('[BG] ✅ Successfully sent onboard result');
          } catch (sendError) {
            Logger.error('[BG] ❌ Failed to send onboard result:', sendError);
            // Try alternative response method
            if (typeof sendResponse === 'function') {
              sendResponse(analysisResult);
            }
          }
          return;
          } catch (forcedError) {
            Logger.error('[BG] Forced onboard also failed:', forcedError);
          }
        }
      }

      // If forced embedded mode, stop here (unless we want to allow backend fallback even then?)
      // With hybrid approach, we might want to allow backend fallback if ML fails,
      // but for "Embedded Mode" we strictly stick to local.
      if (useEmbeddedModel) {
        Logger.info('[BG] 🛑 Embedded mode active - skipping backend fallback');
        sendResponse({
          success: false,
          error: 'Analysis failed (Embedded Mode)',
          errorCode: 'EMBEDDED_ANALYSIS_FAILED',
          actionable: false
        });
        return;
      }

      // Ensure gateway is initialized for backend mode
      if (!gateway) {
        gateway = initializeGateway();
      }

      if (!gateway) {
        throw new Error('Gateway not available - extension may not be properly initialized');
      }

      // TRACER BULLET: Use AI Guardians Gateway for analysis (backend mode)
      try {
        const analysisResult = await gateway.analyzeText(text);
        Logger.info('[BG] ✅ BACKEND RESULT RECEIVED IN SERVICE WORKER', {
          hasResult: !!analysisResult,
          resultKeys: analysisResult ? Object.keys(analysisResult) : [],
          resultType: typeof analysisResult,
          resultPreview: analysisResult ? JSON.stringify(analysisResult).substring(0, 500) : 'null',
          fullResult: analysisResult,
        });

        // Log full error details if backend returned an error
        if (analysisResult && analysisResult.success === false) {
          Logger.error('[BG] FULL BACKEND ERROR RESPONSE RECEIVED:', {
            success: analysisResult.success,
            error: analysisResult.error,
            status: analysisResult.status,
            statusText: analysisResult.statusText,
            hasScore: analysisResult.score !== undefined,
            hasAnalysis: !!analysisResult.analysis,
            // Log the FULL error response object to see backend details
            fullErrorResponse: analysisResult,
            // Extract any nested error details
            errorDetail: analysisResult.detail,
            errorMessage: analysisResult.message,
            errorType: analysisResult.type,
            // Log all keys to see what backend is sending
            errorKeys: Object.keys(analysisResult),
            // Log as formatted JSON for complete visibility
            fullErrorResponseJSON: JSON.stringify(analysisResult, null, 2),
          });
        }

        // Only save successful analyses to history
        // Check if result is successful and has valid data (not an error response)
        if (
          analysisResult &&
          analysisResult.success !== false &&
          !analysisResult.error &&
          (analysisResult.score !== undefined || analysisResult.analysis)
        ) {
          // Additional validation: ensure score is not default error value
          const hasValidScore =
            analysisResult.score === undefined ||
            (typeof analysisResult.score === 'number' && analysisResult.score >= 0);

          if (hasValidScore) {
            // Wrap saveToHistory in try-catch to catch and log errors
            try {
              await saveToHistory(text, analysisResult);
            } catch (error) {
              Logger.error('[BG] Error saving to history:', {
                error: error.message,
                stack: error.stack,
                textLength: text.length,
                analysisSize: JSON.stringify(analysisResult).length,
                analysisKeys: analysisResult ? Object.keys(analysisResult) : [],
              });
            }
            // Save as last analysis for copy feature - store only essential data to avoid quota issues
            try {
              // Store minimal data to avoid quota exceeded errors
              // Store minimal data to avoid quota exceeded errors
              // Ensure success flag is explicitly set (handles undefined case)
              const minimalAnalysis = {
                score: analysisResult.score,
                timestamp: new Date().toISOString(),
                summary: analysisResult.analysis?.popup_data?.summary || 
                         analysisResult.analysis?.summary || 
                         'Analysis complete',
                // Explicitly set success: true for successful analyses (undefined treated as success)
                success: analysisResult.success !== false ? true : false
              };
              
              Logger.info('[BG] Prepared minimalAnalysis for storage:', {
                score: minimalAnalysis.score,
                hasSummary: !!minimalAnalysis.summary,
                success: minimalAnalysis.success,
                timestamp: minimalAnalysis.timestamp,
              });
              
              // Log size before storing
              const minimalAnalysisSize = JSON.stringify(minimalAnalysis).length;
              Logger.info('[BG] Storing last_analysis - size check:', {
                minimalAnalysisSize,
                minimalAnalysisSizeKB: (minimalAnalysisSize / 1024).toFixed(2),
                storageArea: 'local',
                hasQuotaCheck: gateway && typeof gateway.checkStorageQuota === 'function',
              });
              
              // Check quota before storing
              if (gateway && typeof gateway.checkStorageQuota === 'function') {
                try {
                  const quotaInfo = await gateway.checkStorageQuota();
                  Logger.info('[BG] Storage quota check result:', quotaInfo);
                  if (quotaInfo.usagePercent > 90) {
                    Logger.warn('[BG] Storage quota nearly exceeded, skipping last_analysis storage', {
                      quotaInfo,
                      minimalAnalysisSize,
                      minimalAnalysisSizeKB: (minimalAnalysisSize / 1024).toFixed(2),
                    });
                  } else {
                    chrome.storage.local.set({ last_analysis: minimalAnalysis }, () => {
                      if (chrome.runtime.lastError) {
                        Logger.error('[BG] Failed to store last_analysis:', {
                          error: chrome.runtime.lastError.message,
                          minimalAnalysisSize,
                          minimalAnalysisSizeKB: (minimalAnalysisSize / 1024).toFixed(2),
                          isQuotaError: chrome.runtime.lastError.message.includes('quota') || chrome.runtime.lastError.message.includes('QUOTA'),
                        });
                      } else {
                        Logger.info('[BG] ✅ Successfully stored last_analysis - score update will trigger popup refresh:', {
                          score: minimalAnalysis.score,
                          success: minimalAnalysis.success,
                          timestamp: minimalAnalysis.timestamp,
                          minimalAnalysisSize,
                          minimalAnalysisSizeKB: (minimalAnalysisSize / 1024).toFixed(2),
                          note: 'Storage change event will notify popup to update UI',
                        });
                      }
                    });
                  }
                } catch (quotaCheckError) {
                  Logger.warn('[BG] Error checking quota, attempting to store anyway:', {
                    error: quotaCheckError.message,
                    minimalAnalysisSize,
                    minimalAnalysisSizeKB: (minimalAnalysisSize / 1024).toFixed(2),
                  });
                  // Fall through to fallback storage
                  chrome.storage.local.set({ last_analysis: minimalAnalysis }, () => {
                    if (chrome.runtime.lastError) {
                      Logger.error('[BG] Failed to store last_analysis (after quota check error):', {
                        error: chrome.runtime.lastError.message,
                        minimalAnalysisSize,
                        minimalAnalysisSizeKB: (minimalAnalysisSize / 1024).toFixed(2),
                        isQuotaError: chrome.runtime.lastError.message.includes('quota') || chrome.runtime.lastError.message.includes('QUOTA'),
                      });
                    } else {
                      Logger.info('[BG] ✅ Successfully stored last_analysis (fallback after quota check error):', {
                        score: minimalAnalysis.score,
                        success: minimalAnalysis.success,
                        timestamp: minimalAnalysis.timestamp,
                      });
                    }
                  });
                }
              } else {
                // Fallback: try to store, handle errors gracefully
                Logger.info('[BG] No quota check available, storing last_analysis directly');
                chrome.storage.local.set({ last_analysis: minimalAnalysis }, () => {
                  if (chrome.runtime.lastError) {
                    const isQuotaError = chrome.runtime.lastError.message.includes('quota') || chrome.runtime.lastError.message.includes('QUOTA');
                    if (isQuotaError) {
                      Logger.warn('[BG] Storage quota exceeded, skipping last_analysis storage:', {
                        error: chrome.runtime.lastError.message,
                        minimalAnalysisSize,
                        minimalAnalysisSizeKB: (minimalAnalysisSize / 1024).toFixed(2),
                      });
                    } else {
                      Logger.error('[BG] Failed to store last_analysis:', {
                        error: chrome.runtime.lastError.message,
                        minimalAnalysisSize,
                        minimalAnalysisSizeKB: (minimalAnalysisSize / 1024).toFixed(2),
                      });
                    }
                  } else {
                    Logger.info('[BG] ✅ Successfully stored last_analysis (fallback) - score update will trigger popup refresh:', {
                      score: minimalAnalysis.score,
                      success: minimalAnalysis.success,
                      timestamp: minimalAnalysis.timestamp,
                      minimalAnalysisSize,
                      minimalAnalysisSizeKB: (minimalAnalysisSize / 1024).toFixed(2),
                      note: 'Storage change event will notify popup to update UI',
                    });
                  }
                });
              }
            } catch (storageError) {
              Logger.warn('[BG] Error storing last_analysis (non-critical):', {
                error: storageError.message,
                stack: storageError.stack,
              });
            }
          } else {
            Logger.warn(
              '[BG] Analysis result has invalid score, not saving to history:',
              analysisResult
            );
          }
        } else {
          // Enhanced error logging for failed analysis results
          Logger.error('[BG] Analysis result indicates failure or error, not saving to history:', {
            success: analysisResult?.success,
            error: analysisResult?.error,
            status: analysisResult?.status,
            statusText: analysisResult?.statusText,
            hasScore: analysisResult?.score !== undefined,
            hasAnalysis: !!analysisResult?.analysis,
            // Log full error response object
            fullErrorResponse: analysisResult,
            // Extract nested error details
            errorDetail: analysisResult?.detail,
            errorMessage: analysisResult?.message,
            errorType: analysisResult?.type,
            // Log all keys to see what backend is sending
            errorKeys: analysisResult ? Object.keys(analysisResult) : [],
            // Log as formatted JSON for complete visibility
            fullErrorResponseJSON: analysisResult ? JSON.stringify(analysisResult, null, 2) : null,
          });
        }

        sendResponse(analysisResult);
      } catch (error) {
        // Enhanced error logging with full backend error details
        Logger.error('[BG] Gateway analysis failed:', {
          message: error.message,
          status: error.status || error.errorResponse?.status,
          statusText: error.statusText || error.errorResponse?.statusText,
          errorData: error.errorData || error.errorResponse?.errorData,
          errorText: error.errorText || error.errorResponse?.errorText,
          // Log full error response if available
          fullErrorResponse: error.errorResponse ? JSON.stringify(error.errorResponse, null, 2) : undefined,
          // Include error stack for debugging
          stack: error.stack,
          // Include all error properties for complete visibility
          errorKeys: Object.keys(error),
        });

        // Provide user-friendly error messages based on error type
        let userMessage = 'Analysis failed. Please try again.';
        let errorCode = 'UNKNOWN';
        let actionable = false;

        // Check HTTP status code first (most reliable)
        if (error.status === 403) {
          // 403 Forbidden - authentication token may be invalid or expired
          userMessage = 'Authentication failed. Please sign in again to use analysis features.';
          errorCode = 'AUTH_REQUIRED';
          actionable = true;
          Logger.warn('[BG] 403 Forbidden - token may be invalid or expired');
        } else if (error.status === 401) {
          // 401 Unauthorized - no token or invalid token
          userMessage = 'Authentication required. Please sign in to use analysis features.';
          errorCode = 'AUTH_REQUIRED';
          actionable = true;
          Logger.warn('[BG] 401 Unauthorized - user must sign in');
        } else if (error.status === 429) {
          userMessage = 'Rate limit exceeded. Please wait a moment and try again.';
          errorCode = 'RATE_LIMIT';
        } else if (error.status >= 500) {
          userMessage = 'Backend error. Please try again in a moment.';
          errorCode = 'BACKEND_ERROR';
        } else if (error.status === 408 || error.status === 504) {
          userMessage =
            'Request timed out. The backend may be slow or unavailable. Please try again.';
          errorCode = 'TIMEOUT';
        } else if (error.message) {
          const errorMsg = error.message.toLowerCase();
          const responseText = (error.responseText || '').toLowerCase();

          // Authentication errors (check message and response text)
          if (
            errorMsg.includes('403') ||
            errorMsg.includes('forbidden') ||
            errorMsg.includes('401') ||
            errorMsg.includes('unauthorized') ||
            responseText.includes('authentication') ||
            responseText.includes('unauthorized') ||
            responseText.includes('forbidden') ||
            responseText.includes('token')
          ) {
            userMessage = 'Authentication required. Please sign in to use analysis features.';
            errorCode = 'AUTH_REQUIRED';
            actionable = true;
          }
          // Network errors
          else if (
            errorMsg.includes('failed to fetch') ||
            errorMsg.includes('network') ||
            errorMsg.includes('connection') ||
            errorMsg.includes('cors')
          ) {
            userMessage = 'Connection failed. Please check your internet connection and try again.';
            errorCode = 'NETWORK_ERROR';
          }
          // Timeout errors
          else if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
            userMessage =
              'Request timed out. The backend may be slow or unavailable. Please try again.';
            errorCode = 'TIMEOUT';
          }
          // Backend errors (500+)
          else if (errorMsg.includes('500') || errorMsg.includes('server error')) {
            userMessage = 'Backend error. Please try again in a moment.';
            errorCode = 'BACKEND_ERROR';
          }
          // Use original message if it's user-friendly
          else if (error.message.length < 100) {
            userMessage = error.message;
          }
        }

        sendResponse({
          success: false,
          error: userMessage,
          errorCode: errorCode,
          statusCode: error.status || null,
          actionable: actionable,
        });
      }
    } catch (err) {
      Logger.error('[BG] Analysis failed:', err);
      sendResponse({
        success: false,
        error: err.message || 'Analysis failed. Please try again.',
      });
    }
  }

  /**
   * Helper function to trim array to fit within quota
   * Removes oldest entries until array size is below maxSizeBytes
   * @param {Array} array - Array to trim
   * @param {number} maxSizeBytes - Maximum size in bytes (default: 7168 = 7KB safety margin)
   * @returns {Array} Trimmed array
   */
  function trimArrayForQuota(array, maxSizeBytes = 7168) {
    if (!Array.isArray(array)) {
      return array;
    }

    let currentSize = JSON.stringify(array).length;
    const originalLength = array.length;

    // Remove oldest entries (from end) until size is below quota
    while (currentSize > maxSizeBytes && array.length > 0) {
      array.pop(); // Remove oldest entry
      currentSize = JSON.stringify(array).length;
    }

    if (originalLength !== array.length) {
      Logger.warn('[BG] Trimmed history array to fit quota:', {
        originalLength,
        trimmedLength: array.length,
        originalSizeKB: (JSON.stringify(Array.from({ length: originalLength }).fill({})).length / 1024).toFixed(2),
        trimmedSizeKB: (currentSize / 1024).toFixed(2),
        maxSizeKB: (maxSizeBytes / 1024).toFixed(2),
      });
    }

    return array;
  }

  /**
   * TRACER BULLET: Save analysis to history
   * EPISTEMIC: Uses mutex protection to prevent race conditions
   * STORAGE: Stores minimal data structure to prevent quota exceeded errors
   */
  async function saveToHistory(text, analysis) {
    try {
      // Extract only essential fields for history display
      // History display only needs: score, bias_type, text, timestamp (content.js:1686)
      const biasType = analysis?.analysis?.bias_type || 
                       analysis?.analysis?.popup_data?.bias_type || 
                       analysis?.bias_type || 
                       'Unknown';

      // Prepare minimal history entry (only essential fields)
      const historyEntry = {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        fullText: text,
        analysis: {
          score: analysis?.score ?? null,
          analysis: {
            bias_type: biasType
          }
        },
        timestamp: new Date().toISOString(),
      };
      
      // Log data size before storing
      const entrySize = JSON.stringify(historyEntry).length;
      const originalAnalysisSize = analysis ? JSON.stringify(analysis).length : 0;
      Logger.info('[BG] Saving to history - minimal data structure:', {
        entrySize,
        entrySizeKB: (entrySize / 1024).toFixed(2),
        originalAnalysisSize,
        originalAnalysisSizeKB: (originalAnalysisSize / 1024).toFixed(2),
        sizeReduction: originalAnalysisSize > 0 ? ((1 - entrySize / originalAnalysisSize) * 100).toFixed(1) + '%' : 'N/A',
        textLength: text.length,
        storageArea: 'sync',
        usingMutexHelper: typeof MutexHelper !== 'undefined',
      });
      
      // EPISTEMIC: Use mutex-protected array append to prevent race conditions
      if (typeof MutexHelper !== 'undefined') {
        try {
          await MutexHelper.appendToArray(
            'analysis_history',
            historyEntry,
            50,
            'sync'
          ); // Keep last 50 entries, use sync storage
          Logger.info('[BG] Successfully saved to history via MutexHelper');
        } catch (mutexError) {
          // Check if it's a quota error
          const isQuotaError = mutexError.message && (
            mutexError.message.includes('quota') || 
            mutexError.message.includes('QUOTA') ||
            mutexError.message.includes('exceeded')
          );

          if (isQuotaError) {
            Logger.warn('[BG] Quota error in MutexHelper, attempting to trim and retry:', {
              error: mutexError.message,
            });
            
            // Try to trim history and retry
            try {
              const history = await new Promise((resolve) => {
                chrome.storage.sync.get(['analysis_history'], (data) => {
                  resolve(data.analysis_history || []);
                });
              });

              // Trim history to fit quota
              const trimmedHistory = trimArrayForQuota([...history, historyEntry], 7168);
              
              // Store trimmed history
              await new Promise((resolve, reject) => {
                chrome.storage.sync.set({ analysis_history: trimmedHistory }, () => {
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                  } else {
                    resolve();
                  }
                });
              });

              Logger.info('[BG] Successfully saved to history after quota trim');
            } catch (retryError) {
              // If retry fails, log warning but don't throw (non-critical operation)
              Logger.warn('[BG] Failed to save history after quota trim (non-critical):', {
                error: retryError.message,
                entrySize,
              });
              // Don't throw - analysis should complete successfully even if history save fails
            }
          } else {
            // Not a quota error, log and continue (don't throw)
            Logger.error('[BG] Error in MutexHelper.appendToArray (non-critical):', {
              error: mutexError.message,
              stack: mutexError.stack,
              entrySize,
            });
            // Don't throw - analysis should complete successfully even if history save fails
          }
        }
      } else {
        // Fallback to direct storage (race condition risk)
        try {
          chrome.storage.sync.get(['analysis_history'], (data) => {
            if (chrome.runtime.lastError) {
              Logger.error('[BG] Error reading analysis_history:', chrome.runtime.lastError.message);
              return;
            }
            
            const history = data.analysis_history || [];
            const currentHistorySize = JSON.stringify(history).length;
            
            Logger.info('[BG] Fallback storage - current history size:', {
              currentHistorySize,
              currentHistorySizeKB: (currentHistorySize / 1024).toFixed(2),
              currentEntries: history.length,
            });

            // Add new entry
            history.unshift(historyEntry);

            // Check quota before storing (8KB limit for sync storage)
            const newHistorySize = JSON.stringify(history).length;
            const SYNC_STORAGE_QUOTA = 8192; // 8KB limit
            const SAFETY_MARGIN = 7168; // 7KB safety margin

            if (newHistorySize > SAFETY_MARGIN) {
              Logger.warn('[BG] History size approaching quota, trimming:', {
                newHistorySize,
                newHistorySizeKB: (newHistorySize / 1024).toFixed(2),
                entriesBeforeTrim: history.length,
              });
              
              // Trim to fit within safety margin
              trimArrayForQuota(history, SAFETY_MARGIN);
              
              Logger.info('[BG] History trimmed:', {
                entriesAfterTrim: history.length,
                finalSizeKB: (JSON.stringify(history).length / 1024).toFixed(2),
              });
            }

            const finalHistorySize = JSON.stringify(history).length;
            Logger.info('[BG] Fallback storage - final history size:', {
              finalHistorySize,
              finalHistorySizeKB: (finalHistorySize / 1024).toFixed(2),
              finalEntries: history.length,
            });

            chrome.storage.sync.set({ analysis_history: history }, () => {
              if (chrome.runtime.lastError) {
                const error = chrome.runtime.lastError;
                const isQuotaError = error.message && (
                  error.message.includes('quota') || 
                  error.message.includes('QUOTA') ||
                  error.message.includes('exceeded')
                );

                if (isQuotaError) {
                  // Try to trim and retry once
                  Logger.warn('[BG] Quota error detected, attempting trim and retry:', {
                    error: error.message,
                    finalHistorySize,
                    finalHistorySizeKB: (finalHistorySize / 1024).toFixed(2),
                  });

                  // Trim more aggressively and retry
                  const retryHistory = trimArrayForQuota([...history], 6144); // Trim to 6KB
                  
                  chrome.storage.sync.set({ analysis_history: retryHistory }, () => {
                    if (chrome.runtime.lastError) {
                      Logger.warn('[BG] Failed to save history after retry (non-critical):', {
                        error: chrome.runtime.lastError.message,
                        finalHistorySize,
                      });
                      // Don't throw - analysis should complete successfully
                    } else {
                      Logger.info('[BG] Successfully saved to history after quota retry');
                    }
                  });
                } else {
                  Logger.error('[BG] Error saving analysis_history (fallback):', {
                    error: error.message,
                    finalHistorySize,
                    finalHistorySizeKB: (finalHistorySize / 1024).toFixed(2),
                  });
                  // Don't throw - analysis should complete successfully
                }
              } else {
                Logger.info('[BG] Successfully saved to history via fallback');
              }
            });
          });
        } catch (fallbackError) {
          // Log error but don't throw (non-critical operation)
          Logger.warn('[BG] Error in fallback storage (non-critical):', {
            error: fallbackError.message,
            stack: fallbackError.stack,
            entrySize,
          });
          // Don't throw - analysis should complete successfully even if history save fails
        }
      }
    } catch (error) {
      // Log error but don't throw (non-critical operation)
      Logger.warn('[BG] Error in saveToHistory (non-critical):', {
        error: error.message,
        stack: error.stack,
        textLength: text.length,
        analysisKeys: analysis ? Object.keys(analysis) : [],
      });
      // Don't throw - analysis should complete successfully even if history save fails
    }
  }

  /**
   * TRACER BULLET: Handle subscription status request
   */
  async function handleSubscriptionStatusRequest(sendResponse) {
    try {
      if (!gateway) {
        gateway = initializeGateway();
      }

      if (!gateway || !gateway.subscriptionService) {
        sendResponse({
          success: false,
          error: 'Subscription service not initialized',
        });
        return;
      }

      const subscription = await gateway.subscriptionService.getCurrentSubscription();
      let usage = null;

      try {
        usage = await gateway.subscriptionService.getUsage();
      } catch (usageError) {
        Logger.warn('[BG] Failed to get usage, continuing without it:', usageError);
      }

      sendResponse({
        success: true,
        subscription: subscription,
        usage: usage,
      });
    } catch (err) {
      Logger.error('[BG] Failed to get subscription status:', err);
      sendResponse({
        success: false,
        error: err.message,
      });
    }
  }

  /**
   * TRACER BULLET: Clear subscription cache
   */
  function handleClearSubscriptionCache(sendResponse) {
    try {
      if (!gateway) {
        gateway = initializeGateway();
      }

      if (gateway && gateway.subscriptionService) {
        gateway.subscriptionService.clearCache();
        Logger.info('[BG] Subscription cache cleared');
        sendResponse({ success: true, message: 'Cache cleared' });
      } else {
        sendResponse({
          success: false,
          error: 'Subscription service not initialized',
        });
      }
    } catch (err) {
      Logger.error('[BG] Failed to clear subscription cache:', err);
      sendResponse({
        success: false,
        error: err.message,
      });
    }
  }

  /**
   * Handle guard status requests - Simplified for unified gateway
   */
  async function handleGuardStatusRequest(sendResponse) {
    try {
      if (!gateway) {
        gateway = initializeGateway();
      }

      if (!gateway) {
        throw new Error('AiGuardian Gateway not initialized');
      }

      // Use simplified gateway status (just connected or not)
      const status = await gateway.getGatewayStatus();
      // Transform status to match expected format: { gateway_connected: boolean }
      const transformedStatus = {
        gateway_connected: status.connected || false,
        gateway_url: status.gateway_url,
        last_check: status.last_check,
        error: status.error || null,
      };
      sendResponse({ success: true, status: transformedStatus });
    } catch (err) {
      Logger.error('[BG] Failed to get guard status:', err);
      sendResponse({
        success: false,
        error: err.message,
        status: {
          gateway_connected: false,
          error: err.message,
        },
      });
    }
  }

  /**
   * Guard configuration is handled by backend now
   */
  async function handleGuardConfigUpdate(payload, sendResponse) {
    try {
      // Client doesn't manage individual guards anymore
      // This is handled by the backend
      sendResponse({
        success: true,
        message: 'Guard configuration is managed by backend',
      });
    } catch (err) {
      Logger.error('[BG] Guard config update not supported:', err);
      sendResponse({ success: false, error: 'Guards are managed by backend' });
    }
  }

  /**
   * Handle configuration requests - Simplified
   */
  async function handleCentralConfigRequest(sendResponse) {
    try {
      if (!gateway) {
        gateway = initializeGateway();
      }

      if (!gateway) {
        throw new Error('AiGuardian Gateway not initialized');
      }

      const config = await gateway.getConfiguration();
      sendResponse({ success: true, config });
    } catch (err) {
      Logger.error('[BG] Failed to get config:', err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * Handle configuration updates - Simplified
   */
  async function handleCentralConfigUpdate(payload, sendResponse) {
    try {
      if (!gateway) {
        gateway = initializeGateway();
      }

      if (!gateway) {
        throw new Error('AiGuardian Gateway not initialized');
      }

      await gateway.updateConfiguration(payload);
      sendResponse({ success: true });
    } catch (err) {
      Logger.error('[BG] Failed to update config:', err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle diagnostics requests
   */
  async function handleDiagnosticsRequest(sendResponse) {
    try {
      if (!gateway) {
        gateway = initializeGateway();
      }

      if (!gateway) {
        throw new Error('AiGuardian Gateway not initialized');
      }

      // getDiagnostics is async; await it to avoid sending a Promise to the UI
      const diagnostics = await gateway.getDiagnostics();
      sendResponse({ success: true, diagnostics });
    } catch (err) {
      Logger.error('[BG] Failed to get diagnostics:', err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle trace statistics requests
   */
  async function handleTraceStatsRequest(sendResponse) {
    try {
      if (!gateway) {
        gateway = initializeGateway();
      }

      if (!gateway) {
        throw new Error('AiGuardian Gateway not initialized');
      }

      const traceStats = gateway.getTraceStats();
      sendResponse({ success: true, traceStats });
    } catch (err) {
      Logger.error('[BG] Failed to get trace stats:', err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle gateway connection test with tracing
   */
  async function handleGatewayConnectionTest(sendResponse) {
    try {
      if (!gateway) {
        gateway = initializeGateway();
      }

      if (!gateway) {
        throw new Error('AiGuardian Gateway not initialized');
      }

      const startTime = Date.now();
      const isConnected = await gateway.testGatewayConnection();
      const responseTime = Date.now() - startTime;

      Logger.info(
        `[BG] Gateway connection test: ${isConnected ? 'SUCCESS' : 'FAILED'} (${responseTime}ms)`
      );

      sendResponse({
        success: isConnected,
        responseTime,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      Logger.error('[BG] Gateway connection test failed:', err);
      sendResponse({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * EPISTEMIC: Handle BiasGuard epistemic calibration
   * Pattern: AEYON × ALRAX × YAGNI × ZERO × JØHN × Abë = ATOMIC ARCHISTRATION
   * Execution: REC × 42PT × ACT × LFG = 100% Success
   */
  async function handleEpistemicCalibration(sendResponse) {
    try {
      Logger.info('[BG] 🔮 Starting Epistemic Calibration...');
      
      // Check if calibration system is available
      if (typeof BiasGuardEpistemicCalibration === 'undefined') {
        throw new Error('Epistemic calibration system not loaded');
      }
      
      // Ensure gateway is initialized
      if (!gateway) {
        gateway = initializeGateway();
      }
      
      if (!gateway) {
        throw new Error('Gateway not available');
      }
      
      // Initialize calibration system
      // eslint-disable-next-line no-undef
      const calibrator = new BiasGuardEpistemicCalibration();
      
      // Run calibration
      const calibrationResult = await calibrator.runCalibration(gateway);
      
      Logger.info('[BG] ✅ Epistemic Calibration Complete', {
        overallCertainty: calibrationResult.overallCertainty,
        validated: calibrationResult.validated
      });
      
      sendResponse({
        success: true,
        calibration: calibrationResult,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      Logger.error('[BG] Epistemic calibration failed:', err);
      sendResponse({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // TRACER BULLET: Add periodic health checks
  try {
    chrome.alarms.create('gateway_health_check', { periodInMinutes: 5 });
  } catch (alarmError) {
    Logger.warn('[BG] Failed to create health check alarm:', alarmError);
  }
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'gateway_health_check') {
      try {
        if (!gateway) {
          gateway = initializeGateway();
        }

        if (gateway) {
          const isConnected = await gateway.testGatewayConnection();
          if (!isConnected) {
            Logger.warn('[BG] Gateway connection lost');
          }
        } else {
          Logger.warn('[BG] Gateway not available for health check');
        }
      } catch (err) {
        Logger.error('[BG] Health check failed:', err);
      }
    }
  });
} catch (err) {
  Logger.error('[BG] Background script error:', err);
}
