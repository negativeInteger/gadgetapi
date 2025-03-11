import { z } from 'zod';
/**
 * Schema for user registration validation.
 * - `username`: Must be a string (3-20 characters long).
 * - `password`: Must be a string (minimum 6 characters).
 * - `role`: Optional, must be either `'user'` or `'admin'`.
 */
export const registerSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6),
    role:     z.enum(['user', 'admin']).optional()
}).strict();

/**
 * Schema for user login validation.
 * - `username`: Must be a string (3-20 characters long).
 * - `password`: Must be a string (minimum 6 characters).
 */
export const loginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6)
}).strict();