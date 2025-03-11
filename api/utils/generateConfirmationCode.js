import crypto from 'crypto';
/**
 * Generates a 6-digit random confirmation code.
 * Uses `crypto.randomInt` to generate a cryptographically secure 
 * random number between `100000` and `999999` (inclusive).
 * @returns {string} A 6-digit confirmation code as a string.
 */
export function generateConfirmationCode() {
    return crypto.randomInt(100000, 1000000).toString(); // 100000 is the smallest 6-digit, 1000000 is exclusive
}
  
