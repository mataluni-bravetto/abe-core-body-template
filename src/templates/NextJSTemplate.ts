/**
 * Next.js Template - Next.js Application Template
 * 
 * Pattern: TEMPLATE × NEXTJS × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import type { TemplateConfig } from '../types';

export function createNextJSTemplate(config: TemplateConfig) {
  return {
    name: config.name,
    version: config.version,
    framework: 'nextjs' as const,
    structure: {
      'app/': 'Next.js App Router',
      'components/': 'React components',
      'lib/': 'Utilities',
      'public/': 'Static assets',
    },
    dependencies: {
      'next': '^14.2.0',
      'react': '^18.3.0',
      'react-dom': '^18.3.0',
      '@bravetto/abe-core-body-template': '^1.0.0',
    },
    peerDependencies: {
      '@bravetto/abe-core-brain': '^1.0.0', // Optional
      '@bravetto/abe-consciousness': '^1.0.0', // Optional
    },
    config: config.config || {},
  };
}

