import { app } from './app.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    logger.info(`[INFO] Server running in ${ENV} mode on port ${PORT}`);
}).on('error', (err) => {
    logger.error('[ERROR] Failed to start server:', err);
    process.exit(1); // Shut down if there is a startup error
});

