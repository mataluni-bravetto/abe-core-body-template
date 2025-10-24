#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

async function main() {
  const root = path.resolve(__dirname, '..');
  const defaultEntry = path.join(root, 'tests', 'test-runner.html');

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const normalized = path.normalize(urlPath).replace(/^([\.\/]*)/, '');
    let filePath = path.join(root, normalized);

    if (urlPath === '/' || urlPath === '') {
      filePath = defaultEntry;
    }

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    console.log('[server] request', urlPath, '->', filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });

  await new Promise(resolve => server.listen(0, resolve));
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}/tests/test-runner.html?autorun=true`;

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[browser:${msg.type()}]`, msg.text());
  });
  page.on('response', res => {
    if (res.status() >= 400) {
      console.error(`[browser:${res.status()}] ${res.url()}`);
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForFunction(() => window.__AiGuardianTestsCompleted === true, { timeout: 30000 });
    const results = await page.evaluate(() => window.__AiGuardianTestResults);
    const gatewayType = await page.evaluate(() => typeof window.AIGuardiansGateway);
    console.log('window.AIGuardiansGateway type:', gatewayType);

    if (!results) {
      throw new Error('No test results returned from browser context');
    }

    const { summary } = results;
    console.log('\nSummary:', summary);

    if (summary.overallStatus !== 'SUCCESS') {
      console.error('Unit tests reported failure:', summary);
      process.exitCode = 1;
    } else {
      console.log('All unit tests passed.');
    }
  } catch (error) {
    console.error('Failed to execute browser tests:', error);
    process.exitCode = 1;
  } finally {
    await browser.close().catch(() => {});
    server.close();
  }
}

main().catch(err => {
  console.error('Unexpected error running unit tests:', err);
  process.exitCode = 1;
});
