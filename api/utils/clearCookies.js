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