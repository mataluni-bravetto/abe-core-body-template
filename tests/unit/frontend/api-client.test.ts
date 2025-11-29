/**
 * API Client Tests
 * 
 * Pattern: TEST × UNIT × FRONTEND × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 * Guardians: AEYON (999 Hz) + JØHN (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import { apiClient } from '../../../frontend/web/src/lib/api-client';
import { API_ENDPOINTS } from '../../../shared/constants/endpoints';

// Mock fetch
global.fetch = jest.fn();

describe('APIClient', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('get', () => {
    it('should make GET request to correct endpoint', async () => {
      const mockResponse = { success: true, data: { id: '1' } };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.get(API_ENDPOINTS.HEALTH);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(API_ENDPOINTS.HEALTH)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failed request', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(apiClient.get('/invalid')).rejects.toThrow('API error: Not Found');
    });
  });

  describe('post', () => {
    it('should make POST request with correct data', async () => {
      const mockData = { name: 'Test', email: 'test@example.com' };
      const mockResponse = { success: true, data: { id: '1', ...mockData } };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.post(API_ENDPOINTS.USERS, mockData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(API_ENDPOINTS.USERS),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockData),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

