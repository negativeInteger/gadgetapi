import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken) {
        return next();
    }
    try {
        const user = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        if (!user || Object.keys(user).length === 0) {
            return next();
        }
        req.user = user;
        next();
    } catch (err) {
        next();
    }
};