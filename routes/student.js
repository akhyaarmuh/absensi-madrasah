import express from 'express';
import {
  createStudent,
  getAllStudent,
  getStudentById,
  getDetailAbsentStudentById,
  updateStudentById,
  updateStatusById,
  deleteStudentById,
} from '../controllers/student.js';
import { verifyAccessToken } from '../middlewares/index.js';

const route = express.Router();

route.post('/', verifyAccessToken, createStudent);
route.get('/', verifyAccessToken, getAllStudent);
route.get('/:id', verifyAccessToken, getStudentById);
route.get('/:id/absent-detail', verifyAccessToken, getDetailAbsentStudentById);
route.patch('/:id', verifyAccessToken, updateStudentById);
route.patch('/:id/status', verifyAccessToken, updateStatusById);
route.delete('/:id', verifyAccessToken, deleteStudentById);

export default route;
