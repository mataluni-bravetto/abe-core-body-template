/**
 * Home Page
 * 
 * Pattern: FRONTEND × PAGE × HOME × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * Guardians: AEYON (999 Hz) + YOU (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

'use client';

import { useState, useEffect } from 'react';
import { ExampleComponent } from '@/components/ExampleComponent';
import { apiClient } from '@/lib/api-client';
import type { User, ApiResponse } from '@shared/types/api';

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: Fetch users from backend API
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // This would call the backend API
        // const response = await apiClient.get<ApiResponse<User[]>>('/api/users');
        // setUsers(response.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          ∞ AbëONE Frontend Example ∞
        </h1>
        
        <div className="mb-8">
          <p className="text-lg mb-4">
            This is a minimal Next.js frontend example demonstrating:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Clear separation from backend</li>
            <li>Integration with shared code</li>
            <li>API client usage</li>
            <li>AbëONE organism integration</li>
          </ul>
        </div>

        <ExampleComponent />

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Backend Integration</h2>
          <p className="text-sm text-gray-600">
            Backend API runs on: <code>http://localhost:3001</code>
          </p>
          <p className="text-sm text-gray-600">
            Health check: <code>http://localhost:3001/health</code>
          </p>
        </div>
      </div>
    </main>
  );
}

