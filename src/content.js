/**
 * Content Script for AI Guardians Chrome Extension
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Add more sophisticated text selection detection
 * - Implement keyboard shortcuts for analysis
 * - Add context menu integration
 * - Consider adding highlighting for biased text
 * - Add user feedback collection
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    minSelectionLength: 10,
    maxSelectionLength: 5000,
    badgeDisplayTime: 3000,
    debounceDelay: 300
  };

  let debounceTimer = null;
  let currentBadge = null;
  let eventListeners = [];

  /**
   * TRACER BULLET: Enhanced text analysis with error handling
   */
  function analyzeSelection() {
    const selection = window.getSelection()?.toString()?.trim() || "";
    
    // Validate selection length
    if (selection.length < CONFIG.minSelectionLength) {
      console.log("[CS] Selection too short:", selection.length);
      return;
    }
    
    if (selection.length > CONFIG.maxSelectionLength) {
      console.log("[CS] Selection too long:", selection.length);
      showBadge("Text too long for analysis", "warning");
      return;
    }

    // Show loading indicator
    showBadge("Analyzing...", "loading");

    // Send to background script
    chrome.runtime.sendMessage(
      { type: "ANALYZE_TEXT", payload: selection },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("[CS] Runtime error:", chrome.runtime.lastError);
          showBadge("Analysis failed", "error");
          return;
        }

        if (!response || !response.success) {
          console.error("[CS] Analysis failed:", response?.error);
          showBadge("Analysis failed", "error");
          return;
        }

        // TRACER BULLET: Display results with enhanced UI
        displayAnalysisResults(response);
      }
    );
  }

  /**
   * TRACER BULLET: Enhanced result display
   */
  function displayAnalysisResults(response) {
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
    // TODO: Implement detailed analysis modal
    console.log("[CS] Detailed analysis:", response);
    alert(`Detailed Analysis:\nScore: ${Math.round(response.score * 100)}%\nType: ${response.analysis?.bias_type || 'Unknown'}`);
  }

  /**
   * TRACER BULLET: Cleanup badge and associated resources
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
   * TRACER BULLET: Cleanup all resources
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
    
    // Remove all event listeners
    eventListeners.forEach(listener => {
      listener.element.removeEventListener(listener.event, listener.handler);
    });
    eventListeners = [];
  }

  /**
   * TRACER BULLET: Debounced selection handler
   */
  function handleSelection() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
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
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  eventListeners.push({ element: window, event: 'beforeunload', handler: cleanup });

  console.log("[CS] AI Guardians content script loaded");

})();

