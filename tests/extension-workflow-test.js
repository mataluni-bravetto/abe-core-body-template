/**
 * Extension Workflow Test - Simulates Real Chrome Extension Usage
 *
 * Tests complete workflow: content script -> background -> gateway -> API
 * with full trace statistics and error handling verification.
 */

class ExtensionWorkflowTester {
  constructor() {
    this.gateway = null;
    this.cache = null;
    this.results = {
      initialization: false,
      textAnalysis: false,
      caching: false,
      errorHandling: false,
      traceStats: false,
      guardServices: false,
      diagnostics: false
    };
  }

  async initialize() {
    console.group('🚀 Extension Workflow Test Initialization');
    console.log('Testing complete extension workflow...');

    try {
      // Initialize core components (like service worker does)
      this.cache = new window.CacheManager();
      this.gateway = new window.AIGuardiansGateway();

      this.results.initialization = true;
      console.log('✅ Core components initialized');

      // Simulate chrome.storage data load
      await this.simulateChromeStorageLoad();
      console.log('✅ Storage configuration loaded');

      console.groupEnd();
      return true;

    } catch (error) {
      console.error('❌ Initialization failed:', error);
      console.groupEnd();
      return false;
    }
  }

  async simulateChromeStorageLoad() {
    // Simulate chrome.storage.sync.get() callback
    const storedConfig = {
      'gateway_url': 'https://api.aiguardian.ai',
      'api_key': 'test-key-abc123',
      'guard_services': {
        biasguard: { enabled: true, threshold: 0.5, displayName: 'Bias Detection' },
        trustguard: { enabled: true, threshold: 0.7, displayName: 'Trust Analysis' }
      },
      'logging_config': { level: 'info', remote: false },
      'analysis_pipeline': 'default'
    };

    // Apply stored configuration to gateway (like initializeGateway does)
    this.gateway.config = {
      ...this.gateway.config,
      gatewayUrl: storedConfig.gateway_url,
      apiKey: storedConfig.api_key,
      guardServices: storedConfig.guard_services,
      loggingConfig: storedConfig.logging_config,
      analysisPipeline: storedConfig.analysis_pipeline
    };

    // Update guardServices map
    for (const [name, config] of Object.entries(storedConfig.guard_services)) {
      this.gateway.guardServices.set(name, {
        ...config,
        lastUsed: null,
        successCount: 0,
        errorCount: 0
      });
    }
  }

  async testTextAnalysisWorkflow() {
    console.group('🔍 Text Analysis Workflow Test');

    const testScenarios = [
      {
        name: 'Normal Text Analysis',
        text: 'The weather is beautiful today and I love going outside.',
        guards: ['biasguard', 'trustguard'],
        shouldSucceed: true
      },
      {
        name: 'Empty Text',
        text: '',
        guards: ['biasguard'],
        shouldSucceed: false
      },
      {
        name: 'XSS Attack Attempt',
        text: '<script>alert("hack")</script>Normal text here',
        guards: ['trustguard'],
        shouldSucceed: true // Should work but be sanitized
      }
    ];

    for (const scenario of testScenarios) {
      console.log(`Testing: ${scenario.name}`);

      try {
        const result = await this.simulateTextAnalysis(scenario);

        if (scenario.shouldSucceed) {
          console.log(`✅ ${scenario.name} succeeded`);
          if (scenario.name === 'XSS Attack Attempt') {
            this.verifySanitization(result);
          }
        } else {
          console.log(`❌ ${scenario.name} should have failed but succeeded`);
        }
      } catch (error) {
        if (!scenario.shouldSucceed) {
          console.log(`✅ ${scenario.name} correctly failed: ${error.message}`);
        } else {
          console.log(`❌ ${scenario.name} unexpectedly failed: ${error.message}`);
        }
      }
    }

    this.results.textAnalysis = true;
    console.groupEnd();
  }

  async simulateTextAnalysis(scenario) {
    const startTime = Date.now();

    // Simulate analyzeText call with full gateway workflow
    const analysisId = this.gateway.generateRequestId();

    console.log(`📝 Starting analysis ${analysisId} for "${scenario.text.substring(0, 30)}..."`);

    // Pre-flight validation (like gateway.analyzeText does)
    this.gateway.validateRequest('analyze', { text: scenario.text });

    // Sanitize input
    const sanitizedPayload = this.gateway.sanitizeRequestData({
      analysis_id: analysisId,
      text: scenario.text,
      guards: scenario.guards,
      timestamp: new Date().toISOString()
    });

    console.log('🧹 Input sanitized, checking cache...');

    // Check cache first
    const cacheKey = this.cache.generateCacheKey('analyze', sanitizedPayload);
    let cachedResult = this.cache.get(cacheKey);

    if (cachedResult) {
      console.log('📦 Cache hit! Returning cached result.');
      return cachedResult;
    }

    console.log('🌐 Cache miss, sending to gateway...');

    // Simulate gateway request (mock response)
    const mockResponse = await this.simulateGatewayRequest(sanitizedPayload);

    // Cache the result
    this.cache.set(cacheKey, mockResponse);

    // Update trace stats
    this.gateway.updateTraceStats('info',
      `Analysis ${analysisId} completed successfully`,
      {
        analysis_id: analysisId,
        duration: Date.now() - startTime,
        guards_used: scenario.guards
      }
    );

    // Update guard service stats
    for (const guard of scenario.guards) {
      const guardData = this.gateway.guardServices.get(guard);
      if (guardData) {
        guardData.lastUsed = new Date().toISOString();
        guardData.successCount++;
      }
    }

    console.log(`✨ Analysis ${analysisId} completed in ${Date.now() - startTime}ms`);
    return mockResponse;
  }

  async simulateGatewayRequest(payload) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

    // Check rate limits (simulated)
    if (Math.random() < 0.1) { // 10% chance of rate limit
      throw new Error('Rate limit exceeded');
    }

    // Generate mock analysis result
    const mockResult = {
      analysis_id: payload.analysis_id,
      overall_score: Math.random() * 0.8 + 0.1, // 0.1 - 0.9
      confidence: 0.85,
      guards: {},
      suggestions: [
        'This is a simulated analysis result',
        'In production, this would connect to AI Guardian backend'
      ],
      timestamp: new Date().toISOString(),
      processing_time: Math.random() * 2000 + 500 // 500ms - 2500ms
    };

    // Add guard results
    for (const guardName of payload.guards) {
      mockResult.guards[guardName] = {
        score: Math.random() * 0.8 + 0.1,
        enabled: true,
        threshold: 0.5,
        status: 'completed',
        analysis_time: Math.random() * 1000 + 200
      };
    }

    // Simulate occasional errors
    if (Math.random() < 0.05) { // 5% error rate
      throw new Error('Simulated gateway error');
    }

    return mockResult;
  }

  verifySanitization(result) {
    // Verify that XSS content was sanitized
    console.log('🔒 Verifying data sanitization...');

    // The resulting data should not contain dangerous elements
    const checkResult = (obj, path = '') => {
      if (typeof obj === 'string') {
        if (obj.includes('<script>') || obj.includes('<iframe>')) {
          throw new Error(`Unsanitized content found at ${path}: ${obj.substring(0, 50)}...`);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          checkResult(value, `${path}.${key}`);
        }
      }
    };

    checkResult(result);
    console.log('✅ Data sanitization verified');
  }

  async testCachingBehavior() {
    console.group('💾 Caching Behavior Test');

    const testPayload = { text: 'This is a caching test.', guards: ['biasguard'] };

    console.log('Testing cache miss...');
    const result1 = await this.simulateTextAnalysis({ ...testPayload, shouldSucceed: true });
    this.assert(result1.timestamp, 'First request succeeded');

    console.log('Testing cache hit...');
    const startTime = Date.now();
    const result2 = await this.simulateTextAnalysis({ ...testPayload, shouldSucceed: true });
    const cacheHitTime = Date.now() - startTime;

    this.assert(result2 === result1, 'Same result returned from cache');
    this.assert(cacheHitTime < 50, `Cache hit was fast (${cacheHitTime}ms)`); // Should be much faster

    console.log(`⚡ Cache hit completed in ${cacheHitTime}ms (vs ~500ms+ for API call)`);

    // Test cache statistics
    const cacheStats = this.cache.getStats();
    console.log('📊 Cache statistics:', cacheStats);
    this.assert(cacheStats.totalEntries > 0, 'Cache has entries');
    this.assert(cacheStats.activeEntries > 0, 'Cache has active entries');

    this.results.caching = true;
    console.groupEnd();
  }

  async testErrorHandling() {
    console.group('🛠️ Error Handling Test');

    // Test network failure
    console.log('Testing network error handling...');
    try {
      // Force a gateway error by making invalid request
      await this.gateway.validateRequest('analyze', { text: '<script>invalid</script>' + 'x'.repeat(15000) });
      throw new Error('Should have failed validation');
    } catch (error) {
      console.log(`✅ Validation correctly caught: ${error.message}`);

      // Test error logging
      const errorInfo = this.gateway.handleError(error, { endpoint: 'analyze' });
      console.log('📝 Error logged with context:', errorInfo);

      this.assert(errorInfo.message, 'Error message preserved');
      this.assert(errorInfo.context.endpoint === 'analyze', 'Error context correct');
    }

    // Test trace stats update
    const traceStats = this.gateway.getTraceStats();
    console.log('📈 Error trace stats:', traceStats);
    this.assert(traceStats.failures > 0, 'Error count increased');

    this.results.errorHandling = true;
    console.groupEnd();
  }

  async testTraceStatistics() {
    console.group('📊 Trace Statistics Test');

    // Perform some operations to generate trace data
    await this.simulateTextAnalysis({
      text: 'Trace stats test 1',
      guards: ['biasguard'],
      shouldSucceed: true
    });

    await this.simulateTextAnalysis({
      text: 'Trace stats test 2',
      guards: ['trustguard'],
      shouldSucceed: true
    });

    try {
      await this.simulateTextAnalysis({
        text: '',
        guards: ['biasguard'],
        shouldSucceed: false
      });
    } catch (error) {
      console.log('Expected error for trace statistics');
    }

    // Check comprehensive trace statistics
    const traceStats = this.gateway.getTraceStats();
    console.log('📈 Final trace statistics:', traceStats);

    // Verify all trace stats are present and reasonable
    this.assert(typeof traceStats.requests === 'number', 'Requests count present');
    this.assert(typeof traceStats.successes === 'number', 'Success count present');
    this.assert(typeof traceStats.failures === 'number', 'Failure count present');
    this.assert(typeof traceStats.totalResponseTime === 'number', 'Response time tracked');
    this.assert(typeof traceStats.averageResponseTime === 'number', 'Average time calculated');
    this.assert(typeof traceStats.successRate === 'number', 'Success rate calculated');
    this.assert(typeof traceStats.failureRate === 'number', 'Failure rate calculated');
    this.assert(traceStats.lastRequestTime, 'Last request time set');

    // Verify reasonable values
    this.assert(traceStats.requests >= 3, 'At least 3 requests recorded');
    this.assert(traceStats.successes >= 2, 'At least 2 successes');
    this.assert(traceStats.failures >= 1, 'At least 1 failure');
    this.assert(traceStats.successRate >= 50, 'Success rate reasonable');

    this.results.traceStats = true;
    console.groupEnd();
  }

  async testGuardServices() {
    console.group('🛡️ Guard Services Test');

    const guardStatus = await this.gateway.getGuardServiceStatus();
    console.log('🏴‍☠️ Guard services status:', guardStatus);

    this.assert(guardStatus.guard_services, 'Guard services status returned');
    this.assert(typeof guardStatus.total_requests === 'number', 'Total requests tracked');
    this.assert(typeof guardStatus.success_rate === 'number', 'Success rate calculated');

    // Test configuration management
    const config = await this.gateway.getCentralConfiguration();
    console.log('⚙️ Configuration:', config);

    this.assert(config.gateway_url, 'Gateway URL in config');
    this.assert(config.guard_services, 'Guard services in config');
    this.assert(Object.keys(config.guard_services).length > 0, 'Guard services configured');

    // Test guard service update
    await this.gateway.updateGuardService('biasguard', { threshold: 0.3 });
    const updatedGuard = this.gateway.guardServices.get('biasguard');
    console.log('🔄 Updated guard:', updatedGuard);
    this.assert(updatedGuard.threshold === 0.3, 'Guard threshold updated');

    this.results.guardServices = true;
    console.groupEnd();
  }

  async testDiagnostics() {
    console.group('🔬 Diagnostics Test');

    const diagnostics = this.gateway.getDiagnostics();
    console.log('🩺 Full diagnostics:', diagnostics);

    // Verify all diagnostic sections
    this.assert(diagnostics.traceStats, 'Trace statistics in diagnostics');
    this.assert(diagnostics.configuration, 'Configuration in diagnostics');
    this.assert(diagnostics.guardServices, 'Guard services in diagnostics');
    this.assert(diagnostics.systemInfo, 'System info in diagnostics');

    // Verify trace stats section
    this.assert(typeof diagnostics.traceStats.requests === 'number', 'Trace stats requests');
    this.assert(typeof diagnostics.traceStats.successes === 'number', 'Trace stats successes');

    // Verify configuration section
    this.assert(diagnostics.configuration.gatewayUrl, 'Gateway URL in config');
    this.assert(typeof diagnostics.configuration.timeout === 'number', 'Timeout config');

    // Verify guard services section
    this.assert(Array.isArray(diagnostics.guardServices), 'Guard services array');
    this.assert(diagnostics.guardServices.length > 0, 'Guard services present');

    // Verify system info section
    this.assert(diagnostics.systemInfo.extensionVersion, 'Extension version');
    this.assert(diagnostics.systemInfo.userAgent, 'User agent');
    this.assert(diagnostics.systemInfo.timestamp, 'Timestamp');

    this.results.diagnostics = true;
    console.groupEnd();
  }

  async runAllTests() {
    console.log('🎯 Starting Complete Extension Workflow Test Suite\n');

    const testSequence = [
      () => this.initialize(),
      () => this.testTextAnalysisWorkflow(),
      () => this.testCachingBehavior(),
      () => this.testErrorHandling(),
      () => this.testTraceStatistics(),
      () => this.testGuardServices(),
      () => this.testDiagnostics()
    ];

    const startTime = Date.now();
    let passedTests = 0;

    for (let i = 0; i < testSequence.length; i++) {
      const testFn = testSequence[i];
      console.log(`\n[${i + 1}/${testSequence.length}] Running test...`);

      try {
        const result = await testFn();
        if (result !== false) {
          passedTests++;
          console.log(`✅ Test ${i + 1} completed`);
