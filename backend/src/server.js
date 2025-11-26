import express from 'express';
import cors from 'cors';
import submissionRoutes from './routes/submissionRoutes.js';

const app = express();

// CORS configuration - support both local development and production
// For single Vercel deployment, allow same origin (no CORS needed)
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : process.env.VERCEL 
    ? true // Allow same origin on Vercel
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// Routes - on Vercel, requests come with /api prefix from rewrite
// So we need to handle /api/* paths
// For local dev, we use /api prefix
if (process.env.VERCEL) {
  // On Vercel, requests are rewritten to /api/index.js but keep original path
  // So /api/submit becomes a request to Express with path /api/submit
  app.use('/api', submissionRoutes);
} else {
  app.use('/api', submissionRoutes);
}

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Export the app for Vercel serverless functions
// In local development, we'll still start the server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

export default app;


