import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';
import { uploadVideo, getJobStatus, downloadJob } from '../controllers/job.controller.js';

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('video'), uploadVideo);
router.get('/:id/status', authMiddleware, getJobStatus);
router.get('/:id/download', authMiddleware, downloadJob);

export default router;