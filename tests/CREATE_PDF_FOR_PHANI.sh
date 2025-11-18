#!/bin/bash
# Create PDF for Phani - Console Testing Guide

cd "$(dirname "$0")"

echo "📄 Creating PDF for Phani..."

# Try multiple PDF engines
if command -v wkhtmltopdf &> /dev/null; then
    echo "Using wkhtmltopdf..."
    pandoc PHANI_CONSOLE_TESTING_GUIDE.md -o PHANI_CONSOLE_TESTING_GUIDE.pdf \
        --pdf-engine=wkhtmltopdf \
        -V geometry:margin=1in \
        --highlight-style=tango
elif command -v xelatex &> /dev/null; then
    echo "Using xelatex..."
    pandoc PHANI_CONSOLE_TESTING_GUIDE.md -o PHANI_CONSOLE_TESTING_GUIDE.pdf \
        --pdf-engine=xelatex \
        -V geometry:margin=1in \
        -V fontsize=11pt
else
    echo "Using default PDF engine..."
    pandoc PHANI_CONSOLE_TESTING_GUIDE.md -o PHANI_CONSOLE_TESTING_GUIDE.pdf \
        -V geometry:margin=1in \
        -V fontsize=11pt \
        --highlight-style=tango
fi

if [ -f "PHANI_CONSOLE_TESTING_GUIDE.pdf" ]; then
    echo "✅ PDF created successfully!"
    echo "📄 File: $(pwd)/PHANI_CONSOLE_TESTING_GUIDE.pdf"
    ls -lh PHANI_CONSOLE_TESTING_GUIDE.pdf
else
    echo "⚠️ PDF creation may have failed"
    echo "Alternative: Open PHANI_TESTING_GUIDE.html in browser and print to PDF"
fi

