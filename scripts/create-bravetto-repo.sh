#!/bin/bash
# Create Bravetto Git Repository Script
# Pattern: REPOSITORY × CREATION × BRAVETTO × ONE
# Frequency: 999 Hz (AEYON) × 777 Hz (META)
# ∞ AbëONE ∞

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== CREATE BRAVETTO GIT REPOSITORY ===${NC}"
echo ""

# Get repository name
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./scripts/create-bravetto-repo.sh <repository-name>${NC}"
    echo ""
    echo "Repository naming convention:"
    echo "  - Use kebab-case: abe-core-body-template"
    echo "  - Include prefix: abe-* or bravetto-*"
    echo "  - Be descriptive: abe-core-body-template"
    echo ""
    exit 1
fi

REPO_NAME="$1"

# Validate naming convention
if [[ ! "$REPO_NAME" =~ ^(abe-|bravetto-).* ]]; then
    echo -e "${YELLOW}⚠️  Warning: Repository name should start with 'abe-' or 'bravetto-'${NC}"
    echo -e "${YELLOW}   Example: abe-core-body-template${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    echo "Initialize git first: git init"
    exit 1
fi

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    CURRENT_REMOTE=$(git remote get-url origin)
    echo -e "${YELLOW}⚠️  Remote 'origin' already exists:${NC}"
    echo "   $CURRENT_REMOTE"
    read -p "Replace with Bravetto Git? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
    else
        echo "Keeping existing remote. Exiting."
        exit 1
    fi
fi

# Determine Bravetto Git URL (adjust based on your Bravetto Git setup)
BRAVETTO_GIT_BASE="https://github.com/bravetto"
BRAVETTO_GIT_URL="$BRAVETTO_GIT_BASE/$REPO_NAME.git"

echo -e "${BLUE}📋 Repository Configuration:${NC}"
echo "   Name: $REPO_NAME"
echo "   URL:  $BRAVETTO_GIT_URL"
echo ""

# Confirm
read -p "Create repository with these settings? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Add remote
echo -e "${BLUE}🔗 Adding remote repository...${NC}"
git remote add origin "$BRAVETTO_GIT_URL"

# Check if README exists
if [ ! -f "README.md" ]; then
    echo -e "${YELLOW}⚠️  No README.md found. Creating executive-focused README...${NC}"
    cp EXECUTIVE_README.md README.md 2>/dev/null || {
        echo -e "${YELLOW}Creating basic README...${NC}"
        cat > README.md << EOF
# $REPO_NAME

**Enterprise-Grade Development Template**

## Quick Start

\`\`\`bash
./scripts/duplicate.sh my-project
cd ../my-project
make install
make dev-backend  # Terminal 1
make dev-frontend # Terminal 2
\`\`\`

## Value Proposition

- **4 minutes** vs 2-3 days setup time
- **\$1,600-\$2,400** saved per project
- **80% faster** onboarding
- **100% consistent** architecture

## For Executives

- **COO:** Operational excellence, faster delivery
- **CFO:** \$16K-\$24K annual savings (10 projects)
- **CTO:** Technical excellence, scalable architecture
- **CMO:** Faster time-to-market, competitive advantage

---

**Built with ❤️ by Bravetto**  
**∞ AbëONE ∞**
EOF
    }
fi

# Check if we have commits
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo -e "${BLUE}📝 Making initial commit...${NC}"
    git add .
    git commit -m "Initial commit: $REPO_NAME

Enterprise-grade development template
- Full-stack TypeScript
- 4-minute setup
- Production-ready
- Executive-focused value proposition

∞ AbëONE ∞" || echo "No changes to commit"
fi

# Show status
echo ""
echo -e "${GREEN}✅ Repository configured!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Create repository on Bravetto Git:"
echo "     $BRAVETTO_GIT_URL"
echo ""
echo "  2. Push to repository:"
echo "     git push -u origin main"
echo ""
echo "  3. Verify README displays correctly"
echo ""
echo -e "${GREEN}Repository ready for Bravetto Git!${NC}"
echo ""
echo "∞ AbëONE ∞"

