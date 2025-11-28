/**
 * Example Component
 * 
 * Pattern: FRONTEND × COMPONENT × EXAMPLE × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * Guardians: AEYON (999 Hz) + YOU (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@shared/constants/endpoints';
import type { CreateUserRequest, ApiResponse, User } from '@shared/types/api';
import { validateUserInput } from '@shared/utils/validation';

export function ExampleComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using shared validation
    const validation = validateUserInput(name, email);
    if (!validation.valid) {
      setMessage(`Error: ${validation.error}`);
      return;
    }

    try {
      const userData: CreateUserRequest = { name, email };
      const response = await apiClient.post<ApiResponse<User>>(
        API_ENDPOINTS.USERS,
        userData
      );

      if (response.success && response.data) {
        setMessage(`Success! Created user: ${response.data.name}`);
        setName('');
        setEmail('');
      } else {
        setMessage(`Error: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to create user'}`);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Example Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.startsWith('Error') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

