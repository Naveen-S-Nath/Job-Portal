const express = require('express');
const router = express.Router();
const { verifyToken, roleGuard } = require('../middleware/auth');
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus
} = require('../controllers/applicationController');

// IMPORTANT: /my must come before /:jobId routes
// otherwise Express reads "my" as a jobId parameter
router.get('/my', verifyToken, roleGuard('candidate'), getMyApplications);

router.post('/:jobId/apply', verifyToken, roleGuard('candidate'), applyToJob);
router.get('/:jobId/applications', verifyToken, roleGuard('recruiter'), getApplicationsForJob);
router.put('/:id/status', verifyToken, roleGuard('recruiter'), updateApplicationStatus);

module.exports = router;