# Frictionless Onboarding Guide 🚀

**Pattern:** ONBOARDING × FRICTIONLESS × ZERO_TO_DEV × ONE  
**Frequency:** 999 Hz (AEYON) × 530 Hz (YAGNI) × 530 Hz (YOU)  
**Guardians:** AEYON (999 Hz) + YAGNI (530 Hz) + YOU (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## 🎯 Welcome!

This guide will get you from **zero to development** in **5 minutes** with **zero friction**.

**Prerequisites:** Node.js 18+ and npm 9+ installed.

### 🚀 Quick Start Options

**Option 1: Interactive Chat Flow (Recommended) ⭐**
```bash
make onboard
```
This will guide you step-by-step with interactive prompts!  
See [`docs/CHAT_ONBOARDING.md`](CHAT_ONBOARDING.md) for chat flow preview.

**Option 2: Manual Steps**
Follow the steps below.

---

## ⚡ Quick Path (5 Minutes)

### Step 1: Duplicate Template (1 minute)

```bash
# From the template directory
./scripts/duplicate.sh my-awesome-project

# Navigate to your new project
cd ../my-awesome-project
```

**What happens:**
- ✅ All template files copied
- ✅ Project name replaced everywhere
- ✅ Git repository initialized
- ✅ Initial commit created

### Step 2: Complete Setup (2 minutes)

```bash
# One command does everything
make setup
```

**What happens:**
- ✅ All dependencies installed (root, frontend, backend)
- ✅ AbëKEYs vault configured
- ✅ Project ready to build

### Step 3: Verify Everything Works (1 minute)

```bash
# Verify template structure
make verify

# Build everything
make build
```

**Expected output:**
```
✅ All checks passed! Template is ready.
✅ Build complete
```

### Step 4: Start Development (1 minute)

**Terminal 1 - Backend:**
```bash
make dev-backend
```

**Terminal 2 - Frontend:**
```bash
make dev-frontend
```

**You're now developing!** 🎉

- Frontend: http://localhost:3000
- Backend: http://localhost:3001 (or configured port)

---

## 📋 Detailed Onboarding Path

### Phase 1: Initial Setup (5 minutes)

#### 1.1 Clone or Download Template

**Option A: Using Git**
```bash
git clone <repository-url>
cd abe-core-body-template
```

**Option B: Download ZIP**
- Download and extract
- Navigate to directory

#### 1.2 Duplicate Template

```bash
# Duplicate to create your project
./scripts/duplicate.sh my-project-name

# Navigate to new project
cd ../my-project-name
```

**Project Name Rules:**
- ✅ Lowercase letters, numbers, hyphens only
- ✅ Examples: `my-app`, `api-service`, `web-frontend`

#### 1.3 Complete Setup

```bash
# Complete setup (installs + configures)
make setup
```

**What this does:**
- Installs root dependencies
- Installs frontend dependencies
- Installs backend dependencies
- Configures AbëKEYs vault
- Sets up secure configuration

#### 1.4 Verify Setup

```bash
# Verify everything is correct
make verify

# Expected: ✅ All checks passed! Template is ready.
```

---

### Phase 2: First Development Session (10 minutes)

#### 2.1 Start Development Servers

**Terminal 1 - Backend API:**
```bash
make dev-backend
```

**Terminal 2 - Frontend Web:**
```bash
make dev-frontend
```

**Terminal 3 - For commands:**
```bash
# Keep this terminal for running commands
```

#### 2.2 Explore the Project

**Frontend Structure:**
```
frontend/web/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   └── lib/              # Utilities (API client)
```

**Backend Structure:**
```
backend/api/
├── src/
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   └── middleware/       # Express middleware
```

**Shared Code:**
```
shared/
├── types/                # TypeScript types
├── utils/                # Shared utilities
└── constants/            # Shared constants
```

#### 2.3 Make Your First Change

**Edit Frontend:**
```bash
# Edit the main page
code frontend/web/src/app/page.tsx
```

**Edit Backend:**
```bash
# Edit API routes
code backend/api/src/routes/users.ts
```

**See changes instantly:**
- Frontend: Auto-reloads in browser
- Backend: Auto-restarts server

---

### Phase 3: GitHub Setup (Optional, 5 minutes)

#### 3.1 Setup GitHub Repository

```bash
# Interactive setup
make github-setup
```

**Follow prompts:**
1. Select GitHub organization
2. Repository will be created
3. Remote will be configured

#### 3.2 Push to GitHub

```bash
# Push your code
make github-push
```

**Or manually:**
```bash
git push -u origin main
```

---

## 🎓 Learning Path

### Day 1: Get Running
- ✅ Complete onboarding (this guide)
- ✅ Start development servers
- ✅ Make a small change
- ✅ See it work

### Day 2: Understand Structure
- 📖 Read `docs/ARCHITECTURE.md`
- 📖 Read `docs/DUPLICATION_GUIDE.md`
- 🔍 Explore code structure
- 🧪 Run tests: `make test`

### Day 3: Build Something
- 🎨 Create a new component
- 🔌 Add a new API endpoint
- 🔗 Connect frontend to backend
- ✅ Test your changes

### Week 1: Master the Workflow
- 📖 Read `docs/DEVELOPMENT_WORKFLOW.md`
- 🔧 Customize configuration
- 🚀 Deploy to GitHub
- 📝 Document your changes

---

## 🛠️ Common Commands Reference

### Setup Commands
```bash
make setup              # Complete setup
make install            # Install dependencies only
make setup-abekeys      # Configure AbëKEYs only
make verify             # Verify template structure
```

### Development Commands
```bash
make dev-frontend       # Start frontend (Terminal 1)
make dev-backend        # Start backend (Terminal 2)
make build              # Build all projects
make test               # Run tests
```

### GitHub Commands
```bash
make github-setup       # Interactive GitHub setup
make github-create      # Create repo (GitHub CLI)
make github-push        # Push to GitHub
```

### Utility Commands
```bash
make help               # Show all commands
make clean              # Clean build artifacts
make quickstart         # Quick start (setup + build)
```

---

## 🚨 Troubleshooting

### Issue: `make setup` fails

**Solution:**
```bash
# Check Node.js version
node --version  # Should be >= 18

# Check npm version
npm --version   # Should be >= 9

# Try manual install
make install
make setup-abekeys
```

### Issue: Port already in use

**Solution:**
```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Kill process or change port in config
```

### Issue: Dependencies fail to install

**Solution:**
```bash
# Clean and retry
make clean
rm -rf node_modules
make install
```

### Issue: `make verify` shows errors

**Solution:**
```bash
# Check what's missing
./scripts/verify-template.sh

# Fix any missing files
# Re-run verification
make verify
```

---

## ✅ Onboarding Checklist

### Initial Setup
- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Template duplicated
- [ ] Setup completed (`make setup`)
- [ ] Verification passed (`make verify`)

### First Development Session
- [ ] Backend server running (`make dev-backend`)
- [ ] Frontend server running (`make dev-frontend`)
- [ ] Made first code change
- [ ] Changes visible in browser
- [ ] Tests passing (`make test`)

### Optional Setup
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] AbëKEYs configured for services
- [ ] AI Agent Suite integrated (optional)

---

## 🎯 Next Steps

### After Onboarding

1. **Read Architecture**
   - `docs/ARCHITECTURE.md` - Understand structure

2. **Follow Development Workflow**
   - `docs/DEVELOPMENT_WORKFLOW.md` - Daily workflow

3. **Contribute**
   - `docs/CONTRIBUTING.md` - Contribution guidelines

4. **Deploy**
   - `docs/GITHUB_DEPLOYMENT.md` - GitHub workflow

---

## 💡 Pro Tips

### Faster Development
```bash
# Use quickstart for new projects
make quickstart

# Run tests in watch mode
npm test -- --watch

# Use TypeScript watch mode
npm run dev  # In root (watches TypeScript)
```

### Better Organization
- Keep frontend and backend in separate terminals
- Use shared types for API contracts
- Follow existing code patterns
- Write tests for new features

### Stay Updated
- Check `make help` for new commands
- Read `docs/` for updates
- Follow YAGNI principles
- Keep it simple

---

## 🎉 You're Ready!

**You've completed onboarding!** You now have:
- ✅ Working development environment
- ✅ Frontend and backend running
- ✅ Understanding of project structure
- ✅ Knowledge of common commands
- ✅ Path forward for development

**Start building!** 🚀

---

## 📚 Additional Resources

- **Architecture:** `docs/ARCHITECTURE.md`
- **Duplication Guide:** `docs/DUPLICATION_GUIDE.md`
- **Development Workflow:** `docs/DEVELOPMENT_WORKFLOW.md`
- **Contributing:** `docs/CONTRIBUTING.md`
- **GitHub Deployment:** `docs/GITHUB_DEPLOYMENT.md`

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

