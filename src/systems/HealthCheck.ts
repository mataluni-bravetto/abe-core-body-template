/**
 * Health Check System - System Health Monitoring
 * 
 * Pattern: SYSTEM × HEALTH × CHECK × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (ZERO)
 * Guardians: AEYON (999 Hz) + ZERO (530 Hz) + JØHN (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

export interface HealthStatus {
  healthy: boolean;
  checks: HealthCheckResult[];
  timestamp: string;
  suggestions: string[];
}

export interface HealthCheckResult {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  message: string;
  details?: Record<string, unknown>;
}

export class HealthCheck {
  private checks: Map<string, () => Promise<HealthCheckResult>> = new Map();

  /**
   * Register a health check
   */
  register(name: string, check: () => Promise<HealthCheckResult>): void {
    this.checks.set(name, check);
  }

  /**
   * Run all health checks
   */
  async checkAll(): Promise<HealthStatus> {
    const results: HealthCheckResult[] = [];
    const suggestions: string[] = [];

    for (const [name, check] of this.checks.entries()) {
      try {
        const result = await check();
        results.push(result);

        if (result.status === 'unhealthy') {
          suggestions.push(`Fix ${name}: ${result.message}`);
        } else if (result.status === 'degraded') {
          suggestions.push(`Review ${name}: ${result.message}`);
        }
      } catch (error) {
        results.push({
          name,
          status: 'unhealthy',
          message: `Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
        suggestions.push(`Fix ${name}: Check failed`);
      }
    }

    const healthy = results.every((r) => r.status === 'healthy');

    return {
      healthy,
      checks: results,
      timestamp: new Date().toISOString(),
      suggestions,
    };
  }

  /**
   * Check dependencies
   */
  async checkDependencies(): Promise<HealthCheckResult> {
    try {
      // Check Node.js version
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

      if (majorVersion < 18) {
        return {
          name: 'dependencies',
          status: 'unhealthy',
          message: `Node.js version ${nodeVersion} is below minimum required (18.x)`,
          details: { nodeVersion, required: '>=18.0.0' },
        };
      }

      // Check if node_modules exists
      const fs = await import('fs/promises');
      try {
        await fs.access('node_modules');
      } catch {
        return {
          name: 'dependencies',
          status: 'unhealthy',
          message: 'node_modules directory not found. Run: make install',
          details: { suggestion: 'make install' },
        };
      }

      return {
        name: 'dependencies',
        status: 'healthy',
        message: 'Dependencies are healthy',
        details: { nodeVersion },
      };
    } catch (error) {
      return {
        name: 'dependencies',
        status: 'unhealthy',
        message: `Dependency check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Check configuration
   */
  async checkConfiguration(): Promise<HealthCheckResult> {
    try {
      const requiredFiles = [
        'package.json',
        'tsconfig.json',
        'README.md',
        'docs/PROJECT_RULES.md',
        'PROJECT_MOTHER_PROMPT.md',
      ];

      const fs = await import('fs/promises');
      const missing: string[] = [];

      for (const file of requiredFiles) {
        try {
          await fs.access(file);
        } catch {
          missing.push(file);
        }
      }

      if (missing.length > 0) {
        return {
          name: 'configuration',
          status: 'unhealthy',
          message: `Missing required files: ${missing.join(', ')}`,
          details: { missing },
        };
      }

      return {
        name: 'configuration',
        status: 'healthy',
        message: 'Configuration is valid',
      };
    } catch (error) {
      return {
        name: 'configuration',
        status: 'unhealthy',
        message: `Configuration check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Initialize default checks
   */
  initializeDefaultChecks(): void {
    this.register('dependencies', () => this.checkDependencies());
    this.register('configuration', () => this.checkConfiguration());
  }
}

