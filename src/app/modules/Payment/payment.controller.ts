import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { PaymentService, PaymentServices } from './payment.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await PaymentService.createPaymentIntent(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment intent created successfully',
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { paymentIntentId } = req.body;
  const result = await PaymentService.confirmPayment(userId, paymentIntentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment confirmed successfully',
    data: result,
  });
});

const getAllPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getAllPaymentHistory();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment history retrieved successfully',
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntent,
  confirmPayment,
  getAllPaymentHistory,
};
