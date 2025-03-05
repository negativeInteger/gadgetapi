import jwt from "jsonwebtoken";
import { isBlacklisted } from "../models/refreshToken.js";
import { generateAccessToken } from "../utils/generateTokens.js";
import { ACCESS_TOKEN_EXPIRE_TIME } from "../config/tokenExpiration.js";
import { clearCookies } from '../utils/clearCookies.js'

export const verifyRefreshToken = async (req, res, next) => {
    const refreshToken  = req.cookies.refreshToken;
    if(!refreshToken) {        
        clearCookies(res);
        return res.status(403).json({ message: 'You need to login first : (' });
    }
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const blacklisted = await isBlacklisted(refreshToken);
        if (blacklisted) return res.status(403).json({ message: 'Token Blacklisted' });
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
        console.log(err);
        return res.status(403).json({ message: 'Session Expired, Please Login' });
    }
};