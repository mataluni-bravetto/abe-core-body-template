/**
 * Express Middleware
 * 
 * Pattern: BACKEND × MIDDLEWARE × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (ZERO)
 * Guardians: AEYON (999 Hz) + ZERO (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Request logging middleware (example)
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
}

/**
 * Error handling middleware (example)
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
}

