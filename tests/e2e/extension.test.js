const puppeteer = require('puppeteer');
const path = require('path');

// Set a longer timeout for Jest
jest.setTimeout(30000);

// Path to the extension's root directory where manifest.json is located
const extensionPath = path.resolve(__dirname, '../../');

describe('AiGuardian Chrome Extension E2E Tests', () => {
  let browser;
  let page;
  let popupUrl;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });

    const extensionTarget = await browser.waitForTarget(
      (target) => target.type() === 'service_worker'
    );
    const partialExtensionUrl = extensionTarget.url() || '';
    const extensionId = partialExtensionUrl.split('/')[2];
    popupUrl = `chrome-extension://${extensionId}/src/popup.html`;
  });

  // Before each test, navigate to a fresh popup page and apply mocks
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(popupUrl);
    await page.evaluate(() => {
      // This mock MUST use the callback pattern because of the sendMessageToBackground wrapper in popup.js
      chrome.runtime.sendMessage = (message, callback) => {
        if (message.type === 'TEST_GATEWAY_CONNECTION') {
          callback({ success: true, responseTime: 123 });
        } else if (message.type === 'GET_GUARD_STATUS') {
          callback({ success: true, status: { gateway_connected: true } });
        } else if (message.type === 'RECREATE_CONTEXT_MENUS') {
          callback({ success: true });
        }
      };

      // These mocks can be promise-based as they are awaited directly in popup.js
      chrome.tabs = {
        query: (options) => Promise.resolve([{ id: 1 }]),
        sendMessage: (tabId, message) => {
          if (message.type === 'ANALYZE_SELECTION') {
            return Promise.resolve({ success: true, score: 0.9, analysis: { bias_type: 'Test Bias' } });
          }
          return Promise.resolve();
        },
      };

      chrome.storage = {
        local: {
          get: (keys) => Promise.resolve({ last_analysis: { data: 'test' } }),
        },
        sync: {
            get: (keys) => Promise.resolve({ gateway_url: 'test', api_key: 'test' })
        }
      };

      chrome.runtime.openOptionsPage = () => Promise.resolve();
    });
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should display the initial popup state correctly', async () => {
    const title = await page.$eval('h1', (el) => el.textContent);
    expect(title).toBe('AiGuardian');
  });

  test('should show a success message when the connection test is successful', async () => {
    await page.click('#testConnectionBtn');
    const successSelector = '.success-message';
    await page.waitForSelector(successSelector);
    const successText = await page.$eval(successSelector, (el) => el.textContent);
    expect(successText).toBe('✅ Connection successful (123ms)');
  });

  test('should clear highlights and show success', async () => {
    await page.click('#clearHighlightsBtn');
    const successSelector = '.success-message';
    await page.waitForSelector(successSelector);
    const successText = await page.$eval(successSelector, (el) => el.textContent);
    expect(successText).toBe('✅ Highlights cleared');
  });

  test('should copy analysis and show success', async () => {
    await page.click('#copyAnalysisBtn');
    const successSelector = '.success-message';
    await page.waitForSelector(successSelector);
    const successText = await page.$eval(successSelector, (el) => el.textContent);
    expect(successText).toBe('✅ Analysis copied to clipboard');
  });

  test('should recreate context menus and show success', async () => {
    await page.click('#testContextMenuBtn');
    const successSelector = '.success-message';
    await page.waitForSelector(successSelector);
    const successText = await page.$eval(successSelector, (el) => el.textContent);
    expect(successText).toContain('✅ Context menus recreated!');
  });

  test('should trigger analysis and show success', async () => {
    await page.click('#analyzeBtn');
    const successSelector = '.success-message';
    await page.waitForSelector(successSelector);
    const successText = await page.$eval(successSelector, (el) => el.textContent);
    expect(successText).toBe('✅ Analysis complete!');
  });
});
