import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6),
    role:     z.enum(['user', 'admin']).optional()
}).strict();

export const loginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6)
}).strict();