import { ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } from "../config/expirationTimes.js";

export const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Only HTTPS in Production
        sameSite: 'Strict',
        maxAge: ACCESS_TOKEN_EXPIRE_TIME, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'Strict',
        maxAge: REFRESH_TOKEN_EXPIRE_TIME, // 7 days
    })
};

export const clearCookies = (res) => {
    res.clearCookie('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Only HTTPS in Production
        sameSite: 'Strict',
    });
    res.clearCookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'Strict',
    })
};