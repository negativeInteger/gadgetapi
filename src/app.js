import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/authRouter.js';
import { gadgetRouter } from './routes/gadgetRouter.js'
import { errorHandler } from './middlewares/errorHandler.js';
dotenv.config();

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/gadgets', gadgetRouter);
app.use(errorHandler)

export { app };