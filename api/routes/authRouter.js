/**
 * Authentication Routes
 * - Defines the authentication endpoints for user registration, login, and logout.
 * - Uses Swagger for API documentation.
 */
import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { handleReLogin } from '../middlewares/handleReLogin.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and session management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 description: |
 *                  Defines the user's access level within the system.
 *                      - `user`: Standard user with limited access.
 *                      - `admin`: User with full administrative privileges.
 *                  If not provided, defaults to `user`.
 *                  example: user, admin
 *             required:
 *                 - username
 *                 - password
 *     responses:
 *       201:
 *         description: Registration Success!, Hey john_doe, you can login now`
 *       400:
 *         description: Validation Error
 *       409:
 *         description: Username is already registered
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *             required:
 *                - username
 *                - password
 *     responses:
 *       200:
 *         description: Hey john_doe, Login Successful
 *       400:
 *         description: Validation Error / Authentication (Already Logged In)
 *       401:
 *         description: Invalid Credentials / Inavlid Session. Please login again
 */
router.post('/login', handleReLogin, loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Authentication]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Logged Out Successfully!
 *       401:
 *         description: Must be logged in for logging out
 *       500:
 *         description: Error occurred while logging out
 */
router.post('/logout', logoutUser);

export { router as authRouter };
