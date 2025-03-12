/**
 * Custom ExpressError Class
 * - Extends the native Error class to provide structured error handling.
 */
class ExpressError extends Error {
    /**
     * Constructs an ExpressError instance.
     * @param {string} errorType - The type of error (e.g., "Validation", "Authentication").
     * @param {string} message - A descriptive error message.
     * @param {number} statusCode - The HTTP status code for the error response.
     */
    constructor(errorType, message, statusCode) {
        super();
        this.errorType = errorType;
        this.message = message;
        this.statusCode = statusCode;
    }
};

export { ExpressError };