import express from 'express';
import { uploadProfile, deleteProfile } from '../controllers/image.js';
import { verifyAccessToken } from '../middlewares/index.js';
const route = express.Router();

route.post('/upload-profile/:id', verifyAccessToken, uploadProfile);
route.delete('/delete-profile/:id/:model', verifyAccessToken, deleteProfile);

export default route;
