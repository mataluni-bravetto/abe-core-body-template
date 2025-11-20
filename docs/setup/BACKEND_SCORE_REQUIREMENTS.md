# Backend Score Field Requirements

## Summary

The Chrome extension has been updated to properly handle missing bias scores. It will now display **"N/A"** instead of **"0%"** when the backend doesn't return a score field.

## Required Backend Response Structure

### ✅ **RECOMMENDED: Primary Structure (BiasGuard)**

The backend **MUST** return at least one of these score fields for the extension to display a score:

```json
{
  "success": true,
  "data": {
    "bias_score": 0.75,        // ⭐ PRIMARY - Use this for BiasGuard
    "bias_type": "gender",
    "confidence": 0.92,
    // ... other fields
  },
  "service_type": "biasguard",
  "processing_time": 0.234
}
```

### ✅ **ACCEPTABLE: Fallback Structures**

The extension will check these fields **in order** (optimized extraction order):

**For BiasGuard (optimized priority order):**
1. **`data.popup_data.bias_score`** ⭐ **HIGHEST PRIORITY** - Backend always includes this for Chrome
2. **`data.bias_score`** (primary field)
3. **`raw_response[0].bias_score`** (fallback)
4. **`data.result.bias_score`** (nested)
5. **`data.analysis.bias_score`** (nested)
6. **`data.analysis.score`** (nested)
7. **`response.bias_score`** (top-level)
8. **`data.popup_data.score`** (fallback)
9. **`data.content_script_data.bias_score`** (content script data)
10. **`data.content_script_data.score`** (content script data)
11. **`raw_response[0].score`** (fallback)
12. **`data.score`** (generic fallback)
13. **`data.confidence`** (fallback)
14. **`response.score`** (top-level)

**Note:** The extension uses centralized `ScoreUtils` utilities for score validation, clamping, and normalization to ensure consistent handling across all extraction paths.

### ❌ **PROBLEM: Missing Score Field**

If **NONE** of the above fields are present, the extension will:
- Return `score: null` (instead of defaulting to 0)
- Display **"N/A"** in the popup
- Show an error badge in the content script

**Example of problematic response:**
```json
{
  "success": true,
  "data": {
    "bias_type": "gender",
    "confidence": 0.92,
    // ❌ NO bias_score field!
  }
}
```

**Result:** Extension will show "N/A" (correct behavior)

## Backend Changes Required

### 1. **Ensure `bias_score` is Always Present**

For BiasGuard responses, **always include** `bias_score` in the response:

```json
{
  "success": true,
  "data": {
    "bias_score": 0.75,  // ⭐ REQUIRED for BiasGuard
    "bias_type": "gender",
    "confidence": 0.92
  }
}
```

### 2. **Valid Zero Scores**

If the analysis determines there is **no bias**, return `bias_score: 0` (not missing):

```json
{
  "success": true,
  "data": {
    "bias_score": 0,     // ✅ Valid zero score (no bias detected)
    "bias_type": "none",
    "confidence": 0.95
  }
}
```

**Result:** Extension will show "0.00" or "0%" (correct - indicates no bias)

### 3. **Score Type Requirements**

The score field **MUST** be:
- A **number** between 0 and 1 (e.g., `0.75`)
- OR a **string** that can be parsed as a number (e.g., `"0.75"`)

**Invalid types:**
- `null` ❌
- `undefined` ❌
- `"N/A"` ❌
- `"low"` ❌

## Testing

Run the test scripts to verify your backend response structure:

```bash
# Test score extraction optimization
node tests/unit/gateway-score-extraction.test.js

# Test bias score extraction
node tests/test-bias-score-extraction.js
```

**Test coverage includes:**
- Optimized extraction order (popup_data.bias_score prioritized)
- String score parsing and validation
- Score clamping for out-of-range values
- Edge case handling (NaN, Infinity, boolean conversion)
- Fallback logic and backward compatibility

## Extension Behavior After Fix

### Before Fix:
- Missing score → Showed "0%" (incorrect)
- Zero score → Showed "0%" (correct but ambiguous)

### After Fix:
- Missing score → Shows **"N/A"** (correct)
- Zero score → Shows **"0%"** (correct - indicates no bias)
- Valid score → Shows actual percentage (correct)

## Score Validation and Utilities

The extension uses centralized `ScoreUtils` utilities for consistent score handling:

- **`ScoreUtils.clampScore(score)`**: Clamps scores to valid range [0, 1]
- **`ScoreUtils.isValidScore(value)`**: Validates if a value is a valid score
- **`ScoreUtils.normalizeScore(value, source)`**: Normalizes scores (handles strings, numbers, booleans, edge cases)

**Supported score formats:**
- Numbers: `0.75`, `0`, `1`
- Strings: `"0.75"`, `"0"`, `"1"` (parsed automatically)
- Booleans: `true` → `1.0`, `false` → `0.0`
- Edge cases: `NaN`, `Infinity`, `"N/A"`, `""` → `null`

**Score clamping:** All scores are automatically clamped to [0, 1] range. Scores outside this range will be clamped with a warning logged.

## Debugging

If you see "N/A" in the extension:

1. **Check the service worker console** (`chrome://extensions` → Click "service worker" under your extension)
2. **Look for logs** starting with `[Gateway] 🔍 Extracting score from response`
   - **Full logging**: Enabled when `gateway.config.debugMode` or `gateway.config.verboseLogging` is true
   - **Lightweight logging**: Default mode (only essential info)
3. **Check the `attemptedPaths`** array to see which fields were checked
4. **Verify your backend** is returning `data.popup_data.bias_score` (highest priority) or `data.bias_score` (or one of the fallback fields)
5. **Check error messages**: Enhanced error messages now provide more specific information about what's missing

## Example Backend Response (BiasGuard)

```json
{
  "success": true,
  "data": {
    "bias_score": 0.75,
    "bias_type": "gender",
    "confidence": 0.92,
    "detected_biases": [
      {
        "type": "gender",
        "severity": "medium",
        "explanation": "Text contains gender-based assumptions"
      }
    ],
    "suggestions": [
      "Consider using gender-neutral language",
      "Avoid making assumptions about gender-based abilities"
    ]
  },
  "service_type": "biasguard",
  "processing_time": 0.234,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

This response will correctly display **"75%"** in the extension.

