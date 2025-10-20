# AI Guardians Chrome Extension

A complete Chrome MV3 extension template for AI-powered text analysis with bias detection capabilities.

## 🚀 Quick Start

### Load the Extension (2 minutes)
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select this folder
4. Visit any webpage and select text to see it in action!

### Test the Template
- **Text Selection**: Select 10+ characters on any webpage
- **Analysis**: See bias score badge appear automatically
- **Popup**: Click extension icon for quick access
- **Options**: Click "Open Options" to configure threshold
- **Keyboard**: Use `Ctrl+Shift+A` for manual analysis

## 📁 Project Structure

```
AI-Guardians-chrome-ext/
├── manifest.json              # MV3 manifest with content scripts
├── src/
│   ├── background.js          # Service worker with message handling
│   ├── content.js            # Content script with text analysis
│   ├── popup.html            # Extension popup UI
│   ├── popup.js              # Popup functionality
│   ├── options.html          # Settings page
│   ├── options.js            # Settings management
│   └── logging.js            # Utility logger
├── icons/                    # Extension icons (16/32/48/128px)
├── README.md                 # This file
└── FILL_OUT_GUIDE.md         # Complete customization guide
```

## 🎯 What's Included

### ✅ Complete MV3 Extension
- **Manifest V3** compliant with minimal permissions
- **Content Script** for text selection and analysis
- **Background Service Worker** with message handling
- **Popup & Options UI** with storage management
- **Error Handling** and logging throughout

### ✅ AI Analysis Features
- **Text Selection Analysis** with visual feedback
- **Bias Score Display** with color-coded results
- **Mock API Integration** (ready for your AI service)
- **Configurable Thresholds** via options page
- **Keyboard Shortcuts** (Ctrl+Shift+A)

### ✅ Developer Experience
- **Tracer Bullets** throughout code for easy customization
- **Comprehensive Documentation** with step-by-step guides
- **Error Handling** with detailed logging
- **Modular Architecture** for easy extension

## 🔧 Customization Guide

### Phase 1: Basic Setup (15 minutes)
1. **Update Extension Identity**
   - Change `name`, `description`, `version` in `manifest.json`
   - Replace placeholder icons in `icons/` folder

2. **Configure Your Branding**
   - Update titles and descriptions in HTML files
   - Customize UI colors and styling

### Phase 2: API Integration (30 minutes)
1. **Replace Mock Analysis**
   - Update `handleTextAnalysis()` in `src/background.js`
   - Add your AI service endpoint and authentication
   - Configure API parameters in options

2. **Add API Settings**
   - Extend `src/options.html` with API configuration
   - Update `src/options.js` to save/load API settings

### Phase 3: Enhanced Features (45 minutes)
1. **Improve Content Script**
   - Add context menu integration
   - Implement text highlighting
   - Add detailed analysis modal

2. **Advanced Settings**
   - Auto-analysis toggles
   - Confidence score display
   - Analysis timeout configuration

### Phase 4: Production Ready (30 minutes)
1. **Error Handling & Logging**
   - Comprehensive error handling
   - Retry logic for failed requests
   - User-friendly error messages

2. **Security & Privacy**
   - API response validation
   - Rate limiting
   - Privacy controls

## 📖 Detailed Documentation

- **[FILL_OUT_GUIDE.md](./FILL_OUT_GUIDE.md)** - Complete step-by-step customization guide
- **Code Comments** - Tracer bullets throughout code for specific guidance
- **Chrome DevTools** - Use for debugging and testing

## 🛠️ Development Workflow

### Local Development
```bash
# 1. Make changes to your code
# 2. Go to chrome://extensions/
# 3. Click refresh icon on your extension
# 4. Test on webpage
# 5. Check console for errors (F12 -> Console)
```

### Debugging
- **Background Script**: `chrome://extensions/` -> Your extension -> "Inspect views: background page"
- **Content Script**: Browser DevTools (F12) on any webpage
- **Popup**: Right-click extension icon -> "Inspect popup"
- **Options**: Right-click options page -> "Inspect"

## 🔒 Security & Permissions

### Current Permissions
- `storage` - For saving user preferences
- `host_permissions: ["<all_urls>"]` - For content script injection

### Security Best Practices
- ✅ Minimal permissions requested
- ✅ No unnecessary page injection
- ✅ Secure message passing
- ✅ Input validation and sanitization
- ✅ Error handling without data leakage

## 🚀 Production Deployment

### Chrome Web Store Preparation
1. **Create Production Build**
   - Zip extension files (exclude development files)
   - Test thoroughly on different websites

2. **Store Listing**
   - Prepare screenshots and descriptions
   - Write privacy policy
   - Set up developer account ($5 one-time fee)

3. **Version Management**
   - Update version in `manifest.json`
   - Plan for regular updates

## 📚 Additional Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [Chrome Web Store Developer Guide](https://developer.chrome.com/docs/webstore/)

## 🤝 Support

- **Issues**: Check the tracer bullets in code for specific guidance
- **Documentation**: See `FILL_OUT_GUIDE.md` for detailed customization steps
- **Chrome DevTools**: Use for debugging and testing

---

**Ready to customize?** Start with the [FILL_OUT_GUIDE.md](./FILL_OUT_GUIDE.md) for step-by-step instructions!
