/**
 * Role-Based Access Control Middleware
 * Only allows admin users to access protected routes.
 */

import { ExpressError } from "../errors/ExpressError.js";

export const isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin') {
        next(new ExpressError('Authorization', 'Access Denied: Admins Only', 403));
    }
    next(); // Process if user is Admin
};