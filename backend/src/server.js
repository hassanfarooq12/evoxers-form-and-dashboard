import express from 'express';
import cors from 'cors';
import submissionRoutes from './routes/submissionRoutes.js';

const app = express();
const PORT = 4000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
}));

app.use(express.json());

app.use('/api', submissionRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});


