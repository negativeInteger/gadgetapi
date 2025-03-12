/**
 * Verify Refresh Token Middleware
 * - Handles token refreshing when access tokens expire.
 */
import jwt from "jsonwebtoken";
import { blacklistToken, isBlacklisted } from "../services/tokenService.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { ExpressError } from '../errors/ExpressError.js';
import { setCookies } from "../utils/cookie.js";
/**
 * Middleware to verify and refresh the access token using the refresh token.
 * - If `req.triggerRefresh` is false, it skips refreshing.
 * - If a refresh token is missing, it returns an authentication error.
 * - It verifies the refresh token's validity.
 * - If the token is blacklisted, it prompts the user to log in again.
 * - A new access token is generated and set in cookies.
 * - The user data is attached to `req.user`, and the request proceeds.
 * @param {Object} req - Express request object containing cookies.
 * @param {Object} res - Express response object for setting cookies.
 * @param {Function} next - Express next function to continue or pass an error.
 */
export const verifyRefreshToken = async (req, res, next) => {
    if (!req.triggerRefresh) {
        return next(); // Skip refresh if access token is valid
    }
    const refreshToken  = req.cookies.refreshToken;
    if(!refreshToken) {        
        return next(new ExpressError('Authentication', 'User must be logged in to access this resource', 401));
    }
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const blacklisted = await isBlacklisted(refreshToken);
        if (blacklisted) throw new ExpressError('Authentication', 'Something Went Wrong. Please log in again.', 401);
        await blacklistToken(refreshToken);
        // create new access token
        const newAccessToken = generateAccessToken(user);
        // rotate refresh token
        const newRefreshToken = generateRefreshToken(user);
        setCookies(res, newAccessToken, newRefreshToken);
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

