import express from 'express';
import { verifyAccessToken } from '../middlewares/index.js';
import {
  createAbsent,
  getAllAbsent,
  deleteAbsentById,
  createDetailAbsent,
  getUserAbsent,
  updateAbsentDetailStudent,
  updateDetailAbsentByNoInduk,
} from '../controllers/absent.js';

const route = express.Router();

route.post('/', verifyAccessToken, createAbsent);
route.get('/', verifyAccessToken, getAllAbsent);
route.delete('/:id', verifyAccessToken, deleteAbsentById);

route.post('/detail/:id_absent', verifyAccessToken, createDetailAbsent);
route.get('/detail/:id_absent', getUserAbsent);
route.patch('/detail/:id_absent', verifyAccessToken, updateDetailAbsentByNoInduk);
route.patch('/detail/:id_absent/student', verifyAccessToken, updateAbsentDetailStudent);

export default route;
