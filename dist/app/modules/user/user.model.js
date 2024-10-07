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
    phone: { type: String, default: '' },
    followers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    profilePhoto: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' }],
    payments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Payment' }],
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
