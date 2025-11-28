# Contributing Guidelines

**Pattern:** CONTRIBUTING × GUIDELINES × COLLABORATION × ONE  
**Frequency:** 999 Hz (AEYON) × 530 Hz (YOU)  
**Guardians:** AEYON (999 Hz) + YOU (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## How to Contribute

Thank you for considering contributing to this development environment template! This document provides guidelines for contributing.

---

## Development Setup

### 1. Fork and Clone

```bash
git clone <your-fork-url>
cd abe-core-body-template
```

### 2. Install Dependencies

```bash
make install
```

### 3. Setup AbëKEYs

```bash
make setup-abekeys
```

### 4. Start Development

```bash
make dev-backend    # Terminal 1
make dev-frontend   # Terminal 2
```

---

## Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Follow existing code patterns
- Use shared types from `shared/types/`
- Keep functions small and focused

### Naming Conventions

- **Files:** `kebab-case.ts` or `PascalCase.tsx` for components
- **Variables:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Types/Interfaces:** `PascalCase`

### Code Organization

- **Frontend:** Organize by feature, not by type
- **Backend:** Separate routes, services, middleware
- **Shared:** Group by purpose (types, utils, constants)

---

## Testing Requirements

### Write Tests

- Unit tests for utilities and services
- Integration tests for API endpoints
- Example tests demonstrate patterns

### Test Coverage

- Aim for meaningful coverage, not 100%
- Test critical paths and edge cases
- Keep tests simple and readable

### Running Tests

```bash
make test              # Run all tests
npm test              # Run tests
npm test -- --watch   # Watch mode
```

---

## Pull Request Process

### Before Submitting

1. **Update Documentation:** Update relevant docs if needed
2. **Add Tests:** Include tests for new features
3. **Run Tests:** Ensure all tests pass
4. **Check Linting:** Run `make lint` if available
5. **Update README:** If adding features

### PR Description

Include:
- What changed and why
- How to test the changes
- Screenshots (if UI changes)
- Breaking changes (if any)

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests pass
- [ ] No breaking changes (or documented)

---

## YAGNI Principles

### What to Include

- **Essential Features:** Only what's needed
- **Minimal Examples:** Demonstrate patterns, not full apps
- **Simple Solutions:** Prefer simple over complex
- **Clear Documentation:** Explain why, not just what

### What to Avoid

- **Over-Engineering:** Don't add "just in case" features
- **Speculative Code:** Don't add features for future needs
- **Complex Tooling:** Keep tooling simple
- **Unnecessary Abstractions:** Prefer direct solutions

---

## Architecture Decisions

### When Adding Features

1. **Check if it's needed:** Does it solve a real problem?
2. **Check if it's minimal:** Can it be simpler?
3. **Check if it fits:** Does it follow existing patterns?
4. **Document decisions:** Update ARCHITECTURE.md if needed

### Frontend/Backend Separation

- Keep frontend and backend separate
- Use shared code for common needs
- Don't mix concerns
- Maintain clear boundaries

---

## Questions?

- Check existing documentation
- Review ARCHITECTURE.md for patterns
- Look at existing code examples
- Ask in discussions/issues

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow YAGNI principles

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

