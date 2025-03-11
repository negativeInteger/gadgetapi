import { register, login } from "../services/authService.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import { blacklistToken } from '../services/tokenService.js';
import { setCookies, clearCookies } from '../utils/cookie.js';
import { ExpressError } from '../errors/ExpressError.js';
import { handleValidationError } from '../utils/handleValidationError.js';

/**
 * Register a new user.
 * - Validates request body using Zod.
 * - Calls `register` service to create a user.
 * - Returns a success message on completion.
 */
export const registerUser = async (req, res, next) => {
    try {
        // Validate request data using Zod schema
        const validatedData = registerSchema.parse(req.body);
         // Register user in the database
        await register(validatedData);
        return res.status(201).json({ message: `Registration Success!, Hey ${validatedData.username}, you can login now` });
    } catch (err) {
        // Handle validation errors
        handleValidationError(err, next);
    }
};

/**
 * Log in a user.
 * - Validates request body using Zod.
 * - Calls `login` service to authenticate user.
 * - Extracts `user-agent` and `ip` for security tracking.
 * - Sets `accessToken` and `refreshToken` in cookies.
 */
export const loginUser = async (req, res, next) => {
    try {
        // Validate request data using Zod schema
        const validatedData = loginSchema.parse(req.body);
        // Capture device and IP for token tracking
        const device = req.headers['user-agent'];
        const ipAddress = req.ip;
        // Authenticate user and generate tokens
        const { accessToken, refreshToken } = await login(validatedData, device, ipAddress);
        // Set tokens in HTTP-only cookies
        setCookies(res, accessToken, refreshToken);
        res.status(200).json({ message: `Hey ${validatedData.username}, Login Successful` });
    } catch (err) {
        // Handle validation errors
        handleValidationError(err, next);
    }
};

/**
 * Log out a user.
 * - Ensures a `refreshToken` exists in cookies.
 * - Blacklists the `refreshToken` to prevent reuse.
 * - Clears authentication cookies.
 */
export const logoutUser = async (req, res, next) => {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    // Check if refreshToken is not present
    if(!refreshToken) {
        return next(new ExpressError('Authentication', 'Must be logged in for logging out', 401));
    }
    try {   
        // Blacklist refresh token to prevent reuse
        await blacklistToken(refreshToken);
        clearCookies(res);
        return res.status(200).json({ message: 'Logged Out Successfully!'})
    } catch (err) {
        console.error("Logout error:", err);
        next(new ExpressError('Internal Server Error', 'Error occurred while logging out', 500));
    }
};
