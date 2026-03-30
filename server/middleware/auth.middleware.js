import { verifyAccessToken } from '../utils/generateToken.js';
import User from '../models/User.model.js';
import { errorResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Not authorized. No token provided.', 401);
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Get user from DB
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) {
      return errorResponse(res, 'Not authorized. User not found.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired. Please refresh.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token.', 401);
    }
    return errorResponse(res, 'Not authorized.', 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Not authorized for this action.', 403);
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    }
  } catch (error) {
    // Token invalid or expired, continue without auth
  }
  next();
};
