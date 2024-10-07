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
router.get(
  '/followers-following/:userId?',
  authMiddleware,
  AuthControllers.getFollowersAndFollowing
);

router.get('/:id', optionalAuthMiddleware, AuthControllers.getSingleUser);

router.delete(
  '/admin/users/:userId',
  authMiddleware,
  adminMiddleware,
  AuthControllers.deleteUser
);
router.put(
  '/admin/users/:userId/block',
  authMiddleware,
  adminMiddleware,
  AuthControllers.blockUser
);
router.put(
  '/admin/users/:userId/unblock',
  authMiddleware,
  adminMiddleware,
  AuthControllers.unblockUser
);
router.put(
  '/admin/users/:userId/make-admin',
  authMiddleware,
  adminMiddleware,
  AuthControllers.makeAdmin
);

router.delete(
  '/admin/users/:userId/delete',
  authMiddleware,
  adminMiddleware,
  AuthControllers.deleteUserByAdmin
);

router.put(
  '/admin/users/:userId/demote',
  authMiddleware,
  adminMiddleware,
  AuthControllers.demoteAdminToUser
);

export const AuthRoutes = router;
