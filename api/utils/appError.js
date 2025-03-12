import { ExpressError } from "../errors/ExpressError.js";
import { z } from "zod";
/**
 * Handles Zod validation errors, Database failure errors and Authentication errors and passes them to Express error handler.
 * @param {Error} err - The error object.
 * @param {Function} next - Express `next` function to pass errors.
 */
export const handleAppError = (err, next) => {
    if (err instanceof z.ZodError) {
        return next(new ExpressError("Validation", err.errors, 400));
    }
    next(err);
};
