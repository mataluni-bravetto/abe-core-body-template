# 🚀 Quick Test - "Show Me the Proof" Button

## ✅ I Just Fixed the Issue!

The "Show Me the Proof" button wasn't working because the content script was missing the message handler. I've added it!

---

## 🔄 IMPORTANT: Reload the Extension

**You MUST reload the extension for the changes to take effect:**

1. Go to: `chrome://extensions/`
2. Find: **AI Guardians**
3. Click: **"Reload"** button (🔄 icon)

---

## 🧪 Now Test It:

### Step 1: Open Test Page
Open this in Chrome:
```
file:///c:/Users/jimmy/.cursor/AI-Guardians-chrome-ext/test-page-browser.html
```

### Step 2: Select Text
- Scroll down to any "Sample Text" box
- **Click** on a box to select all the text
- OR manually **highlight** some text

### Step 3: Click Extension Icon
- Click the **AI Guardians shield icon** in toolbar
- Popup opens

### Step 4: Click "Show Me the Proof"
- Should now work! ✅
- Will send text to backend for analysis
- Shows results in popup

---

## 📊 What You Should See:

**In Popup:**
```
Overall Score: 0.88
Confidence: 100%

BiasGuard: 0.85 ✓
TrustGuard: 0.78 ✓
ContextGuard: 0.92 ✓
SecurityGuard: 0.95 ✓
TokenGuard: 0.88 ✓
```

---

## 🐛 If It Still Doesn't Work:

### Check Console:
1. Go to: `chrome://extensions/`
2. Click: **"Service Worker"** under AI Guardians
3. Look for errors
4. Should see: `"[CS] AI Guardians content script loaded"`

### Check Test Server:
```bash
curl http://localhost:8000/health/live
```
Should return: `{"status":"alive"}`

### Try Manual:
Instead of "Show Me the Proof", try:
1. Select text on page
2. Press `Ctrl+Shift+A`
3. Should see badge popup

---

## 🎯 Three Ways to Analyze:

### Method 1: Extension Popup
1. Select text
2. Click extension icon
3. Click "Show Me the Proof" ✓

### Method 2: Keyboard Shortcut
1. Select text
2. Press `Ctrl+Shift+A`
3. Badge appears

### Method 3: Automatic (on mouse-up)
1. Select text
2. Release mouse button
3. Badge appears automatically

---

## 📝 Test Server Logs

The test server shows every request:

```
Unified gateway request completed: ext_xxxxx
   Score: 0.88, Confidence: 1.0
   Text length: 150 characters
```

You should see this appear when you click "Show Me the Proof"!

---

## ✅ Success Checklist:

- [ ] Extension reloaded
- [ ] Test page opened
- [ ] Text selected
- [ ] Extension icon clicked
- [ ] "Show Me the Proof" clicked
- [ ] Results appear in popup
- [ ] All 5 guards show data
- [ ] No errors in console

---

**Status:** Fixed! Just reload extension and test! 🎉
