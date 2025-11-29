/**
 * User Service
 * 
 * Pattern: BACKEND × SERVICE × USER × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META)
 * Guardians: AEYON (999 Hz) + META (777 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import type { User, CreateUserRequest } from '../../../../shared/types/api';
import { validateUserInput } from '../../../../shared/utils/validation';

// In-memory store (YAGNI: simple example, replace with database when needed)
const users: Map<string, User> = new Map();

class UserService {
  async getUser(id: string): Promise<User | null> {
    return users.get(id) || null;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    // Validate input using shared validation
    const validation = validateUserInput(data.name, data.email);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Create user
    const user: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
    };

    users.set(user.id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(users.values());
  }
}

export const userService = new UserService();

