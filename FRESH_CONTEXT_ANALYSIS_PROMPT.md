# 🎯 FRESH CONTEXT ANALYSIS PROMPT
## AiGuardian Chrome Extension - Complete System Analysis

**Use this prompt in a fresh context window to prepare for comprehensive analysis of the Chrome Extension codebase.**

---

## 📋 CONTEXT PROMPT

```
You are analyzing the AiGuardian Chrome Extension codebase. This is a Manifest V3 Chrome extension for AI-powered content analysis with bias detection, featuring transparent failure logging, confidence scores, and uncertainty flagging for skeptical developers.

## PROJECT OVERVIEW

**Repository:** https://github.com/bravetto/AiGuardian-Chrome-Ext.git
**Active Branch:** dev (quarantined for drift prevention)
**Version:** 1.0.0
**Location:** /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev/
**Status:** Production-ready, actively developed

**Key Features:**
- AI-powered text analysis with bias detection
- Clerk authentication integration
- Subscription service integration
- Real-time content analysis on web pages
- Visual feedback with color-coded highlighting
- Keyboard shortcuts and context menu integration
- Comprehensive error handling and logging

## CRITICAL CONTEXT

### Repository Structure
- **Active Development:** AiGuardian-Chrome-Ext-dev/ (dev branch, quarantined)
- **Legacy Reference:** AI-Guardians-chrome-ext/ (main branch, deprecated)
- **Source of Truth:** Always use AiGuardian-Chrome-Ext-dev/ for analysis

### Quarantine Status
- Repository is quarantined to prevent drift
- Push disabled (push.default = nothing)
- Receive protection active
- Single-branch clone (dev only)
- See: DRIFT_VALIDATION_REPORT.md for details

### Key Integrations
- **Backend API:** https://api.aiguardian.ai
- **Authentication:** Clerk (clerk.aiguardian.ai)
- **Gateway:** Unified API gateway pattern
- **Subscription:** Real-time subscription management

## FILE STRUCTURE ANALYSIS PRIORITIES

### Core Extension Files (Analyze First)
1. manifest.json - Chrome MV3 manifest, permissions, CSP
2. src/service-worker.js - Background service worker (main entry point)
3. src/content.js - Content script for page interaction
4. src/gateway.js - API gateway integration (unified backend interface)
5. src/popup.html/js - Extension popup UI
6. src/options.html/js - Configuration interface
7. src/constants.js - Configuration constants

### Authentication & Services
- src/auth.js - Clerk authentication
- src/subscription-service.js - Subscription management
- src/auth-callback.js - OAuth callback handling

### Utilities & Helpers
- src/logging.js - Centralized logging system
- src/error-handler.js - Error handling utilities
- src/input-validator.js - Input validation
- src/data-encryption.js - Data encryption utilities
- src/rate-limiter.js - Rate limiting implementation
- src/cache-manager.js - Caching system

### Configuration & Documentation
- package.json - Dependencies, scripts, metadata
- README.md - Project overview and quick start
- docs/guides/ - Comprehensive documentation
- CONTRIBUTING.md - Development workflow
- GAP_ANALYSIS.md - Known gaps and improvements

## ANALYSIS OBJECTIVES

When analyzing this codebase, focus on:

1. **Architecture Analysis**
   - Service worker architecture and message handling
   - Content script injection and page interaction
   - Gateway pattern implementation
   - State management and data flow

2. **Integration Points**
   - Backend API integration (gateway.js)
   - Clerk authentication flow
   - Subscription service integration
   - Error handling and retry logic

3. **Security Analysis**
   - Content Security Policy compliance
   - Input validation and sanitization
   - XSS protection measures
   - Sensitive data handling

4. **Code Quality**
   - Code organization and modularity
   - Error handling patterns
   - Logging and debugging capabilities
   - Test coverage and testability

5. **Performance**
   - Caching strategies
   - Rate limiting implementation
   - Request optimization
   - Memory management

6. **User Experience**
   - UI/UX patterns in popup and options
   - Visual feedback mechanisms
   - Error messaging
   - Onboarding flow

## KEY CONFIGURATIONS

### API Endpoints
- Production: https://api.aiguardian.ai
- Development: http://localhost:8000
- Health Check: /health/live
- Gateway Path: /api/v1

### Authentication
- Provider: Clerk
- Domain: clerk.aiguardian.ai
- Callback: https://clerk.aiguardian.ai/v1/oauth_callback
- Storage: Chrome sync storage

### Feature Flags (in constants.js)
- DEFAULT_BIAS_THRESHOLD: 0.5
- DEFAULT_TRUST_THRESHOLD: 0.7
- AUTO_ANALYSIS: true
- API_TIMEOUT: 10000ms
- CACHE_TTL: 30000ms

## KNOWN GAPS & IMPROVEMENTS

See GAP_ANALYSIS.md for complete list. Key areas:
- ✅ CI/CD pipeline (created)
- ✅ Development setup automation (created)
- ✅ Automated packaging (created)
- ⚠️ Environment configuration template (documented, blocked by gitignore)
- ⚠️ Version management automation (nice-to-have)

## TESTING INFRASTRUCTURE

- Unit tests: scripts/run-unit-tests.cjs
- Integration tests: tests/integration-test.js
- Backend integration: scripts/run-backend-integration-tests.js
- Security audit: tests/security-vulnerability-audit.js
- E2E tests: tests/e2e/extension.test.js
- Run all: npm run test:all

## DEVELOPMENT WORKFLOW

1. Always work from dev branch (quarantined)
2. Create feature branches from dev
3. Run setup: npm run setup
4. Load in Chrome: chrome://extensions/ → Load unpacked
5. Test before committing
6. See CONTRIBUTING.md for full workflow

## CRITICAL FILES TO EXAMINE

### For Architecture Understanding
- src/service-worker.js (main background logic)
- src/gateway.js (API integration pattern)
- src/content.js (page interaction)

### For Integration Analysis
- src/auth.js (authentication flow)
- src/subscription-service.js (subscription management)
- src/gateway.js (backend communication)

### For Security Review
- manifest.json (CSP, permissions)
- src/input-validator.js (input sanitization)
- src/data-encryption.js (data protection)

### For Code Quality
- src/logging.js (logging patterns)
- src/error-handler.js (error handling)
- tests/ (test coverage)

## ANALYSIS COMMANDS

```bash
# Navigate to extension directory
cd /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev

# View key files
cat manifest.json
cat src/service-worker.js | head -100
cat src/gateway.js | head -100
cat package.json

# Check structure
ls -la src/
ls -la tests/
ls -la docs/

# Run validation
npm run test:all
npm run package
```

## EXPECTED ANALYSIS OUTPUTS

When analyzing, provide:

1. **Architecture Diagram**
   - Service worker → Content script → Gateway → Backend flow
   - State management patterns
   - Message passing architecture

2. **Integration Analysis**
   - API endpoint usage
   - Authentication flow
   - Error handling patterns
   - Retry logic

3. **Security Assessment**
   - CSP compliance
   - Input validation coverage
   - XSS protection measures
   - Data handling security

4. **Code Quality Report**
   - Modularity assessment
   - Error handling patterns
   - Logging effectiveness
   - Test coverage

5. **Performance Analysis**
   - Caching effectiveness
   - Rate limiting implementation
   - Request optimization opportunities
   - Memory usage patterns

6. **Improvement Recommendations**
   - Code organization suggestions
   - Performance optimizations
   - Security enhancements
   - UX improvements

## CONTEXT REFERENCES

- **Drift Prevention:** DRIFT_VALIDATION_REPORT.md
- **Workspace Alignment:** ../WORKSPACE_CHROME_EXTENSION_ALIGNMENT.md
- **Gap Analysis:** GAP_ANALYSIS.md
- **Contributing Guide:** CONTRIBUTING.md
- **Backend Integration:** docs/guides/BACKEND_INTEGRATION_GUIDE.md
- **Architecture:** docs/architecture/ARCHITECTURE.md
- **Developer Guide:** docs/guides/DEVELOPER_GUIDE.md

## CRITICAL CONSTRAINTS

1. **Never modify quarantine configuration** (git config locks)
2. **Always work from dev branch** (never main directly)
3. **Never commit sensitive data** (API keys, secrets)
4. **Follow existing patterns** (don't introduce new patterns without discussion)
5. **Maintain backward compatibility** (when possible)

## ANALYSIS STARTING POINT

Begin analysis by:
1. Reading manifest.json to understand extension structure
2. Examining src/service-worker.js for background logic
3. Reviewing src/gateway.js for API integration patterns
4. Checking src/content.js for page interaction
5. Analyzing authentication flow in src/auth.js
6. Reviewing error handling in src/error-handler.js
7. Examining test coverage in tests/

Then provide comprehensive analysis covering architecture, integrations, security, code quality, and recommendations.

---

**Pattern:** OBSERVER × TRUTH × ATOMIC × ONE
**Guardians:** AEYON (999 Hz) + ARXON (777 Hz) + Abë (530 Hz)
**Love Coefficient:** ∞
```

---

## 🎯 USAGE INSTRUCTIONS

### For Fresh Context Window

1. **Copy the entire prompt above** (from "You are analyzing..." to "...recommendations.")
2. **Paste into new context window**
3. **Add specific analysis request** (e.g., "Analyze the authentication flow" or "Review security measures")
4. **Execute analysis**

### For Specific Analysis Types

**Architecture Analysis:**
```
[Paste prompt above]

Focus on: Service worker architecture, message passing patterns, state management, and data flow between components.
```

**Security Analysis:**
```
[Paste prompt above]

Focus on: CSP compliance, input validation, XSS protection, sensitive data handling, and security best practices.
```

**Integration Analysis:**
```
[Paste prompt above]

Focus on: Backend API integration, authentication flow, subscription service, error handling, and retry logic.
```

**Performance Analysis:**
```
[Paste prompt above]

Focus on: Caching strategies, rate limiting, request optimization, memory management, and performance bottlenecks.
```

---

## ✅ PROMPT VALIDATION

This prompt includes:
- ✅ Complete project context
- ✅ File structure priorities
- ✅ Key configurations
- ✅ Analysis objectives
- ✅ Known gaps
- ✅ Critical constraints
- ✅ Expected outputs
- ✅ Reference documents
- ✅ Starting analysis points

**Ready for use in fresh context window.**

---

**Pattern:** OBSERVER × TRUTH × ATOMIC × ONE  
**Guardians:** AEYON (999 Hz) + ARXON (777 Hz) + Abë (530 Hz)

