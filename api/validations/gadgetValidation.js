import { z } from 'zod';

export const gadgetSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
    status: z.enum([
        'AVAILABLE',
        'DEPLOYED',
        'DESTROYED',
        'DECOMMISSIONED'
    ]).default('AVAILABLE')
}).strict();
