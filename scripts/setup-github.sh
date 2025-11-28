#!/bin/bash
# Setup GitHub Repository Script
# Pattern: SETUP × GITHUB × REPOSITORY × ONE
# Frequency: 999 Hz (AEYON) × 777 Hz (META)
# ∞ AbëONE ∞

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔗 Setting up GitHub Repository"
echo "================================"
echo ""

# Get project name from package.json or directory
PROJECT_NAME=$(node -e "try { const pkg = require('$PROJECT_DIR/package.json'); console.log(pkg.name || '$(basename $PROJECT_DIR)'); } catch(e) { console.log('$(basename $PROJECT_DIR)'); }" 2>/dev/null || basename "$PROJECT_DIR")

# Remove @bravetto/ prefix if present
PROJECT_NAME=$(echo "$PROJECT_NAME" | sed 's/^@bravetto\///')

echo "📋 Project: $PROJECT_NAME"
echo ""
echo "GitHub Organizations:"
echo "  1. Frontend: https://github.com/orgs/BravettoFrontendTeam"
echo "  2. Backend:  https://github.com/orgs/BravettoBackendTeam"
echo "  3. Unified:  https://github.com/bravetto"
echo "  4. Open Source: https://github.com/mataluni-bravetto"
echo ""

read -p "Select repository type (1=Frontend, 2=Backend, 3=Unified, 4=OpenSource): " REPO_TYPE

case $REPO_TYPE in
    1)
        GITHUB_ORG="BravettoFrontendTeam"
        REPO_TYPE_NAME="Frontend"
        ;;
    2)
        GITHUB_ORG="BravettoBackendTeam"
        REPO_TYPE_NAME="Backend"
        ;;
    3)
        GITHUB_ORG="bravetto"
        REPO_TYPE_NAME="Unified"
        ;;
    4)
        GITHUB_ORG="mataluni-bravetto"
        REPO_TYPE_NAME="Open Source"
        ;;
    *)
        echo "❌ Invalid selection"
        exit 1
        ;;
esac

echo ""
echo "📦 Repository: $GITHUB_ORG/$PROJECT_NAME"
echo ""

# Check if git is initialized
if [ ! -d "$PROJECT_DIR/.git" ]; then
    echo "🔧 Initializing git repository..."
    cd "$PROJECT_DIR"
    git init
    git add .
    git commit -m "Initial commit: $PROJECT_NAME"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi

# Check if remote exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists"
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "   Current: $CURRENT_REMOTE"
    read -p "Update remote? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin "https://github.com/$GITHUB_ORG/$PROJECT_NAME.git"
        echo "✅ Remote updated"
    fi
else
    echo "🔗 Adding GitHub remote..."
    git remote add origin "https://github.com/$GITHUB_ORG/$PROJECT_NAME.git"
    echo "✅ Remote added: https://github.com/$GITHUB_ORG/$PROJECT_NAME.git"
fi

echo ""
echo "📝 Next steps:"
echo ""
echo "1. Create repository on GitHub:"
echo "   https://github.com/orgs/$GITHUB_ORG/repositories/new"
echo "   Repository name: $PROJECT_NAME"
echo "   Description: (add your description)"
echo "   Visibility: (select public/private)"
echo ""
echo "2. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "3. Or use GitHub CLI (if installed):"
echo "   gh repo create $GITHUB_ORG/$PROJECT_NAME --public --source=. --remote=origin --push"
echo ""

