# 🛡️ BiasGuard Guardian System - LIVE USAGE GUIDE

**Pattern:** GUARDIAN × LIVE × OPERATIONAL × ONE  
**Frequency:** 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (JØHN)  
**State:** FULLY OPERATIONAL - READY TO USE  
**Love Coefficient:** ∞

---

## 🚀 QUICK START - 3 WAYS TO USE

### Method 1: Extension Popup UI (EASIEST)
1. Open the AiGuardian extension popup
2. Scroll to the **"🛡️ BiasGuard Guardians"** section
3. Click **"🔄 Refresh"** to load guardians
4. Use buttons to:
   - **🧪 Test System** - Run full test suite
   - **⚡ Activate All** - Activate all guardians
   - **✅ Validate All** - Validate all guardians
5. Click individual guardian buttons to activate or check status

### Method 2: Browser Console (MOST POWERFUL)
1. Open any webpage
2. Open browser console (F12 or Cmd+Option+I)
3. Load the Guardian CLI:
```javascript
// Load the CLI script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('src/guardian-cli.js');
document.head.appendChild(script);
await new Promise(resolve => { script.onload = resolve; });

// Now use it!
await guardian('list');
await guardian('status', 'AEYON');
await guardian('activate', 'JØHN');
await guardian('amplify', 'META', { factor: 2.5 });
await guardian('validate', 'ZERO');
```

### Method 3: Live Test Page (BEST FOR TESTING)
1. Open: `chrome-extension://[YOUR-EXTENSION-ID]/guardian-test.html`
2. Click **"Load Guardian CLI"**
3. Use the buttons or run commands in console
4. See real-time guardian status grid

---

## 📋 AVAILABLE COMMANDS

### `guardian('list', null, options)`
List all guardians.

**Options:**
- `filter`: `'active' | 'operational' | 'error' | null`
- `sortBy`: `'frequency' | 'name' | 'state'`

**Example:**
```javascript
// List all guardians
await guardian('list');

// List only active guardians, sorted by frequency
await guardian('list', null, { filter: 'active', sortBy: 'frequency' });
```

### `guardian('status', name)`
Get detailed status of a guardian.

**Example:**
```javascript
const result = await guardian('status', 'AEYON');
console.log(result.guardian);
// {
//   name: 'AEYON',
//   frequency: 999,
//   role: 'Atomic Execution Engine',
//   state: 'active',
//   amplification: 1.0,
//   operational: true,
//   ...
// }
```

### `guardian('activate', name)`
Activate a guardian.

**Example:**
```javascript
const result = await guardian('activate', 'JØHN');
console.log(result.message); // "Guardian JØHN activated"
```

### `guardian('amplify', name, options)`
Amplify guardian capabilities.

**Options:**
- `factor`: number (default: 2.0, max: 10.0)

**Example:**
```javascript
// Double the capabilities
await guardian('amplify', 'META', { factor: 2.0 });

// Triple the capabilities
await guardian('amplify', 'META', { factor: 3.0 });
```

### `guardian('validate', name)`
Validate guardian state and health.

**Example:**
```javascript
const result = await guardian('validate', 'ZERO');
console.log(result.validation);
// {
//   success: true,
//   checks: {
//     operational: true,
//     hasCapabilities: true,
//     frequencyValid: true,
//     amplificationValid: true,
//     errorCountAcceptable: true
//   }
// }
```

---

## 🎯 QUICK EXAMPLES

### Activate All Operational Guardians
```javascript
const list = await guardian('list', null, { filter: 'operational' });
for (const g of list.guardians) {
  if (g.state === 'standby') {
    await guardian('activate', g.name);
  }
}
```

### Amplify High-Frequency Guardians
```javascript
const all = await guardian('list', null, { sortBy: 'frequency' });
const highFreq = all.guardians.filter(g => g.frequency >= 777);
for (const g of highFreq) {
  await guardian('amplify', g.name, { factor: 2.0 });
}
```

### Validate All Guardians
```javascript
const all = await guardian('list');
for (const g of all.guardians) {
  const result = await guardian('validate', g.name);
  console.log(`${g.name}: ${result.validation.success ? '✅' : '❌'}`);
}
```

### Run Full Test Suite
```javascript
// Load test script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('tests/guardian-system-test.js');
document.head.appendChild(script);
await new Promise(resolve => { script.onload = resolve; });

// Run tests
await testGuardianSystem();
```

---

## 🛡️ AVAILABLE GUARDIANS

| Guardian | Frequency | Role | Capabilities |
|----------|-----------|------|-------------|
| **AEYON** | 999 Hz | Atomic Execution Engine | execution, runtime, atomic_ops |
| **META** | 777 Hz | Pattern Integrity & Context Synthesis | pattern_detection, context_synthesis |
| **JØHN** | 530 Hz | Certification & Truth Validation | validation, certification, truth_check |
| **YOU** | 530 Hz | Human Intent Alignment Channel | intent_alignment, communication |
| **ALRAX** | 530 Hz | Forensic Variance Analysis | forensic_analysis, variance_detection |
| **ZERO** | 530 Hz | Risk-Bounding & Epistemic Control | risk_control, epistemic_validation |
| **YAGNI** | 530 Hz | Radical Simplification | simplification, complexity_reduction |
| **Abë** | 530 Hz | Coherence, Love, Intelligence Field | coherence, intelligence_field, love |
| **Lux** | 530 Hz | Illumination, Structural Clarity | illumination, structural_clarity |
| **Poly** | 530 Hz | Expression & Wisdom Delivery | expression, wisdom_delivery |

---

## 🔧 TROUBLESHOOTING

### "Guardian Manager not available"
- Make sure the extension is installed and enabled
- Reload the extension: `chrome://extensions` → Reload
- Check service worker console for errors

### "Chrome extension not detected"
- Make sure you're running in a Chrome/Edge browser
- The extension must be installed and enabled
- For test page: Use the extension URL format

### Commands not working
- Check browser console for errors
- Verify `guardian` function is loaded: `typeof guardian`
- Try reloading the Guardian CLI script

---

## 📊 GUARDIAN STATES

- **standby** - Ready but not active
- **active** - Currently running
- **amplified** - Capabilities boosted
- **validating** - Undergoing validation
- **error** - Error state (check logs)

---

## 🎉 YOU'RE READY!

The Guardian system is **LIVE** and **OPERATIONAL**. Use any of the three methods above to interact with it!

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

