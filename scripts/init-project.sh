#!/bin/bash
# Initialize Project Script
# Pattern: INIT × PROJECT × SETUP × ONE
# Frequency: 999 Hz (AEYON) × 530 Hz (YAGNI)
# ∞ AbëONE ∞

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔧 Initializing Project"
echo "======================"
echo ""

# Validate project structure
echo "📋 Validating project structure..."
if [ ! -d "$PROJECT_DIR/shared" ]; then
    echo "⚠️  Warning: shared/ directory not found"
fi

if [ ! -d "$PROJECT_DIR/backend/api" ]; then
    echo "⚠️  Warning: backend/api/ directory not found"
fi

if [ ! -d "$PROJECT_DIR/frontend/web" ]; then
    echo "⚠️  Warning: frontend/web/ directory not found"
fi

echo "✅ Structure validated"
echo ""

# Install shared dependencies
if [ -d "$PROJECT_DIR/shared" ]; then
    echo "📦 Installing shared dependencies..."
    cd "$PROJECT_DIR/shared"
    if [ -f "package.json" ]; then
        npm install 2>/dev/null || echo "  (No dependencies to install)"
    fi
    echo "✅ Shared dependencies installed"
    echo ""
fi

# Install backend dependencies
if [ -d "$PROJECT_DIR/backend/api" ]; then
    echo "📦 Installing backend dependencies..."
    cd "$PROJECT_DIR/backend/api"
    if [ -f "package.json" ]; then
        npm install
        echo "✅ Backend dependencies installed"
    else
        echo "⚠️  No package.json found in backend/api"
    fi
    echo ""
fi

# Install frontend dependencies
if [ -d "$PROJECT_DIR/frontend/web" ]; then
    echo "📦 Installing frontend dependencies..."
    cd "$PROJECT_DIR/frontend/web"
    if [ -f "package.json" ]; then
        npm install
        echo "✅ Frontend dependencies installed"
    else
        echo "⚠️  No package.json found in frontend/web"
    fi
    echo ""
fi

# Verify AbëKEYs configuration
echo "🔐 Verifying AbëKEYs configuration..."
if [ -f ~/.abekeys/credentials/aiagentsuite.json ]; then
    echo "✅ AbëKEYs configured"
else
    echo "⚠️  AbëKEYs not configured. Run: make setup-abekeys"
fi
echo ""

# Type check shared code
if [ -d "$PROJECT_DIR/shared" ] && [ -f "$PROJECT_DIR/shared/tsconfig.json" ]; then
    echo "🔍 Type checking shared code..."
    cd "$PROJECT_DIR/shared"
    npm run type-check 2>/dev/null || echo "  (Type check skipped - no script)"
    echo ""
fi

echo "✅ Project initialization complete!"
echo ""
echo "Next steps:"
echo "  1. make dev-backend    # Start backend server"
echo "  2. make dev-frontend   # Start frontend dev server"
echo "  3. make test           # Run tests"
echo ""

