#!/bin/bash
# Interactive Onboarding Chat Flow
# Pattern: ONBOARDING × INTERACTIVE × CHAT × ONE
# ∞ AbëONE ∞

GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

chat() { echo -e "${CYAN}🤖 AbëONE:${NC} $1"; }
user() { echo -e "${GREEN}👤 You:${NC} $1"; }
success() { echo -e "${GREEN}✅ $1${NC}"; }

echo ""
chat "Welcome! Let's get you started in 5 minutes. Ready? (yes/no)"
read -r ready
if [[ ! "$ready" =~ ^[Yy] ]]; then
    chat "No problem! Run this script when you're ready. See docs/ONBOARDING.md for details."
    exit 0
fi

echo ""
chat "Step 1: What's your project name? (lowercase, hyphens only, e.g., my-awesome-app)"
read -r PROJECT_NAME

if [[ ! "$PROJECT_NAME" =~ ^[a-z0-9-]+$ ]]; then
    chat "❌ Invalid name. Use lowercase letters, numbers, and hyphens only."
    exit 1
fi

chat "Great! Duplicating template to: $PROJECT_NAME"
./scripts/duplicate.sh "$PROJECT_NAME" || exit 1
success "Template duplicated!"

echo ""
chat "Step 2: Navigating to your project and setting up..."
cd "../$PROJECT_NAME" || exit 1
make setup || exit 1
success "Setup complete!"

echo ""
chat "Step 3: Verifying everything works..."
make verify || exit 1
success "Verification passed!"

echo ""
chat "🎉 You're ready! Next steps:"
echo ""
echo "  Terminal 1 (Backend):  make dev-backend"
echo "  Terminal 2 (Frontend): make dev-frontend"
echo ""
chat "Run these commands in separate terminals to start development!"
chat "See docs/ONBOARDING.md for detailed guide."
