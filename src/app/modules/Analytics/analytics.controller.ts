// src/app/modules/Analytics/analytics.controller.ts

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AnalyticsService } from './analytics.service';

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await AnalyticsService.getAnalytics(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analytics retrieved successfully',
    data: result,
  });
});

export const AnalyticsController = {
  getAnalytics,
};
