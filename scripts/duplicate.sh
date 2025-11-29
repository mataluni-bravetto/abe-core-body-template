#!/bin/bash
# Duplicate Template Script
# Pattern: DUPLICATE × TEMPLATE × YAGNI × ONE
# Frequency: 999 Hz (AEYON) × 530 Hz (YAGNI)
# ∞ AbëONE ∞

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Validate project name argument
if [ -z "$1" ]; then
    echo "❌ Error: Project name required"
    echo ""
    echo "Usage: ./scripts/duplicate.sh <project-name>"
    echo ""
    echo "Requirements:"
    echo "  - Project name must be lowercase"
    echo "  - Alphanumeric characters and hyphens only"
    echo "  - Example: my-awesome-project, api-service, web-app"
    exit 1
fi

PROJECT_NAME="$1"

# Validate project name format
if [[ ! "$PROJECT_NAME" =~ ^[a-z0-9-]+$ ]]; then
    echo "❌ Error: Invalid project name format"
    echo ""
    echo "Project name must be:"
    echo "  - Lowercase only"
    echo "  - Alphanumeric characters and hyphens only"
    echo "  - Example: my-awesome-project"
    exit 1
fi

# Determine target directory (parent of template)
TARGET_DIR="$(cd "$TEMPLATE_DIR/.." && pwd)/$PROJECT_NAME"

# Check if target directory already exists
if [ -d "$TARGET_DIR" ]; then
    echo "❌ Error: Directory already exists: $TARGET_DIR"
    exit 1
fi

echo "🚀 Duplicating Template"
echo "======================"
echo ""
echo "Template: $TEMPLATE_DIR"
echo "Target:   $TARGET_DIR"
echo ""

# Create target directory
mkdir -p "$TARGET_DIR"

# Copy all files except excluded directories/files
echo "📋 Copying template files..."
if command -v rsync > /dev/null 2>&1; then
    rsync -av \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='dist' \
        --exclude='build' \
        --exclude='.next' \
        --exclude='out' \
        --exclude='coverage' \
        --exclude='*.log' \
        --exclude='.DS_Store' \
        --exclude='*.tsbuildinfo' \
        "$TEMPLATE_DIR/" "$TARGET_DIR/"
else
    # Fallback to cp if rsync not available
    cp -r "$TEMPLATE_DIR"/* "$TARGET_DIR/" 2>/dev/null || true
    cp -r "$TEMPLATE_DIR"/.[!.]* "$TARGET_DIR/" 2>/dev/null || true
    # Remove excluded directories
    rm -rf "$TARGET_DIR/node_modules" "$TARGET_DIR/.git" "$TARGET_DIR/dist" \
           "$TARGET_DIR/build" "$TARGET_DIR/.next" "$TARGET_DIR/out" \
           "$TARGET_DIR/coverage" 2>/dev/null || true
fi

echo "✅ Files copied"
echo ""

# Replace project name in package.json files
echo "🔧 Replacing project name in package.json files..."

# Detect sed command syntax (macOS vs Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    SED_INPLACE="sed -i ''"
else
    SED_INPLACE="sed -i"
fi

# Root package.json
if [ -f "$TARGET_DIR/package.json" ]; then
    $SED_INPLACE "s/abe-core-body-template/$PROJECT_NAME/g" "$TARGET_DIR/package.json"
fi

# Frontend package.json
if [ -f "$TARGET_DIR/frontend/web/package.json" ]; then
    $SED_INPLACE "s/abe-core-body-template-frontend-web/$PROJECT_NAME-frontend-web/g" "$TARGET_DIR/frontend/web/package.json"
fi

# Backend package.json
if [ -f "$TARGET_DIR/backend/api/package.json" ]; then
    $SED_INPLACE "s/abe-core-body-template-backend-api/$PROJECT_NAME-backend-api/g" "$TARGET_DIR/backend/api/package.json"
fi

echo "✅ Package names updated"
echo ""

# Replace in README.md
if [ -f "$TARGET_DIR/README.md" ]; then
    $SED_INPLACE "s/abe-core-body-template/$PROJECT_NAME/g" "$TARGET_DIR/README.md"
fi

# Replace in repository URL (package.json)
if [ -f "$TARGET_DIR/package.json" ]; then
    $SED_INPLACE "s|github.com/bravetto/abe-core-body-template.git|github.com/bravetto/$PROJECT_NAME.git|g" "$TARGET_DIR/package.json"
fi

echo "✅ Documentation updated"
echo ""

# Initialize git repository
echo "🔧 Initializing git repository..."
cd "$TARGET_DIR"
git init
git add .
git commit -m "Initial commit: Duplicated from abe-core-body-template"
echo "✅ Git repository initialized"
echo ""

echo "===================================="
echo "✅ Template Duplication Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "  1. cd $TARGET_DIR"
echo "  2. make setup-all    # Install dependencies and configure"
echo "  3. make github-setup # Setup GitHub repository (optional)"
echo "  4. make dev-backend  # Start backend (Terminal 1)"
echo "  5. make dev-frontend # Start frontend (Terminal 2)"
echo ""

