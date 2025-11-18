/**
 * AiGuardian Error Handler
 *
 * Centralized error handling system with user-friendly messages and actionable guidance
 */

class AiGuardianErrorHandler {
  constructor() {
    // User-friendly error messages with actionable guidance
    this.ERROR_TYPES = {
      // Authentication errors
      AUTH_NOT_CONFIGURED: {
        title: 'Authentication Not Set Up',
        message: 'AiGuardian needs to be connected to your account to work properly.',
        action: 'Go to Settings to configure authentication',
        actionType: 'settings',
        severity: 'warning'
      },

      AUTH_SIGN_IN_FAILED: {
        title: 'Sign In Failed',
        message: 'We couldn\'t sign you in. This might be due to network issues or invalid credentials.',
        action: 'Try signing in again or check your internet connection',
        actionType: 'retry',
        severity: 'error'
      },

      AUTH_SIGN_UP_FAILED: {
        title: 'Sign Up Failed',
        message: 'Account creation failed. Please check your information and try again.',
        action: 'Verify your email and password, then try again',
        actionType: 'retry',
        severity: 'error'
      },

      AUTH_REQUIRED: {
        title: 'Sign In Required',
        message: 'You need to be signed in to use AiGuardian analysis features.',
        action: 'Click Sign In to get started',
        actionType: 'signin',
        severity: 'info'
      },

      // Analysis errors
      ANALYSIS_FAILED: {
        title: 'Analysis Failed',
        message: 'We couldn\'t analyze the selected text. This is usually temporary.',
        action: 'Try selecting the text again or check your connection',
        actionType: 'retry',
        severity: 'error'
      },

      ANALYSIS_NO_SELECTION: {
        title: 'No Text Selected',
        message: 'Please select some text on the webpage to analyze.',
        action: 'Highlight text with your mouse, then try again',
        actionType: 'info',
        severity: 'info'
      },

      ANALYSIS_SELECTION_TOO_SHORT: {
        title: 'Text Too Short',
        message: 'Please select at least 10 characters for meaningful analysis.',
        action: 'Select a longer piece of text',
        actionType: 'info',
        severity: 'warning'
      },

      ANALYSIS_SELECTION_TOO_LONG: {
        title: 'Text Too Long',
        message: 'Please select less text (maximum 5000 characters).',
        action: 'Select a shorter piece of text',
        actionType: 'info',
        severity: 'warning'
      },

      // Connection errors
      CONNECTION_FAILED: {
        title: 'Connection Problem',
        message: 'Can\'t connect to AiGuardian servers. Please check your internet connection.',
        action: 'Check your internet and try again in a moment',
        actionType: 'retry',
        severity: 'error'
      },

      BACKEND_UNAVAILABLE: {
        title: 'Service Temporarily Unavailable',
        message: 'AiGuardian servers are temporarily unavailable. Please try again later.',
        action: 'Wait a few minutes and try again',
        actionType: 'retry',
        severity: 'warning'
      },

      // Configuration errors
      CONFIG_INVALID: {
        title: 'Configuration Error',
        message: 'AiGuardian settings need to be updated.',
        action: 'Go to Settings to fix configuration',
        actionType: 'settings',
        severity: 'error'
      },

      API_KEY_INVALID: {
        title: 'Invalid API Key',
        message: 'Your API key is not valid or has expired.',
        action: 'Go to Settings to update your API key',
        actionType: 'settings',
        severity: 'error'
      },

      // Subscription errors
      SUBSCRIPTION_EXPIRED: {
        title: 'Subscription Expired',
        message: 'Your AiGuardian subscription has expired.',
        action: 'Renew your subscription to continue',
        actionType: 'upgrade',
        severity: 'warning'
      },

      USAGE_LIMIT_EXCEEDED: {
        title: 'Usage Limit Reached',
        message: 'You\'ve reached your analysis limit for this period.',
        action: 'Upgrade your plan or wait for reset',
        actionType: 'upgrade',
        severity: 'warning'
      },

      // Generic fallbacks
      UNKNOWN_ERROR: {
        title: 'Something Went Wrong',
        message: 'An unexpected error occurred. Please try again.',
        action: 'Try again or contact support if the problem persists',
        actionType: 'retry',
        severity: 'error'
      },

      NETWORK_ERROR: {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
        action: 'Check your connection and retry',
        actionType: 'retry',
        severity: 'error'
      }
    };

    this.activeErrors = new Map();
  }

  /**
   * Get user-friendly error info for a given error type
   */
  getErrorInfo(errorType, context = {}) {
    const errorInfo = this.ERROR_TYPES[errorType] || this.ERROR_TYPES.UNKNOWN_ERROR;

    // Customize message based on context if needed
    let message = errorInfo.message;
    let action = errorInfo.action;

    // Add context-specific information
    if (context.remainingRequests !== undefined && context.remainingRequests === 0) {
      if (errorType === 'USAGE_LIMIT_EXCEEDED') {
        message = 'You\'ve used all your analyses for this period.';
        action = 'Upgrade to continue analyzing';
      }
    }

    return {
      ...errorInfo,
      message,
      action
    };
  }

  /**
   * Map technical errors to user-friendly types
   */
  mapTechnicalError(error, context = {}) {
    const errorMessage = error?.message || '';
    const errorCode = error?.code || error?.status;

    // Network and connection errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network') ||
        errorMessage.includes('connection') || errorCode === 'NETWORK_ERROR') {
      return 'NETWORK_ERROR';
    }

    // Authentication errors
    if (errorMessage.includes('unauthorized') || errorMessage.includes('forbidden') ||
        errorCode === 401 || errorCode === 403) {
      return 'AUTH_SIGN_IN_FAILED';
    }

    // Server errors
    if (errorCode >= 500 || errorMessage.includes('server error') ||
        errorMessage.includes('internal server')) {
      return 'BACKEND_UNAVAILABLE';
    }

    // Client errors
    if (errorCode === 400 || errorMessage.includes('bad request')) {
      return 'CONFIG_INVALID';
    }

    // Rate limiting
    if (errorCode === 429 || errorMessage.includes('rate limit') ||
        errorMessage.includes('too many requests')) {
      return 'USAGE_LIMIT_EXCEEDED';
    }

    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return 'CONNECTION_FAILED';
    }

    // Selection-related errors
    if (context.isSelectionError) {
      if (context.selectionLength < 10) {
        return 'ANALYSIS_SELECTION_TOO_SHORT';
      }
      if (context.selectionLength > 5000) {
        return 'ANALYSIS_SELECTION_TOO_LONG';
      }
    }

    // Default fallback
    return 'UNKNOWN_ERROR';
  }

  /**
   * Show error to user (popup context)
   */
  showError(errorType, context = {}, options = {}) {
    // Only show errors in popup context, not in options page
    const isOptionsPage = window.location.pathname.includes('options.html');
    if (isOptionsPage) {
      // In options page, just log the error instead of displaying it
      const errorInfo = this.getErrorInfo(errorType, context);
      Logger.error(`[ErrorHandler] ${errorInfo.title}: ${errorInfo.message}`, { errorType, context });
      return null;
    }

    const errorId = Date.now().toString();
    const errorInfo = this.getErrorInfo(errorType, context);

    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = `aiguardian-error ${errorInfo.severity}`;
    errorDiv.setAttribute('data-error-id', errorId);
    errorDiv.setAttribute('role', 'alert');

    errorDiv.innerHTML = `
      <div class="error-header">
        <span class="error-icon">${this.getSeverityIcon(errorInfo.severity)}</span>
        <span class="error-title">${errorInfo.title}</span>
      </div>
      <div class="error-message">${errorInfo.message}</div>
      ${errorInfo.action ? `<div class="error-action">${errorInfo.action}</div>` : ''}
    `;

    // Add action button if applicable
    if (errorInfo.actionType && errorInfo.actionType !== 'info') {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'error-action-btn';
      actionBtn.textContent = this.getActionButtonText(errorInfo.actionType);
      actionBtn.onclick = () => this.handleErrorAction(errorInfo.actionType, context);

      errorDiv.appendChild(actionBtn);
    }

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'error-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close error message');
    closeBtn.onclick = () => this.dismissError(errorId);

    errorDiv.appendChild(closeBtn);

    // Add to DOM - only in popup context
    const container = document.querySelector('.main-content') || document.body;
    container.insertBefore(errorDiv, container.firstChild);

    // Store reference
    this.activeErrors.set(errorId, {
      element: errorDiv,
      timeout: setTimeout(() => this.dismissError(errorId), options.autoDismiss || 8000)
    });

    // Log the error
    Logger.error(`[ErrorHandler] ${errorInfo.title}: ${errorInfo.message}`, { errorType, context });

    return errorId;
  }

  /**
   * Show error from technical error object
   */
  showErrorFromException(error, context = {}) {
    const errorType = this.mapTechnicalError(error, context);
    return this.showError(errorType, context);
  }

  /**
   * Show error badge (content script context)
   */
  showErrorBadge(message, type = 'error') {
    // Remove existing badge
    const existingBadge = document.querySelector('.aiguardian-error-badge');
    if (existingBadge) {
      existingBadge.remove();
    }

    const badge = document.createElement('div');
    badge.className = `aiguardian-error-badge ${type}`;
    badge.textContent = message;

    // Position badge
    badge.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#6b7280'};
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      z-index: 2147483647;
      font: 12px system-ui, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      max-width: 300px;
    `;

    document.body.appendChild(badge);

    // Auto-remove after delay
    setTimeout(() => {
      if (badge.parentNode) {
        badge.remove();
      }
    }, 4000);

    Logger.warn(`[ErrorHandler] Badge: ${message}`);
  }

  /**
   * Handle error action button clicks
   */
  handleErrorAction(actionType, context) {
    switch (actionType) {
      case 'retry':
        // Trigger retry based on context
        if (context.retryCallback) {
          context.retryCallback();
        }
        break;

      case 'signin':
        // Trigger sign in
        if (window.auth && typeof window.auth.signIn === 'function') {
          window.auth.signIn();
        }
        break;

      case 'settings':
        // Open settings
        chrome.runtime.openOptionsPage();
        break;

      case 'upgrade':
        // Open upgrade page
        if (context.upgradeUrl) {
          chrome.tabs.create({ url: context.upgradeUrl });
        }
        break;
    }
  }

  /**
   * Dismiss error by ID
   */
  dismissError(errorId) {
    const errorData = this.activeErrors.get(errorId);
    if (errorData) {
      if (errorData.timeout) {
        clearTimeout(errorData.timeout);
      }
      if (errorData.element && errorData.element.parentNode) {
        errorData.element.remove();
      }
      this.activeErrors.delete(errorId);
    }
  }

  /**
   * Dismiss all errors
   */
  dismissAllErrors() {
    for (const [errorId] of this.activeErrors) {
      this.dismissError(errorId);
    }
  }

  /**
   * Get severity icon
   */
  getSeverityIcon(severity) {
    switch (severity) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '❌';
    }
  }

  /**
   * Get action button text
   */
  getActionButtonText(actionType) {
    switch (actionType) {
      case 'retry': return 'Try Again';
      case 'signin': return 'Sign In';
      case 'settings': return 'Open Settings';
      case 'upgrade': return 'Upgrade';
      default: return 'OK';
    }
  }

  /**
   * Legacy compatibility - show error (for popup.js)
   */
  showLegacyError(message) {
    // Map legacy messages to new system where possible
    if (message.includes('sign in')) {
      return this.showError('AUTH_REQUIRED');
    } else if (message.includes('authentication not configured')) {
      return this.showError('AUTH_NOT_CONFIGURED');
    } else if (message.includes('text selected')) {
      return this.showError('ANALYSIS_NO_SELECTION');
    } else {
      // Fallback to legacy method
      return this.showLegacyErrorDiv(message);
    }
  }

  /**
   * Fallback for legacy error display
   */
  showLegacyErrorDiv(message) {
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
      }, 3000);
    }

    return Date.now().toString();
  }
}

// Global instance
window.AiGuardianErrorHandler = AiGuardianErrorHandler;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AiGuardianErrorHandler;
}
