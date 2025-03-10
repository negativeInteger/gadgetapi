import { z } from 'zod'; 
import { register, login } from "../services/authService.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import { blacklistToken } from '../services/tokenService.js';
import { setCookies, clearCookies } from '../utils/cookie.js';
import { ExpressError } from '../errors/ExpressError.js';

export const registerUser = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        await register(validatedData);
        return res.status(201).json({ message: `Registration Success!, Hey ${validatedData.username}, you can login now` });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return next(new ExpressError('Validation Error', err.errors, 400));
        }
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const device = req.headers['user-agent'];
        const ipAddress = req.ip;
        const { accessToken, refreshToken } = await login(validatedData, device, ipAddress);
        setCookies(res, accessToken, refreshToken);
        res.status(200).json({ message: `Hey ${validatedData.username}, Login Successful` });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return next(new ExpressError('Validation Error', err.errors, 400));
        }
        next(err);
    }
};

export const logoutUser = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        return next(new ExpressError('Authentication', 'Must be logged in for logging out', 401));
    }
    try {
        await blacklistToken(refreshToken);
        clearCookies(res);
        return res.status(200).json({ message: 'Logged Out Successfully!'})
    } catch (err) {
        next(new ExpressError('Internal Server Error', 'Error occurred while logging out', 500));
    }
};
