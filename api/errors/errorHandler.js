/**
 * Global Error Handler Middleware
 * - Handles application-wide errors and returns a structured response.
 */
export const errorHandler = (err, req, res, next) => {
    const { errorType = 'Internal Server Error', message = 'Something Went Wrong', statusCode = 500 } = err; 
    res.status(statusCode).json({ errorType, message });
};