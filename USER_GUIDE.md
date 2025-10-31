# 📖 AiGuardians Chrome Extension - User Guide

## 🎯 Welcome to AiGuardians

**Finally, AI tools for engineers who don't believe the hype.**

AiGuardians is a Chrome extension that helps you analyze text for bias, emotional language, and objectivity. It provides transparent failure logging, confidence scores, and uncertainty flagging for skeptical developers and critical thinkers.

---

## 📥 Installation

### **Option 1: Chrome Web Store** (Recommended)

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "AiGuardians"
3. Click **"Add to Chrome"**
4. Click **"Add extension"** in the popup
5. Done! The extension icon will appear in your toolbar

### **Option 2: Load Unpacked** (For Development)

1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top-right)
4. Click **"Load unpacked"**
5. Select the extension folder
6. Done! The extension icon will appear in your toolbar

---

## 🚀 Quick Start Guide

### **Step 1: First Time Setup**

1. Click the AiGuardians icon in your Chrome toolbar
2. Click **"⚙️ Configure Service"**
3. Enter your configuration:
   - **Gateway URL:** `https://api.aiguardian.ai` (or your backend URL)
   - **API Key:** Your AiGuardians API key
4. Click **"Save Configuration"**
5. Click **"Test Connection"** to verify it works

### **Step 2: Analyze Text**

1. Go to any webpage (news article, blog post, social media, etc.)
2. **Select some text** by highlighting it with your mouse
3. Wait ~1 second (debounced)
4. A **badge** will appear in the bottom-right corner showing:
   - **Bias Score:** 0-100% (lower is better)
   - **Bias Type:** emotional, technical, subjective, etc.
   - **Confidence:** How confident the AI is in its analysis

### **Step 3: View Detailed Analysis**

1. Click the AiGuardians icon in your toolbar
2. View the detailed analysis in the popup:
   - **Guard Status:** Service operational status
   - **Confidence Score:** Overall confidence level
   - **Bias Type:** Type of bias detected
   - **Uncertainty:** Level of uncertainty

---

## 🎨 User Interface Guide

### **Popup Dashboard**

Click the extension icon to open the popup dashboard:

#### **Header Section**
- **Logo:** AiGuardians branding
- **Title:** "AiGuardians"
- **Tagline:** "Finally, AI tools for engineers who don't believe the hype"

#### **Guard Status Section**
- **Status Indicator:** 
  - 🟢 Blue pulsing dot = Service operational
  - 🔴 Red solid dot = Service disconnected
- **Status Message:** Current service status

#### **Trust & Transparency Section**
- **Confidence Score:** 0.0 - 1.0 scale
  - 🟢 Green (0.0-0.3) = Low bias
  - 🟠 Orange (0.3-0.7) = Medium bias
  - 🔴 Red (0.7-1.0) = High bias
- **Bias Type:** emotional, technical, subjective, neutral, etc.
- **Uncertainty:** Percentage of uncertainty in the analysis

#### **AiGuardian Service Section**
- **Service Status:** Unified AI Analysis status indicator

#### **Action Buttons**
1. **🔍 Show Me the Proof** - Analyze selected text
2. **⚙️ Configure Service** - Open settings
3. **📊 Audit Trail** - Test backend connection

#### **Footer**
- **Version:** Extension version number
- **Links:**
  - 📊 Dashboard - Opens your AiGuardians dashboard
  - 🌐 Website - Opens the main website
  - ⚙️ Settings - Opens configuration page

---

### **Options Page**

Click **"Configure Service"** or **"Settings"** to open the options page:

#### **Configuration Section**
- **Gateway URL:** Your backend API endpoint
- **API Key:** Your authentication key
- **Save Configuration:** Save your settings
- **Test Connection:** Verify backend connectivity

#### **Guard Services Section**
- **BiasGuard:** Detect biased language
- **TrustGuard:** Verify trustworthiness
- **ContextGuard:** Analyze context
- **SecurityGuard:** Security analysis

Each guard service has:
- **Toggle:** Enable/disable the service
- **Threshold:** Sensitivity level (0.0-1.0)

#### **Logging Configuration**
- **Enable Central Logging:** Send logs to backend
- **Enable Local Logging:** Log to browser console
- **Log Level:** info, warn, error, debug, trace

#### **Testing Section**
- **Run Guard Service Tests:** Test all guard services
- **Run Performance Tests:** Test performance metrics
- **Run Integration Tests:** Test backend integration

---

## 📋 Common Use Cases

### **1. Analyze News Articles**

**Goal:** Check if a news article is biased

**Steps:**
1. Go to a news website
2. Read an article
3. Select a paragraph or headline
4. Wait for the analysis badge
5. Review the bias score and type

**Example:**
- **Text:** "This is absolutely the best solution ever created!"
- **Result:** High bias (0.8), Type: emotional
- **Interpretation:** Strong emotional language detected

---

### **2. Review Product Descriptions**

**Goal:** Check if product marketing is objective

**Steps:**
1. Go to an e-commerce site
2. Find a product description
3. Select the description text
4. Review the analysis
5. Make informed purchasing decisions

**Example:**
- **Text:** "Revolutionary, game-changing, incredible product!"
- **Result:** High bias (0.9), Type: emotional
- **Interpretation:** Marketing hype detected

---

### **3. Analyze Social Media Posts**

**Goal:** Identify emotional manipulation

**Steps:**
1. Go to a social media platform
2. Find a post or comment
3. Select the text
4. Review the bias analysis
5. Understand the emotional content

**Example:**
- **Text:** "Everyone knows this is obviously the worst idea ever!"
- **Result:** High bias (0.85), Type: loaded_language
- **Interpretation:** Absolute statements and emotional language

---

### **4. Review Technical Documentation**

**Goal:** Verify objectivity of technical content

**Steps:**
1. Go to technical documentation
2. Select a section
3. Review the analysis
4. Expect low bias scores

**Example:**
- **Text:** "The function processes data using an algorithm to analyze patterns."
- **Result:** Low bias (0.2), Type: technical
- **Interpretation:** Objective, technical language

---

## 🎯 Understanding the Analysis

### **Bias Score Interpretation**

| Score | Level | Color | Meaning |
|-------|-------|-------|---------|
| 0.0 - 0.3 | Low | 🟢 Green | Objective, factual content |
| 0.3 - 0.7 | Medium | 🟠 Orange | Some bias or emotional language |
| 0.7 - 1.0 | High | 🔴 Red | Strong bias or emotional manipulation |

### **Bias Types**

| Type | Description | Examples |
|------|-------------|----------|
| **emotional** | Strong emotional language | amazing, terrible, incredible, awful |
| **subjective** | Subjective statements | obviously, clearly, definitely |
| **loaded_language** | Absolute statements | always, never, everyone, nobody |
| **technical** | Objective, technical content | function, algorithm, data, analysis |
| **neutral** | Balanced, neutral language | may, could, suggests, indicates |

### **Confidence Levels**

| Confidence | Meaning |
|------------|---------|
| 90-100% | Very confident in the analysis |
| 70-89% | Confident in the analysis |
| 50-69% | Moderate confidence |
| Below 50% | Low confidence, needs human review |

---

## ⚙️ Configuration Guide

### **Gateway URL**

**What it is:** The backend API endpoint for AiGuardians

**Default:** `https://api.aiguardian.ai`

**Custom:** If you're self-hosting, use your own URL:
- `https://your-domain.com`
- `http://localhost:3000` (for local development)

**Format:** Must be a valid HTTPS URL (HTTP allowed for localhost)

---

### **API Key**

**What it is:** Your authentication key for the AiGuardians API

**Format:** 
- Minimum 10 characters
- Maximum 200 characters
- Alphanumeric + special characters

**Security:** 
- ✅ Stored securely in Chrome Storage
- ✅ Never logged or exposed
- ✅ Synced across your Chrome devices

**Get your API key:**
1. Go to https://dashboard.aiguardian.ai
2. Sign up or log in
3. Navigate to API Keys
4. Generate a new key
5. Copy and paste into the extension

---

### **Guard Services**

#### **BiasGuard**
- **Purpose:** Detect biased language and emotional manipulation
- **Threshold:** 0.5 (default) - Lower = more sensitive
- **Recommended:** Always enabled

#### **TrustGuard**
- **Purpose:** Verify trustworthiness and credibility
- **Threshold:** 0.7 (default)
- **Recommended:** Enabled for news and reviews

#### **ContextGuard**
- **Purpose:** Analyze context and relevance
- **Threshold:** 0.6 (default)
- **Recommended:** Optional, for advanced users

#### **SecurityGuard**
- **Purpose:** Security and privacy analysis
- **Threshold:** 0.8 (default)
- **Recommended:** Optional, for sensitive content

---

## 🔧 Troubleshooting

### **Extension Not Loading**

**Symptoms:** Extension icon doesn't appear in toolbar

**Solutions:**
1. Check if extension is enabled in `chrome://extensions/`
2. Reload the extension (click refresh button)
3. Restart Chrome
4. Reinstall the extension

---

### **Analysis Not Working**

**Symptoms:** No badge appears when selecting text

**Solutions:**
1. Make sure you selected enough text (minimum 10 characters)
2. Wait 1 second after selecting (debounced)
3. Check if you're on a supported page (not chrome:// pages)
4. Open DevTools (F12) and check for errors
5. Test connection in the popup

---

### **Connection Failed**

**Symptoms:** "Connection failed" error in popup

**Solutions:**
1. Check your internet connection
2. Verify Gateway URL is correct
3. Verify API Key is valid
4. Check if backend is running (if self-hosted)
5. Try the "Test Connection" button
6. Check browser console for errors

---

### **Popup Looks Broken**

**Symptoms:** White background, no styling

**Solutions:**
1. Reload the extension in `chrome://extensions/`
2. Clear browser cache
3. Check if CSS file exists
4. Reinstall the extension

---

### **Settings Not Saving**

**Symptoms:** Settings reset after closing Chrome

**Solutions:**
1. Check if Chrome Sync is enabled
2. Verify storage permissions in manifest
3. Check browser console for errors
4. Try disabling other extensions (conflict)

---

## 💡 Tips & Best Practices

### **For Best Results:**

1. ✅ **Select Complete Sentences** - Better analysis with full context
2. ✅ **Wait for Debounce** - Give it 1 second after selecting
3. ✅ **Review Multiple Sections** - Analyze different parts of content
4. ✅ **Check Confidence Scores** - Low confidence needs human review
5. ✅ **Use Critical Thinking** - AI is a tool, not a replacement for judgment

### **What to Avoid:**

1. ❌ **Don't Select Too Little** - Minimum 10 characters required
2. ❌ **Don't Select Too Much** - Maximum 5000 characters
3. ❌ **Don't Trust Blindly** - Always verify with critical thinking
4. ❌ **Don't Ignore Context** - Consider the full context of the content
5. ❌ **Don't Overreact** - High bias doesn't always mean bad content

---

## 🔒 Privacy & Security

### **What We Collect:**

- ✅ Selected text (for analysis only)
- ✅ Analysis results (for improvement)
- ✅ Error logs (for debugging)
- ✅ Usage statistics (anonymous)

### **What We DON'T Collect:**

- ❌ Personal information
- ❌ Browsing history
- ❌ Passwords or credentials
- ❌ Credit card information
- ❌ Full page content

### **Data Storage:**

- **Local:** Chrome Storage (settings, cache)
- **Backend:** Analysis results, logs (encrypted)
- **Sync:** Settings synced across your Chrome devices

### **Security Features:**

- ✅ HTTPS-only communication
- ✅ Input sanitization (XSS prevention)
- ✅ Rate limiting (abuse prevention)
- ✅ Origin validation (CSRF prevention)
- ✅ Secure storage (Chrome Storage API)

---

## 📞 Support & Feedback

### **Get Help:**

- 📧 Email: support@aiguardian.ai
- 🌐 Website: https://aiguardian.ai
- 📊 Dashboard: https://dashboard.aiguardian.ai
- 📖 Documentation: https://docs.aiguardian.ai

### **Report Issues:**

1. Open DevTools (F12)
2. Go to Console tab
3. Copy error messages
4. Email to support@aiguardian.ai
5. Include:
   - Chrome version
   - Extension version
   - Steps to reproduce
   - Error messages

### **Feature Requests:**

- 💡 Submit via dashboard
- 🗳️ Vote on existing requests
- 💬 Join our community

---

## 🎓 Advanced Features

### **Keyboard Shortcuts**

- **Ctrl+Shift+A** - Analyze selected text (manual trigger)
- **Ctrl+Shift+O** - Open options page (coming soon)
- **Ctrl+Shift+D** - Toggle debug mode (coming soon)

### **Developer Mode**

Enable in options page for:
- 🔍 Detailed logging
- 📊 Performance metrics
- 🧪 Test mode
- 🐛 Debug information

### **Custom Thresholds**

Adjust guard service thresholds for:
- **Higher sensitivity** - Lower threshold (0.3-0.5)
- **Lower sensitivity** - Higher threshold (0.7-0.9)
- **Balanced** - Default threshold (0.5-0.7)

---

## 📚 Glossary

**Bias Score:** Numerical measure (0-1) of bias in text  
**Confidence:** How certain the AI is about its analysis  
**Guard Service:** Specific analysis module (BiasGuard, TrustGuard, etc.)  
**Gateway:** Backend API endpoint for analysis  
**Threshold:** Sensitivity level for guard services  
**Trace Bullet:** Mock data for testing without backend  

---

**Last Updated:** October 26, 2025  
**Version:** 1.0.0  
**Support:** support@aiguardian.ai

