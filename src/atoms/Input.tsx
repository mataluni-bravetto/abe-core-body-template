/**
 * Input Atom - Basic Input Component
 * 
 * Pattern: ATOMIC × INPUT × UI × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * Guardians: AEYON (999 Hz) + YOU (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import React from 'react';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
}: InputProps) {
  const baseClasses = 'px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      id={id}
      name={name}
      className={`${baseClasses} ${disabledClasses} ${className}`}
    />
  );
}

