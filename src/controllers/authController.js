import { z } from 'zod'; 
import { register, login } from "../services/authService.js";
import { registerSchema, loginSchema } from "../utils/validation.js";
import { refreshTokens } from '../services/refreshTokenService.js';

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
        const tokens = await login(validatedData, device, ipAddress);
        res.status(200).json(tokens);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
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