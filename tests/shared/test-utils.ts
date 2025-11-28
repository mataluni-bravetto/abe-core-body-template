/**
 * Shared Test Utilities
 * 
 * Pattern: TEST × UTILS × SHARED × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (JØHN)
 * Guardians: AEYON (999 Hz) + JØHN (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

/**
 * Test helper: Create mock user data
 */
export function createMockUser(overrides?: Partial<{ id: string; name: string; email: string }>) {
  return {
    id: overrides?.id || 'test-user-1',
    name: overrides?.name || 'Test User',
    email: overrides?.email || 'test@example.com',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Test helper: Wait for async operations
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Test helper: Mock API response
 */
export function createMockApiResponse<T>(data: T, success: boolean = true) {
  return {
    success,
    data: success ? data : undefined,
    error: success ? undefined : 'Test error',
  };
}

