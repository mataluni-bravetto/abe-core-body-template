# Merge Conflict Resolution Guide

**Branch**: `feature/backend-integration-tests` → `dev`  
**Date**: 2025-01-27  
**Status**: Conflicts identified, resolution guide prepared

---

## Conflicts Identified

### 1. `src/popup.html`
**Conflict Type**: Content conflict  
**Lines Affected**: Authentication section (lines ~45-57)

**Current Branch Changes**:
- Simplified auth UI with single `authCtaBtn` button
- Removed `syncAuthBtn`, `refreshAuthBtn`, `toggleStatusBtn`
- Changed status text to "Checking AiGuardian connection…"

**Dev Branch Changes**:
- Separate `signInBtn` and `signUpBtn` buttons
- Includes `syncAuthBtn`, `refreshAuthBtn`, `toggleStatusBtn`
- Different status text: "We don't claim perfect security..."

**Resolution Strategy**: 
- Keep current branch's simplified UI (single auth button)
- Preserve dev branch's additional buttons if needed for functionality
- Use current branch's status text (more user-friendly)

---

### 2. `src/popup.js`
**Conflict Type**: Content conflict  
**Lines Affected**: 
- `triggerAnalysis()` function (lines ~1059-1091)
- Auth UI handling (lines ~478-564)

**Current Branch Changes**:
- Added 2-second delay before closing popup (line 1087-1089)
- Simplified auth UI handling (removed sync/refresh buttons)
- Added dev UI flag checks

**Dev Branch Changes**:
- Different auth button handling
- May have different error handling

**Resolution Strategy**:
- Keep current branch's popup close delay fix (important UX improvement)
- Merge auth UI handling carefully
- Preserve dev UI flag functionality

---

## Resolution Steps

### Step 1: Start Merge
```bash
git checkout feature/backend-integration-tests
git fetch origin dev
git merge origin/dev
```

### Step 2: Resolve `src/popup.html`

**Keep from current branch**:
- Single `authCtaBtn` button (simpler UX)
- Status text: "Checking AiGuardian connection…"
- Diagnostic panel structure

**Keep from dev branch** (if needed):
- Additional buttons only if they're required for functionality
- Check if `toggleStatusBtn` is needed

**Resolution**:
```html
<!-- Authentication Section -->
<div class="auth-section" id="authSection">
  <div class="user-profile" id="userProfile" style="display: none;">
    <div class="user-avatar" id="userAvatar"></div>
    <div class="user-info">
      <div class="user-name" id="userName"></div>
      <button class="btn btn-secondary btn-small" id="signOutBtn">Sign Out</button>
    </div>
  </div>
  <div class="auth-buttons" id="authButtons">
    <button class="btn btn-primary" id="authCtaBtn">🔐 Sign in or sign up</button>
    <!-- Keep toggleStatusBtn if needed for diagnostics -->
    <button class="btn btn-secondary btn-small" id="toggleStatusBtn" style="display: none;">🔍 Status</button>
  </div>
</div>
```

### Step 3: Resolve `src/popup.js`

**Critical: Keep popup close delay fix**:
```javascript
// Delay closing the popup to allow users to read the error message
setTimeout(() => {
  window.close();
}, 2000); // 2 second delay
```

**Merge auth UI handling**:
- Keep current branch's simplified auth handling
- Preserve dev UI flag checks
- Remove references to syncAuthBtn/refreshAuthBtn if not in HTML

**Resolution for triggerAnalysis()**:
```javascript
async function triggerAnalysis() {
  const statusLine = document.getElementById('analysisStatusLine');

  // Check authentication first
  if (!auth || !auth.isAuthenticated()) {
    const message = 'Please sign in on aiguardian.ai before running analysis.';
    if (statusLine) {
      statusLine.textContent = `Last analysis: failed – ${message}`;
    }
    if (errorHandler) {
      errorHandler.showErrorFromException(new Error(message));
    } else {
      showFallbackError(message);
    }

    // Open landing page for sign-in; content script will detect Clerk auth
    const landingUrl = 'https://www.aiguardian.ai';
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({ url: landingUrl });
      } else {
        window.open(landingUrl, '_blank');
      }
    } catch (e) {
      Logger.warn('[Popup] Failed to open landing page for sign-in', e);
    }

    // Delay closing the popup to allow users to read the error message
    setTimeout(() => {
      window.close();
    }, 2000); // 2 second delay - IMPORTANT: Keep this fix!
    return;
  }
  
  // ... rest of function
}
```

---

## Manual Resolution Process

### Option 1: Use Git Merge Tool
```bash
git mergetool
```

### Option 2: Manual Edit
1. Open conflicted files
2. Look for conflict markers:
   ```
   <<<<<<< HEAD
   (current branch code)
   =======
   (dev branch code)
   >>>>>>> origin/dev
   ```
3. Edit to resolve conflicts
4. Remove conflict markers
5. Test the changes

### Option 3: Accept Current Branch (Recommended)
If current branch's changes are preferred:
```bash
git checkout --ours src/popup.html
git checkout --ours src/popup.js
```

Then manually verify and adjust if needed.

---

## Testing After Resolution

1. **Test Popup UI**:
   - Open extension popup
   - Verify auth buttons display correctly
   - Test sign in flow

2. **Test Error Handling**:
   - Trigger analysis without auth
   - Verify error message displays
   - Verify popup closes after 2 seconds (not immediately)

3. **Test Analysis Flow**:
   - Sign in
   - Highlight text on webpage
   - Verify analysis works

4. **Run Tests**:
   ```bash
   npm run test:smoke
   npm run test:backend-integration
   ```

---

## Key Points to Remember

1. **CRITICAL**: Keep the 2-second popup close delay fix
2. **CRITICAL**: Keep simplified auth UI (single button)
3. Verify all button IDs match between HTML and JS
4. Test thoroughly after resolution
5. Check that dev UI flag functionality still works

---

## Files to Review After Merge

- `src/popup.html` - Verify button IDs match JS
- `src/popup.js` - Verify event listeners match HTML
- `src/constants.js` - Verify SHOW_DEV_UI constant
- `src/content.js` - Verify landing page detection

---

## Quick Resolution Commands

```bash
# Start merge
git merge origin/dev

# If conflicts, resolve manually or:
git checkout --ours src/popup.html  # Keep current branch version
git checkout --ours src/popup.js      # Keep current branch version

# Review and adjust if needed, then:
git add src/popup.html src/popup.js
git commit -m "Merge dev: Resolve conflicts in popup files

- Keep simplified auth UI from feature branch
- Preserve popup close delay fix
- Merge dev UI flag functionality"
```

