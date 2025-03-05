import { z } from 'zod'; 
import { register, login } from "../services/authService.js";
import { registerSchema, loginSchema } from "../utils/validation.js";
import { blacklistToken } from '../models/refreshToken.js';
import { clearCookies } from  '../utils/clearCookies.js';
import { setCookies } from '../utils/setCookies.js';

export const registerUser = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        await register(validatedData);
        res.status(201).json({ message: `Registration Success!!!, Hey ${validatedData.username}, you can login now` });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
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
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        next(err);
    }
};

export const logoutUser = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        res.status(403).json({ message: 'You need to login first : (' })
        return clearCookies(res);
    }
    await blacklistToken(refreshToken);
    try {
        clearCookies(res);
        return res.status(200).json({ message: 'Logged Out Successfully!!!'})
    } catch (err) {
        next(err);
    }
};
