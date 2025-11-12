# 🧪 Browser Testing Guide for AiGuardian Extension

## 🚀 Quick Start

### Step 1: Load the Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Navigate to and select the extension folder: `C:\Users\jimmy\.cursor\AI-Guardians-chrome-ext`
5. Verify the extension appears in the list

### Step 2: Open Test Page
1. The test page should have opened automatically: `test-extension-features.html`
2. If not, open it manually from the extension folder
3. Keep this page open for testing

### Step 3: Test Each Feature

---

## ✅ Test Checklist

### Test 1: Onboarding Tooltip ⭐ NEW FEATURE
**Location:** Extension popup (click extension icon)

**Steps:**
1. Click the AiGuardian extension icon in Chrome toolbar
2. **Expected:** Welcome tooltip appears with:
   - AiGuardian logo
   - "Welcome to AiGuardian!" title
   - Explanation of what AiGuardian does
   - "Got it!" button
   - "Don't show again" checkbox

**Verify:**
- [ ] Tooltip appears on first open
- [ ] Design matches brand colors (blue gradient)
- [ ] "Got it!" button closes tooltip
- [ ] Checking "Don't show again" prevents future tooltips
- [ ] Tooltip doesn't appear after dismissing

**Pass Criteria:** Tooltip appears and functions correctly

---

### Test 2: Authentication Flow
**Location:** Extension popup

**Steps:**
1. Open extension popup
2. Click **"Sign Up"** button
3. Complete registration in new tab
4. Verify callback redirects back to extension
5. Check if user profile appears in popup

**Verify:**
- [ ] Sign Up button opens Clerk registration page
- [ ] After registration, callback page loads
- [ ] User profile appears with avatar/initials
- [ ] Display name shows correctly
- [ ] Sign Out button works

**Pass Criteria:** Complete auth flow works end-to-end

---

### Test 3: Error Handler ⭐ NEW FEATURE
**Location:** Extension popup

**Steps:**
1. Open popup WITHOUT signing in
2. Click **"🔍 Show Me the Proof"** button
3. Observe error message

**Verify:**
- [ ] Error message appears: "Sign In Required"
- [ ] Message is user-friendly (not technical)
- [ ] Action button "Sign In" appears
- [ ] Error has proper styling (blue info style)
- [ ] Close button (×) works

**Test More Errors:**
- Select text <10 characters → Should fail silently
- Select text >5000 characters → Should show user-friendly error
- Try analysis without internet → Should show connection error

**Pass Criteria:** All errors are user-friendly with actionable guidance

---

### Test 4: Text Analysis
**Location:** Test page (`test-extension-features.html`)

**Steps:**
1. Sign in to extension first
2. Select text from Test Text 1 (Low Bias)
3. Wait for analysis badge
4. Check results

**Verify:**
- [ ] "Analyzing..." badge appears after selection
- [ ] Analysis badge shows bias score (0-100%)
- [ ] Badge shows confidence percentage
- [ ] Badge shows bias type
- [ ] Selected text gets highlighted with color
- [ ] Color matches bias level (green/orange/red)

**Test All Three Text Samples:**
- Test Text 1: Should show LOW bias (green)
- Test Text 2: Should show MEDIUM bias (orange)
- Test Text 3: Should show HIGH bias (red)

**Pass Criteria:** Analysis works correctly with visual feedback

---

### Test 5: Text Highlighting
**Location:** Test page

**Steps:**
1. Analyze some text (creates highlights)
2. Right-click on page → "Clear All Highlights"
3. Verify highlights removed

**Verify:**
- [ ] Highlights appear after analysis
- [ ] Highlight color matches bias score
- [ ] Context menu "Clear All Highlights" works
- [ ] Highlights are properly removed

**Pass Criteria:** Highlighting and clearing works correctly

---

### Test 6: Keyboard Shortcuts
**Location:** Test page

**Steps:**
1. Select text on page
2. Press `Ctrl+Shift+A` (Windows) or `Cmd+Shift+A` (Mac)
3. Verify analysis triggers
4. Press `Ctrl+Shift+C` (Windows) or `Cmd+Shift+C` (Mac)
5. Verify highlights clear

**Verify:**
- [ ] `Ctrl+Shift+A` triggers analysis
- [ ] `Ctrl+Shift+C` clears highlights
- [ ] Shortcuts work on any webpage

**Pass Criteria:** Keyboard shortcuts function correctly

---

### Test 7: Context Menu
**Location:** Test page

**Steps:**
1. Select text
2. Right-click on selection
3. Click "Analyze with AiGuardian"
4. Verify analysis runs

**Verify:**
- [ ] Context menu appears on text selection
- [ ] "Analyze with AiGuardian" option visible
- [ ] Clicking menu item triggers analysis
- [ ] "Clear All Highlights" appears when no selection

**Pass Criteria:** Context menu integration works

---

### Test 8: Popup Analysis Button
**Location:** Extension popup

**Steps:**
1. Sign in to extension
2. Select text on test page
3. Open extension popup
4. Click **"🔍 Show Me the Proof"** button
5. Verify results appear in popup

**Verify:**
- [ ] Button triggers analysis
- [ ] Results appear in popup
- [ ] Score, type, and confidence display correctly
- [ ] Loading state shows "Analyzing..."

**Pass Criteria:** Popup button analysis works

---

### Test 9: Error Message Improvements ⭐ NEW FEATURE
**Location:** Extension popup

**Test Various Error Scenarios:**

1. **No Selection Error:**
   - Open popup
   - Don't select any text
   - Click analyze button
   - **Expected:** "No Text Selected" error with guidance

2. **Selection Too Short:**
   - Select <10 characters
   - Try to analyze
   - **Expected:** Silent validation (no error shown)

3. **Selection Too Long:**
   - Select >5000 characters
   - Try to analyze
   - **Expected:** User-friendly error badge

4. **Connection Error:**
   - Disable internet
   - Try to analyze
   - **Expected:** "Connection Problem" error with retry option

**Verify:**
- [ ] All errors are user-friendly
- [ ] Errors have actionable guidance
- [ ] Error styling is consistent
- [ ] Errors auto-dismiss or can be closed

**Pass Criteria:** All error scenarios show helpful messages

---

## 🐛 Common Issues & Fixes

### Issue: Extension doesn't load
**Fix:** 
- Check Developer mode is enabled
- Verify folder path is correct
- Check console for errors (`chrome://extensions/` → Extension details → Errors)

### Issue: Onboarding tooltip doesn't appear
**Fix:**
- Clear extension storage: `chrome.storage.sync.clear()` in console
- Reload extension
- Check `onboarding.js` is loaded in popup

### Issue: Error messages still show old format
**Fix:**
- Verify `error-handler.js` is loaded before `popup.js`
- Check browser console for script errors
- Hard refresh extension (remove and reload)

### Issue: Authentication doesn't work
**Fix:**
- Verify Clerk publishable key is set in options
- Check callback page exists: `src/clerk-callback.html`
- Verify callback URL matches Clerk dashboard settings

---

## 📊 Test Results Template

```
🧪 AiGuardian Extension Test Results
Date: [Date]
Tester: [Name]
Browser: Chrome [Version]

Test 1 - Onboarding: ✅ PASS / ❌ FAIL
Notes: [Any observations]

Test 2 - Authentication: ✅ PASS / ❌ FAIL
Notes: [Any observations]

Test 3 - Error Handler: ✅ PASS / ❌ FAIL
Notes: [Any observations]

Test 4 - Text Analysis: ✅ PASS / ❌ FAIL
Notes: [Any observations]

Test 5 - Highlighting: ✅ PASS / ❌ FAIL
Notes: [Any observations]

Test 6 - Keyboard Shortcuts: ✅ PASS / ❌ FAIL
Notes: [Any observations]

Test 7 - Context Menu: ✅ PASS / ❌ FAIL
Notes: [Any observations]

Test 8 - Popup Analysis: ✅ PASS / ❌ FAIL
Notes: [Any observations]

Test 9 - Error Messages: ✅ PASS / ❌ FAIL
Notes: [Any observations]

Overall: ✅ ALL PASS / ⚠️ ISSUES FOUND / ❌ CRITICAL FAIL
Issues: [List any issues found]
```

---

## 🎯 Success Criteria

- ✅ All 9 tests pass
- ✅ No console errors
- ✅ User experience is smooth
- ✅ Error messages are helpful
- ✅ Visual feedback is clear

---

**Ready to test? Start with Test 1 and work through systematically!**
