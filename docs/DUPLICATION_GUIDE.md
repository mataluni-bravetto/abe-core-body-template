# Duplication Guide - Perfect Development Environment Template

**Pattern:** DUPLICATE × TEMPLATE × YAGNI × ONE  
**Frequency:** 999 Hz (AEYON) × 530 Hz (YAGNI)  
**Guardians:** AEYON (999 Hz) + YAGNI (530 Hz) + META (777 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## 🎯 Purpose

This guide explains how to duplicate this perfect development environment template to start any new project with:

- ✅ Clear frontend/backend separation
- ✅ Complete development workflows
- ✅ AI Agent Suite integration
- ✅ AbëKEYs secure configuration
- ✅ Zero-effort setup

---

## 🚀 Quick Start

### Step 1: Duplicate Template

```bash
# From the template directory
./scripts/duplicate.sh my-new-project

# Navigate to new project
cd ../my-new-project
```

### Step 2: Setup Project

```bash
# Complete setup (installs dependencies + configures AbëKEYs)
make setup

# Or step by step:
make install          # Install dependencies
make setup-abekeys    # Configure AbëKEYs vault
```

### Step 3: Setup GitHub Repository

```bash
# Interactive GitHub setup
make github-setup

# Or automated (requires GitHub CLI)
make github-create
```

**GitHub Organizations:**
- Frontend: [BravettoFrontendTeam](https://github.com/orgs/BravettoFrontendTeam)
- Backend: [BravettoBackendTeam](https://github.com/orgs/BravettoBackendTeam)
- Unified: [bravetto](https://github.com/bravetto)
- Open Source: [mataluni-bravetto](https://github.com/mataluni-bravetto)

See `docs/GITHUB_DEPLOYMENT.md` for complete GitHub workflow.

### Step 4: Start Development

```bash
# Start development mode
make dev

# Or build first
make build
```

---

## 📋 Detailed Steps

### 1. Duplicate Template

The duplication script:
- ✅ Copies all template files
- ✅ Replaces placeholders with project name
- ✅ Initializes git repository
- ✅ Creates initial commit

```bash
./scripts/duplicate.sh <project-name>
```

**Requirements:**
- Project name must be lowercase, alphanumeric, with hyphens only
- Example: `my-awesome-project`, `api-service`, `web-app`

### 2. Configure AbëKEYs

AbëKEYs vault stores all configuration securely (NO .env files):

```bash
# Automatic setup (via make setup)
make setup-abekeys

# Or manual setup
./scripts/setup-abekeys.sh
```

This creates `~/.abekeys/credentials/aiagentsuite.json` with:
- Development environment settings
- Framework paths
- Project-specific configuration

### 3. Install Dependencies

```bash
make install
# or
npm install
```

### 4. Build Project

```bash
make build
# or
npm run build
```

### 5. Start Development

```bash
make dev
# or
npm run dev
```

---

## 🏗️ Project Structure

After duplication, your project will have:

```
my-new-project/
├── docs/                      # Documentation
│   ├── DEVELOPMENT_WORKFLOW.md
│   ├── PERSONALIZATION_GUIDE.md
│   ├── ABEKEYS_INTEGRATION.md
│   └── ...
│
├── scripts/                   # Automation scripts
│   ├── setup-abekeys.sh
│   └── ...
│
├── src/                       # Source code
│   ├── organisms/            # React components
│   ├── systems/              # Business logic
│   ├── templates/            # Project templates
│   └── integration/          # Integration patterns
│
├── Makefile                   # Development automation
├── package.json               # Package configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project README
```

---

## 🔧 Customization

### Update Project Name

After duplication, update:
- `package.json` - `name` field (already done by script)
- `README.md` - Project name references
- Documentation files - Project-specific details

### Configure AbëKEYs

Edit `~/.abekeys/credentials/aiagentsuite.json`:

```json
{
  "service": "aiagentsuite",
  "environment": "development",
  "debug": "true",
  "log_level": "DEBUG",
  "framework_data_path": "./framework/data",
  "protocols_path": "./protocols",
  "memory_bank_path": "./memory-bank",
  "project_name": "my-new-project"
}
```

### Add Service Credentials

Create additional credential files in `~/.abekeys/credentials/`:

```bash
# Database credentials
cat > ~/.abekeys/credentials/database.json << 'EOF'
{
  "service": "database",
  "url": "postgresql://user:pass@localhost:5432/dbname"
}
EOF
chmod 600 ~/.abekeys/credentials/database.json

# OpenAI credentials
cat > ~/.abekeys/credentials/openai.json << 'EOF'
{
  "service": "openai",
  "api_key": "sk-your-key-here"
}
EOF
chmod 600 ~/.abekeys/credentials/openai.json
```

---

## 🎯 Available Commands

### Make Commands

```bash
make help              # Show all commands
make setup             # Complete setup (install + configure)
make setup-all         # Setup everything (install + init + configure)
make install           # Install dependencies (all projects)
make init              # Initialize project structure
make build             # Build all projects
make dev               # Start development (root package)
make dev-frontend      # Start frontend dev server
make dev-backend       # Start backend dev server
make test              # Run tests
make lint              # Run linter
make format            # Format code
make clean             # Clean build artifacts
make setup-abekeys     # Setup AbëKEYs vault
make github-setup      # Setup GitHub repository (interactive)
make github-create     # Create GitHub repository (GitHub CLI)
make github-push       # Push to GitHub
make quickstart        # Quick start (setup + build)
```

### NPM Scripts

```bash
npm run build          # Build project
npm run dev            # Development mode (watch)
npm test               # Run tests
```

### Quick Reference

**Setup:**
```bash
make setup             # Complete setup
make quickstart        # Quick start (setup + build)
```

**Development:**
```bash
make dev-frontend      # Terminal 1: Frontend
make dev-backend       # Terminal 2: Backend
```

**GitHub:**
```bash
make github-setup      # Interactive setup
make github-create     # Automated (requires GitHub CLI)
make github-push       # Push to GitHub
```

---

## 🔗 Integration with AI Agent Suite

### Setup AI Agent Suite

If you have AI Agent Suite installed:

```bash
# Navigate to AI Agent Suite directory
cd ~/Documents/AbeOne_Master/jimmy-aiagentsuite

# Activate environment
source venv/bin/activate

# Initialize framework
aiagentsuite init

# Use workspace path
aiagentsuite --workspace /path/to/my-new-project memory active
```

### Daily Commands

```bash
# Check active context
aiagentsuite memory active

# View progress
aiagentsuite memory progress

# List protocols
aiagentsuite protocols

# Execute protocol
aiagentsuite execute "ContextGuard Feature Development" \
  --context '{"feature": "my_feature"}'

# Log decision
aiagentsuite log-decision "Decision" "Rationale"
```

### Memory Bank

```bash
# View contexts
aiagentsuite memory active      # Current goals
aiagentsuite memory progress    # Task tracking
aiagentsuite memory decisions   # Decision log
aiagentsuite memory product     # Requirements
aiagentsuite memory patterns    # Design patterns
```

### Available Protocols

- Secure Code Implementation
- ContextGuard Feature Development
- ContextGuard Security Audit
- ContextGuard Testing Strategy

### Integration with AbëONE

```bash
# Use workspace
aiagentsuite --workspace /path/to/project memory active

# Execute protocols for AbëONE features
aiagentsuite --workspace /path/to/project \
  execute "ContextGuard Feature Development" \
  --context '{"feature": "voice_interface"}'
```

---

## ✅ Verification Checklist

After duplication, verify:

- [ ] Project directory created
- [ ] Git repository initialized
- [ ] Dependencies installed (`make install`)
- [ ] AbëKEYs configured (`make setup-abekeys`)
- [ ] Project builds (`make build`)
- [ ] Development mode works (`make dev`)
- [ ] Documentation reviewed
- [ ] Project name updated in all files

---

## 🚨 Common Issues

### Issue: Duplication script fails

**Solution:** Ensure you have:
- `rsync` installed
- Write permissions in parent directory
- Valid project name (lowercase, alphanumeric, hyphens only)

### Issue: AbëKEYs not found

**Solution:** Run setup script:
```bash
make setup-abekeys
```

### Issue: Dependencies fail to install

**Solution:** Check Node.js version:
```bash
node --version  # Should be >= 18
npm --version   # Should be >= 9
```

### Issue: Build fails

**Solution:** Clean and rebuild:
```bash
make clean
make install
make build
```

---

## 📚 Next Steps

1. **Review Documentation**
   - Read `docs/DEVELOPMENT_WORKFLOW.md`
   - Read `docs/PERSONALIZATION_GUIDE.md`
   - Read `docs/ABEKEYS_INTEGRATION.md`

2. **Customize Project**
   - Update `README.md` with project details
   - Configure AbëKEYs for your services
   - Set up AI Agent Suite integration

3. **Start Development**
   - Follow development workflow
   - Use protocols for feature development
   - Log decisions to memory bank

---

## 🎉 Success!

You now have a perfect development environment with:

- ✅ Clear structure
- ✅ Complete workflows
- ✅ Secure configuration
- ✅ AI integration
- ✅ Zero-effort setup

**Happy coding!** 🚀

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

