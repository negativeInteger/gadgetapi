import crypto from 'crypto';

export function generateConfirmationCode() {
    return crypto.randomInt(100000, 1000000).toString(); // 100000 is the smallest 6-digit, 1000000 is exclusive
}
  
