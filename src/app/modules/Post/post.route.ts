import express from 'express';
import validateRequest from '../../middleWares/validateRequest';
import { PostControllers } from './post.controller';
import { PostValidation } from './post.validation';
import auth from '../../middleWares/auth';

const router = express.Router();

router.post(
  '/',
  auth('user'),

  validateRequest(PostValidation.createPostValidationSchema),
  PostControllers.createPost
);

router.get('/', PostControllers.getAllPosts);

router.get('/:id', PostControllers.getPost);

// router.put(
//   '/:id',
//   auth('user'),
//   validateRequest(ItemValidation.updateItemValidationSchema),
//   ItemControllers.updateItem
// );

// router.delete('/:id', auth('user'), ItemControllers.deleteItem);

export const PostRoutes = router;
