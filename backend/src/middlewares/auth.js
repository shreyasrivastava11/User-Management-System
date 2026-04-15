import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import env from '../config/env.js';
import { USER_STATUS } from '../utils/constants.js';

export async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authentication required'));
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub);

    if (!user) {
      return next(new AppError(401, 'User no longer exists'));
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      return next(new AppError(403, 'User is inactive'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new AppError(401, 'Invalid or expired token'));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }

    return next();
  };
}
