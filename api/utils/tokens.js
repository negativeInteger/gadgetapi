import jwt from 'jsonwebtoken';
/**
 * Generates an access token for authentication.
 * The token contains the user's ID and role, signed with the `ACCESS_SECRET`.
 * It expires in 15 minutes.
 * @param {Object} user - The user object.
 * @param {string} user.id - The user's unique ID.
 * @param {string} user.role - The user's role.
 * @returns {string} A signed JWT access token.
 */
export const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role } , process.env.ACCESS_SECRET, {
        expiresIn: '15m'
    });
};

/**
 * Generates a refresh token for renewing authentication.
 * The refresh token contains the user's ID and role, signed with the `REFRESH_SECRET`.
 * It expires in 7 days.
 * @param {Object} user - The user object.
 * @param {string} user.id - The user's unique ID.
 * @param {string} user.role - The user's role.
 * @returns {string} A signed JWT refresh token.
 */
export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_SECRET, {
        expiresIn: '7d'
    });
};