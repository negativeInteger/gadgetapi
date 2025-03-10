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
dotenv.config();

const app = express();
const localStorage = new LocalStorage("./codes"); 

setupSwagger(app); // Initialize Swagger docs
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/gadgets', gadgetRouter);
// Handle undefined routes
app.use(notFoundHandler)
// Global error handler
app.use(errorHandler)

export { app, localStorage };