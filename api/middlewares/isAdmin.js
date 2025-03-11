/**
 * Role-Based Access Control Middleware
 * - This middleware restricts access to admin-only routes.
 * - It checks if the authenticated user has the role of 'admin'.
 */
import { ExpressError } from "../errors/ExpressError.js";
/**
 * Middleware to enforce admin access.
 * - If the user's role is not 'admin', it throws an authorization error.
 * - If the user is an admin, the request proceeds to the next middleware or controller.
 * @param {Object} req - Express request object containing user data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function to pass control.
 */
export const isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin') {
        next(new ExpressError('Authorization', 'Access Denied: Admins Only', 403));
    }
    next(); // Process if user is Admin
};