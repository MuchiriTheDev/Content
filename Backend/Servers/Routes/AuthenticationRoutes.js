// Authentication routes (login, register)
// routes/auth.js
import express from 'express';
import { forgotPassword, getUserProfile, loginUser, registerUser, resetPassword, verifyEmail } from '../Controllers/AuthenticationController.js';
import authMiddleware from '../Middlewares/Authenticator.js';
const AuthRouter = express.Router();

// Public Routes
AuthRouter.post('/register', registerUser);
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// Payload: { firstName, lastName, email, password, phoneNumber, country, platforms }

AuthRouter.post('/login', loginUser);
// @desc    Login user and return JWT
// @route   POST /api/auth/login
// @access  Public
// Payload: { email, password }

AuthRouter.get('/verify/:token', verifyEmail);
// @desc    Verify user email with token
// @route   GET /api/auth/verify/:token
// @access  Public

AuthRouter.post('/forgot-password', forgotPassword);
// @desc    Request password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
// Payload: { email }

AuthRouter.post('/reset-password/:token', resetPassword);
// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
// Payload: { password }

// Protected Routes (require JWT authentication)
AuthRouter.get('/me', authMiddleware, getUserProfile);
// @desc    Get current user's profile
// @route   GET /api/auth/me
// @access  Private
// Headers: Authorization: Bearer <token>

export default AuthRouter;