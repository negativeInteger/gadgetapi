import jwt from "jsonwebtoken";
import { ExpressError } from "../errors/ExpressError.js";
/**
 * Middleware to handle re-login based on the presence of valid access and refresh tokens in cookies.
 * This checks if the user is already logged in by verifying the tokens.
 * If the token is expired, it proceeds without an error, allowing the user to refresh the token or log in again.
 * If the token is invalid, it returns a 401 Unauthorized response.
 * @param {Object} req - The request object containing cookies.
 * @param {Object} res - The response object (not used here but required for Express middleware).
 * @param {Function} next - The callback function to pass control to the next middleware.
 * @returns {void} Passes control to the next middleware if no valid tokens are found.
 * @throws {ExpressError} Throws a custom ExpressError if invalid session or already logged in.
 */
export const handleReLogin = async (req, res, next) => {
    // Check Access Token
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
        try {
            jwt.verify(accessToken, process.env.ACCESS_SECRET);
            return next(new ExpressError("Authentication", "Already logged in", 400));            
        } catch (err) {
            // Handle Invalid Access Token
            if (err.name !== "TokenExpiredError") {            
                return next(new ExpressError("Authentication", "Invalid session. Please login again", 401));
            }
        }
    }
    
    // Check Refresh Token
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        try {
            jwt.verify(refreshToken, process.env.REFRESH_SECRET);
            return next(new ExpressError("Authentication", "Already logged in", 400));
        } catch (err) {
            // Handle Invalid Refresh Token
            if (err.name !== "TokenExpiredError") {
                return next(new ExpressError("Authentication", "Invalid session. Please login again", 401));
            }
        }
    }
    // Proceed to the next middleware if no valid tokens
    next();
};
