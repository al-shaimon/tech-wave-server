import { Document } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser extends Document {
  name: string;
  email: string;
  role?: 'user' | 'admin';
  isVerified?: boolean;
  password: string;
  phone?: string;
  profilePhoto?: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TUserRole = keyof typeof USER_ROLE;
