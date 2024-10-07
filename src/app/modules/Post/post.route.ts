import express from 'express';
import validateRequest from '../../middleWares/validateRequest';
import { PostControllers } from './post.controller';
import { PostValidation } from './post.validation';
import auth from '../../middleWares/auth';
import { adminMiddleware } from '../User/adminMiddleware';

const router = express.Router();

router.post(
  '/',
  auth('user'),

  validateRequest(PostValidation.createPostValidationSchema),
  PostControllers.createPost
);

router.get('/', PostControllers.getAllPosts);

router.get('/:id', PostControllers.getPost);

router.put(
  '/:id',
  // auth('user'),
  validateRequest(PostValidation.updatePostValidationSchema),
  PostControllers.updatePost
);

router.delete('/:id', auth('user'), PostControllers.deletePost);

router.delete(
  '/:id/admin',
  auth('admin'),
  adminMiddleware,
  PostControllers.deletePostByAdmin
);

export const PostRoutes = router;
