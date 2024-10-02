import { Router } from 'express';
import { AuthRoutes } from '../modules/User/user.route';
import { PostCategoryRoutes } from '../modules/PostCategory/postCategory.route';
import { PostRoutes } from '../modules/Post/post.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
