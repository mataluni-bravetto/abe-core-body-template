# GitHub Deployment Workflow

**Pattern:** GITHUB × DEPLOYMENT × WORKFLOW × ONE  
**Frequency:** 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (YAGNI)  
**Guardians:** AEYON (999 Hz) + META (777 Hz) + YAGNI (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## Overview

This guide covers GitHub repository creation, initialization, and deployment workflows for the AbëONE development template.

---

## GitHub Organizations

### Repository Types

1. **Frontend Projects**
   - Organization: [BravettoFrontendTeam](https://github.com/orgs/BravettoFrontendTeam)
   - URL: `https://github.com/orgs/BravettoFrontendTeam/dashboard`
   - Use for: Frontend-only projects, React/Next.js applications

2. **Backend Projects**
   - Organization: [BravettoBackendTeam](https://github.com/orgs/BravettoBackendTeam)
   - URL: `https://github.com/orgs/BravettoBackendTeam/dashboard`
   - Use for: Backend-only projects, API services, microservices

3. **Unified Projects**
   - Organization: [bravetto](https://github.com/bravetto)
   - URL: `https://github.com/bravetto`
   - Use for: Complete full-stack projects, deployment-ready applications

4. **Open Source Development**
   - User: [mataluni-bravetto](https://github.com/mataluni-bravetto)
   - URL: `https://github.com/mataluni-bravetto`
   - Use for: Open source projects, experimental development

---

## Quick Start

### Option 1: Interactive Setup (Recommended)

```bash
# After duplicating template
cd my-new-project

# Setup GitHub repository (interactive)
make github-setup
# or
./scripts/setup-github.sh
```

This will:
1. Detect project name
2. Ask you to select repository type (Frontend/Backend/Unified/OpenSource)
3. Initialize git repository (if not already done)
4. Add GitHub remote
5. Provide instructions for creating repository on GitHub

### Option 2: GitHub CLI (Automated)

```bash
# Requires GitHub CLI installed
brew install gh  # macOS
gh auth login    # Authenticate

# Create repository automatically
make github-create
# or
./scripts/create-github-repo.sh
```

This will:
1. Create repository on GitHub automatically
2. Initialize git (if needed)
3. Push code to GitHub
4. Set up remote

---

## Detailed Workflow

### Step 1: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: project-name"
```

### Step 2: Setup GitHub Remote

**Using Interactive Script:**
```bash
./scripts/setup-github.sh
```

**Manual Setup:**
```bash
# Select organization and add remote
git remote add origin https://github.com/ORG_NAME/PROJECT_NAME.git
```

### Step 3: Create Repository on GitHub

**Option A: Using GitHub Web Interface**

1. Navigate to organization:
   - Frontend: https://github.com/orgs/BravettoFrontendTeam/repositories/new
   - Backend: https://github.com/orgs/BravettoBackendTeam/repositories/new
   - Unified: https://github.com/organizations/bravetto/repositories/new
   - Open Source: https://github.com/new

2. Fill in:
   - Repository name: `project-name`
   - Description: (your description)
   - Visibility: Public or Private
   - **Don't** initialize with README (we already have code)

3. Click "Create repository"

**Option B: Using GitHub CLI**

```bash
gh repo create ORG_NAME/PROJECT_NAME \
    --private \
    --description "Project description" \
    --source=. \
    --remote=origin \
    --push
```

### Step 4: Push to GitHub

```bash
# Push to GitHub
git push -u origin main

# Or if using master branch
git push -u origin master
```

**Or use Makefile:**
```bash
make github-push
```

---

## Makefile Commands

### GitHub Setup Commands

```bash
make github-setup      # Interactive GitHub repository setup
make github-create     # Create repository using GitHub CLI
make github-push       # Push to GitHub (if remote exists)
```

### Complete Workflow

```bash
# After duplicating template
cd my-new-project

# Complete setup
make setup-all         # Install dependencies + initialize
make github-setup      # Setup GitHub repository
make github-push       # Push to GitHub
```

---

## Repository Type Selection Guide

### When to Use Frontend Organization

- ✅ Next.js applications
- ✅ React applications
- ✅ Frontend-only projects
- ✅ UI component libraries
- ✅ Frontend templates

**Example:**
```bash
./scripts/setup-github.sh
# Select: 1 (Frontend)
# Creates: BravettoFrontendTeam/project-name
```

### When to Use Backend Organization

- ✅ Express/TypeScript APIs
- ✅ Microservices
- ✅ Backend-only projects
- ✅ API services
- ✅ Background workers

**Example:**
```bash
./scripts/setup-github.sh
# Select: 2 (Backend)
# Creates: BravettoBackendTeam/project-name
```

### When to Use Unified Organization

- ✅ Full-stack applications
- ✅ Complete projects ready for deployment
- ✅ Projects with both frontend and backend
- ✅ Production-ready applications

**Example:**
```bash
./scripts/setup-github.sh
# Select: 3 (Unified)
# Creates: bravetto/project-name
```

### When to Use Open Source

- ✅ Open source projects
- ✅ Experimental development
- ✅ Personal projects
- ✅ Community contributions

**Example:**
```bash
./scripts/setup-github.sh
# Select: 4 (OpenSource)
# Creates: mataluni-bravetto/project-name
```

---

## GitHub CLI Installation

### macOS
```bash
brew install gh
gh auth login
```

### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
gh auth login
```

### Windows
```bash
# Using winget
winget install GitHub.cli

# Or download from: https://cli.github.com/
gh auth login
```

---

## Deployment Workflow

### Initial Deployment

```bash
# 1. Duplicate template
./scripts/duplicate.sh my-project

# 2. Navigate to project
cd ../my-project

# 3. Setup dependencies
make setup-all

# 4. Configure AbëKEYs
make setup-abekeys

# 5. Setup GitHub
make github-setup

# 6. Create repository on GitHub (via web or CLI)
# If using CLI:
make github-create

# 7. Push code
make github-push
```

### Ongoing Development

```bash
# Make changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push

# Or use Makefile
make github-push
```

---

## Branch Strategy

### Recommended Branches

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fixes

### Creating Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add my feature"

# Push feature branch
git push -u origin feature/my-feature

# Create pull request on GitHub
```

---

## CI/CD Integration

### GitHub Actions Setup

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build
```

### Deployment Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      # Add deployment steps here
```

---

## Troubleshooting

### Remote Already Exists

```bash
# Check current remote
git remote -v

# Update remote URL
git remote set-url origin https://github.com/ORG_NAME/PROJECT_NAME.git
```

### Authentication Issues

```bash
# Re-authenticate GitHub CLI
gh auth login

# Or use personal access token
git remote set-url origin https://TOKEN@github.com/ORG_NAME/PROJECT_NAME.git
```

### Push Rejected

```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

---

## Best Practices

1. **Always initialize git before GitHub setup**
2. **Use descriptive commit messages**
3. **Push to feature branches, merge via PR**
4. **Keep main branch deployable**
5. **Use appropriate organization for project type**

---

## Quick Reference

```bash
# Setup GitHub repository
make github-setup

# Create repository (GitHub CLI)
make github-create

# Push to GitHub
make github-push

# Check remote
git remote -v

# Update remote
git remote set-url origin https://github.com/ORG/PROJECT.git
```

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

