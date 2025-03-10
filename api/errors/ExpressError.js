class ExpressError extends Error {
    constructor(errorType, message, statusCode) {
        super();
        this.errorType = errorType;
        this.message = message;
        this.statusCode = statusCode;
    }
};

export { ExpressError };