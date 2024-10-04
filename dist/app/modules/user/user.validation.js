"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['user', 'admin']).optional(),
    isVerified: zod_1.z.boolean().optional(),
    password: zod_1.z.string().min(6),
    confirmPassword: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional(),
    profilePhoto: zod_1.z.string().optional(),
    followers: zod_1.z.array(zod_1.z.string()).optional(),
    following: zod_1.z.array(zod_1.z.string()).optional(),
});
const forgetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const resetPasswordSchema = zod_1.z.object({
    password: zod_1.z.string().min(6),
    confirmPassword: zod_1.z.string().min(6),
});
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    profilePhoto: zod_1.z.string().optional(),
    isVerified: zod_1.z.boolean().optional(),
});
const updateUserAsAdminSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.enum(['user', 'admin']).optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.AuthValidations = {
    userValidationSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
    updateProfileSchema,
    updateUserAsAdminSchema,
};
