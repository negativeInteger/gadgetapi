import jwt from "jsonwebtoken";
import { isBlacklisted } from "../services/tokenService.js";
import { generateAccessToken } from "../utils/generateTokens.js";
import { ACCESS_TOKEN_EXPIRE_TIME } from "../config/expirationTimes.js";
import { ExpressError } from '../errors/ExpressError.js';

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
            secure: process.env.NODE_ENV !== "development",
            sameSite: "Strict",
            maxAge: ACCESS_TOKEN_EXPIRE_TIME
        });
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};