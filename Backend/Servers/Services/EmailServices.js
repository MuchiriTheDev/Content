// Email notifications (e.g., claim approval)
// services/emailService.js
import nodemailer from 'nodemailer';
import config from '../config/config.js';
import logger from '../Utilities/Logger.js';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: config.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: config.EMAIL_USER, // Your email address
    pass: config.EMAIL_PASS  // Your email password or app-specific password
  },
  pool: true, // Use connection pooling for efficiency
  maxConnections: 5, // Limit concurrent connections
  maxMessages: 100 // Limit messages per connection
});

// Verify transporter setup on initialization
transporter.verify((error, success) => {
  if (error) {
    logger.error(`Email transporter verification failed: ${error.message}`);
  } else {
    logger.info('Email transporter ready');
  }
});

// Send email function
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Validate input
    if (!to || !subject || (!text && !html)) {
      throw new Error('Missing required email fields: to, subject, and text or html');
    }

    // Email options
    const mailOptions = {
      from: `"CCI Support" <${config.EMAIL_USER}>`, // Sender address
      to, // Recipient
      subject, // Subject line
      text, // Plain text body
      html // HTML body (optional)
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    throw error; // Let the caller handle the error
  }
};

// Example: Send verification email
export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:${config.PORT}/api/auth/verify/${token}`;
  const subject = 'Verify Your CCI Account';
  const text = `Please verify your account by clicking this link: ${verificationLink}`;
  const html = `
    <h2>Welcome to CCI!</h2>
    <p>Please verify your account by clicking the link below:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link expires in 24 hours.</p>
  `;

  return sendEmail({ to: email, subject, text, html });
};

// Example: Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `http://localhost:${config.PORT}/api/auth/reset-password/${token}`;
  const subject = 'Reset Your CCI Password';
  const text = `Click here to reset your password: ${resetLink}`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Click the link below to proceed:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link expires in 1 hour.</p>
  `;

  return sendEmail({ to: email, subject, text, html });
};

export default sendEmail;