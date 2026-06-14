import { Worker } from 'bullmq';
import { execa } from 'execa';
import { unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/job.model.js';
import { uploadToS3 } from '../utils/s3.js';

dotenv.config();

// connect to MongoDB
await mongoose.connect(process.env.MONGO_DB_URI);
console.log('Worker MongoDB connected');

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
};

const worker = new Worker('transcodeQueue', async (job) => {
  const { jobId, filePath, originalName } = job.data;

  await Job.findByIdAndUpdate(jobId, { status: 'processing' });

  const outputPath = path.join(os.tmpdir(), `${jobId}.mp3`);

  await execa('ffmpeg', [
    '-i', filePath,
    '-vn',
    '-ar', '44100',
    '-ac', '2',
    '-b:a', '192k',
    outputPath
  ]);

  const s3Key = await uploadToS3(outputPath, jobId);

  await Job.findByIdAndUpdate(jobId, { status: 'done', s3Key });

  await unlink(filePath);
  await unlink(outputPath);

}, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', async (job, err) => {
  console.log(`Job ${job.id} failed:`, err.message);
  await Job.findByIdAndUpdate(job.data.jobId, {
    status: 'failed',
    error: err.message
  });
});

console.log('Worker is running...');