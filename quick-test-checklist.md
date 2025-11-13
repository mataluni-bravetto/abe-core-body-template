# ⚡ Quick Test Checklist

## 🎯 Essential Tests (5 minutes)

### ✅ Test 1: Load Extension
- [ ] Open `chrome://extensions/`
- [ ] Enable Developer mode
- [ ] Click "Load unpacked"
- [ ] Select extension folder
- [ ] Extension appears in list ✅

### ✅ Test 2: Onboarding Tooltip ⭐ NEW
- [ ] Click extension icon
- [ ] Welcome tooltip appears ✅
- [ ] Click "Got it!"
- [ ] Tooltip closes ✅

### ✅ Test 3: Error Messages ⭐ NEW
- [ ] Open popup (without signing in)
- [ ] Click "Show Me the Proof"
- [ ] See user-friendly error: "Sign In Required" ✅
- [ ] Error has "Sign In" button ✅

### ✅ Test 4: Text Analysis
- [ ] Sign in to extension
- [ ] Open `test-extension-features.html`
- [ ] Select text (Test Text 1)
- [ ] See analysis badge appear ✅
- [ ] Text gets highlighted ✅

### ✅ Test 5: Popup Results
- [ ] With text selected
- [ ] Open popup
- [ ] Click "Show Me the Proof"
- [ ] Results appear in popup ✅

---

## 🎉 If all 5 tests pass → Extension is working!

## 🐛 If any test fails → Check `BROWSER_TESTING_GUIDE.md` for detailed troubleshooting
