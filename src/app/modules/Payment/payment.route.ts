import express from 'express';
import { PaymentController } from './payment.controller';
import authMiddleware from '../User/authMiddleware';
import auth from '../../middleWares/auth';
import { adminMiddleware } from '../User/adminMiddleware';

const router = express.Router();

router.post(
  '/create-payment-intent',
  authMiddleware,
  PaymentController.createPaymentIntent
);
router.post(
  '/confirm-payment',
  authMiddleware,
  PaymentController.confirmPayment
);

router.get(
  '/',
  auth('admin'),
  adminMiddleware,
  PaymentController.getAllPaymentHistory
);

export const PaymentRoutes = router;
