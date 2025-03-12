import { ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } from "../config/constants.js";
/**
 * Sets HTTP-only secure cookies for access and refresh tokens.
 */
export const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only HTTPS in Production
        sameSite: 'Strict',
        maxAge: ACCESS_TOKEN_EXPIRE_TIME, // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: REFRESH_TOKEN_EXPIRE_TIME, // 7 days
    })
};
/**
 * Clears authentication cookies.
 */
export const clearCookies = (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};