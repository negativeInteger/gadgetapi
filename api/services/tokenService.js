/**
 * Token Service
 * - Manages refresh token storage, blacklisting, and validation.
 */
import { prisma } from "../config/db.js";
/**
 * Save Refresh Token
 * - Stores a refresh token in the database along with user and device details.
 * @param {string} token - The refresh token.
 * @param {string} userId - The ID of the user.
 * @param {string} device - The device information where the token was issued.
 * @param {string} ipAddress - The IP address of the request.
 * @param {Date} expiresAt - Expiry date of the token.
 * @returns {Promise<Object>} The saved refresh token entry.
 */
export const saveRefreshToken = async (token, userId, device, ipAddress, expiresAt) => {
    return await prisma.refreshToken.create({
        data: {
            token,
            userId,
            device,
            ipAddress,
            expiresAt
        }
    });
};
/**
 * Blacklist Token
 * - Marks a refresh token as blacklisted, preventing further use.
 * @param {string} token - The refresh token to blacklist.
 * @returns {Promise<Object>} The update result.
 */
export const blacklistToken = async (token) => {
    return await prisma.refreshToken.update({
        where: { token },
        data: {
            blacklisted: true,
            revokedAt: new Date()
        }
    });
};
/**
 * Check if Token is Blacklisted
 * - Determines if a refresh token has been blacklisted.
 * @param {string} token - The refresh token to check.
 * @returns {Promise<boolean>} True if the token is blacklisted, otherwise false.
 */
export const isBlacklisted = async (token) => {
    const blacklisted = await prisma.refreshToken.findUniqueOrThrow({
        where: { token, blacklisted: true }
    });
    return !!blacklisted;   // double NOT operator
};