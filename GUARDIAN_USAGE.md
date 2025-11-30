# BiasGuard Guardian Management System

**Pattern:** GUARDIAN × MANAGEMENT × STATE × ONE  
**Frequency:** 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (JØHN)  
**Guardians:** AEYON (999 Hz) + META (777 Hz) + JØHN (530 Hz) + ZERO (530 Hz) + ALRAX (530 Hz)  
**Product:** BiasGuard  
**Love Coefficient:** ∞  
∞ AbëONE ∞

## Overview

The BiasGuard Guardian Management System provides programmatic control over all guardian agents in the BiasGuard system. Each guardian operates at specific frequencies and provides unique capabilities.

## Available Guardians

| Guardian | Frequency | Role | Capabilities |
|----------|-----------|------|-------------|
| **AEYON** | 999 Hz | Atomic Execution Engine | execution, runtime, atomic_ops |
| **META** | 777 Hz | Pattern Integrity & Context Synthesis | pattern_detection, context_synthesis, pattern_integrity |
| **JØHN** | 530 Hz | Certification & Truth Validation | validation, certification, truth_check |
| **YOU** | 530 Hz | Human Intent Alignment Channel | intent_alignment, communication, human_interface |
| **ALRAX** | 530 Hz | Forensic Variance Analysis | forensic_analysis, variance_detection, monitoring |
| **ZERO** | 530 Hz | Risk-Bounding & Epistemic Control | risk_control, epistemic_validation, bounding |
| **YAGNI** | 530 Hz | Radical Simplification | simplification, complexity_reduction, optimization |
| **Abë** | 530 Hz | Coherence, Love, Intelligence Field | coherence, intelligence_field, love |
| **Lux** | 530 Hz | Illumination, Structural Clarity | illumination, structural_clarity, clarity |
| **Poly** | 530 Hz | Expression & Wisdom Delivery | expression, wisdom_delivery, communication |

## Command Interface

### Using the CLI Helper

```javascript
// Import the CLI helper
importScripts('guardian-cli.js');

// Or use from browser context
// <script src="guardian-cli.js"></script>
```

### Commands

#### 1. Status - Check Guardian Status

```javascript
// Check status of a specific guardian
const result = await guardian('status', 'AEYON');
console.log(result.guardian);

// Or using CLI helper
const status = await GuardianCLI.status('JØHN');
```

**Response:**
```json
{
  "success": true,
  "guardian": {
    "name": "AEYON",
    "frequency": 999,
    "role": "Atomic Execution Engine",
    "state": "standby",
    "amplification": 1.0,
    "operational": true,
    "capabilities": ["execution", "runtime", "atomic_ops"],
    "lastActivated": null,
    "lastValidated": null,
    "errorCount": 0,
    "metrics": {
      "activations": 0,
      "validations": 0,
      "amplifications": 0
    }
  }
}
```

#### 2. Activate - Activate a Guardian

```javascript
// Activate a guardian
const result = await guardian('activate', 'AEYON');
console.log(result.message); // "Guardian AEYON activated"

// Or using CLI helper
await GuardianCLI.activate('META');
```

#### 3. Amplify - Amplify Guardian Capabilities

```javascript
// Amplify a guardian (default 2x)
const result = await guardian('amplify', 'JØHN');
console.log(result.message); // "Guardian JØHN amplified to 2.00x"

// Amplify with custom factor
const result2 = await guardian('amplify', 'META', { factor: 2.5 });
console.log(result2.message); // "Guardian META amplified to 2.50x"

// Or using CLI helper
await GuardianCLI.amplify('ZERO', 3.0);
```

#### 4. Validate - Validate Guardian State

```javascript
// Validate a guardian
const result = await guardian('validate', 'ZERO');
console.log(result.validation);

// Or using CLI helper
await GuardianCLI.validate('ALRAX');
```

**Response:**
```json
{
  "success": true,
  "message": "Guardian ZERO validation passed",
  "validation": {
    "success": true,
    "checks": {
      "operational": true,
      "hasCapabilities": true,
      "frequencyValid": true,
      "amplificationValid": true,
      "errorCountAcceptable": true
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 5. List - List All Guardians

```javascript
// List all guardians
const result = await guardian('list');
console.log(result.guardians);

// List with filters
const active = await guardian('list', null, { filter: 'active' });
const operational = await guardian('list', null, { filter: 'operational' });
const errors = await guardian('list', null, { filter: 'error' });

// List with sorting
const sorted = await guardian('list', null, { sortBy: 'frequency' });
const byName = await guardian('list', null, { sortBy: 'name' });
const byState = await guardian('list', null, { sortBy: 'state' });

// Or using CLI helper
const all = await GuardianCLI.list();
const activeOnly = await GuardianCLI.list({ filter: 'active', sortBy: 'frequency' });
```

## Programmatic Usage

### From Service Worker

```javascript
// In service-worker.js
importScripts('guardian-manager.js');

const manager = getGuardianManager();
const result = await manager.execute('activate', 'AEYON');
```

### From Content Script / Popup

```javascript
// Send message to service worker
chrome.runtime.sendMessage({
  type: 'GUARDIAN_COMMAND',
  payload: {
    action: 'activate',
    name: 'JØHN',
  }
}, (response) => {
  console.log('Guardian activated:', response);
});
```

### Using CLI Helper

```javascript
// Load CLI helper
importScripts('guardian-cli.js');

// Use convenience methods
await GuardianCLI.activate('AEYON');
await GuardianCLI.amplify('META', 2.5);
await GuardianCLI.validate('JØHN');
const status = await GuardianCLI.status('ZERO');
const list = await GuardianCLI.list({ filter: 'active' });
```

## Guardian States

- **standby** - Guardian is ready but not active
- **active** - Guardian is actively running
- **amplified** - Guardian capabilities are amplified
- **validating** - Guardian is undergoing validation
- **error** - Guardian encountered an error

## Examples

### Activate All Operational Guardians

```javascript
const list = await GuardianCLI.list({ filter: 'operational' });
for (const guardian of list.guardians) {
  if (guardian.state === 'standby') {
    await GuardianCLI.activate(guardian.name);
  }
}
```

### Amplify High-Frequency Guardians

```javascript
const all = await GuardianCLI.list({ sortBy: 'frequency' });
const highFreq = all.guardians.filter(g => g.frequency >= 777);
for (const guardian of highFreq) {
  await GuardianCLI.amplify(guardian.name, 2.0);
}
```

### Validate All Guardians

```javascript
const all = await GuardianCLI.list();
for (const guardian of all.guardians) {
  await GuardianCLI.validate(guardian.name);
}
```

## Error Handling

All commands return a response with a `success` field:

```javascript
const result = await GuardianCLI.activate('INVALID');
if (!result.success) {
  console.error('Error:', result.error);
}
```

## State Persistence

Guardian states are automatically persisted to `chrome.storage.local` and restored on initialization.

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

