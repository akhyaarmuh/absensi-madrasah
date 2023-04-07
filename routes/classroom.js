import express from 'express';
import {
  createClassroom,
  getAllClassroom,
  updateClassroomById,
  deleteClassroomById,
} from '../controllers/classroom.js';
import { verifyAccessToken } from '../middlewares/index.js';

const route = express.Router();

route.post('/', verifyAccessToken, createClassroom);
route.get('/', verifyAccessToken, getAllClassroom);
route.patch('/:id', verifyAccessToken, updateClassroomById);
route.delete('/:id', verifyAccessToken, deleteClassroomById);

export default route;
