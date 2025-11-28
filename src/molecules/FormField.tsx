/**
 * FormField Molecule - Input with Label
 * 
 * Pattern: MOLECULE × FORM × FIELD × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * Guardians: AEYON (999 Hz) + YOU (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import React from 'react';
import { Input, type InputProps } from '../atoms/Input';
import { Typography } from '../atoms/Typography';

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  helperText?: string;
}

export function FormField({
  label,
  error,
  helperText,
  id,
  required,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="mb-4">
      <label htmlFor={fieldId} className="block mb-1">
        <Typography variant="body" className="font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Typography>
      </label>
      <Input
        id={fieldId}
        required={required}
        {...inputProps}
        className={`${inputProps.className || ''} ${error ? 'border-red-500' : ''}`}
      />
      {error && (
        <Typography variant="caption" className="text-red-500 mt-1">
          {error}
        </Typography>
      )}
      {helperText && !error && (
        <Typography variant="caption" className="mt-1">
          {helperText}
        </Typography>
      )}
    </div>
  );
}

