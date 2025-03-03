/**
 * Role-Based Access Control Middleware
 * Only allows admin users to access protected routes.
 */

export const isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Denied: Admins Only' });
    }
    next(); // Process if user is Admin
};