import express from 'express';
import { ActivityLogController } from './activityLogs.controller';
import auth from '../../middleWares/auth';
import { adminMiddleware } from '../User/adminMiddleware';

const router = express.Router();

router.get(
  '/',
  auth('admin'),
  adminMiddleware,
  ActivityLogController.getActivityLogs
);

export const ActivityLogRoutes = router;
