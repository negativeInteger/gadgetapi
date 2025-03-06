import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken) {
        req.triggerRefresh = true;
        return next();
    }
    try {
        const user = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        if (!user || Object.keys(user).length === 0) {
            req.triggerRefresh = true;
            return next();
        }
        req.user = user;
        req.triggerRefresh = false;
        next();
    } catch (err) {
        req.triggerRefresh = true;
        next();
    }
};