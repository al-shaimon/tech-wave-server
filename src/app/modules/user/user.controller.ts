/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { sendNoDataFoundResponse } from '../../utils/responseUtils';
import { AuthServices } from './user.service';
import { sendPasswordResetEmail } from '../../utils/mailservice';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ActivityLog } from '../ActivityLogs/activityLogs.model';

// signup controller

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      email,
      role,
      isVerified,
      password,
      confirmPassword,
      phone,
      profilePhoto,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Password and confirm password do not match',
      });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = await AuthServices.signUp({
      name,
      email,
      role,
      isVerified,
      password,
      confirmPassword,
      phone,
      profilePhoto,
    });

    // Sending response without password
    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: responseUser,
    });
  } catch (error: any) {
    next(error);
  }
};

// signin controller

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await AuthServices.signIn(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendNoDataFoundResponse(res);
    }
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        role: user.role,
      },
      config.jwt_access_secret || '',
      { expiresIn: '30d' }
    );

    // Create activity log
    await ActivityLog.create({
      user: user._id,
      action: 'User logged in',
    });

    // Sending response without password
    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User logged in successfully',
      data: responseUser,
      token,
    });
  } catch (error: any) {
    next(error);
  }
};

// Forget Password
export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await AuthServices.findUserByEmail(email);

    if (!user) {
      return sendNoDataFoundResponse(res);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await AuthServices.setResetToken(
      user._id as string,
      resetToken,
      resetExpires
    );

    // Send the password reset email
    await sendPasswordResetEmail(user.email, token);

    res.status(200).json({
      success: true,
      message: 'Password reset token sent to email!',
    });
  } catch (error: any) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await AuthServices.findUserByResetToken(hashedToken);

    if (!user || user.passwordResetExpires!.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired',
      });
    }

    // Reset password and immediately expire the token
    const hashedPassword = await bcrypt.hash(password, 10);
    await AuthServices.updatePassword(user._id as string, hashedPassword);

    // Ensure the token cannot be used again
    await AuthServices.setResetToken(user._id as string, '', Date.now());

    res.status(200).json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (error: any) {
    next(error);
  }
};

// Update profile

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { name, phone, profilePhoto, isVerified } = req.body;

    const updatedUser = await AuthServices.updateProfile(userId, {
      name,
      phone,
      isVerified,
      profilePhoto,
    });

    if (!updatedUser) {
      return sendNoDataFoundResponse(res);
    }

    // Sending response without password
    const responseUser = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      isVerified: updatedUser.isVerified,
      profilePhoto: updatedUser.profilePhoto,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: responseUser,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateUserAsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { name, phone, role, isDeleted } = req.body;

    const updatedUser = await AuthServices.updateUserByAdmin(userId, {
      name,
      phone,
      role,
      isDeleted,
    });

    if (!updatedUser) {
      return sendNoDataFoundResponse(res);
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await AuthServices.getAllUsers();

    res.status(200).json({
      success: true,
      message: 'All users retrieved successfully',
      data: {
        users,
        count: users.length,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user ? req.user.id : undefined;
  const user = await AuthServices.getSingleUserFromDB(req.params.id, currentUserId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Retrieved Successfully',
    data: user,
  });
});

const followUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const followerId = req.user.id;

  const result = await AuthServices.followUser(userId, followerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User followed successfully',
    data: result,
  });
});

const unfollowUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const followerId = req.user.id;

  const result = await AuthServices.unfollowUser(userId, followerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User unfollowed successfully',
    data: result,
  });
});

const getFollowersAndFollowing = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId || req.user.id;
  const currentUserId = req.user.id;
  const result = await AuthServices.getFollowersAndFollowing(userId, currentUserId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Followers and following retrieved successfully',
    data: result,
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await AuthServices.deleteUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: result,
  });
});

export const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await AuthServices.blockUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User blocked successfully',
    data: result,
  });
});

export const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await AuthServices.unblockUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User unblocked successfully',
    data: result,
  });
});

export const makeAdmin = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await AuthServices.makeAdmin(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User promoted to admin successfully',
    data: result,
  });
});

const deleteUserByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await AuthServices.deleteUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User soft deleted successfully',
    data: result,
  });
});

const demoteAdminToUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await AuthServices.demoteAdminToUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin demoted to user successfully',
    data: result,
  });
});

export const AuthControllers = {
  signup,
  signin,
  forgetPassword,
  resetPassword,
  updateProfile,
  updateUserAsAdmin,
  getAllUsers,
  getSingleUser,
  followUser,
  unfollowUser,
  getFollowersAndFollowing,
  deleteUser,
  blockUser,
  unblockUser,
  makeAdmin,
  deleteUserByAdmin,
  demoteAdminToUser,
};