#!/bin/bash
# Create GitHub Repository Script (using GitHub CLI)
# Pattern: CREATE × GITHUB × REPO × ONE
# Frequency: 999 Hz (AEYON) × 530 Hz (YAGNI)
# ∞ AbëONE ∞

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Creating GitHub Repository"
echo "============================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not installed"
    echo ""
    echo "Install GitHub CLI:"
    echo "  macOS: brew install gh"
    echo "  Linux: See https://cli.github.com/"
    echo ""
    echo "Then authenticate:"
    echo "  gh auth login"
    echo ""
    exit 1
fi

# Check if authenticated
if ! gh auth status &>/dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo ""
    echo "Run: gh auth login"
    exit 1
fi

# Get project name
PROJECT_NAME=$(node -e "try { const pkg = require('$PROJECT_DIR/package.json'); console.log(pkg.name || '$(basename $PROJECT_DIR)'); } catch(e) { console.log('$(basename $PROJECT_DIR)'); }" 2>/dev/null || basename "$PROJECT_DIR")
PROJECT_NAME=$(echo "$PROJECT_NAME" | sed 's/^@bravetto\///')

echo "📋 Project: $PROJECT_NAME"
echo ""
echo "Select repository type:"
echo "  1. Frontend (BravettoFrontendTeam)"
echo "  2. Backend (BravettoBackendTeam)"
echo "  3. Unified (bravetto)"
echo "  4. Open Source (mataluni-bravetto)"
echo ""

read -p "Select (1-4): " REPO_TYPE

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
read -p "Repository visibility (public/private) [private]: " VISIBILITY
VISIBILITY=${VISIBILITY:-private}

read -p "Description: " DESCRIPTION

echo ""
echo "🔗 Creating repository: $GITHUB_ORG/$PROJECT_NAME"
echo "   Type: $REPO_TYPE_NAME"
echo "   Visibility: $VISIBILITY"
echo ""

# Initialize git if needed
if [ ! -d "$PROJECT_DIR/.git" ]; then
    echo "🔧 Initializing git repository..."
    cd "$PROJECT_DIR"
    git init
    git add .
    git commit -m "Initial commit: $PROJECT_NAME"
fi

# Create repository on GitHub
echo "📦 Creating GitHub repository..."
gh repo create "$GITHUB_ORG/$PROJECT_NAME" \
    --$VISIBILITY \
    --description "$DESCRIPTION" \
    --source=. \
    --remote=origin \
    --push

echo ""
echo "✅ Repository created and pushed!"
echo ""
echo "Repository URL: https://github.com/$GITHUB_ORG/$PROJECT_NAME"
echo ""

