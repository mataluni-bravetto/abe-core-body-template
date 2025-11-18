/**
 * AiGuardian Onboarding Module
 *
 * Provides first-time user guidance and onboarding experience
 * Shows welcome tooltip explaining what AiGuardian does and how to get started
 */

class AiGuardianOnboarding {
  constructor() {
    this.storageKey = 'onboarding_completed';
    this.tooltipShown = false;
  }

  /**
   * Check if onboarding should be shown for this user
   */
  async shouldShow() {
    try {
      // Check if Chrome APIs are available (extension context)
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
        Logger.warn('[Onboarding] Chrome APIs not available - skipping onboarding check');
        return false;
      }
      
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get([this.storageKey], resolve);
      });
      return !data[this.storageKey];
    } catch (error) {
      Logger.error('[Onboarding] Error checking status:', error);
      return false; // Default to not showing if error
    }
  }

  /**
   * Mark onboarding as completed
   */
  async markCompleted() {
    try {
      // Check if Chrome APIs are available (extension context)
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
        Logger.warn('[Onboarding] Chrome APIs not available - cannot mark completed');
        return;
      }
      
      await new Promise((resolve) => {
        chrome.storage.sync.set({ [this.storageKey]: true }, resolve);
      });
      Logger.info('[Onboarding] Marked as completed');
    } catch (error) {
      Logger.error('[Onboarding] Error marking completed:', error);
    }
  }

  /**
   * Show the welcome onboarding tooltip
   */
  async showWelcomeTooltip() {
    if (this.tooltipShown) return;

    try {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'aiguardian-onboarding-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2147483646;
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
      `;

      // Create tooltip container
      const tooltip = document.createElement('div');
      tooltip.className = 'aiguardian-onboarding-tooltip';
      tooltip.style.cssText = `
        background: linear-gradient(135deg, #081C3D 0%, #134390 50%, #1C64D9 100%);
        color: #F9F9F9;
        padding: 24px;
        border-radius: 16px;
        max-width: 320px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(51, 184, 255, 0.3);
        position: relative;
        animation: slideIn 0.4s ease;
        font-family: 'ClashGrotesk-Variable', system-ui, sans-serif;
      `;

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        color: rgba(249, 249, 249, 0.7);
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        line-height: 1;
        transition: color 0.2s;
      `;
      closeBtn.onmouseover = () => closeBtn.style.color = '#F9F9F9';
      closeBtn.onmouseout = () => closeBtn.style.color = 'rgba(249, 249, 249, 0.7)';
      closeBtn.onclick = () => this.hideTooltip();

      // Logo
      const logo = document.createElement('div');
      logo.style.cssText = `
        text-align: center;
        margin-bottom: 16px;
      `;
      logo.innerHTML = `
        <img src="../assets/brand/AiG_Logos/AIG_Logo_Blue.png"
             alt="AiGuardian Logo"
             style="width: 48px; height: 48px; border-radius: 8px; box-shadow: 0 2px 8px rgba(51, 184, 255, 0.3);">
      `;

      // Title
      const title = document.createElement('h2');
      title.textContent = 'Welcome to AiGuardian!';
      title.style.cssText = `
        margin: 0 0 12px 0;
        font-size: 20px;
        font-weight: 700;
        text-align: center;
        color: #33B8FF;
      `;

      // Description
      const description = document.createElement('p');
      description.textContent = 'Finally, AI tools for engineers who don\'t believe the hype. Get transparent bias analysis and confidence scores for any text.';
      description.style.cssText = `
        margin: 0 0 16px 0;
        font-size: 14px;
        line-height: 1.5;
        color: rgba(249, 249, 249, 0.9);
        text-align: center;
      `;

      // Instructions
      const instructions = document.createElement('div');
      instructions.innerHTML = `
        <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #33B8FF;">🚀 How to get started:</div>
          <div style="font-size: 12px; color: rgba(249, 249, 249, 0.8); line-height: 1.4;">
            1. Select text on any webpage<br>
            2. Watch for analysis results<br>
            3. Sign in for advanced features
          </div>
        </div>
      `;

      // Action buttons
      const buttons = document.createElement('div');
      buttons.style.cssText = `
        display: flex;
        gap: 8px;
        justify-content: center;
      `;

      // Try it button
      const tryBtn = document.createElement('button');
      tryBtn.textContent = 'Got it!';
      tryBtn.className = 'btn btn-primary';
      tryBtn.style.cssText += `
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 600;
        min-height: 32px;
      `;
      tryBtn.onclick = () => this.completeOnboarding();

      // Don't show again checkbox
      const dontShowDiv = document.createElement('div');
      dontShowDiv.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 12px;
        font-size: 11px;
        color: rgba(249, 249, 249, 0.6);
      `;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'dont-show-again';
      checkbox.style.cssText = `
        margin-right: 6px;
        accent-color: #33B8FF;
      `;

      const label = document.createElement('label');
      label.htmlFor = 'dont-show-again';
      label.textContent = 'Don\'t show this again';
      label.style.cursor = 'pointer';

      dontShowDiv.appendChild(checkbox);
      dontShowDiv.appendChild(label);

      buttons.appendChild(tryBtn);
      tooltip.appendChild(closeBtn);
      tooltip.appendChild(logo);
      tooltip.appendChild(title);
      tooltip.appendChild(description);
      tooltip.appendChild(instructions);
      tooltip.appendChild(buttons);
      tooltip.appendChild(dontShowDiv);

      overlay.appendChild(tooltip);
      document.body.appendChild(overlay);

      this.tooltipShown = true;
      this.overlay = overlay;
      this.checkbox = checkbox;

      // Add CSS animations
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .aiguardian-onboarding-tooltip .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(51, 184, 255, 0.4);
        }
      `;
      document.head.appendChild(style);

      Logger.info('[Onboarding] Welcome tooltip displayed');
    } catch (error) {
      Logger.error('[Onboarding] Error showing tooltip:', error);
    }
  }

  /**
   * Hide the onboarding tooltip
   */
  hideTooltip() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.remove();
      this.tooltipShown = false;
      Logger.info('[Onboarding] Tooltip hidden');
    }
  }

  /**
   * Complete onboarding and hide tooltip
   */
  async completeOnboarding() {
    try {
      // Check if user wants to skip future onboarding
      if (this.checkbox && this.checkbox.checked) {
        await this.markCompleted();
      }

      this.hideTooltip();
      Logger.info('[Onboarding] Onboarding completed');
    } catch (error) {
      Logger.error('[Onboarding] Error completing onboarding:', error);
      this.hideTooltip(); // Hide anyway
    }
  }

  /**
   * Initialize onboarding check (call from popup)
   */
  async initialize() {
    try {
      const shouldShow = await this.shouldShow();
      if (shouldShow) {
        // Delay to ensure popup is fully loaded
        setTimeout(() => {
          this.showWelcomeTooltip();
        }, 500);
      }
    } catch (error) {
      Logger.error('[Onboarding] Error initializing:', error);
    }
  }
}

// Export for use in popup
window.AiGuardianOnboarding = AiGuardianOnboarding;
