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
exports.AuthControllers = exports.getSingleUser = exports.getAllUsers = exports.updateUserAsAdmin = exports.updateProfile = exports.resetPassword = exports.forgetPassword = exports.signin = exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const responseUtils_1 = require("../../utils/responseUtils");
const user_service_1 = require("./user.service");
const mailservice_1 = require("../../utils/mailservice");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
// signup controller
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, role, isVerified, password, confirmPassword, phone, profilePhoto, } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Password and confirm password do not match',
            });
        }
        // const hashedPassword = await bcrypt.hash(password, 10);
        const user = yield user_service_1.AuthServices.signUp({
            name,
            email,
            role,
            isVerified,
            password,
            confirmPassword,
            phone,
            profilePhoto,
        });
        // Sending response without password
        const responseUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            phone: user.phone,
            profilePhoto: user.profilePhoto,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'User registered successfully',
            data: responseUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
// signin controller
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_service_1.AuthServices.signIn(email);
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return (0, responseUtils_1.sendNoDataFoundResponse)(res);
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            phone: user.phone,
            profilePhoto: user.profilePhoto,
            role: user.role,
        }, config_1.default.jwt_access_secret || '', { expiresIn: '30d' });
        // Sending response without password
        const responseUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            phone: user.phone,
            profilePhoto: user.profilePhoto,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User logged in successfully',
            data: responseUser,
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signin = signin;
// Forget Password
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_service_1.AuthServices.findUserByEmail(email);
        if (!user) {
            return (0, responseUtils_1.sendNoDataFoundResponse)(res);
        }
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const resetToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const resetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        yield user_service_1.AuthServices.setResetToken(user._id, resetToken, resetExpires);
        // Send the password reset email
        yield (0, mailservice_1.sendPasswordResetEmail)(user.email, token);
        res.status(200).json({
            success: true,
            message: 'Password reset token sent to email!',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.forgetPassword = forgetPassword;
// Reset Password
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = yield user_service_1.AuthServices.findUserByResetToken(hashedToken);
        if (!user || user.passwordResetExpires.getTime() < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Token is invalid or has expired',
            });
        }
        // Reset password and immediately expire the token
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield user_service_1.AuthServices.updatePassword(user._id, hashedPassword);
        // Ensure the token cannot be used again
        yield user_service_1.AuthServices.setResetToken(user._id, '', Date.now());
        res.status(200).json({
            success: true,
            message: 'Password updated successfully!',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
// Update profile
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { name, phone, profilePhoto, isVerified } = req.body;
        const updatedUser = yield user_service_1.AuthServices.updateProfile(userId, {
            name,
            phone,
            isVerified,
            profilePhoto,
        });
        if (!updatedUser) {
            return (0, responseUtils_1.sendNoDataFoundResponse)(res);
        }
        // Sending response without password
        const responseUser = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            isVerified: updatedUser.isVerified,
            profilePhoto: updatedUser.profilePhoto,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: responseUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProfile = updateProfile;
const updateUserAsAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { name, phone, role, isDeleted } = req.body;
        const updatedUser = yield user_service_1.AuthServices.updateUserByAdmin(userId, {
            name,
            phone,
            role,
            isDeleted,
        });
        if (!updatedUser) {
            return (0, responseUtils_1.sendNoDataFoundResponse)(res);
        }
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserAsAdmin = updateUserAsAdmin;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_service_1.AuthServices.getAllUsers();
        res.status(200).json({
            success: true,
            message: 'All users retrieved successfully',
            data: {
                users,
                count: users.length,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
exports.getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.AuthServices.getSingleUserFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User Retrieved Successfully',
        data: user,
    });
}));
exports.AuthControllers = {
    signup: exports.signup,
    signin: exports.signin,
    forgetPassword: exports.forgetPassword,
    resetPassword: exports.resetPassword,
    updateProfile: exports.updateProfile,
    updateUserAsAdmin: exports.updateUserAsAdmin,
    getAllUsers: exports.getAllUsers,
    getSingleUser: exports.getSingleUser,
};
