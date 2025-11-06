# 👨‍💻 AiGuardians Chrome Extension - Developer Guide & SDK

## 🎯 Overview

This guide provides comprehensive documentation for developers who want to:
- Understand the codebase
- Contribute to the project
- Integrate with the backend API
- Extend functionality
- Build custom guard services

---

## 📋 Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Core Concepts](#core-concepts)
4. [API Reference](#api-reference)
5. [Backend Integration](#backend-integration)
6. [Custom Guard Services](#custom-guard-services)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Best Practices](#best-practices)

---

## 🛠️ Development Setup

### **Prerequisites**

- **Chrome Browser:** Version 88+ (Manifest V3 support)
- **Text Editor:** VS Code, Sublime, or your preference
- **Git:** For version control
- **Node.js:** Optional, for development tools

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-org/aiguardians-extension.git
cd aiguardians-extension

# No build process required - pure JavaScript!
```

### **Load Extension in Chrome**

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the project folder
5. Extension loaded! Icon appears in toolbar

### **Development Workflow**

```bash
# Make changes to files
# Reload extension in chrome://extensions/
# Test changes
# Repeat
```

**Hot Reload:** Chrome automatically reloads content scripts, but you need to manually reload the service worker after changes.

---

## 📁 Project Structure

```
aiguardians-extension/
├── manifest.json              # Extension manifest (Manifest V3)
├── src/
│   ├── service-worker.js      # Background service worker
│   ├── content.js             # Content script (runs on pages)
│   ├── popup.html             # Popup UI
│   ├── popup.js               # Popup logic
│   ├── popup.css              # Popup styles
│   ├── options.html           # Options page UI
│   ├── options.js             # Options page logic
│   ├── gateway.js             # API gateway (MAIN INTEGRATION POINT)
│   ├── constants.js           # Configuration constants
│   ├── logging.js             # Logging utility
│   ├── cache-manager.js       # Response caching
│   ├── string-optimizer.js    # String operations
│   ├── input-validator.js     # Input validation
│   ├── rate-limiter.js        # Rate limiting
│   ├── data-encryption.js     # Data encryption
│   └── testing.js             # Testing framework
├── assets/
│   └── icons/                 # Extension icons
├── docs/                      # Documentation
├── tests/                     # Test files
└── reports/                   # Test reports
```

---

## 🧠 Core Concepts

### **1. Service Worker (Background Script)**

**Purpose:** Main orchestrator, handles all background tasks

**Lifecycle:**
```javascript
// Installation
chrome.runtime.onInstalled.addListener(async () => {
  // Initialize gateway
  gateway = new AiGuardianGateway();
  
  // Set default settings
  await initializeDefaultSettings();
});

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Route messages to handlers
  switch (request.type) {
    case "ANALYZE_TEXT":
      handleTextAnalysis(request.payload, sendResponse);
      return true; // Keep channel open for async response
  }
});
```

**Key Points:**
- ✅ Runs in background (persistent)
- ✅ No DOM access
- ✅ Can use all Chrome APIs
- ✅ Handles message passing

---

### **2. Content Script**

**Purpose:** Runs on web pages, detects text selection

**Isolation:**
```javascript
(function() {
  'use strict';
  // Isolated from page JavaScript
  // Cannot access page variables
  // Can access DOM
})();
```

**Text Selection:**
```javascript
document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  const text = selection?.toString()?.trim();
  
  if (text.length >= MIN_LENGTH) {
    // Send to service worker
    chrome.runtime.sendMessage({
      type: "ANALYZE_TEXT",
      payload: text
    }, (response) => {
      displayResults(response);
    });
  }
});
```

**Key Points:**
- ✅ Runs on every page
- ✅ Isolated from page JS
- ✅ Can manipulate DOM
- ✅ Limited Chrome API access

---

### **3. AiGuardianGateway (Main Integration Point)**

**Purpose:** Unified API gateway for all backend communication

**Architecture:**
```javascript
class AiGuardianGateway {
  constructor() {
    this.config = {};
    this.cacheManager = new CacheManager();
    this.rateLimiter = new RateLimiter();
    // ... other utilities
  }
  
  async sendToGateway(endpoint, payload) {
    // 1. Sanitize input
    payload = this.sanitizeRequestData(payload);
    
    // 2. Validate request
    this.validateRequest(endpoint, payload);
    
    // 3. Check cache
    const cached = this.cacheManager.get(cacheKey);
    if (cached) return cached;
    
    // 4. Check rate limit
    if (!this.rateLimiter.checkLimit()) {
      throw new Error('Rate limit exceeded');
    }
    
    // 5. Send request
    const response = await fetch(url, options);
    
    // 6. Cache response
    this.cacheManager.set(cacheKey, response);
    
    return response;
  }
}
```

**Key Points:**
- ✅ Single integration point
- ✅ Automatic sanitization
- ✅ Response caching
- ✅ Rate limiting
- ✅ Error handling

---

## 📚 API Reference

### **Service Worker API**

#### **Message Types**

```javascript
// Analyze text
chrome.runtime.sendMessage({
  type: "ANALYZE_TEXT",
  payload: "Text to analyze"
}, (response) => {
  // response.success: boolean
  // response.score: number (0-1)
  // response.analysis: object
});

// Get guard status
chrome.runtime.sendMessage({
  type: "GET_GUARD_STATUS"
}, (response) => {
  // response.success: boolean
  // response.status: object
});

// Test gateway connection
chrome.runtime.sendMessage({
  type: "TEST_GATEWAY_CONNECTION"
}, (response) => {
  // response.success: boolean
  // response.responseTime: number (ms)
});

// Get diagnostics
chrome.runtime.sendMessage({
  type: "GET_DIAGNOSTICS"
}, (response) => {
  // response.diagnostics: object
});
```

---

### **Gateway API**

#### **AiGuardianGateway Class**

```javascript
const gateway = new AiGuardianGateway();

// Send request to backend
const result = await gateway.sendToGateway('analyze', {
  text: 'Text to analyze'
});

// Test connection
const isConnected = await gateway.testGatewayConnection();

// Get configuration
const config = await gateway.getConfiguration();

// Update configuration
await gateway.updateConfiguration({
  gatewayUrl: 'https://api.aiguardian.ai',
  apiKey: 'your-api-key'
});

// Get diagnostics
const diagnostics = gateway.getDiagnostics();
// Returns: { requests, successes, failures, cacheHits, averageLatency }

// Get trace statistics
const traceStats = gateway.getTraceStats();
```

---

### **Cache Manager API**

```javascript
const cache = new CacheManager();

// Get cached value
const value = cache.get('key');

// Set cached value with TTL
cache.set('key', value, 30000); // 30 seconds

// Generate cache key
const key = cache.generateCacheKey('endpoint', payload);

// Clear cache
cache.clear();

// Get queued request (deduplication)
const request = cache.getQueuedRequest('key');
```

---

### **Input Validator API**

```javascript
// Validate API key
const isValid = InputValidator.validateAPIKey('your-api-key');

// Validate URL
const isValidURL = InputValidator.validateURL('https://api.example.com');

// Validate text
const isValidText = InputValidator.validateText('Text to validate');

// Sanitize input
const sanitized = InputValidator.sanitizeInput(userInput);
```

---

### **Rate Limiter API**

```javascript
const rateLimiter = new RateLimiter();

// Check if request is allowed
const allowed = rateLimiter.checkLimit('user-id');

// Consume token
rateLimiter.consumeToken('user-id');

// Reset rate limit
rateLimiter.reset('user-id');
```

---

## 🔌 Backend Integration

### **Required Endpoints**

Your backend must implement these 5 endpoints:

#### **1. POST /gateway/unified** (Text Analysis)

**Request:**
```json
{
  "text": "Text to analyze",
  "options": {
    "guards": ["biasguard", "trustguard"],
    "threshold": 0.5
  }
}
```

**Response:**
```json
{
  "success": true,
  "score": 0.75,
  "analysis": {
    "bias_type": "emotional",
    "confidence": 0.9,
    "word_count": 25,
    "emotional_indicators": 3,
    "subjective_indicators": 2,
    "loaded_language_indicators": 1,
    "technical_indicators": 0
  },
  "timestamp": "2025-10-26T12:00:00Z"
}
```

---

#### **2. POST /health/live** (Health Check)

**Request:**
```json
{}
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T12:00:00Z",
  "version": "1.0.0"
}
```

---

#### **3. POST /api/v1/logging** (Centralized Logging)

**Request:**
```json
{
  "level": "info",
  "message": "Log message",
  "metadata": {
    "timestamp": "2025-10-26T12:00:00Z",
    "extension_version": "1.0.0",
    "user_agent": "Mozilla/5.0..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "log_id": "log-123456"
}
```

---

#### **4. GET /api/v1/config** (Get Configuration)

**Response:**
```json
{
  "guards": {
    "biasguard": { "enabled": true, "threshold": 0.5 },
    "trustguard": { "enabled": true, "threshold": 0.7 }
  },
  "settings": {
    "max_text_length": 5000,
    "cache_ttl": 30000
  }
}
```

---

#### **5. POST /api/v1/config** (Update Configuration)

**Request:**
```json
{
  "guards": {
    "biasguard": { "enabled": true, "threshold": 0.6 }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration updated"
}
```

---

### **Authentication**

All requests include the API key in the Authorization header:

```javascript
headers: {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
}
```

---

### **Error Handling**

Backend should return consistent error format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-10-26T12:00:00Z"
}
```

**Error Codes:**
- `INVALID_API_KEY` - API key is invalid
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `TEXT_TOO_LONG` - Text exceeds maximum length
- `INVALID_REQUEST` - Request format is invalid
- `INTERNAL_ERROR` - Server error

---

## 🎨 Custom Guard Services

### **Creating a New Guard**

1. **Define Guard Configuration**

```javascript
// In constants.js
GUARD_SERVICES: {
  myguard: { 
    enabled: true, 
    threshold: 0.5,
    name: 'MyGuard',
    description: 'My custom guard service'
  }
}
```

2. **Implement Backend Logic**

```python
# Backend implementation
class MyGuard:
    def analyze(self, text):
        # Your analysis logic
        score = self.calculate_score(text)
        
        return {
            'score': score,
            'type': 'custom',
            'confidence': 0.9
        }
```

3. **Update Frontend**

```javascript
// In options.html
<div class="guard-service">
  <h4>MyGuard</h4>
  <label class="checkbox-label">
    <input type="checkbox" id="myguard_enabled" checked>
    Enable MyGuard
  </label>
  <label>
    Threshold:
    <input type="range" id="myguard_threshold" 
           min="0" max="1" step="0.1" value="0.5">
  </label>
</div>
```

---

## 🧪 Testing

### **Unit Tests**

```javascript
// tests/unit/gateway.test.js
describe('AiGuardianGateway', () => {
  let gateway;
  
  beforeEach(() => {
    gateway = new AiGuardianGateway();
  });
  
  test('sanitizeRequestData removes XSS', () => {
    const input = { text: '<script>alert("xss")</script>' };
    const output = gateway.sanitizeRequestData(input);
    expect(output.text).not.toContain('<script>');
  });
  
  test('validateRequest throws on invalid endpoint', () => {
    expect(() => {
      gateway.validateRequest('invalid', {});
    }).toThrow('Invalid endpoint');
  });
});
```

### **Integration Tests**

```javascript
// tests/integration-test.js
async function testTextAnalysis() {
  const response = await chrome.runtime.sendMessage({
    type: "ANALYZE_TEXT",
    payload: "This is amazing content!"
  });
  
  console.assert(response.success === true);
  console.assert(response.score > 0);
  console.assert(response.analysis.bias_type === 'emotional');
}
```

### **Manual Testing**

1. Load extension in Chrome
2. Go to `test-all-buttons.html`
3. Follow test instructions
4. Check console for errors

---

## 🚀 Deployment

### **Pre-Deployment Checklist**

- [ ] All tests passing
- [ ] No console errors
- [ ] Manifest version updated
- [ ] Icons optimized
- [ ] Documentation updated
- [ ] Security audit completed
- [ ] Performance tested

### **Build Process**

```bash
# No build process required!
# Just zip the files

# Create distribution package
zip -r aiguardians-v1.0.0.zip . \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*tests*" \
  -x "*.md"
```

### **Chrome Web Store Submission**

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **"New Item"**
3. Upload ZIP file
4. Fill in store listing:
   - Name: AiGuardians
   - Description: (from manifest)
   - Category: Productivity
   - Screenshots: (5 required)
   - Icon: 128x128px
5. Set pricing (free)
6. Submit for review
7. Wait 1-3 days for approval

---

## 💡 Best Practices

### **Code Style**

```javascript
// Use descriptive variable names
const biasScore = calculateBiasScore(text);

// Use async/await for promises
async function analyzeText(text) {
  const result = await gateway.sendToGateway('analyze', { text });
  return result;
}

// Use try-catch for error handling
try {
  const result = await analyzeText(text);
} catch (error) {
  Logger.error('Analysis failed', error);
}

// Use constants for magic numbers
const MIN_TEXT_LENGTH = 10;
const MAX_TEXT_LENGTH = 5000;
```

### **Security**

```javascript
// Always sanitize user input
const sanitized = InputValidator.sanitizeInput(userInput);

// Always validate before processing
if (!InputValidator.validateText(text)) {
  throw new Error('Invalid text input');
}

// Never log sensitive data
Logger.info('API request', { 
  endpoint: 'analyze',
  // Don't log: apiKey, text content
});

// Use HTTPS only
const url = 'https://api.aiguardian.ai'; // ✅
const url = 'http://api.aiguardian.ai';  // ❌
```

### **Performance**

```javascript
// Use caching
const cached = cache.get(key);
if (cached) return cached;

// Use debouncing
let debounceTimer;
function handleSelection() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    analyzeSelection();
  }, 300);
}

// Clean up resources
function cleanup() {
  clearTimeout(debounceTimer);
  eventListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler);
  });
}
```

---

## 📖 Additional Resources

### **Chrome Extension Documentation**
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Service Workers](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Message Passing](https://developer.chrome.com/docs/extensions/mv3/messaging/)

### **AiGuardians Documentation**
- [Architecture](./ARCHITECTURE.md)
- [Dependencies](./DEPENDENCIES.md)
- [User Guide](./USER_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)

### **Community**
- GitHub: https://github.com/your-org/aiguardians
- Discord: https://discord.gg/aiguardians
- Forum: https://forum.aiguardian.ai

---

## 🤝 Contributing

### **How to Contribute**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **Code Review Process**

1. Automated tests run
2. Code review by maintainers
3. Feedback and iterations
4. Approval and merge

---

**Last Updated:** October 26, 2025  
**Version:** 1.0.0  
**Maintainer:** AiGuardians Team  
**License:** MIT

