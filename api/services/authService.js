/**
 * Authentication Service
 * - Handles user authentication-related operations such as registration, login,
 *   password hashing, and JWT token generation.
 */
import { prisma } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens.js';
import { saveRefreshToken } from '../services/tokenService.js';
import { REFRESH_TOKEN_EXPIRE_TIME } from '../config/constants.js';
import { ExpressError } from '../errors/ExpressError.js';
/**
 * Register a new user.
 * - Hashes the provided password.
 * - Saves user credentials to the database.
 * - Defaults the role to 'user' if not provided.
 * - Throws an error if the username is already taken.
 * @param {Object} data - User registration data
 * @param {string} data.username - Username for the new user
 * @param {string} data.password - Plain-text password to be hashed
 * @param {string} [data.role] - Optional user role (default: 'user')
 * @throws {ExpressError} If the username is already registered
 */
export const register = async (data) => {
    const  { username, password } = data;
    const hashedPassword = await hashPassword(password);
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: data.role || 'user'
            }
        }); 
    } catch (err) {
        throw new ExpressError('Conflict', 'Username is already registered', 409);
    }
};
/**
 * Authenticate a user (Login).
 * - Validates username and password.
 * - Generates access and refresh tokens upon successful authentication.
 * - Saves the refresh token with associated device and IP for session management.
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.username - Username of the user
 * @param {string} credentials.password - Plain-text password for authentication
 * @param {string} device - Device information for refresh token tracking
 * @param {string} ipAddress - IP address of the login request
 * @returns {Object} Authenticated user data along with access & refresh tokens
 * @throws {ExpressError} If credentials are invalid
 */
export const login = async ({ username, password }, device, ipAddress) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new ExpressError('Authentication','Invalid Credentials', 401);
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) throw new ExpressError('Authentication', 'Invalid Credentials', 401);
    // Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(refreshToken, user.id, device, ipAddress, new Date(Date.now() + REFRESH_TOKEN_EXPIRE_TIME))
    return { user, accessToken, refreshToken };
};
