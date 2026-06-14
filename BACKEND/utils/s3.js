import dotenv from 'dotenv';

dotenv.config();

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createReadStream } from 'fs';
import path from 'path';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

console.log("Region:", process.env.AWS_REGION);
console.log("Bucket:", process.env.S3_BUCKET);
console.log("Access key exists:", !!process.env.AWS_ACCESS_KEY_ID);
console.log("Secret key exists:", !!process.env.AWS_SECRET_ACCESS_KEY);

export const uploadToS3 = async (filePath, jobId) => {
  const fileStream = createReadStream(filePath);
  const s3Key = `conversions/${jobId}.mp3`;

  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: fileStream,
    ContentType: 'audio/mpeg'
  }));

  return s3Key;
};

export const generatePresignedUrl = async (s3Key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};