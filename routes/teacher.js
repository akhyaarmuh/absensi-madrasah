import express from 'express';
import {
  createTeacher,
  getAllTeacher,
  getTeacherById,
  updateTeacherById,
  updateStatusById,
  deleteTeacherById,
} from '../controllers/teacher.js';
import { verifyAccessToken } from '../middlewares/index.js';

const route = express.Router();

route.post('/', verifyAccessToken, createTeacher);
route.get('/', verifyAccessToken, getAllTeacher);
route.get('/:id', verifyAccessToken, getTeacherById);
route.patch('/:id', verifyAccessToken, updateTeacherById);
route.patch('/:id/status', verifyAccessToken, updateStatusById);
route.delete('/:id', verifyAccessToken, deleteTeacherById);

export default route;
