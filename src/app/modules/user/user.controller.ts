/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { sendNoDataFoundResponse } from '../../utils/responseUtils';
import { AuthServices } from './user.service';
import { sendPasswordResetEmail } from '../../utils/mailservice';

// signup controller

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, role, isVerified, password, confirmPassword, phone } =
      req.body;

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
    });

    // Sending response without password
    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      phone: user.phone,
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
      { id: user._id, role: user.role },
      config.jwt_access_secret || '',
      { expiresIn: '30d' }
    );

    // Sending response without password
    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      phone: user.phone,
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
    const { name, phone } = req.body;

    const updatedUser = await AuthServices.updateProfile(userId, {
      name,
      phone,
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

export const AuthControllers = {
  signup,
  signin,
  forgetPassword,
  resetPassword,
  updateProfile,
  updateUserAsAdmin,
  getAllUsers,
};
