import express from 'express';
import { registerUser, refreshToken } from '../controllers/authController.js';
import { verifyRefreshToken } from '../middlewares/refreshMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/refresh', verifyRefreshToken, refreshToken);

export { router as authRouter };