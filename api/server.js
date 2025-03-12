import { app } from './app.js';

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    console.log(`[INFO] Server running in ${ENV} mode on port ${PORT}`);
}).on('error', (err) => {
    console.error('[ERROR] Failed to start server:', err);
    process.exit(1);
});

