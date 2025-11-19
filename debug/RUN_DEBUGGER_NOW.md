# 🚀 Run Debugger - Quick Start Guide

**Generated:** 2025-11-18T22:56:34.279Z

✅ **Extension is ready!** Follow the steps below.

---

## Step 1: Load Extension in Chrome

1. Open Chrome browser

2. Navigate to: chrome://extensions/

3. Enable "Developer mode" (toggle in top-right)

4. Click "Load unpacked"

5. Select the directory: AiGuardian-Chrome-Ext-dev

## Step 2: Open Service Worker Console

1. In chrome://extensions/, find "AiGuardian" extension

2. Click "Inspect views: service worker" (or "service worker" link)

3. Chrome DevTools will open for the service worker

## Step 3: Load and Run Debugger

In the DevTools console, type:


```javascript
importScripts('debug/chrome-extension-debugger.js');
```


Then run:


```javascript
runDiagnostics();
```


Or get results object:


```javascript
const results = await runDiagnostics();
```

console.log(JSON.stringify(results, null, 2));

---

## Expected Output

When run successfully, you should see:

```
🔍 Chrome Extension Debugger - Running diagnostics...
📦 Checking storage quota...
  ✅ Storage check complete: OK
🌐 Checking network connectivity...
  ✅ Network check complete: OK
...
============================================================
📊 DIAGNOSTIC REPORT
============================================================
```

