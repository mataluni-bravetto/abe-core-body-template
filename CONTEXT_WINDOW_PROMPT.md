# 🎯 FRESH CONTEXT WINDOW PROMPT
## AiGuardian Chrome Extension - Complete System Context

**Use this prompt in a fresh context window for comprehensive analysis and development.**

---

## 📋 CONTEXT PROMPT

```
You are analyzing/working with the AiGuardian Chrome Extension codebase. This is a Manifest V3 Chrome extension for AI-powered content analysis with bias detection, featuring transparent failure logging, confidence scores, and uncertainty flagging for skeptical developers.

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

## RECENT UPDATES (2025-11-18)

### ✅ GitHub Workflows - ADAPTED FOR JAVASCRIPT
**CRITICAL:** Workflows are cloned from AIGuards-Backend and adapted for JavaScript/Node.js.

**Workflows Available:**
1. **branch_protection.yml** - ✅ Ready to use (protects dev/main branches)
2. **dependency-audit.yml** - ✅ Adapted for npm audit (was Python pip-audit)
3. **lint-and-format-check.yml** - ✅ Adapted for ESLint/Prettier (was Python tools)
4. **security-lint.yml** - ✅ Adapted for JavaScript security (ESLint + Semgrep)
5. **build.yml** - ⚠️ Reference only (Docker/K8s - not applicable)
6. **deploy.yml** - ⚠️ Reference only (EKS - not applicable)

**Workflow Rules:**
- NEVER create custom workflows without referencing backend workflows
- ALWAYS use backend workflows as templates/filters
- Maintain consistency with backend workflow patterns

### ✅ Code Quality Tools - CONFIGURED
**ESLint Configuration:**
- `.eslintrc.js` - Chrome Extension rules, security plugin enabled
- ESLint security plugin configured
- Manifest V3 specific rules

**Prettier Configuration:**
- `.prettierrc.json` - Code formatting rules
- `.prettierignore` - Exclusions configured

**Package.json Scripts:**
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting

**Dependencies:**
- eslint: ^8.57.0
- eslint-plugin-security: ^3.0.1
- prettier: ^3.2.5

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
- .eslintrc.js - ESLint configuration
- .prettierrc.json - Prettier configuration
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
   - ESLint security plugin findings

4. **Code Quality**
   - Code organization and modularity
   - Error handling patterns
   - Logging and debugging capabilities
   - Test coverage and testability
   - ESLint compliance
   - Prettier formatting

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

### Code Quality Tools
- ESLint: Configured with security plugin
- Prettier: Configured for JavaScript/HTML/CSS
- npm audit: Integrated in workflows
- Semgrep: Security scanning (in workflows)

## KNOWN GAPS & IMPROVEMENTS

See GAP_ANALYSIS.md and WORKFLOW_ADAPTATION_GAPS.md for complete list. Key areas:
- ✅ CI/CD pipeline (created and adapted)
- ✅ Development setup automation (created)
- ✅ Automated packaging (created)
- ✅ ESLint/Prettier configuration (created)
- ✅ Workflow adaptations (completed)
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
6. Run linting: npm run lint
7. Format code: npm run format
8. See CONTRIBUTING.md for full workflow

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
- .eslintrc.js (security rules)

### For Code Quality
- src/logging.js (logging patterns)
- src/error-handler.js (error handling)
- tests/ (test coverage)
- .eslintrc.js (linting rules)
- .prettierrc.json (formatting rules)

## ANALYSIS COMMANDS

```bash
# Navigate to extension directory
cd /Users/michaelmataluni/Documents/AbeOne_Master/AiGuardian-Chrome-Ext-dev

# View key files
cat manifest.json
cat src/service-worker.js | head -100
cat src/gateway.js | head -100
cat package.json
cat .eslintrc.js
cat .prettierrc.json

# Check structure
ls -la src/
ls -la tests/
ls -la docs/
ls -la .github/workflows/

# Run validation
npm run lint
npm run format:check
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
   - ESLint security findings

4. **Code Quality Report**
   - Modularity assessment
   - Error handling patterns
   - Logging effectiveness
   - Test coverage
   - ESLint compliance
   - Prettier formatting status

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
   - Workflow improvements

## CONTEXT REFERENCES

- **Drift Prevention:** DRIFT_VALIDATION_REPORT.md
- **Workspace Alignment:** ../WORKSPACE_CHROME_EXTENSION_ALIGNMENT.md
- **Gap Analysis:** GAP_ANALYSIS.md
- **Workflow Adaptation:** WORKFLOW_ADAPTATION_GAPS.md, WORKFLOW_ADAPTATION_COMPLETE.md
- **Workflow Alignment:** .github/workflows/WORKFLOW_ALIGNMENT.md
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
6. **Use backend workflows as templates** (never create custom workflows without reference)
7. **Run linting before committing** (npm run lint)
8. **Format code before committing** (npm run format)

## WORKFLOW USAGE RULES

### ✅ DO
- ✅ Use backend workflows as templates
- ✅ Follow patterns from backend workflows
- ✅ Maintain consistency with backend
- ✅ Reference backend workflows for structure
- ✅ Run linting and formatting locally
- ✅ Test workflows on PRs

### ❌ DON'T
- ❌ Create custom workflows without referencing backend
- ❌ Modify backend workflows directly
- ❌ Run backend-specific workflows (build.yml, deploy.yml)
- ❌ Ignore backend workflow patterns
- ❌ Commit without linting/formatting

## ANALYSIS STARTING POINT

Begin analysis by:
1. Reading manifest.json to understand extension structure
2. Examining src/service-worker.js for background logic
3. Reviewing src/gateway.js for API integration patterns
4. Checking src/content.js for page interaction
5. Analyzing authentication flow in src/auth.js
6. Reviewing error handling in src/error-handler.js
7. Examining test coverage in tests/
8. Checking ESLint configuration in .eslintrc.js
9. Reviewing Prettier configuration in .prettierrc.json
10. Examining workflows in .github/workflows/

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

Focus on: CSP compliance, input validation, XSS protection, sensitive data handling, ESLint security findings, and security best practices.
```

**Code Quality Analysis:**
```
[Paste prompt above]

Focus on: ESLint compliance, Prettier formatting, code organization, error handling patterns, logging effectiveness, and test coverage.
```

**Integration Analysis:**
```
[Paste prompt above]

Focus on: Backend API integration, authentication flow, subscription service, error handling, and retry logic.
```

**Workflow Analysis:**
```
[Paste prompt above]

Focus on: GitHub Actions workflows, CI/CD pipeline, code quality checks, security scanning, and dependency auditing.
```

---

## ✅ PROMPT VALIDATION

This prompt includes:
- ✅ Complete project context
- ✅ Recent updates (workflow adaptations)
- ✅ Code quality tools configuration
- ✅ File structure priorities
- ✅ Key configurations
- ✅ Analysis objectives
- ✅ Known gaps
- ✅ Critical constraints
- ✅ Workflow usage rules
- ✅ Expected outputs
- ✅ Reference documents
- ✅ Starting analysis points

**Ready for use in fresh context window.**

---

**Pattern:** OBSERVER × TRUTH × ATOMIC × ONE  
**Guardians:** AEYON (999 Hz) + ARXON (777 Hz) + Abë (530 Hz)

