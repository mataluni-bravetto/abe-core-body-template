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
      showErrorBadge("Text too long for analysis. Select less than 5000 characters.", "warning");
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
          showErrorBadge("Analysis failed. Please try again or check your connection.", "error");
          return;
        }

        if (!response || !response.success) {
          Logger.error("[CS] Analysis failed:", response?.error);
          showErrorBadge("Analysis failed. Please try again or check your connection.", "error");
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
   * Show user-friendly error badges
   */
  function showErrorBadge(message, type = "error") {
    showBadge(message, type);
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

  // Detect Clerk authentication on accounts.dev pages
  // When Clerk redirects to /default-redirect, extract session info
  const isClerkPage = window.location.hostname.includes('accounts.dev') || 
                      window.location.hostname.includes('clerk.accounts.dev') ||
                      window.location.hostname.includes('accounts.clerk.com') ||
                      window.location.hostname.includes('accounts.clerk.dev');
  
  // Shared flag to prevent duplicate detection - must be at top level
  let userDetected = false;
  
  // ALWAYS log to verify content script is running
  console.log('[CS] Content script loaded', {
    hostname: window.location.hostname,
    url: window.location.href,
    isClerkPage: isClerkPage,
    readyState: document.readyState
  });
  
  if (isClerkPage) {
    Logger.info('[CS] Content script running on Clerk page:', window.location.hostname);
    Logger.info('[CS] Page URL:', window.location.href);
    Logger.info('[CS] Document ready state:', document.readyState);
    console.log('[CS] Clerk page detected - starting auth detection');
    
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
            Logger.debug('[CS] No Welcome element found via DOM search, will try pageText regex');
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
            const mainContent = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
            if (mainContent && mainContent.innerText) {
              const visibleText = mainContent.innerText;
              if (visibleText.length > pageText.length && !visibleText.includes(':root')) {
                pageText = visibleText;
              }
            }
          }
        }
        
        const hasSignedInMessage = pageText.includes('You are signed in') || 
                                   pageText.includes('signed in, but Clerk cannot redirect') ||
                                   pageText.includes('Development mode. You are signed in') ||
                                   pageText.includes('Welcome,') ||
                                   hasWelcomeElement;
        
        Logger.info('[CS] Checking signed-in page:', {
          hasSignedInMessage,
          pageTextLength: pageText.length,
          pageTextSnippet: pageText.substring(0, 200),
          url: window.location.href
        });
        console.log('[CS] Signed-in check:', { 
          hasSignedInMessage, 
          pageTextLength: pageText.length,
          hasWelcome: pageText.includes('Welcome'),
          url: window.location.href 
        });
        
        // Also check for "Welcome" pattern even if signed-in message not found
        const hasWelcomePattern = pageText.match(/Welcome,?\s+([A-Z][a-zA-Z\s]+)/i);
        const shouldProcess = hasSignedInMessage || hasWelcomePattern;
        
        if (shouldProcess) {
          Logger.info('[CS] DETECTED: Page shows "signed in" message - user is authenticated but redirect failed');
          
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
                  // Send user data immediately
                  chrome.runtime.sendMessage({
                    type: 'CLERK_AUTH_DETECTED',
                    user: {
                      id: user.id,
                      email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      username: user.username,
                      imageUrl: user.imageUrl || user.profileImageUrl
                    },
                    token: null
                  }, (response) => {
                    if (chrome.runtime.lastError) {
                      Logger.error('[CS] Failed to send user auth:', chrome.runtime.lastError);
                    } else {
                      Logger.info('[CS] Successfully sent user auth immediately');
                    }
                  });
                  return;
                }
                
                // If no user, try session
                if (clerk.session && typeof clerk.session.then === 'function') {
                  Logger.info('[CS] Trying to get session...');
                  const session = await clerk.session;
                  Logger.info('[CS] Session check:', { hasSession: !!session, userId: session?.userId });
                  
                  if (session && session.userId) {
                    Logger.info('[CS] Found session with userId:', session.userId);
                    chrome.runtime.sendMessage({
                      type: 'CLERK_AUTH_DETECTED',
                      user: {
                        id: session.userId,
                        email: null,
                        firstName: null,
                        lastName: null,
                        username: null,
                        imageUrl: null
                      },
                      token: null
                    }, (response) => {
                      if (chrome.runtime.lastError) {
                        Logger.error('[CS] Failed to send session auth:', chrome.runtime.lastError);
                      } else {
                        Logger.info('[CS] Sent session-based auth immediately');
                      }
                    });
                  }
                } else {
                  Logger.warn('[CS] No session available on clerk object');
                }
              } catch (immediateErr) {
                Logger.error('[CS] Immediate extraction failed:', immediateErr);
                Logger.debug('[CS] Will try page content extraction');
              }
            })();
          }
          
          // Fallback: Extract user info from page content when SDK not accessible
          // This handles CSP restrictions or SDK loading issues
          if (!userDetected) {
            Logger.info('[CS] Clerk SDK not accessible, extracting user info from page content');
            
            // Extract user name from "Welcome, {Name}" pattern
            // Prefer the name we found via DOM search, otherwise try regex on pageText
            const extractedName = welcomeName || (pageText.match(/Welcome,?\s+([A-Z][a-zA-Z\s]+)/i)?.[1]?.trim() || null);
            
            Logger.info('[CS] Name extraction result:', {
              welcomeName,
              extractedName,
              pageTextSnippet: pageText.substring(0, 300),
              hasWelcomeInPageText: pageText.includes('Welcome')
            });
            
            // Extract email from page if available
            const emailMatch = pageText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
            
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
              willSend: !!(hasAuthCookies || emailMatch || extractedName)
            });
            
            if (hasAuthCookies || emailMatch || extractedName) {
              Logger.info('[CS] ✅ Found auth indicators from page/cookies:', {
                hasName: !!extractedName,
                name: extractedName,
                hasEmail: !!emailMatch,
                hasCookies: hasAuthCookies
              });
              
              const userData = {
                id: 'signed-in-user-' + Date.now(), // Generate unique ID
                email: emailMatch ? emailMatch[0] : null,
                firstName: firstName,
                lastName: lastName,
                username: extractedName ? extractedName.toLowerCase().replace(/\s+/g, '') : null,
                imageUrl: null
              };
              
              Logger.info('[CS] Attempting to send CLERK_AUTH_DETECTED message:', {
                userId: userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName
              });
              
              try {
                Logger.info('[CS] About to call chrome.runtime.sendMessage');
                console.log('[CS] Sending message now:', { type: 'CLERK_AUTH_DETECTED', user: userData });
                
                // Ensure service worker is active by checking runtime
                if (!chrome.runtime.id) {
                  Logger.error('[CS] ❌ Extension runtime not available');
                  console.error('[CS] Extension runtime not available');
                  return;
                }
                
                chrome.runtime.sendMessage({
                  type: 'CLERK_AUTH_DETECTED',
                  user: userData,
                  token: null
                }, (response) => {
                  // Check if callback was called (might be undefined if service worker didn't respond)
                  Logger.info('[CS] sendMessage callback executed');
                  console.log('[CS] Callback executed, lastError:', chrome.runtime.lastError, 'response:', response);
                  
                  if (chrome.runtime.lastError) {
                    Logger.error('[CS] ❌ Failed to send page-detected auth:', chrome.runtime.lastError.message);
                    console.error('[CS] Runtime error:', chrome.runtime.lastError);
                  } else {
                    Logger.info('[CS] ✅ Successfully sent page-detected auth to extension:', {
                      name: extractedName,
                      email: emailMatch ? emailMatch[0] : null,
                      response: response
                    });
                    console.log('[CS] ✅ Message sent successfully, response:', response);
                    userDetected = true;
                    
                    // Also verify storage was updated
                    chrome.storage.local.get(['clerk_user'], (result) => {
                      if (result.clerk_user) {
                        Logger.info('[CS] ✅ Verified user stored in extension:', result.clerk_user.id);
                        console.log('[CS] ✅ User confirmed in storage:', result.clerk_user);
                      } else {
                        Logger.warn('[CS] ⚠️ User not found in storage after message send');
                        console.warn('[CS] User not in storage:', result);
                      }
                    });
                  }
                });
                
                // Also log after the sendMessage call to verify it was called
                Logger.info('[CS] sendMessage call completed (callback may execute later)');
                console.log('[CS] sendMessage call completed');
              } catch (error) {
                Logger.error('[CS] ❌ Exception sending CLERK_AUTH_DETECTED message:', error);
                console.error('[CS] Exception:', error);
              }
            } else {
              Logger.warn('[CS] Page shows signed in but no user info could be extracted from page content');
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
        if (pageText.includes(':root') || (pageText.length > 50 && (pageText.includes('Welcome') || pageText.includes('signed in')))) {
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
        attributes: false
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
      Logger.debug('[CS] Could not set up MutationObserver:', e);
    }
  } else {
    Logger.debug('[CS] Not a Clerk accounts.dev page:', window.location.hostname);
    console.log('[CS] Not a Clerk page, skipping auth detection');
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
        const clerkCookiePatterns = [
          '__session',
          '__clerk_db_jwt',
          'clerk-session',
          '__client'
        ];
        
        for (const cookie of cookies) {
          const cookieName = cookie.split('=')[0].trim();
          if (clerkCookiePatterns.some(pattern => cookieName.includes(pattern))) {
            Logger.info('[CS] Detected Clerk cookie:', cookieName);
            // If we have cookies but no SDK access, we know user is signed in
            // but can't extract user details - this is a fallback signal
            return true;
          }
        }
      } catch (e) {
        Logger.debug('[CS] Error checking cookies:', e);
      }
      return false;
    }
    
    function tryCheck() {
      attempts++;
      Logger.debug(`[CS] Checking Clerk auth (attempt ${attempts}/${maxAttempts})`);
      console.log(`[CS] Auth check attempt ${attempts}/${maxAttempts}`);
      
      try {
        const clerk = getClerkInstance();
        
        if (clerk) {
          Logger.info('[CS] Clerk SDK found, attempting to get user');
          console.log('[CS] Clerk SDK available');
          
          // Try to get user immediately
          (async () => {
            try {
              // Load Clerk if needed
              if (typeof clerk.load === 'function' && !clerk.loaded) {
                Logger.debug('[CS] Loading Clerk SDK...');
                console.log('[CS] Loading Clerk SDK...');
                await clerk.load();
                console.log('[CS] Clerk SDK loaded');
              }
              
              const user = clerk.user;
              console.log('[CS] User check:', { hasUser: !!user, userId: user?.id, email: user?.primaryEmailAddress?.emailAddress });
              
              if (user && !userDetected) {
                userDetected = true;
                Logger.info('[CS] Clerk user detected:', user.id);
                console.log('[CS] ✅ USER DETECTED:', user.id);
                
                // Get session token
                let token = null;
                try {
                  const session = await clerk.session;
                  if (session) {
                    token = await session.getToken();
                    Logger.debug('[CS] Successfully retrieved session token');
                  }
                } catch (e) {
                  Logger.warn('[CS] Could not get token from Clerk (non-fatal):', e.message);
                  // Continue without token - user will still be stored
                }

                // Send auth data to extension
                chrome.runtime.sendMessage({
                  type: 'CLERK_AUTH_DETECTED',
                  user: {
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    imageUrl: user.imageUrl || user.profileImageUrl
                  },
                  token: token
                }, (response) => {
                  if (chrome.runtime.lastError) {
                    Logger.error('[CS] Could not send auth to extension:', chrome.runtime.lastError);
                  } else {
                    Logger.info('[CS] Successfully sent Clerk auth to extension');
                  }
                });
              } else if (!userDetected && attempts < maxAttempts) {
                // No user yet, try again
                Logger.debug('[CS] No user found yet, retrying...');
                setTimeout(tryCheck, attemptInterval);
              } else if (!userDetected && attempts >= maxAttempts) {
                Logger.warn('[CS] Max attempts reached, Clerk SDK available but no user found');
                
                // Check if page shows "signed in" message (development mode redirect issue)
                const pageText = document.body.innerText || document.body.textContent || '';
                if (pageText.includes('You are signed in') || pageText.includes('signed in, but Clerk cannot redirect')) {
                  Logger.info('[CS] Page indicates user is signed in but redirect failed - attempting to extract session');
                  
                  // Try to get session even if user object isn't available
                  try {
                    if (clerk.session && typeof clerk.session.then === 'function') {
                      const session = await clerk.session;
                      if (session && session.userId) {
                        Logger.info('[CS] Found session with userId:', session.userId);
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
                          Logger.debug('[CS] Could not get user from session:', userErr);
                        }
                        
                        // Send what we have
                        chrome.runtime.sendMessage({
                          type: 'CLERK_AUTH_DETECTED',
                          user: userFromSession ? {
                            id: userFromSession.id,
                            email: userFromSession.primaryEmailAddress?.emailAddress || userFromSession.emailAddresses?.[0]?.emailAddress,
                            firstName: userFromSession.firstName,
                            lastName: userFromSession.lastName,
                            username: userFromSession.username,
                            imageUrl: userFromSession.imageUrl || userFromSession.profileImageUrl
                          } : {
                            id: session.userId,
                            email: null,
                            firstName: null,
                            lastName: null,
                            username: null,
                            imageUrl: null
                          },
                          token: null
                        }, (response) => {
                          if (chrome.runtime.lastError) {
                            Logger.error('[CS] Could not send session to extension:', chrome.runtime.lastError);
                          } else {
                            Logger.info('[CS] Sent session data to extension');
                            userDetected = true;
                          }
                        });
                      }
                    }
                  } catch (sessionErr) {
                    Logger.debug('[CS] Could not access session:', sessionErr);
                  }
                }
                
                // Try cookie fallback
                if (!userDetected && checkCookiesForAuth()) {
                  Logger.info('[CS] Cookies indicate auth but SDK user not available - user may need to refresh');
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
          Logger.debug('[CS] Clerk SDK not found, retrying...');
          setTimeout(tryCheck, attemptInterval);
        } else {
          // Max attempts reached, try cookie fallback and page detection
          Logger.warn('[CS] Max attempts reached, Clerk SDK not accessible');
          
          // Check if page shows "signed in" message
          const pageText = document.body.innerText || document.body.textContent || '';
          if (pageText.includes('You are signed in') || pageText.includes('signed in, but Clerk cannot redirect')) {
            Logger.info('[CS] Page indicates user is signed in - attempting to extract from page/cookies');
            
            // Try to extract email from page
            const emailMatch = pageText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
            
            if (checkCookiesForAuth() || emailMatch) {
              Logger.info('[CS] Found auth indicators - sending minimal user data');
              chrome.runtime.sendMessage({
                type: 'CLERK_AUTH_DETECTED',
                user: {
                  id: 'signed-in-user',
                  email: emailMatch ? emailMatch[0] : null,
                  firstName: null,
                  lastName: null,
                  username: null,
                  imageUrl: null
                },
                token: null
              }, (response) => {
                if (!chrome.runtime.lastError) {
                  Logger.info('[CS] Sent page-detected auth to extension');
                  userDetected = true;
                } else {
                  Logger.error('[CS] Could not send page-detected auth:', chrome.runtime.lastError);
                }
              });
            }
          } else if (checkCookiesForAuth()) {
            Logger.info('[CS] Cookies indicate possible auth but SDK not accessible - CSP restrictions may be blocking access');
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
    setTimeout(() => {
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
                chrome.runtime.sendMessage({
                  type: 'CLERK_AUTH_DETECTED',
                  user: {
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    imageUrl: user.imageUrl || user.profileImageUrl
                  },
                  token: null
                }, (response) => {
                  if (!chrome.runtime.lastError) {
                    Logger.info('[CS] Post-load re-check: Successfully sent user auth');
                  } else {
                    Logger.error('[CS] Post-load re-check: Failed to send:', chrome.runtime.lastError);
                  }
                });
              }
            } catch (e) {
              Logger.debug('[CS] Post-load re-check failed:', e);
            }
          })();
        }
      }
    }, (maxAttempts * attemptInterval) + 5000); // Wait max attempts + 5 seconds
  }

  // Listen for messages from popup and background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case 'FORCE_CHECK_AUTH':
        // Manually trigger auth check (called from popup)
        Logger.info('[CS] Received FORCE_CHECK_AUTH message, triggering check...');
        Logger.info('[CS] Current page:', window.location.href);
        
        // Check if we're on ANY Clerk page (including organization pages)
        const isAnyClerkPage = window.location.hostname.includes('accounts.dev') || 
                               window.location.hostname.includes('clerk.accounts.dev') ||
                               window.location.hostname.includes('accounts.clerk.com') ||
                               window.location.hostname.includes('accounts.clerk.dev');
        
        if (isAnyClerkPage) {
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
                    const session = await clerk.session;
                    if (session) {
                      token = await session.getToken();
                    }
                  } catch (e) {
                    Logger.debug('[CS] Could not get token (non-fatal):', e);
                  }
                  
                  chrome.runtime.sendMessage({
                    type: 'CLERK_AUTH_DETECTED',
                    user: {
                      id: user.id,
                      email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      username: user.username,
                      imageUrl: user.imageUrl || user.profileImageUrl
                    },
                    token: token
                  }, (response) => {
                    if (!chrome.runtime.lastError) {
                      Logger.info('[CS] ✅ Successfully sent user auth immediately!');
                      sendResponse({ success: true, message: 'User detected and sent', userId: user.id });
                    } else {
                      Logger.error('[CS] Failed to send:', chrome.runtime.lastError);
                      sendResponse({ success: false, error: chrome.runtime.lastError.message });
                    }
                  });
                  return;
                } else {
                  Logger.warn('[CS] Clerk SDK available but no user found - user may not be signed in');
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
        showBadge("Text highlights removed", "info");
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
          showBadge("Analysis copied to clipboard", "info");
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
        showBadge("No analysis history yet. Try analyzing some text first.", "info");
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

