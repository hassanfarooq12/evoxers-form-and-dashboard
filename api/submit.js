// Individual serverless function for /api/submit
import { createSubmission } from '../backend/src/services/submissionService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = {
      ...req.body,
      phone: req.body.phone || null,
      services: req.body.services || '',
      video_usage_platforms: req.body.video_usage_platforms || '',
      web_services: req.body.web_services || '',
      brand_services: req.body.brand_services || '',
    };
    
    const submission = await createSubmission(data);
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ 
      error: 'Failed to create submission',
      details: error.message 
    });
  }
}

