/**
 * Performance Timer Middleware
 */
export const performanceTimer = (req, res, next) => {
    console.time(`Request Time: ${req.method} ${req.url}`);
    res.on('finish', () => {
      console.timeEnd(`Request Time: ${req.method} ${req.url}`);
    });
    next();
};