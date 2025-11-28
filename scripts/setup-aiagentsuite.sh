#!/bin/bash
# Setup AI Agent Suite Integration Script
# Pattern: SETUP × AIAGENTSUITE × INTEGRATION × ONE
# Frequency: 999 Hz (AEYON) × 777 Hz (META)
# ∞ AbëONE ∞

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🤖 Setting up AI Agent Suite Integration"
echo "========================================"
echo ""

# Check if AI Agent Suite exists
# Try multiple possible locations
if [ -d "$PROJECT_DIR/../jimmy-aiagentsuite" ]; then
    AIAGENTSUITE_DIR="$PROJECT_DIR/../jimmy-aiagentsuite"
elif [ -d "$HOME/Documents/AbeOne_Master/jimmy-aiagentsuite" ]; then
    AIAGENTSUITE_DIR="$HOME/Documents/AbeOne_Master/jimmy-aiagentsuite"
else
    AIAGENTSUITE_DIR=""
fi

# If not found, offer to clone from GitHub
if [ -z "$AIAGENTSUITE_DIR" ] || [ ! -d "$AIAGENTSUITE_DIR" ]; then
    echo "⚠️  AI Agent Suite not found locally"
    echo ""
    echo "GitHub repository: https://github.com/Jimmy-Dejesus/aiagentsuite"
    echo ""
    read -p "Clone from GitHub to $PROJECT_DIR/../jimmy-aiagentsuite? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📥 Cloning AI Agent Suite repository..."
        cd "$(dirname "$PROJECT_DIR")"
        git clone https://github.com/Jimmy-Dejesus/aiagentsuite.git jimmy-aiagentsuite
        AIAGENTSUITE_DIR="$PROJECT_DIR/../jimmy-aiagentsuite"
        echo "✅ Repository cloned"
    else
        echo ""
        echo "Expected locations:"
        echo "  - $PROJECT_DIR/../jimmy-aiagentsuite"
        echo "  - $HOME/Documents/AbeOne_Master/jimmy-aiagentsuite"
        echo ""
        echo "To set up AI Agent Suite manually:"
        echo "  1. Clone: git clone https://github.com/Jimmy-Dejesus/aiagentsuite.git"
        echo "  2. Run: cd jimmy-aiagentsuite && python3 -m venv venv"
        echo "  3. Run: ./scripts/setup-aiagentsuite.sh (this will install the package)"
        echo ""
        exit 0
    fi
fi

# Check if virtual environment exists, create if not
if [ ! -d "$AIAGENTSUITE_DIR/venv" ]; then
    echo "📦 Creating virtual environment..."
    cd "$AIAGENTSUITE_DIR"
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment and install/initialize
echo "🔧 Setting up AI Agent Suite..."
cd "$AIAGENTSUITE_DIR"

# Source the virtual environment
source venv/bin/activate

# Check if package is installed
if ! command -v aiagentsuite &> /dev/null; then
    echo "📦 Installing AI Agent Suite package..."
    pip install -e ".[dev]"
    echo "✅ Package installed"
else
    echo "✅ AI Agent Suite already installed"
fi

# Initialize AI Agent Suite
echo "📝 Initializing memory bank..."
aiagentsuite init 2>/dev/null || echo "  (Already initialized)"

echo "📋 Setting workspace path..."
WORKSPACE_PATH="$PROJECT_DIR"

echo "✅ AI Agent Suite integration ready!"
echo ""
echo "Usage:"
echo "  cd $AIAGENTSUITE_DIR"
echo "  source venv/bin/activate"
echo "  aiagentsuite --workspace $WORKSPACE_PATH memory active"
echo "  aiagentsuite --workspace $WORKSPACE_PATH execute \"Protocol Name\" --context '...'"
echo ""

