# 🚀 AiGuardian Chrome Extension - Setup Guide

## Quick Start (5 minutes)

### 1. Load the Extension
```bash
# Open Chrome and navigate to:
chrome://extensions/

# Enable "Developer mode" (toggle in top right)
# Click "Load unpacked" and select this folder
```

### 2. Test the Template
- Visit any webpage
- Select some text (10+ characters)
- See the bias analysis badge appear
- Click the extension icon to open popup
- Click "Open Options" to configure threshold

## 📋 Complete Setup Checklist

### Phase 1: Basic Customization (15 minutes)

#### ✅ Update Extension Identity
- [ ] **manifest.json**: Change `name`, `description`, `version`
- [ ] **Icons**: Replace placeholder icons in `icons/` folder
  - Required sizes: 16x16, 32x32, 48x48, 128x128 pixels
  - Format: PNG with transparent background
  - Design: Simple, recognizable icon representing your AI tool

#### ✅ Configure Your Branding
- [ ] **popup.html**: Update title and description
- [ ] **options.html**: Update title and add your settings
- [ ] **popup.js**: Update button text and functionality

### Phase 2: API Integration (30 minutes)

#### ✅ Configure Production API
**File: `src/constants.js`**
```javascript
const DEFAULT_CONFIG = {
  GATEWAY_URL: 'https://api.aiguardian.ai',  // ✅ Production API endpoint
  API_KEY: 'your-production-api-key-here',   // ✅ Update with your API key
  // ... other configuration remains the same
};
```

**API Integration Steps:**
1. **Configure Production API:**
   - The extension is already configured for `api.aiguardian.ai`
   - Dashboard available at `dashboard.aiguardian.ai`
   - Update the `API_KEY` in `src/constants.js`
   - Test connectivity using the options page

2. **Verify API Endpoints:**
```javascript
// The extension automatically maps to these endpoints:
POST https://api.aiguardian.ai/api/v1/analyze  // Text analysis
GET  https://api.aiguardian.ai/api/v1/health   // Health check
POST https://api.aiguardian.ai/api/v1/logging  // Central logging
GET  https://api.aiguardian.ai/api/v1/guards   // Guard services
GET  https://api.aiguardian.ai/api/v1/config   // Configuration

// Example API request format:
{
  "text": "Text to analyze",
  "guards": ["biasguard", "trustguard"],
  "options": {
    "threshold": 0.5,
    "analysis_type": "comprehensive"
  }
}
```

**Expected API Response:**
```json
{
  "analysis_id": "unique-analysis-id",
  "overall_score": 0.65,
  "guards": {
    "biasguard": {"score": 0.3, "enabled": true},
    "trustguard": {"score": 0.8, "enabled": true}
  },
  "suggestions": ["Analysis complete"],
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

3. **Test the Integration:**
   - Use the options page "Test Connection" button
   - Verify all guard services respond correctly
   - Check the browser console for any errors

#### ✅ Add API Configuration
**File: `src/options.html`**
```html
<!-- Add these fields to your options page -->
<label>API Endpoint</label>
<input id="api_endpoint" type="url" placeholder="https://your-api.com/analyze" />

<label>API Key</label>
<input id="api_key" type="password" placeholder="Your API key" />

<label>Analysis Type</label>
<select id="analysis_type">
  <option value="bias">Bias Detection</option>
  <option value="sentiment">Sentiment Analysis</option>
  <option value="toxicity">Toxicity Detection</option>
</select>
```

**File: `src/options.js`**
```javascript
// Add handlers for new fields
const apiEndpoint = document.getElementById('api_endpoint');
const apiKey = document.getElementById('api_key');
const analysisType = document.getElementById('analysis_type');

// Save/load these values with chrome.storage.sync
```

### Phase 3: Enhanced Features (45 minutes)

#### ✅ Improve Content Script
**File: `src/content.js`**

1. **Add Context Menu Integration:**
```javascript
// Add to manifest.json:
"permissions": ["storage", "contextMenus"]

// Add to background.js:
chrome.contextMenus.create({
  id: "analyze-selection",
  title: "Analyze for Bias",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyze-selection") {
    chrome.tabs.sendMessage(tab.id, {
      type: "ANALYZE_SELECTION",
      text: info.selectionText
    });
  }
});
```

2. **Add Keyboard Shortcuts:**
```javascript
// Already implemented: Ctrl+Shift+A
// Add more shortcuts as needed
```

3. **Enhanced UI Features:**
- [ ] Add detailed analysis modal
- [ ] Implement text highlighting for biased sections
- [ ] Add user feedback collection
- [ ] Implement analysis history

#### ✅ Add Advanced Settings
**File: `src/options.html`**
```html
<!-- Add these advanced options -->
<label>Auto-analyze on selection</label>
<input id="auto_analyze" type="checkbox" />

<label>Show confidence scores</label>
<input id="show_confidence" type="checkbox" />

<label>Analysis timeout (seconds)</label>
<input id="timeout" type="number" min="1" max="30" value="10" />

<label>Highlight biased text</label>
<input id="highlight_text" type="checkbox" />
```

### Phase 4: Production Readiness (30 minutes)

#### ✅ Error Handling & Logging
- [ ] **Add comprehensive error handling** in all message handlers
- [ ] **Implement retry logic** for failed API calls
- [ ] **Add user-friendly error messages** in the UI
- [ ] **Set up logging service** (optional: Sentry, LogRocket)

#### ✅ Performance Optimization
- [ ] **Implement request debouncing** (already done)
- [ ] **Add request caching** for repeated analyses
- [ ] **Optimize content script loading** (only on relevant pages)
- [ ] **Add loading states** and progress indicators

#### ✅ Security & Privacy
- [ ] **Validate API responses** before displaying
- [ ] **Implement rate limiting** to prevent API abuse
- [ ] **Add privacy controls** (disable analysis on sensitive sites)
- [ ] **Secure API key storage** (consider using Chrome's secure storage)

#### ✅ Testing & Validation
- [ ] **Test on different websites** (news, social media, blogs)
- [ ] **Validate with different text types** (formal, casual, technical)
- [ ] **Test error scenarios** (no internet, API down, invalid responses)
- [ ] **Performance testing** with large text selections

## 🔧 Development Workflow

### Local Development
```bash
# 1. Make changes to your code
# 2. Go to chrome://extensions/
# 3. Click the refresh icon on your extension
# 4. Test on a webpage
# 5. Check console for errors (F12 -> Console)
```

### Debugging Tips
- **Background Script**: Check `chrome://extensions/` -> Your extension -> "Inspect views: background page"
- **Content Script**: Use browser DevTools (F12) on any webpage
- **Popup**: Right-click extension icon -> "Inspect popup"
- **Options**: Right-click options page -> "Inspect"

### Common Issues & Solutions

#### Issue: Content script not running
**Solution**: Check manifest.json has correct `content_scripts` and `host_permissions`

#### Issue: API calls failing
**Solution**: 
1. Check CORS settings on your API
2. Verify API key is correct
3. Check network tab in DevTools for request details

#### Issue: Extension not loading
**Solution**:
1. Check manifest.json syntax
2. Verify all file paths are correct
3. Check for JavaScript errors in console

## 📦 Packaging for Distribution

### 1. Create Production Build
```bash
# Create a zip file of your extension
# Exclude: .git, node_modules, development files
```

### 2. Chrome Web Store Preparation
- [ ] Create store listing with screenshots
- [ ] Write detailed description
- [ ] Prepare privacy policy
- [ ] Set up developer account ($5 one-time fee)

### 3. Version Management
```json
// Update version in manifest.json
{
  "version": "1.0.0",
  "version_name": "Initial Release"
}
```

## 🎯 Next Steps After Setup

1. **User Testing**: Get feedback from target users
2. **Analytics**: Add usage tracking (with user consent)
3. **Updates**: Plan for regular updates and improvements
4. **Marketing**: Prepare for Chrome Web Store launch
5. **Support**: Set up user support channels

## 📚 Additional Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)
- [Chrome Web Store Developer Guide](https://developer.chrome.com/docs/webstore/)
- [Extension Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)

---

**Need Help?** Check the tracer bullets in the code - they provide specific guidance for each section!
