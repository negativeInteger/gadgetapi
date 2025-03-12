/**
 * Verify Refresh Token Middleware
 * - Handles token refreshing when access tokens expire.
 */
import jwt from "jsonwebtoken";
import { isBlacklisted } from "../services/tokenService.js";
import { generateAccessToken } from "../utils/tokens.js";
import { ACCESS_TOKEN_EXPIRE_TIME } from "../config/constants.js";
import { ExpressError } from '../errors/ExpressError.js';
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
        const accessToken = generateAccessToken(user);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "Strict",
            maxAge: ACCESS_TOKEN_EXPIRE_TIME
        });
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};