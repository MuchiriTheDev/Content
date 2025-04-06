// Auth logic (e.g., JWT generation)
// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Placeholder for email service
import User from '../Models/User.js';
import { config } from 'winston';
import { sendPasswordResetEmail, sendVerificationEmail } from '../Services/EmailServices.js';
import logger from '../Utilities/Logger.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      country
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !country ) {
      return res.status(400).json({ success: false, error: 'All required fields must be provided' });
    }

    // Check if user already exists
    let user = await User.findOne({ 'personalInfo.email': email });
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create new user
    user = new User({
      personalInfo: { firstName, lastName, email, phoneNumber, country },
      platformInfo: { platforms: [] }, // Default empty, updated later
      financialInfo: {}, // Default empty, updated later
      auth: { password }
    });

    await user.save();

    // Send verification email (placeholder)
    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const verificationLink = `http://localhost:${config.PORT}/api/auth/verify/${verificationToken}`;
    await sendVerificationEmail(email, verificationToken);;

    logger.info(`User registered: ${email}`);
    res.status(201).json({
      success: true,
      message: 'User registered. Please verify your email.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Find user and select password (hidden by default)
    const user = await User.findOne({ 'personalInfo.email': email }).select('+auth.password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    console.log(process.env.JWT_SECRET);
    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    // Check if verified
    if (!user.isVerified) {
      await sendVerificationEmail(email, token);;
      return res.status(403).json({ success: false, error: 'Please verify your email first' });
      
    }


    logger.info(`User logged in: ${email}`);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.personalInfo.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: 'Email already verified' });
    }

    // Update verification status
    user.isVerified = true;
    await user.save();

    logger.info(`Email verified for: ${user.personalInfo.email}`);
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const user = await User.findOne({ 'personalInfo.email': email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.auth.resetPasswordToken = resetToken;
    user.auth.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetLink = `http://localhost:${config.PORT}/api/auth/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetToken);

    logger.info(`Password reset requested for: ${email}`);
    res.json({ success: true, message: 'Password reset link sent to email' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, error: 'New password is required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+auth.password');

    if (!user || user.auth.resetPasswordToken !== token || user.auth.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
    }

    // Update password
    user.auth.password = password;
    user.auth.resetPasswordToken = undefined;
    user.auth.resetPasswordExpire = undefined;
    await user.save();

    logger.info(`Password reset for: ${user.personalInfo.email}`);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private (requires JWT)
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // req.user set by auth middleware
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        personalInfo: user.personalInfo,
        platformInfo: user.platformInfo,
        financialInfo: user.financialInfo,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
}; 