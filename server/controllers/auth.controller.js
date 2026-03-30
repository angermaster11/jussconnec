import crypto from 'crypto';
import User from '../models/User.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/generateToken.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/sendEmail.js';

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return errorResponse(res, `This ${field} is already registered.`, 400);
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      username,
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email (non-blocking)
    sendVerificationEmail(email, verificationToken).catch(console.error);

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    delete userObj.verificationToken;

    return successResponse(
      res,
      { user: userObj, accessToken },
      'Registration successful. Please verify your email.',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshTokenCookie(res, refreshToken);

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    delete userObj.verificationToken;

    return successResponse(res, { user: userObj, accessToken }, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    // Clear refresh token in DB
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });

    clearRefreshTokenCookie(res);

    return successResponse(res, null, 'Logged out successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return errorResponse(res, 'No refresh token provided.', 401);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Find user with matching refresh token
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return errorResponse(res, 'Invalid refresh token.', 401);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    setRefreshTokenCookie(res, newRefreshToken);

    return successResponse(res, { accessToken: newAccessToken }, 'Token refreshed.');
  } catch (error) {
    clearRefreshTokenCookie(res);
    return errorResponse(res, 'Invalid or expired refresh token.', 401);
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 'Invalid or expired verification token.', 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, null, 'Email verified successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return successResponse(res, null, 'If the email exists, a reset link has been sent.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    sendPasswordResetEmail(email, resetToken).catch(console.error);

    return successResponse(res, null, 'If the email exists, a reset link has been sent.');
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 'Invalid or expired reset token.', 400);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    user.refreshToken = '';
    await user.save();

    return successResponse(res, null, 'Password reset successful. Please log in.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, { user }, 'Current user fetched.');
  } catch (error) {
    next(error);
  }
};
