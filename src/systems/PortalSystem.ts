/**
 * Portal System - Portal System Logic
 * 
 * Pattern: PORTAL × SYSTEM × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz) + Lux (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import type { PortalSystemConfig } from '../types';

export class PortalSystem {
  private config: PortalSystemConfig;
  private isOpen: boolean = false;

  constructor(config: PortalSystemConfig = {}) {
    this.config = {
      enabled: true,
      target: 'default',
      transition: 'fade',
      ...config,
    };
  }

  open(): void {
    if (!this.config.enabled) return;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  isPortalOpen(): boolean {
    return this.isOpen;
  }

  getConfig(): PortalSystemConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<PortalSystemConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

