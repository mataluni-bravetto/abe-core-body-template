#!/bin/bash
# Create complete documentation package for Phani

PACKAGE_NAME="PHANI_TESTING_PACKAGE"
PACKAGE_DIR="phani_testing_package"
ZIP_FILE="${PACKAGE_NAME}_$(date +%Y%m%d).zip"

echo "📦 Creating complete testing package for Phani..."

# Create package directory
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Copy main documentation
echo "📄 Copying main documentation..."
cp tests/PHANI_CONSOLE_TESTING_GUIDE.pdf "$PACKAGE_DIR/" 2>/dev/null
cp tests/PHANI_TESTING_GUIDE.html "$PACKAGE_DIR/" 2>/dev/null
cp tests/PHANI_CONSOLE_TESTING_GUIDE.md "$PACKAGE_DIR/" 2>/dev/null
cp tests/README_FOR_PHANI.md "$PACKAGE_DIR/README.md" 2>/dev/null

# Copy test files
echo "🧪 Copying test files..."
cp tests/production-test-suite.js "$PACKAGE_DIR/" 2>/dev/null
cp debug/epistemic-reliability-debugger.js "$PACKAGE_DIR/" 2>/dev/null

# Copy additional documentation
echo "📚 Copying additional documentation..."
cp tests/PRODUCTION_TESTING_GUIDE.md "$PACKAGE_DIR/" 2>/dev/null
cp tests/RUN_TESTS_NOW.md "$PACKAGE_DIR/" 2>/dev/null
cp tests/TEST_EXECUTION_CHECKLIST.md "$PACKAGE_DIR/" 2>/dev/null
cp tests/QUICK_START_TESTING.md "$PACKAGE_DIR/" 2>/dev/null
cp tests/PRODUCTION_TESTING_READY.md "$PACKAGE_DIR/" 2>/dev/null

# Copy supporting files
echo "🔧 Copying supporting files..."
cp tests/validate-test-readiness.js "$PACKAGE_DIR/" 2>/dev/null

# Create package info file
cat > "$PACKAGE_DIR/PACKAGE_INFO.txt" << EOL
AiGuardian Chrome Extension - Testing Package for Phani
========================================================

Package Date: $(date)
Package Version: 1.0.0
Extension Version: 1.0.0

Contents:
- PHANI_CONSOLE_TESTING_GUIDE.pdf (Main guide - START HERE)
- PHANI_TESTING_GUIDE.html (HTML version)
- PHANI_CONSOLE_TESTING_GUIDE.md (Markdown source)
- README.md (Package overview)
- production-test-suite.js (Test suite)
- epistemic-reliability-debugger.js (Reliability validator)
- Additional documentation files

Quick Start:
1. Read PHANI_CONSOLE_TESTING_GUIDE.pdf
2. Load extension in Chrome
3. Follow step-by-step instructions
4. Run tests and document results

For questions, refer to README.md or the PDF guide.
EOL

# Create zip file
echo "📦 Creating zip file..."
cd "$PACKAGE_DIR"
zip -r "../$ZIP_FILE" . -q
cd ..

# Clean up
rm -rf "$PACKAGE_DIR"

echo ""
echo "✅ Package created successfully!"
echo "📦 File: $ZIP_FILE"
ls -lh "$ZIP_FILE" | awk '{print "   Size: " $5}'
echo ""
echo "📋 Package contents:"
unzip -l "$ZIP_FILE" | tail -n +4 | head -n -2 | awk '{print "   " $4}'
echo ""
echo "✅ Ready to send to Phani!"
