import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { LocalStorage } from 'node-localstorage';
import { authRouter } from './routes/authRouter.js';
import { gadgetRouter } from './routes/gadgetRouter.js'
import { errorHandler } from './errors/errorHandler.js';
import { setupSwagger } from './config/swagger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

// Load environment variables only in non-production environments
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
  
const app = express();
// node-localstorage for storing self-destruct sequence confirmation codes
const localStorage = new LocalStorage("./codes"); 

// Security Middleware
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// Setup Swagger API documentation (only in development)
if (process.env.NODE_ENV !== "production") {
    setupSwagger(app);
}


// Routes
app.use('/api/auth', authRouter);
app.use('/api/gadgets', gadgetRouter);

// Handle undefined routes
app.use(notFoundHandler)

// Global error handler
app.use(errorHandler)

export { app, localStorage };