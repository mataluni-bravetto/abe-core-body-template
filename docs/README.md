# AI Guardians Chrome Extension Documentation

This directory contains all documentation for the AI Guardians Chrome extension project.

## 📁 Directory Structure

### 📋 [setup/](./setup/)
Setup and configuration documentation for developers and administrators.

- **[SETUP_CHECKLIST.md](./setup/SETUP_CHECKLIST.md)** - Complete setup checklist for Clerk authentication and configuration
- **[BACKEND_SCORE_REQUIREMENTS.md](./setup/BACKEND_SCORE_REQUIREMENTS.md)** - Backend API requirements for score fields and response structure

### 👥 [user-guide/](./user-guide/)
User-facing documentation and testing guides.

- **[USER_TESTING_GUIDE.md](./user-guide/USER_TESTING_GUIDE.md)** - Comprehensive end-to-end user testing guide for the extension

### 🧪 [testing/](./testing/)
Testing documentation, instructions, and test reports.

- **[TEST_E2E_INSTRUCTIONS.md](./testing/TEST_E2E_INSTRUCTIONS.md)** - End-to-end testing instructions and procedures
- **[E2E_TEST_SUMMARY.md](./testing/E2E_TEST_SUMMARY.md)** - Summary of end-to-end test results
- **[MERGE_TEST_REPORT.md](./testing/MERGE_TEST_REPORT.md)** - Test reports from merge operations

### 🔧 [development/](./development/)
Development, verification, and internal documentation.

- **[VERIFICATION_SUMMARY.md](./development/VERIFICATION_SUMMARY.md)** - Backend processing verification summary
- **[VERIFICATION_RESULTS.md](./development/VERIFICATION_RESULTS.md)** - Detailed verification test results
- **[BACKEND_PROCESSING_VERIFICATION.md](./development/BACKEND_PROCESSING_VERIFICATION.md)** - Backend processing verification details
- **[SCORE_UPDATE_VERIFICATION.md](./development/SCORE_UPDATE_VERIFICATION.md)** - Score update verification tests
- **[REVIEW_VALIDATION.md](./development/REVIEW_VALIDATION.md)** - Code review validation results
- **[VALIDATION_REPORT.md](./development/VALIDATION_REPORT.md)** - General validation reports
- **[DO_OR_DO_NOT_NOW.md](./development/DO_OR_DO_NOT_NOW.md)** - Development manifesto and immediate action items

### 🤖 [models/](../models/)
Standalone ML model development and training documentation.

|- **[README.md](../models/README.md)** - Complete model development guide
|- **[TRAINING_GUIDE.md](../models/TRAINING_GUIDE.md)** - Comprehensive training instructions
|- **[SETUP.md](../models/SETUP.md)** - Environment setup for model development

### 🚀 [releases/](./releases/)
PR summaries, release notes, and deployment documentation.

- **[PR_SUMMARY.md](./releases/PR_SUMMARY.md)** - Pull request summaries and merge details

### 🐛 [bug-fixes/](./bug-fixes/)
Bug fix documentation and issue resolution summaries.

- **[BUGBOT_FIXES_SUMMARY.md](./bug-fixes/BUGBOT_FIXES_SUMMARY.md)** - Summary of automated bug fixes
- **[TOKEN_RETRY_FIXES_SUMMARY.md](./bug-fixes/TOKEN_RETRY_FIXES_SUMMARY.md)** - Token retry mechanism fixes
- **[STORAGE_QUOTA_FIX_REVIEW.md](./bug-fixes/STORAGE_QUOTA_FIX_REVIEW.md)** - Storage quota fix documentation

### 📊 [reports/](./reports/)
Generated reports, audit results, and automated test outputs.

- **[integration-test-report.json](./reports/integration-test-report.json)** - JSON report from integration tests
- **[security-vulnerability-audit-report.json](./reports/security-vulnerability-audit-report.json)** - Security vulnerability audit results

## 🎯 Quick Start

### For New Developers
1. Start with **[setup/SETUP_CHECKLIST.md](./setup/SETUP_CHECKLIST.md)** for environment setup
2. Read **[setup/BACKEND_SCORE_REQUIREMENTS.md](./setup/BACKEND_SCORE_REQUIREMENTS.md)** for API integration
3. Follow **[user-guide/USER_TESTING_GUIDE.md](./user-guide/USER_TESTING_GUIDE.md)** for testing

### For Testing
1. Use **[testing/TEST_E2E_INSTRUCTIONS.md](./testing/TEST_E2E_INSTRUCTIONS.md)** for running tests
2. Check **[testing/E2E_TEST_SUMMARY.md](./testing/E2E_TEST_SUMMARY.md)** for test results

### For Troubleshooting
1. Check **[development/VERIFICATION_SUMMARY.md](./development/VERIFICATION_SUMMARY.md)** for system verification
2. Review **[bug-fixes/](./bug-fixes/)** for known issues and fixes
3. Check **[reports/](./reports/)** for security and integration test results

## 📝 Contributing to Documentation

When adding new documentation:

1. **Choose the appropriate directory** based on the content type
2. **Use descriptive filenames** with `.md` extension
3. **Follow the existing format** and style conventions
4. **Update this README** if adding new subdirectories or major changes

## 🔍 Finding Information

- **Setup/Config**: Look in `setup/`
- **How to use**: Check `user-guide/`
- **Testing**: See `testing/`
- **Development**: Browse `development/`
- **Releases**: Check `releases/`
- **Bug fixes**: See `bug-fixes/`
- **Reports**: Look in `reports/`

## 📞 Support

For questions about the documentation or the extension, refer to the appropriate guide in each subdirectory or check the development documentation for current status and known issues.
