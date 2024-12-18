import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.js';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' }); 
}

export default generateToken;