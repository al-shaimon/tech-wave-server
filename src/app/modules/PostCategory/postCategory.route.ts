import express from 'express';
import { PostCategoryControllers } from './postCategory.controller';
import { PostCategoryValidation } from './postCategory.validation';
import auth from '../../middleWares/auth';
import validateRequest from '../../middleWares/validateRequest';

const router = express.Router();

router.get('/', PostCategoryControllers.getAllPostCategories);

router.get('/:id', PostCategoryControllers.getPostCategoryById);

router.post(
  '/',
  auth('admin'),
  validateRequest(PostCategoryValidation.createPostCategoryValidationSchema),
  PostCategoryControllers.createPostCategory
);

router.put(
  '/:id',
  auth('admin'),
  validateRequest(PostCategoryValidation.updatePostCategoryValidationSchema),
  PostCategoryControllers.updatePostCategory
);

router.delete(
  '/:id',
  auth('admin'),
  PostCategoryControllers.deletePostCategory
);

export const PostCategoryRoutes = router;
