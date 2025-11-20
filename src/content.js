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

(function () {
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
    MIN_SELECTION_LENGTH: 10, // Must match constants.js TEXT_ANALYSIS.MIN_SELECTION_LENGTH
    MAX_SELECTION_LENGTH: 5000, // Must match constants.js TEXT_ANALYSIS.MAX_SELECTION_LENGTH
    MAX_TEXT_LENGTH: 10000, // Must match constants.js TEXT_ANALYSIS.MAX_TEXT_LENGTH
    DEBOUNCE_DELAY: 300, // Must match constants.js TEXT_ANALYSIS.DEBOUNCE_DELAY
    BADGE_DISPLAY_TIME: 3000, // Must match constants.js TEXT_ANALYSIS.BADGE_DISPLAY_TIME
  };

  const ERROR_MESSAGES = {
    SELECTION_TOO_SHORT: 'Selection too short for analysis',
    SELECTION_TOO_LONG: 'Text too long for analysis',
    ANALYSIS_FAILED: 'Analysis failed',
    CONNECTION_FAILED: 'Connection to backend failed',
    INVALID_API_KEY: 'Invalid API key format',
    TIMEOUT_ERROR: 'Request timed out',
  };

  const SUCCESS_MESSAGES = {
    ANALYSIS_COMPLETE: 'Analysis complete',
    CONNECTION_SUCCESS: 'Connected to backend',
    CONFIG_SAVED: 'Configuration saved',
  };

  // Configuration
  const CONFIG = {
    minSelectionLength: TEXT_ANALYSIS.MIN_SELECTION_LENGTH,
    maxSelectionLength: TEXT_ANALYSIS.MAX_SELECTION_LENGTH,
    badgeDisplayTime: TEXT_ANALYSIS.BADGE_DISPLAY_TIME,
    debounceDelay: TEXT_ANALYSIS.DEBOUNCE_DELAY,
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
    const selectionText = selection?.toString()?.trim() || '';

    // TRACER BULLET: Capture the selection range to enable highlighting
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;

    // Validate selection length
    if (selectionText.length < CONFIG.minSelectionLength) {
      Logger.info('[CS] Selection too short:', selectionText.length);
      return;
    }

    if (selectionText.length > CONFIG.maxSelectionLength) {
      Logger.warn('[CS] Selection too long:', selectionText.length);
      showErrorBadge('Text too long for analysis. Select less than 5000 characters.', 'warning');
      return;
    }

    // Show loading indicator
    showBadge('Analyzing...', 'loading');

    // Send to background script
    Logger.info('[CS] 📤 Sending analysis request:', {
      textLength: selectionText.length,
      textPreview: selectionText.substring(0, 100) + (selectionText.length > 100 ? '...' : '')
    });
    
    chrome.runtime.sendMessage({ type: 'ANALYZE_TEXT', payload: selectionText }, (response) => {
      // DEBUG: Log response immediately
      Logger.info('[CS] 📥 Received analysis response:', {
        hasResponse: !!response,
        success: response?.success,
        hasScore: response?.score !== undefined,
        scoreValue: response?.score,
        hasError: !!response?.error,
        errorMessage: response?.error,
        statusCode: response?.statusCode,
        responseKeys: response ? Object.keys(response) : []
      });
      
      if (chrome.runtime.lastError) {
        Logger.error('[CS] Runtime error:', chrome.runtime.lastError);
        showErrorBadge('Extension error. Please refresh the page and try again.', 'error');
        return;
      }

      if (!response || !response.success) {
        Logger.error('[CS] Analysis failed:', {
          error: response?.error,
          errorCode: response?.errorCode,
          statusCode: response?.statusCode,
          actionable: response?.actionable,
          fullResponse: JSON.stringify(response).substring(0, 500)
        });

        // Show user-friendly error message
        let errorMessage = response?.error || 'Analysis failed. Please try again.';

        // Use the error message from backend if available
        if (response?.errorCode === 'AUTH_REQUIRED') {
          errorMessage = response?.error || 'Please sign in to use analysis features.';
          // If actionable, could show a sign-in button (future enhancement)
          if (response?.actionable) {
            Logger.info('[CS] Authentication error is actionable - user should sign in');
          }
        }

        showErrorBadge(errorMessage, 'error');
        return;
      }

      // TRACER BULLET: Display results with enhanced UI and pass the range for highlighting
      // displayAnalysisResults now handles error responses internally
      displayAnalysisResults(response, range);
    });
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
    // DEBUG: Log full response structure to diagnose score extraction
    Logger.info('[CS] 🔍 Displaying analysis results - Score update flow:', {
      hasResponse: !!response,
      success: response?.success,
      hasScore: response?.score !== undefined,
      scoreValue: response?.score,
      scoreType: typeof response?.score,
      hasAnalysis: !!response?.analysis,
      analysisKeys: response?.analysis ? Object.keys(response?.analysis) : [],
      note: 'Content script displaying score immediately - popup will update via storage listener',
    });
    
    // Check for error responses first - don't display "Score: 0%" for failed analyses
    if (!response || response.success === false || response.error) {
      // Determine appropriate error message
      let errorMessage = response?.error || 'Analysis failed. Please sign in.';

      // Provide more specific error messages based on error type
      if (
        response?.status === 401 ||
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('authenticated') ||
        errorMessage.includes('sign in')
      ) {
        errorMessage = 'Score unavailable - Please sign in to analyze text.';
      } else if (response?.status === 403 || errorMessage.includes('Forbidden')) {
        errorMessage = 'Score unavailable - Access denied. Please check your subscription.';
      } else if (response?.status === 429 || errorMessage.includes('rate limit')) {
        errorMessage = 'Score unavailable - Rate limit exceeded. Please try again later.';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        errorMessage = 'Score unavailable - Request timed out. Please try again.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
        errorMessage = 'Score unavailable - Backend connection required. Please check your connection.';
      } else if (response?.status === 404) {
        errorMessage = 'Score unavailable - Backend endpoint not found.';
      }

      Logger.error('[CS] Analysis failed:', errorMessage);
      showErrorBadge(errorMessage, 'error');
      return;
    }

    // Validate that we have a valid score before displaying
    // Handle three cases: null/undefined (missing), valid number including 0, invalid type
    if (response.score === undefined || response.score === null) {
      Logger.warn('[CS] ⚠️ Analysis response missing score (null/undefined):', {
        responseKeys: Object.keys(response || {}),
        hasAnalysis: !!response?.analysis,
        analysisKeys: response?.analysis ? Object.keys(response?.analysis) : [],
        serviceType: response?.service_type,
        scoreValue: response.score,
        scoreType: typeof response.score,
      });
      
      // More specific error message
      const errorMessage = response.analysis && Object.keys(response.analysis).length > 0
        ? 'Score unavailable - Analysis completed but bias_score field missing from backend response'
        : 'Score unavailable - Analysis incomplete or failed';
        
      showErrorBadge(errorMessage, 'warning');
      return;
    }

    // Validate score is a number AND in valid range (0-1)
    if (typeof response.score !== 'number' || 
        Number.isNaN(response.score) ||
        response.score < 0 || 
        response.score > 1) {
      Logger.warn('[CS] ⚠️ Analysis response has invalid score:', {
        score: response.score,
        scoreType: typeof response.score,
        isNaN: Number.isNaN(response.score),
        isOutOfRange: response.score < 0 || response.score > 1,
      });
      showErrorBadge('Score unavailable - Analysis incomplete. Invalid score format.', 'warning');
      return;
    }
    
    // DEBUG: Log score details before display using specialized biasScore logger
    Logger.biasScore('Score details before display', {
      rawScore: response.score,
      scoreType: typeof response.score,
      isNumber: typeof response.score === 'number',
      isNaN: Number.isNaN(response.score),
      scorePercentage: response.score !== null ? Math.round(response.score * 100) : 'N/A',
      isZero: response.score === 0,
      isMissing: response.score === null || response.score === undefined,
      biasTypes: response.analysis?.bias_types || [],
      biasType: response.analysis?.bias_type,
      confidence: response.analysis?.confidence,
      responseStructure: {
        hasScore: response.score !== undefined && response.score !== null,
        hasAnalysis: !!response.analysis,
        analysisKeys: response.analysis ? Object.keys(response.analysis) : []
      }
    });

    // TRACER BULLET: Highlight the text on the page (only if score is a valid number)
    // CRITICAL FIX: Convert score (0-1) to percentage (0-100) for getScoreColor()
    if (range && typeof response.score === 'number' && !Number.isNaN(response.score)) {
      const scorePercentage = Math.round(response.score * 100);
      highlightSelection(range, scorePercentage);
    }

    // Convert score to percentage (0-100)
    // Note: score of 0 is valid (backend explicitly returned 0, meaning no bias detected)
    const score = Math.round(response.score * 100);
    const analysis = response.analysis || {};

    // EPISTEMIC CERTAINTY VALIDATION: Validate 97.8% threshold
    const confidence = analysis.confidence;
    const epistemicThreshold = 0.978; // 97.8% epistemic certainty threshold
    
    if (confidence !== undefined && confidence !== null && typeof confidence === 'number') {
      if (confidence < epistemicThreshold) {
        Logger.warn('[CS] ⚠️ Confidence below epistemic threshold (97.8%):', {
          confidence: Math.round(confidence * 100) + '%',
          threshold: '97.8%',
          difference: Math.round((epistemicThreshold - confidence) * 100) + '%',
          score: score + '%'
        });
      } else {
        Logger.info('[CS] ✅ Confidence meets epistemic threshold:', {
          confidence: Math.round(confidence * 100) + '%',
          threshold: '97.8%',
          score: score + '%'
        });
      }
    }

    // Create enhanced badge with more information
    const badge = document.createElement('div');
    // Create content using safe DOM methods
    const badgeContent = document.createElement('div');
    badgeContent.style.cssText = 'display: flex; align-items: center; gap: 8px;';

    const scoreSpan = document.createElement('span');
    // Display score: 0% is valid (no bias), null would have been caught above
    scoreSpan.textContent = 'Bias Score: ' + score + '%';

    const confidenceSpan = document.createElement('span');
    confidenceSpan.style.cssText = 'font-size: 10px; opacity: 0.8;';
    confidenceSpan.textContent = analysis.confidence
      ? '(' + Math.round(analysis.confidence * 100) + ')'
      : '';

    badgeContent.appendChild(scoreSpan);
    badgeContent.appendChild(confidenceSpan);
    badge.appendChild(badgeContent);

    if (analysis.bias_type) {
      const typeDiv = document.createElement('div');
      typeDiv.style.cssText = 'font-size: 10px; margin-top: 4px;';
      typeDiv.textContent = `Type: ${analysis.bias_type}`;
      badge.appendChild(typeDiv);
    }

    // EPISTEMIC CERTAINTY WARNING: Show warning if confidence below 97.8%
    if (confidence !== undefined && confidence !== null && typeof confidence === 'number' && confidence < epistemicThreshold) {
      const warningDiv = document.createElement('div');
      warningDiv.style.cssText = 'font-size: 10px; margin-top: 4px; color: #FF9800; font-weight: 600;';
      warningDiv.textContent = `⚠️ Low confidence (${Math.round(confidence * 100)}%)`;
      badge.appendChild(warningDiv);
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
      // Check if range is collapsed (no selection)
      if (range.collapsed) {
        Logger.warn('[CS] Range is collapsed, cannot highlight');
        return;
      }

      const highlightSpan = document.createElement('span');
      highlightSpan.style.backgroundColor = getScoreColor(score);
      highlightSpan.style.color = '#FFFFFF';
      highlightSpan.style.borderRadius = '3px';
      highlightSpan.style.padding = '2px 1px';
      highlightSpan.className = 'aiguardian-highlight'; // Add class for easy cleanup

      // Try surroundContents first (preferred method - clean and simple)
      // It can fail if the selection spans across incompatible DOM nodes.
      try {
        range.surroundContents(highlightSpan);
        activeHighlights.push(highlightSpan);
      } catch (surroundError) {
        // Fallback: Manual DOM manipulation for incompatible nodes
        Logger.warn('[CS] surroundContents failed, using fallback method:', surroundError.message);
        
        try {
          // Extract contents and wrap in highlight span
          const contents = range.extractContents();
          highlightSpan.appendChild(contents);
          
          // Insert the highlighted span at the range start
          range.insertNode(highlightSpan);
          
          activeHighlights.push(highlightSpan);
        } catch (fallbackError) {
          Logger.error('[CS] Fallback highlighting also failed:', fallbackError.message);
          // Silently fail - highlighting is non-critical, analysis still works
        }
      }
    } catch (e) {
      Logger.error('[CS] Failed to highlight text:', e.message);
    }
  }

  /**
   * TRACER BULLET: Color coding for bias scores
   */
  function getScoreColor(score) {
    if (score < 30) {return '#4CAF50';} // Green - low bias
    if (score < 60) {return '#FF9800';} // Orange - medium bias
    return '#F44336'; // Red - high bias
  }

  /**
   * Show user-friendly error badges
   */
  function showErrorBadge(message, type = 'error') {
    showBadge(message, type);
  }

  /**
   * TRACER BULLET: Show status badges
   */
  function showBadge(message, type = 'info') {
    if (currentBadge) {
      currentBadge.remove();
    }

    const badge = document.createElement('div');
    badge.textContent = message;

    const colors = {
      loading: '#2196F3',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
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
   * Show detailed analysis modal dialog
   */
  function showDetailedAnalysis(response) {
    Logger.info('[CS] Showing detailed analysis');
    showModalAnalysis(response);
  }

  /**
   * Show analysis results in a proper modal dialog
   * @param {Object} response - Analysis response object
   */
  function showModalAnalysis(response) {
    // Remove any existing modal
    const existingModal = document.querySelector('.aiguardian-analysis-modal');
    const existingOverlay = document.querySelector('.aiguardian-modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }
    if (existingOverlay) {
      existingOverlay.remove();
    }

    // DEBUG: Log response structure to diagnose score extraction
    Logger.info('[CS] Modal - Full response structure:', {
      hasResponse: !!response,
      score: response?.score,
      scoreType: typeof response?.score,
      isZero: response?.score === 0,
      isNull: response?.score === null,
      isUndefined: response?.score === undefined,
      hasAnalysis: !!response?.analysis,
      analysisKeys: response?.analysis ? Object.keys(response?.analysis) : [],
      fullResponse: JSON.stringify(response).substring(0, 500)
    });

    // Extract data with fallbacks
    // IMPORTANT: Distinguish between score: 0 (valid - no bias) and score: null/undefined (missing)
    // If score is 0 but there's no analysis data, it might be a fallback/default value
    const hasValidScore = response.score !== null && response.score !== undefined && typeof response.score === 'number';
    const hasAnalysisData = response.analysis && Object.keys(response.analysis).length > 0;
    
    // If score is 0 but no analysis data exists, treat as missing (show N/A)
    const score = hasValidScore && (response.score !== 0 || hasAnalysisData)
      ? Math.round(response.score * 100) 
      : null;
    const analysis = response.analysis || {};
    const biasType = analysis.bias_type || analysis.type || 'Unknown';
    const confidence = analysis.confidence !== null && analysis.confidence !== undefined
      ? Math.round(analysis.confidence * 100)
      : null;
    const biasTypes = analysis.bias_types || (analysis.bias_type ? [analysis.bias_type] : []);
    const issues = analysis.issues || [];
    const recommendations = analysis.recommendations || [];
    const summary = analysis.summary || '';

    // Get score color (getScoreColor expects 0-100 percentage)
    const scoreColor = score !== null ? getScoreColor(score) : '#999';

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'aiguardian-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 2147483646;
      animation: fadeIn 0.2s ease-out;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'aiguardian-analysis-modal';
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      color: #333;
      padding: 0;
      border-radius: 12px;
      z-index: 2147483647;
      max-width: 600px;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      font: 14px system-ui, sans-serif;
      animation: slideIn 0.3s ease-out;
    `;

    // Add animations
    if (!document.getElementById('aiguardian-modal-styles')) {
      const style = document.createElement('style');
      style.id = 'aiguardian-modal-styles';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 2px solid #f0f0f0;
      background: linear-gradient(135deg, #081c3d 0%, #134390 50%, #1c64d9 100%);
      color: white;
      border-radius: 12px 12px 0 0;
    `;

    const title = document.createElement('h2');
    title.textContent = '🔍 Detailed Analysis';
    title.style.cssText = 'margin: 0; font-size: 20px; font-weight: 600;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2);
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: white;
      padding: 0;
      width: 36px;
      height: 36px;
      line-height: 1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';

    const closeModal = () => {
      modal.remove();
      overlay.remove();
    };
    closeBtn.onclick = closeModal;

    header.appendChild(title);
    header.appendChild(closeBtn);
    modal.appendChild(header);

    // Create content container
    const content = document.createElement('div');
    content.style.cssText = 'padding: 24px;';

    // Score section
    if (score !== null) {
      const scoreSection = document.createElement('div');
      scoreSection.style.cssText = `
        text-align: center;
        padding: 20px;
        margin-bottom: 24px;
        background: ${scoreColor}15;
        border-radius: 8px;
        border: 2px solid ${scoreColor}40;
      `;

      const scoreLabel = document.createElement('div');
      scoreLabel.textContent = 'Bias Score';
      scoreLabel.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;';

      const scoreValue = document.createElement('div');
      scoreValue.textContent = `${score}%`;
      scoreValue.style.cssText = `
        font-size: 48px;
        font-weight: 700;
        color: ${scoreColor};
        margin-bottom: 8px;
      `;

      scoreSection.appendChild(scoreLabel);
      scoreSection.appendChild(scoreValue);
      content.appendChild(scoreSection);
    } else {
      // Show "Score Unavailable" message when score is missing
      const scoreSection = document.createElement('div');
      scoreSection.style.cssText = `
        text-align: center;
        padding: 20px;
        margin-bottom: 24px;
        background: #f5f5f515;
        border-radius: 8px;
        border: 2px solid #99999940;
      `;

      const scoreLabel = document.createElement('div');
      scoreLabel.textContent = 'Bias Score';
      scoreLabel.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;';

      const scoreValue = document.createElement('div');
      scoreValue.textContent = 'N/A';
      scoreValue.style.cssText = `
        font-size: 48px;
        font-weight: 700;
        color: #999;
        margin-bottom: 8px;
      `;

      const scoreNote = document.createElement('div');
      scoreNote.textContent = 'Score unavailable - Analysis incomplete or failed';
      scoreNote.style.cssText = 'font-size: 12px; color: #999; margin-top: 8px;';

      scoreSection.appendChild(scoreLabel);
      scoreSection.appendChild(scoreValue);
      scoreSection.appendChild(scoreNote);
      content.appendChild(scoreSection);
    }

    // Details grid
    const detailsGrid = document.createElement('div');
    detailsGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;';

    // Bias Type
    const biasTypeDiv = document.createElement('div');
    biasTypeDiv.style.cssText = 'padding: 12px; background: #f5f5f5; border-radius: 6px;';
    const biasTypeLabel = document.createElement('div');
    biasTypeLabel.textContent = 'Bias Type';
    biasTypeLabel.style.cssText = 'font-size: 11px; color: #666; margin-bottom: 4px; text-transform: uppercase;';
    const biasTypeValue = document.createElement('div');
    biasTypeValue.textContent = biasType;
    biasTypeValue.style.cssText = 'font-weight: 600; color: #333;';
    biasTypeDiv.appendChild(biasTypeLabel);
    biasTypeDiv.appendChild(biasTypeValue);

    // Confidence
    if (confidence !== null) {
      const confidenceDiv = document.createElement('div');
      confidenceDiv.style.cssText = 'padding: 12px; background: #f5f5f5; border-radius: 6px;';
      const confidenceLabel = document.createElement('div');
      confidenceLabel.textContent = 'Confidence';
      confidenceLabel.style.cssText = 'font-size: 11px; color: #666; margin-bottom: 4px; text-transform: uppercase;';
      const confidenceValue = document.createElement('div');
      confidenceValue.textContent = `${confidence}%`;
      confidenceValue.style.cssText = 'font-weight: 600; color: #333;';
      confidenceDiv.appendChild(confidenceLabel);
      confidenceDiv.appendChild(confidenceValue);
      detailsGrid.appendChild(confidenceDiv);
    }

    detailsGrid.appendChild(biasTypeDiv);
    content.appendChild(detailsGrid);

    // Summary
    if (summary) {
      const summarySection = document.createElement('div');
      summarySection.style.cssText = 'margin-bottom: 24px;';
      const summaryLabel = document.createElement('div');
      summaryLabel.textContent = 'Summary';
      summaryLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #333; margin-bottom: 8px; text-transform: uppercase;';
      const summaryText = document.createElement('div');
      summaryText.textContent = summary;
      summaryText.style.cssText = 'color: #666; line-height: 1.6;';
      summarySection.appendChild(summaryLabel);
      summarySection.appendChild(summaryText);
      content.appendChild(summarySection);
    }

    // Issues
    if (issues.length > 0) {
      const issuesSection = document.createElement('div');
      issuesSection.style.cssText = 'margin-bottom: 24px;';
      const issuesLabel = document.createElement('div');
      issuesLabel.textContent = `Issues Found (${issues.length})`;
      issuesLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #F44336; margin-bottom: 12px; text-transform: uppercase;';
      issuesSection.appendChild(issuesLabel);

      issues.forEach((issue, _idx) => {
        const issueDiv = document.createElement('div');
        issueDiv.style.cssText = `
          padding: 12px;
          margin-bottom: 8px;
          background: #ffebee;
          border-left: 4px solid #F44336;
          border-radius: 4px;
        `;
        issueDiv.textContent = typeof issue === 'string' ? issue : JSON.stringify(issue);
        issuesSection.appendChild(issueDiv);
      });

      content.appendChild(issuesSection);
    }

    // Recommendations
    if (recommendations.length > 0) {
      const recSection = document.createElement('div');
      recSection.style.cssText = 'margin-bottom: 24px;';
      const recLabel = document.createElement('div');
      recLabel.textContent = `Recommendations (${recommendations.length})`;
      recLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #4CAF50; margin-bottom: 12px; text-transform: uppercase;';
      recSection.appendChild(recLabel);

      recommendations.forEach((rec, _idx) => {
        const recDiv = document.createElement('div');
        recDiv.style.cssText = `
          padding: 12px;
          margin-bottom: 8px;
          background: #e8f5e9;
          border-left: 4px solid #4CAF50;
          border-radius: 4px;
        `;
        recDiv.textContent = typeof rec === 'string' ? rec : JSON.stringify(rec);
        recSection.appendChild(recDiv);
      });

      content.appendChild(recSection);
    }

    // Additional bias types
    if (biasTypes.length > 1) {
      const typesSection = document.createElement('div');
      typesSection.style.cssText = 'margin-bottom: 24px;';
      const typesLabel = document.createElement('div');
      typesLabel.textContent = 'All Bias Types Detected';
      typesLabel.style.cssText = 'font-size: 12px; font-weight: 600; color: #333; margin-bottom: 8px; text-transform: uppercase;';
      const typesList = document.createElement('div');
      typesList.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px;';
      biasTypes.forEach(type => {
        const tag = document.createElement('span');
        tag.textContent = type;
        tag.style.cssText = `
          padding: 4px 12px;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        `;
        typesList.appendChild(tag);
      });
      typesSection.appendChild(typesLabel);
      typesSection.appendChild(typesList);
      content.appendChild(typesSection);
    }

    // Close button footer
    const footer = document.createElement('div');
    footer.style.cssText = 'padding: 16px 24px; border-top: 1px solid #f0f0f0; text-align: right;';

    const closeFooterBtn = document.createElement('button');
    closeFooterBtn.textContent = 'Close';
    closeFooterBtn.style.cssText = `
      padding: 10px 24px;
      background: #1c64d9;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: background 0.2s;
    `;
    closeFooterBtn.onmouseover = () => closeFooterBtn.style.background = '#134390';
    closeFooterBtn.onmouseout = () => closeFooterBtn.style.background = '#1c64d9';
    closeFooterBtn.onclick = closeModal;

    footer.appendChild(closeFooterBtn);
    modal.appendChild(content);
    modal.appendChild(footer);

    // Append to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    };

    // Close on Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    Logger.info('[CS] Analysis modal displayed');
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
      const badgeListeners = eventListeners.filter((listener) => listener.element === badge);
      badgeListeners.forEach((listener) => {
        listener.element.removeEventListener(listener.event, listener.handler);
      });
      eventListeners = eventListeners.filter((listener) => listener.element !== badge);

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
    activeHighlights.forEach((span) => {
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
    eventListeners.forEach((listener) => {
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

  document.addEventListener('mouseup', mouseupHandler);
  document.addEventListener('keydown', keydownHandler);

  // Store event listeners for cleanup
  eventListeners.push(
    { element: document, event: 'mouseup', handler: mouseupHandler },
    { element: document, event: 'keydown', handler: keydownHandler }
  );

  /**
   * Try to access Clerk SDK from different possible locations
   */
  function getClerkInstance() {
    // Try window.Clerk first (most common)
    if (typeof window.Clerk !== 'undefined') {
      return window.Clerk;
    }
    // Try window.__clerk (some Clerk versions use this)
    if (typeof window.__clerk !== 'undefined') {
      return window.__clerk;
    }
    // Try accessing from window.clerk (lowercase)
    if (typeof window.clerk !== 'undefined') {
      return window.clerk;
    }
    return null;
  }

  /**
   * Helper function to retrieve Clerk session token
   * Returns null if token cannot be retrieved (non-fatal)
   * @param {Object} clerk - Clerk SDK instance
   * @returns {Promise<string|null>} Clerk session token or null
   */
  async function getClerkToken(clerk) {
    if (!clerk) {
      return null;
    }
    
    try {
      // Ensure Clerk is loaded
      if (typeof clerk.load === 'function' && !clerk.loaded) {
        await clerk.load();
      }
      
      // Get session
      const session = await clerk.session;
      if (session) {
        const token = await session.getToken();
        if (token) {
          Logger.info('[CS] Successfully retrieved Clerk token');
          return token;
        }
      }
    } catch (e) {
      Logger.warn('[CS] Could not get token from Clerk (non-fatal):', e.message);
    }
    
    return null;
  }

  // Detect Clerk authentication on accounts.dev pages
  // When Clerk redirects to /default-redirect, extract session info
  // Check if we're on a Clerk account page OR the AiGuardian landing page
  // The landing page (www.aiguardian.ai) embeds Clerk SDK for authentication
  const isClerkPage =
    window.location.hostname.includes('accounts.dev') ||
    window.location.hostname.includes('clerk.accounts.dev') ||
    window.location.hostname.includes('accounts.clerk.com') ||
    window.location.hostname.includes('accounts.clerk.dev') ||
    window.location.hostname === 'www.aiguardian.ai' ||
    window.location.hostname === 'aiguardian.ai';

  // Shared flag to prevent duplicate detection - must be at top level
  let userDetected = false;

  // ALWAYS log to verify content script is running
  Logger.info('[CS] Content script loaded', {
    hostname: window.location.hostname,
    url: window.location.href,
    isClerkPage: isClerkPage,
    readyState: document.readyState,
  });

  // Reset userDetected flag on page navigation
  window.addEventListener('beforeunload', () => {
    userDetected = false;
    Logger.info('[CS] Page unloading - resetting userDetected flag');
  });

  // Listen for storage changes to reset flag on logout
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes.clerk_user) {
        // User logged out - reset detection flag
        if (!changes.clerk_user.newValue && changes.clerk_user.oldValue) {
          userDetected = false;
          Logger.info('[CS] User logged out - resetting userDetected flag');
        }
      }
    });
  }

  if (isClerkPage) {
    Logger.info('[CS] Content script running on Clerk page:', window.location.hostname);
    
    // CRITICAL: Set up listener BEFORE injecting bridge to avoid race condition
    // Listen for messages from the bridge script
    window.addEventListener('message', (event) => {
      // Validate message source and structure
      if (event.source !== window) {
        return;
      }
      if (event.data?.type !== 'AI_GUARDIAN_CLERK_DATA') {
        return;
      }
      if (!event.data?.payload) {
        return;
      }
      
      // Security: Validate message signature
      if (event.data._signature !== 'aiGuardianBridge') {
        Logger.warn('[CS] Invalid message signature - ignoring');
        return;
      }
      
      // Validate payload structure
      if (!event.data.payload.user || !event.data.payload.user.id) {
        Logger.warn('[CS] Invalid payload structure - ignoring');
        return;
      }
      
      const { user, token } = event.data.payload;
      Logger.info('[CS] Received Clerk data from bridge script', user.id);
      
      if (user && !userDetected) {
        userDetected = true;
        
        chrome.runtime.sendMessage(
          {
            type: 'CLERK_AUTH_DETECTED',
            user: user,
            token: token,
          },
          (response) => {
             if (!chrome.runtime.lastError) {
                Logger.info('[CS] Successfully sent bridge auth to extension');
             }
          }
        );
      }
    });

    async function injectClerkBridge() {
      try {
        // CRITICAL FIX: Inject bridge script into MAIN world (page context)
        // Content scripts run in isolated world and cannot access page's window.Clerk
        // We need to inject an inline script that runs in MAIN world
        
        // Method 1: Use chrome.scripting.executeScript from service worker (preferred)
        // Request service worker to inject the script
        chrome.runtime.sendMessage({ 
          type: 'INJECT_CLERK_BRIDGE',
          url: window.location.href 
        }, (response) => {
          if (chrome.runtime.lastError) {
            Logger.warn('[CS] Service worker injection failed, using inline method:', chrome.runtime.lastError);
            // Fallback: Inject inline script that loads bridge in MAIN world
            injectInlineBridge();
          } else {
            Logger.info('[CS] Bridge injection requested from service worker');
          }
        });
      } catch (e) {
        Logger.error('[CS] Failed to inject bridge script:', e);
        // Fallback to inline injection
        injectInlineBridge();
      }
    }

    // Fallback: Inject inline script that runs in MAIN world
    function injectInlineBridge() {
      try {
        // Create inline script that loads the bridge script
        // This script runs in MAIN world context
        const bridgeUrl = chrome.runtime.getURL('src/clerk-bridge.js');
        const inlineScript = document.createElement('script');
        // Use JSON.stringify for proper URL escaping
        inlineScript.textContent = `
          (function() {
            if (window.__aiGuardianBridgeLoaded) {
              return;
            }
            const script = document.createElement('script');
            script.src = ${JSON.stringify(bridgeUrl)};
            script.onload = function() { this.remove(); };
            (document.head || document.documentElement).appendChild(script);
          })();
        `;
        // Inject into page's document (not content script's isolated context)
        (document.head || document.documentElement).appendChild(inlineScript);
        inlineScript.remove(); // Clean up
        Logger.info('[CS] Injected bridge script via inline method (MAIN world)');
      } catch (e) {
        Logger.error('[CS] Inline injection failed:', e);
      }
    }

    Logger.info('[CS] Page URL:', window.location.href);
    Logger.info('[CS] Document ready state:', document.readyState);
    Logger.info('[CS] Clerk page detected - starting auth detection');

    // IMMEDIATELY check if page shows "signed in" message (development mode redirect issue)
    // This happens when Clerk can't redirect but user IS signed in
    const checkSignedInPage = () => {
      try {
        // Get page text from multiple sources to handle dynamic content
        // Try innerText first (excludes script/style), then textContent, then visible text
        let pageText = '';
        let hasWelcomeElement = false;
        let welcomeName = null;

        if (document.body) {
          // First, try to find "Welcome" text directly in DOM elements
          const allElements = document.querySelectorAll('*');
          for (const el of allElements) {
            const text = el.textContent || el.innerText || '';
            if (text.includes('Welcome,') || text.includes('Welcome ')) {
              // Try to match "Welcome, Name" or "Welcome Name" - capture only the name part
              // Match stops at first non-letter character or end of word
              const match = text.match(/Welcome,?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
              if (match) {
                hasWelcomeElement = true;
                welcomeName = match[1].trim();
                pageText = text; // Use this element's text
                Logger.info('[CS] ✅ Found Welcome element with name:', welcomeName);
                break;
              }
              // Fallback: try to extract just first word after Welcome
              const simpleMatch = text.match(/Welcome,?\s+([A-Z][a-z]+)/i);
              if (simpleMatch) {
                hasWelcomeElement = true;
                welcomeName = simpleMatch[1].trim();
                pageText = text;
                Logger.info('[CS] ✅ Found Welcome element with name (simple match):', welcomeName);
                break;
              }
            }
          }

          // Log if we found welcome element
          if (!hasWelcomeElement) {
            // No Welcome element found, will try pageText regex
          }

          // If we didn't find Welcome in a specific element, try body text
          if (!hasWelcomeElement) {
            // Use innerText which excludes CSS and scripts
            pageText = document.body.innerText || '';
            // If innerText is empty or only contains CSS, try textContent
            if (!pageText || pageText.trim().length < 50 || pageText.includes(':root')) {
              pageText = document.body.textContent || '';
            }
            // Also try getting visible text from the main content area
            const mainContent =
              document.querySelector('main') ||
              document.querySelector('[role="main"]') ||
              document.body;
            if (mainContent && mainContent.innerText) {
              const visibleText = mainContent.innerText;
              if (visibleText.length > pageText.length && !visibleText.includes(':root')) {
                pageText = visibleText;
              }
            }
          }
        }

        const hasSignedInMessage =
          pageText.includes('You are signed in') ||
          pageText.includes('signed in, but Clerk cannot redirect') ||
          pageText.includes('Development mode. You are signed in') ||
          pageText.includes('Welcome,') ||
          hasWelcomeElement;

        Logger.info('[CS] Checking signed-in page:', {
          hasSignedInMessage,
          pageTextLength: pageText.length,
          pageTextSnippet: pageText.substring(0, 200),
          url: window.location.href,
        });
        Logger.info('[CS] Signed-in check:', {
          hasSignedInMessage,
          pageTextLength: pageText.length,
          hasWelcome: pageText.includes('Welcome'),
          url: window.location.href,
        });

        // Also check for "Welcome" pattern even if signed-in message not found
        const hasWelcomePattern = pageText.match(/Welcome,?\s+([A-Z][a-zA-Z\s]+)/i);
        const shouldProcess = hasSignedInMessage || hasWelcomePattern;

        if (shouldProcess) {
          Logger.info(
            '[CS] DETECTED: Page shows "signed in" message - user is authenticated but redirect failed'
          );

          // Try to get Clerk SDK immediately
          const clerk = getClerkInstance();
          if (clerk) {
            Logger.info('[CS] Clerk SDK found, attempting immediate session extraction');
            (async () => {
              try {
                // Load Clerk if needed
                if (typeof clerk.load === 'function' && !clerk.loaded) {
                  Logger.info('[CS] Loading Clerk SDK...');
                  await clerk.load();
                  Logger.info('[CS] Clerk SDK loaded');
                }

                // Try to get user first
                const user = clerk.user;
                Logger.info('[CS] Clerk user check:', { hasUser: !!user, userId: user?.id });

                if (user) {
                  Logger.info('[CS] Found user via SDK:', user.id);
                  
                  // Get token
                  let token = null;
                  try {
                    token = await getClerkToken(clerk);
                  } catch (e) {
                    Logger.warn('[CS] Could not get token (non-fatal):', e.message);
                  }
                  
                  // Send user data immediately
                  chrome.runtime.sendMessage(
                    {
                      type: 'CLERK_AUTH_DETECTED',
                      user: {
                        id: user.id,
                        email:
                          user.primaryEmailAddress?.emailAddress ||
                          user.emailAddresses?.[0]?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        imageUrl: user.imageUrl || user.profileImageUrl,
                      },
                      token: token,
                    },
                    (response) => {
                      if (chrome.runtime.lastError) {
                        Logger.error('[CS] Failed to send user auth:', chrome.runtime.lastError);
                      } else {
                        Logger.info('[CS] Successfully sent user auth immediately');
                      }
                    }
                  );
                  return;
                }

                // If no user, try session
                if (clerk.session && typeof clerk.session.then === 'function') {
                  Logger.info('[CS] Trying to get session...');
                  const session = await clerk.session;
                  Logger.info('[CS] Session check:', {
                    hasSession: !!session,
                    userId: session?.userId,
                  });

                  if (session && session.userId) {
                    Logger.info('[CS] Found session with userId:', session.userId);
                    
                    // Get token from session
                    let token = null;
                    try {
                      token = await session.getToken();
                      if (token) {
                        Logger.info('[CS] Successfully retrieved token from session');
                      }
                    } catch (e) {
                      Logger.warn('[CS] Could not get token from session (non-fatal):', e.message);
                    }
                    
                    chrome.runtime.sendMessage(
                      {
                        type: 'CLERK_AUTH_DETECTED',
                        user: {
                          id: session.userId,
                          email: null,
                          firstName: null,
                          lastName: null,
                          username: null,
                          imageUrl: null,
                        },
                        token: token,
                      },
                      (response) => {
                        if (chrome.runtime.lastError) {
                          Logger.error(
                            '[CS] Failed to send session auth:',
                            chrome.runtime.lastError
                          );
                        } else {
                          Logger.info('[CS] Sent session-based auth immediately');
                        }
                      }
                    );
                  }
                } else {
                  Logger.warn('[CS] No session available on clerk object');
                }
              } catch (immediateErr) {
                Logger.error('[CS] Immediate extraction failed:', immediateErr);
                // Will try page content extraction
              }
            })();
          }

          // Fallback: Extract user info from page content when SDK not accessible
          // This handles CSP restrictions or SDK loading issues
          if (!userDetected) {
            Logger.info('[CS] Clerk SDK not accessible, extracting user info from page content');

            // Extract user name from "Welcome, {Name}" pattern
            // Prefer the name we found via DOM search, otherwise try regex on pageText
            const extractedName =
              welcomeName || pageText.match(/Welcome,?\s+([A-Z][a-zA-Z\s]+)/i)?.[1]?.trim() || null;

            Logger.info('[CS] Name extraction result:', {
              welcomeName,
              extractedName,
              pageTextSnippet: pageText.substring(0, 300),
              hasWelcomeInPageText: pageText.includes('Welcome'),
            });

            // Extract email from page if available
            const emailMatch = pageText.match(
              /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
            );

            // Split name into first/last if possible
            let firstName = null;
            let lastName = null;
            if (extractedName) {
              const nameParts = extractedName.split(/\s+/);
              firstName = nameParts[0] || null;
              lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
            }

            // Check cookies for additional auth confirmation (if function is available)
            let hasAuthCookies = false;
            try {
              if (typeof checkCookiesForAuth === 'function') {
                hasAuthCookies = checkCookiesForAuth();
              }
            } catch (e) {
              // Function not available yet, skip cookie check
            }

            Logger.info('[CS] Auth indicators check:', {
              hasAuthCookies,
              emailMatch: emailMatch ? emailMatch[0] : null,
              extractedName,
              willSend: !!(hasAuthCookies || emailMatch || extractedName),
            });

            if (hasAuthCookies || emailMatch || extractedName) {
              Logger.info('[CS] ✅ Found auth indicators from page/cookies:', {
                hasName: !!extractedName,
                name: extractedName,
                hasEmail: !!emailMatch,
                hasCookies: hasAuthCookies,
              });

              const authUserPayload = {
                id: 'signed-in-user-' + Date.now(), // Generate unique ID
                email: emailMatch ? emailMatch[0] : null,
                firstName: firstName,
                lastName: lastName,
                username: extractedName ? extractedName.toLowerCase().replace(/\s+/g, '') : null,
                imageUrl: null,
              };

              Logger.info('[CS] Attempting to send CLERK_AUTH_DETECTED message:', {
                userId: authUserPayload.id,
                email: authUserPayload.email,
                firstName: authUserPayload.firstName,
                lastName: authUserPayload.lastName,
              });

              // Wrap async token retrieval in IIFE to avoid making checkSignedInPage async
              (async () => {
                try {
                  Logger.info('[CS] About to call chrome.runtime.sendMessage');
                  
                  // Try to get token if Clerk SDK is available
                  let token = null;
                  try {
                    const clerk = getClerkInstance();
                    if (clerk) {
                      token = await getClerkToken(clerk);
                    }
                  } catch (e) {
                    // SDK not accessible - this is expected for page content fallback
                  }
                  
                  Logger.info('[CS] Sending message now:', {
                    type: 'CLERK_AUTH_DETECTED',
                    user: authUserPayload,
                    hasToken: !!token,
                  });

                  // Ensure service worker is active by checking runtime
                  if (!chrome.runtime.id) {
                    Logger.error('[CS] ❌ Extension runtime not available');
                    Logger.error('[CS] Extension runtime not available');
                    return;
                  }

                  chrome.runtime.sendMessage(
                    {
                      type: 'CLERK_AUTH_DETECTED',
                      user: authUserPayload,
                      token: token,
                    },
                    (response) => {
                      // Check if callback was called (might be undefined if service worker didn't respond)
                      Logger.info('[CS] sendMessage callback executed');
                      Logger.info(
                        '[CS] Callback executed, lastError:',
                        chrome.runtime.lastError,
                        'response:',
                        response
                      );

                      if (chrome.runtime.lastError) {
                        Logger.error(
                          '[CS] ❌ Failed to send page-detected auth:',
                          chrome.runtime.lastError.message
                        );
                        Logger.error('[CS] Runtime error:', chrome.runtime.lastError);
                      } else {
                        Logger.info('[CS] ✅ Successfully sent page-detected auth to extension:', {
                          name: extractedName,
                          email: emailMatch ? emailMatch[0] : null,
                          response: response,
                        });
                        Logger.info('[CS] ✅ Message sent successfully, response:', response);
                        userDetected = true;

                        // Also verify storage was updated
                        chrome.storage.local.get(['clerk_user'], (result) => {
                          if (chrome.runtime.lastError) {
                            Logger.warn('[CS] Failed to verify storage update:', chrome.runtime.lastError.message);
                            return;
                          }
                          if (result.clerk_user) {
                            Logger.info(
                              '[CS] ✅ Verified user stored in extension:',
                              result.clerk_user.id
                            );
                            Logger.info('[CS] ✅ User confirmed in storage:', result.clerk_user);
                          } else {
                            Logger.warn('[CS] ⚠️ User not found in storage after message send');
                            Logger.warn('[CS] User not in storage:', result);
                          }
                        });
                      }
                    }
                  );

                  // Also log after the sendMessage call to verify it was called
                  Logger.info('[CS] sendMessage call completed (callback may execute later)');
                  Logger.info('[CS] sendMessage call completed');
                } catch (error) {
                  Logger.error('[CS] ❌ Exception sending CLERK_AUTH_DETECTED message:', error);
                  Logger.error('[CS] Exception:', error);
                }
              })();
            } else {
              Logger.warn(
                '[CS] Page shows signed in but no user info could be extracted from page content'
              );
            }
          }
        }
      } catch (e) {
        Logger.error('[CS] Error checking signed-in page:', e);
      }
    };

    // Check immediately if page is loaded, and retry if page text is empty or contains CSS
    if (document.readyState !== 'loading') {
      checkSignedInPage();
      // Retry after delays to catch dynamically loaded content
      setTimeout(() => {
        const pageText = document.body.innerText || document.body.textContent || '';
        // Retry if we got CSS content or if page text is now available
        if (
          pageText.includes(':root') ||
          (pageText.length > 50 && (pageText.includes('Welcome') || pageText.includes('signed in')))
        ) {
          Logger.info('[CS] Retrying signed-in check after delay - page content now available');
          checkSignedInPage();
        }
      }, 1000);
      // Also retry after longer delay for slow-loading content
      setTimeout(() => {
        checkSignedInPage();
      }, 2000);
    }

    // Wait for page to load, then check for Clerk session
    // IMPORTANT: Clerk SDK loads asynchronously via <script async>, so we need to wait for window.load event
    function startAuthCheck() {
      Logger.info('[CS] Starting auth check');
      injectClerkBridge();
      checkSignedInPage();
      checkClerkAuth();
    }

    // Wait for window.load event (all scripts including async ones are loaded)
    if (document.readyState === 'loading') {
      Logger.info('[CS] Waiting for DOMContentLoaded and window.load...');
      document.addEventListener('DOMContentLoaded', () => {
        Logger.info('[CS] DOMContentLoaded fired');
        // Still wait for window.load to ensure async scripts are loaded
        if (document.readyState === 'complete') {
          startAuthCheck();
        } else {
          window.addEventListener('load', () => {
            Logger.info('[CS] Window.load fired - all scripts should be loaded now');
            startAuthCheck();
          });
        }
      });
    } else if (document.readyState === 'complete') {
      // Page fully loaded, but wait a bit for async scripts
      Logger.info('[CS] Document complete, waiting for async scripts...');
      setTimeout(() => {
        startAuthCheck();
      }, 1000); // Give async scripts 1 second to load
    } else {
      // Interactive state - wait for complete
      Logger.info('[CS] Document interactive, waiting for complete state...');
      window.addEventListener('load', () => {
        Logger.info('[CS] Window.load fired - all scripts should be loaded now');
        startAuthCheck();
      });
      // Also start checking immediately as fallback
      startAuthCheck();
    }

    // Also use MutationObserver to detect when Clerk SDK appears
    const clerkObserver = new MutationObserver(() => {
      if (typeof window.Clerk !== 'undefined') {
        Logger.info('[CS] Clerk SDK detected via MutationObserver!');
        clerkObserver.disconnect();
        // Trigger check if not already detected
        if (!userDetected) {
          checkClerkAuth();
        }
      }
    });

    // Observe window object for Clerk property
    try {
      clerkObserver.observe(document, {
        childList: true,
        subtree: true,
        attributes: false,
      });

      // Also poll window object directly
      const checkWindowClerk = setInterval(() => {
        if (typeof window.Clerk !== 'undefined') {
          Logger.info('[CS] Clerk SDK detected via polling!');
          clearInterval(checkWindowClerk);
          clerkObserver.disconnect();
          if (!userDetected) {
            checkClerkAuth();
          }
        }
      }, 500); // Check every 500ms

      // Stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(checkWindowClerk);
        clerkObserver.disconnect();
      }, 30000);
    } catch (e) {
      Logger.warn('[CS] Could not set up MutationObserver:', e.message);
    }
  } else {
    // Not a Clerk accounts.dev page
    Logger.info('[CS] Not a Clerk page, skipping auth detection');
  }

  /**
   * Check for Clerk authentication and send to extension
   * Tries multiple times since Clerk SDK might load asynchronously
   * Also checks cookies as fallback detection method
   */

  function checkClerkAuth() {
    let attempts = 0;
    const maxAttempts = 20; // Increased from 10 to handle slow SDK loading
    const attemptInterval = 1500; // 1.5 seconds between attempts

    /**
     * Try to detect Clerk session from cookies as fallback
     */
    function checkCookiesForAuth() {
      try {
        // Check for Clerk session cookies (common patterns)
        const cookies = document.cookie.split(';');
        const clerkCookiePatterns = ['__session', '__clerk_db_jwt', 'clerk-session', '__client'];

        for (const cookie of cookies) {
          const cookieName = cookie.split('=')[0].trim();
          if (clerkCookiePatterns.some((pattern) => cookieName.includes(pattern))) {
            Logger.info('[CS] Detected Clerk cookie:', cookieName);
            // If we have cookies but no SDK access, we know user is signed in
            // but can't extract user details - this is a fallback signal
            return true;
          }
        }
      } catch (e) {
        // Error checking cookies (non-critical)
      }
      return false;
    }

    function tryCheck() {
      attempts++;
      // Checking Clerk auth
      Logger.info(`[CS] Auth check attempt ${attempts}/${maxAttempts}`);

      try {
        const clerk = getClerkInstance();

        if (clerk) {
          Logger.info('[CS] Clerk SDK found, attempting to get user');
          Logger.info('[CS] Clerk SDK available');

          // Try to get user immediately
          (async () => {
            try {
              // Load Clerk if needed
              if (typeof clerk.load === 'function' && !clerk.loaded) {
                // Loading Clerk SDK
                Logger.info('[CS] Loading Clerk SDK...');
                await clerk.load();
                Logger.info('[CS] Clerk SDK loaded');
              }

              const user = clerk.user;
              Logger.info('[CS] User check:', {
                hasUser: !!user,
                userId: user?.id,
                email: user?.primaryEmailAddress?.emailAddress,
              });

              if (user && !userDetected) {
                userDetected = true;
                Logger.info('[CS] Clerk user detected:', user.id);
                Logger.info('[CS] ✅ USER DETECTED:', user.id);

                // Get session token
                let token = null;
                try {
                  const session = await clerk.session;
                  if (session) {
                    token = await session.getToken();
                    Logger.info('[CS] Successfully retrieved session token');
                  }
                } catch (e) {
                  Logger.warn('[CS] Could not get token from Clerk (non-fatal):', e.message);
                  // Continue without token - user will still be stored
                }

                // Send auth data to extension
                chrome.runtime.sendMessage(
                  {
                    type: 'CLERK_AUTH_DETECTED',
                    user: {
                      id: user.id,
                      email:
                        user.primaryEmailAddress?.emailAddress ||
                        user.emailAddresses?.[0]?.emailAddress,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      username: user.username,
                      imageUrl: user.imageUrl || user.profileImageUrl,
                    },
                    token: token,
                  },
                  (response) => {
                    if (chrome.runtime.lastError) {
                      Logger.error(
                        '[CS] Could not send auth to extension:',
                        chrome.runtime.lastError
                      );
                    } else {
                      Logger.info('[CS] Successfully sent Clerk auth to extension');
                    }
                  }
                );
              } else if (!userDetected && attempts < maxAttempts) {
                // No user yet, try again
                // No user found yet, retrying
                setTimeout(tryCheck, attemptInterval);
              } else if (!userDetected && attempts >= maxAttempts) {
                Logger.warn('[CS] Max attempts reached, Clerk SDK available but no user found');

                // Check if page shows "signed in" message (development mode redirect issue)
                const pageText = document.body.innerText || document.body.textContent || '';
                if (
                  pageText.includes('You are signed in') ||
                  pageText.includes('signed in, but Clerk cannot redirect')
                ) {
                  Logger.info(
                    '[CS] Page indicates user is signed in but redirect failed - attempting to extract session'
                  );

                      // Try to get session even if user object isn't available
                      try {
                        if (clerk.session && typeof clerk.session.then === 'function') {
                          const session = await clerk.session;
                          if (session && session.userId) {
                            Logger.info('[CS] Found session with userId:', session.userId);
                            
                            // Get token from session
                            let token = null;
                            try {
                              token = await session.getToken();
                              if (token) {
                                Logger.info('[CS] Successfully retrieved token from session');
                              }
                            } catch (e) {
                              Logger.warn('[CS] Could not get token (non-fatal):', e.message);
                            }
                            
                            // Try to get user from session
                            let userFromSession = null;
                            try {
                              // Some Clerk versions expose user via session
                              if (session.user) {
                                userFromSession = session.user;
                              } else if (typeof session.getUser === 'function') {
                                userFromSession = await session.getUser();
                              }
                            } catch (userErr) {
                              // Could not get user from session (non-critical)
                            }

                            // Send what we have
                            chrome.runtime.sendMessage(
                              {
                                type: 'CLERK_AUTH_DETECTED',
                                user: userFromSession
                                  ? {
                                      id: userFromSession.id,
                                      email:
                                        userFromSession.primaryEmailAddress?.emailAddress ||
                                        userFromSession.emailAddresses?.[0]?.emailAddress,
                                      firstName: userFromSession.firstName,
                                      lastName: userFromSession.lastName,
                                      username: userFromSession.username,
                                      imageUrl:
                                        userFromSession.imageUrl || userFromSession.profileImageUrl,
                                    }
                                  : {
                                      id: session.userId,
                                      email: null,
                                      firstName: null,
                                      lastName: null,
                                      username: null,
                                      imageUrl: null,
                                    },
                                token: token,
                              },
                          (response) => {
                            if (chrome.runtime.lastError) {
                              Logger.error(
                                '[CS] Could not send session to extension:',
                                chrome.runtime.lastError
                              );
                            } else {
                              Logger.info('[CS] Sent session data to extension');
                              userDetected = true;
                            }
                          }
                        );
                      }
                    }
                  } catch (sessionErr) {
                    // Could not access session (non-critical)
                  }
                }

                // Try cookie fallback
                if (!userDetected && checkCookiesForAuth()) {
                  Logger.info(
                    '[CS] Cookies indicate auth but SDK user not available - user may need to refresh'
                  );
                }
              }
            } catch (error) {
              Logger.error('[CS] Error checking Clerk auth:', error);
              if (!userDetected && attempts < maxAttempts) {
                setTimeout(tryCheck, attemptInterval);
              }
            }
          })();
        } else if (attempts < maxAttempts) {
          // Clerk SDK not loaded yet, try again
          // Clerk SDK not found, retrying
          setTimeout(tryCheck, attemptInterval);
        } else {
          // Max attempts reached, try cookie fallback and page detection
          Logger.warn('[CS] Max attempts reached, Clerk SDK not accessible');

          // Check if page shows "signed in" message
          const pageText = document.body.innerText || document.body.textContent || '';
          if (
            pageText.includes('You are signed in') ||
            pageText.includes('signed in, but Clerk cannot redirect')
          ) {
            Logger.info(
              '[CS] Page indicates user is signed in - attempting to extract from page/cookies'
            );

            // Try to extract email from page
            const emailMatch = pageText.match(
              /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
            );

            if (checkCookiesForAuth() || emailMatch) {
              Logger.info('[CS] Found auth indicators - sending minimal user data');
              
              // Wrap async token retrieval in IIFE since checkClerkAuth is not async
              (async () => {
                // Try to get token if Clerk SDK is available
                let token = null;
                try {
                  const clerk = getClerkInstance();
                  if (clerk) {
                    token = await getClerkToken(clerk);
                  }
                } catch (e) {
                  // SDK may not be accessible - this is a fallback detection
                }
                
                chrome.runtime.sendMessage(
                  {
                    type: 'CLERK_AUTH_DETECTED',
                    user: {
                      id: 'signed-in-user',
                      email: emailMatch ? emailMatch[0] : null,
                      firstName: null,
                      lastName: null,
                      username: null,
                      imageUrl: null,
                    },
                    token: token,
                  },
                  (response) => {
                    if (!chrome.runtime.lastError) {
                      Logger.info('[CS] Sent page-detected auth to extension');
                      userDetected = true;
                    } else {
                      Logger.error(
                        '[CS] Could not send page-detected auth:',
                        chrome.runtime.lastError
                      );
                    }
                  }
                );
              })();
            }
          } else if (checkCookiesForAuth()) {
            Logger.info(
              '[CS] Cookies indicate possible auth but SDK not accessible - CSP restrictions may be blocking access'
            );
          }
        }
      } catch (error) {
        Logger.error('[CS] Error in checkClerkAuth:', error);
        if (!userDetected && attempts < maxAttempts) {
          setTimeout(tryCheck, attemptInterval);
        }
      }
    }

    // Start checking
    tryCheck();

    // Post-load re-check: After max attempts, wait 5 more seconds and check once more
    // This catches cases where Clerk SDK loads very slowly
    setTimeout(
      () => {
        if (!userDetected && typeof window.Clerk !== 'undefined') {
          Logger.info('[CS] Post-load re-check: Clerk SDK now available, checking again...');
          const clerk = getClerkInstance();
          if (clerk) {
            (async () => {
              try {
                if (typeof clerk.load === 'function' && !clerk.loaded) {
                  await clerk.load();
                }
                const user = clerk.user;
                if (user && !userDetected) {
                  userDetected = true;
                  Logger.info('[CS] Post-load re-check: User detected!', user.id);
                  
                  // Get token
                  let token = null;
                  try {
                    token = await getClerkToken(clerk);
                  } catch (e) {
                    Logger.warn('[CS] Post-load re-check: Could not get token (non-fatal):', e.message);
                  }
                  
                  chrome.runtime.sendMessage(
                    {
                      type: 'CLERK_AUTH_DETECTED',
                      user: {
                        id: user.id,
                        email:
                          user.primaryEmailAddress?.emailAddress ||
                          user.emailAddresses?.[0]?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        imageUrl: user.imageUrl || user.profileImageUrl,
                      },
                      token: token,
                    },
                    (response) => {
                      if (!chrome.runtime.lastError) {
                        Logger.info('[CS] Post-load re-check: Successfully sent user auth');
                      } else {
                        Logger.error(
                          '[CS] Post-load re-check: Failed to send:',
                          chrome.runtime.lastError
                        );
                      }
                    }
                  );
                }
              } catch (e) {
                // Post-load re-check failed (non-critical)
              }
            })();
          }
        }
      },
      maxAttempts * attemptInterval + 5000
    ); // Wait max attempts + 5 seconds
  }

  // Listen for messages from popup and background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case 'FORCE_CHECK_AUTH':
        // Manually trigger auth check (called from popup)
        Logger.info('[CS] Received FORCE_CHECK_AUTH message, triggering check...');
        Logger.info('[CS] Current page:', window.location.href);

        // Use the same isClerkPage condition that the main auth detection uses
        // This includes both Clerk pages and aiguardian.ai pages
        if (isClerkPage) {
          Logger.info('[CS] On Clerk page, forcing immediate auth check...');

          // Reset detection flag to allow re-check
          userDetected = false;

          // Try to get user RIGHT NOW if Clerk SDK is available
          (async () => {
            try {
              const clerk = getClerkInstance();
              if (clerk) {
                Logger.info('[CS] Clerk SDK available, checking user immediately...');

                // Try to load if needed
                if (typeof clerk.load === 'function' && !clerk.loaded) {
                  Logger.info('[CS] Loading Clerk SDK...');
                  await clerk.load();
                  Logger.info('[CS] Clerk SDK loaded');
                }

                // Check for user
                const user = clerk.user;
                if (user) {
                  Logger.info('[CS] ✅ USER FOUND IMMEDIATELY:', user.id);
                  userDetected = true;

                  // Get session token if possible
                  let token = null;
                  try {
                    token = await getClerkToken(clerk);
                  } catch (e) {
                    // Could not get token (non-fatal)
                  }

                  chrome.runtime.sendMessage(
                    {
                      type: 'CLERK_AUTH_DETECTED',
                      user: {
                        id: user.id,
                        email:
                          user.primaryEmailAddress?.emailAddress ||
                          user.emailAddresses?.[0]?.emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        imageUrl: user.imageUrl || user.profileImageUrl,
                      },
                      token: token,
                    },
                    (response) => {
                      if (!chrome.runtime.lastError) {
                        Logger.info('[CS] ✅ Successfully sent user auth immediately!');
                        sendResponse({
                          success: true,
                          message: 'User detected and sent',
                          userId: user.id,
                        });
                      } else {
                        Logger.error('[CS] Failed to send:', chrome.runtime.lastError);
                        sendResponse({ success: false, error: chrome.runtime.lastError.message });
                      }
                    }
                  );
                  return;
                } else {
                  Logger.warn(
                    '[CS] Clerk SDK available but no user found - user may not be signed in'
                  );
                }
              } else {
                Logger.warn('[CS] Clerk SDK not available yet, will try normal check');
              }
            } catch (e) {
              Logger.error('[CS] Error checking Clerk immediately:', e);
            }

            // Fallback to normal check
            checkSignedInPage();
            checkClerkAuth();
            sendResponse({ success: true, message: 'Auth check triggered' });
          })();

          return true; // Keep channel open for async response
        } else {
          Logger.warn('[CS] Not on Clerk page, cannot check auth');
          sendResponse({ success: false, message: 'Not on Clerk page' });
          return false;
        }

      case 'REFRESH_CLERK_TOKEN_REQUEST':
        // Handle token refresh request from service worker
        // Content script has access to Clerk SDK, so we can refresh the token
        Logger.info('[CS] REFRESH_CLERK_TOKEN_REQUEST received');

        (async () => {
          try {
            const clerk = getClerkInstance();
            if (!clerk) {
              Logger.warn('[CS] Clerk SDK not available for token refresh');
              sendResponse({ success: false, error: 'Clerk SDK not available' });
              return;
            }

            // Load Clerk if needed
            if (typeof clerk.load === 'function' && !clerk.loaded) {
              await clerk.load();
            }

            // Get session and refresh token
            const session = await clerk.session;
            if (!session) {
              Logger.warn('[CS] No active Clerk session for token refresh');
              sendResponse({ success: false, error: 'No active session' });
              return;
            }

            const token = await session.getToken();
            if (token) {
              Logger.info('[CS] Token refreshed successfully via Clerk SDK');
              sendResponse({ success: true, token: token });
            } else {
              Logger.warn('[CS] Failed to get token from Clerk session');
              sendResponse({ success: false, error: 'Token retrieval failed' });
            }
          } catch (error) {
            Logger.error('[CS] Error refreshing token:', error);
            sendResponse({ success: false, error: error.message || 'Token refresh failed' });
          }
        })();

        return true; // Keep channel open for async response

      case 'ANALYZE_SELECTION':
        const rawSelection = window.getSelection();
        const selection = rawSelection?.toString()?.trim() || '';
        const range =
          rawSelection && rawSelection.rangeCount > 0
            ? rawSelection.getRangeAt(0).cloneRange()
            : null;

        if (selection.length < CONFIG.minSelectionLength) {
          sendResponse({
            success: false,
            error: ERROR_MESSAGES.SELECTION_TOO_SHORT,
          });
          return true;
        }

        if (selection.length > CONFIG.maxSelectionLength) {
          sendResponse({
            success: false,
            error: ERROR_MESSAGES.SELECTION_TOO_LONG,
          });
          return true;
        }

        // Send to background for analysis
        chrome.runtime.sendMessage({ type: 'ANALYZE_TEXT', payload: selection }, (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({
              success: false,
              error: chrome.runtime.lastError.message,
            });
            return;
          }

          // If analysis succeeded, also show the in-page badge/highlight
          if (response && response.success) {
            try {
              displayAnalysisResults(response, range);
            } catch (e) {
              Logger.error('[CS] Failed to display analysis results from popup trigger:', e);
            }
          }

          // Forward response back to popup
          sendResponse(response);
        });

        return true; // Keep channel open for async response

      case 'ANALYZE_SELECTION_COMMAND':
        // Triggered by keyboard shortcut
        analyzeSelection();
        sendResponse({ success: true });
        return true;

      case 'CLEAR_HIGHLIGHTS':
        clearHighlights();
        showBadge('Text highlights removed', 'info');
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
          showBadge('Analysis copied to clipboard', 'info');
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

      Logger.info('[CS] Text copied to clipboard');
    } catch (err) {
      Logger.error('[CS] Failed to copy to clipboard:', err);
    }
  }

  /**
   * TRACER BULLET: Show analysis history modal
   */
  function showAnalysisHistory() {
    chrome.storage.sync.get(['analysis_history'], (data) => {
      if (chrome.runtime.lastError) {
        Logger.error('[CS] Failed to load analysis history:', chrome.runtime.lastError.message);
        showErrorBadge('Failed to load history. Please try again.', 'error');
        return;
      }
      const history = data.analysis_history || [];

      if (history.length === 0) {
        showBadge('No analysis history yet. Try analyzing some text first.', 'info');
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
      header.style.cssText =
        'display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;';

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
        // Handle null/undefined scores gracefully with better validation
        const score = entry.analysis?.score;
        
        // Validate score
        let scorePercent = null;
        if (score !== null && score !== undefined && typeof score === 'number') {
          if (!Number.isNaN(score) && isFinite(score)) {
            // Clamp to valid range
            const clampedScore = Math.max(0, Math.min(1, score));
            scorePercent = Math.round(clampedScore * 100);
          }
        }
        
        const scoreDisplay = scorePercent !== null ? `${scorePercent}%` : 'N/A';
        const scoreColor = scorePercent !== null ? getScoreColor(scorePercent) : '#999';
        
        // Extract bias_type with fallbacks
        const biasType = entry.analysis?.analysis?.bias_type 
          || entry.analysis?.bias_type 
          || entry.analysis?.type 
          || 'Unknown';
        
        const entryDiv = document.createElement('div');
        entryDiv.style.cssText = `
          padding: 12px;
          margin: 8px 0;
          background: #f5f5f5;
          border-radius: 8px;
          border-left: 4px solid ${scoreColor};
        `;
        
        const textDiv = document.createElement('div');
        textDiv.textContent = entry.text || '(No text)';
        textDiv.style.cssText = 'font-weight: 500; margin-bottom: 8px;';
        
        const scoreDiv = document.createElement('div');
        scoreDiv.textContent = `Score: ${scoreDisplay} | Type: ${biasType}`;
        scoreDiv.style.cssText = 'font-size: 12px; color: #666;';
        
        const timeDiv = document.createElement('div');
        const timestamp = entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Unknown time';
        timeDiv.textContent = timestamp;
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

      Logger.info('[CS] History modal displayed');
    });
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  eventListeners.push({ element: window, event: 'beforeunload', handler: cleanup });

  Logger.info('[CS] AiGuardian content script loaded');
})();
