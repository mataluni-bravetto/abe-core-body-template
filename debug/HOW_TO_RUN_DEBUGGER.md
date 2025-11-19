# 🚀 How to Run ChromeExtensionDebugger

**Important:** The debugger must be run **inside the Chrome extension**, not in a regular terminal.

---

## ✅ Method 1: Service Worker Console (Recommended)

### Step 1: Load Extension in Chrome
1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `AiGuardian-Chrome-Ext-dev` directory

### Step 2: Open Service Worker Console
1. In `chrome://extensions/`, find your extension
2. Click "Inspect views: service worker" (or "service worker" link)
3. This opens Chrome DevTools for the service worker

### Step 3: Load and Run Debugger
In the DevTools console, type:

```javascript
importScripts('debug/chrome-extension-debugger.js');
```

Then run diagnostics:

```javascript
runDiagnostics();
```

**Expected Output:**
```
🔍 Chrome Extension Debugger loaded. Run: runDiagnostics()
🔍 Chrome Extension Debugger - Running diagnostics in service-worker context...

📦 Checking storage quota...
  ✅ Storage check complete: OK
🌐 Checking network connectivity...
  ✅ Network check complete: OK
...
```

---

## ✅ Method 2: Popup Console

### Step 1: Open Extension Popup
1. Click the extension icon in Chrome toolbar
2. Right-click inside the popup window
3. Select "Inspect" (or press F12)

### Step 2: Load Debugger Script
In the popup HTML, add this before closing `</body>` tag:

```html
<script src="debug/chrome-extension-debugger.js"></script>
```

Or run directly in console:

```javascript
// The debugger should auto-load if included in popup.html
// If not, you can manually create an instance:
const debugger = new ChromeExtensionDebugger('popup');
debugger.runAllDiagnostics();
```

---

## ✅ Method 3: Options Page Console

### Step 1: Open Options Page
1. Right-click extension icon → "Options"
2. Or go to `chrome://extensions/` → Click "Options" under your extension
3. Right-click on options page → "Inspect"

### Step 2: Run Debugger
Same as popup - the debugger should auto-load if included in `options.html`, or:

```javascript
const debugger = new ChromeExtensionDebugger('options');
debugger.runAllDiagnostics();
```

---

## ❌ What WON'T Work

### ❌ Regular Terminal/Shell
```bash
# This will NOT work - importScripts is not a shell command
importScripts('debug/chrome-extension-debugger.js')
```

**Why:** `importScripts()` is a Chrome extension API, not a shell command.

### ❌ Node.js
```bash
# This will NOT work - Chrome APIs don't exist in Node.js
node -e "importScripts('debug/chrome-extension-debugger.js')"
```

**Why:** Chrome extension APIs (`chrome.storage`, `chrome.runtime`, etc.) only exist in Chrome extension contexts.

---

## 🔍 Troubleshooting

### Issue: "importScripts is not defined"
**Solution:** You're not in a service worker context. Use Method 1 (Service Worker Console).

### Issue: "runDiagnostics is not defined"
**Solution:** The debugger hasn't loaded. Make sure you ran `importScripts()` first, or check that the script is included in your HTML.

### Issue: "chrome is not defined"
**Solution:** You're not in a Chrome extension context. Make sure you're running this inside the extension (service worker, popup, or options page).

### Issue: Path not found
**Solution:** Make sure the path is relative to the extension root:
- ✅ `debug/chrome-extension-debugger.js` (correct)
- ❌ `./debug/chrome-extension-debugger.js` (may not work)
- ❌ `/debug/chrome-extension-debugger.js` (won't work)

---

## 📋 Quick Reference

| Context | How to Access | How to Run |
|---------|---------------|------------|
| **Service Worker** | `chrome://extensions/` → "Inspect views: service worker" | `importScripts('debug/chrome-extension-debugger.js'); runDiagnostics();` |
| **Popup** | Right-click popup → Inspect | `runDiagnostics();` (if script loaded) |
| **Options** | Right-click options page → Inspect | `runDiagnostics();` (if script loaded) |
| **Terminal** | ❌ Won't work | N/A |

---

## 🎯 Expected Diagnostic Output

When run successfully, you should see:

```
🔍 Chrome Extension Debugger - Running diagnostics in service-worker context...

📦 Checking storage quota...
  ✅ Storage check complete: OK
🌐 Checking network connectivity...
  ✅ Network check complete: OK
🔐 Checking authentication...
  ✅ Authentication check complete: OK
🚪 Checking gateway status...
  ✅ Gateway status check complete: OK
🛡️  Checking guard services...
  ✅ Guard services check complete: OK
🔄 Checking token refresh logic...
  ✅ Token refresh check complete: OK
⚠️  Checking error handling...
  ✅ Error handling check complete: OK
⚡ Checking performance...
  ✅ Performance check complete: OK
🚀 Checking production readiness...
  ✅ Production readiness check complete: OK

============================================================
📊 DIAGNOSTIC REPORT
============================================================
...
```

---

## 💡 Pro Tips

1. **Service Worker Console** is best for full diagnostics (has access to all Chrome APIs)
2. **Save Results:** Copy the diagnostic report from console for analysis
3. **Re-run Anytime:** You can run `runDiagnostics()` multiple times to track changes
4. **Export Results:** Use `debugger.getResults()` to get the full results object as JSON

---

**Need Help?** Check `debug/DEBUGGER_TEST_RESULTS.md` for validation, or `debug/DIAGNOSTIC_REPORT.md` for analysis results.

