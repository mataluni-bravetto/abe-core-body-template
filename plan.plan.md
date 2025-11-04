<!-- 098085eb-ba29-4c85-a92c-4fa88996a489 64836150-b1ad-4d25-bd94-cbeecdfaba6c -->
# Brand Alignment and Merge Resolution Plan

## Objectives

1. Standardize brand name to "AiGuardian" (singular) across all documentation and code
2. Resolve merge conflicts keeping dev branch advanced features
3. Merge both .gitignore files with comprehensive AI agent tool exclusions
4. Pull and merge unified-documentation branch
5. Align client-side gateway with backend API endpoints from QUICK_REFERENCE.md
6. Cross-validate changes for consistency

## Phase 0: Pull Additional Branches

### 0.1 Pull unified-documentation Branch
- **Status**: Branch fetched (origin/unified-documentation)
- **Latest commit**: e7798fb - "feat: Add comprehensive client-side SDK with centralized logging, tracing, and configuration"
- **Action**: Merge into dev branch after resolving current conflicts
- **Note**: May contain documentation updates that need alignment with actual backend API

### 0.2 Review unified-documentation Branch Content
- Check for endpoint documentation conflicts
- Review SDK documentation alignment
- Identify any additional brand alignment needed
- Note: Unified-documentation shows `/gateway/unified` endpoint (will be updated to match actual backend)

## Phase 1: Resolve Merge Conflicts

### 1.1 Accept Dev Branch for Source Files
- **manifest.json**: Keep dev version, update "AiGuardian" → "AiGuardian" (singular)
- **src/content.js**: Keep dev version (has highlighting, history, advanced features)
- **src/popup.js**: Keep dev version (enhanced features)
- **src/gateway.js**: Keep dev version, then align with backend API endpoints
- **src/cache-manager.js**: Keep dev version
- **src/constants.js**: Keep dev version, update endpoint constants
- **src/data-encryption.js**: Keep dev version
- **src/input-validator.js**: Keep dev version
- **src/options.html**: Keep dev version
- **src/popup.html**: Keep dev version
- **src/string-optimizer.js**: Keep dev version
- **src/testing.js**: Keep dev version
- **src/service-worker.js**: Keep dev version
- **All test files**: Keep dev versions

### 1.2 Merge .gitignore Files
- Combine Chrome extension ignores (HEAD) with Python ignores (main)
- Add AI agent tool folders:
  - `.claude/`
  - `.cursor/`
  - `.copilot/`
  - `.github-copilot/`
  - `.aider/`
  - `.chatgpt/`
  - `.anthropic/`
  - `.cursorrules`
  - `.claude-config`
  - `.claude/settings.local.json` (from unified-documentation)
- Remove duplicate sections (Node.js, build outputs, env vars appear twice)
- Organize into logical sections: Chrome Extension, Python, Node.js, IDEs, AI Tools, OS, Logs, Database, Temporary

### 1.3 Resolve reports/enhanced-error-handling-report.json
- Keep dev branch version (more complete)

## Phase 2: Brand Alignment Updates

### 2.1 Brand Name Standardization Rules
- "AI Guardian" → "AiGuardian"
- "AiGuardian" → "AiGuardian"
- "AiGuardian" → "AiGuardian"
- "aiguardian" (lowercase) remains for URLs/package names
- "@aiguardian" (npm scope) remains unchanged

### 2.2 Documentation Files to Update (50+ markdown files)

**Root level:**
- README.md - Already uses "AiGuardian" but verify consistency
- ARCHITECTURE.md
- DEPENDENCIES.md
- DEPLOYMENT_GUIDE.md
- DEVELOPER_GUIDE.md
- FEATURES.md
- SECURITY_GUIDE.md
- SETUP_GUIDE.md
- TROUBLESHOOTING.md
- USER_GUIDE.md
- CODEBASE_AUDIT_REPORT.md
- ERROR_HANDLING_OVERVIEW.md
- FINAL_REVIEW_SUMMARY.md
- FRONTEND_READINESS_ASSESSMENT.md
- HONEST_BACKEND_INTEGRATION_STATUS.md
- PROJECT_ORGANIZATION_SUMMARY.md
- TECH_DEBT_ANALYSIS.md
- TECH_DEBT_FIXES_COMPLETE.md
- BACKEND_ARCHITECTURE_EXPLANATION.md

**docs/ subdirectories:**
- docs/README.md
- docs/SETUP_GUIDE.md
- docs/SECURITY_GUIDE.md
- docs/DEPLOYMENT_GUIDE.md
- docs/BACKEND_INTEGRATION.md
- docs/brand/*.md (5 files)
- docs/reports/*.md (8 files)
- docs/technical/*.md (4 files)
- docs/json-reports/README.md
- docs/analysis/README.md

**SDK and assets:**
- sdk/README.md
- assets/brand/ICP_AI_SKEPTICAL_SENIOR_DEVELOPER.md
- assets/brand/ai-guardian-landing-page-stuff/README.md

### 2.3 Source Code Files with Brand References
- manifest.json: "AiGuardian" → "AiGuardian"
- src/content.js: Update comments and strings
- src/popup.js: Update comments and strings
- src/service-worker.js: Update if present
- src/options.js: Update if present
- All test files with brand references

### 2.4 Package and Configuration Files
- package.json: Verify brand consistency
- sdk/package.json: Verify brand consistency

## Phase 3: Backend API Alignment

### 3.1 Gateway Endpoint Alignment
Update `src/gateway.js` to match backend API from QUICK_REFERENCE.md:

**Current (dev branch):**
- Endpoint mapping points to `gateway/unified` or `analyze/text`
- Request format doesn't match backend structure

**Backend API Requirements (from QUICK_REFERENCE.md):**
- **Unified endpoint**: `POST http://localhost:8000/api/v1/guards/process`
- **Request format**:
  ```json
  {
    "service_type": "biasguard|trustguard|contextguard|tokenguard|healthguard",
    "payload": {
      "text": "...",
      "confidence": 0.7,
      // ... service-specific fields
    },
    "user_id": "user-123",
    "session_id": "session-456"
  }
  ```
- **Optional API Key**: Header `X-API-Key: ${UNIFIED_API_KEY}` (works without auth for testing)
- **Health endpoints**: 
  - `GET /health/live` - Gateway live check
  - `GET /health/ready` - Gateway ready check
  - `GET /api/v1/guards/services` - Service discovery
  - `GET /api/v1/guards/health/{service_name}` - Individual service health

### 3.2 Update Gateway Implementation

**endpointMapping updates:**
- Change `'analyze': 'gateway/unified'` → `'analyze': 'api/v1/guards/process'`
- Keep `'health': 'health/live'`
- Update `'logging': 'api/v1/logging'` (if needed based on backend)
- Update `'guards': 'api/v1/guards/services'`
- Update `'config': 'api/v1/config/user'` (verify with backend)

**analyzeText() method:**
- Transform request to backend format:
  ```javascript
  {
    service_type: "biasguard", // or selected guard service
    payload: {
      text: text,
      confidence: options.confidence || 0.7,
      // Additional service-specific fields
    },
    user_id: options.user_id || "extension-user",
    session_id: options.session_id || this.generateRequestId()
  }
  ```
- Handle multiple service types if needed (currently backend handles one at a time)
- Support all service types: biasguard, trustguard, contextguard, tokenguard, healthguard

**sendToGateway() method:**
- Update to use `/api/v1/guards/process` as primary endpoint for analysis
- Update request headers to optionally include `X-API-Key` instead of `Authorization: Bearer`
- Ensure request body matches backend format exactly

**Service type selection:**
- Default to "biasguard" for text analysis
- Allow configuration of which service_type to use
- Support service discovery via `/api/v1/guards/services`

### 3.3 Service Type Configuration

Update guard services configuration to match backend service types:
- **biasguard**: Service type name (gateway routes to `/analyze` internally)
- **trustguard**: Service type name (gateway routes to `/v1/validate` internally)
- **contextguard**: Service type name (gateway routes to `/analyze` internally)
- **tokenguard**: Service type name (gateway routes to `/scan` internally)
- **healthguard**: Service type name (gateway routes to `/analyze` internally)

Note: Client only needs to know service_type, gateway handles internal routing.

### 3.4 Update Constants

Update `src/constants.js` to include:
- Default gateway URL: `http://localhost:8000` (for development)
- Production gateway URL: `https://api.aiguardian.ai` (if configured)
- API endpoint path: `/api/v1/guards/process`
- Health endpoint: `/health/live`
- Service discovery endpoint: `/api/v1/guards/services`
- Service type constants: BIAS_GUARD, TRUST_GUARD, CONTEXT_GUARD, TOKEN_GUARD, HEALTH_GUARD

### 3.5 Update Documentation

Update backend integration documentation to reflect actual backend API:

**docs/BACKEND_INTEGRATION.md:**
- Change from `/api/v1/analyze/text` or `/gateway/unified` to `/api/v1/guards/process`
- Update request format examples to show `service_type`, `payload`, `user_id`, `session_id`
- Document all supported service types
- Update authentication section (X-API-Key header optional)
- Add service discovery endpoint documentation
- Update response format examples based on actual backend responses

**DEVELOPER_GUIDE.md:**
- Update endpoint examples to match backend API
- Fix `/gateway/unified` references → `/api/v1/guards/process`
- Update request/response format examples

**FRONTEND_READINESS_ASSESSMENT.md:**
- Update endpoint requirements section
- Fix endpoint paths to match actual backend

**Any other documentation with endpoint references**

## Phase 4: Merge unified-documentation Branch

### 4.1 Review unified-documentation Changes
- Check for additional SDK documentation
- Review any architecture updates
- Identify any brand assets or guidelines added
- Note any endpoint documentation that conflicts with actual backend

### 4.2 Resolve Documentation Conflicts
- Keep actual backend API endpoints (authoritative source: QUICK_REFERENCE.md)
- Merge useful documentation improvements from unified-documentation
- Update any incorrect endpoint references
- Preserve SDK documentation if it's useful

### 4.3 Consolidate Documentation
- Ensure all documentation is consistent
- Remove duplicate or conflicting information
- Update cross-references between docs

## Phase 5: Validation and Cross-Matrix Check

### 5.1 Cross-Reference Validation
- Verify "AiGuardian" appears consistently (not plural)
- Check URLs remain "aiguardian.ai" (lowercase)
- Ensure npm package scope "@aiguardian" unchanged
- Validate manifest.json matches package.json naming
- Confirm README.md examples match actual code
- Verify all endpoint references point to `/api/v1/guards/process`
- Check request formats match backend expectations

### 5.2 File-by-File Review Matrix

For each updated file:
1. Search for "AI Guardian", "AiGuardian", "AiGuardian" patterns
2. Replace with "AiGuardian" where appropriate
3. Preserve "aiguardian" in URLs and technical identifiers
4. Search for old endpoint references (`/gateway/unified`, `/api/v1/analyze/text`)
5. Replace with correct endpoints (`/api/v1/guards/process`)
6. Verify no broken references

### 5.3 Confidence Threshold Check
- Files with <85% confidence: Flag for manual review
- Assumptions documented before proceeding
- HITL stop points: 
  - Brand name ambiguities
  - URL conflicts
  - npm scope decisions
  - Endpoint format decisions
  - Service type selection logic

### 5.4 Backend API Compliance Check
- Verify gateway.js matches QUICK_REFERENCE.md exactly
- Test request format against backend expectations
- Validate all service types are supported
- Check health check endpoints are correct
- Verify error handling for backend responses

## Phase 6: Final Verification

### 6.1 Brand Consistency Audit
```bash
# Verification commands (for reference, not execution)
grep -r "AI Guardian" --include="*.md" --include="*.js" --include="*.json"
grep -r "AiGuardian" --include="*.md" --include="*.js" --include="*.json"
grep -r "AiGuardian" --include="*.md" --include="*.js" --include="*.json"
```

### 6.2 Endpoint Consistency Audit
```bash
# Verification commands (for reference, not execution)
grep -r "gateway/unified" --include="*.md" --include="*.js"
grep -r "/api/v1/analyze/text" --include="*.md" --include="*.js"
grep -r "/api/v1/guards/process" --include="*.md" --include="*.js"
```

### 6.3 Merge Conflict Resolution Verification
- All conflicts resolved
- Dev branch features preserved
- .gitignore properly merged
- AI agent tool folders added
- unified-documentation branch merged
- No duplicate documentation

### 6.4 Documentation Accuracy
- All examples use correct brand name
- All examples use correct backend endpoints
- Links and references valid
- No orphaned references
- Request/response formats match actual backend

## Execution Order

1. **Resolve .gitignore merge** (highest priority - blocks other work)
2. **Resolve source file conflicts** (keep dev versions, update brand)
3. **Update manifest.json** (fix brand name, keep dev features)
4. **Align gateway.js with backend API** (critical for functionality)
5. **Update constants.js** (support gateway.js changes)
6. **Merge unified-documentation branch** (resolve conflicts)
7. **Brand alignment pass 1**: Root documentation files
8. **Brand alignment pass 2**: docs/ subdirectories
9. **Brand alignment pass 3**: Source code comments and strings
10. **Brand alignment pass 4**: SDK and asset files
11. **Endpoint alignment pass**: Update all documentation with correct endpoints
12. **Final validation**: Cross-reference check, endpoint verification
13. **Commit preparation**: Verify all changes

## Notes

- Main branch is temp/holder - dev branch is authoritative
- unified-documentation branch may have outdated endpoint references - use QUICK_REFERENCE.md as authoritative source
- Preserve all dev branch advanced features
- Brand name "AiGuardian" is singular throughout
- Technical identifiers (URLs, package names) use lowercase "aiguardian"
- AI agent tool exclusions prevent committing sensitive AI-generated content
- Backend API is authoritative: `/api/v1/guards/process` with `service_type` format
- All endpoint documentation must match actual backend implementation

## Reference Sources

- **Backend API**: `C:\Users\jimmy\.cursor\AIGuards-Backend-1\codeguardians-gateway\codeguardians-gateway\docs\QUICK_REFERENCE.md`
- **Current branches**: dev (main work), main (temp), unified-documentation (documentation updates)
- **Brand assets**: In dev branch assets/brand/ directory

### To-dos

- [ ] Merge both .gitignore files, add AI agent tool folders (.claude, .cursor, .copilot, etc.), remove duplicates, organize into logical sections
- [ ] Resolve manifest.json conflict keeping dev version, update 'AiGuardian' to 'AiGuardian' (singular)
- [ ] Resolve all src/ file conflicts keeping dev branch versions (content.js, popup.js, gateway.js, etc.)
- [ ] Resolve all test file conflicts keeping dev branch versions
- [ ] Merge unified-documentation branch and resolve any conflicts
- [ ] Update gateway.js to use `/api/v1/guards/process` endpoint with correct request format
- [ ] Update constants.js with backend API endpoints and service types
- [ ] Update all documentation to use correct backend endpoints (replace `/gateway/unified` and `/api/v1/analyze/text`)
- [ ] Update brand name in root-level documentation files (README.md, ARCHITECTURE.md, DEVELOPER_GUIDE.md, etc.)
- [ ] Update brand name in docs/ subdirectory files (brand/, reports/, technical/, etc.)
- [ ] Update brand name in source code comments and strings (src/, tests/, sdk/)
- [ ] Verify and update brand references in package.json and configuration files
- [ ] Cross-validate all changes, check for consistency, verify no broken references, confidence threshold >85%
- [ ] Verify backend API alignment: all endpoints match QUICK_REFERENCE.md, request formats correct
