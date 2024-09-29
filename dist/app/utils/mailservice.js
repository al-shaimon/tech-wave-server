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
exports.sendPasswordResetEmail = void 0;
/* eslint-disable no-unused-vars */
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.default.emailUser,
        pass: config_1.default.emailPassword,
    },
});
const sendPasswordResetEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetUrl = `${config_1.default.frontendUrl}/reset-password/${token}`;
    const mailOptions = {
        from: config_1.default.emailUser,
        to: email,
        subject: 'Reset your password within 10 mins!',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>If you didn't request this, please ignore this email.</p>`,
    };
    try {
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        throw new Error('Failed to send password reset email');
    }
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
