/**
 * Background Service Worker for AI Guardians Chrome Extension
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Configure your AI Guardians gateway endpoint
 * - Implement authentication with your guard services
 * - Add custom guard types and analysis pipelines
 * - Integrate with your central logging and monitoring
 */

// Import the AI Guardians Gateway and dependencies
importScripts('constants.js');
importScripts('logging.js');
importScripts('string-optimizer.js');
importScripts('cache-manager.js');
importScripts('gateway.js');

let gateway = null;

try {
  // Extension installation handler
  chrome.runtime.onInstalled.addListener(async () => {
    Logger.info("[BG] Installed: AI Guardians Chrome Ext v0.1.0");
    
    // Initialize AI Guardians Gateway
    gateway = new AIGuardiansGateway();
    
    // Initialize default settings
    await initializeDefaultSettings();
  });

  /**
   * TRACER BULLET: Initialize default settings for AI Guardians
   */
  async function initializeDefaultSettings() {
    // Constants are now available via importScripts
    const defaultSettings = {
      gateway_url: DEFAULT_CONFIG.GATEWAY_URL,
      api_key: DEFAULT_CONFIG.API_KEY,
      guard_services: DEFAULT_CONFIG.GUARD_SERVICES,
      logging_config: DEFAULT_CONFIG.LOGGING_CONFIG,
      analysis_pipeline: DEFAULT_CONFIG.ANALYSIS_PIPELINE
    };

    chrome.storage.sync.get(Object.keys(defaultSettings), (data) => {
      const settingsToSave = {};
      for (const [key, defaultValue] of Object.entries(defaultSettings)) {
        if (data[key] === undefined) {
          settingsToSave[key] = defaultValue;
        }
      }
      
      if (Object.keys(settingsToSave).length > 0) {
        chrome.storage.sync.set(settingsToSave);
        Logger.info("[BG] Initialized default settings");
      }
    });
  }

  // Message handler for content script communication
  
  /**
   * TRACER BULLET: Enhanced message validation
   */
  
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
      'https://your-ai-guardians-gateway.com',
      'https://localhost',
      'https://127.0.0.1'
    ];
    
    const isAllowedOrigin = allowedOrigins.some(origin => sender.origin.startsWith(origin));
    
    if (!isAllowedOrigin) {
      throw new Error(`Unauthorized origin: ${sender.origin}`);
    }
    
    return true;
  }


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
      'TEST_GUARD_SERVICE'
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
    try {
      switch (request.type) {
        case "ANALYZE_TEXT":
          // TRACER BULLET: Use AI Guardians Gateway for analysis
          handleTextAnalysis(request.payload, sendResponse);
          return true; // Keep message channel open for async response
          
        case "GET_SETTINGS":
          // TRACER BULLET: Return current settings
          chrome.storage.sync.get(['bias_threshold'], (data) => {
            sendResponse({ success: true, settings: data });
          });
          return true;

        case "GET_GUARD_STATUS":
          // TRACER BULLET: Get guard service status
          handleGuardStatusRequest(sendResponse);
          return true;

        case "UPDATE_GUARD_CONFIG":
          // TRACER BULLET: Update guard service configuration
          handleGuardConfigUpdate(request.payload, sendResponse);
          return true;

        case "GET_CENTRAL_CONFIG":
          // TRACER BULLET: Get central configuration
          handleCentralConfigRequest(sendResponse);
          return true;

        case "UPDATE_CENTRAL_CONFIG":
          // TRACER BULLET: Update central configuration
          handleCentralConfigUpdate(request.payload, sendResponse);
          return true;

        case "GET_DIAGNOSTICS":
          // TRACER BULLET: Get comprehensive diagnostics
          handleDiagnosticsRequest(sendResponse);
          return true;

        case "GET_TRACE_STATS":
          // TRACER BULLET: Get trace statistics
          handleTraceStatsRequest(sendResponse);
          return true;

        case "TEST_GATEWAY_CONNECTION":
          // TRACER BULLET: Test gateway connection with tracing
          handleGatewayConnectionTest(sendResponse);
          return true;
          
        default:
          Logger.warn("[BG] Unknown message type:", request.type);
          sendResponse({ success: false, error: "Unknown message type" });
      }
    } catch (err) {
      Logger.error("[BG] Message handler error:", err);
      sendResponse({ success: false, error: err.message });
    }
  });

  /**
   * TRACER BULLET: Text analysis through AI Guardians Gateway
   */
  async function handleTextAnalysis(text, sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AI Guardians Gateway not initialized");
      }

      // Use the gateway for analysis
      const result = await gateway.analyzeText(text, {
        source: 'chrome_extension',
        timestamp: new Date().toISOString()
      });

      // Transform result for content script
      const transformedResult = {
        success: true,
        score: result.overall_score || 0.5,
        analysis: {
          bias_type: result.bias_type || 'unknown',
          confidence: result.confidence || 0.85,
          suggestions: result.suggestions || [],
          guard_results: result.guards || []
        }
      };

      sendResponse(transformedResult);
    } catch (err) {
      Logger.error("[BG] Analysis failed:", err);
      sendResponse({ 
        success: false, 
        error: err.message,
        fallback_score: Math.random() * 0.8 + 0.1 // Fallback for development
      });
    }
  }

  /**
   * TRACER BULLET: Handle guard status requests
   */
  async function handleGuardStatusRequest(sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AI Guardians Gateway not initialized");
      }

      const status = await gateway.getGuardServiceStatus();
      sendResponse({ success: true, status });
    } catch (err) {
      Logger.error("[BG] Failed to get guard status:", err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle guard configuration updates
   */
  async function handleGuardConfigUpdate(payload, sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AI Guardians Gateway not initialized");
      }

      const { guardName, config } = payload;
      await gateway.updateGuardService(guardName, config);
      sendResponse({ success: true });
    } catch (err) {
      Logger.error("[BG] Failed to update guard config:", err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle central configuration requests
   */
  async function handleCentralConfigRequest(sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AI Guardians Gateway not initialized");
      }

      const config = await gateway.getCentralConfiguration();
      sendResponse({ success: true, config });
    } catch (err) {
      Logger.error("[BG] Failed to get central config:", err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle central configuration updates
   */
  async function handleCentralConfigUpdate(payload, sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AI Guardians Gateway not initialized");
      }

      await gateway.updateCentralConfiguration(payload);
      sendResponse({ success: true });
    } catch (err) {
      Logger.error("[BG] Failed to update central config:", err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle diagnostics requests
   */
  async function handleDiagnosticsRequest(sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AI Guardians Gateway not initialized");
      }

      const diagnostics = gateway.getDiagnostics();
      sendResponse({ success: true, diagnostics });
    } catch (err) {
      Logger.error("[BG] Failed to get diagnostics:", err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle trace statistics requests
   */
  async function handleTraceStatsRequest(sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AI Guardians Gateway not initialized");
      }

      const traceStats = gateway.getTraceStats();
      sendResponse({ success: true, traceStats });
    } catch (err) {
      Logger.error("[BG] Failed to get trace stats:", err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle gateway connection test with tracing
   */
  async function handleGatewayConnectionTest(sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AI Guardians Gateway not initialized");
      }

      const startTime = Date.now();
      const isConnected = await gateway.testGatewayConnection();
      const responseTime = Date.now() - startTime;

      Logger.info(`[BG] Gateway connection test: ${isConnected ? 'SUCCESS' : 'FAILED'} (${responseTime}ms)`);

      sendResponse({ 
        success: isConnected, 
        responseTime,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      Logger.error("[BG] Gateway connection test failed:", err);
      sendResponse({ 
        success: false, 
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // TRACER BULLET: Add periodic health checks
  chrome.alarms.create('gateway_health_check', { periodInMinutes: 5 });
  
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'gateway_health_check' && gateway) {
      try {
        const isConnected = await gateway.testGatewayConnection();
        if (!isConnected) {
          Logger.warn("[BG] Gateway connection lost");
        }
      } catch (err) {
        Logger.error("[BG] Health check failed:", err);
      }
    }
  });

} catch (err) {
  Logger.error("[BG] Background script error:", err);
}

