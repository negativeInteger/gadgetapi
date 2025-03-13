/**
 * Authentication Middleware
 * - Combines multiple authentication-related middlewares to ensure a user is authenticated.
 */
import { isLoggedIn } from "./isLoggedIn.js";
import { verifyRefreshToken } from "./verifyRefreshToken.js";
/**
 * Middleware stack for user authentication.
 * - `isLoggedIn`: Ensures the user is logged in. (checks for accessToken)
 * - `verifyRefreshToken`: Verifies the validity of the refresh token. (rotates tokens if accessToken expires)
 */
export const authenticateUser = [isLoggedIn, verifyRefreshToken];