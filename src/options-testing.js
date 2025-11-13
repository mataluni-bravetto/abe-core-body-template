/**
 * Backend Integration Testing UI for Options Page
 */

(function() {
  let tester = null;
  let isRunning = false;

  // Initialize testing UI
  function initializeTesting() {
    setupTestEventListeners();
    loadTestConfiguration();
  }

  /**
   * Set up event listeners for test buttons
   */
  function setupTestEventListeners() {
    const runAllBtn = document.getElementById('run_all_tests');
    const runPerfBtn = document.getElementById('run_performance_test');
    const clearBtn = document.getElementById('clear_test_results');

    if (runAllBtn) {
      runAllBtn.addEventListener('click', runAllTests);
    }
    if (runPerfBtn) {
      runPerfBtn.addEventListener('click', runPerformanceTestOnly);
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', clearTestResults);
    }
  }

  /**
   * Load test configuration from storage
   */
  function loadTestConfiguration() {
    chrome.storage.sync.get(['gateway_url', 'api_key'], (data) => {
      const gatewayInput = document.getElementById('test_gateway_url');
      const apiKeyInput = document.getElementById('test_api_key');

      if (gatewayInput && data.gateway_url) {
        gatewayInput.value = data.gateway_url;
      }
      if (apiKeyInput && data.api_key) {
        apiKeyInput.value = data.api_key;
      }
    });
  }

  /**
   * Get test configuration from inputs
   */
  function getTestConfig() {
    const gatewayInput = document.getElementById('test_gateway_url');
    const apiKeyInput = document.getElementById('test_api_key');

    return {
      gatewayUrl: (gatewayInput && gatewayInput.value.trim()) || 'https://api.aiguardian.ai',
      apiKey: (apiKeyInput && apiKeyInput.value.trim()) || ''
    };
  }

  /**
   * Update button states
   */
  function setButtonsEnabled(enabled) {
    const runAllBtn = document.getElementById('run_all_tests');
    const runPerfBtn = document.getElementById('run_performance_test');

    if (runAllBtn) runAllBtn.disabled = !enabled;
    if (runPerfBtn) runPerfBtn.disabled = !enabled;
    isRunning = !enabled;
  }

  /**
   * Display test results
   */
  function displayTestResults(results) {
    const resultsDiv = document.getElementById('test_results');
    const contentDiv = document.getElementById('test_results_content');

    if (!resultsDiv || !contentDiv) return;

    resultsDiv.classList.remove('hidden');

    let html = '<div style="margin-bottom: 12px;"><strong>Test Results:</strong></div>';

    if (Array.isArray(results)) {
      results.forEach((test) => {
        const statusClass = test.status === 'PASSED' ? 'connected' : 'disconnected';
        const statusIcon = test.status === 'PASSED' ? '✅' : '❌';
        
        html += `<div style="margin: 8px 0; padding: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 6px;">`;
        html += `<div style="display: flex; justify-content: space-between; align-items: center;">`;
        html += `<span>${statusIcon} ${test.name}</span>`;
        html += `<span class="status ${statusClass}" style="font-size: 11px;">${test.status}</span>`;
        html += `</div>`;

        if (test.status === 'PASSED' && test.result) {
          if (test.result.responseTime) {
            html += `<div style="font-size: 11px; color: rgba(249, 249, 249, 0.7); margin-top: 4px;">⏱️ Response Time: ${test.result.responseTime}ms</div>`;
          }
          if (test.result.warning) {
            html += `<div style="font-size: 11px; color: #FFB800; margin-top: 4px;">⚠️ ${test.result.warning}</div>`;
          }
          // Performance metrics
          if (test.result.averageResponseTime !== undefined) {
            html += `<div style="font-size: 11px; color: rgba(249, 249, 249, 0.7); margin-top: 4px;">`;
            html += `📊 Avg: ${test.result.averageResponseTime}ms | `;
            html += `Success: ${test.result.successfulIterations}/${test.result.totalIterations}`;
            if (test.result.minResponseTime !== undefined) {
              html += ` | Min: ${test.result.minResponseTime}ms, Max: ${test.result.maxResponseTime}ms`;
            }
            html += `</div>`;
          }
        } else if (test.status === 'FAILED' && test.error) {
          html += `<div style="font-size: 11px; color: #FF5757; margin-top: 4px;">${test.error}</div>`;
        }
        html += `</div>`;
      });
    } else {
      html += `<div style="color: rgba(249, 249, 249, 0.8);">${JSON.stringify(results, null, 2)}</div>`;
    }

    contentDiv.innerHTML = html;
  }

  /**
   * Run all integration tests
   */
  async function runAllTests() {
    if (isRunning) return;

    const config = getTestConfig();
    setButtonsEnabled(false);

    const resultsDiv = document.getElementById('test_results');
    const contentDiv = document.getElementById('test_results_content');
    if (resultsDiv && contentDiv) {
      resultsDiv.classList.remove('hidden');
      contentDiv.innerHTML = '<div style="color: rgba(249, 249, 249, 0.8);">Running tests... Please wait.</div>';
    }

    try {
      if (typeof BackendIntegrationTester === 'undefined') {
        throw new Error('BackendIntegrationTester not loaded. Check console for errors.');
      }

      tester = new BackendIntegrationTester(config);
      Logger.info('Starting backend integration tests', config);

      const results = await tester.runAllTests();
      displayTestResults(results);
      Logger.info('All tests completed', results);
    } catch (error) {
      Logger.error('Test execution failed', error);
      if (contentDiv) {
        contentDiv.innerHTML = `<div style="color: #FF5757;">❌ Error: ${error.message}</div>`;
      }
    } finally {
      setButtonsEnabled(true);
    }
  }

  /**
   * Run performance test only
   */
  async function runPerformanceTestOnly() {
    if (isRunning) return;

    const config = getTestConfig();
    setButtonsEnabled(false);

    const resultsDiv = document.getElementById('test_results');
    const contentDiv = document.getElementById('test_results_content');
    if (resultsDiv && contentDiv) {
      resultsDiv.classList.remove('hidden');
      contentDiv.innerHTML = '<div style="color: rgba(249, 249, 249, 0.8);">Running performance test... Please wait.</div>';
    }

    try {
      if (typeof BackendIntegrationTester === 'undefined') {
        throw new Error('BackendIntegrationTester not loaded. Check console for errors.');
      }

      tester = new BackendIntegrationTester(config);
      Logger.info('Running performance test only', config);

      const result = await tester.testPerformance();
      
      const testResult = {
        name: 'Performance Test',
        status: 'PASSED',
        result: result,
        timestamp: new Date().toISOString()
      };

      displayTestResults([testResult]);
      Logger.info('Performance test completed', result);

      // Log warning if all iterations failed (testing the division-by-zero fix)
      if (result.warning) {
        Logger.warn('Performance test warning', result.warning);
      }
    } catch (error) {
      Logger.error('Performance test failed', error);
      const testResult = {
        name: 'Performance Test',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      displayTestResults([testResult]);
    } finally {
      setButtonsEnabled(true);
    }
  }

  /**
   * Clear test results
   */
  function clearTestResults() {
    const resultsDiv = document.getElementById('test_results');
    const contentDiv = document.getElementById('test_results_content');
    
    if (resultsDiv) resultsDiv.classList.add('hidden');
    if (contentDiv) contentDiv.innerHTML = '';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTesting);
  } else {
    initializeTesting();
  }
})();

