import { User } from './user.model';
import bcrypt from 'bcrypt';

// signup service

const signUp = async (userData: {
  name: string;
  email: string;
  role?: string;
  isVerified?: boolean;
  password: string;
  confirmPassword: string;
  phone: string;
}) => {
  // Check if passwords match
  if (userData.password !== userData.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new User({
    ...userData,
    password: hashedPassword,
    role: userData.role || 'user',
  });

  return await user.save();
};

// signin service

const signIn = async (email: string) => {
  return await User.findOne({ email }).select('+password');
};

// find user by email service
const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

// set reset token service
const setResetToken = async (
  userId: string,
  resetToken: string,
  resetExpires: number,
) => {
  return await User.findByIdAndUpdate(userId, {
    passwordResetToken: resetToken,
    passwordResetExpires: resetExpires,
  });
};

// find user by reset token service
const findUserByResetToken = async (resetToken: string) => {
  return await User.findOne({ passwordResetToken: resetToken });
};

// update password service
const updatePassword = async (userId: string, newPassword: string) => {
  return await User.findByIdAndUpdate(userId, {
    password: newPassword,
    passwordResetToken: undefined,
    passwordResetExpires: undefined,
  });
};

const updateProfile = async (
  userId: string,
  updateData: { name?: string; phone?: string },
) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    { new: true },
  );
};

const updateUserByAdmin = async (
  userId: string,
  updateData: {
    name?: string;
    phone?: string;
    role?: string;
    isDeleted?: boolean;
  },
) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    { new: true },
  );
};

const getAllUsers = async () => {
  return await User.find().select(
    '-password -passwordResetToken -passwordResetExpires',
  );
};

export const AuthServices = {
  signUp,
  signIn,
  findUserByEmail,
  setResetToken,
  findUserByResetToken,
  updatePassword,
  updateProfile,
  updateUserByAdmin,
  getAllUsers,
};
