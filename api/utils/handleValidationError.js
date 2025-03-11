import { ExpressError } from "../errors/ExpressError.js";
import { z } from "zod";
/**
 * Handles Zod validation errors and passes them to Express error handler.
 * @param {Error} err - The error object.
 * @param {Function} next - Express `next` function to pass errors.
 */
export const handleValidationError = (err, next) => {
    if (err instanceof z.ZodError) {
        return next(new ExpressError("Validation", err.errors, 400));
    }
    next(err);
};
