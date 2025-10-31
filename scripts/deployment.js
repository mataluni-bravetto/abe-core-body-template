/**
 * AiGuardian Chrome Extension - Deployment Script
 * 
 * This script automates the deployment preparation process by:
 * - Organizing files into proper directories
 * - Creating production builds
 * - Validating deployment readiness
 * - Generating deployment reports
 */

const fs = require('fs');
const path = require('path');

class DeploymentScript {
  constructor() {
    this.projectRoot = process.cwd();
    this.deploymentResults = [];
    this.startTime = Date.now();
  }

  /**
   * Run complete deployment preparation
   */
  async runDeploymentPreparation() {
    console.log('🚀 Starting AiGuardian Extension Deployment Preparation');
    console.log('=' .repeat(60));
    
    const steps = [
      { name: 'Validate Project Structure', fn: this.validateProjectStructure },
      { name: 'Organize Files', fn: this.organizeFiles },
      { name: 'Create Production Build', fn: this.createProductionBuild },
      { name: 'Validate Deployment Readiness', fn: this.validateDeploymentReadiness },
      { name: 'Generate Deployment Report', fn: this.generateDeploymentReport }
    ];

    for (const step of steps) {
      try {
        console.log(`\n📋 Executing: ${step.name}`);
        const result = await step.fn.call(this);
        this.deploymentResults.push({
          name: step.name,
          status: 'COMPLETED',
          result,
          timestamp: new Date().toISOString()
        });
        console.log(`✅ ${step.name}: COMPLETED`);
      } catch (error) {
        this.deploymentResults.push({
          name: step.name,
          status: 'FAILED',
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.error(`❌ ${step.name}: FAILED - ${error.message}`);
      }
    }

    await this.generateFinalReport();
  }

  /**
   * Validate project structure
   */
  async validateProjectStructure() {
    const requiredFiles = [
      'manifest.json',
      'src/background.js',
      'src/content.js',
      'src/gateway.js',
      'src/popup.html',
      'src/popup.js',
      'src/options.html',
      'src/options.js',
      'src/testing.js',
      'src/logging.js',
      'src/input-validator.js',
      'src/data-encryption.js',
      'src/rate-limiter.js',
      'icons/icon16.png',
      'icons/icon32.png',
      'icons/icon48.png',
      'icons/icon128.png'
    ];

    const missingFiles = [];
    const presentFiles = [];

    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        presentFiles.push(file);
      } else {
        missingFiles.push(file);
      }
    }

    return {
      total_required: requiredFiles.length,
      present: presentFiles.length,
      missing: missingFiles.length,
      missing_files: missingFiles,
      completion_rate: (presentFiles.length / requiredFiles.length) * 100
    };
  }

  /**
   * Organize files into proper directories
   */
  async organizeFiles() {
    const organization = {
      docs_moved: 0,
      tests_moved: 0,
      reports_moved: 0,
      scripts_moved: 0
    };

    // Move documentation files
    const docFiles = fs.readdirSync(this.projectRoot).filter(file => 
      file.endsWith('.md') && !file.startsWith('README')
    );
    
    for (const file of docFiles) {
      const sourcePath = path.join(this.projectRoot, file);
      const destPath = path.join(this.projectRoot, 'docs', file);
      
      if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
        fs.renameSync(sourcePath, destPath);
        organization.docs_moved++;
      }
    }

    // Move test files
    const testFiles = fs.readdirSync(this.projectRoot).filter(file => 
      file.includes('test') || file.includes('verification') || file.includes('audit') || file.includes('enhancement') || file.includes('fixes')
    );
    
    for (const file of testFiles) {
      const sourcePath = path.join(this.projectRoot, file);
      const destPath = path.join(this.projectRoot, 'tests', file);
      
      if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
        fs.renameSync(sourcePath, destPath);
        organization.tests_moved++;
      }
    }

    // Move report files
    const reportFiles = fs.readdirSync(this.projectRoot).filter(file => 
      file.endsWith('.json')
    );
    
    for (const file of reportFiles) {
      const sourcePath = path.join(this.projectRoot, file);
      const destPath = path.join(this.projectRoot, 'reports', file);
      
      if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
        fs.renameSync(sourcePath, destPath);
        organization.reports_moved++;
      }
    }

    return organization;
  }

  /**
   * Create production build
   */
  async createProductionBuild() {
    const buildInfo = {
      files_included: [],
      files_excluded: [],
      total_size: 0
    };

    // Files to include in production build
    const includeFiles = [
      'manifest.json',
      'src/',
      'icons/',
      'docs/README.md'
    ];

    // Files to exclude from production build
    const excludeFiles = [
      'tests/',
      'reports/',
      'scripts/',
      'docs/SETUP_GUIDE.md',
      'docs/BACKEND_INTEGRATION.md',
      'docs/SECURITY_GUIDE.md',
      'docs/DEPLOYMENT_GUIDE.md',
      '.git/',
      'node_modules/',
      '*.log',
      '*.tmp'
    ];

    // Calculate build size
    let totalSize = 0;
    for (const pattern of includeFiles) {
      if (fs.existsSync(path.join(this.projectRoot, pattern))) {
        const stats = fs.statSync(path.join(this.projectRoot, pattern));
        if (stats.isDirectory()) {
          // Calculate directory size
          const dirSize = this.calculateDirectorySize(path.join(this.projectRoot, pattern));
          totalSize += dirSize;
        } else {
          totalSize += stats.size;
        }
        buildInfo.files_included.push(pattern);
      }
    }

    buildInfo.total_size = totalSize;
    buildInfo.files_excluded = excludeFiles;

    return buildInfo;
  }

  /**
   * Validate deployment readiness
   */
  async validateDeploymentReadiness() {
    const validation = {
      manifest_valid: false,
      security_score: 0,
      test_coverage: 0,
      documentation_complete: false,
      production_ready: false
    };

    // Validate manifest.json
    try {
      const manifestPath = path.join(this.projectRoot, 'manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      validation.manifest_valid = (
        manifest.manifest_version === 3 &&
        manifest.name &&
        manifest.version &&
        manifest.background &&
        manifest.content_scripts
      );
    } catch (error) {
      validation.manifest_valid = false;
    }

    // Check security score (from reports)
    try {
      const securityReportPath = path.join(this.projectRoot, 'reports', 'security-vulnerability-audit-report.json');
      if (fs.existsSync(securityReportPath)) {
        const securityReport = JSON.parse(fs.readFileSync(securityReportPath, 'utf8'));
        validation.security_score = securityReport.overall_security_score || 0;
      }
    } catch (error) {
      validation.security_score = 0;
    }

    // Check test coverage
    try {
      const testReportPath = path.join(this.projectRoot, 'reports', 'test-report.json');
      if (fs.existsSync(testReportPath)) {
        const testReport = JSON.parse(fs.readFileSync(testReportPath, 'utf8'));
        validation.test_coverage = testReport.overall_pass_rate || 0;
      }
    } catch (error) {
      validation.test_coverage = 0;
    }

    // Check documentation completeness
    const requiredDocs = [
      'docs/README.md',
      'docs/SETUP_GUIDE.md',
      'docs/BACKEND_INTEGRATION.md',
      'docs/SECURITY_GUIDE.md',
      'docs/DEPLOYMENT_GUIDE.md'
    ];

    validation.documentation_complete = requiredDocs.every(doc => 
      fs.existsSync(path.join(this.projectRoot, doc))
    );

    // Overall production readiness
    validation.production_ready = (
      validation.manifest_valid &&
      validation.security_score >= 80 &&
      validation.test_coverage >= 90 &&
      validation.documentation_complete
    );

    return validation;
  }

  /**
   * Generate deployment report
   */
  async generateDeploymentReport() {
    const report = {
      deployment_preparation: this.deploymentResults,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime
    };

    const reportPath = path.join(this.projectRoot, 'reports', 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return {
      report_generated: true,
      report_path: reportPath,
      total_steps: this.deploymentResults.length,
      successful_steps: this.deploymentResults.filter(r => r.status === 'COMPLETED').length
    };
  }

  /**
   * Generate final report
   */
  async generateFinalReport() {
    const successfulSteps = this.deploymentResults.filter(r => r.status === 'COMPLETED').length;
    const totalSteps = this.deploymentResults.length;
    const successRate = (successfulSteps / totalSteps) * 100;

    console.log('\n🎉 Deployment Preparation Complete!');
    console.log('=' .repeat(60));
    console.log(`✅ Successful Steps: ${successfulSteps}/${totalSteps}`);
    console.log(`📊 Success Rate: ${successRate.toFixed(1)}%`);
    console.log(`⏱️  Total Duration: ${((Date.now() - this.startTime) / 1000).toFixed(2)}s`);

    if (successRate >= 90) {
      console.log('\n🚀 Extension is ready for production deployment!');
    } else {
      console.log('\n⚠️  Some issues were encountered. Please review the deployment report.');
    }

    console.log('\n📋 Next Steps:');
    console.log('1. Review the deployment report in reports/deployment-report.json');
    console.log('2. Test the extension in Chrome developer mode');
    console.log('3. Configure backend API endpoints');
    console.log('4. Package for Chrome Web Store submission');
  }

  /**
   * Calculate directory size
   */
  calculateDirectorySize(dirPath) {
    let totalSize = 0;
    
    try {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          totalSize += this.calculateDirectorySize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
    } catch (error) {
      // Ignore errors for inaccessible directories
    }
    
    return totalSize;
  }
}

// Run deployment preparation if called directly
if (require.main === module) {
  const deployment = new DeploymentScript();
  deployment.runDeploymentPreparation().catch(console.error);
}

module.exports = DeploymentScript;
