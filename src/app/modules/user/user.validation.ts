import { z } from 'zod';

const userValidationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).optional(),
  isVerified: z.boolean().optional(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  phone: z.string().optional(),
  profilePhoto: z.string().optional(),
  followers: z.array(z.string()).optional(),
  following: z.array(z.string()).optional(),
});

const forgetPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  profilePhoto: z.string().optional(),
  isVerified: z.boolean().optional(),
});

const updateUserAsAdminSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
  isDeleted: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
});

export const AuthValidations = {
  userValidationSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  updateUserAsAdminSchema,
};
