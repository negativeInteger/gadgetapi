import crypto from 'crypto';
/**
 * Generates a unique random codename.
 * Format: "IMF-XXXXXXXXXX" (10 alphanumeric characters)
 * Example: IMF-4G7JXVA34R
 * @returns {string} Unique codename.
 */
export const generateCodename = () => {
    const uuid = crypto.randomUUID();
    const hash = Buffer.from(uuid)
        .toString('base64url')
        .replace(/[^a-zA-Z0-9]/g, '') // Remove non-alphanumeric characters
        .slice(0, 10) // Keep only first 10 characters
        .toUpperCase(); // Make it uppercase for a cleaner codename
    return `IMF-${hash}`;
};