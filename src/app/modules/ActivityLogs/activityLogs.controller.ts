import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ActivityLogService } from './activityLogs.service';

const getActivityLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await ActivityLogService.getActivityLogs();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity logs retrieved successfully',
    data: result,
  });
});

export const ActivityLogController = {
  getActivityLogs,
};
