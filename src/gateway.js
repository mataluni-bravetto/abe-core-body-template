/**
 * AI Guardians Central Gateway Bridge
 * 
 * This module provides a unified interface for connecting the Chrome extension
 * to the AI Guardians backend services through a central gateway.
 * 
 * TRACER BULLETS FOR NEXT DEVELOPER:
 * - Configure your AI Guardians gateway endpoint
 * - Implement authentication with your guard services
 * - Add custom guard types and analysis pipelines
 * - Integrate with your central logging and monitoring
 */

class AIGuardiansGateway {
  constructor() {
    this.config = {
      gatewayUrl: 'https://your-ai-guardians-gateway.com/api/v1',
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000
    };
    
    this.guardServices = new Map();
    this.centralLogger = null;
    this.centralConfig = null;
    
    this.initializeGateway();
  }

  /**
   * TRACER BULLET: Initialize gateway connection
   */
  async initializeGateway() {
    try {
      // Load configuration from storage
      await this.loadConfiguration();
      
      // Initialize central logging
      await this.initializeCentralLogging();
      
      // Initialize guard services
      await this.initializeGuardServices();
      
      Logger.info('[Gateway] Initialized AI Guardians gateway');
    } catch (err) {
      Logger.error('[Gateway] Initialization failed', err);
    }
  }

  /**
   * TRACER BULLET: Load central configuration
   */
  async loadConfiguration() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([
        'gateway_url',
        'api_key',
        'guard_services',
        'logging_config',
        'analysis_pipeline'
      ], (data) => {
        this.config = {
          ...this.config,
          gatewayUrl: data.gateway_url || this.config.gatewayUrl,
          apiKey: data.api_key || '',
          guardServices: data.guard_services || {},
          loggingConfig: data.logging_config || {},
          analysisPipeline: data.analysis_pipeline || 'default'
        };
        resolve();
      });
    });
  }

  /**
   * TRACER BULLET: Initialize central logging bridge
   */
  async initializeCentralLogging() {
    this.centralLogger = {
      log: async (level, message, metadata = {}) => {
        try {
          // Send to central logging service
          await this.sendToGateway('logging', {
            level,
            message,
            metadata: {
              ...metadata,
              timestamp: new Date().toISOString(),
              extension_version: chrome.runtime.getManifest().version,
              user_agent: navigator.userAgent
            }
          });
        } catch (err) {
          console.error('[Central Logger] Failed to send log:', err);
        }
      },
      
      info: (message, metadata) => this.centralLogger.log('info', message, metadata),
      warn: (message, metadata) => this.centralLogger.log('warn', message, metadata),
      error: (message, metadata) => this.centralLogger.log('error', message, metadata)
    };
  }

  /**
   * TRACER BULLET: Initialize guard services
   */
  async initializeGuardServices() {
    const defaultGuards = {
      bias_detection: {
        enabled: true,
        threshold: 0.5,
        pipeline: 'bias_analysis_v2'
      },
      toxicity_detection: {
        enabled: true,
        threshold: 0.7,
        pipeline: 'toxicity_analysis_v1'
      },
      sentiment_analysis: {
        enabled: false,
        threshold: 0.6,
        pipeline: 'sentiment_analysis_v1'
      },
      fact_checking: {
        enabled: false,
        threshold: 0.8,
        pipeline: 'fact_check_v1'
      }
    };

    // Load guard services configuration
    const guardConfig = this.config.guardServices || defaultGuards;
    
    for (const [guardName, config] of Object.entries(guardConfig)) {
      this.guardServices.set(guardName, {
        ...config,
        lastUsed: null,
        successCount: 0,
        errorCount: 0
      });
    }
  }

  /**
   * TRACER BULLET: Send request to central gateway
   */
  async sendToGateway(endpoint, payload) {
    const url = `${this.config.gatewayUrl}/${endpoint}`;
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Extension-Version': chrome.runtime.getManifest().version,
        'X-Request-ID': this.generateRequestId()
      },
      body: JSON.stringify(payload)
    };

    let lastError;
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Log successful request
        await this.centralLogger?.info('Gateway request successful', {
          endpoint,
          attempt,
          response_time: Date.now() - payload.timestamp
        });
        
        return result;
      } catch (err) {
        lastError = err;
        
        await this.centralLogger?.warn('Gateway request failed', {
          endpoint,
          attempt,
          error: err.message
        });
        
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * TRACER BULLET: Analyze text through guard services
   */
  async analyzeText(text, options = {}) {
    const analysisId = this.generateRequestId();
    const startTime = Date.now();
    
    try {
      await this.centralLogger?.info('Starting text analysis', {
        analysis_id: analysisId,
        text_length: text.length,
        options
      });

      // Get enabled guard services
      const enabledGuards = Array.from(this.guardServices.entries())
        .filter(([name, config]) => config.enabled)
        .map(([name, config]) => ({ name, config }));

      if (enabledGuards.length === 0) {
        throw new Error('No guard services enabled');
      }

      // Send analysis request to gateway
      const result = await this.sendToGateway('analyze', {
        analysis_id: analysisId,
        text,
        guards: enabledGuards.map(g => g.name),
        options: {
          ...options,
          pipeline: this.config.analysisPipeline,
          timestamp: new Date().toISOString()
        }
      });

      // Update guard service statistics
      for (const guard of enabledGuards) {
        const guardData = this.guardServices.get(guard.name);
        guardData.lastUsed = new Date().toISOString();
        guardData.successCount++;
      }

      await this.centralLogger?.info('Text analysis completed', {
        analysis_id: analysisId,
        duration: Date.now() - startTime,
        results_count: result.guards?.length || 0
      });

      return result;
    } catch (err) {
      // Update error statistics
      for (const [name, guardData] of this.guardServices.entries()) {
        if (guardData.enabled) {
          guardData.errorCount++;
        }
      }

      await this.centralLogger?.error('Text analysis failed', {
        analysis_id: analysisId,
        duration: Date.now() - startTime,
        error: err.message
      });

      throw err;
    }
  }

  /**
   * TRACER BULLET: Get guard service status
   */
  async getGuardServiceStatus() {
    const status = {
      gateway_connected: await this.testGatewayConnection(),
      guard_services: {},
      total_requests: 0,
      success_rate: 0
    };

    for (const [name, data] of this.guardServices.entries()) {
      status.guard_services[name] = {
        enabled: data.enabled,
        last_used: data.lastUsed,
        success_count: data.successCount,
        error_count: data.errorCount,
        success_rate: data.successCount + data.errorCount > 0 
          ? (data.successCount / (data.successCount + data.errorCount)) * 100 
          : 0
      };
      
      status.total_requests += data.successCount + data.errorCount;
    }

    if (status.total_requests > 0) {
      const totalSuccess = Array.from(this.guardServices.values())
        .reduce((sum, data) => sum + data.successCount, 0);
      status.success_rate = (totalSuccess / status.total_requests) * 100;
    }

    return status;
  }

  /**
   * TRACER BULLET: Test gateway connection
   */
  async testGatewayConnection() {
    try {
      await this.sendToGateway('health', { test: true });
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * TRACER BULLET: Update guard service configuration
   */
  async updateGuardService(guardName, config) {
    const currentConfig = this.guardServices.get(guardName);
    if (!currentConfig) {
      throw new Error(`Guard service '${guardName}' not found`);
    }

    const updatedConfig = { ...currentConfig, ...config };
    this.guardServices.set(guardName, updatedConfig);

    // Save to storage
    await new Promise((resolve) => {
      chrome.storage.sync.set({
        guard_services: Object.fromEntries(this.guardServices)
      }, resolve);
    });

    await this.centralLogger?.info('Guard service updated', {
      guard_name: guardName,
      config: updatedConfig
    });
  }

  /**
   * TRACER BULLET: Get central configuration
   */
  async getCentralConfiguration() {
    return {
      gateway_url: this.config.gatewayUrl,
      api_key_configured: !!this.config.apiKey,
      guard_services: Object.fromEntries(this.guardServices),
      logging_config: this.config.loggingConfig,
      analysis_pipeline: this.config.analysisPipeline
    };
  }

  /**
   * TRACER BULLET: Update central configuration
   */
  async updateCentralConfiguration(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    await new Promise((resolve) => {
      chrome.storage.sync.set({
        gateway_url: this.config.gatewayUrl,
        api_key: this.config.apiKey,
        guard_services: Object.fromEntries(this.guardServices),
        logging_config: this.config.loggingConfig,
        analysis_pipeline: this.config.analysisPipeline
      }, resolve);
    });

    await this.centralLogger?.info('Central configuration updated', newConfig);
  }

  // Utility methods
  generateRequestId() {
    return `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use in other modules
window.AIGuardiansGateway = AIGuardiansGateway;
