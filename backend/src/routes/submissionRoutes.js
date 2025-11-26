import express from 'express';
import {
  handleCreateSubmission,
  handleGetAllSubmissions,
  handleGetSubmissionById,
  handleDeleteSubmissionById,
} from '../controllers/submissionController.js';

const router = express.Router();

router.post('/submit', handleCreateSubmission);
router.get('/all', handleGetAllSubmissions);
router.get('/:id', handleGetSubmissionById);
router.delete('/:id', handleDeleteSubmissionById);

export default router;


