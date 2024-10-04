import express from 'express';
import { AuthControllers } from './user.controller';
import validateRequest from '../../middleWares/validateRequest';
import { AuthValidations } from './user.validation';
import authMiddleware from './authMiddleware';
import { adminMiddleware } from './adminMiddleware';
import optionalAuthMiddleware from './optionalAuthMiddleware';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(AuthValidations.userValidationSchema),
  AuthControllers.signup
);
router.post('/signin', AuthControllers.signin);
router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordSchema),
  AuthControllers.forgetPassword
);
router.post(
  '/reset-password/:token',
  validateRequest(AuthValidations.resetPasswordSchema),
  AuthControllers.resetPassword
);

router.post(
  '/update-profile',
  authMiddleware,
  validateRequest(AuthValidations.updateProfileSchema),
  AuthControllers.updateProfile
);

router.put(
  '/admin/users/:userId',
  authMiddleware,
  adminMiddleware,
  validateRequest(AuthValidations.updateUserAsAdminSchema),
  AuthControllers.updateUserAsAdmin
);

router.get(
  '/admin/users',
  authMiddleware,
  adminMiddleware,
  AuthControllers.getAllUsers
);

router.post('/follow/:userId', authMiddleware, AuthControllers.followUser);
router.post('/unfollow/:userId', authMiddleware, AuthControllers.unfollowUser);
router.get('/followers-following/:userId?', authMiddleware, AuthControllers.getFollowersAndFollowing);

router.get('/:id', optionalAuthMiddleware, AuthControllers.getSingleUser);

export const AuthRoutes = router;
