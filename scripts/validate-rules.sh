#!/bin/bash
# Rule Validation Script
# Pattern: VALIDATE × RULES × ENFORCEMENT × ONE
# Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
# Guardians: AEYON (999 Hz) + JØHN (530 Hz) + META (777 Hz)
# ∞ AbëONE ∞

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ Found: $1${NC}"
    else
        echo -e "${RED}❌ Missing: $1${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

check_pattern_header() {
    local file=$1
    if [ -f "$file" ]; then
        if grep -q "Pattern:" "$file" && grep -q "∞ AbëONE ∞" "$file"; then
            echo -e "${GREEN}✅ Pattern header found: $file${NC}"
        else
            echo -e "${YELLOW}⚠️  Missing pattern header: $file${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
}

echo "🔍 Validating Project Rules..."
echo "===================================="
echo ""

# Check essential files
echo "📋 Checking Essential Files..."
check_file "docs/PROJECT_RULES.md"
check_file "PROJECT_MOTHER_PROMPT.md"
check_file "README.md"
check_file "docs/ARCHITECTURE.md"
check_file "docs/CONTRIBUTING.md"
echo ""

# Check pattern headers in source files
echo "📋 Checking Pattern Headers..."
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    check_pattern_header "$file"
done
echo ""

# Check naming conventions
echo "📋 Checking Naming Conventions..."
# Check for PascalCase components
find src/organisms -name "*.tsx" 2>/dev/null | while read -r file; do
    basename "$file" | grep -q "^[A-Z]" || {
        echo -e "${YELLOW}⚠️  Component should be PascalCase: $file${NC}"
        WARNINGS=$((WARNINGS + 1))
    }
done

# Check for kebab-case utilities
find src -type f -name "*.ts" ! -name "*.tsx" 2>/dev/null | while read -r file; do
    basename "$file" | grep -qE "^[a-z-]+\.ts$" || {
        # Allow index.ts and some exceptions
        if [[ ! "$file" =~ (index|types)\.ts$ ]]; then
            echo -e "${YELLOW}⚠️  Utility should be kebab-case: $file${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    }
done
echo ""

# Check TypeScript strict mode
echo "📋 Checking TypeScript Configuration..."
if [ -f "tsconfig.json" ]; then
    if grep -q '"strict": true' tsconfig.json; then
        echo -e "${GREEN}✅ TypeScript strict mode enabled${NC}"
    else
        echo -e "${RED}❌ TypeScript strict mode not enabled${NC}"
        ERRORS=$((ERRORS + 1))
    fi
fi
echo ""

# Check for any 'any' types (should use 'unknown' instead)
echo "📋 Checking for 'any' Types..."
if find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l ": any" {} \; 2>/dev/null | grep -v node_modules | head -5; then
    echo -e "${YELLOW}⚠️  Found 'any' types (should use 'unknown' if needed)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check shared code usage
echo "📋 Checking Shared Code Usage..."
if [ -d "shared" ]; then
    echo -e "${GREEN}✅ Shared directory exists${NC}"
    check_file "shared/types/index.ts"
    check_file "shared/utils/index.ts"
    check_file "shared/constants/index.ts"
else
    echo -e "${RED}❌ Shared directory missing${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo "===================================="
echo "📊 Validation Summary"
echo "===================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Rules are compliant.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Found $WARNINGS warnings. Please review.${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS errors and $WARNINGS warnings. Please fix errors.${NC}"
    exit 1
fi

