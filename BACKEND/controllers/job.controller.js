import Job from '../models/job.model.js';
import jobQueue from '../queues/jobQueue.js';
import { generatePresignedUrl } from '../utils/s3.js';

export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const job = await Job.create({
      userId: req.user.userId,
      originalName: req.file.originalname,
      status: 'pending'
    });

    await jobQueue.add('transcode', {
      jobId: job._id.toString(),
      filePath: req.file.path,
      originalName: req.file.originalname
    });

    return res.status(201).json({
      success: true,
      jobId: job._id,
      message: 'File uploaded, conversion started'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    return res.status(200).json({
      success: true,
      job: {
        id: job._id,
        status: job.status,
        originalName: job.originalName,
        createdAt: job.createdAt
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const downloadJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (job.status !== 'done') {
      return res.status(400).json({ message: 'Job not completed yet' });
    }

    const url = await generatePresignedUrl(job.s3Key);

    return res.status(200).json({
      success: true,
      downloadUrl: url
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};