import { isBlacklisted } from "../models/refreshToken.js";
import jwt from "jsonwebtoken";

export const verifyRefreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    if(!refreshToken) return res.status(401).json({ message: 'Refresh Token Required' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const blacklisted = await isBlacklisted(refreshToken);
        if (blacklisted) return res.status(403).json({ message: 'Token Blacklisted' });
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Refresh Token' });
    }
};