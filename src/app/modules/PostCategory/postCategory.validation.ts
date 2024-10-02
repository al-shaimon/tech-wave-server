import { z } from 'zod';

const createPostCategoryValidationSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
});

const updatePostCategoryValidationSchema = z.object({
  name: z.string().optional(),
});

export const PostCategoryValidation = {
  createPostCategoryValidationSchema,
  updatePostCategoryValidationSchema,
};
