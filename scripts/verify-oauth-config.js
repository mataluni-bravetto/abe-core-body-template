#!/usr/bin/env node
/**
 * Verify Google OAuth Configuration
 * Checks if redirect URI is properly configured
 */

const https = require('https');

const REQUIRED_REDIRECT_URI = 'https://clerk.aiguardian.ai/v1/oauth_callback';

console.log('🔍 Verifying Google OAuth Configuration...\n');
console.log(`Required Redirect URI: ${REQUIRED_REDIRECT_URI}\n`);

// Check if redirect URI is accessible
function checkRedirectUri() {
  return new Promise((resolve) => {
    const url = new URL(REQUIRED_REDIRECT_URI);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'HEAD',
      timeout: 5000,
    };

    const req = https.request(options, (res) => {
      console.log(`✅ Redirect URI is accessible: ${REQUIRED_REDIRECT_URI}`);
      console.log(`   Status: ${res.statusCode}`);
      resolve(true);
    });

    req.on('error', (error) => {
      if (error.code === 'ENOTFOUND') {
        console.log(`❌ Redirect URI domain not found: ${url.hostname}`);
        console.log(`   This might be normal if Clerk domain isn't set up yet`);
      } else {
        console.log(`⚠️  Could not verify redirect URI: ${error.message}`);
      }
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`⚠️  Request timeout checking redirect URI`);
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  console.log('📋 Configuration Checklist:\n');

  console.log('1. Google Cloud Console:');
  console.log('   ☐ Go to: https://console.cloud.google.com/apis/credentials');
  console.log('   ☐ Create OAuth 2.0 Client ID');
  console.log(`   ☐ Add redirect URI: ${REQUIRED_REDIRECT_URI}`);
  console.log('   ☐ Copy Client ID and Client Secret\n');

  console.log('2. Clerk Dashboard:');
  console.log('   ☐ Go to: https://dashboard.clerk.com/');
  console.log('   ☐ Your App → User & Authentication → Social Connections');
  console.log('   ☐ Configure Google');
  console.log('   ☐ Paste Client ID and Client Secret');
  console.log('   ☐ Save\n');

  console.log('3. Verification:');
  await checkRedirectUri();

  console.log('\n📝 Next Steps:');
  console.log('   1. Complete the checklist above');
  console.log('   2. Try signing in with Google');
  console.log('   3. If errors persist, check:');
  console.log('      - Redirect URI matches exactly');
  console.log('      - Client ID/Secret are correct in Clerk');
  console.log('      - OAuth consent screen is configured');
}

main().catch(console.error);
