import {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  deleteSubmissionById,
} from '../services/submissionService.js';

export const handleCreateSubmission = async (req, res) => {
  try {
    // Ensure required fields have default values
    const data = {
      ...req.body,
      phone: req.body.phone || null,
      services: req.body.services || '',
      video_usage_platforms: req.body.video_usage_platforms || '',
      web_services: req.body.web_services || '',
      brand_services: req.body.brand_services || '',
    };
    
    console.log('Received submission data:', JSON.stringify(data, null, 2));
    const submission = await createSubmission(data);
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error creating submission:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create submission',
      details: error.message 
    });
  }
};

export const handleGetAllSubmissions = async (_req, res) => {
  try {
    const submissions = await getAllSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const handleGetSubmissionById = async (req, res) => {
  const { id } = req.params;
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
};

export const handleDeleteSubmissionById = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteSubmissionById(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
};


