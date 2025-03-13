import jwt from "jsonwebtoken";
import { ExpressError } from "../errors/ExpressError.js";
import { prisma } from "../config/db.js";
import { clearCookies } from "../utils/cookie.js";
/**
 * Middleware to handle re-login attempts.
 * - If the same user is already logged in, it prevents re-login with an "Already logged in" error.
 * - If a different user tries to log in while another session exists, it clears the previous session and allows the new login.
 * - If no session exists, it simply proceeds to login.
 * @param {Object} req - Express request object  
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next function  
 * @throws {ExpressError} If the same user tries to log in again while already authenticated.
 */
export const handleReLogin = async (req, res, next) => {
    // Check Access Token
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
        try {
            const user = jwt.verify(accessToken, process.env.ACCESS_SECRET);
            const { username } = await prisma.user.findUniqueOrThrow({
                where: { id: user.id }
            });
            if (req.body.username === username) {
                return next(new ExpressError("Authentication", "Already logged in", 400));            
            }
            clearCookies(res);
            return next();
        } catch (err) {
            // Handle User Not Found and Inavalid Access Token error
            if (err.code === 'P2025' || err.name !== "TokenExpiredError") {
                return next(new ExpressError("Authentication", "Invalid session. Please login again", 401));
            }
        }
    }
    
    // Check Refresh Token
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        try {
            const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
            const { username } = await prisma.user.findUniqueOrThrow({
                where: { id: user.id }
            });
            if (req.body.username === username) {
                return next(new ExpressError("Authentication", "Already logged in", 400));            
            }
            clearCookies(res);
            return next();
        } catch (err) {
            // Handle User Not Found and Inavalid Access Token error
            if (err.code === 'P2025' || err.name !== "TokenExpiredError") {
                return next(new ExpressError("Authentication", "Invalid session. Please login again", 401));
            }
        }
    }
    next(); // Proceed to Login
};
