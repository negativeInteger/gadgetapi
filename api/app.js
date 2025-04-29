import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { LocalStorage } from 'node-localstorage';
import { authRouter } from './routes/authRoutes.js';
import { gadgetRouter } from './routes/gadgetRoutes.js'
import { errorHandler } from './errors/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { setupSwagger } from './config/swagger.js';

// Load environment variables only in non-production environments
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Express app instance
const app = express();

// Node-localStorage for storing self-destruct sequence confirmation codes
const localStorage = new LocalStorage("./codes"); 

// Security middleware
app.use(helmet());
app.use(cookieParser());

// JSON parsing middleware
app.use(express.json());

// Setup Swagger API-documentation
setupSwagger(app);

// Routes

// Home route
app.get("/", (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Gadget API</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Gadget API</h1>
          <p>Welcome to the Gadget API! Everything is running smoothly. ✅</p>
          <p>Check the <a href="/docs">API Documentation</a> for details.</p>
        </body>
      </html>
    `);
});
// Auth routes
app.use('/api/auth', authRouter);
// Gadget routes
app.use('/api/gadgets', gadgetRouter);

// Undefined routes handler
app.use(notFoundHandler)

// Global error handler
app.use(errorHandler)

export { app, localStorage };