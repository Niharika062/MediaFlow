# MediaFlow 🎵

A full-stack video-to-MP3 converter with asynchronous background processing.

## How it works

1. User uploads a video file
2. Job is queued in BullMQ (backed by Redis)
3. Background worker converts video to MP3 using ffmpeg
4. MP3 is stored on AWS S3
5. User downloads via a secure presigned URL

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, BullMQ, Redis, AWS S3, ffmpeg  
**Frontend:** React, Vite, Axios

## Features

- JWT authentication with bcrypt password hashing
- Async job queue with BullMQ + Redis
- ffmpeg-based video to MP3 transcoding
- AWS S3 storage with presigned URL downloads
- Real-time job status polling

## Local Setup

### Backend
```bash
cd BACKEND
npm install
# fill in .env values
npm run dev
npm run worker  # in a separate terminal
```

### Frontend
```bash
cd FRONTEND
npm install
npm run dev
```

## Environment Variables

```env
MONGO_DB_URI=
JWT_SECRET=
PORT=8000
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET=
REDIS_HOST=localhost
REDIS_PORT=6379
```
