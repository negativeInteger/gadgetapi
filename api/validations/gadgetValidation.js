import { z } from "zod";
/**
 * Schema for creating a new gadget.
 * Ensures that:
 * - `name` is a required string with a minimum length of 3.
 * - `description` is an optional string with a minimum length of 4, defaulting to "No description provided".
 */
export const createGadgetSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(4).optional().default('No description provided'),
}).strict();
/**
 * Schema for updating an existing gadget.
 * Ensures that:
 * - `name` is an optional string with a minimum length of 3.
 * - `description` is an optional string with a minimum length of 4.
 * - `status` is an optional enum with allowed values: "AVAILABLE", "DEPLOYED".
 * - At least one of `name`, `description`, or `status` must be provided.
 */
export const updateGadgetSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(4).optional(),
    status: z.enum(["AVAILABLE", "DEPLOYED"]).optional(),
})
.strict()
.refine((data) => Object.keys(data).length > 0, {
        message: "At least one field (name, description, or status) must be provided.",
});
