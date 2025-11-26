// Vercel serverless function entry point for API
// This file handles all /api/* routes
import app from '../backend/src/server.js';

// Export Express app directly - Vercel supports this
export default app;

