import mongoose from 'mongoose';
import { z } from 'zod';

const createPostValidationSchema = z.object({
  content: z.string({
    required_error: 'Post content is required',
  }),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  votes: z.number().optional(),
  comments: z.array(z.string()).optional(),
  category: z
    .string({
      required_error: 'Category is required',
    })
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    }),
  user: z
    .string({
      required_error: 'User is required',
    })
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    }),
  isPaid: z.boolean().optional().default(false),
});

const updatePostValidationSchema = z.object({
  content: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  votes: z.number().optional(),
  comments: z.array(z.string()).optional(),
  category: z
    .string()
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    })
    .optional(),
  user: z
    .string()
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    })
    .optional(),
  isPaid: z.boolean().optional(),
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
