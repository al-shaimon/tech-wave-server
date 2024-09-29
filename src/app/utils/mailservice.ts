/* eslint-disable no-unused-vars */
import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${config.frontendUrl}/reset-password/${token}`;
  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: 'Reset your password within 10 mins!',
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <a href="${resetUrl}">${resetUrl}</a>
           <p>If you didn't request this, please ignore this email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send password reset email');
  }
};
