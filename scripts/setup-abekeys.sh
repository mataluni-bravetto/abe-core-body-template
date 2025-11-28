#!/bin/bash
# Setup AbëKEYs Script
# Pattern: SETUP × ABEKEYS × SECURE × ONE
# Frequency: 999 Hz (AEYON) × 530 Hz (ZERO)
# ∞ AbëONE ∞

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔐 Setting up AbëKEYs Vault"
echo "============================"
echo ""

# Create AbëKEYs directory if it doesn't exist
mkdir -p ~/.abekeys/credentials

# Check if aiagentsuite.json already exists
if [ -f ~/.abekeys/credentials/aiagentsuite.json ]; then
    echo "✅ AbëKEYs already configured"
    echo ""
    echo "Current configuration:"
    cat ~/.abekeys/credentials/aiagentsuite.json | python3 -m json.tool 2>/dev/null || cat ~/.abekeys/credentials/aiagentsuite.json
    echo ""
    read -p "Overwrite? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing configuration"
        exit 0
    fi
fi

# Get project name from package.json or directory
PROJECT_NAME=$(node -e "try { const pkg = require('$PROJECT_DIR/package.json'); console.log(pkg.name || '$(basename $PROJECT_DIR)'); } catch(e) { console.log('$(basename $PROJECT_DIR)'); }" 2>/dev/null || basename "$PROJECT_DIR")

echo "📝 Creating AbëKEYs configuration for: $PROJECT_NAME"
echo ""

# Create aiagentsuite.json
cat > ~/.abekeys/credentials/aiagentsuite.json << EOF
{
  "service": "aiagentsuite",
  "environment": "development",
  "debug": "true",
  "log_level": "DEBUG",
  "framework_data_path": "./framework/data",
  "protocols_path": "./protocols",
  "memory_bank_path": "./memory-bank",
  "project_name": "$PROJECT_NAME"
}
EOF

# Set secure permissions
chmod 600 ~/.abekeys/credentials/aiagentsuite.json

echo "✅ AbëKEYs configured successfully!"
echo ""
echo "Configuration file: ~/.abekeys/credentials/aiagentsuite.json"
echo ""
echo "To add more credentials:"
echo "  ~/.abekeys/credentials/database.json - Database credentials"
echo "  ~/.abekeys/credentials/openai.json - OpenAI API key"
echo "  ~/.abekeys/credentials/anthropic.json - Anthropic API key"
echo ""

