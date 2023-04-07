import express from 'express';
import {
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  updateStatusdById,
  updatePasswordById,
  deleteUserById,
} from '../controllers/user.js';
import { verifyAccessToken } from '../middlewares/index.js';

const route = express.Router();

route.post('/', verifyAccessToken, createUser);
route.get('/', verifyAccessToken, getAllUser);
route.get('/:id', verifyAccessToken, getUserById);
route.patch('/:id', verifyAccessToken, updateUserById);
route.patch('/:id/status', verifyAccessToken, updateStatusdById);
route.patch('/:id/password', verifyAccessToken, updatePasswordById);
route.delete('/:id', verifyAccessToken, deleteUserById);

export default route;
