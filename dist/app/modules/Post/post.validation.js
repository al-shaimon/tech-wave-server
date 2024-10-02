"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const createPostValidationSchema = zod_1.z.object({
    content: zod_1.z.string({
        required_error: 'Post content is required',
    }),
    images: zod_1.z.array(zod_1.z.string().url()).optional(),
    // images: z.string().optional(),
    // videos: z.string().optional(),
    videos: zod_1.z.array(zod_1.z.string().url()).optional(),
    votes: zod_1.z.number().optional(),
    comments: zod_1.z.array(zod_1.z.string()).optional(),
    category: zod_1.z
        .string({
        required_error: 'Category is required',
    })
        .refine((val) => {
        return mongoose_1.default.Types.ObjectId.isValid(val);
    }),
    user: zod_1.z
        .string({
        required_error: 'User is required',
    })
        .refine((val) => {
        return mongoose_1.default.Types.ObjectId.isValid(val);
    }),
});
const updatePostValidationSchema = zod_1.z.object({
    content: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string().url()).optional(),
    // images: z.string().optional(),
    // videos: z.string().optional(),
    videos: zod_1.z.array(zod_1.z.string().url()).optional(),
    votes: zod_1.z.number().optional(),
    comments: zod_1.z.array(zod_1.z.string()).optional(),
    category: zod_1.z
        .string()
        .refine((val) => {
        return mongoose_1.default.Types.ObjectId.isValid(val);
    })
        .optional(),
    user: zod_1.z
        .string()
        .refine((val) => {
        return mongoose_1.default.Types.ObjectId.isValid(val);
    })
        .optional(),
});
exports.PostValidation = {
    createPostValidationSchema,
    updatePostValidationSchema,
};
