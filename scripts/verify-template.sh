#!/bin/bash
# Template Verification Script
# Pattern: VERIFY × TEMPLATE × YAGNI × ONE
# Frequency: 999 Hz (AEYON) × 530 Hz (YAGNI)
# ∞ AbëONE ∞

set -e

echo "🔍 Verifying Template Structure..."
echo "===================================="
echo ""

ERRORS=0
WARNINGS=0

# Check essential files exist
check_file() {
    if [ ! -f "$1" ]; then
        echo "❌ Missing: $1"
        ((ERRORS++))
        return 1
    else
        echo "✅ Found: $1"
        return 0
    fi
}

# Check directory exists
check_dir() {
    if [ ! -d "$1" ]; then
        echo "❌ Missing directory: $1"
        ((ERRORS++))
        return 1
    else
        echo "✅ Found directory: $1"
        return 0
    fi
}

# Check file doesn't exist (should be deleted)
check_deleted() {
    if [ -f "$1" ]; then
        echo "⚠️  Should be deleted: $1"
        ((WARNINGS++))
        return 1
    else
        echo "✅ Correctly deleted: $1"
        return 0
    fi
}

echo "📋 Checking Essential Files..."
echo ""

# Essential files
check_file "package.json"
check_file "README.md"
check_file "Makefile"
check_file "tsconfig.json"
check_file ".gitignore"

echo ""
echo "📋 Checking Essential Documentation..."
echo ""

# Essential docs
check_file "docs/ONBOARDING.md"
check_file "docs/DUPLICATION_GUIDE.md"
check_file "docs/ARCHITECTURE.md"
check_file "docs/DEVELOPMENT_WORKFLOW.md"
check_file "docs/CONTRIBUTING.md"
check_file "docs/GITHUB_DEPLOYMENT.md"
check_file "docs/PROJECT_RULES.md"
check_file "PROJECT_MOTHER_PROMPT.md"

echo ""
echo "📋 Checking Scripts..."
echo ""

# Essential scripts
check_file "scripts/duplicate.sh"
check_file "scripts/setup-abekeys.sh"
check_file "scripts/setup-github.sh"
check_file "scripts/create-github-repo.sh"
check_file "scripts/init-project.sh"

echo ""
echo "📋 Checking Project Structure..."
echo ""

# Essential directories
check_dir "src"
check_dir "frontend/web"
check_dir "backend/api"
check_dir "shared"
check_dir "tests"

echo ""
echo "📋 Verifying Deleted Files (should not exist)..."
echo ""

# Check deleted files don't exist
check_deleted "docs/COMPREHENSIVE_ANALYSIS.md"
check_deleted "docs/DELTA_ANALYSIS.md"
check_deleted "docs/TEMPLATE_ANALYSIS.md"
check_deleted "docs/TEMPLATE_COMPLETE.md"
check_deleted "docs/FINAL_TEMPLATE_SUMMARY.md"
check_deleted "docs/INTEGRATION_COMPLETE.md"
check_deleted "docs/SETUP_SUMMARY.md"
check_deleted "docs/QUICK_REFERENCE.md"
check_deleted "docs/GITHUB_INTEGRATION_COMPLETE.md"
check_deleted "shared/package.json"
check_deleted "tests/integration"

echo ""
echo "📋 Checking Package.json Files..."
echo ""

# Check package.json files
if [ -f "frontend/web/package.json" ]; then
    if grep -q "@bravetto/abe-core-body-template" "frontend/web/package.json"; then
        echo "❌ Broken dependency still exists in frontend/web/package.json"
        ((ERRORS++))
    else
        echo "✅ Frontend package.json is clean"
    fi
fi

if [ -f "shared/package.json" ]; then
    echo "❌ shared/package.json should not exist"
    ((ERRORS++))
else
    echo "✅ shared/package.json correctly removed"
fi

echo ""
echo "📋 Checking Makefile..."
echo ""

# Check Makefile doesn't reference shared/package.json
if grep -q "shared/package.json" "Makefile"; then
    echo "⚠️  Makefile still references shared/package.json"
    ((WARNINGS++))
else
    echo "✅ Makefile is clean"
fi

echo ""
echo "📋 Checking Duplicate Script..."
echo ""

# Check duplicate.sh doesn't reference shared/package.json
if grep -q "shared/package.json" "scripts/duplicate.sh"; then
    echo "⚠️  duplicate.sh still references shared/package.json"
    ((WARNINGS++))
else
    echo "✅ duplicate.sh is clean"
fi

echo ""
echo "===================================="
echo "📊 Verification Summary"
echo "===================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed! Template is ready."
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  $WARNINGS warning(s) found, but no errors."
    echo "Template is functional but may need cleanup."
    exit 0
else
    echo "❌ $ERRORS error(s) and $WARNINGS warning(s) found."
    echo "Please fix errors before using template."
    exit 1
fi

