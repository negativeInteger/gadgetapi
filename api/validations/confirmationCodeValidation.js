import { z } from "zod";

/**
 * Schema for validating a confirmation code.
 * - `code`: Must be a string exactly 6 characters long.
 */
export const confirmationCodeSchema = z.object({
    code: z.string().length(6)
}).strict();