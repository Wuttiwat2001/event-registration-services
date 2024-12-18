import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.js';
import User from '../models/user.model.js';
import HttpError from '../utils/HttpError.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new HttpError(404, 'User not found'));
    }
    req.user = user;
    next();
  } catch (error) {
    next(new HttpError(401, 'Unauthorized'));
  }
};

const authorizeMiddleware = (roles) => {
  return (req, res, next) => {
    for (let i = 0; i < roles.length; i++) {
      if (req.user.roles.indexOf(roles[i]) >= 0) {
        next();
        return;
      }
    }
    next(new HttpError(403, 'Forbidden'));
  };
};

export {
  authMiddleware,
  authorizeMiddleware
};