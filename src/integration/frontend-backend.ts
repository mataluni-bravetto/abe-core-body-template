/**
 * Frontend + Backend Integration
 * 
 * Pattern: INTEGRATION × FRONTEND × BACKEND × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

/**
 * API Response type (shared pattern)
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API client for frontend-backend integration
 * 
 * Uses shared constants and types pattern:
 * - Import API_BASE_URL from shared/constants/endpoints
 * - Use ApiResponse<T> for type-safe responses
 * - Works with both frontend/web and backend/api
 */
export class APIClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  /**
   * GET request
   * @param endpoint - API endpoint path
   * @returns Promise with typed response
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * POST request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @returns Promise with typed response
   */
  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * PUT request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @returns Promise with typed response
   */
  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint path
   * @returns Promise with typed response
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }
}

