// Vercel serverless function entry point for API
// This file handles all /api/* routes
import app from '../backend/src/server.js';

// Export as Vercel serverless function handler
export default function handler(req, res) {
  return app(req, res);
}

