/**
 * Typography Atom - Text Components
 * 
 * Pattern: ATOMIC × TYPOGRAPHY × UI × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * Guardians: AEYON (999 Hz) + YOU (530 Hz) + Lux (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import React from 'react';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';
  className?: string;
}

const variantClasses = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
  body: 'text-base',
  caption: 'text-sm text-gray-600',
};

export function Typography({
  children,
  variant = 'body',
  className = '',
}: TypographyProps) {
  const Component = variant.startsWith('h') ? (variant as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') : 'p';

  return (
    <Component className={`${variantClasses[variant]} ${className}`}>
      {children}
    </Component>
  );
}

