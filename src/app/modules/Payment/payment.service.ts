import { User } from '../User/user.model';
import { Payment } from './payment.model';
import stripe from '../../utils/stripe';
import { v4 as uuidv4 } from 'uuid';

const VERIFICATION_AMOUNT = 2000; // $20 in cents

const createPaymentIntent = async (userId: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: VERIFICATION_AMOUNT,
    currency: 'usd',
    metadata: { userId },
  });

  return { clientSecret: paymentIntent.client_secret };
};

const confirmPayment = async (userId: string, paymentIntentId: string) => {
  // In a test environment, skip Stripe verification
  if (process.env.NODE_ENV_STRIPE === 'test') {
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    const payment = await Payment.create({
      userId,
      amount: VERIFICATION_AMOUNT / 100, // Convert cents to dollars
      invoiceNumber: uuidv4(),
      paymentIntentId,
    });

    return { user, payment };
  }

  // For non-test environments, keep the original implementation
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment not successful');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isVerified: true },
    { new: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  const payment = await Payment.create({
    userId,
    amount: VERIFICATION_AMOUNT / 100, // Convert cents to dollars
    invoiceNumber: uuidv4(),
    paymentIntentId,
  });

  return { user, payment };
};

const getAllPaymentHistory = async () => {
  const result = await Payment.find()
    .populate({
      path: 'userId',
      model: 'User',
      select: '-password -passwordResetToken -passwordResetExpires'
    })
    .sort({ createdAt: -1 });

  return result;
};

export const PaymentService = {
  createPaymentIntent,
  confirmPayment,
};

export const PaymentServices = {
  getAllPaymentHistory,
};
