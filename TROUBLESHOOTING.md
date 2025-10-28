# 🔧 Extension Loading Troubleshooting Guide

## Current Status: Extension Not Loading

The extension files are syntactically correct, but Chrome is not loading the extension. Here's a step-by-step troubleshooting guide:

## 📋 Step-by-Step Loading Process

### 1. **Open Chrome Extensions Page**
- Go to `chrome://extensions/`
- Make sure "Developer mode" is **ON** (toggle in top-right corner)

### 2. **Load the Extension**
- Click "Load unpacked"
- Navigate to: `C:\Users\jimmy\.cursor\AI-Guardians-chrome-ext-1`
- Select the folder and click "Select Folder"

### 3. **Check for Errors**
Look for any red error messages. Common errors and solutions:

#### ❌ "Manifest file is missing or unreadable"
- **Solution**: Make sure you selected the correct folder (AI-Guardians-chrome-ext-1)
- **Check**: manifest.json should be in the root of the selected folder

#### ❌ "Service worker registration failed"
- **Solution**: Check for JavaScript errors in service-worker.js
- **Status**: ✅ Our service-worker.js syntax is valid

#### ❌ "Content script injection failed"
- **Solution**: Check for JavaScript errors in content.js
- **Status**: ✅ Our content.js syntax is valid

#### ❌ "Invalid manifest file"
- **Solution**: Check manifest.json format
- **Status**: ✅ Our manifest.json is valid

## 🔍 Advanced Troubleshooting

### Check Chrome Console for Errors
1. Go to `chrome://extensions/`
2. Find the AiGuardian extension (if it appears)
3. Click "Inspect views: service worker" (if available)
4. Check the Console tab for error messages

### Verify File Structure
The extension should have this structure:
```
AI-Guardians-chrome-ext-1/
├── manifest.json
├── src/
│   ├── service-worker.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
│   ├── options.html
│   └── options.js
└── assets/
    └── icons/
        ├── icon-16.png
        ├── icon-19.png
        ├── icon-32.png
        ├── icon-38.png
        ├── icon-48.png
        └── icon-128.png
```

### Test with Minimal Extension
If the main extension doesn't work, try the minimal test extension:
1. Go to `chrome://extensions/`
2. Click "Load unpacked"
3. Select the `AI-Guardians-chrome-ext-1` folder
4. Look for any error messages

## 🚨 Common Issues & Solutions

### Issue 1: Extension doesn't appear in list
**Cause**: Wrong folder selected or manifest.json not found
**Solution**: Make sure you select the `AI-Guardians-chrome-ext-1` folder (not a subfolder)

### Issue 2: "This extension may be corrupted"
**Cause**: File permissions or corrupted files
**Solution**: 
- Check file permissions
- Try reloading the extension
- Check for any file corruption

### Issue 3: "Service worker registration failed"
**Cause**: JavaScript errors in service-worker.js
**Solution**: 
- Check Chrome console for errors
- Verify all importScripts files exist
- Check for syntax errors

### Issue 4: "Content script injection failed"
**Cause**: JavaScript errors in content.js
**Solution**:
- Check Chrome console for errors
- Verify content script syntax
- Check for missing dependencies

## 🧪 Testing Once Loaded

Once the extension loads successfully, you can test it:

1. **Go to any website** (like Google.com)
2. **Select text** (at least 10 characters)
3. **Look for a badge** in the bottom-right corner
4. **Check for text highlighting**

## 📞 Need Help?

If the extension still doesn't load:

1. **Check Chrome console** for specific error messages
2. **Try the minimal test extension** first
3. **Verify all file paths** are correct
4. **Check Chrome version** (should be recent)

## 🎯 Expected Behavior

When working correctly, the extension should:
- ✅ Load without errors in Chrome extensions page
- ✅ Show analysis badges when text is selected
- ✅ Highlight selected text with bias colors
- ✅ Respond to keyboard shortcuts (Ctrl+Shift+A)
- ✅ Work on any website

---

**Current Status**: All files are syntactically correct and properly structured. The issue is likely with the loading process or Chrome configuration.
