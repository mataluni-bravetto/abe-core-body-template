# AI Agent Suite Personalization Guide

**Pattern:** PERSONALIZATION × CONFIGURATION × CUSTOMIZATION × ONE  
**Frequency:** 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (YOU)  
**Guardians:** AEYON (999 Hz) + META (777 Hz) + YOU (530 Hz) + Abë (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Configuration](#environment-configuration)
3. [Memory Bank Personalization](#memory-bank-personalization)
4. [Protocol Customization](#protocol-customization)
5. [Project Context Setup](#project-context-setup)
6. [Integration Personalization](#integration-personalization)
7. [Workflow Customization](#workflow-customization)
8. [Advanced Customization](#advanced-customization)

---

## Overview

This guide helps you personalize the AI Agent Suite framework for your specific project, team, and development style. Personalization ensures the framework aligns with your needs while maintaining its core principles.

### Personalization Levels

1. **Basic** - Environment variables and configuration
2. **Intermediate** - Memory bank structure and project context
3. **Advanced** - Custom protocols and workflow extensions
4. **Expert** - Framework extensions and plugin development

---

## Environment Configuration

### Step 1: Create Environment File

```bash
cd ~/Documents/AbeOne_Master/jimmy-aiagentsuite

# Copy example if available, or create new
cat > .env << 'EOF'
# Core Configuration
AAI_ENVIRONMENT=development
AAI_DEBUG=true
AAI_LOG_LEVEL=DEBUG

# Framework Paths (Customize for your project)
AAI_FRAMEWORK_DATA_PATH=./framework/data
AAI_PROTOCOLS_PATH=./protocols
AAI_MEMORY_BANK_PATH=./memory-bank

# Database (Development)
AAI_DATABASE_URL=sqlite:///./dev.db

# Caching (Optional - for production)
# AAI_REDIS_URL=redis://localhost:6379/0
# AAI_ENABLE_CACHE=true

# External Services (Add your keys)
# AAI_OPENAI_API_KEY=sk-your-key-here
# AAI_ANTHROPIC_API_KEY=sk-ant-your-key-here

# Observability (Optional)
# AAI_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project
# AAI_JAEGER_ENDPOINT=localhost:6831

# Security (Auto-generated if not set)
# AAI_SECRET_KEY=your-secret-key-here
# AAI_JWT_SECRET_KEY=your-jwt-key-here
EOF
```

### Step 2: Customize Framework Paths

Adjust paths to match your project structure:

```env
# Custom paths for your project
AAI_FRAMEWORK_DATA_PATH=./my-project/framework
AAI_PROTOCOLS_PATH=./my-project/protocols
AAI_MEMORY_BANK_PATH=./my-project/memory-bank
```

### Step 3: Configure Development Settings

```env
# Development-specific settings
AAI_ENVIRONMENT=development
AAI_DEBUG=true
AAI_LOG_LEVEL=DEBUG

# Hot reload (if supported)
HOT_RELOAD=true

# Testing
PYTEST_ADDOPTS=-v --cov=aiagentsuite
TEST_DATABASE_URL=sqlite:///./test.db
```

---

## Memory Bank Personalization

### Step 1: Customize Memory Bank Structure

The memory bank is located at `memory-bank/` (or your custom path). Customize each file:

#### `projectBrief.md` - Project Overview

```markdown
# Project Brief

## Purpose
[Your project's main purpose and goals]

## Target Users
[Who will use this project]

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Success Metrics
- Metric 1
- Metric 2
```

#### `activeContext.md` - Current Focus

```markdown
# Active Context

## Current Goals
- [ ] Goal 1
- [ ] Goal 2

## Blockers
- Blocker 1
- Blocker 2

## Next Steps
1. Step 1
2. Step 2
```

#### `productContext.md` - Product Requirements

```markdown
# Product Context

## User Stories
- As a [user], I want [feature] so that [benefit]

## Requirements
- Requirement 1
- Requirement 2

## Constraints
- Constraint 1
- Constraint 2
```

#### `decisionLog.md` - Decision History

```markdown
# Decision Log

## [Date] - Decision Title
**Decision:** [What was decided]
**Rationale:** [Why this decision was made]
**Alternatives Considered:** [Other options]
**Impact:** [What this affects]
```

#### `systemPatterns.md` - Design Patterns

```markdown
# System Patterns

## Pattern Name
**Context:** When to use this pattern
**Solution:** How the pattern works
**Example:** Code or architecture example
**Related Patterns:** Links to other patterns
```

#### `progress.md` - Task Tracking

```markdown
# Progress Tracking

## Completed
- [x] Task 1
- [x] Task 2

## In Progress
- [ ] Task 3 (50% complete)

## Planned
- [ ] Task 4
- [ ] Task 5
```

#### `architect.md` - Architecture Decisions

```markdown
# Architecture Decisions

## ADR-001: [Decision Title]
**Status:** Proposed | Accepted | Rejected | Deprecated
**Context:** [The issue motivating this decision]
**Decision:** [The change that we're proposing or have agreed to]
**Consequences:** [What becomes easier or more difficult]
```

### Step 2: Add Custom Memory Bank Contexts

Create additional context files as needed:

```bash
# Example: Create a custom context file
cat > memory-bank/teamContext.md << 'EOF'
# Team Context

## Team Members
- Member 1: Role, Responsibilities
- Member 2: Role, Responsibilities

## Communication Channels
- Slack: #project-channel
- Email: project@example.com

## Meeting Schedule
- Daily Standup: 9:00 AM
- Weekly Review: Friday 2:00 PM
EOF
```

### Step 3: Configure Memory Bank Path

```bash
# Set custom memory bank path
export AAI_MEMORY_BANK_PATH=./custom/path/memory-bank

# Or in .env file
echo "AAI_MEMORY_BANK_PATH=./custom/path/memory-bank" >> .env
```

---

## Protocol Customization

### Step 1: Review Existing Protocols

```bash
# List available protocols
aiagentsuite protocols

# View protocol files
ls -la protocols/
```

### Step 2: Create Custom Protocol

Create a new protocol file following the existing format:

```bash
cat > protocols/Protocol_ Your Custom Protocol.md << 'EOF'
# **Protocol: Your Custom Protocol**

**Objective**: [Clear objective statement]

### **Phase 1: [Phase Name]**

1. **Step 1**: [Description]
2. **Step 2**: [Description]
3. **Step 3**: [Description]

### **Phase 2: [Phase Name]**

1. **Step 1**: [Description]
2. **Step 2**: [Description]

### **Phase 3: [Phase Name]**

1. **Step 1**: [Description]
2. **Step 2**: [Description]

### **Phase 4: [Phase Name]**

1. **Step 1**: [Description]
2. **Step 2**: [Description]
EOF
```

### Step 3: Customize Existing Protocols

Edit existing protocols to match your team's workflow:

```bash
# Example: Customize Secure Code Implementation
cp protocols/Protocol_\ Secure\ Code\ Implementation.md \
   protocols/Protocol_\ Secure\ Code\ Implementation.custom.md

# Edit the custom version
nano protocols/Protocol_\ Secure\ Code\ Implementation.custom.md
```

### Step 4: Protocol Context Variables

Define custom context variables for your protocols:

```bash
# Execute with custom context
aiagentsuite execute "Your Custom Protocol" \
  --context '{
    "team": "backend",
    "priority": "high",
    "deadline": "2024-12-31",
    "custom_field": "custom_value"
  }'
```

---

## Project Context Setup

### Step 1: Initialize Project Context

```bash
# Initialize framework for your project
aiagentsuite init

# This creates/updates memory-bank files
```

### Step 2: Configure Project-Specific Settings

Create a project configuration file:

```bash
cat > .aiagentsuite/config.yaml << 'EOF'
project:
  name: "Your Project Name"
  version: "1.0.0"
  description: "Project description"
  
team:
  name: "Your Team"
  members:
    - name: "Member 1"
      role: "Developer"
    - name: "Member 2"
      role: "Designer"

workflow:
  default_protocol: "Secure Code Implementation"
  auto_log_decisions: true
  memory_bank_auto_sync: true

integration:
  abeone_enabled: true
  abeone_project_path: "../abe-core-body-template"
EOF
```

### Step 3: Link with AbëONE Project

```bash
# From aiagentsuite directory
# Create symlink to AbëONE memory bank (optional)
ln -s ~/development/Abë-Core-Body-Dev-Hub/abe-core-body-template/docs/memory-bank \
      ./memory-bank-abeone

# Or configure workspace path
export AAI_WORKSPACE_PATH=~/development/Abë-Core-Body-Dev-Hub/abe-core-body-template
```

---

## Integration Personalization

### Step 1: Configure LSP/MCP Integration

```env
# LSP Server Configuration
LSP_PORT=3000
LSP_HOST=localhost
LSP_MAX_CONNECTIONS=100

# MCP Server Configuration
MCP_PORT=3001
MCP_HOST=localhost
MCP_MAX_SESSIONS=50
```

### Step 2: Configure External Services

```env
# LLM Services
AAI_OPENAI_API_KEY=sk-your-key
AAI_ANTHROPIC_API_KEY=sk-ant-your-key

# Monitoring
AAI_SENTRY_DSN=https://your-dsn@sentry.io/project
AAI_JAEGER_ENDPOINT=localhost:6831

# Database
AAI_DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# Cache
AAI_REDIS_URL=redis://localhost:6379/0
```

### Step 3: Configure OpenSpec Integration

```env
# OpenSpec Paths
OPENSPEC_CHANGES_PATH=./openspec/changes
OPENSPEC_SPECS_PATH=./openspec/specs

# OpenSpec Behavior
OPENSPEC_AUTO_SYNC=true
OPENSPEC_PROTOCOL_SUGGESTION=true
```

---

## Workflow Customization

### Step 1: Create Custom Workflow Scripts

```bash
# Create workflow directory
mkdir -p scripts/workflows

# Create daily workflow script
cat > scripts/workflows/daily-setup.sh << 'EOF'
#!/bin/bash
# Daily Development Setup

cd ~/Documents/AbeOne_Master/jimmy-aiagentsuite
source venv/bin/activate

echo "📋 Loading active context..."
aiagentsuite memory active

echo "📊 Checking progress..."
aiagentsuite memory progress

echo "🔍 Reviewing decisions..."
aiagentsuite memory decisions

echo "✅ Ready for development!"
EOF

chmod +x scripts/workflows/daily-setup.sh
```

### Step 2: Create Feature Development Workflow

```bash
cat > scripts/workflows/new-feature.sh << 'EOF'
#!/bin/bash
# New Feature Development Workflow

FEATURE_NAME=$1

if [ -z "$FEATURE_NAME" ]; then
    echo "Usage: $0 <feature-name>"
    exit 1
fi

cd ~/Documents/AbeOne_Master/jimmy-aiagentsuite
source venv/bin/activate

echo "🚀 Starting feature: $FEATURE_NAME"

# Initialize OpenSpec
aiagentsuite openspec init

# Execute feature development protocol
aiagentsuite execute "ContextGuard Feature Development" \
  --context "{\"feature\": \"$FEATURE_NAME\", \"security_level\": \"high\"}"

echo "✅ Feature development started!"
EOF

chmod +x scripts/workflows/new-feature.sh
```

### Step 3: Create Testing Workflow

```bash
cat > scripts/workflows/test-all.sh << 'EOF'
#!/bin/bash
# Comprehensive Testing Workflow

cd ~/Documents/AbeOne_Master/jimmy-aiagentsuite
source venv/bin/activate

echo "🧪 Running test suite..."
pytest tests/ -v --cov=src/aiagentsuite --cov-report=html

echo "🔍 Running security audit..."
aiagentsuite execute "ContextGuard Security Audit" \
  --context '{"component": "all"}'

echo "✅ Testing complete!"
EOF

chmod +x scripts/workflows/test-all.sh
```

---

## Advanced Customization

### Step 1: Custom Plugin Development

```bash
# Create plugin directory
mkdir -p src/aiagentsuite/plugins/custom

# Create custom plugin
cat > src/aiagentsuite/plugins/custom/my_plugin.py << 'EOF'
"""Custom Plugin for AI Agent Suite"""

from aiagentsuite.plugins.plugin_manager import BasePlugin

class MyCustomPlugin(BasePlugin):
    """Custom plugin implementation"""
    
    name = "my_custom_plugin"
    version = "1.0.0"
    
    async def initialize(self):
        """Initialize plugin"""
        pass
    
    async def execute(self, context):
        """Execute plugin logic"""
        return {"status": "success"}
EOF
```

### Step 2: Extend Framework Components

```python
# Example: Custom protocol executor
from aiagentsuite.protocols.executor import ProtocolExecutor

class CustomProtocolExecutor(ProtocolExecutor):
    """Extended protocol executor with custom logic"""
    
    async def execute_protocol(self, protocol_name, context):
        # Add custom pre-execution logic
        await self.custom_pre_execution(context)
        
        # Call parent execution
        result = await super().execute_protocol(protocol_name, context)
        
        # Add custom post-execution logic
        await self.custom_post_execution(result)
        
        return result
    
    async def custom_pre_execution(self, context):
        """Custom pre-execution logic"""
        pass
    
    async def custom_post_execution(self, result):
        """Custom post-execution logic"""
        pass
```

### Step 3: Custom Memory Bank Backend

```python
# Example: Custom memory bank storage
from aiagentsuite.memory_bank import MemoryBank

class CustomMemoryBank(MemoryBank):
    """Custom memory bank with additional features"""
    
    async def save_context(self, context_name, content):
        # Add custom validation
        if self.validate_content(content):
            await super().save_context(context_name, content)
        else:
            raise ValueError("Invalid content")
    
    def validate_content(self, content):
        """Custom validation logic"""
        return True
```

---

## Personalization Checklist

### Basic Personalization

- [ ] Create `.env` file with project-specific settings
- [ ] Configure framework paths
- [ ] Customize `projectBrief.md`
- [ ] Set up `activeContext.md` structure
- [ ] Configure `productContext.md` with requirements

### Intermediate Personalization

- [ ] Customize memory bank file structures
- [ ] Create custom protocols
- [ ] Set up project-specific workflows
- [ ] Configure integration settings
- [ ] Create workflow scripts

### Advanced Personalization

- [ ] Develop custom plugins
- [ ] Extend framework components
- [ ] Create custom memory bank backends
- [ ] Integrate with external tools
- [ ] Build custom protocol executors

---

## Best Practices

### 1. Start Simple

Begin with basic configuration and gradually add complexity as needed.

### 2. Document Customizations

Document all customizations in your project's documentation:

```markdown
# Customizations

## Protocols
- Custom Protocol 1: [Description]
- Custom Protocol 2: [Description]

## Memory Bank
- Custom context: [Description]

## Workflows
- Custom workflow: [Description]
```

### 3. Version Control

Commit all customizations to version control:

```bash
git add .env
git add memory-bank/
git add protocols/
git add scripts/
git commit -m "Personalize AI Agent Suite for project"
```

### 4. Team Alignment

Ensure team members are aware of customizations:

- Document in team wiki or README
- Share `.env.example` (without secrets)
- Provide setup instructions
- Review customizations in team meetings

### 5. Regular Updates

Keep customizations aligned with framework updates:

- Review framework changes
- Update customizations as needed
- Test after framework updates
- Maintain backward compatibility

---

## Troubleshooting Personalization

### Issue: Custom protocol not recognized

```bash
# Solution: Check protocol file location
ls -la protocols/

# Verify protocol format
cat protocols/Protocol_\ Your\ Protocol.md

# Check protocol path configuration
echo $AAI_PROTOCOLS_PATH
```

### Issue: Memory bank not loading

```bash
# Solution: Verify memory bank path
echo $AAI_MEMORY_BANK_PATH

# Check file permissions
ls -la memory-bank/

# Test memory bank access
aiagentsuite memory active
```

### Issue: Custom configuration not applied

```bash
# Solution: Reload configuration
# Restart framework or reload config

# Verify environment variables
env | grep AAI_

# Check .env file syntax
cat .env
```

---

## Quick Reference

```bash
# Personalization Commands
aiagentsuite init                    # Initialize framework
aiagentsuite memory active           # View active context
aiagentsuite protocols               # List protocols
aiagentsuite execute "Protocol"     # Execute protocol

# Configuration
export AAI_MEMORY_BANK_PATH=./custom/path
export AAI_PROTOCOLS_PATH=./custom/protocols

# Custom Workflows
./scripts/workflows/daily-setup.sh
./scripts/workflows/new-feature.sh feature-name
./scripts/workflows/test-all.sh
```

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

