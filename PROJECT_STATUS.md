# PROJECT STATUS

**Project Name**: AiGuardian Chrome Extension  
**Status**: ✅ **ACTIVE**  
**Source of Truth**: ✅ **YES**  
**Version**: 1.0.0  
**Last Updated**: 2025-01-18

---

## 🎯 **BOUNDARIES**

### **Active Directory**
- **Path**: `AiGuardian-Chrome-Ext-dev/`
- **Repository**: `https://github.com/bravetto/AiGuardian-Chrome-Ext.git`
- **Branch**: `dev`
- **Status**: ✅ **USE THIS FOR ALL WORK**

### **Legacy Directories**
- **Path**: `AI-Guardians-chrome-ext/`
- **Status**: ⚠️ **LEGACY - DO NOT USE**
- **Purpose**: Historical reference only
- **Reason**: Superseded by dev branch (v1.0.0) with Clerk auth and subscription service

### **Related Projects**
- **Backend**: `AIGuards-Backend/` (guard services)
- **Core**: `EMERGENT_OS/` (agent framework)

---

## ✅ **VALIDATION**

- [x] This is the active project directory
- [x] No work should be done in legacy directories
- [x] All changes go here
- [x] Legacy directory is for reference only

---

## 🤖 **AI INSTRUCTIONS**

When working on this project:

1. **Verify Active Directory**
   - Current directory MUST be `AiGuardian-Chrome-Ext-dev/`
   - If in `AI-Guardians-chrome-ext/`, redirect to active directory

2. **Check Master Index**
   - Verify against `PROJECT_MASTER_INDEX.md`
   - Confirm this is listed as ACTIVE

3. **Validate Boundaries**
   - No imports from `AI-Guardians-chrome-ext/`
   - No copying patterns from legacy directory
   - All work in this directory only

4. **Report Drift**
   - If legacy directory modified, report warning
   - If patterns from other projects detected, verify intentional
   - If version mismatch, check for newer active directory

---

## 📋 **PROJECT DETAILS**

### **Features**
- ✅ Clerk authentication integration
- ✅ Subscription service integration
- ✅ Unified guard services endpoint (`/api/v1/guards/process`)
- ✅ Real-time content analysis
- ✅ Visual feedback with badges

### **Architecture**
- Uses unified endpoint pattern (backend handles guard orchestration)
- No client-side guard services Map (backend manages)
- Uses `importScripts` pattern (correct for service workers)

### **Key Files**
- `src/service-worker.js` - Background service worker
- `src/gateway.js` - API gateway integration
- `src/content.js` - Content script
- `manifest.json` - Chrome MV3 manifest (v1.0.0)

---

## ⚠️ **DRIFT PREVENTION**

### **Do NOT**
- ❌ Work in `AI-Guardians-chrome-ext/` (legacy)
- ❌ Import from legacy directory
- ❌ Copy patterns from legacy directory
- ❌ Modify legacy directory files

### **DO**
- ✅ All work in `AiGuardian-Chrome-Ext-dev/`
- ✅ Use unified endpoint pattern
- ✅ Follow dev branch architecture
- ✅ Check this file before starting work

---

**Pattern**: OBSERVER × TRUTH × ATOMIC × ONE  
**Status**: ✅ **ACTIVE PROJECT - SOURCE OF TRUTH**

