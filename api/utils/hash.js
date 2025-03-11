import bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt.
 * A salt is generated with a cost factor of 10 and then used to hash the password.
 * @param {string} password - The plain-text password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
/**
 * Compares a plain-text password with a hashed password.
 * Uses bcrypt's compare function to check if the password matches the stored hash.
 * @param {string} password - The plain-text password to verify.
 * @param {string} hashedPassword - The previously hashed password.
 * @returns {Promise<boolean>} `true` if passwords match, otherwise `false`.
 */
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};