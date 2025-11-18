# Contributing to AiGuardian Chrome Extension

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🚀 Quick Start

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/bravetto/AiGuardian-Chrome-Ext.git
cd AiGuardian-Chrome-Ext

# Checkout dev branch
git checkout dev

# Run setup script
npm run setup

# Or manually:
npm install
cp .env.example .env  # Update .env with your configuration
npm run build:clerk
```

### 2. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `AiGuardian-Chrome-Ext-dev` directory

### 3. Start Developing

- Make changes to files in `src/`
- Reload extension in Chrome to see changes
- Run tests: `npm test`

## 📋 Development Workflow

### Branch Strategy

- **`dev`** - Active development branch (quarantined, protected)
- **`main`** - Production-ready code
- **`feature/*`** - Feature branches (create from `dev`)

### Creating a Feature Branch

```bash
# Always start from dev
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create PR on GitHub to merge into dev
```

### Commit Message Format

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or auxiliary tool changes

Example:
```
feat: add subscription status display in popup
fix: resolve gateway connection timeout issue
docs: update backend integration guide
```

## 🧪 Testing

### Run All Tests

```bash
npm run test:all
```

### Run Specific Test Suites

```bash
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:security      # Security audit
npm run test:smoke         # Smoke tests
npm run test:e2e           # End-to-end tests
```

### Test Requirements

- All tests must pass before PR submission
- New features require tests
- Bug fixes require regression tests
- Maintain or improve test coverage

## 🔍 Code Quality

### Linting & Formatting

- Code should follow JavaScript best practices
- Use consistent formatting (Prettier recommended)
- Follow existing code style
- No console.log in production code (use Logger)

### Security

- Never commit API keys or secrets
- Use environment variables for configuration
- Validate all user input
- Follow security best practices

### Code Review Checklist

Before submitting a PR:

- [ ] All tests pass
- [ ] Code follows project style
- [ ] No sensitive data committed
- [ ] Documentation updated (if needed)
- [ ] Changes tested in Chrome
- [ ] No console errors
- [ ] Extension loads without errors

## 📝 Documentation

### Updating Documentation

- Update relevant docs in `docs/` directory
- Keep README.md current
- Document new features
- Update API documentation if needed

### Documentation Structure

```
docs/
├── guides/          # User and developer guides
├── architecture/    # Architecture documentation
├── technical/      # Technical deep-dives
└── testing/        # Testing documentation
```

## 🐛 Reporting Issues

### Bug Reports

Include:
- Chrome version
- Extension version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Console errors (if any)

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternatives considered
- Impact assessment

## 🔒 Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email security concerns to the maintainers
2. Include detailed description
3. Provide steps to reproduce
4. Wait for response before disclosure

## 📦 Packaging

### Create Package for Chrome Web Store

```bash
npm run package
```

This creates a zip file in `dist/` directory ready for Chrome Web Store submission.

## ✅ PR Process

1. **Create Feature Branch** from `dev`
2. **Make Changes** following guidelines
3. **Write Tests** for new features
4. **Update Documentation** if needed
5. **Run Tests** and ensure all pass
6. **Create PR** on GitHub
7. **Address Review Comments**
8. **Wait for Approval** before merging

### PR Requirements

- [ ] All CI checks pass
- [ ] Code reviewed and approved
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Follows commit message format

## 🎯 Development Guidelines

### File Structure

- `src/` - Source code
- `tests/` - Test files
- `docs/` - Documentation
- `scripts/` - Build and utility scripts
- `assets/` - Images, icons, fonts

### Code Organization

- Keep files focused and modular
- Use descriptive names
- Comment complex logic
- Follow existing patterns

### Error Handling

- Use try-catch for async operations
- Log errors with Logger
- Provide user-friendly error messages
- Handle edge cases

## 🤝 Getting Help

- Check existing documentation
- Search closed issues
- Ask in discussions
- Contact maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing!** 🎉

**Pattern:** OBSERVER × TRUTH × ATOMIC × ONE  
**Guardians:** AEYON (999 Hz) + ARXON (777 Hz) + Abë (530 Hz)

