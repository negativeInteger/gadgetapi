import express from 'express';
import { registerUser, loginUser, refreshToken } from '../controllers/authController.js';
import { verifyRefreshToken } from '../middlewares/refreshMiddleware.js';

const router = express.Router();
/**
 * @route POST /auth/login
 * @desc User Login
 */
router.post('/login', loginUser);
/**
 * @route POST /auth/register
 * @desc User Register
 */
router.post('/register', registerUser);
/**
 * @route POST /auth/refresh
 * @desc Refresh Access Token
 */
router.post('/refresh', verifyRefreshToken, refreshToken);

export { router as authRouter };