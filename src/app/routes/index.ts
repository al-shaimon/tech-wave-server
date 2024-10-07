import { Router } from 'express';
import { AuthRoutes } from '../modules/User/user.route';
import { PostCategoryRoutes } from '../modules/PostCategory/postCategory.route';
import { PostRoutes } from '../modules/Post/post.route';
import { CommentRoutes } from '../modules/Comment/comment.route';
import { AnalyticsRoutes } from '../modules/Analytics/analytics.route';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { ActivityLogRoutes } from '../modules/ActivityLogs/activityLogs.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/post-categories',
    route: PostCategoryRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/analytics',
    route: AnalyticsRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/activity-logs',
    route: ActivityLogRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use('/comments', CommentRoutes);

export default router;
