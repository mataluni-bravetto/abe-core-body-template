/**
 * Score Update Diagnostic Script
 * 
 * This script checks if bias scores are actually updating by:
 * 1. Checking the last analysis result in storage
 * 2. Verifying score extraction logic
 * 3. Testing score display in UI
 * 
 * Run this in browser console after analyzing some text
 */

(async function checkScoreUpdates() {
  console.log('🔍 Checking Score Update Status\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Step 1: Check last analysis in storage
  console.log('📋 Step 1: Checking Last Analysis in Storage');
  const storageData = await new Promise((resolve) => {
    chrome.storage.local.get(['last_analysis', 'analysis_history'], (data) => {
      resolve(data);
    });
  });

  if (storageData.last_analysis) {
    console.log('  ✅ Last analysis found:');
    console.log('     • Score:', storageData.last_analysis.score);
    console.log('     • Score type:', typeof storageData.last_analysis.score);
    console.log('     • Timestamp:', storageData.last_analysis.timestamp);
    console.log('     • Success:', storageData.last_analysis.success);
    
    if (storageData.last_analysis.score === null || storageData.last_analysis.score === undefined) {
      console.log('  ⚠️  WARNING: Score is null/undefined in storage!');
    } else if (typeof storageData.last_analysis.score === 'number') {
      console.log('  ✅ Score is a valid number:', storageData.last_analysis.score);
      console.log('     • Percentage:', Math.round(storageData.last_analysis.score * 100) + '%');
    } else {
      console.log('  ⚠️  WARNING: Score is not a number:', typeof storageData.last_analysis.score);
    }
  } else {
    console.log('  ⚠️  No last analysis found in storage');
    console.log('     • This could mean:');
    console.log('       - No text has been analyzed yet');
    console.log('       - Analysis failed and wasn\'t saved');
    console.log('       - Storage quota exceeded');
  }

  // Step 2: Check analysis history
  console.log('\n📋 Step 2: Checking Analysis History');
  if (storageData.analysis_history && Array.isArray(storageData.analysis_history)) {
    console.log('  ✅ History found:', storageData.analysis_history.length, 'entries');
    
    const scores = storageData.analysis_history
      .map(entry => entry.score)
      .filter(score => score !== null && score !== undefined);
    
    console.log('     • Entries with scores:', scores.length);
    console.log('     • Score range:', scores.length > 0 ? 
      `${Math.min(...scores).toFixed(2)} - ${Math.max(...scores).toFixed(2)}` : 'N/A');
    
    if (scores.length === 0) {
      console.log('  ⚠️  WARNING: No scores found in history entries!');
    }
  } else {
    console.log('  ⚠️  No analysis history found');
  }

  // Step 3: Test score extraction from a mock response
  console.log('\n📋 Step 3: Testing Score Extraction Logic');
  const mockResponses = [
    {
      name: 'Response with popup_data.bias_score',
      data: {
        success: true,
        data: {
          popup_data: { bias_score: 0.75 },
          bias_score: 0.80
        }
      },
      expectedScore: 0.75, // Should prioritize popup_data.bias_score
      expectedSource: 'data.popup_data.bias_score'
    },
    {
      name: 'Response with data.bias_score only',
      data: {
        success: true,
        data: {
          bias_score: 0.65
        }
      },
      expectedScore: 0.65,
      expectedSource: 'data.bias_score'
    },
    {
      name: 'Response with no score',
      data: {
        success: true,
        data: {
          analysis: { summary: 'Test' }
        }
      },
      expectedScore: null,
      expectedSource: 'not found'
    }
  ];

  console.log('  Testing extraction paths...');
  for (const mock of mockResponses) {
    // Simulate extraction logic
    let score = null;
    let source = 'none';
    
    const data = mock.data.data || {};
    
    // Priority order (matching gateway.js)
    if (data.popup_data?.bias_score !== undefined) {
      score = data.popup_data.bias_score;
      source = 'data.popup_data.bias_score';
    } else if (data.bias_score !== undefined) {
      score = data.bias_score;
      source = 'data.bias_score';
    }
    
    const passed = (score === mock.expectedScore) && (source === mock.expectedSource);
    console.log(`    ${passed ? '✅' : '❌'} ${mock.name}:`);
    console.log(`       Extracted: ${score} from ${source}`);
    console.log(`       Expected: ${mock.expectedScore} from ${mock.expectedSource}`);
  }

  // Step 4: Check if extension is properly initialized
  console.log('\n📋 Step 4: Checking Extension Status');
  const extensionId = chrome.runtime.id;
  console.log('  ✅ Extension ID:', extensionId);
  
  // Test message to service worker
  chrome.runtime.sendMessage({ type: 'GET_DIAGNOSTICS' }, (response) => {
    if (chrome.runtime.lastError) {
      console.log('  ⚠️  Service worker not responding:', chrome.runtime.lastError.message);
    } else if (response) {
      console.log('  ✅ Service worker responding');
      console.log('     • Gateway URL:', response.gateway?.url);
      console.log('     • Gateway connected:', response.gateway?.connected);
    }
  });

  // Step 5: Check popup display
  console.log('\n📋 Step 5: Checking Popup Display Logic');
  console.log('  To check popup display:');
  console.log('    1. Click extension icon');
  console.log('    2. Check if score displays correctly');
  console.log('    3. Look for "N/A" which indicates score not found');
  console.log('    4. Check browser console for [Popup] logs');

  // Step 6: Recommendations
  console.log('\n📋 Step 6: Recommendations');
  
  if (!storageData.last_analysis) {
    console.log('  💡 No analysis found - try analyzing some text first');
  } else if (storageData.last_analysis.score === null || storageData.last_analysis.score === undefined) {
    console.log('  ⚠️  Score is missing - possible issues:');
    console.log('     • Backend not returning bias_score field');
    console.log('     • Score extraction failing in gateway.js');
    console.log('     • Check backend response format');
    console.log('     • Check gateway.js score extraction paths');
  } else {
    console.log('  ✅ Score is present in storage');
    console.log('     • If score not updating in UI, check:');
    console.log('       - Popup.js displayScore function');
    console.log('       - Content script badge display');
    console.log('       - Browser console for errors');
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 Diagnostic Complete');
  console.log('═══════════════════════════════════════════════════════════\n');
})();

