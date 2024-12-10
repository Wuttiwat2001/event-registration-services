import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.js';
import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};


const authorizeMiddleware = (roles) => {
  return (req, res, next) => {
    for (let i = 0; i < roles.length; i++) {
      if (req.user.roles.indexOf(roles[i]) >= 0) {
        next()
        return
      }
    }
    res.status(403).json({ message: 'Forbidden' });
  }
}


export {
  authMiddleware,
  authorizeMiddleware
}