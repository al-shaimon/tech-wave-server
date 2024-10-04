import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt_access_secret || '');
      req.user = decoded as {
        id: string;
        name: string;
        email: string;
        isVerified: boolean;
        phone: string;
        profilePhoto: string;
        role: string;
      };
    } catch (err) {
      // If token is invalid, we just continue without setting req.user
      console.log('Invalid token in optional auth');
    }
  }

  next();
};

export default optionalAuthMiddleware;