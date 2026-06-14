import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

export default app;