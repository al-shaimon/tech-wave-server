// src/app/modules/Analytics/analytics.route.ts

import express from 'express';
import { AnalyticsController } from './analytics.controller';
import auth from '../../middleWares/auth';

const router = express.Router();

router.get('/:userId', auth('user'), AnalyticsController.getAnalytics);

export const AnalyticsRoutes = router;
