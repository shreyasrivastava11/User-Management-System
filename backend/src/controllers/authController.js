import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import env from '../config/env.js';
import { signAccessToken } from '../services/authService.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError(401, 'Invalid credentials');
  }

  if (user.status !== 'active') {
    throw new AppError(403, 'User is inactive');
  }

  const token = signAccessToken(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    env.jwtExpiresIn
  );

  return res.status(200).json({
    token,
    user: user.toSafeObject()
  });
});

export const me = asyncHandler(async (req, res) => {
  return res.status(200).json({ user: req.user.toSafeObject() });
});
