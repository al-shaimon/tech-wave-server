import express from 'express';
import { AuthControllers } from './user.controller';
import validateRequest from '../../middleWares/validateRequest';
import { AuthValidations } from './user.validation';
import authMiddleware from './authMiddleware';
import { adminMiddleware } from './adminMiddleware';

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

router.get('/:id', AuthControllers.getSingleUser);

export const AuthRoutes = router;
