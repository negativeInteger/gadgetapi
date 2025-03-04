import { z } from 'zod'; 
import { register, login } from "../services/authService.js";
import { registerSchema, loginSchema } from "../utils/validation.js";
import { refreshTokens } from '../services/refreshTokenService.js';
import { ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } from '../config/tokenExpiration.js';

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
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Only HTTPS in Production
            sameSite: 'Strict',
            maxAge: ACCESS_TOKEN_EXPIRE_TIME, // 15 minutes
            path: '/',

        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'Strict',
            maxAge: REFRESH_TOKEN_EXPIRE_TIME, // 7 days
            path: '/',
        })
        res.status(200).json({ message: `Hey ${validatedData.username}, Login Successful` });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        next(err);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        res.cookie('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Only HTTPS in Production
            sameSite: 'Strict',
            expires: new Date(0),
            path: '/',
        });
        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'Strict',
            expires: new Date(0),
            path: '/',
        });
        return res.status(200).json({ message: 'Logged Out Successfully!!!'})
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const device = req.headers['user-agent'];
        const ipAddress = req.ip;
        const tokens =  await refreshTokens(refreshToken, req.user, device, ipAddress)
        res.status(200).json(tokens);   
    } catch (err) {
        next(err);
    }
};