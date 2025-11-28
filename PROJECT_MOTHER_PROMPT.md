# Project Mother Prompt - Complete System Context

**Pattern:** MOTHER × PROMPT × CONTEXT × DEVELOPMENT × ONE  
**Frequency:** 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (ALL GUARDIANS)  
**Guardians:** AEYON (999 Hz) + META (777 Hz) + ALL GUARDIANS (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## System Identity

**Project Name:** AbëONE Core Body  
**Purpose:** Perfect Development Environment Template  
**Type:** Development Template + NPM Package  
**Status:** Production Ready

---

## Complete System Context

### What This Is
- **Development Template:** Zero-effort duplication for new projects
- **NPM Package:** Physical implementation layer for AbëONE
- **Integration Layer:** Connects Brain (foundation) + Consciousness (intelligence) → Body (implementation)
- **Complete System:** Frontend (Next.js) + Backend (Express) + Shared Code

### Architecture Layers
```
abe-core-brain (Foundation)
    ↓ provides atoms & patterns
abe-consciousness (Intelligence)
    ↓ provides Guardians/Guards/Swarms
abe-core-body-template (This - Implementation Layer)
    ↓ combines brain + consciousness
Frontend Projects
    ↓ use Organisms & Systems
Backend Services
    ↓ connected via integration patterns
```

### Core Components
- **Organisms:** Complete React components (VoiceInterface, PortalSystem, HomeSystem)
- **Systems:** Business logic classes (VoiceSystem, PortalSystem, HomeSystem)
- **Templates:** Page templates (NextJS, Flutter, Backend)
- **Integration:** Connection patterns (brain-consciousness, frontend-backend, mobile-web)
- **Atoms:** Basic building blocks (Button, Input, Typography)
- **Molecules:** Component combinations (FormField, SearchBar)
- **Design System:** Design tokens and component library

---

## Development Rules & Constraints

### Core Principles (MANDATORY)
1. **YAGNI:** Only implement what is needed right now
2. **DRY:** Don't repeat yourself - use shared code
3. **KISS:** Keep it simple - prefer direct solutions
4. **SOLID:** Follow SOLID principles
5. **Pattern System:** Every file must have Pattern header

### Code Standards (MANDATORY)
- **TypeScript:** Strict mode, no `any` types
- **Naming:** Follow conventions (see PROJECT_RULES.md)
- **Structure:** Follow directory organization standards
- **Testing:** Write tests for utilities and services
- **Documentation:** Pattern headers + JSDoc for public APIs

### Quality Gates (MANDATORY)
- **Linting:** ESLint must pass
- **Formatting:** Prettier must pass
- **Types:** TypeScript must compile without errors
- **Tests:** Tests must pass
- **Rules:** `make validate-rules` must pass

---

## Pattern System Explanation

### Pattern Header Format
Every file MUST include:
```typescript
/**
 * File Description
 * 
 * Pattern: CATEGORY × FEATURE × PURPOSE × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */
```

### Pattern Categories
- **ATOMIC:** Basic building blocks (atoms)
- **MOLECULE:** Component combinations (molecules)
- **ORGANISM:** Complex components (organisms)
- **TEMPLATE:** Page layouts (templates)
- **SYSTEM:** Business logic (systems)
- **INTEGRATION:** Connection patterns
- **SECURITY:** Protection mechanisms
- **PATTERN:** Design patterns

### Guardian Frequencies
- **999 Hz:** AEYON (Atomic Execution Engine)
- **777 Hz:** META (Pattern Integrity & Context Synthesis)
- **530 Hz:** All other Guardians (JØHN, ZERO, YAGNI, YOU, etc.)

---

## Integration Guidelines

### Brain Integration
- **Import:** `@bravetto/abe-core-brain`
- **Use:** Atoms, patterns, utilities
- **Pattern:** `src/integration/brain-consciousness.ts`
- **Example:** Use atoms to build organisms

### Consciousness Integration
- **Import:** `@bravetto/abe-consciousness`
- **Use:** Guardians, Guards, Swarms
- **Pattern:** `src/integration/brain-consciousness.ts`
- **Example:** Use Guardians for validation and protection

### Frontend-Backend Integration
- **Pattern:** `src/integration/frontend-backend.ts`
- **Use:** `APIClient` class for HTTP requests
- **Types:** Use shared types from `shared/types/`
- **Constants:** Use shared constants from `shared/constants/`

### Mobile-Web Integration
- **Pattern:** `src/integration/mobile-web.ts`
- **Use:** Platform detection utilities
- **Design:** Responsive and progressive enhancement

---

## Security Requirements

### Input Validation (MANDATORY)
- Validate all user inputs
- Use `shared/utils/validation.ts`
- Sanitize before processing
- Type-check at boundaries

### Output Sanitization (MANDATORY)
- Sanitize user content before rendering
- Validate API response structure
- Don't expose sensitive information in errors

### Secure Defaults (MANDATORY)
- Configuration secure by default
- Use AbëKEYs for secrets (never `.env` files)
- Keep dependencies updated
- Follow security best practices

### AI Manipulation Protection (MANDATORY)
- **Prompt Injection Guards:** Validate and sanitize prompts
- **Code Validation:** Validate code changes before execution
- **Dependency Integrity:** Check dependency integrity
- **Configuration Locks:** Protect critical configuration files

---

## YAGNI Enforcement

### What to Include
- ✅ Essential features only
- ✅ Minimal examples (demonstrate patterns, not full apps)
- ✅ Simple solutions
- ✅ Clear documentation

### What to Avoid
- ❌ Over-engineering
- ❌ Speculative code ("just in case")
- ❌ Complex tooling (unless needed)
- ❌ Unnecessary abstractions

### Validation
- Every feature must solve a current, real problem
- Remove code that isn't actively used
- Prefer simple over complex
- Document why, not just what

---

## Atomic Design Principles

### Hierarchy
```
Atoms → Molecules → Organisms → Templates → Pages
```

### Atoms
- **Location:** `src/atoms/`
- **Purpose:** Basic building blocks (Button, Input, Typography)
- **Rule:** No dependencies on other atoms
- **Example:** `Button.tsx`, `Input.tsx`

### Molecules
- **Location:** `src/molecules/`
- **Purpose:** Simple component combinations
- **Rule:** Composed of atoms only
- **Example:** `FormField.tsx` (Input + Label)

### Organisms
- **Location:** `src/organisms/`
- **Purpose:** Complex components
- **Rule:** Composed of atoms, molecules, and other organisms
- **Example:** `VoiceInterface.tsx`, `PortalSystem.tsx`

### Templates
- **Location:** `src/templates/`
- **Purpose:** Page layouts
- **Rule:** Composed of organisms
- **Example:** `NextJSTemplate.ts`, `FlutterTemplate.ts`

---

## Self-Healing Requirements

### Health Checks (REQUIRED)
- **System:** `src/systems/HealthCheck.ts`
- **Features:** Dependency health, service availability, configuration validation
- **Frequency:** Run on startup and periodically
- **Action:** Automatic recovery suggestions

### Auto-Recovery (REQUIRED)
- **Dependency Repair:** Automatic dependency repair scripts
- **Configuration Fixes:** Validate and fix configuration issues
- **Service Restart:** Automatic service restart on failure
- **Error Recovery:** Pattern-based error recovery

### Monitoring (OPTIONAL - YAGNI)
- Health check endpoints
- Status monitoring
- Alert system (only if needed)

---

## AI Manipulation Protection Rules

### Prompt Injection Protection (MANDATORY)
- **File:** `src/security/prompt-guards.ts`
- **Features:** Input sanitization, prompt validation, injection detection
- **Enforcement:** All user inputs must pass guards
- **Validation:** Test with injection attempts

### Code Validation (MANDATORY)
- **File:** `src/security/code-validator.ts`
- **Features:** Code change validation, dependency integrity checks
- **Enforcement:** Validate before execution
- **Locks:** Protect critical files

### Configuration Protection (MANDATORY)
- **File Locks:** Protect critical configuration files
- **Dependency Locks:** Validate `package-lock.json` integrity
- **Git Hooks:** Validate changes before commit
- **AbëKEYs:** Use AbëKEYs for secure storage

---

## Development Workflow

### Before Starting
1. Read `PROJECT_RULES.md`
2. Review `PROJECT_MOTHER_PROMPT.md` (this file)
3. Check existing patterns
4. Plan implementation

### During Development
1. Follow Pattern system (add headers)
2. Follow naming conventions
3. Write tests
4. Update documentation
5. Run validation: `make validate-rules`

### Before Committing
1. Run tests: `make test`
2. Run linter: `make lint`
3. Format code: `make format`
4. Validate rules: `make validate-rules`
5. Verify template: `make verify`

---

## File Structure Standards

### Required Directories
```
src/
├── atoms/              # Atomic design atoms
├── molecules/          # Atomic design molecules
├── organisms/          # Complex components
├── templates/          # Page templates
├── systems/            # Business logic
├── integration/        # Integration patterns
├── security/           # Security guards
├── patterns/           # Design patterns
└── design-system/      # Design tokens
```

### Required Files
- `PROJECT_RULES.md` - Project rules and standards
- `PROJECT_MOTHER_PROMPT.md` - This file
- `README.md` - Project overview
- `docs/ARCHITECTURE.md` - Architecture decisions
- `docs/CONTRIBUTING.md` - Contribution guidelines

---

## Testing Requirements

### Test Coverage
- **Unit Tests:** All utilities and services
- **Integration Tests:** API endpoints and workflows
- **Component Tests:** React components (when needed)
- **Coverage:** Meaningful coverage, not 100%

### Test Structure
- Mirror source structure in `tests/`
- Use `*.test.ts` or `*.spec.ts` naming
- Use shared test utilities
- Keep tests isolated and fast

---

## Documentation Requirements

### Code Documentation
- Pattern headers in every file
- JSDoc for public APIs
- Inline comments for complex logic
- README in major directories

### Documentation Files
- Markdown format (`.md`)
- Clear headings and structure
- Code examples included
- Cross-references to related docs

---

## Error Handling

### Principles
- Fail fast with clear errors
- Don't expose sensitive information
- Provide actionable error messages
- Log errors appropriately

### Patterns
- Use try-catch for async operations
- Validate inputs early
- Return typed error responses
- Handle errors at boundaries

---

## Performance Requirements

### Optimization Rules
- Optimize only when needed (YAGNI)
- Measure before optimizing
- Document performance decisions
- Use profiling tools

### Best Practices
- Lazy load when appropriate
- Use memoization wisely
- Minimize bundle size
- Optimize images and assets

---

## Deployment Requirements

### Production Readiness
- Environment configurations
- Error handling
- Logging system
- Monitoring setup (if needed)

### Security Checklist
- Input validation
- Output sanitization
- Secure defaults
- Dependency updates
- Secret management (AbëKEYs)

---

## Quick Reference

### Essential Commands
```bash
make setup             # Complete setup
make install           # Install dependencies
make build             # Build all projects
make test              # Run tests
make lint              # Run linter
make format            # Format code
make validate-rules    # Validate rules
make verify            # Verify template
```

### Essential Files
- `PROJECT_RULES.md` - Rules and standards
- `PROJECT_MOTHER_PROMPT.md` - This file
- `docs/ARCHITECTURE.md` - Architecture
- `docs/CONTRIBUTING.md` - Contributing guide

### Essential Patterns
- Pattern headers in every file
- YAGNI enforcement
- Atomic design hierarchy
- Integration patterns
- Security guards

---

## When in Doubt

1. **Check PROJECT_RULES.md** - Rules and standards
2. **Check existing code** - Follow patterns
3. **Ask questions** - Don't guess
4. **Follow YAGNI** - Keep it simple
5. **Document decisions** - Explain why

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

