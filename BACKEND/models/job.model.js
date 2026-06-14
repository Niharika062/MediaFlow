import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'done', 'failed'],
    default: 'pending'
  },
  s3Key: {
    type: String,
    default: null
  },
  error: {
    type: String,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);