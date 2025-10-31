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
importScripts('src/constants.js');
importScripts('src/logging.js');
importScripts('src/string-optimizer.js');
importScripts('src/cache-manager.js');
importScripts('src/gateway.js');

let gateway = null;

try {
  // Extension installation handler
  chrome.runtime.onInstalled.addListener(async () => {
    Logger.info("[BG] Installed: AiGuardian Chrome Ext v1.0.0");
    
    // Initialize AiGuardian Gateway
    gateway = new AiGuardianGateway();
    
    // Initialize default settings
    await initializeDefaultSettings();
    
    // Create context menus
    createContextMenus();
  });

  // Extension startup handler (runs every time browser starts)
  chrome.runtime.onStartup.addListener(async () => {
    Logger.info("[BG] Startup: AiGuardian Chrome Ext v1.0.0");
    
    // Initialize AiGuardian Gateway
    if (!gateway) {
      gateway = new AiGuardianGateway();
    }
    
    // Recreate context menus on startup
    createContextMenus();
  });

  // Also create context menus immediately when service worker loads
  // This ensures menus are available even if extension was already installed
  (async function initializeOnLoad() {
    Logger.info("[BG] Service worker loaded");
    
    // Initialize gateway
    if (!gateway) {
      gateway = new AiGuardianGateway();
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
      analysis_history: []
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

  /**
   * TRACER BULLET: Create context menus for right-click analysis
   */
  function createContextMenus() {
    // Remove all existing menus first to avoid duplicates
    chrome.contextMenus.removeAll(() => {
      // Create analyze text menu
      chrome.contextMenus.create({
        id: 'analyze-text',
        title: 'Analyze with AiGuardian',
        contexts: ['selection']
      }, () => {
        if (chrome.runtime.lastError) {
          Logger.error("[BG] Error creating analyze-text menu:", chrome.runtime.lastError);
        }
      });

      // Create search web menu
      chrome.contextMenus.create({
        id: 'search-web',
        title: 'Search Web for Context',
        contexts: ['selection']
      }, () => {
        if (chrome.runtime.lastError) {
          Logger.error("[BG] Error creating search-web menu:", chrome.runtime.lastError);
        }
      });

      // Create copy analysis menu
      chrome.contextMenus.create({
        id: 'copy-analysis',
        title: 'Copy Last Analysis',
        contexts: ['page']
      }, () => {
        if (chrome.runtime.lastError) {
          Logger.error("[BG] Error creating copy-analysis menu:", chrome.runtime.lastError);
        }
      });

      // Create clear highlights menu
      chrome.contextMenus.create({
        id: 'clear-highlights',
        title: 'Clear All Highlights',
        contexts: ['page']
      }, () => {
        if (chrome.runtime.lastError) {
          Logger.error("[BG] Error creating clear-highlights menu:", chrome.runtime.lastError);
        }
      });

      Logger.info("[BG] Context menus created");
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
              payload: response
            });
          });
        }
        break;

      case 'search-web':
        if (info.selectionText) {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(info.selectionText)}`;
          chrome.tabs.create({ url: searchUrl });
          Logger.info("[BG] Web search opened", { query: info.selectionText });
        }
        break;

      case 'copy-analysis':
        chrome.storage.local.get(['last_analysis'], (data) => {
          if (data.last_analysis) {
            const analysisText = JSON.stringify(data.last_analysis, null, 2);
            chrome.tabs.sendMessage(tab.id, {
              type: 'COPY_TO_CLIPBOARD',
              payload: analysisText
            });
            Logger.info("[BG] Analysis copied to clipboard");
          }
        });
        break;

      case 'clear-highlights':
        chrome.tabs.sendMessage(tab.id, {
          type: 'CLEAR_HIGHLIGHTS'
        });
        Logger.info("[BG] Highlights cleared");
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
              type: 'ANALYZE_SELECTION_COMMAND'
            });
            Logger.info("[BG] Analyze selection command triggered");
            break;

          case 'clear-highlights':
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'CLEAR_HIGHLIGHTS'
            });
            Logger.info("[BG] Clear highlights command triggered");
            break;

          case 'show-history':
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'SHOW_HISTORY'
            });
            Logger.info("[BG] Show history command triggered");
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
      'https://aiguardian.ai',
      'https://dashboard.aiguardian.ai',
      'https://localhost',
      'https://127.0.0.1'
    ];
    
    const isAllowedOrigin = allowedOrigins.some(origin => sender.origin.startsWith(origin));
    
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
          // TRACER BULLET: Use AiGuardian Gateway for analysis
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

        case "RECREATE_CONTEXT_MENUS":
          // TRACER BULLET: Manually recreate context menus
          try {
            createContextMenus();
            Logger.info("[BG] Context menus recreated manually");
            sendResponse({ success: true, message: "Context menus recreated" });
          } catch (err) {
            Logger.error("[BG] Failed to recreate context menus:", err);
            sendResponse({ success: false, error: err.message });
          }
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
   * TRACER BULLET: Text analysis through AiGuardian Gateway
   */
  async function handleTextAnalysis(text, sendResponse) {
    try {
      Logger.info("[BG] Text analysis request received:", text?.substring(0, 50) + "...");
      
      // TRACER BULLET: Mock analysis for immediate functionality
      const mockAnalysis = generateMockAnalysis(text);
      Logger.info("[BG] Mock analysis generated:", mockAnalysis);
      
      // Save to analysis history
      saveToHistory(text, mockAnalysis);
      
      // Save as last analysis for copy feature
      chrome.storage.local.set({ last_analysis: mockAnalysis });
      
      // Simulate network delay for realism
      setTimeout(() => {
        sendResponse(mockAnalysis);
      }, 500 + Math.random() * 1000); // 500-1500ms delay
      
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
   * TRACER BULLET: Save analysis to history
   */
  function saveToHistory(text, analysis) {
    chrome.storage.sync.get(['analysis_history'], (data) => {
      const history = data.analysis_history || [];
      
      // Add new entry
      history.unshift({
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        fullText: text,
        analysis: analysis,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 50 entries
      if (history.length > 50) {
        history.pop();
      }
      
      chrome.storage.sync.set({ analysis_history: history });
    });
  }

  /**
   * TRACER BULLET: Generate mock analysis for immediate functionality
   * This provides realistic bias analysis without requiring backend integration
   */
  function generateMockAnalysis(text) {
    const textLower = text.toLowerCase();
    
    // Analyze text for bias indicators
    let biasScore = 0.2; // Start with low bias
    let biasType = 'neutral';
    let confidence = 0.9;
    
    // Check for emotional language
    const emotionalWords = ['amazing', 'terrible', 'incredible', 'awful', 'fantastic', 'horrible', 'love', 'hate', 'best', 'worst'];
    const emotionalCount = emotionalWords.filter(word => textLower.includes(word)).length;
    if (emotionalCount > 0) {
      biasScore += 0.3;
      biasType = 'emotional';
    }
    
    // Check for subjective statements
    const subjectiveWords = ['obviously', 'clearly', 'undoubtedly', 'certainly', 'definitely', 'absolutely'];
    const subjectiveCount = subjectiveWords.filter(word => textLower.includes(word)).length;
    if (subjectiveCount > 0) {
      biasScore += 0.2;
      biasType = 'subjective';
    }
    
    // Check for loaded language
    const loadedWords = ['always', 'never', 'all', 'none', 'everyone', 'nobody', 'perfect', 'flawless'];
    const loadedCount = loadedWords.filter(word => textLower.includes(word)).length;
    if (loadedCount > 0) {
      biasScore += 0.25;
      biasType = 'loaded_language';
    }
    
    // Check for technical content (lower bias)
    const technicalWords = ['function', 'algorithm', 'data', 'analysis', 'method', 'process', 'system'];
    const technicalCount = technicalWords.filter(word => textLower.includes(word)).length;
    if (technicalCount > 2) {
      biasScore -= 0.1;
      biasType = 'technical';
    }
    
    // Check for question marks (uncertainty)
    if (text.includes('?')) {
      biasScore -= 0.1;
      confidence -= 0.1;
    }
    
    // Ensure score is between 0 and 1
    biasScore = Math.max(0, Math.min(1, biasScore));
    confidence = Math.max(0.5, Math.min(1, confidence));
    
    // Add some randomness for variety
    biasScore += (Math.random() - 0.5) * 0.1;
    biasScore = Math.max(0, Math.min(1, biasScore));
    
    return {
      success: true,
      score: biasScore,
      analysis: {
        bias_type: biasType,
        confidence: confidence,
        word_count: text.split(' ').length,
        emotional_indicators: emotionalCount,
        subjective_indicators: subjectiveCount,
        loaded_language_indicators: loadedCount,
        technical_indicators: technicalCount
      },
      timestamp: new Date().toISOString(),
      trace_bullet: true // Indicate this is mock data
    };
  }

  /**
   * Handle guard status requests - Simplified for unified gateway
   */
  async function handleGuardStatusRequest(sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AiGuardian Gateway not initialized");
      }

      // Use simplified gateway status (just connected or not)
      const status = await gateway.getGatewayStatus();
      sendResponse({ success: true, status });
    } catch (err) {
      Logger.error("[BG] Failed to get guard status:", err);
      sendResponse({ success: false, error: err.message });
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
        message: "Guard configuration is managed by backend"
      });
    } catch (err) {
      Logger.error("[BG] Guard config update not supported:", err);
      sendResponse({ success: false, error: "Guards are managed by backend" });
    }
  }

  /**
   * Handle configuration requests - Simplified
   */
  async function handleCentralConfigRequest(sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AiGuardian Gateway not initialized");
      }

      const config = await gateway.getConfiguration();
      sendResponse({ success: true, config });
    } catch (err) {
      Logger.error("[BG] Failed to get config:", err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * Handle configuration updates - Simplified
   */
  async function handleCentralConfigUpdate(payload, sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AiGuardian Gateway not initialized");
      }

      await gateway.updateConfiguration(payload);
      sendResponse({ success: true });
    } catch (err) {
      Logger.error("[BG] Failed to update config:", err);
      sendResponse({ success: false, error: err.message });
    }
  }

  /**
   * TRACER BULLET: Handle diagnostics requests
   */
  async function handleDiagnosticsRequest(sendResponse) {
    try {
      if (!gateway) {
        throw new Error("AiGuardian Gateway not initialized");
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
        throw new Error("AiGuardian Gateway not initialized");
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
        throw new Error("AiGuardian Gateway not initialized");
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

