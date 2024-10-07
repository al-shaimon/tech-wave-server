/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
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
  profilePhoto?: string;
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
  resetExpires: number
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
  updateData: {
    name?: string;
    phone?: string;
    profilePhoto?: string;
    isVerified?: boolean;
  }
) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    { new: true }
  );
};

const updateUserByAdmin = async (
  userId: string,
  updateData: {
    name?: string;
    phone?: string;
    role?: string;
    isDeleted?: boolean;
  }
) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    { new: true }
  );
};

const getAllUsers = async () => {
  return await User.find({ isDeleted: { $ne: true } }).select(
    '-password -passwordResetToken -passwordResetExpires'
  );
};

const getSingleUserFromDB = async (id: string, currentUserId?: string) => {
  const user = await User.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate({
      path: 'posts',
      select: '-__v',
    })
    .populate('followers', 'name email profilePhoto isVerified')
    .populate('following', 'name email profilePhoto isVerified');

  if (!user) {
    throw new Error('User not found');
  }

  const userObject: any = user.toObject();
  userObject.followersCount = user.followers?.length || 0;
  userObject.followingCount = user.following?.length || 0;
  userObject.isFollowing = currentUserId
    ? user.followers.some((f: any) => f._id.toString() === currentUserId)
    : false;

  return userObject;
};

const getFollowersAndFollowing = async (
  userId: string,
  currentUserId: string
) => {
  const user = await User.findById(userId)
    .populate('followers', 'name email profilePhoto isVerified')
    .populate('following', 'name email profilePhoto isVerified');

  if (!user) {
    throw new Error('User not found');
  }

  const followers = user.followers.map((follower: any) => ({
    ...follower.toObject(),
    isFollowing: user.following.some(
      (f: any) => f._id.toString() === follower._id.toString()
    ),
  }));

  const following = user.following.map((followedUser: any) => ({
    ...followedUser.toObject(),
    isFollowing: true,
  }));

  return {
    followers,
    following,
    followersCount: followers.length,
    followingCount: following.length,
    isFollowing: user.followers.some(
      (f: any) => f._id.toString() === currentUserId
    ),
    payments: user.payments,
  };
};

const followUser = async (userId: string, followerId: string) => {
  const user = await User.findById(userId);
  const follower = await User.findById(followerId);

  if (!user || !follower) {
    throw new Error('User not found');
  }

  if (user.followers.includes(new mongoose.Types.ObjectId(followerId))) {
    throw new Error('Already following this user');
  }

  user.followers.push(new mongoose.Types.ObjectId(followerId));
  follower.following.push(new mongoose.Types.ObjectId(userId));

  await user.save();
  await follower.save();

  return { message: 'Successfully followed user' };
};

const unfollowUser = async (userId: string, followerId: string) => {
  const user = await User.findById(userId);
  const follower = await User.findById(followerId);

  if (!user || !follower) {
    throw new Error('User not found');
  }

  if (!user.followers.includes(new mongoose.Types.ObjectId(followerId))) {
    throw new Error('Not following this user');
  }

  user.followers = user.followers.filter((id) => id.toString() !== followerId);
  follower.following = follower.following.filter(
    (id) => id.toString() !== userId
  );

  await user.save();
  await follower.save();

  return { message: 'Successfully unfollowed user' };
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
  getSingleUserFromDB,
  getFollowersAndFollowing,
  followUser,
  unfollowUser,
  deleteUser: async (userId: string) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully', user };
  },
  blockUser: async (userId: string) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'User blocked successfully', user };
  },
  unblockUser: async (userId: string) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'User unblocked successfully', user };
  },
  makeAdmin: async (userId: string) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'User promoted to admin successfully', user };
  },
  deleteUserByAdmin: async (userId: string) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  },
  demoteAdminToUser: async (userId: string) => {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'user' },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'Admin demoted to user successfully', user };
  },
};
