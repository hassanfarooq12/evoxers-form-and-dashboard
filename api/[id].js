// Individual serverless function for /api/:id (GET and DELETE)
import { getSubmissionById, deleteSubmissionById } from '../backend/src/services/submissionService.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const submission = await getSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      res.json(submission);
    } catch (error) {
      console.error('Error fetching submission:', error);
      res.status(500).json({ error: 'Failed to fetch submission' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteSubmissionById(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting submission:', error);
      res.status(500).json({ error: 'Failed to delete submission' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

