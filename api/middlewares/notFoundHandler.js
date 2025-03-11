/**
 * Not Found Handler Middleware
 * - Catches undefined routes and returns a 404 error.
 */

import { ExpressError } from "../errors/ExpressError.js";
/**
 * Middleware to handle requests to non-existent routes.
 * - When a route is not found, it triggers an ExpressError with a 404 status.
 * - Passes the error to the global error handler.
 * @param {Object} req - Express request object containing method and URL.
 * @param {Object} res - Express response object (not used directly).
 * @param {Function} next - Express next function to pass error handling.
 */
export const notFoundHandler = (req, res, next) => {
    next(new ExpressError('Not Found', `Cannot ${req.method} ${req.originalUrl}`, 404));
};

