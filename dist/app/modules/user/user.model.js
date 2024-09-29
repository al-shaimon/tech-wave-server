"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    password: { type: String, required: true, select: 0 },
    phone: { type: String },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
