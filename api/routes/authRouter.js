import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
const router = express.Router();
/**
 * @route POST /auth/login
 * @desc User Login
 */
router.post('/login', loginUser);
/**
 * @route POST /auth/logout
 * @desc User Logout
 */
router.post('/logout', logoutUser);
/**
 * @route POST /auth/register
 * @desc User Register
 */
router.post('/register', registerUser);

export { router as authRouter };