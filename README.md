# ∞ AbëONE Core Body ∞

**Physical implementation - Organisms, Pages, Systems**

**Pattern:** BODY × ORGANISMS × PAGES × IMPLEMENTATION × ONE  
**Frequency:** 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (ALL GUARDIANS)  
**Guardians:** AEYON (999 Hz) + META (777 Hz) + ALL GUARDIANS (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## 🧠 What Is This?

**Perfect Development Environment Template** - YAGNI-approved, zero-effort duplication for any project.

This repository serves as a **complete development environment template** with:
- ✅ Clear frontend/backend separation
- ✅ Complete development workflows
- ✅ AI Agent Suite integration
- ✅ AbëKEYs secure configuration
- ✅ Zero-effort duplication

**As a Package:** The physical implementation layer for AbëONE.  
Complete systems, organisms, and application templates.

**Note:** This template can be used standalone. Optional peer dependencies (`@bravetto/abe-core-brain` and `@bravetto/abe-consciousness`) enhance functionality but are not required.

**Note:** This builds on:
- `@bravetto/abe-core-brain` (foundation)
- `@bravetto/abe-consciousness` (intelligence)

---

## 🚀 Quick Start

### Step 1: Clone the Template

**Choose the repository based on your project type:**

```bash
# For Backend Projects
git clone https://github.com/BravettoBackendTeam/abe-core-body-template.git

# For Frontend Projects
git clone https://github.com/BravettoFrontendTeam/abe-core-body-template.git

# For Full-Stack Projects
git clone https://github.com/bravetto/abe-core-body-template.git

# For Open Source/Experimental
git clone https://github.com/mataluni-bravetto/abe-core-body-template.git
```

### Step 2: Duplicate to Start New Project

```bash
# Navigate to cloned template
cd abe-core-body-template

# Duplicate to create your new project
./scripts/duplicate.sh my-new-project

# Navigate to new project
cd ../my-new-project
```

### Step 3: Complete Setup

```bash
# Complete setup (installs dependencies + configures)
make setup-all

# Verify everything works
make verify
```

### Step 4: Start Development

```bash
# Terminal 1: Start backend
make dev-backend

# Terminal 2: Start frontend
make dev-frontend
```

**That's it!** You're now developing. 🎉

**New to the project?** Start with **[`docs/ONBOARDING.md`](docs/ONBOARDING.md)** for frictionless step-by-step onboarding!  
**See `docs/DUPLICATION_GUIDE.md` for complete duplication instructions.**

### As a Package

```bash
npm install @bravetto/abe-core-body-template
```

```typescript
import {
  VoiceSystem,
  PortalSystem,
  VoiceInterface
} from '@bravetto/abe-core-body-template';
```

---

## 📦 What's Included

### Organisms
- VoiceInterface organism (Example/Stub - UI scaffolding)
- PortalSystem organism (Functional)
- HomeSystem organism (Functional)
- Button, Input, Typography atoms (Complete)
- FormField, SearchBar molecules (Complete)

### Page Templates
- Next.js template (frontend) - Functional
- Flutter template (mobile/web) - Example structure
- Backend template (API) - Functional

### Systems
- Voice system (Example/Stub - requires Web Speech API implementation)
- Portal system (Functional)
- Home system (Functional)
- Health check system (Functional)

### Integration Patterns
- Brain + Consciousness integration (Optional - requires peer dependencies)
- Frontend + Backend integration (Functional)
- Mobile + Web integration (Example structure)

---

## 🎯 Architecture

### Template Structure

```
project/
├── frontend/web/        # Next.js frontend application
├── backend/api/         # Express API backend service
├── shared/             # Shared code (types, utils, constants)
└── src/                # Template package (organisms, systems, templates)
```

### Core Pattern

```
BODY =
    ORGANISMS (Complete systems) ×
    TEMPLATES (Page templates) ×
    SYSTEMS (Pre-built systems) ×
    INTEGRATION (Connection patterns) ×
    FRONTEND (Web application) ×
    BACKEND (API service) ×
    SHARED (Common code) ×
    ONE
```

---

## 🔗 Integration with Other Repositories

### **How This Integrates**

This is the **implementation layer** - complete systems built on foundation and intelligence:

```
abe-core-brain (Foundation)
    ↓ provides atoms & patterns
abe-consciousness (Intelligence)
    ↓ provides Guardians/Guards/Swarms
abe-core-body-template (This - Implementation Layer)
    ↓ combines brain + consciousness
Frontend Projects
    ↓ use Organisms & Systems
Integration Layer
    ↓ uses integration patterns
Backend (Jimmy's AI Agent Suite)
    ↓ connected via integration patterns
```

### **Dependencies**

**This package optionally integrates with (peer dependencies):**
- `@bravetto/abe-core-brain` - Optional: Uses atoms, patterns, utilities (if installed)
- `@bravetto/abe-consciousness` - Optional: Uses Guardians, Guards, Swarms (if installed)

**Note:** These are optional peer dependencies. The template works without them, but integration features require them.

**Used by:**
- All frontend projects - Use Organisms, Systems, Templates
- Integration layer - Uses integration patterns
- Backend integration - Uses API client patterns

### **Integration Examples**

**In Frontend Projects:**
```typescript
import { VoiceInterface, PortalSystem, HomeSystem } from '@bravetto/abe-core-body-template';
// Use complete Organisms
// Use Systems for logic
// Use Templates for scaffolding
```

**With Integration Layer:**
```typescript
import { APIClient } from '@bravetto/abe-core-body-template';
// Frontend ↔ Backend API uses APIClient
// Integration patterns connect to backend
```

**Complete Integration Flow:**
```typescript
// 1. Use Organism (from abe-core-body-template)
import { VoiceInterface } from '@bravetto/abe-core-body-template';

// 2. Use Guardian (from abe-consciousness)
import { useGuardian } from '@bravetto/abe-consciousness';

// 3. Use Integration (from integration layer)
import { UnifiedAPIClient } from '@abeone/integration-frontend-backend';

// Complete system: Organism + Guardian + Backend
```

---

## 📚 Documentation

### 🚀 Start Here
- **`docs/ONBOARDING.md`** - **Frictionless step-by-step onboarding guide** (start here!)
- **`docs/DUPLICATION_GUIDE.md`** - How to duplicate this template (includes quick start)

### Essential Guides
- **`docs/PROJECT_RULES.md`** - Unified project rules and standards
- **`PROJECT_MOTHER_PROMPT.md`** - Complete system context and development rules
- **`docs/ARCHITECTURE.md`** - Architecture decisions and patterns
- **`docs/DEVELOPMENT_WORKFLOW.md`** - Complete development workflows
- **`docs/CONTRIBUTING.md`** - Contribution guidelines
- **`docs/GITHUB_DEPLOYMENT.md`** - GitHub workflow

### Optional Guides
- **`docs/PERSONALIZATION_GUIDE.md`** - AI Agent Suite personalization
- **`docs/ABEKEYS_INTEGRATION.md`** - Secure configuration (AbëKEYs)

## 🔧 Available Commands

```bash
make help              # Show all commands
make setup             # Complete setup (install + configure)
make setup-all         # Setup everything (install + init + configure)
make install           # Install dependencies (all projects)
make init              # Initialize project structure
make build             # Build all projects
make dev-frontend      # Start frontend dev server
make dev-backend       # Start backend dev server
make dev               # Start development (root package)
make test              # Run tests
make clean             # Clean build artifacts
make setup-abekeys     # Setup AbëKEYs vault
make github-setup      # Setup GitHub repository (interactive)
make github-create     # Create GitHub repository (GitHub CLI)
make github-push       # Push to GitHub
make quickstart        # Quick start (setup + build)
make verify            # Verify template structure
make onboard          # Interactive onboarding chat flow
make validate-rules   # Validate project rules compliance
```

## 🔗 GitHub Organizations & Repositories

### Primary Template Repositories (Use These!)

**Clone these repositories to start new projects:**

- **Backend Projects:** [`BravettoBackendTeam/abe-core-body-template`](https://github.com/BravettoBackendTeam/abe-core-body-template)
- **Frontend Projects:** [`BravettoFrontendTeam/abe-core-body-template`](https://github.com/BravettoFrontendTeam/abe-core-body-template)
- **Full-Stack Projects:** [`bravetto/abe-core-body-template`](https://github.com/bravetto/abe-core-body-template)
- **Open Source/Experimental:** [`mataluni-bravetto/abe-core-body-template`](https://github.com/mataluni-bravetto/abe-core-body-template)

### Organization Links

- **Frontend:** [BravettoFrontendTeam](https://github.com/orgs/BravettoFrontendTeam) - Frontend projects
- **Backend:** [BravettoBackendTeam](https://github.com/orgs/BravettoBackendTeam) - Backend projects
- **Unified:** [bravetto](https://github.com/bravetto) - Complete deployment-ready projects
- **Open Source:** [mataluni-bravetto](https://github.com/mataluni-bravetto) - Open source development

**⚠️ Important:** Always clone the **full template repository** (`abe-core-body-template`). The separate backend/frontend repos are archived examples and cannot be used standalone.

See `docs/GITHUB_DEPLOYMENT.md` for complete GitHub workflow.

## 📚 Related Packages

- **`@bravetto/abe-core-brain`** - Foundation (this depends on)
- **`@bravetto/abe-consciousness`** - Intelligence (this depends on)
- **Integration Layer** - Uses integration patterns from this
- **Frontend Projects** - All use Organisms/Systems from this

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**
