/**
 * Helper utility to automatically retrieve Clerk token from extension storage
 * Uses Puppeteer to access chrome.storage.local
 *
 * USAGE:
 *   node tests/e2e/get-clerk-token.js
 *
 * Or use in tests:
 *   const { getClerkTokenFromExtension } = require('./get-clerk-token.js');
 *   const token = await getClerkTokenFromExtension();
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function getClerkTokenFromExtension(extensionPath = null) {
  const extPath = extensionPath || path.resolve(__dirname, '../../');

  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: false,
      args: [`--disable-extensions-except=${extPath}`, `--load-extension=${extPath}`],
    });

    // Wait a bit for extension to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get extension ID from browser targets
    const targets = await browser.targets();
    const extensionTarget = targets.find((target) => {
      const url = target.url();
      return (
        url.startsWith('chrome-extension://') &&
        (url.includes('service-worker') || url.includes('background'))
      );
    });

    let extensionId = null;

    if (extensionTarget) {
      extensionId = extensionTarget.url().split('/')[2];
    } else {
      // Try to find any extension target
      const anyExtTarget = targets.find((target) => target.url().startsWith('chrome-extension://'));

      if (anyExtTarget) {
        extensionId = anyExtTarget.url().split('/')[2];
      } else {
        console.warn('⚠️  Extension not found in browser targets');
        await browser.close();
        return null;
      }
    }

    // Create a page to access extension storage
    const page = await browser.newPage();

    // Try to navigate to extension's popup or options page
    const popupUrl = `chrome-extension://${extensionId}/src/popup.html`;
    const optionsUrl = `chrome-extension://${extensionId}/src/options.html`;

    let pageLoaded = false;

    try {
      await page.goto(popupUrl, { waitUntil: 'networkidle0', timeout: 5000 });
      pageLoaded = true;
    } catch (e) {
      try {
        await page.goto(optionsUrl, { waitUntil: 'networkidle0', timeout: 5000 });
        pageLoaded = true;
      } catch (e2) {
        // If both fail, try to inject script directly into a blank page
        await page.goto('about:blank');
        pageLoaded = true;
      }
    }

    // Get token from chrome.storage.local - need to access extension context
    // Try multiple methods to access extension storage

    let token = null;

    // Method 1: Try accessing via extension's background/service worker context using CDP
    try {
      const backgroundTarget = targets.find(
        (target) => target.type() === 'service_worker' && target.url().includes(extensionId)
      );

      if (backgroundTarget) {
        const client = await backgroundTarget.createCDPSession();
        await client.send('Runtime.enable');

        const result = await client.send('Runtime.evaluate', {
          expression: `
            new Promise((resolve) => {
              if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get(['clerk_token'], (data) => {
                  resolve(data.clerk_token || null);
                });
              } else {
                resolve(null);
              }
            })
          `,
          returnByValue: true,
          awaitPromise: true,
        });

        if (result.result && result.result.value) {
          token = result.result.value;
        }
      }
    } catch (cdpError) {
      // CDP method failed, try next method
    }

    // Method 2: Try accessing via extension popup/options page
    if (!token && pageLoaded) {
      try {
        token = await page.evaluate(() => {
          return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
              chrome.storage.local.get(['clerk_token'], (data) => {
                resolve(data.clerk_token || null);
              });
            } else {
              resolve(null);
            }
          });
        });
      } catch (e) {
        // Page evaluate failed
      }
    }

    // Method 3: Try reading from Chrome's extension storage file directly
    // This is a fallback but requires finding the user data directory
    // For now, we'll skip this as it's complex and platform-specific

    await browser.close();
    return token;
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    console.error('Error retrieving token:', error.message);
    return null;
  }
}

// Alternative method: Read from Chrome's extension storage directly via user data directory
async function getClerkTokenFromStorageFile() {
  // This would require finding Chrome's user data directory and reading the storage file
  // More complex but doesn't require launching browser
  // For now, we'll use the Puppeteer method above
  return null;
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getClerkTokenFromExtension, getClerkTokenFromStorageFile };
}

// Auto-run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  console.log('🔍 Retrieving Clerk token from extension storage...\n');

  getClerkTokenFromExtension()
    .then((token) => {
      if (token) {
        console.log('✅ Clerk token retrieved successfully!\n');
        console.log('Token:', token.substring(0, 50) + '...\n');
        console.log('💡 Set it as an environment variable:');
        console.log(`export CLERK_SESSION_TOKEN="${token}"\n`);
        console.log('Or use it directly in tests (token is automatically retrieved).');
      } else {
        console.log('❌ No Clerk token found in extension storage');
        console.log('\n💡 To get a token:');
        console.log('   1. Open the extension popup');
        console.log('   2. Sign in with Clerk');
        console.log('   3. Run this script again\n');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Error:', error.message);
      console.error('\n💡 Make sure:');
      console.error('   - Extension is built and ready');
      console.error('   - Puppeteer is installed (npm install puppeteer)');
      console.error('   - Chrome/Chromium is available\n');
      process.exit(1);
    });
}
