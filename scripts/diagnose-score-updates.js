/**
 * Score Update Diagnostic Script
 * 
 * Run this in the browser console AFTER selecting text and triggering analysis
 * to verify if scores are actually updating.
 * 
 * Usage:
 * 1. Load extension in Chrome
 * 2. Sign in via extension popup
 * 3. Navigate to any webpage
 * 4. Select text (drag to select)
 * 5. Release mouse (triggers analysis)
 * 6. Open browser console (F12)
 * 7. Copy and paste this entire script
 * 8. Press Enter
 */

(async function diagnoseScoreUpdates() {
  console.log('🔍 Score Update Diagnostic Tool\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Step 1: Check if extension is loaded
  console.log('📋 Step 1: Extension Status');
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    console.error('  ❌ Extension not loaded!');
    console.log('     → Load extension: chrome://extensions → Load unpacked');
    return;
  }
  console.log('  ✅ Extension loaded');
  console.log('     • Extension ID:', chrome.runtime.id);
  console.log('');

  // Step 2: Check authentication
  console.log('📋 Step 2: Authentication Status');
  const authData = await new Promise((resolve) => {
    chrome.storage.local.get(['clerk_token', 'clerk_user'], (data) => {
      resolve(data);
    });
  });

  if (!authData.clerk_token) {
    console.warn('  ⚠️  Not authenticated!');
    console.log('     → Sign in via extension popup');
    return;
  }
  console.log('  ✅ Authenticated');
  console.log('     • Token length:', authData.clerk_token.length);
  console.log('     • User ID:', authData.clerk_user?.id || 'N/A');
  console.log('');

  // Step 3: Check last analysis result
  console.log('📋 Step 3: Last Analysis Result');
  const analysisData = await new Promise((resolve) => {
    chrome.storage.local.get(['last_analysis', 'analysis_history'], (data) => {
      resolve(data);
    });
  });

  if (!analysisData.last_analysis) {
    console.warn('  ⚠️  No analysis found in storage');
    console.log('     → Select text on a webpage to trigger analysis');
    return;
  }

  const lastAnalysis = analysisData.last_analysis;
  console.log('  ✅ Last analysis found');
  console.log('     • Timestamp:', new Date(lastAnalysis.timestamp || Date.now()).toLocaleString());
  console.log('     • Success:', lastAnalysis.success);
  console.log('     • Score:', lastAnalysis.score !== undefined ? lastAnalysis.score : 'NOT FOUND');
  console.log('     • Score type:', typeof lastAnalysis.score);
  console.log('     • Has analysis object:', !!lastAnalysis.analysis);
  
  if (lastAnalysis.score !== undefined) {
    const scorePercent = (lastAnalysis.score * 100).toFixed(1);
    console.log('     • Score percentage:', scorePercent + '%');
  } else {
    console.error('     ❌ SCORE IS MISSING!');
  }
  console.log('');

  // Step 4: Check score extraction paths
  console.log('📋 Step 4: Score Extraction Paths');
  if (lastAnalysis.analysis) {
    const analysis = lastAnalysis.analysis;
    console.log('  Checking score extraction paths:');
    
    const paths = [
      'popup_data.bias_score',
      'data.popup_data.bias_score',
      'bias_score',
      'data.bias_score',
      'score',
      'data.score',
      'analysis.bias_score',
      'analysis.score'
    ];

    paths.forEach(path => {
      const keys = path.split('.');
      let value = analysis;
      let found = true;
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          found = false;
          break;
        }
      }
      
      if (found && value !== undefined && value !== null) {
        console.log(`     ✅ ${path}:`, value, `(${typeof value})`);
      } else {
        console.log(`     ❌ ${path}: NOT FOUND`);
      }
    });
  } else {
    console.warn('  ⚠️  No analysis object found');
  }
  console.log('');

  // Step 5: Check analysis history
  console.log('📋 Step 5: Analysis History');
  if (analysisData.analysis_history && Array.isArray(analysisData.analysis_history)) {
    const history = analysisData.analysis_history;
    console.log('  ✅ History found:', history.length, 'entries');
    
    const scoresWithValues = history.filter(h => h.score !== undefined && h.score !== null);
    const scoresWithoutValues = history.filter(h => h.score === undefined || h.score === null);
    
    console.log('     • Entries with scores:', scoresWithValues.length);
    console.log('     • Entries without scores:', scoresWithoutValues.length);
    
    if (scoresWithValues.length > 0) {
      console.log('     • Recent scores:');
      scoresWithValues.slice(-5).forEach((entry, idx) => {
        const scorePercent = (entry.score * 100).toFixed(1);
        const date = new Date(entry.timestamp || Date.now()).toLocaleTimeString();
        console.log(`       ${idx + 1}. ${scorePercent}% (${date})`);
      });
    }
    
    if (scoresWithoutValues.length > 0) {
      console.warn('     ⚠️  Some entries missing scores!');
      console.log('       → This indicates score extraction may be failing');
    }
  } else {
    console.warn('  ⚠️  No analysis history found');
  }
  console.log('');

  // Step 6: Check network activity
  console.log('📋 Step 6: Network Activity Check');
  console.log('  → Open DevTools Network tab and filter for "aiguardian"');
  console.log('  → Look for POST requests to /api/v1/guards/process');
  console.log('  → Check response payload for score data');
  console.log('');

  // Step 7: Test score display
  console.log('📋 Step 7: Score Display Check');
  console.log('  → Check extension badge (icon in toolbar)');
  console.log('  → Open extension popup and check score display');
  console.log('  → Check if badge shows score percentage');
  console.log('');

  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  
  const hasScore = lastAnalysis.score !== undefined && lastAnalysis.score !== null;
  const isAuthenticated = !!authData.clerk_token;
  const hasAnalysis = !!lastAnalysis.analysis;
  
  if (hasScore && isAuthenticated && hasAnalysis) {
    console.log('✅ Score is updating correctly!');
    console.log('   • Score value:', lastAnalysis.score);
    console.log('   • Score percentage:', (lastAnalysis.score * 100).toFixed(1) + '%');
  } else {
    console.error('❌ Score update issues detected:');
    if (!isAuthenticated) console.error('   • Not authenticated');
    if (!hasAnalysis) console.error('   • No analysis object');
    if (!hasScore) console.error('   • Score is missing from response');
  }
  
  console.log('\n💡 Next Steps:');
  if (!hasScore) {
    console.log('   1. Check backend response structure');
    console.log('   2. Verify score extraction paths in gateway.js');
    console.log('   3. Check console logs for extraction errors');
  }
  console.log('');
})();

