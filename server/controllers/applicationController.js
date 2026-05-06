const Application = require('../models/Application');
const Job = require('../models/Job');

console.log('Application model:', Application);
console.log('Job model:', Job);

const applyToJob = async (req, res) => {
  try {
    console.log('APPLY HIT - jobId:', req.params.jobId);
    console.log('APPLY HIT - user:', req.user);

    const { coverLetter } = req.body;
    const jobId = req.params.jobId;

    const foundJob = await Job.findById(jobId);
    console.log('JOB FOUND:', foundJob);

    if (!foundJob) return res.status(404).json({ message: 'Job not found' });

    console.log('CHECKING ALREADY APPLIED...');
    const alreadyApplied = await Application.findOne({
      job: jobId,
      candidate: req.user.userId
    });
    console.log('ALREADY APPLIED:', alreadyApplied);

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.userId,
      coverLetter
    });

    res.status(201).json({ message: 'Application submitted', application });

  } catch (error) {
    console.log('APPLY ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.userId })
      .populate('job', 'title company location');
    res.json(applications);
  } catch (error) {
    console.log('MY APPS ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getApplicationsForJob = async (req, res) => {
  try {
    const foundJob = await Job.findById(req.params.jobId);
    if (!foundJob) return res.status(404).json({ message: 'Job not found' });

    if (foundJob.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email');
    res.json(applications);
  } catch (error) {
    console.log('GET APPS ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Status updated', application });
  } catch (error) {
    console.log('STATUS UPDATE ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { applyToJob, getMyApplications, getApplicationsForJob, updateApplicationStatus };