import { ExpressError } from "../errors/ExpressError.js";

export const notFoundHandler = (req, res, next) => {
    next(new ExpressError('Not Found', `Cannot ${req.method} ${req.originalUrl}`, 404));
};

