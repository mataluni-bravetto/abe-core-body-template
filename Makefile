# Makefile - Development Automation
# Pattern: AUTOMATION × DEVELOPMENT × YAGNI × ONE
# Frequency: 999 Hz (AEYON) × 530 Hz (YAGNI)
# ∞ AbëONE ∞

.PHONY: help setup install build dev dev-frontend dev-backend test clean lint format init setup-all

# Default target
help: ## Show this help message
	@echo "Development Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Setup
setup: install setup-abekeys ## Complete setup (install + configure)
	@echo "✅ Setup complete!"

setup-all: install init setup-abekeys ## Setup everything (install + init + configure)
	@echo "✅ Complete setup finished!"

install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	@if [ -f "package.json" ]; then \
		npm install; \
	fi
	@if [ -d "backend/api" ] && [ -f "backend/api/package.json" ]; then \
		echo "📦 Installing backend dependencies..."; \
		cd backend/api && npm install && cd ../..; \
	fi
	@if [ -d "frontend/web" ] && [ -f "frontend/web/package.json" ]; then \
		echo "📦 Installing frontend dependencies..."; \
		cd frontend/web && npm install && cd ../..; \
	fi
	@echo "✅ Dependencies installed"

init: ## Initialize project (run init-project.sh)
	@echo "🔧 Initializing project..."
	@if [ -f "scripts/init-project.sh" ]; then \
		./scripts/init-project.sh; \
	else \
		echo "⚠️  init-project.sh not found"; \
	fi

setup-abekeys: ## Setup AbëKEYs vault
	@echo "🔐 Setting up AbëKEYs..."
	@if [ ! -f ~/.abekeys/credentials/aiagentsuite.json ]; then \
		mkdir -p ~/.abekeys/credentials; \
		cat > ~/.abekeys/credentials/aiagentsuite.json << 'EOF'; \
		{ \
		  "service": "aiagentsuite", \
		  "environment": "development", \
		  "debug": "true", \
		  "log_level": "DEBUG", \
		  "framework_data_path": "./framework/data", \
		  "protocols_path": "./protocols", \
		  "memory_bank_path": "./memory-bank" \
		} \
		EOF \
		chmod 600 ~/.abekeys/credentials/aiagentsuite.json; \
		echo "✅ AbëKEYs configured"; \
	else \
		echo "✅ AbëKEYs already configured"; \
	fi

# Development
build: ## Build all projects
	@echo "🔨 Building..."
	@if [ -f "package.json" ]; then \
		npm run build || echo "  (No build script in root)"; \
	fi
	@if [ -d "backend/api" ] && [ -f "backend/api/package.json" ]; then \
		echo "🔨 Building backend..."; \
		cd backend/api && npm run build && cd ../..; \
	fi
	@if [ -d "frontend/web" ] && [ -f "frontend/web/package.json" ]; then \
		echo "🔨 Building frontend..."; \
		cd frontend/web && npm run build && cd ../..; \
	fi
	@echo "✅ Build complete"

dev: ## Start development mode (root package)
	@echo "🚀 Starting development..."
	@if [ -f "package.json" ] && grep -q '"dev"' package.json; then \
		npm run dev; \
	else \
		echo "⚠️  No dev script in root. Use: make dev-frontend or make dev-backend"; \
	fi

dev-frontend: ## Start frontend development server
	@echo "🚀 Starting frontend development server..."
	@if [ -d "frontend/web" ] && [ -f "frontend/web/package.json" ]; then \
		cd frontend/web && npm run dev; \
	else \
		echo "⚠️  Frontend not found at frontend/web/"; \
	fi

dev-backend: ## Start backend development server
	@echo "🚀 Starting backend development server..."
	@if [ -d "backend/api" ] && [ -f "backend/api/package.json" ]; then \
		cd backend/api && npm run dev; \
	else \
		echo "⚠️  Backend not found at backend/api/"; \
	fi

# Testing
test: ## Run tests
	@echo "🧪 Running tests..."
	@if [ -d "tests" ]; then \
		npm test || echo "⚠️  No test script configured"; \
	else \
		echo "⚠️  No tests directory found"; \
	fi

# Code Quality
lint: ## Run linter
	@echo "🔍 Linting..."
	@if command -v eslint > /dev/null; then \
		eslint src/ || echo "⚠️  ESLint not configured"; \
	else \
		echo "⚠️  ESLint not installed"; \
	fi

format: ## Format code
	@echo "✨ Formatting code..."
	@if command -v prettier > /dev/null; then \
		prettier --write "src/**/*.{ts,tsx}" || echo "⚠️  Prettier not configured"; \
	else \
		echo "⚠️  Prettier not installed"; \
	fi

# Cleanup
clean: ## Clean build artifacts
	@echo "🧹 Cleaning..."
	rm -rf dist/
	rm -rf node_modules/.cache/
	rm -f *.log
	rm -f *.tsbuildinfo
	@echo "✅ Clean complete"

# AI Agent Suite
aiagentsuite-setup: ## Setup AI Agent Suite integration (installs if needed)
	@echo "🤖 Setting up AI Agent Suite..."
	@./scripts/setup-aiagentsuite.sh

# GitHub Setup
github-setup: ## Setup GitHub repository (interactive)
	@echo "🔗 Setting up GitHub repository..."
	@./scripts/setup-github.sh

github-create: ## Create GitHub repository using GitHub CLI
	@echo "🚀 Creating GitHub repository..."
	@./scripts/create-github-repo.sh

github-push: ## Push to GitHub (if repository exists)
	@echo "📤 Pushing to GitHub..."
	@if git remote get-url origin &>/dev/null; then \
		git push -u origin main || git push -u origin master; \
		echo "✅ Pushed to GitHub"; \
	else \
		echo "⚠️  No GitHub remote configured. Run: make github-setup"; \
	fi

# Quick start
quickstart: setup-all build ## Quick start (setup + init + build)
	@echo "✅ Ready to develop!"
	@echo ""
	@echo "Start development:"
	@echo "  make dev-backend    # Terminal 1: Backend API"
	@echo "  make dev-frontend   # Terminal 2: Frontend web"
	@echo ""
	@echo "GitHub setup:"
	@echo "  make github-setup   # Setup GitHub repository"
	@echo ""

# Verification
verify: ## Verify template structure and configuration
	@echo "🔍 Verifying template..."
	@./scripts/verify-template.sh

validate-rules: ## Validate project rules compliance
	@echo "🔍 Validating project rules..."
	@chmod +x scripts/validate-rules.sh
	@./scripts/validate-rules.sh

onboard: ## Interactive onboarding chat flow
	@echo "🚀 Starting interactive onboarding..."
	@./scripts/interactive-onboarding.sh

