/**
 * Authentication Middleware
 * - Ensures that a user is logged in before accessing protected routes.
 * - Checks for the presence of an access token in cookies.
 */
import jwt from 'jsonwebtoken';
/**
 * Middleware to verify if a user is logged in.
 * - If no access token is found in cookies, an authentication error is thrown.
 * - If an access token exists, the request proceeds to the next middleware (verifyRefreshToken)
 * @param {Object} req - Express request object containing cookies.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function to pass control.
 */
export const isLoggedIn = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken) {
        req.triggerRefresh = true;
        return next();
    }
    try {
        const user = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        if (!user || Object.keys(user).length === 0) {
            req.triggerRefresh = true;
            return next();
        }
        req.user = user;
        req.triggerRefresh = false;
        next();
    } catch (err) {
        req.triggerRefresh = true;
        next();
    }
};