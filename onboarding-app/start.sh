#!/bin/bash
# Start the onboarding app on localhost:8000

echo "🔥 Starting AiGuardian Onboarding App..."
echo ""

# Check if port 8000 is available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 is already in use"
    echo "   Using existing server or kill process: lsof -ti:8000 | xargs kill"
    echo ""
fi

# Start Python HTTP server
cd "$(dirname "$0")"
echo "📡 Starting server on http://localhost:8000"
echo "✨ Open in browser: http://localhost:8000/index.html"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 -m http.server 8000

