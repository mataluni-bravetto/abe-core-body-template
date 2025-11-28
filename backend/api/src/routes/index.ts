/**
 * API Routes
 * 
 * Pattern: BACKEND × ROUTES × API × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import { Express } from 'express';
import { userRoutes } from './users';

export function setupRoutes(app: Express): void {
  // API routes
  app.use('/api', userRoutes);
}

