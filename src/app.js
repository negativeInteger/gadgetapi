import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { authRouter } from './routes/authRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';
dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/api', authRouter);
app.use(errorHandler)

export { app };