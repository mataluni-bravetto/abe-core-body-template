# Project Rules - Unified Standards & Conventions

**Pattern:** RULES × STANDARDS × CONVENTIONS × ONE  
**Frequency:** 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (JØHN)  
**Guardians:** AEYON (999 Hz) + META (777 Hz) + JØHN (530 Hz) + YAGNI (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## Core Principles

### YAGNI (You Ain't Gonna Need It)
- **Rule:** Only implement what is needed right now
- **Enforcement:** Remove speculative code, avoid "just in case" features
- **Validation:** Every feature must solve a current, real problem
- **Exception:** Template scaffolding is acceptable for demonstration

### CHECK-FIRST (Check Before Creating)
- **Rule:** Always check for existing workflows, scripts, tools, or solutions before creating new ones
- **Enforcement:** Search codebase, documentation, and Makefile before implementing
- **Validation:** Verify no duplicate functionality exists
- **Process:** 
  1. Search existing scripts (`scripts/` directory)
  2. Check Makefile targets (`make help`)
  3. Review documentation (`docs/` directory)
  4. Search codebase for similar patterns
  5. Only create if no existing solution found
- **Exception:** None - this rule is mandatory

### DRY (Don't Repeat Yourself)
- **Rule:** Extract common patterns into reusable utilities
- **Enforcement:** Use shared code (`shared/`) for common needs
- **Validation:** No duplicate logic across frontend/backend
- **Exception:** Intentional duplication for template examples is acceptable

### KISS (Keep It Simple, Stupid)
- **Rule:** Prefer simple solutions over complex ones
- **Enforcement:** Choose direct implementation over abstraction
- **Validation:** Code should be readable by junior developers
- **Exception:** Complex patterns are acceptable if well-documented

### SOLID Principles
- **Single Responsibility:** Each module/class has one reason to change
- **Open/Closed:** Open for extension, closed for modification
- **Liskov Substitution:** Subtypes must be substitutable for base types
- **Interface Segregation:** Many specific interfaces > one general interface
- **Dependency Inversion:** Depend on abstractions, not concretions

---

## Pattern System

### Pattern Header Requirement
**Every file MUST include a Pattern header:**

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

### Pattern Components
- **Pattern:** Describes the file's purpose using × notation
- **Frequency:** Guardian frequencies (999 Hz = AEYON, 777 Hz = META, 530 Hz = others)
- **Guardians:** Which guardians oversee this code
- **Love Coefficient:** Always ∞
- **Signature:** Always ends with "∞ AbëONE ∞"

### Pattern Categories
- **ATOMIC:** Basic building blocks (atoms)
- **MOLECULE:** Component combinations (molecules)
- **ORGANISM:** Complex components (organisms)
- **TEMPLATE:** Page layouts (templates)
- **SYSTEM:** Business logic (systems)
- **INTEGRATION:** Connection patterns (integration)
- **SECURITY:** Protection mechanisms (security)
- **PATTERN:** Design patterns (patterns)

---

## Naming Conventions

### Files
- **TypeScript:** `kebab-case.ts` or `PascalCase.tsx` for components
- **React Components:** `PascalCase.tsx` (e.g., `Button.tsx`, `VoiceInterface.tsx`)
- **Utilities:** `kebab-case.ts` (e.g., `api-client.ts`, `validation.ts`)
- **Tests:** `*.test.ts` or `*.spec.ts`
- **Config:** `*.config.js` or `*.config.ts`

### Variables & Functions
- **Variables:** `camelCase` (e.g., `userName`, `apiClient`)
- **Functions:** `camelCase` (e.g., `getUser()`, `validateInput()`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_RETRIES`)
- **Private Members:** Prefix with `_` (e.g., `_privateMethod()`)

### Types & Interfaces
- **Types:** `PascalCase` (e.g., `User`, `ApiResponse`)
- **Interfaces:** `PascalCase` with descriptive names (e.g., `UserProps`, `SystemConfig`)
- **Enums:** `PascalCase` with `UPPER_SNAKE_CASE` values (e.g., `Status.ACTIVE`)

### Classes
- **Classes:** `PascalCase` (e.g., `UserService`, `APIClient`)
- **Methods:** `camelCase` (e.g., `getUser()`, `createUser()`)

---

## File Organization Standards

### Directory Structure
```
project/
├── src/                    # Template package source
│   ├── atoms/              # Atomic design atoms
│   ├── molecules/          # Atomic design molecules
│   ├── organisms/          # Complex components
│   ├── templates/          # Page templates
│   ├── systems/            # Business logic
│   ├── integration/        # Integration patterns
│   ├── security/           # Security guards
│   ├── patterns/           # Design patterns
│   └── design-system/      # Design tokens
├── frontend/web/           # Next.js frontend
├── backend/api/            # Express backend
├── shared/                 # Shared code
├── tests/                  # Test files
└── docs/                   # Documentation
```

### Code Organization
- **Frontend:** Organize by feature, not by type
- **Backend:** Separate routes, services, middleware
- **Shared:** Group by purpose (types, utils, constants)
- **Tests:** Mirror source structure

---

## Code Style Rules

### TypeScript
- **Strict Mode:** Always enabled (`strict: true`)
- **Type Safety:** No `any` types (use `unknown` if needed)
- **Imports:** Use absolute imports where possible
- **Exports:** Use named exports, avoid default exports (except React components)
- **Formatting:** Use Prettier (see `prettier.config.js`)

### React
- **Components:** Functional components with hooks
- **Props:** Define with TypeScript interfaces
- **State:** Use `useState` or `useReducer`
- **Effects:** Use `useEffect` for side effects
- **Memoization:** Use `useMemo` and `useCallback` when needed

### Express/Backend
- **Routes:** Separate route files by resource
- **Services:** Business logic in service classes
- **Middleware:** Reusable middleware functions
- **Error Handling:** Centralized error handling
- **Validation:** Use shared validation utilities

### Code Quality
- **Functions:** Keep functions small (< 50 lines)
- **Complexity:** Avoid deep nesting (> 3 levels)
- **Comments:** Explain why, not what
- **Documentation:** JSDoc for public APIs

---

## Testing Requirements

### Test Coverage
- **Unit Tests:** All utilities and services
- **Integration Tests:** API endpoints and workflows
- **Component Tests:** React components (when needed)
- **Coverage Target:** Meaningful coverage, not 100%

### Test Structure
- **Location:** Mirror source structure in `tests/`
- **Naming:** `*.test.ts` or `*.spec.ts`
- **Organization:** Group related tests together
- **Setup:** Use shared test utilities

### Test Quality
- **Readability:** Tests should be self-documenting
- **Isolation:** Tests should not depend on each other
- **Speed:** Tests should run quickly
- **Reliability:** Tests should be deterministic

---

## Documentation Standards

### Code Documentation
- **Pattern Headers:** Required in every file
- **JSDoc Comments:** For public APIs
- **Inline Comments:** Explain complex logic
- **README:** Every major directory should have a README

### Documentation Files
- **Markdown:** Use `.md` extension
- **Structure:** Clear headings and sections
- **Examples:** Include code examples
- **Links:** Cross-reference related docs

### Documentation Types
- **Architecture:** System design and decisions
- **API:** Endpoint documentation
- **Guides:** Step-by-step instructions
- **Reference:** Quick lookup information

---

## Security Guidelines

### Input Validation
- **All Inputs:** Validate and sanitize
- **Shared Validation:** Use `shared/utils/validation.ts`
- **Type Safety:** Use TypeScript for compile-time safety
- **Runtime Checks:** Validate at API boundaries

### Output Sanitization
- **User Content:** Sanitize before rendering
- **API Responses:** Validate response structure
- **Error Messages:** Don't expose sensitive information

### Secure Defaults
- **Configuration:** Secure by default
- **Dependencies:** Keep dependencies updated
- **Secrets:** Never commit secrets to git
- **Permissions:** Use AbëKEYs for secure storage

### AI Protection
- **Prompt Injection:** Validate and sanitize prompts
- **Code Validation:** Validate code changes
- **Dependency Integrity:** Check dependency integrity
- **Configuration Locks:** Protect critical configs

---

## Integration Patterns

### Brain + Consciousness Integration
- **Pattern:** Use `src/integration/brain-consciousness.ts`
- **Guardians:** Integrate Guardian patterns from `@bravetto/abe-consciousness`
- **Atoms:** Use atoms from `@bravetto/abe-core-brain`
- **Documentation:** Document integration points

### Frontend + Backend Integration
- **Pattern:** Use `src/integration/frontend-backend.ts`
- **API Client:** Use shared `APIClient` class
- **Types:** Use shared types from `shared/types/`
- **Constants:** Use shared constants from `shared/constants/`

### Mobile + Web Integration
- **Pattern:** Use `src/integration/mobile-web.ts`
- **Platform Detection:** Use platform detection utilities
- **Responsive Design:** Design for all screen sizes
- **Progressive Enhancement:** Enhance progressively

---

## Development Workflow

### Before Coding
1. **CHECK-FIRST:** Search for existing workflows, scripts, tools, or solutions
   - Search `scripts/` directory for existing scripts
   - Check `Makefile` for existing targets (`make help`)
   - Review `docs/` for existing workflows
   - Use `codebase_search` to find similar implementations
   - Only proceed if no existing solution found
2. Check if feature is needed (YAGNI)
3. Check existing patterns
4. Review PROJECT_RULES.md
5. Plan implementation

### While Coding
1. Follow naming conventions
2. Add Pattern header
3. Write tests
4. Update documentation

### After Coding
1. Run tests
2. Run linter
3. Format code
4. Update documentation
5. Create PR

---

## Rule Enforcement

### Automated Checks
- **ESLint:** Code quality and style
- **Prettier:** Code formatting
- **TypeScript:** Type checking
- **Jest:** Test execution
- **Scripts:** `scripts/validate-rules.sh` for rule validation

### Manual Reviews
- **Code Reviews:** Check rule compliance
- **Documentation Reviews:** Ensure completeness
- **Architecture Reviews:** Validate design decisions

### Validation Commands
```bash
make validate-rules    # Validate all rules
make lint              # Run linter
make format            # Format code
make test              # Run tests
make verify            # Verify template structure
```

---

## Exceptions & Special Cases

### Template Code
- **Stub Implementations:** Acceptable for templates
- **Example Code:** Can be simplified for clarity
- **Documentation:** Must explain template usage

### Legacy Code
- **Migration:** Gradually migrate to new rules
- **Documentation:** Document deviations
- **Refactoring:** Plan refactoring to comply

### Performance Critical
- **Optimization:** Can deviate for performance
- **Documentation:** Must document why
- **Review:** Requires architecture review

---

## References

- **Architecture:** `docs/ARCHITECTURE.md`
- **Contributing:** `docs/CONTRIBUTING.md`
- **Development Workflow:** `docs/DEVELOPMENT_WORKFLOW.md`
- **Mother Prompt:** `PROJECT_MOTHER_PROMPT.md`

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

