import express from 'express';
import { verifyAccessToken } from '../middlewares/index.js';
import {
  login,
  register,
  verifyPassword,
  refreshToken,
  resetPassword,
  logout,
} from '../controllers/auth.js';

const route = express.Router();

route.post('/login', login);
route.post('/register', register);
route.post('/verify-password', verifyAccessToken, verifyPassword);
route.get('/refresh-token', refreshToken);
route.patch('/reset-password', resetPassword);
route.delete('/logout', verifyAccessToken, logout);

export default route;
