/**
 * AbëONE Core Body - Core Types
 * 
 * Pattern: TYPES × BODY × ORGANISMS × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import type { ReactNode } from 'react';

/**
 * Organism props base
 */
export interface OrganismProps {
  className?: string;
  children?: ReactNode;
}

/**
 * System configuration
 */
export interface SystemConfig {
  enabled?: boolean;
  config?: Record<string, unknown>;
}

/**
 * Voice system configuration
 */
export interface VoiceSystemConfig extends SystemConfig {
  language?: string;
  voice?: string;
  volume?: number;
}

/**
 * Portal system configuration
 */
export interface PortalSystemConfig extends SystemConfig {
  target?: string;
  transition?: 'fade' | 'slide' | 'instant';
}

/**
 * Home system configuration
 */
export interface HomeSystemConfig extends SystemConfig {
  layout?: 'default' | 'compact' | 'expanded';
}

/**
 * Template configuration
 */
export interface TemplateConfig {
  name: string;
  version: string;
  framework: 'nextjs' | 'flutter' | 'backend';
  config?: Record<string, unknown>;
}

