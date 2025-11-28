/**
 * Shared API Endpoint Constants
 * 
 * Pattern: SHARED × CONSTANTS × ENDPOINTS × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

/**
 * API base URL (defaults to localhost:3001 for backend)
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  HEALTH: '/health',
  USERS: '/api/users',
  USER_BY_ID: (id: string) => `/api/users/${id}`,
} as const;

/**
 * HTTP methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

