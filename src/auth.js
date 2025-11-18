/**
 * AiGuardian Authentication Module
 *
 * Handles Clerk authentication for Chrome extension
 * Provides sign in, sign up, and user session management
 *
 * IMPORTANT: Payment and subscription management is handled through Stripe
 * on the landing page (https://www.aiguardian.ai). Users who sign up through
 * the landing page will have their accounts automatically recognized here.
 * The extension does NOT handle payments - it only displays subscription
 * status fetched from the backend API.
 */

class AiGuardianAuth {
  constructor() {
    this.clerk = null;
    this.isInitialized = false;
    this.publishableKey = null;
    this.user = null;
  }

  /**
   * Initialize Clerk authentication
   * Automatically fetches Clerk key from backend - no user configuration needed
   */
  async initialize() {
    try {
      Logger.info('[Auth] Starting initialization...');
      
      // Get Clerk publishable key from settings (tries backend first, then fallback)
      const settings = await this.getSettings();
      // Trim whitespace to prevent issues
      this.publishableKey = settings.clerk_publishable_key ? settings.clerk_publishable_key.trim() : null;
      Logger.info('[Auth] Got settings, key present:', !!this.publishableKey, 'source:', settings.source);

      // If still no key, log error - user must configure via backend or options page
      if (!this.publishableKey) {
        Logger.error('[Auth] Clerk publishable key not found - must be configured via backend API or options page');
        throw new Error('Clerk publishable key not configured. Please configure it in extension settings or ensure backend API returns it.');
      }

      // Import Clerk SDK dynamically
      Logger.info('[Auth] Checking Clerk SDK...', {
        'typeof Clerk': typeof Clerk,
        'window.Clerk': typeof window.Clerk
      });
      
      if (typeof Clerk === 'undefined' && typeof window.Clerk === 'undefined') {
        Logger.info('[Auth] Clerk SDK not found, loading...');
        await this.loadClerkSDK();
        Logger.info('[Auth] Clerk SDK loaded');
      } else {
        Logger.info('[Auth] Clerk SDK already available');
      }

      // Initialize Clerk for Chrome extension
      // The bundled Clerk SDK auto-instantiates window.Clerk with publishable key from window.__clerk_publishable_key
      // We set this in loadClerkSDK() before loading the script
      const clerkInstance = window.Clerk;
      Logger.info('[Auth] Clerk instance:', {
        exists: !!clerkInstance,
        type: typeof clerkInstance,
        hasLoad: typeof clerkInstance?.load === 'function'
      });
      
      if (!clerkInstance) {
        throw new Error('Clerk SDK not loaded - window.Clerk not found');
      }
      
      // Use the auto-instantiated Clerk instance
      this.clerk = clerkInstance;
      Logger.info('[Auth] Clerk instance assigned');
      
      // Ensure Clerk is loaded
      Logger.info('[Auth] Checking if Clerk is loaded...', {
        loaded: this.clerk.loaded,
        hasLoad: typeof this.clerk.load === 'function',
        clerkKeys: Object.keys(this.clerk).slice(0, 10) // Show first 10 keys for debugging
      });
      
      // Only call load() if it exists and Clerk is not already loaded
      if (typeof this.clerk.load === 'function') {
        if (!this.clerk.loaded) {
          Logger.info('[Auth] Calling clerk.load()...');
          await this.clerk.load();
          Logger.info('[Auth] clerk.load() completed');
        } else {
          Logger.info('[Auth] Clerk already loaded');
        }
      } else {
        // Clerk SDK might not have a load() method - check if it's ready another way
        Logger.info('[Auth] Clerk SDK does not have load() method - assuming ready');
        // Check if Clerk has a ready state or user property to verify it's working
        if (typeof this.clerk.user !== 'undefined' || typeof this.clerk.session !== 'undefined') {
          Logger.info('[Auth] Clerk appears to be ready (has user/session properties)');
        } else {
          Logger.warn('[Auth] Clerk SDK loaded but load() method not available - may need different initialization');
        }
      }

      this.isInitialized = true;
      Logger.info('[Auth] Clerk authentication initialized successfully');

      // Check if user is already signed in (don't fail initialization if this errors)
      Logger.info('[Auth] Checking user session...');
      try {
        await this.checkUserSession();
        Logger.info('[Auth] User session check completed');
      } catch (sessionError) {
        // Don't fail initialization if user session check fails - user might not be signed in yet
        Logger.warn('[Auth] User session check failed (non-critical):', sessionError.message);
      }

      return true;
    } catch (error) {
      Logger.error('[Auth] Failed to initialize Clerk:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        error: error
      });
      console.error('[Auth] Full error details:', error);
      return false;
    }
  }

  /**
   * Load Clerk SDK from bundled file
   * Uses bundled version to avoid CSP issues with external scripts in Manifest V3
   * Sets publishable key before loading so Clerk SDK can use it
   */
  async loadClerkSDK() {
    // Check if Clerk is already loaded
    if (typeof Clerk !== 'undefined' || window.Clerk) {
      return Promise.resolve();
    }

    // Set publishable key before loading Clerk SDK
    // Clerk SDK browser build reads this from window.__clerk_publishable_key
    if (this.publishableKey) {
      window.__clerk_publishable_key = this.publishableKey;
    }

    return new Promise((resolve, reject) => {
      // Check if Chrome APIs are available (extension context)
      if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.getURL) {
        Logger.warn('[Auth] Chrome runtime API not available - loading Clerk SDK from CDN');
        // Fallback: load from CDN for testing
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
        script.onload = () => {
          if (typeof Clerk !== 'undefined' || window.Clerk) {
            resolve();
          } else {
            reject(new Error('Clerk SDK loaded from CDN but Clerk object not found'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load Clerk SDK from CDN'));
        document.head.appendChild(script);
        return;
      }
      
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('src/vendor/clerk.js');
      script.onload = () => {
        // Clerk should be available as window.Clerk after script loads
        if (typeof Clerk !== 'undefined' || window.Clerk) {
          resolve();
        } else {
          reject(new Error('Clerk SDK loaded but Clerk object not found'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Clerk SDK bundle'));
      document.head.appendChild(script);
    });
  }

  /**
   * Fetch public configuration from backend API
   * Gets Clerk publishable key from AWS Secrets Manager via backend
   * Returns detailed error information for diagnostic display
   */
  async fetchPublicConfig() {
    try {
      // Get gateway URL from settings (will use default if not configured)
      const gatewayUrl = await this.getGatewayUrl();
      if (!gatewayUrl) {
        Logger.debug('[Auth] No gateway URL available, skipping public config fetch');
        return { error: 'No gateway URL configured', errorType: 'no_gateway' };
      }

      const configUrl = `${gatewayUrl.replace(/\/$/, '')}/api/v1/config/public`;
      
      Logger.info('[Auth] Fetching public config from backend:', configUrl);
      
      // Create timeout signal with fallback for browsers without AbortSignal.timeout
      let timeoutSignal;
      let timeoutId = null;
      if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
        timeoutSignal = AbortSignal.timeout(5000);
      } else {
        // Fallback for older browsers using AbortController
        const controller = new AbortController();
        timeoutId = setTimeout(() => {
          controller.abort();
        }, 5000);
        
        // Clean up timeout if signal is aborted early
        const signal = controller.signal;
        if (signal.addEventListener) {
          signal.addEventListener('abort', () => {
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
          });
        }
        timeoutSignal = signal;
      }
      
      let response;
      try {
        response = await fetch(configUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Extension-Version': chrome.runtime.getManifest().version
          },
          signal: timeoutSignal
        });
      } catch (fetchError) {
        // Clean up timeout after fetch fails
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        // Handle fetch errors (network, CORS, etc.)
        if (fetchError.name === 'AbortError' || fetchError.message.includes('timeout')) {
          Logger.warn('[Auth] Backend config fetch timed out');
          return { error: 'Timeout after 5s', errorType: 'timeout', httpStatus: null };
        } else if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError')) {
          Logger.warn('[Auth] Network error fetching config:', fetchError.message);
          return { error: 'Network error - cannot reach backend', errorType: 'network', httpStatus: null };
        } else {
          Logger.warn('[Auth] Fetch error:', fetchError.message);
          return { error: fetchError.message, errorType: 'fetch_error', httpStatus: null };
        }
      } finally {
        // Clean up timeout after fetch completes (success or failure)
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        Logger.warn(`[Auth] Backend returned ${response.status}: ${errorText}`);
        const errorMsg = response.status === 404 
          ? `Backend returned 404 - endpoint not found`
          : response.status === 500
          ? `Backend returned 500 - server error`
          : `Backend returned ${response.status}`;
        return { error: errorMsg, errorType: 'http_error', httpStatus: response.status };
      }

      const config = await response.json().catch((parseError) => {
        Logger.error('[Auth] Failed to parse JSON response:', parseError);
        return null;
      });
      
      if (!config) {
        return { error: 'Backend returned invalid JSON', errorType: 'parse_error', httpStatus: response.status };
      }
      
      if (config.clerk_publishable_key) {
        Logger.info(`[Auth] Successfully fetched Clerk publishable key from backend (source: ${config.source || 'unknown'})`);
        // Cache the key in storage for offline use
        await this.cacheClerkKey(config.clerk_publishable_key);
        return config;
      }
      
      Logger.warn('[Auth] Backend config response missing clerk_publishable_key');
      return { error: 'Backend returned empty response - no Clerk key', errorType: 'empty_response', httpStatus: response.status };
    } catch (error) {
      // Unexpected errors
      Logger.error('[Auth] Unexpected error fetching public config:', error);
      return { error: error.message || 'Unknown error', errorType: 'unexpected_error', httpStatus: null };
    }
  }

  /**
   * Get gateway URL from storage or use default
   */
  async getGatewayUrl() {
    return new Promise((resolve) => {
      // Check if Chrome APIs are available (extension context)
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
        Logger.warn('[Auth] Chrome storage API not available - using default gateway URL');
        resolve('https://api.aiguardian.ai');
        return;
      }
      
      chrome.storage.sync.get(['gateway_url'], (data) => {
        // Use configured URL or fall back to default production URL
        resolve(data.gateway_url || 'https://api.aiguardian.ai');
      });
    });
  }

  /**
   * Cache Clerk publishable key in storage
   */
  async cacheClerkKey(key) {
    // Trim whitespace to prevent issues
    const trimmedKey = typeof key === 'string' ? key.trim() : key;
    if (!trimmedKey) {
      Logger.warn('[Auth] Attempted to cache empty Clerk key');
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      chrome.storage.sync.set({ 
        clerk_publishable_key: trimmedKey,
        clerk_key_source: 'backend_api',
        clerk_key_cached_at: Date.now()
      }, resolve);
    });
  }

  /**
   * Extract instance ID from Clerk publishable key and build instance-specific URL
   * @param {string} publishableKey - The Clerk publishable key
   * @param {string} path - The path (e.g., 'sign-in', 'sign-up')
   * @param {string} redirectUrl - The redirect URL after authentication
   * @returns {string|null} The constructed URL or null if extraction fails
   */
  buildClerkInstanceUrl(publishableKey, path, redirectUrl) {
    if (!publishableKey) {
      return null;
    }

    try {
      // Clerk publishable keys contain instance info encoded in base64
      // Format: pk_test_{base64-encoded-instance-info} or pk_live_{base64-encoded-instance-info}
      // Decoded format: {instance-id}.clerk.accounts.dev$ or {instance-id}.accounts.dev$
      const keyParts = publishableKey.split('_');
      if (keyParts.length < 3) {
        Logger.warn('[Auth] Invalid publishable key format');
        return null;
      }

      const keyType = keyParts[1]; // 'test' or 'live'
      const encodedInstance = keyParts.slice(2).join('_'); // Rest of the key

      // Decode base64 to get instance identifier
      // In browser context, use atob; in Node.js, use Buffer
      let decodedInstance;
      if (typeof atob !== 'undefined') {
        decodedInstance = atob(encodedInstance);
      } else if (typeof Buffer !== 'undefined') {
        decodedInstance = Buffer.from(encodedInstance, 'base64').toString('utf-8');
      } else {
        Logger.warn('[Auth] No base64 decoder available');
        return null;
      }

      // Decoded format is typically: {instance-id}.clerk.accounts.dev$ or {instance-id}.accounts.dev$
      // Extract instance ID (everything before the first dot)
      const instanceMatch = decodedInstance.match(/^([^.]+)/);
      if (!instanceMatch) {
        Logger.warn('[Auth] Could not extract instance ID from decoded key');
        return null;
      }

      const instanceId = instanceMatch[1];
      // Construct proper Clerk instance URL
      // Test keys use: {instance-id}.accounts.dev
      // Production keys use: {instance-id}.clerk.accounts.dev
      const instanceDomain = keyType === 'test' 
        ? `${instanceId}.accounts.dev`
        : `${instanceId}.clerk.accounts.dev`;

      const url = `https://${instanceDomain}/${path}?__clerk_publishable_key=${encodeURIComponent(publishableKey)}&redirect_url=${encodeURIComponent(redirectUrl)}`;
      Logger.info('[Auth] Built Clerk instance URL:', { instanceId, domain: instanceDomain, path });
      return url;
    } catch (error) {
      Logger.warn('[Auth] Failed to build Clerk instance URL:', error);
      return null;
    }
  }

  /**
   * Get authentication settings from storage or backend API
   * Tries backend API first, falls back to manual configuration, then hardcoded default
   * Users never need to configure anything - it just works
   * Returns error information if backend fetch fails
   */
  async getSettings() {
    // First, try to fetch from backend API (if gateway URL is configured)
    const publicConfig = await this.fetchPublicConfig();
    
    Logger.info('[Auth] fetchPublicConfig() returned:', {
      hasKey: !!(publicConfig && publicConfig.clerk_publishable_key),
      hasError: !!(publicConfig && publicConfig.error),
      error: publicConfig && publicConfig.error,
      errorType: publicConfig && publicConfig.errorType
    });
    
    if (publicConfig && publicConfig.clerk_publishable_key) {
      // Trim whitespace to prevent issues
      const trimmedKey = publicConfig.clerk_publishable_key.trim();
      return {
        clerk_publishable_key: trimmedKey,
        source: 'backend_api',
        error: null
      };
    }

    // If fetchPublicConfig returned an error object, preserve it
    const fetchError = publicConfig && publicConfig.error ? {
      error: publicConfig.error,
      errorType: publicConfig.errorType,
      httpStatus: publicConfig.httpStatus
    } : null;
    
    Logger.info('[Auth] Extracted fetchError:', fetchError);

      // Fallback to manual configuration from storage
      return new Promise((resolve) => {
        // Check if Chrome APIs are available (extension context)
        if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
          Logger.warn('[Auth] Chrome storage API not available');
          resolve({
            clerk_publishable_key: null,
            source: 'not_available',
            error: fetchError
          });
          return;
        }
        
        chrome.storage.sync.get(['clerk_publishable_key'], (data) => {
          const manualKey = data.clerk_publishable_key ? data.clerk_publishable_key.trim() : null;
          
          if (manualKey) {
            resolve({
              clerk_publishable_key: manualKey,
              source: 'manual_config',
              error: null
            });
          } else {
            // Final fallback to hardcoded default (publishable keys are safe to expose)
            const hardcodedKey = typeof DEFAULT_CONFIG !== 'undefined' && DEFAULT_CONFIG.CLERK_PUBLISHABLE_KEY 
              ? DEFAULT_CONFIG.CLERK_PUBLISHABLE_KEY.trim() 
              : null;
            
            if (hardcodedKey) {
              resolve({
                clerk_publishable_key: hardcodedKey,
                source: 'hardcoded_default',
                error: null
              });
            } else {
              // No key found anywhere
              resolve({
                clerk_publishable_key: null,
                source: 'not_configured',
                error: fetchError
              });
            }
          }
        });
      });
  }

  /**
   * Check current user session
   */
  async checkUserSession() {
    Logger.info('[Auth] checkUserSession() called', {
      isInitialized: this.isInitialized,
      hasClerk: !!this.clerk
    });
    
    if (!this.isInitialized || !this.clerk) {
      Logger.warn('[Auth] checkUserSession() skipped - not initialized or no clerk');
      return;
    }

    try {
      Logger.info('[Auth] Waiting for Clerk to be ready...');
      Logger.info('[Auth] Clerk state before load:', {
        loaded: this.clerk.loaded,
        hasLoad: typeof this.clerk.load === 'function',
        hasUser: typeof this.clerk.user !== 'undefined'
      });
      
      // Wait for Clerk to be ready (only if load() method exists and not already loaded)
      if (typeof this.clerk.load === 'function') {
        if (!this.clerk.loaded) {
          Logger.info('[Auth] Calling clerk.load()...');
          await this.clerk.load();
          Logger.info('[Auth] clerk.load() completed');
        } else {
          Logger.info('[Auth] Clerk already loaded, skipping load()');
        }
      } else {
        Logger.info('[Auth] Clerk SDK does not have load() method - assuming ready');
      }
      
      Logger.info('[Auth] Clerk state after load:', {
        loaded: this.clerk.loaded,
        hasUser: typeof this.clerk.user !== 'undefined'
      });
      
      // Check storage first - this is populated by the callback handler
      // Storage works in all contexts, while clerk.user only works if cookies are accessible
      let user = null;
      Logger.info('[Auth] Checking stored user first...');
      const stored = await this.getStoredUser();
      if (stored) {
        user = stored;
        Logger.info('[Auth] Found stored user:', user.id || 'stored');
      } else {
        Logger.info('[Auth] No stored user, checking Clerk instance...');
        // Try to get user from Clerk instance (only works if cookies are accessible)
        try {
          user = this.clerk.user;
          Logger.info('[Auth] clerk.user accessed:', user ? `user found (id: ${user.id})` : 'null');
        } catch (e) {
          Logger.warn('[Auth] Error accessing clerk.user:', e.message);
        }
      }
      
      if (user) {
        this.user = user;
        Logger.info('[Auth] User session found:', user.id || 'stored');
        // Store the user in extension storage if not already stored
        await this.storeAuthState(user);
      } else {
        // If no user found, try to sync from Clerk's session
        // This handles cases where Clerk redirected to default page instead of callback
        Logger.info('[Auth] No stored user, attempting to sync from Clerk session...');
        const synced = await this.syncAuthFromClerk();
        if (synced && this.user) {
          Logger.info('[Auth] Successfully synced user from Clerk session');
        } else {
          this.user = null;
          Logger.info('[Auth] No active user session');
        }
      }
    } catch (error) {
      Logger.error('[Auth] Error checking user session:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      console.error('[Auth] Full error in checkUserSession:', error);
      // Fallback: check stored user
      const stored = await this.getStoredUser();
      if (stored) {
        this.user = stored;
        Logger.info('[Auth] Using stored user as fallback');
      } else {
        this.user = null;
        Logger.info('[Auth] No stored user found');
      }
    }
  }

  /**
   * Get stored user from extension storage
   */
  async getStoredUser() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['clerk_user'], (data) => {
        resolve(data.clerk_user || null);
      });
    });
  }

  /**
   * Sign in user - redirect to Clerk auth page
   */
  async signIn() {
    Logger.info('[Auth] signIn() called');
    Logger.info('[Auth] isInitialized:', this.isInitialized);
    Logger.info('[Auth] clerk exists:', !!this.clerk);
    Logger.info('[Auth] publishableKey:', this.publishableKey ? `${this.publishableKey.substring(0, 20)}...` : 'null');

    // Ensure we have what we need - initialize on demand if needed
      if (!this.publishableKey) {
        Logger.info('[Auth] No publishable key, fetching settings...');
        const settings = await this.getSettings();
        this.publishableKey = settings.clerk_publishable_key;
        if (!this.publishableKey) {
          throw new Error('Clerk publishable key not configured. Please configure it in extension settings.');
        }
      }
    
    if (!this.clerk || typeof window.Clerk === 'undefined') {
      Logger.info('[Auth] Clerk SDK not loaded, loading...');
      if (typeof window.Clerk === 'undefined') {
        await this.loadClerkSDK();
      }
      this.clerk = window.Clerk;
      if (this.clerk && typeof this.clerk.load === 'function' && !this.clerk.loaded) {
        await this.clerk.load();
      }
    }
    
    if (!this.clerk || !this.publishableKey) {
      const error = new Error('Clerk authentication not available');
      Logger.error('[Auth] Sign-in failed - missing requirements:', {
        hasClerk: !!this.clerk,
        hasPublishableKey: !!this.publishableKey
      });
      throw error;
    }

    try {
      // Generate redirect URL first
      let redirectUrl;
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        redirectUrl = chrome.runtime.getURL('/src/clerk-callback.html');
      } else {
        // Fallback for testing outside extension context
        redirectUrl = window.location.origin + '/src/clerk-callback.html';
      }
      Logger.info('[Auth] Redirect URL:', redirectUrl);
      
      // Build Clerk sign-in URL using proper instance-specific format
      // Clerk uses instance-specific URLs, not generic accounts.clerk.dev/com
      // The instance ID is encoded in the publishable key
      let signInUrl;
      
      if (this.publishableKey) {
        // Try to use Clerk SDK to generate the URL if available
        if (this.clerk && this.clerk.client && typeof this.clerk.client.signIn === 'object') {
          try {
            // Use Clerk SDK's signIn.create() to generate proper URL
            const signInResource = await this.clerk.client.signIn.create({
              redirectUrl: redirectUrl
            });
            if (signInResource && signInResource.url) {
              signInUrl = signInResource.url;
              Logger.info('[Auth] Generated sign-in URL from Clerk SDK');
            }
          } catch (sdkError) {
            Logger.warn('[Auth] Failed to generate URL from Clerk SDK, using manual construction:', sdkError);
          }
        }
        
        // Fallback: Extract instance ID from publishable key and construct URL manually
        if (!signInUrl) {
          signInUrl = this.buildClerkInstanceUrl(this.publishableKey, 'sign-in', redirectUrl);
          
          // If extraction failed, use fallback URL with publishable key parameter
          if (!signInUrl) {
            const keyParts = this.publishableKey.split('_');
            const keyType = keyParts.length >= 2 ? keyParts[1] : 'test';
            const baseDomain = keyType === 'test' 
              ? 'accounts.dev' 
              : 'clerk.accounts.dev';
            signInUrl = `https://${baseDomain}/sign-in?__clerk_publishable_key=${encodeURIComponent(this.publishableKey)}&redirect_url=${encodeURIComponent(redirectUrl)}`;
            Logger.warn('[Auth] Using fallback URL format (instance extraction failed)');
          }
        }
      } else {
        // Fallback to standard URL (shouldn't happen if initialized properly)
        signInUrl = `https://accounts.clerk.com/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`;
        Logger.warn('[Auth] Sign-in without publishable key - may not work correctly');
      }
      
      Logger.info('[Auth] Opening sign-in URL:', signInUrl);
      
      // Check if Chrome APIs are available (extension context)
      if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.getURL) {
        Logger.warn('[Auth] Chrome runtime API not available - opening in current window');
        window.open(signInUrl, '_blank');
        return;
      }
      
      // Open sign-in page in new tab
      // Note: chrome.tabs.create callback errors don't propagate to outer try-catch
      // So we handle errors in the callback and don't throw
      if (typeof chrome.tabs === 'undefined' || !chrome.tabs.create) {
        Logger.warn('[Auth] Chrome tabs API not available - opening in current window');
        window.open(signInUrl, '_blank');
        return;
      }
      
      chrome.tabs.create({ url: signInUrl }, (tab) => {
        if (chrome.runtime.lastError) {
          const errorMsg = chrome.runtime.lastError.message;
          Logger.error('[Auth] Failed to create tab:', errorMsg);
          // Can't throw here - callback errors don't propagate
          // Instead, show error via message to popup
          chrome.runtime.sendMessage({
            type: 'AUTH_ERROR',
            error: `Failed to open sign-in page: ${errorMsg}`
          }).catch(() => {
            // Ignore if no listener
          });
        } else {
          Logger.info('[Auth] Tab created successfully:', tab ? tab.id : 'unknown');
        }
      });
    } catch (error) {
      Logger.error('[Auth] Error during sign in:', error);
      throw error;
    }
  }

  /**
   * Sign up user - redirect to Clerk auth page
   */
  async signUp() {
    Logger.info('[Auth] signUp() called');
    Logger.info('[Auth] isInitialized:', this.isInitialized);
    Logger.info('[Auth] clerk exists:', !!this.clerk);
    Logger.info('[Auth] publishableKey:', this.publishableKey ? `${this.publishableKey.substring(0, 20)}...` : 'null');

    // Ensure we have what we need - initialize on demand if needed
      if (!this.publishableKey) {
        Logger.info('[Auth] No publishable key, fetching settings...');
        const settings = await this.getSettings();
        this.publishableKey = settings.clerk_publishable_key;
        if (!this.publishableKey) {
          throw new Error('Clerk publishable key not configured. Please configure it in extension settings.');
        }
      }
    
    if (!this.clerk || typeof window.Clerk === 'undefined') {
      Logger.info('[Auth] Clerk SDK not loaded, loading...');
      if (typeof window.Clerk === 'undefined') {
        await this.loadClerkSDK();
      }
      this.clerk = window.Clerk;
      if (this.clerk && typeof this.clerk.load === 'function' && !this.clerk.loaded) {
        await this.clerk.load();
      }
    }
    
    if (!this.clerk || !this.publishableKey) {
      const error = new Error('Clerk authentication not available');
      Logger.error('[Auth] Sign-up failed - missing requirements:', {
        hasClerk: !!this.clerk,
        hasPublishableKey: !!this.publishableKey
      });
      throw error;
    }

    try {
      // Generate redirect URL first
      let redirectUrl;
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        redirectUrl = chrome.runtime.getURL('/src/clerk-callback.html');
      } else {
        // Fallback for testing outside extension context
        redirectUrl = window.location.origin + '/src/clerk-callback.html';
      }
      Logger.info('[Auth] Redirect URL:', redirectUrl);
      
      // Build Clerk sign-up URL using proper instance-specific format
      // Clerk uses instance-specific URLs, not generic accounts.clerk.dev/com
      // The instance ID is encoded in the publishable key
      let signUpUrl;
      
      if (this.publishableKey) {
        // Try to use Clerk SDK to generate the URL if available
        if (this.clerk && this.clerk.client && typeof this.clerk.client.signUp === 'object') {
          try {
            // Use Clerk SDK's signUp.create() to generate proper URL
            const signUpResource = await this.clerk.client.signUp.create({
              redirectUrl: redirectUrl
            });
            if (signUpResource && signUpResource.url) {
              signUpUrl = signUpResource.url;
              Logger.info('[Auth] Generated sign-up URL from Clerk SDK');
            }
          } catch (sdkError) {
            Logger.warn('[Auth] Failed to generate URL from Clerk SDK, using manual construction:', sdkError);
          }
        }
        
        // Fallback: Extract instance ID from publishable key and construct URL manually
        if (!signUpUrl) {
          signUpUrl = this.buildClerkInstanceUrl(this.publishableKey, 'sign-up', redirectUrl);
          
          // If extraction failed, use fallback URL with publishable key parameter
          if (!signUpUrl) {
            const keyParts = this.publishableKey.split('_');
            const keyType = keyParts.length >= 2 ? keyParts[1] : 'test';
            const baseDomain = keyType === 'test' 
              ? 'accounts.dev' 
              : 'clerk.accounts.dev';
            signUpUrl = `https://${baseDomain}/sign-up?__clerk_publishable_key=${encodeURIComponent(this.publishableKey)}&redirect_url=${encodeURIComponent(redirectUrl)}`;
            Logger.warn('[Auth] Using fallback URL format (instance extraction failed)');
          }
        }
      } else {
        // Fallback to standard URL (shouldn't happen if initialized properly)
        signUpUrl = `https://accounts.clerk.com/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`;
        Logger.warn('[Auth] Sign-up without publishable key - may not work correctly');
      }
      
      Logger.info('[Auth] Opening sign-up URL:', signUpUrl);
      
      // Check if Chrome APIs are available (extension context)
      if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.getURL) {
        Logger.warn('[Auth] Chrome runtime API not available - opening in current window');
        window.open(signUpUrl, '_blank');
        return;
      }
      
      // Open sign-up page in new tab
      // Note: chrome.tabs.create callback errors don't propagate to outer try-catch
      // So we handle errors in the callback and don't throw
      if (typeof chrome.tabs === 'undefined' || !chrome.tabs.create) {
        Logger.warn('[Auth] Chrome tabs API not available - opening in current window');
        window.open(signUpUrl, '_blank');
        return;
      }
      
      chrome.tabs.create({ url: signUpUrl }, (tab) => {
        if (chrome.runtime.lastError) {
          const errorMsg = chrome.runtime.lastError.message;
          Logger.error('[Auth] Failed to create tab:', errorMsg);
          // Can't throw here - callback errors don't propagate
          // Instead, show error via message to popup
          chrome.runtime.sendMessage({
            type: 'AUTH_ERROR',
            error: `Failed to open sign-up page: ${errorMsg}`
          }).catch(() => {
            // Ignore if no listener
          });
        } else {
          Logger.info('[Auth] Tab created successfully:', tab ? tab.id : 'unknown');
        }
      });
    } catch (error) {
      Logger.error('[Auth] Error during sign up:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  /**
   * Sign out user
   */
  async signOut() {
    if (!this.isInitialized || !this.clerk) {
      // Even if Clerk not initialized, clear stored user
      await this.clearStoredUser();
      this.user = null;
      return;
    }

    try {
      await this.clerk.signOut();
      await this.clearStoredUser();
      this.user = null;
      Logger.info('[Auth] User signed out');
    } catch (error) {
      Logger.error('[Auth] Error during sign out:', error);
      // Clear stored user even if Clerk signOut fails
      await this.clearStoredUser();
      this.user = null;
      throw error;
    }
  }

  /**
   * Clear stored user from extension storage
   */
  async clearStoredUser() {
    return new Promise((resolve) => {
      chrome.storage.local.remove(['clerk_user', 'clerk_token'], resolve);
    });
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.user !== null;
  }

  /**
   * Get user avatar URL
   */
  getUserAvatar() {
    if (!this.user) return null;

    // Return profile image URL or fallback to initials
    // Handle both Clerk user object and stored user object
    return this.user.imageUrl || this.user.profileImageUrl || null;
  }

  /**
   * Get user display name
   */
  getUserDisplayName() {
    if (!this.user) return null;

    // Handle both Clerk user object and stored user object
    const firstName = this.user.firstName;
    const lastName = this.user.lastName;
    const username = this.user.username;
    const email = this.user.email || (this.user.primaryEmailAddress?.emailAddress);

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return username || email || 'User';
  }

  /**
   * Get authentication token for API calls
   * Stores token in chrome.storage.local for service worker access
   */
  async getToken() {
    if (!this.isInitialized || !this.clerk) {
      // Try to get stored token as fallback
      return await this.getStoredToken();
    }

    try {
      // Get token from Clerk session
      const session = await this.clerk.session;
      if (!session) {
        return await this.getStoredToken();
      }

      const token = await session.getToken();
      
      // Store token for service worker access
      if (token) {
        await this.storeToken(token);
      }
      
      return token;
    } catch (error) {
      Logger.error('[Auth] Error getting token:', error);
      // Fallback to stored token
      return await this.getStoredToken();
    }
  }

  /**
   * Store Clerk token in extension storage
   */
  async storeToken(token) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ clerk_token: token }, resolve);
    });
  }

  /**
   * Get stored Clerk token from extension storage
   */
  async getStoredToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['clerk_token'], (data) => {
        resolve(data.clerk_token || null);
      });
    });
  }

  /**
   * Clear stored Clerk token
   */
  async clearStoredToken() {
    return new Promise((resolve) => {
      chrome.storage.local.remove(['clerk_token'], resolve);
    });
  }

  /**
   * Handle authentication callback
   */
  async handleCallback() {
    if (!this.isInitialized || !this.clerk) return;

    try {
      // Handle the authentication callback
      await this.clerk.handleRedirectCallback();
      await this.checkUserSession();
      Logger.info('[Auth] Authentication callback handled');
    } catch (error) {
      Logger.error('[Auth] Error handling callback:', error);
    }
  }

  /**
   * Manually sync authentication state from Clerk's session
   * Useful when Clerk redirects to default page instead of extension callback
   */
  async syncAuthFromClerk() {
    Logger.info('[Auth] syncAuthFromClerk() called');
    
    if (!this.isInitialized) {
      Logger.warn('[Auth] Cannot sync - not initialized');
      await this.initialize();
    }

    if (!this.clerk) {
      Logger.error('[Auth] Cannot sync - Clerk SDK not available');
      return false;
    }

    try {
      // Ensure Clerk is loaded
      if (typeof this.clerk.load === 'function' && !this.clerk.loaded) {
        await this.clerk.load();
      }

      // Check if Clerk has an active session
      const user = this.clerk.user;
      if (!user) {
        Logger.info('[Auth] No active Clerk session found');
        return false;
      }

      Logger.info('[Auth] Found Clerk session, syncing to extension storage');

      // Get session token
      let token = null;
      try {
        const session = await this.clerk.session;
        if (session) {
          token = await session.getToken();
        }
      } catch (e) {
        Logger.warn('[Auth] Could not get token:', e);
      }

      // Store authentication state
      await this.storeAuthState(user, token);
      
      // Update local user reference
      this.user = user;
      
      Logger.info('[Auth] Successfully synced authentication state');
      return true;
    } catch (error) {
      Logger.error('[Auth] Error syncing authentication:', error);
      return false;
    }
  }

  /**
   * Store authentication state in extension storage
   */
  async storeAuthState(user, token = null) {
    return new Promise((resolve) => {
      const dataToStore = {
        clerk_user: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          imageUrl: user.imageUrl || user.profileImageUrl
        }
      };

      // Store token if available
      if (token) {
        dataToStore.clerk_token = token;
      }

      chrome.storage.local.set(dataToStore, resolve);
    });
  }
}

// Export for use in other modules
window.AiGuardianAuth = AiGuardianAuth;
