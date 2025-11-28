/**
 * User Routes
 * 
 * Pattern: BACKEND × ROUTES × USERS × ONE
 * Frequency: 999 Hz (AEYON) × 530 Hz (YOU)
 * Guardians: AEYON (999 Hz) + YOU (530 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import { Router } from 'express';
import { userService } from '../services/user.service';
import type { CreateUserRequest, GetUserRequest } from '../../../shared/types/api';

const router = Router();

// GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params as GetUserRequest;
    const user = await userService.getUser(id);
    
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// POST /api/users
router.post('/users', async (req, res) => {
  try {
    const userData = req.body as CreateUserRequest;
    const user = await userService.createUser(userData);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid request' 
    });
  }
});

export { router as userRoutes };

