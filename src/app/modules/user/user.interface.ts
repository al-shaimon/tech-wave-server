import { Document, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser extends Document {
  name: string;
  email: string;
  role?: 'user' | 'admin';
  isVerified?: boolean;
  password: string;
  phone?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  payments: Types.ObjectId[];
  profilePhoto?: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  isDeleted: boolean;
  isBlocked: boolean;
  posts: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type TUserRole = keyof typeof USER_ROLE;
