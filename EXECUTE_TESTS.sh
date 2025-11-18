#!/bin/bash
# Production Testing Execution Script
# Run this to validate readiness before Chrome testing

echo "🔍 Validating Production Testing Readiness..."
echo ""

# Check test files
if [ -f "tests/production-test-suite.js" ]; then
    echo "✅ Production test suite found"
else
    echo "❌ Production test suite missing"
    exit 1
fi

# Check debugger
if [ -f "debug/epistemic-reliability-debugger.js" ]; then
    echo "✅ Epistemic reliability debugger found"
else
    echo "❌ Epistemic reliability debugger missing"
    exit 1
fi

# Check source files
if [ -f "src/mutex-helper.js" ] && [ -f "src/circuit-breaker.js" ]; then
    echo "✅ Mutex and circuit breaker modules found"
else
    echo "❌ Required modules missing"
    exit 1
fi

# Validate syntax
echo ""
echo "🔍 Validating syntax..."
node -c tests/production-test-suite.js && echo "✅ Test suite syntax valid" || exit 1
node -c src/mutex-helper.js && echo "✅ Mutex helper syntax valid" || exit 1
node -c src/circuit-breaker.js && echo "✅ Circuit breaker syntax valid" || exit 1

echo ""
echo "✅ All validations passed!"
echo ""
echo "🚀 Ready for Chrome extension testing!"
echo ""
echo "Next steps:"
echo "1. Load extension in Chrome (chrome://extensions/)"
echo "2. Open service worker console"
echo "3. Run: importScripts('tests/production-test-suite.js');"
echo "4. Run: await runProductionTests();"
