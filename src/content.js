/**
 * Content Script for AiGuardian Chrome Extension
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Add more sophisticated text selection detection
 * - Implement keyboard shortcuts for analysis
 * - Add context menu integration
 * - Consider adding highlighting for analyzed text
 * - Add user feedback collection
 */

(function() {
  'use strict';

  // NOTE: Constants duplication is necessary here because content scripts run in isolated
  // contexts and cannot directly import from constants.js. These values must be kept
  // in sync with src/constants.js. If you update constants.js, update these values too.
  // 
  // Content scripts cannot use importScripts() - they run in the page context, not worker context.
  // Alternative: Could sync via chrome.storage, but adds latency and complexity.
  // 
  // Source of truth: src/constants.js
  const TEXT_ANALYSIS = {
    MIN_SELECTION_LENGTH: 10,        // Must match constants.js TEXT_ANALYSIS.MIN_SELECTION_LENGTH
    MAX_SELECTION_LENGTH: 5000,      // Must match constants.js TEXT_ANALYSIS.MAX_SELECTION_LENGTH
    MAX_TEXT_LENGTH: 10000,          // Must match constants.js TEXT_ANALYSIS.MAX_TEXT_LENGTH
    DEBOUNCE_DELAY: 300,              // Must match constants.js TEXT_ANALYSIS.DEBOUNCE_DELAY
    BADGE_DISPLAY_TIME: 3000          // Must match constants.js TEXT_ANALYSIS.BADGE_DISPLAY_TIME
  };
  
  const ERROR_MESSAGES = {
    SELECTION_TOO_SHORT: 'Selection too short for analysis',
    SELECTION_TOO_LONG: 'Text too long for analysis',
    ANALYSIS_FAILED: 'Analysis failed',
    CONNECTION_FAILED: 'Connection to backend failed',
    INVALID_API_KEY: 'Invalid API key format',
    TIMEOUT_ERROR: 'Request timed out'
  };
  
  const SUCCESS_MESSAGES = {
    ANALYSIS_COMPLETE: 'Analysis complete',
    CONNECTION_SUCCESS: 'Connected to backend',
    CONFIG_SAVED: 'Configuration saved'
  };
  
  // Configuration
  const CONFIG = {
    minSelectionLength: TEXT_ANALYSIS.MIN_SELECTION_LENGTH,
    maxSelectionLength: TEXT_ANALYSIS.MAX_SELECTION_LENGTH,
    badgeDisplayTime: TEXT_ANALYSIS.BADGE_DISPLAY_TIME,
    debounceDelay: TEXT_ANALYSIS.DEBOUNCE_DELAY
  };

  let debounceTimer = null;
  let currentBadge = null;
  let eventListeners = [];
  let activeHighlights = []; // Array to track our highlight elements

  /**
   * Analyzes the currently selected text for bias and other issues
   * @function analyzeSelection
   * @description Enhanced text analysis with error handling and validation
   * @returns {void}
   */
  function analyzeSelection() {
    const selection = window.getSelection();
    const selectionText = selection?.toString()?.trim() || "";
    
    // TRACER BULLET: Capture the selection range to enable highlighting
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;

    // Validate selection length
    if (selectionText.length < CONFIG.minSelectionLength) {
      Logger.info("[CS] Selection too short:", selectionText.length);
      return;
    }
    
    if (selectionText.length > CONFIG.maxSelectionLength) {
      Logger.warn("[CS] Selection too long:", selectionText.length);
      showBadge(ERROR_MESSAGES.SELECTION_TOO_LONG, "warning");
      return;
    }

    // Show loading indicator
    showBadge("Analyzing...", "loading");

    // Send to background script
    chrome.runtime.sendMessage(
      { type: "ANALYZE_TEXT", payload: selectionText },
      (response) => {
        if (chrome.runtime.lastError) {
          Logger.error("[CS] Runtime error:", chrome.runtime.lastError);
          showBadge(ERROR_MESSAGES.ANALYSIS_FAILED, "error");
          return;
        }

        if (!response || !response.success) {
          Logger.error("[CS] Analysis failed:", response?.error);
          showBadge(ERROR_MESSAGES.ANALYSIS_FAILED, "error");
          return;
        }

        // TRACER BULLET: Display results with enhanced UI and pass the range for highlighting
        displayAnalysisResults(response, range);
      }
    );
  }

  /**
   * Displays analysis results in a user-friendly badge
   * @function displayAnalysisResults
   * @param {Object} response - The analysis response from the backend
   * @param {Range | null} range - The DOM range of the analyzed text selection
   * @param {number} response.score - The overall bias score (0-1)
   * @param {Object} response.analysis - Detailed analysis results
   * @returns {void}
   */
  function displayAnalysisResults(response, range) {
    // TRACER BULLET: Highlight the text on the page
    if (range) {
      highlightSelection(range, response.score);
    }
    
    const score = Math.round(response.score * 100);
    const analysis = response.analysis || {};
    
    // Create enhanced badge with more information
    const badge = document.createElement("div");
    // Create content using safe DOM methods
    const badgeContent = document.createElement("div");
    badgeContent.style.cssText = "display: flex; align-items: center; gap: 8px;";
    
    const scoreSpan = document.createElement("span");
    scoreSpan.textContent = 'Bias Score: ' + score + '%';
    
    const confidenceSpan = document.createElement("span");
    confidenceSpan.style.cssText = "font-size: 10px; opacity: 0.8;";
    confidenceSpan.textContent = analysis.confidence ? '(' + Math.round(analysis.confidence * 100) + ')' : '';
    
    badgeContent.appendChild(scoreSpan);
    badgeContent.appendChild(confidenceSpan);
    badge.appendChild(badgeContent);
    
    if (analysis.bias_type) {
      const typeDiv = document.createElement("div");
      typeDiv.style.cssText = "font-size: 10px; margin-top: 4px;";
      typeDiv.textContent = `Type: ${analysis.bias_type}`;
      badge.appendChild(typeDiv);
    }
    
    badge.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      background: ${getScoreColor(score)};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 2147483647;
      font: 12px system-ui, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 300px;
      cursor: pointer;
    `;

    // Add click handler for more details
    const clickHandler = () => {
      showDetailedAnalysis(response);
    };
    badge.addEventListener('click', clickHandler);
    
    // Store event listener for cleanup
    eventListeners.push({ element: badge, event: 'click', handler: clickHandler });

    document.body.appendChild(badge);
    currentBadge = badge;
    
    // Auto-remove after delay
    const removeTimer = setTimeout(() => {
      cleanupBadge(badge);
    }, CONFIG.badgeDisplayTime);
    
    // Store timer for cleanup
    badge._removeTimer = removeTimer;
  }

  /**
   * Wraps the given DOM range in a styled span to highlight it.
   * @function highlightSelection
   * @param {Range} range - The DOM range to highlight.
   * @param {number} score - The analysis score, used to determine highlight color.
   */
  function highlightSelection(range, score) {
    try {
      const highlightSpan = document.createElement("span");
      highlightSpan.style.backgroundColor = getScoreColor(score);
      highlightSpan.style.color = "#FFFFFF";
      highlightSpan.style.borderRadius = "3px";
      highlightSpan.style.padding = "2px 1px";
      highlightSpan.className = "aiguardian-highlight"; // Add class for easy cleanup
      
      // The surroundContents method is a clean way to wrap the selection.
      // It can fail if the selection spans across incompatible DOM nodes.
      range.surroundContents(highlightSpan);
      
      activeHighlights.push(highlightSpan);
    } catch (e) {
      Logger.error("[CS] Failed to highlight text:", e.message);
    }
  }

  /**
   * TRACER BULLET: Color coding for bias scores
   */
  function getScoreColor(score) {
    if (score < 30) return '#4CAF50'; // Green - low bias
    if (score < 60) return '#FF9800'; // Orange - medium bias
    return '#F44336'; // Red - high bias
  }

  /**
   * TRACER BULLET: Show status badges
   */
  function showBadge(message, type = "info") {
    if (currentBadge) {
      currentBadge.remove();
    }

    const badge = document.createElement("div");
    badge.textContent = message;
    
    const colors = {
      loading: '#2196F3',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3'
    };

    badge.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      background: ${colors[type]};
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      z-index: 2147483647;
      font: 12px system-ui, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(badge);
    currentBadge = badge;

    const removeTimer = setTimeout(() => {
      cleanupBadge(badge);
    }, 2000);
    
    // Store timer for cleanup
    badge._removeTimer = removeTimer;
  }

  /**
   * TRACER BULLET: Detailed analysis modal (placeholder)
   */
  function showDetailedAnalysis(response) {
    Logger.info("[CS] Showing detailed analysis");
    // TODO: Replace alert with proper modal dialog
    showModalAnalysis(response);
  }

  /**
   * Show analysis results in a proper modal (placeholder for future enhancement)
   */
  function showModalAnalysis(response) {
    // Temporary alert - replace with proper modal in future update
    alert(`Detailed Analysis:\nScore: ${Math.round(response.score * 100)}%\nType: ${response.analysis?.bias_type || 'Unknown'}`);
  }

  /**
   * Cleans up a badge element and all its associated resources
   * @function cleanupBadge
   * @param {HTMLElement} badge - The badge element to clean up
   * @returns {void}
   */
  function cleanupBadge(badge) {
    if (badge && badge.parentNode) {
      // Remove event listeners
      const badgeListeners = eventListeners.filter(listener => listener.element === badge);
      badgeListeners.forEach(listener => {
        listener.element.removeEventListener(listener.event, listener.handler);
      });
      eventListeners = eventListeners.filter(listener => listener.element !== badge);
      
      // Clear timer
      if (badge._removeTimer) {
        clearTimeout(badge._removeTimer);
        delete badge._removeTimer;
      }
      
      // Remove from DOM
      badge.remove();
      
      if (currentBadge === badge) {
        currentBadge = null;
      }
    }
  }

  /**
   * Removes all highlight spans from the document.
   * @function clearHighlights
   */
  function clearHighlights() {
    activeHighlights.forEach(span => {
      if (span.parentNode) {
        // Unwrap the content by replacing the span with its children
        while (span.firstChild) {
          span.parentNode.insertBefore(span.firstChild, span);
        }
        span.parentNode.removeChild(span);
      }
    });
    activeHighlights = [];
  }

  /**
   * Cleans up all resources including timers and event listeners
   * @function cleanup
   * @returns {void}
   */
  function cleanup() {
    // Clear debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    
    // Cleanup current badge
    if (currentBadge) {
      cleanupBadge(currentBadge);
    }
    
    // TRACER BULLET: Clear any active highlights
    clearHighlights();
    
    // Remove all event listeners
    eventListeners.forEach(listener => {
      listener.element.removeEventListener(listener.event, listener.handler);
    });
    eventListeners = [];
  }

  /**
   * Handles text selection with debouncing to prevent excessive API calls
   * @function handleSelection
   * @returns {void}
   */
  function handleSelection() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // TRACER BULLET: Clear previous highlights before starting a new analysis
    clearHighlights();

    debounceTimer = setTimeout(() => {
      analyzeSelection();
    }, CONFIG.debounceDelay);
  }

  // Event listeners with proper cleanup tracking
  const mouseupHandler = handleSelection;
  const keydownHandler = (e) => {
    // Ctrl+Shift+A for manual analysis
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      analyzeSelection();
    }
  };

  document.addEventListener("mouseup", mouseupHandler);
  document.addEventListener("keydown", keydownHandler);

  // Store event listeners for cleanup
  eventListeners.push(
    { element: document, event: 'mouseup', handler: mouseupHandler },
    { element: document, event: 'keydown', handler: keydownHandler }
  );

  // Listen for messages from popup and background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case 'ANALYZE_SELECTION':
        const selection = window.getSelection()?.toString()?.trim() || "";

        if (selection.length < CONFIG.minSelectionLength) {
          sendResponse({
            success: false,
            error: ERROR_MESSAGES.SELECTION_TOO_SHORT
          });
          return true;
        }

        if (selection.length > CONFIG.maxSelectionLength) {
          sendResponse({
            success: false,
            error: ERROR_MESSAGES.SELECTION_TOO_LONG
          });
          return true;
        }

        // Send to background for analysis
        chrome.runtime.sendMessage(
          { type: "ANALYZE_TEXT", payload: selection },
          (response) => {
            if (chrome.runtime.lastError) {
              sendResponse({
                success: false,
                error: chrome.runtime.lastError.message
              });
              return;
            }

            // Forward response back to popup
            sendResponse(response);
          }
        );

        return true; // Keep channel open for async response

      case 'ANALYZE_SELECTION_COMMAND':
        // Triggered by keyboard shortcut
        analyzeSelection();
        sendResponse({ success: true });
        return true;

      case 'CLEAR_HIGHLIGHTS':
        clearHighlights();
        showBadge("Highlights cleared", "info");
        sendResponse({ success: true });
        return true;

      case 'SHOW_ANALYSIS_RESULT':
        // Display analysis result from context menu
        if (request.payload) {
          const selection = window.getSelection();
          const range = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
          displayAnalysisResults(request.payload, range);
        }
        sendResponse({ success: true });
        return true;

      case 'COPY_TO_CLIPBOARD':
        // Copy text to clipboard
        if (request.payload) {
          copyToClipboard(request.payload);
          showBadge("Copied to clipboard", "info");
        }
        sendResponse({ success: true });
        return true;

      case 'SHOW_HISTORY':
        // Show analysis history
        showAnalysisHistory();
        sendResponse({ success: true });
        return true;
    }
  });

  /**
   * TRACER BULLET: Copy text to clipboard
   */
  function copyToClipboard(text) {
    try {
      // Create temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      
      // Select and copy
      textarea.select();
      document.execCommand('copy');
      
      // Cleanup
      document.body.removeChild(textarea);
      
      Logger.info("[CS] Text copied to clipboard");
    } catch (err) {
      Logger.error("[CS] Failed to copy to clipboard:", err);
    }
  }

  /**
   * TRACER BULLET: Show analysis history modal
   */
  function showAnalysisHistory() {
    chrome.storage.sync.get(['analysis_history'], (data) => {
      const history = data.analysis_history || [];
      
      if (history.length === 0) {
        showBadge("No analysis history", "info");
        return;
      }
      
      // Create history modal
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: #333;
        padding: 24px;
        border-radius: 12px;
        z-index: 2147483647;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        font: 14px system-ui, sans-serif;
      `;
      
      // Create header
      const header = document.createElement('div');
      header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;';
      
      const title = document.createElement('h2');
      title.textContent = 'Analysis History';
      title.style.cssText = 'margin: 0; color: #1C64D9;';
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 32px;
        height: 32px;
        line-height: 1;
      `;
      closeBtn.onclick = () => modal.remove();
      
      header.appendChild(title);
      header.appendChild(closeBtn);
      modal.appendChild(header);
      
      // Create history list
      history.slice(0, 10).forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.style.cssText = `
          padding: 12px;
          margin: 8px 0;
          background: #f5f5f5;
          border-radius: 8px;
          border-left: 4px solid ${getScoreColor(entry.analysis.score * 100)};
        `;
        
        const textDiv = document.createElement('div');
        textDiv.textContent = entry.text;
        textDiv.style.cssText = 'font-weight: 500; margin-bottom: 8px;';
        
        const scoreDiv = document.createElement('div');
        scoreDiv.textContent = `Score: ${Math.round(entry.analysis.score * 100)}% | Type: ${entry.analysis.analysis?.bias_type || 'Unknown'}`;
        scoreDiv.style.cssText = 'font-size: 12px; color: #666;';
        
        const timeDiv = document.createElement('div');
        timeDiv.textContent = new Date(entry.timestamp).toLocaleString();
        timeDiv.style.cssText = 'font-size: 11px; color: #999; margin-top: 4px;';
        
        entryDiv.appendChild(textDiv);
        entryDiv.appendChild(scoreDiv);
        entryDiv.appendChild(timeDiv);
        modal.appendChild(entryDiv);
      });
      
      // Add overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 2147483646;
      `;
      overlay.onclick = () => {
        modal.remove();
        overlay.remove();
      };
      
      document.body.appendChild(overlay);
      document.body.appendChild(modal);
      
      Logger.info("[CS] History modal displayed");
    });
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  eventListeners.push({ element: window, event: 'beforeunload', handler: cleanup });

  Logger.info("[CS] AiGuardian content script loaded");

})();

