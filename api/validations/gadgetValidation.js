import { z } from 'zod';
/**
 * Schema for validating a gadget.
 * - `name`: A string with a minimum length of 2 characters.
 * - `description`: A string with a minimum length of 2 characters.
 * - `status`: Must be one of the predefined statuses:
 *    - `AVAILABLE`
 *    - `DEPLOYED`
 *    - `DESTROYED`
 *    - `DECOMMISSIONED`
 *   Defaults to `AVAILABLE` if not provided.
 */
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
