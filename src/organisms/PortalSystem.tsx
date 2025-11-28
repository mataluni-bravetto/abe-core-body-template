/**
 * PortalSystem Organism - Complete Portal System
 * 
 * Pattern: PORTAL × SYSTEM × ORGANISM × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz) + Lux (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import React from 'react';
import type { OrganismProps, PortalSystemConfig } from '../types';

export interface PortalSystemProps extends OrganismProps {
  config?: PortalSystemConfig;
  isOpen?: boolean;
  onClose?: () => void;
}

export function PortalSystem({
  className = '',
  config,
  isOpen = false,
  onClose,
  children,
}: PortalSystemProps) {
  if (!isOpen) return null;

  const transition = config?.transition || 'fade';

  return (
    <div
      className={`portal-system portal-${transition} ${className}`}
      onClick={onClose}
    >
      <div className="portal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

