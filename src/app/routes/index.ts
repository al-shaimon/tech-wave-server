import { Router } from 'express';
import { AuthRoutes } from '../modules/User/user.route';
import { PostCategoryRoutes } from '../modules/PostCategory/postCategory.route';
import { PostRoutes } from '../modules/Post/post.route';
import { CommentRoutes } from '../modules/Comment/comment.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use('/comments', CommentRoutes);

export default router;
