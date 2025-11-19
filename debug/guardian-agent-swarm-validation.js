/**
 * Guardian, Agent, and Swarm Validation Script
 * 
 * Validates proper use of:
 * - Guard Services (backend guards: BiasGuard, TrustGuard, ContextGuard, etc.)
 * - Gateway routing to unified guard endpoint
 * - Guard service configuration
 * - Proper error handling and fallbacks
 * 
 * Usage: await validateGuardiansAgentsSwarms()
 */

class GuardianAgentSwarmValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      guards: {},
      gateway: {},
      configuration: {},
      issues: [],
      recommendations: []
    };
  }

  /**
   * Run complete validation
   */
  async validate() {
    console.log('🛡️ Guardian, Agent & Swarm Validation\n');
    console.log('='.repeat(70));

    await this.validateGuardServices();
    await this.validateGatewayRouting();
    await this.validateGuardConfiguration();
    await this.validateErrorHandling();
    await this.generateReport();

    return this.results;
  }

  /**
   * Validate Guard Services Usage
   */
  async validateGuardServices() {
    console.log('\n📋 Validating Guard Services...\n');

    const expectedGuards = [
      'biasguard',
      'trustguard',
      'contextguard',
      'tokenguard',
      'healthguard'
    ];

    // Check constants configuration
    const hasGuardConfig = typeof DEFAULT_CONFIG !== 'undefined' &&
                          DEFAULT_CONFIG.GUARD_SERVICES;

    if (!hasGuardConfig) {
      this.results.issues.push({
        severity: 'HIGH',
        category: 'Guard Services',
        issue: 'Guard services configuration not found in constants',
        fix: 'Ensure DEFAULT_CONFIG.GUARD_SERVICES is defined in constants.js'
      });
      console.log('  ❌ Guard services configuration missing');
      return;
    }

    const guardConfig = DEFAULT_CONFIG.GUARD_SERVICES;
    const configuredGuards = Object.keys(guardConfig);

    console.log(`  Found ${configuredGuards.length} guard services configured:`);
    configuredGuards.forEach(guard => {
      const config = guardConfig[guard];
      const status = config.enabled ? '✅' : '⚠️';
      console.log(`    ${status} ${guard}: ${config.enabled ? 'enabled' : 'disabled'} (threshold: ${config.threshold})`);
      
      this.results.guards[guard] = {
        enabled: config.enabled,
        threshold: config.threshold,
        serviceType: config.service_type
      };
    });

    // Validate expected guards are present
    const missingGuards = expectedGuards.filter(g => !configuredGuards.includes(g));
    if (missingGuards.length > 0) {
      this.results.issues.push({
        severity: 'MEDIUM',
        category: 'Guard Services',
        issue: `Missing guard services: ${missingGuards.join(', ')}`,
        fix: 'Add missing guard services to DEFAULT_CONFIG.GUARD_SERVICES'
      });
      console.log(`  ⚠️  Missing guards: ${missingGuards.join(', ')}`);
    }

    // Check if gateway uses unified endpoint
    if (typeof gateway !== 'undefined' && gateway) {
      try {
        const gatewayCode = gateway.sendToGateway.toString();
        const usesUnifiedEndpoint = gatewayCode.includes('api/v1/guards/process') ||
                                   gatewayCode.includes('guards/process');
        
        if (usesUnifiedEndpoint) {
          console.log('  ✅ Gateway uses unified guard endpoint');
          this.results.gateway.unifiedEndpoint = true;
        } else {
          this.results.issues.push({
            severity: 'HIGH',
            category: 'Gateway Routing',
            issue: 'Gateway does not use unified /api/v1/guards/process endpoint',
            fix: 'Update gateway endpoint mapping to use unified guard endpoint'
          });
          console.log('  ❌ Gateway does not use unified endpoint');
        }
      } catch (e) {
        console.log('  ⚠️  Could not verify gateway endpoint usage');
      }
    }
  }

  /**
   * Validate Gateway Routing
   */
  async validateGatewayRouting() {
    console.log('\n🔗 Validating Gateway Routing...\n');

    if (typeof gateway === 'undefined' || !gateway) {
      this.results.issues.push({
        severity: 'HIGH',
        category: 'Gateway',
        issue: 'Gateway not initialized',
        fix: 'Initialize gateway: gateway = new AiGuardianGateway()'
      });
      console.log('  ❌ Gateway not initialized');
      return;
    }

    // Check endpoint mapping
    try {
      const gatewayCode = gateway.sendToGateway.toString();
      
      // Check for unified endpoint
      const hasUnifiedEndpoint = gatewayCode.includes('api/v1/guards/process');
      const hasAnalyzeMapping = gatewayCode.includes('analyze') && 
                                gatewayCode.includes('guards/process');
      
      if (hasUnifiedEndpoint && hasAnalyzeMapping) {
        console.log('  ✅ Unified guard endpoint configured');
        this.results.gateway.routing = 'unified';
      } else {
        this.results.issues.push({
          severity: 'HIGH',
          category: 'Gateway Routing',
          issue: 'Gateway routing may not use unified guard endpoint',
          fix: 'Ensure analyze endpoint maps to api/v1/guards/process'
        });
        console.log('  ⚠️  Unified endpoint mapping unclear');
      }

      // Check for health endpoints
      const hasHealthEndpoints = gatewayCode.includes('health/live') ||
                                 gatewayCode.includes('health/ready');
      
      if (hasHealthEndpoints) {
        console.log('  ✅ Health endpoints configured');
        this.results.gateway.healthEndpoints = true;
      } else {
        console.log('  ⚠️  Health endpoints not found');
      }

      // Check for guard service discovery
      const hasServiceDiscovery = gatewayCode.includes('guards/services') ||
                                  gatewayCode.includes('api/v1/guards/services');
      
      if (hasServiceDiscovery) {
        console.log('  ✅ Guard service discovery endpoint configured');
        this.results.gateway.serviceDiscovery = true;
      } else {
        console.log('  ⚠️  Guard service discovery not found');
      }

    } catch (e) {
      console.log('  ⚠️  Could not analyze gateway routing:', e.message);
    }
  }

  /**
   * Validate Guard Configuration
   */
  async validateGuardConfiguration() {
    console.log('\n⚙️  Validating Guard Configuration...\n');

    // Check if guard services are properly configured
    if (typeof DEFAULT_CONFIG !== 'undefined' && DEFAULT_CONFIG.GUARD_SERVICES) {
      const guards = DEFAULT_CONFIG.GUARD_SERVICES;
      const enabledGuards = Object.entries(guards)
        .filter(([_, config]) => config.enabled)
        .map(([name, _]) => name);

      console.log(`  Enabled guards: ${enabledGuards.length}`);
      enabledGuards.forEach(guard => {
        console.log(`    ✅ ${guard}`);
      });

      // Check thresholds
      Object.entries(guards).forEach(([name, config]) => {
        if (config.threshold < 0 || config.threshold > 1) {
          this.results.issues.push({
            severity: 'MEDIUM',
            category: 'Guard Configuration',
            issue: `${name} threshold out of range: ${config.threshold}`,
            fix: 'Ensure thresholds are between 0.0 and 1.0'
          });
          console.log(`    ⚠️  ${name}: threshold ${config.threshold} (should be 0.0-1.0)`);
        }
      });

      this.results.configuration.enabledGuards = enabledGuards;
      this.results.configuration.totalGuards = Object.keys(guards).length;
    } else {
      console.log('  ❌ Guard configuration not found');
    }

    // Check if gateway properly handles guard responses
    if (typeof gateway !== 'undefined' && gateway) {
      try {
        const hasGuardResponseHandling = typeof gateway.analyzeText === 'function';
        
        if (hasGuardResponseHandling) {
          console.log('  ✅ Gateway has guard response handling');
          this.results.configuration.responseHandling = true;
        } else {
          console.log('  ⚠️  Guard response handling not found');
        }
      } catch (e) {
        console.log('  ⚠️  Could not verify response handling');
      }
    }
  }

  /**
   * Validate Error Handling
   */
  async validateErrorHandling() {
    console.log('\n🛡️  Validating Error Handling...\n');

    // Check for guard service error handling
    if (typeof gateway !== 'undefined' && gateway) {
      try {
        const gatewayCode = gateway.sendToGateway.toString();
        
        // Check for 401/403 handling (authentication)
        const hasAuthErrorHandling = gatewayCode.includes('401') ||
                                     gatewayCode.includes('403') ||
                                     gatewayCode.includes('Unauthorized') ||
                                     gatewayCode.includes('Forbidden');
        
        if (hasAuthErrorHandling) {
          console.log('  ✅ Authentication error handling present');
          this.results.gateway.authErrorHandling = true;
        } else {
          this.results.issues.push({
            severity: 'HIGH',
            category: 'Error Handling',
            issue: 'Missing authentication error handling (401/403)',
            fix: 'Add 401/403 error handling in gateway sendToGateway method'
          });
          console.log('  ❌ Authentication error handling missing');
        }

        // Check for circuit breaker (resilience)
        const hasCircuitBreaker = gateway.circuitBreaker !== undefined;
        
        if (hasCircuitBreaker) {
          console.log('  ✅ Circuit breaker present');
          this.results.gateway.circuitBreaker = true;
        } else {
          console.log('  ⚠️  Circuit breaker not found');
        }

        // Check for retry logic
        const hasRetryLogic = gatewayCode.includes('retry') ||
                              gatewayCode.includes('RETRY') ||
                              gatewayCode.includes('retryAttempts');
        
        if (hasRetryLogic) {
          console.log('  ✅ Retry logic present');
          this.results.gateway.retryLogic = true;
        } else {
          console.log('  ⚠️  Retry logic not found');
        }

      } catch (e) {
        console.log('  ⚠️  Could not verify error handling:', e.message);
      }
    }

    // Check for guard service fallbacks
    const hasFallback = typeof DEFAULT_CONFIG !== 'undefined' &&
                       DEFAULT_CONFIG.GUARD_SERVICES &&
                       Object.values(DEFAULT_CONFIG.GUARD_SERVICES).some(g => !g.enabled);
    
    if (hasFallback) {
      console.log('  ✅ Guard service fallbacks configured (some guards disabled)');
      this.results.configuration.fallbacks = true;
    } else {
      console.log('  ⚠️  No guard service fallbacks configured');
    }
  }

  /**
   * Generate validation report
   */
  generateReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 VALIDATION REPORT');
    console.log('='.repeat(70));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log('');

    // Guard Services Summary
    console.log('GUARD SERVICES:');
    const guards = this.results.guards;
    Object.entries(guards).forEach(([name, config]) => {
      const status = config.enabled ? '✅ Enabled' : '⚠️ Disabled';
      console.log(`  ${status}: ${name} (threshold: ${config.threshold})`);
    });
    console.log('');

    // Gateway Summary
    console.log('GATEWAY:');
    const gateway = this.results.gateway;
    console.log(`  Unified Endpoint: ${gateway.unifiedEndpoint ? '✅' : '❌'}`);
    console.log(`  Health Endpoints: ${gateway.healthEndpoints ? '✅' : '⚠️'}`);
    console.log(`  Service Discovery: ${gateway.serviceDiscovery ? '✅' : '⚠️'}`);
    console.log(`  Auth Error Handling: ${gateway.authErrorHandling ? '✅' : '❌'}`);
    console.log(`  Circuit Breaker: ${gateway.circuitBreaker ? '✅' : '⚠️'}`);
    console.log(`  Retry Logic: ${gateway.retryLogic ? '✅' : '⚠️'}`);
    console.log('');

    // Configuration Summary
    console.log('CONFIGURATION:');
    const config = this.results.configuration;
    console.log(`  Total Guards: ${config.totalGuards || 0}`);
    console.log(`  Enabled Guards: ${config.enabledGuards?.length || 0}`);
    console.log(`  Response Handling: ${config.responseHandling ? '✅' : '⚠️'}`);
    console.log(`  Fallbacks: ${config.fallbacks ? '✅' : '⚠️'}`);
    console.log('');

    // Issues
    if (this.results.issues.length > 0) {
      console.log('ISSUES FOUND:');
      const high = this.results.issues.filter(i => i.severity === 'HIGH');
      const medium = this.results.issues.filter(i => i.severity === 'MEDIUM');
      const low = this.results.issues.filter(i => i.severity === 'LOW');

      if (high.length > 0) {
        console.log('\n  🔴 HIGH PRIORITY:');
        high.forEach(issue => {
          console.log(`    [${issue.category}] ${issue.issue}`);
          console.log(`      Fix: ${issue.fix}`);
        });
      }

      if (medium.length > 0) {
        console.log('\n  🟡 MEDIUM PRIORITY:');
        medium.forEach(issue => {
          console.log(`    [${issue.category}] ${issue.issue}`);
          console.log(`      Fix: ${issue.fix}`);
        });
      }

      if (low.length > 0) {
        console.log('\n  🟢 LOW PRIORITY:');
        low.forEach(issue => {
          console.log(`    [${issue.category}] ${issue.issue}`);
          console.log(`      Fix: ${issue.fix}`);
        });
      }
    } else {
      console.log('ISSUES: ✅ None found');
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\nRECOMMENDATIONS:');
      this.results.recommendations.forEach(rec => {
        console.log(`  - ${rec}`);
      });
    }

    // Overall Status
    console.log('\n' + '='.repeat(70));
    const highIssues = this.results.issues.filter(i => i.severity === 'HIGH').length;
    const hasUnifiedEndpoint = this.results.gateway.unifiedEndpoint;
    const hasAuthHandling = this.results.gateway.authErrorHandling;

    if (highIssues === 0 && hasUnifiedEndpoint && hasAuthHandling) {
      console.log('✅ STATUS: GUARDIANS, AGENTS & SWARMS PROPERLY CONFIGURED');
    } else if (highIssues === 0) {
      console.log('⚠️  STATUS: MOSTLY CONFIGURED - Review recommendations');
    } else {
      console.log('❌ STATUS: ISSUES FOUND - Fix high priority items');
    }
    console.log('='.repeat(70) + '\n');
  }
}

// Auto-initialize
if (typeof importScripts !== 'undefined') {
  window.GuardianAgentSwarmValidator = GuardianAgentSwarmValidator;
  const validator = new GuardianAgentSwarmValidator();
  window.validateGuardiansAgentsSwarms = () => validator.validate();
  console.log('🛡️ Guardian/Agent/Swarm Validator loaded.');
  console.log('   Run: await validateGuardiansAgentsSwarms()');
} else if (typeof window !== 'undefined') {
  window.GuardianAgentSwarmValidator = GuardianAgentSwarmValidator;
  const validator = new GuardianAgentSwarmValidator();
  window.validateGuardiansAgentsSwarms = () => validator.validate();
  console.log('🛡️ Guardian/Agent/Swarm Validator loaded.');
  console.log('   Run: await validateGuardiansAgentsSwarms()');
}

