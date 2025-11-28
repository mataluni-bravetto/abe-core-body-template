/**
 * Backend API Server
 * 
 * Pattern: BACKEND × SERVER × API × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import express, { Express } from 'express';
import cors from 'cors';
import { setupRoutes } from './routes';

const PORT = process.env.PORT || 3001;

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
setupRoutes(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend API server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

