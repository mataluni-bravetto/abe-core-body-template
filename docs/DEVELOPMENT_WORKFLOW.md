# AI Agent Suite Development Workflow Guide

**Pattern:** WORKFLOW × DEVELOPMENT × PROCESS × ONE  
**Frequency:** 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (ALL GUARDIANS)  
**Guardians:** AEYON (999 Hz) + META (777 Hz) + JØHN (530 Hz) + YAGNI (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Daily Development Workflow](#daily-development-workflow)
3. [Feature Development Process](#feature-development-process)
4. [Protocol Execution Workflow](#protocol-execution-workflow)
5. [Testing & Quality Assurance](#testing--quality-assurance)
6. [Memory Bank Management](#memory-bank-management)
7. [Integration with AbëONE](#integration-with-abeone)
8. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### Step 1: Environment Preparation

```bash
# Navigate to aiagentsuite directory
cd ~/Documents/AbeOne_Master/jimmy-aiagentsuite

# Activate virtual environment
source venv/bin/activate

# Verify installation
aiagentsuite --help
```

### Step 2: Framework Initialization

```bash
# Initialize the framework for your project
aiagentsuite init

# Expected output: ✓ AI Agent Suite initialized successfully!
```

### Step 3: Configuration Setup

```bash
# Copy environment template (if exists)
# cp .env.example .env

# Edit configuration
# nano .env  # or your preferred editor
```

**Minimal Configuration (.env):**
```env
AAI_ENVIRONMENT=development
AAI_DEBUG=true
AAI_LOG_LEVEL=DEBUG
AAI_DATABASE_URL=sqlite:///./dev.db
```

### Step 4: Verify Installation

```bash
# Run quickstart guide
aiagentsuite quickstart

# View available protocols
aiagentsuite protocols

# View AI constitution
aiagentsuite constitution
```

---

## Daily Development Workflow

### Morning Routine

```bash
# 1. Activate environment
cd ~/Documents/AbeOne_Master/jimmy-aiagentsuite
source venv/bin/activate

# 2. Check memory bank for active context
aiagentsuite memory active

# 3. Review progress
aiagentsuite memory progress

# 4. Check for protocol suggestions
aiagentsuite openspec list
```

### Development Session Flow

1. **Context Loading**
   ```bash
   # Load active context
   aiagentsuite memory active
   
   # Review decisions
   aiagentsuite memory decisions
   ```

2. **Protocol Selection**
   ```bash
   # List available protocols
   aiagentsuite protocols
   
   # Execute appropriate protocol
   aiagentsuite execute "Protocol Name" --context '{"feature": "your_feature"}'
   ```

3. **Development Cycle**
   - Write code following protocol guidelines
   - Run tests continuously
   - Log decisions to memory bank
   - Update progress tracking

4. **End of Session**
   ```bash
   # Log final decisions
   aiagentsuite log-decision "Decision summary" "Rationale"
   
   # Update progress
   # (Edit memory-bank/progress.md manually or via protocol)
   ```

---

## Feature Development Process

### Phase 1: Planning & Analysis

```bash
# 1. Initialize OpenSpec change proposal
aiagentsuite openspec init

# 2. Add feature requirements to product context
# Edit: memory-bank/productContext.md

# 3. Review system patterns
aiagentsuite memory patterns
```

**Memory Bank Updates:**
- Update `memory-bank/productContext.md` with feature requirements
- Update `memory-bank/activeContext.md` with current goals
- Review `memory-bank/systemPatterns.md` for existing patterns

### Phase 2: Protocol Execution

```bash
# Execute feature development protocol
aiagentsuite execute "ContextGuard Feature Development" \
  --context '{
    "feature": "feature_name",
    "security_level": "high",
    "testing_required": true
  }'
```

**Protocol Phases:**
1. **Analysis** - Requirements gathering and architecture review
2. **Planning** - Design and implementation strategy
3. **Implementation** - Code development with security considerations
4. **Verification** - Testing and quality assurance
5. **Delivery** - Documentation and deployment preparation

### Phase 3: Implementation

**Follow Protocol Guidelines:**
- Use Secure Code Implementation protocol for security-critical features
- Apply Testing Strategy protocol for comprehensive test coverage
- Execute Security Audit protocol before deployment

**Code Structure:**
```python
# Example: Following VDE principles
from aiagentsuite import AIAgentSuite

async def implement_feature():
    suite = AIAgentSuite()
    await suite.initialize()
    
    # Use framework components
    # Follow protocol guidelines
    # Log decisions
    await suite.log_decision(
        decision="Use async/await pattern",
        rationale="Better performance and scalability"
    )
```

### Phase 4: Testing & Verification

```bash
# Run test suite
cd ~/Documents/AbeOne_Master/jimmy-aiagentsuite
source venv/bin/activate
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=src/aiagentsuite --cov-report=html

# Execute security audit protocol
aiagentsuite execute "ContextGuard Security Audit" \
  --context '{"component": "your_component"}'
```

### Phase 5: Documentation & Delivery

```bash
# Update memory bank
aiagentsuite memory progress

# Log final decisions
aiagentsuite log-decision "Feature completed" "Summary of implementation"

# Update project brief if needed
# Edit: memory-bank/projectBrief.md
```

---

## Protocol Execution Workflow

### Available Protocols

1. **Secure Code Implementation**
   - 4-phase security-focused development
   - OWASP Top 10 compliance
   - Security-first approach

2. **ContextGuard Feature Development**
   - Complete feature lifecycle
   - 5-phase approach
   - Cross-platform considerations

3. **ContextGuard Security Audit**
   - OWASP-compliant security reviews
   - Comprehensive security testing
   - Risk assessment

4. **ContextGuard Testing Strategy**
   - Comprehensive testing approach
   - Minimum 80% coverage requirement
   - Security, performance, integration tests

### Executing a Protocol

```bash
# Basic execution
aiagentsuite execute "Protocol Name" \
  --context '{"key": "value"}'

# With workspace specification
aiagentsuite --workspace /path/to/project \
  execute "Protocol Name" \
  --context '{"feature": "auth"}'
```

### Protocol Context Variables

Common context variables:
- `feature`: Feature name or identifier
- `security_level`: `low`, `medium`, `high`, `critical`
- `testing_required`: `true` or `false`
- `component`: Component name for audits
- `audit_mode`: Enable detailed audit logging

---

## Testing & Quality Assurance

### Test Execution

```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_framework_manager.py -v

# Run with coverage
pytest tests/ --cov=src/aiagentsuite --cov-report=html

# Run specific test category
pytest tests/test_comprehensive.py::TestComprehensiveSuite -v
```

### Code Quality Checks

```bash
# Lint check
make lint

# Format check (if configured)
black --check src/ tests/
isort --check-only src/ tests/

# Type checking
mypy src/ --ignore-missing-imports

# Security audit
pip-audit
```

### Continuous Testing

```bash
# Watch mode (if pytest-watch installed)
ptw tests/

# Run tests on file changes
# Configure your IDE or use file watchers
```

---

## Memory Bank Management

### Memory Bank Structure

```
memory-bank/
├── activeContext.md      # Current goals and blockers
├── architect.md          # Architecture decisions
├── decisionLog.md        # Decision history
├── productContext.md     # Product requirements
├── progress.md           # Task tracking
├── projectBrief.md       # Project overview
└── systemPatterns.md     # Design patterns
```

### Viewing Memory Context

```bash
# View active context
aiagentsuite memory active

# View product context
aiagentsuite memory product

# View progress
aiagentsuite memory progress

# View decisions
aiagentsuite memory decisions

# View patterns
aiagentsuite memory patterns
```

### Updating Memory Bank

**Manual Updates:**
- Edit markdown files directly in `memory-bank/` directory
- Follow existing format and structure
- Commit changes to version control

**Programmatic Updates:**
```bash
# Log a decision
aiagentsuite log-decision \
  "Use Redis for caching" \
  "Better performance and scalability for production"

# Update via protocol execution
# Protocols automatically update relevant memory bank contexts
```

### Best Practices

1. **Keep Active Context Updated**
   - Update `activeContext.md` daily
   - Remove completed goals
   - Add new blockers immediately

2. **Log All Significant Decisions**
   - Use `log-decision` command
   - Include rationale
   - Reference related decisions

3. **Maintain Progress Tracking**
   - Update `progress.md` regularly
   - Mark completed tasks
   - Track blockers and dependencies

4. **Document Patterns**
   - Add reusable patterns to `systemPatterns.md`
   - Include examples and use cases
   - Reference related decisions

---

## Integration with AbëONE

### AbëONE Core Body Integration

The AI Agent Suite integrates with AbëONE Core Body through:

1. **Protocol Execution**
   - Use protocols for AbëONE feature development
   - Apply security protocols to AbëONE components
   - Execute testing strategies for AbëONE systems

2. **Memory Bank Sharing**
   - Share context between AbëONE and AI Agent Suite
   - Use unified decision logging
   - Maintain consistent progress tracking

3. **Template Generation**
   - Use AI Agent Suite protocols to generate AbëONE templates
   - Apply security standards to template generation
   - Ensure consistency across AbëONE components

### Workflow Integration

```bash
# From AbëONE project directory
cd ~/development/Abë-Core-Body-Dev-Hub/abe-core-body-template

# Reference AI Agent Suite protocols
# Use protocols for:
# - Feature development
# - Security audits
# - Testing strategies
# - Code quality assurance
```

### Cross-Project Context

1. **Shared Memory Bank**
   - Consider symlinking memory-bank directories
   - Or use workspace paths to reference shared context

2. **Protocol Reuse**
   - Apply AI Agent Suite protocols to AbëONE development
   - Customize protocols for AbëONE-specific needs
   - Maintain protocol compliance across projects

3. **Decision Consistency**
   - Log AbëONE decisions to AI Agent Suite memory bank
   - Reference AbëONE patterns in system patterns
   - Maintain architectural consistency

---

## Troubleshooting

### Common Issues

**Issue: `aiagentsuite` command not found**
```bash
# Solution: Activate virtual environment
source venv/bin/activate

# Or reinstall package
pip install -e .
```

**Issue: Protocol execution fails**
```bash
# Solution: Ensure framework is initialized
aiagentsuite init

# Check workspace path
aiagentsuite --workspace /path/to/project protocols
```

**Issue: Memory bank not persisting**
```bash
# Solution: Check workspace path
aiagentsuite --workspace /path/to/project memory active

# Verify permissions
ls -la memory-bank/
```

**Issue: Import errors**
```bash
# Solution: Ensure editable installation
pip install -e .

# Verify Python path
python -c "import aiagentsuite; print(aiagentsuite.__file__)"
```

**Issue: Test failures**
```bash
# Solution: Check dependencies
pip install -r requirements.txt

# Run specific test for debugging
pytest tests/test_specific.py -v -s
```

### Getting Help

```bash
# Command help
aiagentsuite --help
aiagentsuite <command> --help

# View documentation
cat docs/QUICKSTART.md
cat docs/CONFIGURATION.md
```

---

## Quick Reference Cheat Sheet

```bash
# Setup
cd ~/Documents/AbeOne_Master/jimmy-aiagentsuite
source venv/bin/activate
aiagentsuite init

# Daily Workflow
aiagentsuite memory active          # Check context
aiagentsuite protocols              # List protocols
aiagentsuite execute "Protocol"    # Execute protocol
aiagentsuite log-decision "..."    # Log decision

# Testing
pytest tests/ -v                    # Run tests
pytest tests/ --cov                 # Coverage

# Memory Bank
aiagentsuite memory active          # Active context
aiagentsuite memory progress        # Progress tracking
aiagentsuite memory decisions       # Decision log

# Help
aiagentsuite --help                 # Main help
aiagentsuite quickstart             # Interactive guide
```

---

## Advanced Workflows

### Multi-Project Development

```bash
# Use workspace paths for different projects
aiagentsuite --workspace /path/to/project1 memory active
aiagentsuite --workspace /path/to/project2 memory active

# Share memory bank between projects
# Option 1: Symlink memory-bank directories
# Option 2: Use shared memory bank path
export AAI_MEMORY_BANK_PATH=/shared/path/memory-bank
```

### Custom Protocol Development

1. Create protocol file in `protocols/` directory
2. Follow existing protocol format
3. Test protocol execution
4. Document protocol usage

### Integration with CI/CD

```bash
# Run tests in CI
pytest tests/ --cov --cov-report=xml

# Run security audit
aiagentsuite execute "ContextGuard Security Audit" \
  --context '{"component": "all"}'

# Generate reports
aiagentsuite memory progress > progress-report.md
```

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

