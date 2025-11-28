/**
 * SearchBar Molecule - Search Input with Button
 * 
 * Pattern: MOLECULE × SEARCH × BAR × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * Guardians: AEYON (999 Hz) + YOU (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        type="text"
        value={query}
        onChange={setQuery}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  );
}

