const express = require('express');
const router = express.Router();
const { verifyToken, roleGuard } = require('../middleware/auth');
const { getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');

router.get('/',          getAllJobs);                              // public
router.get('/:id',       getJobById);                             // public
router.post('/',         verifyToken, roleGuard('recruiter'), createJob);   // recruiter only
router.put('/:id',       verifyToken, roleGuard('recruiter'), updateJob);   // recruiter only
router.delete('/:id',    verifyToken, roleGuard('recruiter'), deleteJob);   // recruiter only

module.exports = router;