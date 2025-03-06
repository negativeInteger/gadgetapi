import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6),
    role:     z.enum(['agent', 'admin']).optional()
});

export const loginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6)
});

export const gadgetSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
    status: z.enum([
        'AVAILABLE',
        'DEPLOYED',
        'DESTROYED',
        'DECOMMISSIONED'
    ]).default('AVAILABLE')
});