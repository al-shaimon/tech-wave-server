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
exports.PaymentServices = exports.PaymentService = void 0;
const user_model_1 = require("../User/user.model");
const payment_model_1 = require("./payment.model");
const stripe_1 = __importDefault(require("../../utils/stripe"));
const uuid_1 = require("uuid");
const VERIFICATION_AMOUNT = 2000; // $20 in cents
const createPaymentIntent = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentIntent = yield stripe_1.default.paymentIntents.create({
        amount: VERIFICATION_AMOUNT,
        currency: 'usd',
        metadata: { userId },
    });
    return { clientSecret: paymentIntent.client_secret };
});
const confirmPayment = (userId, paymentIntentId) => __awaiter(void 0, void 0, void 0, function* () {
    // In a test environment, skip Stripe verification
    if (process.env.NODE_ENV_STRIPE === 'test') {
        const user = yield user_model_1.User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        const payment = yield payment_model_1.Payment.create({
            userId,
            amount: VERIFICATION_AMOUNT / 100, // Convert cents to dollars
            invoiceNumber: (0, uuid_1.v4)(),
            paymentIntentId,
        });
        return { user, payment };
    }
    // For non-test environments, keep the original implementation
    const paymentIntent = yield stripe_1.default.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
    }
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
    if (!user) {
        throw new Error('User not found');
    }
    const payment = yield payment_model_1.Payment.create({
        userId,
        amount: VERIFICATION_AMOUNT / 100, // Convert cents to dollars
        invoiceNumber: (0, uuid_1.v4)(),
        paymentIntentId,
    });
    return { user, payment };
});
const getAllPaymentHistory = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.Payment.find()
        .populate({
        path: 'userId',
        model: 'User',
        select: '-password -passwordResetToken -passwordResetExpires'
    })
        .sort({ createdAt: -1 });
    return result;
});
exports.PaymentService = {
    createPaymentIntent,
    confirmPayment,
};
exports.PaymentServices = {
    getAllPaymentHistory,
};
