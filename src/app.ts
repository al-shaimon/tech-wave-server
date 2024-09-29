/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from './app/config';
import notFound from './app/middleWares/notFound';
import routes from './app/routes';
import globalErrorHandler from './app/middleWares/globalErrorHandler';

const app: Application = express();

app.use(cookieParser());

//cors
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://tech-wave-client.vercel.app'],
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/', routes);

//Testing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to the Lost And Found API',
  });
});

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use(notFound);

export default app;
