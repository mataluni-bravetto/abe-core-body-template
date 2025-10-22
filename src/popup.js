/**
 * Popup Script for AI Guardians Chrome Extension
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Add quick analysis status display
 * - Implement recent analysis history
 * - Add quick settings toggles
 * - Consider adding usage statistics
 * - Add keyboard shortcuts help
 */

(function(){
  let eventListeners = [];
  
  try {
    // TRACER BULLET: Enhanced popup functionality
    initializePopup();
    setupEventListeners();
  } catch (err) {
    Logger.error('Popup init error', err);
  }

  /**
   * TRACER BULLET: Set up event listeners with proper cleanup tracking
   */
  function setupEventListeners() {
    const btn = document.getElementById('noop');
    if (btn) {
      const clickHandler = async () => {
        try {
          await chrome.runtime.openOptionsPage();
          Logger.info('Opened options page');
          window.close();
        } catch (err) {
          Logger.error('Failed to open options', err);
        }
      };
      
      btn.addEventListener('click', clickHandler);
      eventListeners.push({ element: btn, event: 'click', handler: clickHandler });
    }
  }

  /**
   * TRACER BULLET: Cleanup all event listeners
   */
  function cleanupEventListeners() {
    eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    eventListeners = [];
  }

  // Cleanup on popup close
  window.addEventListener('beforeunload', cleanupEventListeners);

  /**
   * TRACER BULLET: Initialize popup with enhanced features
   */
  function initializePopup() {
    // Load current settings
    chrome.storage.sync.get(['bias_threshold'], (data) => {
      if (data.bias_threshold !== undefined) {
        Logger.info('Current threshold:', data.bias_threshold);
      }
    });
  }

  /**
   * TRACER BULLET: Add quick analysis button
   */
  function addQuickAnalysisButton() {
    // Future enhancement: Add button for manual analysis of current page
    // Future enhancement: Implement page text extraction
    // Future enhancement: Send to background for analysis
  }

  /**
   * TRACER BULLET: Add usage statistics
   */
  function showUsageStats() {
    // Future enhancement: Display analysis count
    // Future enhancement: Show average bias score
    // Future enhancement: Display most analyzed sites
  }

})();

