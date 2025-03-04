import crypto from 'crypto';
/**
 * Generates Unique Random Codename
 * Example: 4g7jxva34r
 */
export const generateCodename = () => {
    const uuid = crypto.randomUUID();
    const hash = Buffer.from(uuid).toString('base64url').slice(0, 10); // 10 characters long codename
    return `IMF-${hash}`;
};