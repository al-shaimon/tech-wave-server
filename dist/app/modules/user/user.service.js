"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
// signup service
const signUp = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if passwords match
    if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
    }
    const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
    const user = new user_model_1.User(Object.assign(Object.assign({}, userData), { password: hashedPassword, role: userData.role || 'user' }));
    return yield user.save();
});
// signin service
const signIn = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOne({ email }).select('+password');
});
// find user by email service
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOne({ email });
});
// set reset token service
const setResetToken = (userId, resetToken, resetExpires) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndUpdate(userId, {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
    });
});
// find user by reset token service
const findUserByResetToken = (resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOne({ passwordResetToken: resetToken });
});
// update password service
const updatePassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndUpdate(userId, {
        password: newPassword,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
    });
});
const updateProfile = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndUpdate(userId, {
        $set: updateData,
    }, { new: true });
});
const updateUserByAdmin = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndUpdate(userId, {
        $set: updateData,
    }, { new: true });
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.find({ isDeleted: { $ne: true } }).select('-password -passwordResetToken -passwordResetExpires');
});
const getSingleUserFromDB = (id, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_model_1.User.findOne({ _id: id, isDeleted: { $ne: true } })
        .populate({
        path: 'posts',
        select: '-__v',
    })
        .populate('followers', 'name email profilePhoto isVerified')
        .populate('following', 'name email profilePhoto isVerified');
    if (!user) {
        throw new Error('User not found');
    }
    const userObject = user.toObject();
    userObject.followersCount = ((_a = user.followers) === null || _a === void 0 ? void 0 : _a.length) || 0;
    userObject.followingCount = ((_b = user.following) === null || _b === void 0 ? void 0 : _b.length) || 0;
    userObject.isFollowing = currentUserId
        ? user.followers.some((f) => f._id.toString() === currentUserId)
        : false;
    return userObject;
});
const getFollowersAndFollowing = (userId, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId)
        .populate('followers', 'name email profilePhoto isVerified')
        .populate('following', 'name email profilePhoto isVerified');
    if (!user) {
        throw new Error('User not found');
    }
    const followers = user.followers.map((follower) => (Object.assign(Object.assign({}, follower.toObject()), { isFollowing: user.following.some((f) => f._id.toString() === follower._id.toString()) })));
    const following = user.following.map((followedUser) => (Object.assign(Object.assign({}, followedUser.toObject()), { isFollowing: true })));
    return {
        followers,
        following,
        followersCount: followers.length,
        followingCount: following.length,
        isFollowing: user.followers.some((f) => f._id.toString() === currentUserId),
    };
});
const followUser = (userId, followerId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    const follower = yield user_model_1.User.findById(followerId);
    if (!user || !follower) {
        throw new Error('User not found');
    }
    if (user.followers.includes(new mongoose_1.default.Types.ObjectId(followerId))) {
        throw new Error('Already following this user');
    }
    user.followers.push(new mongoose_1.default.Types.ObjectId(followerId));
    follower.following.push(new mongoose_1.default.Types.ObjectId(userId));
    yield user.save();
    yield follower.save();
    return { message: 'Successfully followed user' };
});
const unfollowUser = (userId, followerId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    const follower = yield user_model_1.User.findById(followerId);
    if (!user || !follower) {
        throw new Error('User not found');
    }
    if (!user.followers.includes(new mongoose_1.default.Types.ObjectId(followerId))) {
        throw new Error('Not following this user');
    }
    user.followers = user.followers.filter(id => id.toString() !== followerId);
    follower.following = follower.following.filter(id => id.toString() !== userId);
    yield user.save();
    yield follower.save();
    return { message: 'Successfully unfollowed user' };
});
exports.AuthServices = {
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
    deleteUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return { message: 'User deleted successfully', user };
    }),
    blockUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return { message: 'User blocked successfully', user };
    }),
    unblockUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return { message: 'User unblocked successfully', user };
    }),
    makeAdmin: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return { message: 'User promoted to admin successfully', user };
    }),
    deleteUserByAdmin: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return { message: 'User deleted successfully' };
    }),
    demoteAdminToUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.User.findByIdAndUpdate(userId, { role: 'user' }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return { message: 'Admin demoted to user successfully', user };
    }),
};
