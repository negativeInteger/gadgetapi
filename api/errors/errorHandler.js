// Global Error Handler
export const errorHandler = (err, req, res, next) => {
    const { errorType = 'Internal Server Error', message = 'Something Went Wrong', statusCode = 500 } = err; 
    res.status(statusCode).json({ errorType, message });
};