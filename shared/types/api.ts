/**
 * Shared API Types
 * 
 * Pattern: SHARED × TYPES × API × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

/**
 * Example API response type
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Example user type (shared between frontend and backend)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/**
 * Example request/response types for API endpoints
 */
export interface GetUserRequest {
  id: string;
}

export interface GetUserResponse extends ApiResponse<User> {}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateUserResponse extends ApiResponse<User> {}

