# Chrome Extension Testing Instructions

## ✅ Pre-Testing Verification

**Syntax Check**: ✅ All JavaScript files passed syntax validation

## 📦 Loading the Extension in Chrome

### Step 1: Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)

### Step 2: Load the Extension

1. Click **"Load unpacked"** button
2. Navigate to and select this directory:
   ```
   C:\Users\jimmy\.cursor\AI-Guardians-chrome-ext
   ```
3. The extension should now appear in your extensions list

### Step 3: Verify Extension Loaded

- Check for any error messages in the extensions page
- Extension icon should appear in Chrome toolbar
- Extension should be listed as "AiGuardians" version 1.0.0

## 🧪 Testing Checklist

### Basic Functionality Tests

#### 1. **Popup Interface**
- [ ] Click extension icon in toolbar
- [ ] Verify popup opens correctly
- [ ] Check logo displays (path fixed: `../assets/brand/AiG_Logos/AIG_Logo_Blue.png`)
- [ ] Verify all buttons are visible:
  - [ ] "Show Me the Proof" button
  - [ ] "Configure Service" button
  - [ ] "Audit Trail" button
  - [ ] "Clear Highlights" button
  - [ ] "Show History" button
  - [ ] "Copy Analysis" button

#### 2. **Service Worker**
- [ ] Open DevTools → Extensions → Service Worker
- [ ] Check console for initialization messages
- [ ] Verify no errors in service worker console
- [ ] Check that gateway is initialized

#### 3. **Content Script**
- [ ] Navigate to any webpage (e.g., `https://example.com`)
- [ ] Open DevTools → Console
- [ ] Select text on the page
- [ ] Verify content script is active (no errors in console)
- [ ] Check if text selection triggers any analysis

#### 4. **Context Menu**
- [ ] Right-click on any webpage
- [ ] Verify context menu items appear:
  - [ ] "Analyze with AiGuardians"
  - [ ] Other context menu options

#### 5. **Keyboard Shortcuts**
- [ ] Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac)
- [ ] Verify shortcut triggers analysis
- [ ] Press `Ctrl+Shift+C` to clear highlights
- [ ] Press `Ctrl+Shift+H` to show history

#### 6. **Options Page**
- [ ] Click "Configure Service" button in popup
- [ ] Or navigate to `chrome://extensions` → AiGuardians → Options
- [ ] Verify options page loads
- [ ] Test configuration:
  - [ ] Set Gateway URL (e.g., `http://localhost:8000` for dev)
  - [ ] Set API Key (if required)
  - [ ] Save settings

#### 7. **Gateway Connection**
- [ ] In popup, click "Audit Trail" button
- [ ] Check console for connection status
- [ ] If backend is running:
  - [ ] Test connection to backend
  - [ ] Verify health check works
- [ ] If backend not running:
  - [ ] Verify graceful error handling

#### 8. **Storage**
- [ ] Open DevTools → Application → Storage → Chrome Extension Storage
- [ ] Verify settings are stored:
  - [ ] `gateway_url`
  - [ ] `api_key`
- [ ] Test persistence (reload extension, verify settings remain)

## 🐛 Common Issues & Solutions

### Issue: Extension doesn't load
**Solution**: 
- Check for syntax errors in console
- Verify manifest.json is valid
- Check all required files exist

### Issue: Logo not displaying
**Solution**: 
- ✅ Fixed: Updated path to `../assets/brand/AiG_Logos/AIG_Logo_Blue.png`
- Verify file exists at that path

### Issue: Service worker errors
**Solution**:
- Check DevTools → Extensions → Service Worker console
- Verify all importScripts paths are correct
- Check that all dependency files exist

### Issue: Content script not working
**Solution**:
- Check manifest.json permissions
- Verify content.js file exists
- Check console on the webpage (not extension console)

### Issue: Gateway connection fails
**Solution**:
- Verify backend is running (if testing locally)
- Check gateway URL in settings
- Verify CORS settings on backend
- Check network tab for request/response

## 📊 Testing Backend Integration

### Prerequisites
- Backend should be running on `http://localhost:8000` (for dev)
- Or configured gateway URL in extension settings

### Test Endpoints

1. **Health Check**
   - Extension calls: `GET /health/live`
   - Should return: `{"status": "alive"}`

2. **Analysis**
   - Extension calls: `POST /api/v1/guards/process`
   - Payload format documented in `docs/BACKEND_INTEGRATION_GUIDE.md`

3. **Service Status**
   - Extension calls: `GET /api/v1/guards/services`
   - Should return list of guard services

## 📝 Manual Test Steps

### Test Scenario 1: Basic Text Analysis
1. Navigate to a webpage with text content
2. Select some text (10-5000 characters)
3. Click extension icon
4. Click "Show Me the Proof"
5. Verify analysis results display
6. Check console for any errors

### Test Scenario 2: Context Menu Analysis
1. Select text on webpage
2. Right-click → "Analyze with AiGuardians"
3. Verify analysis is triggered
4. Check popup for results

### Test Scenario 3: Configuration
1. Open options page
2. Set Gateway URL: `http://localhost:8000`
3. Save settings
4. Reload extension
5. Verify settings persist

### Test Scenario 4: Error Handling
1. Set invalid gateway URL
2. Try to analyze text
3. Verify graceful error message
4. Check console for proper error logging

## 🔍 Debugging

### Chrome DevTools
1. **Extension Popup**: Right-click popup → Inspect
2. **Service Worker**: chrome://extensions → AiGuardians → Service Worker → Inspect
3. **Content Script**: Open webpage DevTools → Console
4. **Background Script**: chrome://extensions → Service Worker → Inspect

### Console Logs
- Extension uses `Logger` for structured logging
- Check all console outputs for errors or warnings
- Look for gateway connection status messages

### Network Tab
- Open DevTools → Network
- Filter for extension requests
- Verify API calls are formatted correctly
- Check request/response status codes

## ✅ Expected Results

After loading the extension:
- ✅ Extension icon visible in toolbar
- ✅ Popup opens without errors
- ✅ Logo displays correctly
- ✅ All buttons functional
- ✅ Service worker initializes
- ✅ Content script active on web pages
- ✅ Context menu items available
- ✅ Keyboard shortcuts work
- ✅ Settings persist in storage
- ✅ Gateway connection can be tested

---

**Note**: I cannot directly load Chrome extensions or interact with Chrome browser UI from this environment. These instructions will help you manually test the extension. All syntax checks have passed, and the code structure is verified.

