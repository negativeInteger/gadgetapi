import { z } from 'zod'; 
import { register } from "../services/authService.js";
import { registerSchema } from "../utils/validation.js";
import { refreshTokens } from '../services/refreshTokenService.js';

export const registerUser = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const tokens = await register(validatedData);
        res.status(201).json(tokens);
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